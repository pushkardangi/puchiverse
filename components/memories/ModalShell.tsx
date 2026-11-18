"use client";

import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";

type ModalShellProps = {
  titleId: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
};

export default function ModalShell({
  titleId,
  onClose,
  children,
  className = "",
}: ModalShellProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-[#302626]/45 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative max-h-[94dvh] w-full overflow-hidden border border-[#E9DDD8] bg-[#FAF8F5] shadow-2xl sm:max-w-2xl rounded-[30px] ${className}`}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-[#E8DDD8] bg-white/90 text-[#6F6260] shadow-sm backdrop-blur hover:bg-white"
        >
          <X aria-hidden="true" size={18} />
        </button>
        <div className="max-h-[94dvh] overflow-y-auto">{children}</div>
      </section>
    </div>
  );
}
