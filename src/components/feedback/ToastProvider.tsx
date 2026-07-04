import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { CheckCircle, SpinnerGap, WarningCircle, X } from "@phosphor-icons/react";
import type { ToastKind } from "../../types";

type Toast = {
  id: number;
  kind: ToastKind;
  message: string;
};

type ToastContextValue = {
  showToast: (kind: ToastKind, message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((items) => items.filter((item) => item.id !== id));
  }, []);

  const showToast = useCallback((kind: ToastKind, message: string) => {
    const id = Date.now() + Math.round(Math.random() * 1000);
    setToasts((items) => [...items.slice(-2), { id, kind, message }]);
    window.setTimeout(() => dismiss(id), kind === "processing" ? 2100 : 2600);
  }, [dismiss]);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-stack" aria-live="polite" aria-atomic="true">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={() => dismiss(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return context;
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const Icon =
    toast.kind === "success" ? CheckCircle : toast.kind === "processing" ? SpinnerGap : WarningCircle;

  return (
    <div className="toast-item" data-kind={toast.kind}>
      <Icon size={18} weight={toast.kind === "processing" ? "regular" : "fill"} />
      <span>{toast.message}</span>
      <button className="toast-close theme-pressable" onClick={onDismiss} aria-label="关闭提示">
        <X size={14} />
      </button>
    </div>
  );
}
