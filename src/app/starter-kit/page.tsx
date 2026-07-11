import Link from 'next/link';
import type { Metadata } from 'next';
import { SubscribeForm } from '@/components/SubscribeForm';

export const metadata: Metadata = {
  title: 'The Stargazing Starter Kit',
  description:
    'A free one-page guide to your first nights under the night sky — no telescope, no jargon required.',
};

export default function StarterKitPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="text-xs uppercase tracking-[0.3em] text-muted">Free guide</div>
      <h1 className="mt-2 font-display text-4xl font-black leading-tight sm:text-5xl">
        <span className="text-aurora">The Stargazing Starter Kit</span>
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-ink/75">
        Everything you need for your first few nights under the sky — no telescope, no jargon.
        <span className="block text-sm text-muted">
          Tip: press <kbd>⌘</kbd>/<kbd>Ctrl</kbd> + <kbd>P</kbd> to save this as a PDF.
        </span>
      </p>

      <div className="prose-editorial mt-10">
        <h2>1. Start with your eyes</h2>
        <p>
          You don&rsquo;t need a telescope — the best first instrument is your own eyes and a little
          patience. Get somewhere as dark as you reasonably can, then let your eyes adjust for
          <strong> 20–30 minutes</strong>. You&rsquo;ll be amazed how much more appears once your night
          vision kicks in.
        </p>

        <h2>2. What you can see tonight (no gear)</h2>
        <ul>
          <li><strong>The Moon.</strong> Even a few days from full, the shadowed edge (the
            &ldquo;terminator&rdquo;) shows craters and mountains in sharp relief.</li>
          <li><strong>Planets.</strong> Venus (brilliant after sunset or before dawn), Jupiter, Saturn,
            and Mars often outshine every star. They don&rsquo;t twinkle — that&rsquo;s how you tell them apart.</li>
          <li><strong>Constellations &amp; asterisms.</strong> Learn three or four patterns first —
            the Big Dipper, Orion, Cassiopeia — and use them to hop to everything else.</li>
          <li><strong>The Milky Way.</strong> From a truly dark site on a moonless night, its faint
            band arcs overhead.</li>
          <li><strong>The ISS &amp; satellites.</strong> The Space Station is one of the brightest
            things in the sky and crosses in a few minutes. Free apps predict passes for your location.</li>
          <li><strong>Meteor showers.</strong> A handful of reliable showers each year need nothing
            but a reclining chair and a dark sky.</li>
        </ul>

        <h2>3. The one rule that changes everything: red light</h2>
        <p>
          White light wrecks the night vision you spent half an hour building. Use a
          <strong> red flashlight</strong> (or red-film over your phone) to read charts. This single
          habit does more for your first night than any piece of gear.
        </p>

        <h2>4. A simple monthly rhythm</h2>
        <ul>
          <li><strong>New Moon week:</strong> go dark-sky hunting for the Milky Way, galaxies, and meteors.</li>
          <li><strong>First quarter:</strong> best time for the Moon itself — dramatic shadows along the terminator.</li>
          <li><strong>Any clear night:</strong> track the planets; they shift noticeably week to week.</li>
          <li><strong>Cloudy nights:</strong> learn one new constellation from a chart so you&rsquo;re ready.</li>
        </ul>

        <h2>5. When you&rsquo;re ready for gear</h2>
        <p>
          Buy <strong>binoculars before a telescope</strong>. A cheap 10×50 pair shows craters, Jupiter&rsquo;s
          moons, star clusters, and comets — for a fraction of the price and none of the setup. When you
          do want a scope, aperture (how much light it gathers) matters more than magnification, and a
          simple Dobsonian gives you the most sky per dollar.
        </p>
        <p>
          We break all of this down, in depth, in our{' '}
          <Link href="/categories/explainers">explainers</Link> — and each article ends with a short
          list of beginner-friendly gear.
        </p>
      </div>

      <div className="mt-12 border border-ink/20 bg-ink/[0.02] p-6">
        <div className="font-display text-lg font-semibold">Get the weekly follow-along</div>
        <p className="mb-4 mt-1 text-sm text-muted">
          Subscribe for <strong>This Week in the Sky</strong> — what to look for each week, so this
          guide turns into a habit.
        </p>
        <SubscribeForm />
      </div>

      <p className="mt-10 text-sm text-muted">
        <Link href="/subscribe" className="text-accent underline">← Back to Subscribe</Link>
      </p>
    </div>
  );
}
