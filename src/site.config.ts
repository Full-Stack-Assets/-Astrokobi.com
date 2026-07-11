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
    // Broadened to cover all aspects of space, the cosmos, and futurism:
    // spaceflight & missions, observational astronomy, astrophysics & cosmology,
    // planetary science, astrobiology, and forward-looking futurism.
    subreddits: [
      'space',
      'astronomy',
      'spacex',
      'nasa',
      'Astrophysics',
      'cosmology',
      'spaceflight',
      'astrophotography',
      'planetaryscience',
      'astrobiology',
      'SpaceXLounge',
      'Futurology',
      'transhumanism',
      'singularity',
    ],
    rssFeeds: [
      // Space news & missions
      'https://www.space.com/feeds/all',
      'https://www.nasa.gov/feed/',
      'https://www.esa.int/rssfeed/Our_Activities/Space_News',
      'https://spacenews.com/feed/',
      'https://phys.org/rss-feed/space-news/',
      // Astronomy & the cosmos
      'https://skyandtelescope.org/feed/',
      'https://www.universetoday.com/feed/',
      'https://earthsky.org/feed/',
      'https://www.sciencedaily.com/rss/space_time.xml',
      'https://www.planetary.org/rss/articles',
      // Futurism
      'https://futurism.com/feed',
      'https://singularityhub.com/feed/',
      'https://bigthink.com/feed/',
    ],
    braveQueries: [
      // Missions & spaceflight
      'space mission news',
      'NASA announcement',
      'rocket launch',
      'SpaceX Starship update',
      'Artemis Moon mission',
      'private spaceflight industry',
      'Mars exploration news',
      // Astronomy & the cosmos
      'new astronomy discovery',
      'James Webb Space Telescope discovery',
      'space telescope new image',
      'black hole discovery',
      'exoplanet discovery',
      'asteroid comet flyby',
      // Astrophysics & cosmology
      'dark matter dark energy research',
      'galaxy formation cosmology',
      'gravitational waves detection',
      'astrobiology search for life',
      // Futurism
      'space colonization future',
      'futurism technology breakthrough',
    ],
  },

  // ── Ads ───────────────────────────────────────────────────────
  adsenseClient: 'ca-pub-4655488107179825',

  // ── Affiliate — Amazon Associates tag (e.g. 'astrokobi-20'). Empty hides all
  //    affiliate gear boxes. Override per-deploy with NEXT_PUBLIC_AMAZON_TAG.
  amazonAssociatesTag: '',

  // ── Engine: writer LLM (Groq, OpenAI-compatible) ──────────────
  llm: {
    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
    model: 'openai/gpt-oss-120b',
    apiKeyEnv: 'GROQ_API_KEY',
  },

  // Automatic failover: if the primary Groq model returns availability errors
  // (429 rate limit / 5xx / "overloaded"), generate.ts switches the remaining
  // attempts to this smaller Groq model (same API key).
  llmFallback: {
    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
    model: 'openai/gpt-oss-20b',
    apiKeyEnv: 'GROQ_API_KEY',
  },

  // ── Engine: hero images ('pexels' | 'openverse' | 'none') ─────
  imageProvider: 'pexels',
} as const;

export type SiteConfig = typeof siteConfig;
export type ImageProvider = 'pexels' | 'openverse' | 'none';
