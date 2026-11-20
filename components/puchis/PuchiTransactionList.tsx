"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import EmptyState from "@/components/common/EmptyState";
import { usePuchis } from "@/components/puchis/PuchiProvider";
import { fetchPuchiHistory, PuchiRequestError } from "@/lib/puchi-client";
import type { PuchiHistoryPage } from "@/lib/puchi-types";

const PAGE_SIZE = 20;

function HistorySkeleton() {
  return (
    <ul aria-label="Loading puchi history" className="card-surface space-y-4">
      {Array.from({ length: 4 }, (_, index) => (
        <li key={index} aria-hidden="true" className="flex items-center gap-4">
          <span className="h-12 w-12 animate-pulse rounded-full bg-[#F4E9E7]" />
          <span className="h-4 flex-1 animate-pulse rounded bg-[#F4E9E7]" />
        </li>
      ))}
    </ul>
  );
}

function errorMessage(error: unknown) {
  if (error instanceof PuchiRequestError && error.code === "not_connected") {
    return "Connect with your partner to start sharing puchis.";
  }
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}

export default function PuchiTransactionList() {
  const { sentRevision } = usePuchis();
  const [history, setHistory] = useState<PuchiHistoryPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryIndex, setRetryIndex] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    fetchPuchiHistory(1, PAGE_SIZE, controller.signal)
      .then((response) => {
        setHistory(response.data);
        setError(null);
      })
      .catch((reason: unknown) => {
        if (controller.signal.aborted || (reason instanceof DOMException && reason.name === "AbortError")) return;
        setError(errorMessage(reason));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [retryIndex, sentRevision]);

  async function loadMore() {
    if (!history?.hasMore || loadingMore) return;
    setLoadingMore(true);
    setError(null);
    try {
      const response = await fetchPuchiHistory(history.page + 1, PAGE_SIZE);
      setHistory((previous) =>
        previous
          ? {
              ...response.data,
              items: [...previous.items, ...response.data.items],
            }
          : response.data,
      );
    } catch (reason) {
      setError(errorMessage(reason));
    } finally {
      setLoadingMore(false);
    }
  }

  if (loading) return <HistorySkeleton />;
  if (error && !history) {
    return (
      <div role="alert" className="card-surface text-sm leading-6 text-[#766d69]">
        <p>{error}</p>
        <button
          type="button"
          onClick={() => {
            setLoading(true);
            setError(null);
            setRetryIndex((value) => value + 1);
          }}
          className="mt-3 font-medium text-[#A35C69] underline"
        >
          Try again
        </button>
      </div>
    );
  }
  if (!history || history.items.length === 0) {
    return <EmptyState message="Your puchi moments will appear here." />;
  }

  return (
    <section aria-label="Puchi transaction history">
      <ul
        aria-label="Puchi transactions"
        tabIndex={0}
        className="max-h-80 overflow-x-hidden overflow-y-auto overscroll-contain rounded-[var(--radius-card)] border border-[#F0E8E3] bg-white shadow-sm sm:max-h-96"
      >
        {history.items.map((item) => (
          <li key={item.id} className="flex items-center gap-4 border-b border-[#F0E8E3] p-4 last:border-b-0 sm:px-6">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#F9ECEE] font-serif text-lg text-[#A35C69]">
              {item.senderAvatar ? (
                <Image
                  src={item.senderAvatar}
                  alt=""
                  fill
                  unoptimized
                  className="object-cover"
                />
              ) : (
                item.senderName.charAt(0).toUpperCase()
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold">
                {item.sentByMe
                  ? `You sent a puchi to ${history.partnerDisplayName}`
                  : `${item.senderName} sent you a puchi`}
              </p>
              <time
                dateTime={item.createdAt}
                className="mt-1 block text-xs text-[#766d69]"
              >
                {new Date(item.createdAt).toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </time>
            </div>
          </li>
        ))}
      </ul>
      {error && <p role="alert" className="mt-3 text-sm text-[#8F4E5A]">{error}</p>}
      {history.hasMore && (
        <button
          type="button"
          onClick={() => void loadMore()}
          disabled={loadingMore}
          className="button-secondary mt-4"
        >
          {loadingMore ? "Loading…" : "Load more"}
        </button>
      )}
    </section>
  );
}
