import { ImageResponse } from 'next/og';
import { siteConfig } from '@/site.config';

export const runtime = 'edge';

/**
 * Dynamic Open Graph image: /api/og?title=...
 *
 * Used as the social-share card for posts that have no hero image (and as the
 * site-wide default), so every shared link gets a branded 1200×630 card instead
 * of a blank preview — better click-through from social → more traffic → more
 * ad/affiliate revenue. Branding comes from siteConfig; no hardcoded names.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get('title') ?? siteConfig.description).slice(0, 160);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: 'linear-gradient(135deg, #0b1026 0%, #1a1040 55%, #2b0f3a 100%)',
          color: '#f5f2ea',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 28,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#a5b4fc',
            }}
          >
            {siteConfig.tagline}
          </div>
          <div
            style={{
              marginTop: 36,
              fontSize: title.length > 80 ? 52 : 64,
              fontWeight: 800,
              lineHeight: 1.1,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 40, fontWeight: 900 }}>{siteConfig.name}</div>
          <div style={{ fontSize: 26, color: '#c7c2b4' }}>
            {siteConfig.url.replace(/^https?:\/\//, '')}
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
