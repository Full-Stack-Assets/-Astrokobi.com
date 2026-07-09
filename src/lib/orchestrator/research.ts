import * as cheerio from 'cheerio';
import { Innertube } from 'youtubei.js';
import type { ScoredItem, ResearchBundle, RawItem } from './types';
import { siteConfig } from '@/site.config';

// Polite, identifiable scraper UA derived from the site config.
const SCRAPER_UA = `Mozilla/5.0 (compatible; ${siteConfig.name.replace(/\s+/g, '')}/1.0; +${siteConfig.url})`;

interface BraveWebResult {
  url: string;
  title: string;
  description: string;
}

async function braveWebSearch(query: string): Promise<BraveWebResult[]> {
  const key = process.env.BRAVE_API_KEY;
  if (!key) return [];

  const url = new URL('https://api.search.brave.com/res/v1/web/search');
  url.searchParams.set('q', query);
  url.searchParams.set('count', '8');

  const res = await fetch(url, {
    headers: { 'x-subscription-token': key, accept: 'application/json' },
  });
  if (!res.ok) return [];
  const json = (await res.json()) as { web?: { results?: BraveWebResult[] } };
  return json.web?.results ?? [];
}

// ── Keyless fallback: Wikipedia ─────────────────────────────────
// When Brave search yields nothing scrapable (no key, invalid key, or monthly
// quota exhausted), research falls back to Wikipedia's free, keyless API so a
// run degrades to encyclopedic sourcing instead of skipping entirely. This is
// what keeps topic-based generation (seed / backfill — no source URL of its
// own) alive when the sole search provider is down.

const WIKI_API = 'https://en.wikipedia.org/w/api.php';

async function wikiFetch(params: Record<string, string>): Promise<unknown> {
  const url = new URL(WIKI_API);
  for (const [k, v] of Object.entries({ format: 'json', ...params })) url.searchParams.set(k, v);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'user-agent': SCRAPER_UA, accept: 'application/json' },
    });
    if (!res.ok) return null;
    return await res.json();
  } finally {
    clearTimeout(timeout);
  }
}

// Question-style titles ("What is the Sun made of and how does it produce
// energy") rank terribly in Wikipedia's relevance search — the filler words
// dominate and pull in novelty matches. Strip them down to content terms.
const WIKI_STOPWORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'best', 'by', 'can', 'do', 'does',
  'for', 'from', 'how', 'in', 'into', 'is', 'it', 'its', 'of', 'on', 'or',
  'our', 'should', 'that', 'the', 'their', 'them', 'they', 'this', 'to', 'was',
  'we', 'what', 'when', 'where', 'which', 'why', 'will', 'with', 'you', 'your',
]);

function wikiQuery(query: string): string {
  const words = query.toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/).filter(Boolean);
  const terms = words.filter((w) => w.length > 1 && !WIKI_STOPWORDS.has(w));
  return (terms.length >= 2 ? terms : words).slice(0, 8).join(' ');
}

async function wikipediaArticles(
  query: string,
  limit = 3
): Promise<{ url: string; title: string; content: string }[]> {
  try {
    const search = (await wikiFetch({
      action: 'query',
      list: 'search',
      srsearch: wikiQuery(query),
      srlimit: String(limit),
    })) as { query?: { search?: { title: string; pageid: number }[] } } | null;
    const hits = search?.query?.search ?? [];
    if (hits.length === 0) return [];

    const pages = await Promise.all(
      hits.map(async (hit) => {
        try {
          // Full plain-text extracts are limited to one page per request.
          const data = (await wikiFetch({
            action: 'query',
            prop: 'extracts',
            explaintext: '1',
            pageids: String(hit.pageid),
          })) as { query?: { pages?: Record<string, { title?: string; extract?: string }> } } | null;
          const page = data?.query?.pages?.[String(hit.pageid)];
          const content = page?.extract?.trim().slice(0, 6000) ?? '';
          if (content.length < 200) return null; // stubs aren't research
          return {
            url: `https://en.wikipedia.org/?curid=${hit.pageid}`,
            title: page?.title || hit.title,
            content,
          };
        } catch {
          return null;
        }
      })
    );
    return pages.filter((p): p is NonNullable<typeof p> => p !== null);
  } catch {
    return [];
  }
}

async function scrapeArticle(url: string): Promise<{ title: string; content: string } | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'user-agent': SCRAPER_UA },
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const html = await res.text();
    const $ = cheerio.load(html);

    // Strip noise
    $('script, style, nav, footer, aside, iframe, .advertisement, .ad, [role=navigation]').remove();

    const title = $('meta[property="og:title"]').attr('content') ?? $('title').text() ?? '';

    // Prefer article tags, fall back to main, then body paragraphs
    const paragraphs: string[] = [];
    const container = $('article').length ? $('article') : $('main').length ? $('main') : $('body');
    container.find('p, h2, h3, li').each((_, el) => {
      const text = $(el).text().trim();
      if (text.length > 40) paragraphs.push(text);
    });

    const content = paragraphs.join('\n\n').slice(0, 6000);
    return { title: title.trim(), content };
  } catch {
    return null;
  }
}

async function fetchTranscript(videoId: string): Promise<{ title: string; text: string } | null> {
  try {
    const yt = await Innertube.create({ retrieve_player: false });
    const info = await yt.getInfo(videoId);
    const transcriptData = await info.getTranscript();
    const text = transcriptData.transcript.content?.body?.initial_segments
      ?.map((s) => s.snippet.text)
      .join(' ')
      .slice(0, 5000);
    if (!text) return null;
    return { title: info.basic_info.title ?? '', text };
  } catch {
    return null;
  }
}

function extractVideoId(url: string): string | null {
  const m = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/) ?? url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  return m?.[1] ?? null;
}

export async function research(
  winner: ScoredItem,
  allItems: RawItem[]
): Promise<ResearchBundle> {
  // Build a search query from the winner's title, stripping common filler
  const query = winner.title.replace(/[^\w\s]/g, ' ').split(/\s+/).slice(0, 10).join(' ');

  const searchResults = await braveWebSearch(query);

  // Scrape top 3 unique domains, excluding the winner's own URL
  const winnerHost = (() => {
    try { return new URL(winner.url).hostname; } catch { return ''; }
  })();
  const seenHosts = new Set<string>([winnerHost]);
  const toScrape = searchResults
    .filter((r) => {
      try {
        const h = new URL(r.url).hostname;
        if (seenHosts.has(h)) return false;
        seenHosts.add(h);
        return true;
      } catch { return false; }
    })
    .slice(0, 3);

  const articles = (
    await Promise.all(
      toScrape.map(async (r) => {
        const s = await scrapeArticle(r.url);
        return s ? { url: r.url, title: s.title || r.title, content: s.content } : null;
      })
    )
  ).filter((a): a is NonNullable<typeof a> => a !== null);

  // If winner itself is non-YouTube, also try to scrape it
  if (winner.source !== 'youtube') {
    const w = await scrapeArticle(winner.url);
    if (w) articles.unshift({ url: winner.url, title: w.title || winner.title, content: w.content });
  }

  // Nothing scrapable via Brave (or no Brave at all)? Fall back to Wikipedia so
  // the run degrades to encyclopedic sources instead of skipping. Especially
  // vital for topic-based generation, where the winner has no URL to scrape.
  if (articles.length === 0) {
    // Use the full title, not the 10-word Brave query — wikiQuery strips the
    // filler itself, and truncating first can drop the load-bearing terms.
    const wiki = await wikipediaArticles(winner.title);
    if (wiki.length > 0) {
      console.warn(`research: no scrapable web sources; using ${wiki.length} Wikipedia article(s)`);
      articles.push(...wiki);
    }
  }

  // Pull transcripts from any related YouTube items (and the winner if it's YT)
  const videoIds = new Set<string>();
  if (winner.source === 'youtube') {
    const id = extractVideoId(winner.url);
    if (id) videoIds.add(id);
  }
  for (const it of allItems) {
    if (it.source !== 'youtube') continue;
    if (!it.title.toLowerCase().split(/\s+/).some((w) => query.toLowerCase().includes(w))) continue;
    const id = extractVideoId(it.url);
    if (id) videoIds.add(id);
    if (videoIds.size >= 2) break;
  }

  const transcripts = (
    await Promise.all(
      [...videoIds].map(async (id) => {
        const t = await fetchTranscript(id);
        return t ? { videoId: id, title: t.title, text: t.text } : null;
      })
    )
  ).filter((t): t is NonNullable<typeof t> => t !== null);

  // Keep a handful of "related" headlines for context
  const related = allItems
    .filter((it) => it.id !== winner.id)
    .filter((it) => {
      const a = new Set(it.title.toLowerCase().split(/\s+/));
      const b = new Set(winner.title.toLowerCase().split(/\s+/));
      let overlap = 0;
      for (const w of a) if (b.has(w) && w.length > 3) overlap++;
      return overlap >= 2;
    })
    .slice(0, 5);

  return { winner, articles, transcripts, related };
}
