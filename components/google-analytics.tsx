"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import * as gtag from "@/lib/gtag";

function GoogleAnalyticsInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      const search = searchParams?.toString();
      const url = pathname + (search ? `?${search}` : "");
      gtag.pageview(url);
    }
  }, [pathname, searchParams]);

  return null;
}

export default function GoogleAnalytics() {
  return (
    <Suspense fallback={null}>
      <GoogleAnalyticsInner />
    </Suspense>
  );
}
