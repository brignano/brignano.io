"use client";

import { useEffect, useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/20/solid";

interface ToastProps {
  message: string;
  duration?: number;
  onDismiss: () => void;
}

// Design's .toast-success. It fades in on its own (@starting-style); to leave
// it sets data-leaving and is taken out once that transition ends, or after
// 200ms, whichever comes first (DESIGN.md §14, toast).
export default function Toast({ message, duration = 3000, onDismiss }: ToastProps) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const leave = setTimeout(() => setLeaving(true), duration);
    return () => clearTimeout(leave);
  }, [duration]);

  useEffect(() => {
    if (!leaving) return;
    const gone = setTimeout(onDismiss, 200);
    return () => clearTimeout(gone);
  }, [leaving, onDismiss]);

  return (
    <div
      className="toast toast-success"
      data-leaving={leaving ? "" : undefined}
      onTransitionEnd={() => leaving && onDismiss()}
    >
      <CheckCircleIcon aria-hidden="true" />
      <div className="toast-content">
        <p className="toast-title">{message}</p>
      </div>
    </div>
  );
}
