"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import HolidayGreeting from "@/components/holiday-greeting";
import { useHoliday } from "@/lib/use-holiday";

// The bar under the header shows up only for a holiday: one greeting and a
// way to close it (ADR-0006). The clock, last commit and "building" list it
// used to carry meant little to most visitors, so the rest of the year there
// is no bar at all.
//
// The holiday is only known after hydration, so the bar's slot (one line,
// plus the margin that gives the page its top space) is always there and the
// bar is laid over it. Appearing or closing never moves the page.
export default function NowBar() {
  const { holiday, off, toggle } = useHoliday();
  const show = Boolean(holiday && !off);

  return (
    <div data-print-hide className="relative h-[2.3125rem] lg:mb-28 mb-10">
      {show && (
        <div className="absolute inset-x-0 top-0 border-b border-line font-mono text-xs text-slate md:px-16 px-6">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 min-h-9">
            <HolidayGreeting />
            <button
              type="button"
              onClick={toggle}
              aria-label="Close this greeting"
              title="Close"
              className="cursor-pointer -mr-2 grid place-items-center size-9 pointer-coarse:size-11 rounded-sm text-slate hover:text-ink focus-visible:ring-2 focus-visible:ring-interactive-ink"
            >
              <XMarkIcon
                className="size-4"
                strokeWidth={2}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
