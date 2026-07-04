#!/usr/bin/env tsx
/**
 * One-time backfill: 18 long-form (roughly double-length) evergreen articles,
 * each dated to a specific historical day that had zero or only one post —
 * smoothing out the lopsided posting history (61 of 76 days had exactly one
 * post while a handful had 5-14 from earlier seed bursts) and filling the
 * three real zero-post days (2026-06-20/22/23, the outage window fixed by the
 * generate.ts retry-backoff work).
 *
 * Each entry uses the same generateForTopic() path as scripts/seed.ts (real
 * Brave-search research + a real LLM author), just with `targetWords` /
 * `minBodyChars` set so the body comes out roughly double the site's usual
 * ~5,900-char median instead of the standard length. Topics are pulled from
 * scripts/seed-topics.ts's pending list, so nothing here is already covered.
 *
 * NEVER commits via Octokit: posts are written to content/posts/ and the local
 * content/.topic-log.json is updated, exactly like seed.ts. The companion
 * workflow (.github/workflows/backfill-articles.yml) commits the result.
 * Idempotent — an item whose signature is already in the log is skipped, so a
 * partial/interrupted run can simply be re-dispatched.
 *
 * Requires the writer LLM key (`llm.apiKeyEnv` in site.config.ts) and
 * BRAVE_API_KEY (these topics have no source URL, so research relies on web
 * search). PEXELS_API_KEY is optional (hero images).
 *
 * Usage:
 *   npx tsx scripts/backfill-articles.ts         # run the whole batch
 *   npx tsx scripts/backfill-articles.ts --dry   # research+write the first item, write nothing
 */
import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { generateForTopic } from '../src/lib/orchestrator/pipeline';
import { signature } from '../src/lib/orchestrator/score';
import type { TopicLog } from '../src/lib/orchestrator/types';
import { siteConfig } from '../src/site.config';

const LOG_PATH = path.join(process.cwd(), 'content', '.topic-log.json');
const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');

// Long-form target: the site's body currently runs ~5,900 chars / ~1,000-1,100
// words at the median. Aim the prompt at roughly double that, and enforce a
// floor well above standard (but below the exact target, since LLM word counts
// vary) so a short response is rejected and retried rather than shipped.
const TARGET_WORDS = 2200;
const MIN_BODY_CHARS = 9000;

const DELAY_MS = 2000;

interface BackfillItem {
  topic: string;
  date: string; // ISO
}

// Chronological. Each date is a day that had 0 or 1 posts in the published
// history (computed from content/posts/*.mdx frontmatter on 2026-07-04); the
// three 06-20/06-22/06-23 entries are the real zero-post outage days.
const BACKFILL_ITEMS: BackfillItem[] = [
  { topic: 'What is the Sun made of and how does it produce energy', date: '2026-06-03T12:00:00.000Z' },
  { topic: 'How meteor showers happen and the best ones to watch', date: '2026-06-04T12:00:00.000Z' },
  { topic: "Saturn's rings: what they are made of and how they formed", date: '2026-06-05T12:00:00.000Z' },
  { topic: 'What happens when a massive star explodes as a supernova', date: '2026-06-06T12:00:00.000Z' },
  { topic: 'Pulsars: the cosmic lighthouses of the universe', date: '2026-06-07T12:00:00.000Z' },
  { topic: 'What is a black hole and how do they form', date: '2026-06-08T12:00:00.000Z' },
  { topic: 'Gravitational waves and how LIGO detects them', date: '2026-06-09T12:00:00.000Z' },
  { topic: 'The Milky Way: our home galaxy explained', date: '2026-06-10T12:00:00.000Z' },
  { topic: 'What is dark matter and why do we think it exists', date: '2026-06-11T12:00:00.000Z' },
  { topic: 'The Big Bang theory and the origin of the universe', date: '2026-06-12T12:00:00.000Z' },
  { topic: 'What are exoplanets and how do we find them', date: '2026-06-13T12:00:00.000Z' },
  { topic: 'The Fermi paradox: where is everybody', date: '2026-06-15T12:00:00.000Z' },
  { topic: 'How the James Webb Space Telescope sees the early universe', date: '2026-06-16T12:00:00.000Z' },
  { topic: 'How telescopes work: refractors versus reflectors', date: '2026-06-17T12:00:00.000Z' },
  { topic: 'Starship and the goal of fully reusable spaceflight', date: '2026-06-19T12:00:00.000Z' },
  { topic: "NASA's Artemis program and the return to the Moon", date: '2026-06-20T12:00:00.000Z' },
  { topic: 'The International Space Station and life in microgravity', date: '2026-06-22T12:00:00.000Z' },
  { topic: 'How to start stargazing without a telescope', date: '2026-06-23T12:00:00.000Z' },
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function loadLocalLog(): Promise<TopicLog> {
  try {
    return JSON.parse(await fs.readFile(LOG_PATH, 'utf8')) as TopicLog;
  } catch {
    return { topics: [] };
  }
}

async function saveLocalLog(log: TopicLog): Promise<void> {
  await fs.mkdir(path.dirname(LOG_PATH), { recursive: true });
  await fs.writeFile(LOG_PATH, JSON.stringify(log, null, 2), 'utf8');
}

async function main() {
  const dryRun = process.argv.includes('--dry');

  const llmKeyEnv = siteConfig.llm.apiKeyEnv;
  if (!process.env[llmKeyEnv]?.trim()) {
    console.error(`✗ ${llmKeyEnv} is not set — it's required to write posts. See .env.example.`);
    process.exit(1);
  }
  if (!process.env.BRAVE_API_KEY?.trim()) {
    console.error(
      '✗ BRAVE_API_KEY is not set. These topics have no source URL of their own, ' +
        'so without web search there is nothing to research — every item would be skipped.'
    );
    process.exit(1);
  }

  let log = await loadLocalLog();
  const covered = new Set(log.topics.map((t) => t.signature));
  const queue = BACKFILL_ITEMS.filter((item) => !covered.has(signature(item.topic)));

  console.log(
    `→ ${BACKFILL_ITEMS.length} items in batch, ${queue.length} not yet covered.\n` +
      `→ Long-form target: ~${TARGET_WORDS} words, ${MIN_BODY_CHARS}+ body chars.\n` +
      `→ ${dryRun ? 'DRY RUN (1 item, nothing written)' : `generating ${queue.length}`}…\n`
  );

  if (dryRun) {
    const item = queue[0] ?? BACKFILL_ITEMS[0];
    console.log(`Topic: ${item.topic}\nDate: ${item.date}\n`);
    const res = await generateForTopic(item.topic, {
      dryRun: true,
      date: new Date(item.date),
      targetWords: TARGET_WORDS,
      minBodyChars: MIN_BODY_CHARS,
    });
    console.log(JSON.stringify({ ...res, mdx: res.mdx ? `[${res.mdx.length} bytes]` : undefined }, null, 2));
    if (res.mdx) {
      console.log('\n─── MDX preview (first 2000 chars) ───');
      console.log(res.mdx.slice(0, 2000));
    }
    return;
  }

  await fs.mkdir(POSTS_DIR, { recursive: true });
  let written = 0;
  let skipped = 0;

  for (let i = 0; i < queue.length; i++) {
    const item = queue[i];
    process.stdout.write(`[${i + 1}/${queue.length}] ${item.date.slice(0, 10)} — ${item.topic} … `);

    const res = await generateForTopic(item.topic, {
      dryRun: true,
      date: new Date(item.date),
      targetWords: TARGET_WORDS,
      minBodyChars: MIN_BODY_CHARS,
    });

    if (!res.ok || !res.slug || !res.mdx) {
      console.log(`skip (${res.skipped ?? res.error ?? 'unknown'})`);
      skipped++;
      if (DELAY_MS > 0) await sleep(DELAY_MS);
      continue;
    }

    await fs.writeFile(path.join(POSTS_DIR, `${res.slug}.mdx`), res.mdx, 'utf8');
    log = {
      topics: [
        ...log.topics,
        {
          slug: res.slug,
          title: item.topic,
          url: '',
          publishedAt: item.date,
          signature: signature(item.topic),
        },
      ],
    };
    await saveLocalLog(log); // save after each so an interrupted run is resumable
    written++;
    console.log(`✓ ${res.slug} (${res.mdx.length} bytes)`);

    if (DELAY_MS > 0 && i < queue.length - 1) await sleep(DELAY_MS);
  }

  console.log(`\n✓ Done. Wrote ${written} post(s), skipped ${skipped}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
