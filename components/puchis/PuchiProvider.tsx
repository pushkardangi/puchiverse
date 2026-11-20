"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { PuchiRequestError, fetchPuchiSummary, sendPuchiRequest } from "@/lib/puchi-client";
import type { ApiErrorCode } from "@/lib/relationship-types";
import type { PuchiSummary } from "@/lib/puchi-types";

type PuchiContextValue = {
  summary: PuchiSummary | null;
  loading: boolean;
  sending: boolean;
  error: string | null;
  errorCode: ApiErrorCode | null;
  sentRevision: number;
  reload: () => Promise<void>;
  sendPuchi: () => Promise<boolean>;
};

const PuchiContext = createContext<PuchiContextValue | null>(null);

function errorDetails(error: unknown) {
  return error instanceof PuchiRequestError
    ? { message: error.message, code: error.code }
    : { message: "Something went wrong. Please try again.", code: "server_error" as const };
}

export function PuchiProvider({ children }: { children: ReactNode }) {
  const [summary, setSummary] = useState<PuchiSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<ApiErrorCode | null>(null);
  const [sentRevision, setSentRevision] = useState(0);
  const idempotencyKey = useRef<string | null>(null);
  const sendingRef = useRef(false);

  const loadSummary = useCallback(async (signal?: AbortSignal) => {
    try {
      const response = await fetchPuchiSummary(signal);
      setSummary(response.data);
    } catch (reason) {
      if (signal?.aborted || (reason instanceof DOMException && reason.name === "AbortError")) return;
      const details = errorDetails(reason);
      setError(details.message);
      setErrorCode(details.code);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchPuchiSummary(controller.signal)
      .then((response) => setSummary(response.data))
      .catch((reason: unknown) => {
        if (controller.signal.aborted || (reason instanceof DOMException && reason.name === "AbortError")) return;
        const details = errorDetails(reason);
        setError(details.message);
        setErrorCode(details.code);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  const sendPuchi = useCallback(async () => {
    if (sendingRef.current || !summary) return false;
    sendingRef.current = true;
    setSending(true);
    setError(null);
    setErrorCode(null);
    idempotencyKey.current ??= crypto.randomUUID();

    try {
      const response = await sendPuchiRequest(idempotencyKey.current);
      setSummary(response.data);
      idempotencyKey.current = null;
      setSentRevision((revision) => revision + 1);
      return true;
    } catch (reason) {
      const details = errorDetails(reason);
      setError(details.message);
      setErrorCode(details.code);
      return false;
    } finally {
      sendingRef.current = false;
      setSending(false);
    }
  }, [summary]);

  const reload = useCallback(() => {
    setLoading(true);
    setError(null);
    setErrorCode(null);
    return loadSummary();
  }, [loadSummary]);

  return (
    <PuchiContext.Provider
      value={{
        summary,
        loading,
        sending,
        error,
        errorCode,
        sentRevision,
        reload,
        sendPuchi,
      }}
    >
      {children}
    </PuchiContext.Provider>
  );
}

export function usePuchis() {
  const context = useContext(PuchiContext);
  if (!context) {
    throw new Error("usePuchis must be used within PuchiProvider");
  }
  return context;
}
