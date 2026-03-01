"use client";

import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  duration?: number;
  onDismiss: () => void;
}

export default function Toast({ message, duration = 3000, onDismiss }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fadeDuration = 300;
    const hideDelay = Math.max(0, duration - fadeDuration);
    // Trigger fade-in on next frame
    const show = requestAnimationFrame(() => setVisible(true));
    const hide = setTimeout(() => setVisible(false), hideDelay);
    const dismiss = setTimeout(onDismiss, duration);
    return () => {
      cancelAnimationFrame(show);
      clearTimeout(hide);
      clearTimeout(dismiss);
    };
  }, [duration, onDismiss]);

  return (
    <div
      className={`relative z-50 px-5 py-3 rounded-lg shadow-lg text-sm font-medium transition-all duration-300 dark:bg-zinc-800 bg-white dark:text-zinc-100 text-zinc-800 border dark:border-zinc-700 border-zinc-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
    >
      {message}
    </div>
  );
}
