import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { listPosts } from '@/lib/posts';
import { SITE_URL, SITE_NAME } from '@/lib/structured-data';
import { NewsletterCTA } from '@/components/NewsletterCTA';

export const revalidate = 300;

export async function generateStaticParams() {
  const posts = await listPosts();
  const tags = Array.from(new Set(posts.flatMap((p) => p.frontmatter.tags ?? [])));
  return tags.map((tag) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const title = `#${tag}`;
  const description = `Everything ${SITE_NAME} has published about ${tag}.`;
  const url = `${SITE_URL}/tags/${tag}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: 'website', url, title, description, siteName: SITE_NAME },
    twitter: { card: 'summary', title, description },
  };
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const posts = (await listPosts()).filter((p) => p.frontmatter.tags?.includes(tag));
  if (posts.length === 0) notFound();

  // Sibling tags from the same posts, so tag pages interlink instead of dead-ending.
  const relatedTags = Array.from(
    new Set(posts.flatMap((p) => p.frontmatter.tags ?? []))
  ).filter((t) => t !== tag).slice(0, 12);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-12 border-b-2 border-ink pb-6">
        <div className="text-xs uppercase tracking-[0.3em] text-muted">Tag</div>
        <h1 className="mt-2 font-display text-5xl font-black">#{tag}</h1>
        <p className="mt-2 text-muted">{posts.length} {posts.length === 1 ? 'post' : 'posts'}</p>
      </div>
      <ul className="divide-y divide-ink/20">
        {posts.map((p) => (
          <li key={p.slug} className="py-6">
            <Link href={`/blog/${p.slug}`} className="group block">
              <h2 className="font-display text-2xl font-semibold group-hover:text-accent transition-colors">
                {p.frontmatter.title}
              </h2>
              <p className="mt-1 text-ink/70">{p.frontmatter.description}</p>
            </Link>
          </li>
        ))}
      </ul>

      <NewsletterCTA />

      {relatedTags.length > 0 && (
        <nav className="mt-12 border-t border-ink/20 pt-8">
          <div className="mb-4 font-display text-sm font-bold uppercase tracking-[0.3em] text-muted">
            Related tags
          </div>
          <div className="flex flex-wrap gap-2">
            {relatedTags.map((t) => (
              <Link
                key={t}
                href={`/tags/${t}`}
                className="border border-ink/30 px-3 py-1 text-xs uppercase tracking-widest text-ink/70 hover:border-accent hover:text-accent transition-colors"
              >
                #{t}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}
