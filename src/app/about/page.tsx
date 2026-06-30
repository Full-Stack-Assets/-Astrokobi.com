import Link from 'next/link';
import { siteConfig } from '@/site.config';
import { AffiliateDisclosure } from '@/components/mdx';
import { shouldDisclose } from '@/lib/affiliate';

export const metadata = { title: 'About' };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="mb-10 border-b-2 border-ink pb-6">
        <div className="text-xs uppercase tracking-[0.3em] text-muted">About</div>
        <h1 className="mt-2 font-display text-5xl font-black">How this works</h1>
      </div>

      <div className="prose-editorial">
        <p>
          <strong>{siteConfig.name}</strong> is an experiment in what happens when you point a small,
          opinionated pipeline at the firehose of space and astronomy news and let it write a fresh
          post every hour.
        </p>

        <h2>The pipeline</h2>
        <p>At the top of every hour, a scheduled job does five things:</p>
        <ol>
          <li><strong>Gather.</strong> Pulls headlines from space and astronomy communities on Reddit, Hacker News, DEV.to, a handful of dedicated RSS feeds (Space.com, NASA, Phys.org, Sky &amp; Telescope, Universe Today), YouTube, Brave News, and Google Trends.</li>
          <li><strong>Score.</strong> Each candidate gets a composite score — popularity, engagement, recency — and anything that&rsquo;s already been covered is filtered out.</li>
          <li><strong>Research.</strong> The winner gets Brave-searched, the top articles scraped, and any relevant YouTube transcripts pulled.</li>
          <li><strong>Write.</strong> All of it is handed to a large language model with an explicit MDX contract: an opening, a takeaway, what-happened/why-it-matters sections, a pros/cons block, a how-to-think-about-it section, and a three-question FAQ.</li>
          <li><strong>Publish.</strong> The MDX file, with a banner image and frontmatter, is committed to GitHub. The host notices and deploys.</li>
        </ol>

        <h2>The caveats</h2>
        <p>
          Automated writing has a quality floor, not a ceiling. The pipeline will occasionally pick
          a less-interesting topic, miss nuance, or get a detail subtly wrong. Every post links every
          source at the bottom — if something doesn&rsquo;t add up, go read the primaries.
        </p>

        <h2>The stack</h2>
        <p>
          Next.js, TinaCMS, a free-tier LLM, and a lot of free public APIs. Total running
          cost: about $0/month.
        </p>

        {shouldDisclose() && (
          <>
            <h2>Affiliate disclosure</h2>
            <p>
              Some articles recommend gear and books relevant to the topic. Those are
              affiliate links: if you buy through one, {siteConfig.name} may earn a small
              commission at no extra cost to you, which helps keep the site running. We only
              link to things we&rsquo;d genuinely recommend, and recommendations are never
              paid placements. As an Amazon Associate, {siteConfig.name} earns from
              qualifying purchases.
            </p>
          </>
        )}

        <p className="mt-8">
          <Link href="/" className="text-accent underline">← Back to the front page</Link>
        </p>
      </div>
    </div>
  );
}
