import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import { Sora, Inter, JetBrains_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, websiteJsonLd } from '@/lib/structured-data';
import { SubscribeForm } from '@/components/SubscribeForm';
import { AdSlot } from '@/components/AdSlot';
import { AffiliateDisclosure } from '@/components/mdx';
import { ADSENSE_CLIENT, ADSENSE_SLOT_FOOTER } from '@/lib/ads';
import { siteConfig } from '@/site.config';
import { shouldDisclose } from '@/lib/affiliate';
import './globals.css';

// Self-hosted via next/font: fonts are downloaded at build time and served
// same-origin with size-adjusted fallbacks — no render-blocking Google Fonts
// CSS chain, no layout shift, no third-party request on page load. The CSS
// variables match the ones globals.css / tailwind.config already consume.
// All three are variable fonts (default weight: 'variable'), covering the
// weights the design uses (display 400–800 — `font-black` renders at Sora's
// 800 max; body 400–600; mono 400–500).
const sora = Sora({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

/** Short categories (AI, DIY) read better uppercased; longer ones title-cased. */
function navLabel(c: string): string {
  return c.length <= 3 ? c.toUpperCase() : c[0].toUpperCase() + c.slice(1);
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: '/',
    types: { 'application/rss+xml': `${SITE_URL}/feed.xml` },
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: 'en_US',
    images: [`${SITE_URL}/api/og`],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [`${SITE_URL}/api/og`],
  },
  // Static AdSense site-verification tag in <head> — crawlable without JS.
  other: { 'google-adsense-account': ADSENSE_CLIENT },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="relative">
        {ADSENSE_CLIENT && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
            // Ads are non-critical: defer until the page is idle so the ad
            // script never competes with content for LCP/INP (Core Web Vitals).
            strategy="lazyOnload"
          />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()).replace(/</g, '\\u003c') }}
        />
        <Header />
        <main className="relative z-10">{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

function Header() {
  const words = siteConfig.name.split(' ');
  const brandLast = words.pop();
  const brandLead = words.join(' ');
  return (
    <header className="header-glass sticky top-0 z-20 border-b border-ink/10 bg-paper/70">
      <div className="mx-auto flex max-w-6xl items-end justify-between px-6 py-5">
        <Link href="/" className="group">
          <div className="font-display text-3xl font-black tracking-tight leading-none">
            {brandLead ? `${brandLead} ` : ''}<span className="text-aurora">{brandLast}</span>
          </div>
          <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted">
            {siteConfig.tagline}
          </div>
        </Link>
        <nav className="hidden sm:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-accent transition-colors">Latest</Link>
          {siteConfig.navCategories.map((c) => (
            <Link key={c} href={`/categories/${c}`} className="hover:text-accent transition-colors">{navLabel(c)}</Link>
          ))}
          <Link href="/about" className="hover:text-accent transition-colors">About</Link>
          <Link href="/stats" className="hover:text-accent transition-colors">Stats</Link>
          <Link href="/subscribe" className="font-semibold text-accent hover:opacity-80 transition-opacity">Subscribe</Link>
          <a href="/feed.xml" className="hover:text-accent transition-colors" title="RSS Feed">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><circle cx="6.18" cy="17.82" r="2.18"/><path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z"/></svg>
          </a>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="relative z-10 mt-32 border-t border-ink/10 bg-ink/[0.02]">
      <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-muted">
        <AdSlot slot={ADSENSE_SLOT_FOOTER} format="auto" className="mb-8 block" />
        <div className="mb-8 flex flex-col gap-4 border-b border-ink/15 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-md">
            <div className="font-display text-base font-semibold text-ink">Get the weekly dispatch</div>
            <p className="mt-1">The week’s highest-signal stories, synthesized. No spam.</p>
          </div>
          <SubscribeForm />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="font-display text-base font-semibold text-ink">{siteConfig.name}</span>
            {' '}— {siteConfig.footerNote}
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <nav className="flex gap-4 text-xs uppercase tracking-widest">
              <Link href="/about" className="hover:text-accent">About</Link>
              <Link href="/starter-kit" className="hover:text-accent">Starter Kit</Link>
              <Link href="/sponsor" className="hover:text-accent">Sponsor</Link>
              <Link href="/feed.xml" className="hover:text-accent">RSS</Link>
            </nav>
            <div className="text-xs uppercase tracking-widest">
              © {new Date().getFullYear()} — No humans were harmed in the making of this blog.
            </div>
          </div>
        </div>
        <p className="mt-6 max-w-3xl text-xs leading-relaxed text-muted/80">
          Editorial standards: {siteConfig.name}&rsquo;s articles are researched and drafted with
          AI and published under human editorial oversight. A human operator curates the
          publication, is accountable for what appears here, and reviews and corrects content;
          every post cites its sources. Spotted a mistake?{' '}
          <Link href="/about" className="underline hover:text-accent">Read how this works</Link> —
          corrections are welcome.
        </p>
        {shouldDisclose() && (
          <div className="mt-4 max-w-3xl border-t border-ink/10 pt-4">
            <AffiliateDisclosure scope="site" />
          </div>
        )}
      </div>
    </footer>
  );
}
