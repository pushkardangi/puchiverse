"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LoaderCircle } from "lucide-react";
import HugAnimation from "@/components/home/HugAnimation";
import { acknowledgeHug, fetchPendingHugs, VirtualHugRequestError } from "@/lib/virtual-hug-client";
import type { VirtualHug } from "@/lib/virtual-hug-types";

function ReceivedHug({
  hug,
  remaining,
  saving,
  error,
  onContinue,
}: {
  hug: VirtualHug;
  remaining: number;
  saving: boolean;
  error: string;
  onContinue: () => void;
}) {
  const [ready, setReady] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [retry, setRetry] = useState(0);
  const dialogRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    const keepFocus = (event: KeyboardEvent) => {
      if (event.key === "Escape") event.preventDefault();
      if (event.key === "Tab") {
        event.preventDefault();
        (buttonRef.current ?? dialogRef.current)?.focus();
      }
    };
    window.addEventListener("keydown", keepFocus);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", keepFocus);
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, []);

  useEffect(() => {
    if (!loaded || imageError) return;
    const timer = setTimeout(() => setReady(true), 6000);
    return () => clearTimeout(timer);
  }, [loaded, imageError]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#FAF8F5] p-5">
      <section ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="virtual-hug-title" className="w-full max-w-md rounded-[30px] border border-[#E9DDD8] bg-white p-6 text-center shadow-xl sm:p-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A35C69]">A little closeness</p>
        <h2 id="virtual-hug-title" className="mt-2 font-serif text-3xl text-[#3E3131]">You received a hug</h2>
        <p className="mt-2 text-sm text-[#7B6F6B]">A little warmth from your person.</p>
        <HugAnimation key={retry} gifFileName={hug.gifFileName} playbackId={`${hug.id}-${retry}`} onLoad={() => setLoaded(true)} onError={() => setImageError(true)} />
        {remaining > 0 && <p className="mb-3 text-xs text-[#766d69]">{remaining} more {remaining === 1 ? "hug" : "hugs"} waiting</p>}
        {imageError ? (
          <div role="alert" className="text-sm text-[#9A4652]">
            <p>We couldn&apos;t load your hug.</p>
            <button ref={buttonRef} type="button" onClick={() => { setReady(false); setLoaded(false); setImageError(false); setRetry((value) => value + 1); }} className="button-secondary mt-3">Try again</button>
          </div>
        ) : ready ? (
          <>
            {error && <p role="alert" className="mb-3 text-xs text-[#9A4652]">{error}</p>}
            <button ref={buttonRef} type="button" disabled={saving} onClick={onContinue} className="button-primary disabled:opacity-60">
              {saving && <LoaderCircle aria-hidden="true" size={16} className="animate-spin" />}
              {saving ? "Saving…" : "Continue"}
            </button>
          </>
        ) : <p role="status" className="text-sm text-[#766d69]">Take a moment to enjoy your hug.</p>}
      </section>
    </div>
  );
}

export default function VirtualHugInbox() {
  const [hugs, setHugs] = useState<VirtualHug[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    fetchPendingHugs(controller.signal)
      .then(({ data }) => setHugs(data))
      .catch((reason: unknown) => {
        if (controller.signal.aborted) return;
        if (reason instanceof VirtualHugRequestError && reason.code === "not_connected") return;
        setError(reason instanceof Error ? reason.message : "Could not load your hugs. Please try again.");
      });
    return () => controller.abort();
  }, [attempt]);

  const dismiss = useCallback(async () => {
    if (!hugs[0] || savingRef.current) return;
    savingRef.current = true;
    setSaving(true);
    setError("");
    try {
      await acknowledgeHug(hugs[0].id);
      setHugs((current) => current.slice(1));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not acknowledge your hug. Please try again.");
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }, [hugs]);

  if (!hugs.length) {
    return error ? (
      <div role="alert" className="mx-5 mb-4 rounded-xl bg-[#FFF0EF] px-4 py-3 text-xs text-[#9A4652]">
        {error}{" "}
        <button type="button" className="underline" onClick={() => { setError(""); setAttempt((n) => n + 1); }}>Try again</button>
      </div>
    ) : null;
  }

  return <ReceivedHug key={hugs[0].id} hug={hugs[0]} remaining={hugs.length - 1} saving={saving} error={error} onContinue={dismiss} />;
}
