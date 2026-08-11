// AdSense configuration. The publisher id (public value) defaults from
// site.config.ts; override per-deploy with NEXT_PUBLIC_ADSENSE_CLIENT. Slot ids
// are account-specific ad units — set them to render the manual slots; without
// them those slots stay empty (Auto Ads still works from the loaded script if
// enabled in the dashboard).
//
// Unset CI secrets arrive as "" (not undefined), so every value is trimmed and
// empty strings are normalized to undefined — an empty slot renders nothing.
import { siteConfig } from '@/site.config';

function env(v: string | undefined): string | undefined {
  const t = v?.trim();
  return t && t.length > 0 ? t : undefined;
}

export const ADSENSE_PUBLISHER_ID =
  env(process.env.NEXT_PUBLIC_ADSENSE_CLIENT) ?? siteConfig.adsenseClient;
export const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_GOOGLE_CERTIFIED_CMP_ACTIVE === 'true' ? ADSENSE_PUBLISHER_ID : undefined;

/** In-article unit rendered after the post body (before the gear box). */
export const ADSENSE_SLOT_IN_ARTICLE = env(process.env.NEXT_PUBLIC_ADSENSE_SLOT_IN_ARTICLE);
/** In-article unit injected mid-article, just before the FAQ section. */
export const ADSENSE_SLOT_MID_ARTICLE = env(process.env.NEXT_PUBLIC_ADSENSE_SLOT_MID_ARTICLE);
/** Responsive unit on listing pages (home), between the lead story and the grid. */
export const ADSENSE_SLOT_LISTING = env(process.env.NEXT_PUBLIC_ADSENSE_SLOT_LISTING);
/** Responsive unit above the site footer. */
export const ADSENSE_SLOT_FOOTER = env(process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER);
