export const GA_MEASUREMENT_ID = 'G-QGJLCCQ9X8';

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = (action: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, params);
  }
};

// Extend window type for gtag
declare global {
  interface Window {
    gtag?: {
      (command: 'config', targetId: string, config?: Record<string, any>): void;
      (command: 'event', eventName: string, eventParams?: Record<string, any>): void;
      (command: 'js', date: Date): void;
    };
  }
}
