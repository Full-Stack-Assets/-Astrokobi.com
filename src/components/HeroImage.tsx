import Image from 'next/image';

// Hosts whitelisted in next.config.mjs `images.remotePatterns`. Keep the two in
// sync: only these go through the Next image optimizer (resized, WebP/AVIF,
// srcset). Openverse heroes come from arbitrary domains, so anything else falls
// back to a plain <img> with lazy-loading hints rather than failing the render.
const OPTIMIZED_HOSTS = new Set(['images.pexels.com', 'i.ytimg.com']);

/**
 * A post hero image. Render inside a `relative` container with a fixed aspect
 * ratio (e.g. `relative aspect-video`) — the image fills it (object-cover).
 * Set `priority` on above-the-fold heroes (article page, home lead story) so
 * the LCP image is preloaded; everything else lazy-loads.
 */
export function HeroImage({
  src,
  alt,
  sizes,
  priority = false,
  className = '',
}: {
  src: string;
  alt: string;
  /** Responsive `sizes` hint, e.g. "(min-width: 640px) 60vw, 100vw". */
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  let host = '';
  try {
    host = new URL(src).hostname;
  } catch {
    // Relative or malformed URL — fall through to the plain <img>.
  }

  if (OPTIMIZED_HOSTS.has(host)) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover ${className}`}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      {...(priority ? { fetchPriority: 'high' as const } : {})}
      className={`absolute inset-0 h-full w-full object-cover ${className}`}
    />
  );
}
