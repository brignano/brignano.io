"use client";

import { useEffect, useState } from "react";

type Props = { iso?: string | null };

export default function LocalTime({ iso }: Props) {
  if (!iso) return null;

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(t);
  }, []);

  const then = new Date(iso).getTime();
  const diff = Math.max(0, Math.floor((now - then) / 1000));

  let relative = "";
  if (diff < 60) relative = `${diff}s ago`;
  else {
    const mins = Math.floor(diff / 60);
    if (mins < 60) relative = `${mins}m ago`;
    else {
      const hrs = Math.floor(mins / 60);
      if (hrs < 24) relative = `${hrs}h ago`;
      else relative = `${Math.floor(hrs / 24)}d ago`;
    }
  }

  const title = new Date(iso).toLocaleString(undefined, {
    timeZoneName: "short",
  });

  return (
    <time
      dateTime={iso}
      title={title}
      className="ml-2 text-xs text-zinc-500 dark:text-zinc-500"
    >
      {relative}
    </time>
  );
}
