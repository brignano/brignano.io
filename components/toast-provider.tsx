"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Toast from "@/components/toast";

interface ToastContextValue {
  showToast: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}

interface ToastItem {
  id: number;
  message: string;
  duration: number;
}

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const showToast = useCallback((message: string, duration = 3000) => {
    const id = ++nextId.current;
    setToasts((prev) => [...prev, { id, message, duration }]);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Design's toast region: in the page from the start, empty, so the
          live region hears what is added to it. Centred at every width, not
          bottom-right, where the chat button sits. */}
      <div className="toast-region min-[40rem]:left-5 min-[40rem]:items-center">
        <div className="toast-list" role="status">
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              message={toast.message}
              duration={toast.duration}
              onDismiss={() => dismiss(toast.id)}
            />
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}
