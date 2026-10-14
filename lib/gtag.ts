// Read on the server only (app/layout.tsx). Not NEXT_PUBLIC_, so client
// bundles see it as undefined — keep client code on `event()` below, which
// doesn't need the ID.
export const GA_MEASUREMENT_ID = process.env.GA_MEASUREMENT_ID ?? "";

// Page views (including client-side navigations) are recorded by GA4's
// enhanced measurement, so there is no manual pageview helper.

// https://developers.google.com/analytics/devguides/collection/ga4/events
export const event = (action: string, params?: Record<string, unknown>) => {
  if (typeof window !== "undefined" && typeof window.gtag !== "undefined") {
    window.gtag("event", action, params);
  }
};
