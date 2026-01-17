export const GA_MEASUREMENT_ID = 'G-QGJLCCQ9X8';

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
      cookie_domain: 'auto',
      linker: { domains: ['brignano.io', 'resume.brignano.io'] }
    });
  }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = (
  action: string,
  params?: Record<string, unknown>
) => {
  if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
    window.gtag('event', action, params);
  }
};


