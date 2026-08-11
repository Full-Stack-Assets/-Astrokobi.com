import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import { Sora, Inter, JetBrains_Mono } from 'next/font/google';
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, websiteJsonLd } from '@/lib/structured-data';
import { SubscribeForm } from '@/components/SubscribeForm';
import { AdSlot } from '@/components/AdSlot';
import { AffiliateDisclosure } from '@/components/mdx';
import { ADSENSE_CLIENT, ADSENSE_PUBLISHER_ID, ADSENSE_SLOT_FOOTER } from '@/lib/ads';
import { siteConfig } from '@/site.config';
import { PortfolioAnalytics } from '@/components/PortfolioAnalytics';
import { shouldDisclose } from '@/lib/affiliate';
import './globals.css';

const sora = Sora({ subsets: ['latin'], variable: '--font-display', display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

function navLabel(c: string): string {
  return c.length <= 3 ? c.toUpperCase() : c[0].toUpperCase() + c.slice(1);
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s — ${SITE_NAME}` },
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
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  other: { 'google-adsense-account': ADSENSE_PUBLISHER_ID },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="relative">
        <PortfolioAnalytics />
        {ADSENSE_CLIENT && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
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
          <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted">{siteConfig.tagline}</div>
        </Link>
        <nav className="hidden sm:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-accent transition-colors">Latest</Link>
          {siteConfig.navCategories.map((c) => (
            <Link key={c} href={`/categories/${c}`} className="hover:text-accent transition-colors">{navLabel(c)}</Link>
          ))}
          <Link href="/about" className="hover:text-accent transition-colors">About</Link>
          <Link href="/stats" className="hover:text-accent transition-colors">Stats</Link>
          <Link href="/subscribe" className="font-semibold text-accent hover:opacity-80 transition-opacity">Subscribe</Link>
          <a href="/feed.xml" className="hover:text-accent transition-colors" title="RSS Feed">RSS</a>
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
          <div><span className="font-display text-base font-semibold text-ink">{siteConfig.name}</span> — {siteConfig.footerNote}</div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <nav className="flex gap-4 text-xs uppercase tracking-widest">
              <Link href="/about" className="hover:text-accent">About</Link>
              <Link href="/starter-kit" className="hover:text-accent">Starter Kit</Link>
              <Link href="/sponsor" className="hover:text-accent">Sponsor</Link>
              <Link href="/feed.xml" className="hover:text-accent">RSS</Link>
            </nav>
            <div className="text-xs uppercase tracking-widest">© {new Date().getFullYear()} — No humans were harmed in the making of this blog.</div>
          </div>
        </div>
        <p className="mt-6 max-w-3xl text-xs leading-relaxed text-muted/80">
          Editorial standards: {siteConfig.name}&rsquo;s articles are researched and drafted with AI and published under human editorial oversight. Every post cites its sources.
        </p>
        {shouldDisclose() && (
          <div className="mt-4 max-w-3xl border-t border-ink/10 pt-4"><AffiliateDisclosure scope="site" /></div>
        )}
      </div>
    </footer>
  );
}
