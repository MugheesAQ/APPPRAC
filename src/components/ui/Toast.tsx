import * as React from "react";
import { X, CheckCircle, AlertTriangle, Info, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export type ToastType = "success" | "warning" | "info" | "error";

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  title?: string;
}

interface ToastProps {
  toasts: ToastItem[];
  onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed top-5 right-5 z-[100] flex flex-col gap-3.5 w-full max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  );
};

interface ToastCardProps {
  toast: ToastItem;
  onRemove: (id: string) => void;
}

const ToastCard: React.FC<ToastCardProps> = ({ toast, onRemove }) => {
  const { id, message, type, title } = toast;

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(id);
    }, 4500);
    return () => clearTimeout(timer);
  }, [id, onRemove]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-600 shrink-0" />,
    error: <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />,
  };

  const borders = {
    success: "border-emerald-100 dark:border-emerald-950 bg-emerald-50/90 dark:bg-emerald-950/40",
    warning: "border-amber-100 dark:border-amber-950 bg-amber-50/90 dark:bg-amber-950/40",
    info: "border-sky-100 dark:border-sky-950 bg-sky-50/90 dark:bg-sky-950/40",
    error: "border-rose-100 dark:border-rose-950 bg-rose-50/90 dark:bg-rose-950/40",
  };

  const defaultTitles = {
    success: "Operation Successful",
    warning: "Action Required",
    info: "Notice",
    error: "System Check Failed",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95, x: 50 }}
      animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.9, x: 80, transition: { duration: 0.2 } }}
      className={`
        pointer-events-auto border rounded-2xl p-4 shadow-xl flex gap-3 relative overflow-hidden backdrop-blur-md
        ${borders[type]}
      `}
    >
      {/* Icon slot */}
      {icons[type]}

      {/* Message content */}
      <div className="flex-1 text-left">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-gray-150 mb-0.5">
          {title || defaultTitles[type]}
        </h4>
        <p className="text-sm font-medium text-slate-800 dark:text-gray-300">
          {message}
        </p>
      </div>

      {/* Dismiss Button */}
      <button
        onClick={() => onRemove(id)}
        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer self-start p-0.5"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Dynamic timer progress bar */}
      <motion.div
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: 4.5, ease: "linear" }}
        className={`
          absolute bottom-0 left-0 h-1
          ${type === "success" ? "bg-emerald-500" : ""}
          ${type === "warning" ? "bg-amber-500" : ""}
          ${type === "info" ? "bg-sky-500" : ""}
          ${type === "error" ? "bg-rose-500" : ""}
        `}
      />
    </motion.div>
  );
};

// Global context hook for trigger to avoid file-spanning hook requirements
let toastIds = 0;
let globalAddToast: ((message: string, type: ToastType, title?: string) => void) | null = null;

export function showToast(message: string, type: ToastType = "success", title?: string) {
  if (globalAddToast) {
    globalAddToast(message, type, title);
  } else {
    console.warn("Toast system not initialized yet:", { message, type });
  }
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const addToast = React.useCallback((message: string, type: ToastType, title?: string) => {
    const id = `toast-${toastIds++}`;
    setToasts((prev) => [...prev, { id, message, type, title }]);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  React.useEffect(() => {
    globalAddToast = addToast;
    return () => {
      globalAddToast = null;
    };
  }, [addToast]);

  return (
    <>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
};
