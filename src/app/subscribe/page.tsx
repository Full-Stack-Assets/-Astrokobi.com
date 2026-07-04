import Link from 'next/link';
import type { Metadata } from 'next';
import { SubscribeForm } from '@/components/SubscribeForm';
import { listPosts } from '@/lib/posts';
import { siteConfig } from '@/site.config';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Subscribe',
  description: `Get the weekly ${siteConfig.name} dispatch — the best of space & astronomy, synthesized — plus a free Stargazing Starter Kit.`,
};

export default async function SubscribePage() {
  const count = (await listPosts()).length;

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 sm:py-24">
      <div className="text-xs uppercase tracking-[0.3em] text-muted">Newsletter</div>
      <h1 className="mt-2 font-display text-4xl font-black leading-[1.05] sm:text-5xl">
        Look up, <span className="text-accent">once a week.</span>
      </h1>
      <p className="mt-5 text-lg leading-relaxed text-ink/75">
        Every week we send <strong>This Week in the Sky</strong> — what to look for overhead
        (planets, the Moon, meteor showers, launches) plus the best of {count}+ deeply-sourced
        stories on missions, astronomy, and the cosmos. One email. No spam. Unsubscribe anytime.
      </p>

      <div className="mt-8 border border-ink/20 bg-ink/[0.02] p-6">
        <div className="font-display text-lg font-semibold">Join free — and get the Starter Kit</div>
        <p className="mb-4 mt-1 text-sm text-muted">
          Subscribe and you&rsquo;ll also get the{' '}
          <Link href="/starter-kit" className="text-accent underline">Stargazing Starter Kit</Link>
          {' '}— a one-page guide to your first nights under the sky, no telescope required.
        </p>
        <SubscribeForm />
      </div>

      <ul className="mt-10 grid gap-4 text-sm sm:grid-cols-3">
        <li className="border border-ink/15 p-4">
          <div className="font-display font-semibold">Signal, not noise</div>
          <p className="mt-1 text-ink/70">One curated send. We read the firehose so you don&rsquo;t have to.</p>
        </li>
        <li className="border border-ink/15 p-4">
          <div className="font-display font-semibold">Actually useful</div>
          <p className="mt-1 text-ink/70">What&rsquo;s visible this week, and why it matters.</p>
        </li>
        <li className="border border-ink/15 p-4">
          <div className="font-display font-semibold">Always sourced</div>
          <p className="mt-1 text-ink/70">Every story links its primary sources.</p>
        </li>
      </ul>

      <p className="mt-10 text-sm text-muted">
        Prefer to browse first? <Link href="/" className="text-accent underline">Read the latest →</Link>
      </p>
    </div>
  );
}
