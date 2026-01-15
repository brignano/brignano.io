export const GA_MEASUREMENT_ID = 'G-QGJLCCQ9X8';

// Default engagement time for user_engagement events (in milliseconds)
const DEFAULT_ENGAGEMENT_TIME_MSEC = 100;

/**
 * Wait for gtag to be available on the window object.
 * Polls every 50ms for up to timeout milliseconds.
 * @param timeout - Maximum time to wait in milliseconds (default: 3000)
 * @returns Promise that resolves to true if gtag is available, false if timeout
 */
export const waitForGtag = (timeout: number = 3000): Promise<boolean> => {
  if (typeof window === 'undefined') {
    return Promise.resolve(false);
  }

  if (window.gtag) {
    return Promise.resolve(true);
  }

  return new Promise((resolve) => {
    const startTime = Date.now();
    const pollInterval = 50;

    const checkGtag = () => {
      if (window.gtag) {
        resolve(true);
      } else if (Date.now() - startTime >= timeout) {
        resolve(false);
      } else {
        setTimeout(checkGtag, pollInterval);
      }
    };

    checkGtag();
  });
};

/**
 * Ensure window.dataLayer is initialized.
 * Safe to call multiple times.
 */
export const ensureDataLayer = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  if (!window.dataLayer) {
    window.dataLayer = [];
  }
};

/**
 * Send an event to Google Analytics.
 * Waits for gtag to be available, or falls back to dataLayer.
 * @param name - Event name
 * @param params - Event parameters
 * @returns Promise that resolves to true if sent via gtag, false if queued to dataLayer
 */
export const sendEvent = async (
  name: string,
  params?: Record<string, any>
): Promise<boolean> => {
  if (typeof window === 'undefined') {
    return false;
  }

  const gtagAvailable = await waitForGtag();

  if (gtagAvailable && window.gtag) {
    window.gtag('event', name, params);
    return true;
  }

  // Fallback to dataLayer
  ensureDataLayer();
  window.dataLayer?.push({
    event: name,
    ...params,
  });
  return false;
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = async (url: string): Promise<void> => {
  if (typeof window === 'undefined') {
    return;
  }

  const gtagAvailable = await waitForGtag();

  if (gtagAvailable && window.gtag) {
    // Send config event
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });

    // Send user_engagement event to improve realtime active sessions
    await sendEvent('user_engagement', {
      engagement_time_msec: DEFAULT_ENGAGEMENT_TIME_MSEC,
    });
  } else {
    // Fallback to dataLayer
    ensureDataLayer();
    window.dataLayer?.push({
      event: 'page_view',
      page_path: url,
    });
    
    // Also queue user_engagement
    window.dataLayer?.push({
      event: 'user_engagement',
      engagement_time_msec: DEFAULT_ENGAGEMENT_TIME_MSEC,
    });
  }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = (action: string, params?: Record<string, any>): void => {
  // Fire and forget - use sendEvent internally with error handling
  sendEvent(action, params).catch((err) => {
    if (typeof console !== 'undefined') {
      console.error('GA event error:', err);
    }
  });
};

// Extend window type for gtag and dataLayer
declare global {
  interface Window {
    gtag?: {
      (command: 'config', targetId: string, config?: Record<string, any>): void;
      (command: 'event', eventName: string, eventParams?: Record<string, any>): void;
      (command: 'js', date: Date): void;
    };
    dataLayer?: any[];
  }
}
