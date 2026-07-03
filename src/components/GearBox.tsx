import { affiliateEnabled, pickGearForPost, amazonUrl } from '@/lib/affiliate';

/**
 * Affiliate "recommended gear" block, auto-rendered on articles. Picks items
 * relevant to the post and links to tagged Amazon search results. Renders
 * NOTHING until an Amazon Associates tag is configured (NEXT_PUBLIC_AMAZON_TAG
 * or siteConfig.amazonAssociatesTag), so it's invisible until you opt in.
 *
 * Affiliate links use rel="nofollow sponsored" per Amazon's terms and SEO rules.
 */
export function GearBox({
  tags,
  category,
  title,
}: {
  tags?: string[];
  category?: string;
  title?: string;
}) {
  if (!affiliateEnabled()) return null;
  const picks = pickGearForPost({ tags, category, title });
  if (picks.length === 0) return null;

  return (
    <section className="my-12 border border-ink/20 bg-ink/[0.02] p-6">
      <div className="mb-1 font-display text-sm font-bold uppercase tracking-[0.3em] text-accent">
        Gear to get you started
      </div>
      <p className="mb-5 text-xs leading-relaxed text-muted">
        Some links below are affiliate links: if you buy through them we may earn a
        small commission, at no extra cost to you. It helps keep the lights on.
      </p>
      <ul className="grid gap-3 sm:grid-cols-3">
        {picks.map((g) => (
          <li key={g.id} className="border border-ink/15 p-4">
            <a
              href={amazonUrl(g.query)}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              className="font-display font-semibold leading-snug hover:text-accent"
            >
              {g.name} →
            </a>
            <p className="mt-1 text-sm leading-relaxed text-ink/70">{g.blurb}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
