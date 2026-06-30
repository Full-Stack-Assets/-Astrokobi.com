import { siteConfig } from '@/site.config';

// Amazon Associates tag. This is a PUBLIC value (it rides in the link URL), so
// set it via NEXT_PUBLIC_AMAZON_TAG per-deploy, or `amazonAssociatesTag` in
// site.config.ts. Empty string => affiliate boxes are hidden everywhere.
export const AMAZON_TAG = (
  process.env.NEXT_PUBLIC_AMAZON_TAG || siteConfig.amazonAssociatesTag || ''
).trim();

export function affiliateEnabled(): boolean {
  return AMAZON_TAG.length > 0;
}

export interface Gear {
  id: string;
  name: string;
  blurb: string;
  /** Amazon search query — see amazonUrl(). */
  query: string;
  /** Lowercase terms matched against a post's tags / category / title. */
  keywords: string[];
}

// Evergreen space & astronomy gear. We deliberately link to *tagged Amazon
// search results* rather than hardcoded ASINs, so picks never go out of stock
// or stale; swap a `query` for a specific product URL later if you want to
// feature exact items. Edit freely — this is the whole catalog.
export const GEAR: Gear[] = [
  { id: 'beginner-telescope', name: 'Beginner telescope', blurb: 'A no-fuss first scope for the Moon, planets, and bright deep-sky objects.', query: 'beginner telescope astronomy', keywords: ['telescope', 'stargazing', 'beginner', 'moon', 'planet', 'observing', 'amateur'] },
  { id: 'dobsonian', name: 'Dobsonian telescope', blurb: 'The most aperture per dollar — the classic deep-sky workhorse.', query: 'dobsonian telescope', keywords: ['telescope', 'deep sky', 'galaxy', 'galaxies', 'nebula', 'dobsonian', 'aperture'] },
  { id: 'astro-binoculars', name: 'Astronomy binoculars (10x50)', blurb: 'The most underrated first instrument — wide views of star fields, comets, and the Milky Way.', query: '10x50 astronomy binoculars', keywords: ['binoculars', 'stargazing', 'beginner', 'comet', 'meteor', 'milky way', 'constellation'] },
  { id: 'star-atlas', name: 'Star atlas & planisphere', blurb: 'Learn the sky and find your way around the constellations.', query: 'star atlas planisphere', keywords: ['constellation', 'stargazing', 'star chart', 'night sky', 'beginner', 'galileo', 'kepler'] },
  { id: 'star-tracker', name: 'Star tracker mount', blurb: 'For long-exposure astrophotography without star trails.', query: 'star tracker astrophotography mount', keywords: ['astrophotography', 'camera', 'long exposure', 'milky way', 'deep sky', 'tracker', 'photography'] },
  { id: 'red-flashlight', name: 'Red headlamp', blurb: 'Preserves your night vision at the eyepiece or under a dark sky.', query: 'red astronomy headlamp', keywords: ['stargazing', 'dark sky', 'observing', 'light pollution', 'beginner', 'aurora'] },
  { id: 'smart-telescope', name: 'Smart telescope', blurb: 'App-driven scopes that locate and stack targets automatically.', query: 'smart telescope', keywords: ['telescope', 'astrophotography', 'beginner', 'technology', 'smart', 'future'] },
  { id: 'sagan-cosmos', name: '“Cosmos” by Carl Sagan', blurb: 'The book that made a generation look up.', query: 'Cosmos Carl Sagan book', keywords: ['cosmology', 'cosmos', 'history', 'universe', 'explainer', 'big bang', 'science'] },
];

// Shown on posts that don't match a specific keyword, so every article still
// surfaces something useful to a beginner.
const DEFAULT_PICK_IDS = ['astro-binoculars', 'beginner-telescope', 'star-atlas'];

/** Build a tagged Amazon search URL for a query. */
export function amazonUrl(query: string): string {
  const u = new URL('https://www.amazon.com/s');
  u.searchParams.set('k', query);
  if (AMAZON_TAG) u.searchParams.set('tag', AMAZON_TAG);
  return u.toString();
}

/**
 * Pick up to `limit` gear items relevant to a post by matching its tags,
 * category, and title against each item's keywords. Falls back to beginner
 * staples so every astronomy post still gets useful, on-topic picks.
 */
export function pickGearForPost(
  opts: { tags?: string[]; category?: string; title?: string },
  limit = 3
): Gear[] {
  const hay = [...(opts.tags ?? []), opts.category ?? '', opts.title ?? '']
    .join(' ')
    .toLowerCase();

  const matched = GEAR.filter((g) => g.keywords.some((k) => hay.includes(k)));
  const chosen =
    matched.length > 0
      ? matched
      : (DEFAULT_PICK_IDS.map((id) => GEAR.find((g) => g.id === id)).filter(Boolean) as Gear[]);
  return chosen.slice(0, limit);
}
