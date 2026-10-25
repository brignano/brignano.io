"use client";

import { useEffect, useRef, useState } from "react";

/**
 * True once the referenced element has come within `rootMargin` of the
 * viewport, and stays true. For mounting heavy client-only widgets (the
 * contribution calendar) only when a visitor is about to see them, so their
 * JavaScript is fetched and evaluated outside the initial load instead of
 * adding to it. Observes once and disconnects.
 */
export function useNearViewport<T extends HTMLElement>(rootMargin = "300px") {
  const ref = useRef<T>(null);
  // Without IntersectionObserver there is nothing to wait for, so start
  // revealed. (On the server the check is also true, which is harmless: the
  // widgets gated by this hook render nothing on the server regardless.)
  const [near, setNear] = useState(
    () => typeof IntersectionObserver === "undefined"
  );

  useEffect(() => {
    const el = ref.current;
    if (!el || near) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [near, rootMargin]);

  return [ref, near] as const;
}
