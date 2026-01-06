"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

export type ToastType = "success" | "error" | "info";

export type Toast = {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number; // ms
};

type ToastContextValue = {
  showToast: (toast: Omit<Toast, "id">) => string;
  removeToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const generateId = () => Math.random().toString(36).slice(2, 9);

export default function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  type ToastItem = {
    id: string;
    type: "success" | "error" | "info";
    title?: string;
    message: string;
  };

  const TOAST_STYLES: Record<
    ToastItem["type"],
    {
      bg: string;
      text: string;
      icon: string;
      iconBg: string;
    }
  > = {
    success: {
      bg: "bg-emerald-200 dark:bg-emerald-800",
      text: "text-emerald-900 dark:text-emerald-100",
      icon: "✓",
      iconBg: "bg-white/10 text-emerald-400",
    },
    error: {
      bg: "bg-red-200 dark:bg-red-800",
      text: "text-red-900 dark:text-red-100",
      icon: "!",
      iconBg: "bg-white/10 text-red-400",
    },
    info: {
      bg: "bg-blue-200 dark:bg-blue-800",
      text: "text-blue-900 dark:text-blue-100",
      icon: "i",
      iconBg: "bg-white/10 text-blue-400",
    },
  };

  const showToast = useCallback((t: Omit<Toast, "id">) => {
    const id = generateId();
    const toast: Toast = { id, ...t };
    setToasts((s) => [toast, ...s]);
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((s) => s.filter((x) => x.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};

function ToastContainer({
  toasts,
  onRemove,
}: {
  toasts: Toast[];
  onRemove: (id: string) => void;
}) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
      {toasts.map((t) => (
        <ToastView key={t.id} toast={t} onClose={() => onRemove(t.id)} />
      ))}
    </div>
  );
}

function ToastView({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const { id, type, title, message, duration = 4000 } = toast;

  useEffect(() => {
    const timer = setTimeout(() => onClose(), duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles: Record<ToastType, string> = {
    success: "bg-emerald-50 border border-emerald-300 dark:bg-emerald-900/40",
    error: "bg-red-50 border border-red-300 dark:bg-red-900/40",
    info: "bg-blue-50 border border-blue-300 dark:bg-blue-900/40",
  };

  return (
    <div
      className={`w-full max-w-xs rounded-xl p-3 shadow-md flex items-start gap-3 ${styles[type]}`}
    >
      <div className="flex-shrink-0 mt-0.5">
        {type === "success" && "✔️"}
        {type === "error" && "❌"}
        {type === "info" && "ℹ️"}
      </div>

      <div className="flex-1">
        {title && <div className="font-semibold text-sm mb-1">{title}</div>}
        <div className="text-sm text-gray-700 dark:text-gray-200">
          {message}
        </div>
      </div>

      <button onClick={onClose} className="opacity-70 hover:opacity-100">
        ✕
      </button>
    </div>
  );
}
