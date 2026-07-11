import Link from 'next/link';
import { listPosts } from '@/lib/posts';
import { AdSlot } from '@/components/AdSlot';
import { HeroImage } from '@/components/HeroImage';
import { ADSENSE_SLOT_LISTING } from '@/lib/ads';
import { siteConfig } from '@/site.config';

export const revalidate = 300; // re-check content every 5 minutes

export default async function HomePage() {
  const posts = await listPosts();
  const [lead, ...rest] = posts;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:py-16">
      <Masthead />

      {posts.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {lead && <LeadStory post={lead} />}
          {/* Listing ad — renders only when AdSense + a listing slot are configured */}
          <AdSlot slot={ADSENSE_SLOT_LISTING} format="auto" className="mt-16 block" />
          {rest.length > 0 && (
            <div className="mt-20">
              <SectionRule label="More dispatches" />
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((p) => (
                  <PostCard key={p.slug} post={p} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Masthead() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
  // Split the configured brand name so the last word can carry the accent —
  // no hardcoded site copy, everything reads from siteConfig.
  const words = siteConfig.name.split(' ');
  const nameLast = words.pop();
  const nameLead = words.join(' ');
  return (
    <div className="mb-16 border-b border-ink/10 pb-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
        <div className="text-xs uppercase tracking-[0.3em] text-accent/90">{siteConfig.tagline}</div>
        <div className="text-xs uppercase tracking-widest text-muted">{today}</div>
      </div>
      <h1 className="mt-4 font-display text-5xl sm:text-7xl font-black leading-[0.95] tracking-tight">
        {nameLead ? `${nameLead} ` : ''}
        <span className="bg-gradient-to-r from-accent to-violet-400 bg-clip-text text-transparent">{nameLast}</span>
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
        {siteConfig.description}
      </p>
    </div>
  );
}

function SectionRule({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="h-px flex-1 bg-ink/20" />
      <span className="font-display text-xs font-bold uppercase tracking-[0.3em] text-muted">{label}</span>
      <div className="h-px flex-1 bg-ink/20" />
    </div>
  );
}

function LeadStory({ post }: { post: Awaited<ReturnType<typeof listPosts>>[number] }) {
  const { slug, frontmatter, readingTimeMin } = post;
  return (
    <article className="card-surface grid gap-8 overflow-hidden p-6 sm:grid-cols-5 sm:p-8">
      {frontmatter.hero?.url && (
        <div className="sm:col-span-3 aspect-[4/3] overflow-hidden rounded-lg bg-ink/5">
          <Link href={`/blog/${slug}`} className="relative block h-full w-full">
            <HeroImage
              src={frontmatter.hero.url}
              alt={frontmatter.hero.alt}
              priority
              sizes="(min-width: 640px) 60vw, 100vw"
              className="transition-transform duration-700 hover:scale-[1.03]"
            />
          </Link>
        </div>
      )}
      <div className="sm:col-span-2 flex flex-col justify-center">
        <Link href={`/categories/${frontmatter.category}`} className="mb-3 inline-block self-start border border-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-accent hover:bg-accent hover:text-paper transition-colors">
          {frontmatter.category}
        </Link>
        <Link href={`/blog/${slug}`} className="group">
          <h2 className="font-display text-3xl sm:text-4xl font-black leading-[1.05] tracking-tight group-hover:text-accent transition-colors">
            {frontmatter.title}
          </h2>
        </Link>
        <p className="mt-4 text-lg leading-relaxed text-ink/75">{frontmatter.description}</p>
        <div className="mt-5 text-xs uppercase tracking-widest text-muted">
          {new Date(frontmatter.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          {' · '} {readingTimeMin} min read
        </div>
      </div>
    </article>
  );
}

function PostCard({ post }: { post: Awaited<ReturnType<typeof listPosts>>[number] }) {
  const { slug, frontmatter, readingTimeMin } = post;
  return (
    <article className="group card-surface flex flex-col overflow-hidden">
      {frontmatter.hero?.url && (
        <Link href={`/blog/${slug}`} className="relative block aspect-[16/10] overflow-hidden bg-ink/5">
          <HeroImage
            src={frontmatter.hero.url}
            alt={frontmatter.hero.alt}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
          {frontmatter.category}
        </div>
        <Link href={`/blog/${slug}`}>
          <h3 className="font-display text-xl font-semibold leading-tight group-hover:text-accent transition-colors">
            {frontmatter.title}
          </h3>
        </Link>
        <p className="mt-2 text-sm text-ink/70 line-clamp-2">{frontmatter.description}</p>
        <div className="mt-auto pt-3 text-[11px] uppercase tracking-widest text-muted">
          {new Date(frontmatter.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          {' · '} {readingTimeMin} min
        </div>
      </div>
    </article>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-ink/25 py-24 text-center">
      <div className="font-display text-3xl font-bold">Nothing published yet.</div>
      <p className="mt-3 text-muted">
        Run <code className="rounded bg-ink/10 px-2 py-0.5 text-sm">npm run generate</code> or wait for the next cron tick.
      </p>
    </div>
  );
}
