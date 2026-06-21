export const siteConfig = {
  // ── Branding ──────────────────────────────────────────────────
  name: 'AstroKobi',
  tagline: 'Space · Astronomy · Wonder',
  description: 'Exploring the cosmos: space missions, astronomy, and the science of the universe, updated as it happens.',
  url: 'https://astrokobi.com',
  footerNote: 'the cosmos, updated every hour from across the web.',

  // ── Audience & taxonomy ───────────────────────────────────────
  audience: 'space and astronomy enthusiasts and the science-curious',
  categories: ['news', 'missions', 'astronomy', 'astrophysics', 'spaceflight', 'explainers'],
  navCategories: ['missions', 'astronomy', 'spaceflight'],

  // ── Niche sources ─────────────────────────────────────────────
  sources: {
    subreddits: ['space', 'astronomy', 'spacex', 'nasa', 'Astrophysics', 'cosmology'],
    rssFeeds: [
      'https://www.space.com/feeds/all',
      'https://www.nasa.gov/feed/',
      'https://phys.org/rss-feed/space-news/',
      'https://skyandtelescope.org/feed/',
      'https://www.universetoday.com/feed/',
    ],
    braveQueries: [
      'space mission news',
      'new astronomy discovery',
      'NASA announcement',
      'rocket launch',
      'James Webb telescope',
    ],
  },

  // ── Ads ───────────────────────────────────────────────────────
  adsenseClient: 'ca-pub-4655488107179825',

  // ── Engine: writer LLM (Google Gemini, OpenAI-compatible) ─────
  llm: {
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
    model: 'gemini-flash-latest',
    apiKeyEnv: 'GEMINI_API_KEY',
  },

  // ── Engine: hero images ('pexels' | 'openverse' | 'none') ─────
  imageProvider: 'pexels',
} as const;

export type SiteConfig = typeof siteConfig;
export type ImageProvider = 'pexels' | 'openverse' | 'none';
