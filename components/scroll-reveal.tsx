"use client";

import { useEffect } from "react";

/**
 * Scroll reveal — a small, dependency-free replacement for AOS.
 *
 * Hard guarantee: content is FULLY VISIBLE by default (SSR / no-JS / reduced
 * motion / setup failure), and any element that is in view will be revealed.
 * Content can never get stuck invisible. The fade/translate is a progressive
 * enhancement that only applies once `js-reveal` is on <html>.
 *
 * Why this is layered rather than "just an IntersectionObserver":
 * - AOS (the thing being replaced) measured trigger offsets once at init, so
 *   async content (the GitHub calendar) growing the page left later elements —
 *   including the home contact CTA — stuck at opacity:0 forever.
 * - A lone IntersectionObserver is unreliable for nodes that mount collapsed
 *   during streaming / client navigation, and its callbacks can be throttled.
 * - Manual `window.innerHeight` math is unreliable (it can read 0 in embedded
 *   contexts).
 * So we combine: IO for efficient scroll reveal, a scroll/resize fallback that
 * measures with `clientHeight`, and a MutationObserver for streamed/navigated
 * nodes — every path funnels through the same idempotent `reveal`, and if the
 * viewport can't be measured at all we fail open (reveal everything).
 *
 * Reads the existing `data-aos`, `data-aos-duration`, and `data-aos-delay`
 * attributes so page markup is unchanged.
 */
export default function ScrollReveal() {
  useEffect(() => {
    const root = document.documentElement;

    // Respect reduced motion: leave everything visible, add no enhancement.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.classList.remove("js-reveal");
      return;
    }

    let io: IntersectionObserver | null = null;
    let mo: MutationObserver | null = null;
    let ticking = false;

    const reveal = (el: HTMLElement) => {
      if (el.classList.contains("is-visible")) return;
      const d = el.getAttribute("data-aos-duration");
      const dl = el.getAttribute("data-aos-delay");
      if (d) el.style.setProperty("--reveal-duration", `${d}ms`);
      if (dl) el.style.setProperty("--reveal-delay", `${dl}ms`);
      el.classList.add("is-visible");
      io?.unobserve(el);
    };

    // Fallback reveal that does not depend on IO callbacks being delivered.
    const revealInView = () => {
      // clientHeight is reliable where innerHeight can read 0.
      const vh = document.documentElement.clientHeight || window.innerHeight || 0;
      document
        .querySelectorAll<HTMLElement>("[data-aos]:not(.is-visible)")
        .forEach((el) => {
          if (vh === 0) {
            reveal(el); // can't measure → fail open
            return;
          }
          const r = el.getBoundingClientRect();
          if (r.bottom > 0 && r.top < vh * 0.95) reveal(el);
        });
    };

    const observeAll = () => {
      document
        .querySelectorAll<HTMLElement>("[data-aos]:not(.is-visible)")
        .forEach((el) => {
          io!.unobserve(el);
          io!.observe(el);
        });
    };

    const schedule = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        observeAll();
        revealInView();
      });
    };

    try {
      root.classList.add("js-reveal");

      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) reveal(entry.target as HTMLElement);
          }
        },
        { rootMargin: "0px 0px -5% 0px", threshold: 0.01 }
      );

      observeAll();
      revealInView();

      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", schedule, { passive: true });

      // Catch nodes that mount during streaming / client-side navigation.
      mo = new MutationObserver(() => {
        schedule();
        window.setTimeout(() => {
          observeAll();
          revealInView();
        }, 120);
      });
      mo.observe(document.body, { childList: true, subtree: true });
    } catch {
      // Anything goes wrong → revert to fully-visible content.
      root.classList.remove("js-reveal");
      io?.disconnect();
      mo?.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      return;
    }

    return () => {
      io?.disconnect();
      mo?.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return null;
}
