"use client";

import { Heart, Sparkles } from "lucide-react";
import EmptyState from "@/components/common/EmptyState";
import PuchiCounterCard from "@/components/home/PuchiCounterCard";
import { usePuchis } from "@/components/puchis/PuchiProvider";
import DailyPuchiStats from "@/components/puchis/DailyPuchiStats";

export default function PuchisPage() {
  const { history } = usePuchis();

  return (
    <div className="space-y-6">
      <section className="rounded-[var(--radius-feature)] bg-[#EEDDDD] p-6 sm:p-8">
        <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-[#80595f]">
          <Sparkles aria-hidden="true" size={14} /> A little love, always
        </span>
        <h1 className="mt-4 text-3xl font-medium tracking-tight sm:text-4xl">Our puchis <span className="text-[#A35C69]">♡</span></h1>
        <p className="mt-3 max-w-md text-sm leading-6 text-[#705c5d]">
          Every little puchi is another moment of us.
        </p>
      </section>

      <p className="text-xs leading-5 text-[#766d69]">
        Demo only: puchis are kept in this session and aren&apos;t delivered yet.
      </p>

      <div className="grid gap-6 md:grid-cols-2 md:items-start">
        <PuchiCounterCard showViewAll={false} />
        <section aria-labelledby="puchi-history">
          <div className="mb-3 flex min-h-11 items-center">
            <h2 id="puchi-history" className="text-lg font-semibold tracking-tight">Recent puchis</h2>
          </div>
          {history.length === 0 ? (
            <EmptyState message="Puchis you send during this session will appear here." />
          ) : (
            <ul tabIndex={0} aria-labelledby="puchi-history" className="max-h-60 sm:max-h-80 overflow-x-hidden overflow-y-auto rounded-(--radius-card) border border-[#F0E8E3] bg-white shadow-sm">
              {history.map((time, index) => (
                <li key={`${time}-${history.length - index}`} className="flex items-center gap-4 border-b border-[#F0E8E3] p-4 last:border-b-0 sm:px-6">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F9ECEE]">
                    <Heart aria-hidden="true" size={19} className="fill-[#C77F89] text-[#C77F89]" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">A puchi added</p>
                    <time dateTime={new Date(time).toISOString()} className="mt-1 block text-xs text-[#766d69]">
                      {new Date(time).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
                    </time>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
      <DailyPuchiStats history={history} />
    </div>
  );
}
