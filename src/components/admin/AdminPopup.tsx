"use client";

import { useEffect } from "react";

export function AdminPopup({
  title,
  message,
  onClose,
  children,
}: {
  title: string;
  message: string;
  onClose?: () => void;
  children?: React.ReactNode;
}) {
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose?.();
    }
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/55 px-5 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-popup-title"
      onClick={onClose}
    >
      <div
        className="admin-popup w-full max-w-md overflow-hidden border border-gold/40 bg-paper shadow-[0_24px_60px_rgba(11,11,11,0.28)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="h-1.5 bg-gradient-to-r from-gold via-accent to-gold" />
        <div className="px-6 py-7 sm:px-8 sm:py-8">
          <p className="text-[11px] tracking-[0.28em] text-gold uppercase">BEAMY Catalogue</p>
          <h2 id="admin-popup-title" className="mt-3 font-serif text-3xl leading-tight text-ink">
            {title}
          </h2>
          <div className="gold-rule mt-4" />
          <p className="mt-4 text-sm leading-6 text-muted">{message}</p>
          {children ?? (
            <button type="button" className="admin-primary mt-8" onClick={onClose}>
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
