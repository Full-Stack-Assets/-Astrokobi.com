# Analytics and monetization activation

This site uses the portfolio GA4 event contract when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set at build time. Set `NEXT_PUBLIC_PORTFOLIO_SITE_ID=astrokobi` as a stable cross-site key.

Tracked automatically: `article_scroll` at 50 and 90 percent, `outbound_click`, `internal_recirculation`, `affiliate_click`, and explicitly tagged CTA events such as `newsletter_signup`. Use `data-analytics-event`, `data-merchant`, and `data-placement` on new monetized links. Tool and commerce flows should emit `tool_start`, `tool_complete`, `tool_error`, `product_cta`, `checkout_start`, `purchase`, or `generate_lead` through `window.gtag`.

Account activation remains fail-closed until an owner:

1. Creates the `astrokobi.com` GA4 web stream in the portfolio property and adds the measurement ID as a GitHub Actions variable.
2. Registers the event parameters used here as GA4 custom dimensions where reporting requires them.
3. Links that GA4 property to the existing AdSense account.
4. Creates and verifies a Search Console domain property for `astrokobi.com`.
5. Installs and verifies a Google-certified CMP before setting `NEXT_PUBLIC_GOOGLE_CERTIFIED_CMP_ACTIVE=true`. AdSense serving is disabled until that flag is explicitly active.
6. Adds real affiliate IDs only after approval and keeps a clear disclosure near each recommendation.
