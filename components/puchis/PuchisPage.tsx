"use client";

import { Sparkles } from "lucide-react";
import PuchiCounterCard from "@/components/home/PuchiCounterCard";
import PuchiTransactionList from "@/components/puchis/PuchiTransactionList";
import { usePuchis } from "@/components/puchis/PuchiProvider";

export default function PuchisPage() {
  const { summary, loading } = usePuchis();

  return (
    <div className="space-y-6">
      <section className="rounded-[var(--radius-feature)] bg-[#EEDDDD] p-6 sm:p-8">
        <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-[#80595f]">
          <Sparkles aria-hidden="true" size={14} /> A little love, always
        </span>
        <h1 className="mt-4 text-3xl font-medium tracking-tight sm:text-4xl">
          Our puchis <span className="text-[#A35C69]">♡</span>
        </h1>
        <p className="mt-3 max-w-md text-sm leading-6 text-[#705c5d]">
          Every little puchi is another moment of us.
        </p>
      </section>

      <div className="grid gap-6 md:grid-cols-2 md:items-start">
        <PuchiCounterCard showViewAll={false} />
        <section aria-labelledby="puchi-stats-title">
          <div className="mb-3 flex min-h-11 items-center">
            <h2 id="puchi-stats-title" className="text-lg font-semibold tracking-tight">
              Our puchi stats
            </h2>
          </div>
          {loading ? (
            <div aria-label="Loading puchi stats" className="card-surface h-40 animate-pulse bg-white" />
          ) : summary ? (
            <div className="card-surface grid grid-cols-2 gap-5">
              <div>
                <p className="text-xs text-[#766d69]">Sent by me</p>
                <p className="mt-1 text-2xl font-semibold">{summary.sentByMe}</p>
              </div>
              <div>
                <p className="text-xs text-[#766d69]">Received by me</p>
                <p className="mt-1 text-2xl font-semibold">{summary.receivedByMe}</p>
              </div>
            </div>
          ) : (
            <p className="card-surface text-sm leading-6 text-[#766d69]">
              Puchi stats are available when you are connected with your partner.
            </p>
          )}
        </section>
      </div>

      <section aria-labelledby="puchi-history-title">
        <div className="mb-3 flex min-h-11 items-center">
          <h2 id="puchi-history-title" className="text-lg font-semibold tracking-tight">
            Puchi history
          </h2>
        </div>
        <PuchiTransactionList />
      </section>
    </div>
  );
}
