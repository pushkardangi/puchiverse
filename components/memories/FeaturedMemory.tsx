"use client";

import Image from "next/image";
import { ArrowUpRight, CalendarDays, Sparkles } from "lucide-react";
import type { Memory } from "@/data/memories";
import { useState } from "react";

type FeaturedMemoryProps = {
  memory: Memory;
  onOpen: (memory: Memory) => void;
};

export default function FeaturedMemory({
  memory,
  onOpen,
}: FeaturedMemoryProps) {
  const [failed, setFailed] = useState(false);
  const date = new Date(`${memory.date}T12:00:00`).toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    },
  );

  return (
    <section aria-labelledby="featured-memory-title" className="mt-8">
      <button
        type="button"
        onClick={() => onOpen(memory)}
        className="group grid w-full overflow-hidden rounded-[30px] border border-[#EDE2DC] bg-white text-left shadow-[0_18px_45px_rgba(78,55,51,0.08)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_55px_rgba(78,55,51,0.12)] md:grid-cols-[1.35fr_1fr]"
      >
        <div className="relative aspect-[4/3] min-h-64 overflow-hidden bg-[#E9DFDA] md:aspect-auto md:min-h-[410px]">
          {memory.image && !failed ? (
            <Image
              src={memory.image}
              alt={memory.title}
              fill
              priority
              unoptimized
              onError={() => setFailed(true)}
              className="object-cover transition duration-500 group-hover:scale-[1.015]"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_top,#F8EEEA,#E7DBD4)]">
              <span className="font-serif text-7xl text-white/70">♡</span>
            </div>
          )}
          <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-[#FAF8F5]/90 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#8F4E5A] backdrop-blur">
            <Sparkles aria-hidden="true" size={12} /> Featured memory
          </span>
        </div>
        <div className="flex min-h-64 flex-col justify-between p-6 sm:p-8 md:p-9">
          <div>
            <p className="flex items-center gap-2 text-xs text-[#8C7C78]">
              <CalendarDays aria-hidden="true" size={14} />{" "}
              <time dateTime={memory.date}>{date}</time>
            </p>
            <h2
              id="featured-memory-title"
              className="mt-5 font-serif text-3xl leading-tight text-[#3C3030] sm:text-4xl"
            >
              {memory.title}
            </h2>
            <p className="mt-4 line-clamp-3 text-sm leading-7 text-[#766D69]">
              {memory.description}
            </p>
          </div>
          <span className="mt-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#A35C69]">
            Revisit this moment <ArrowUpRight aria-hidden="true" size={15} />
          </span>
        </div>
      </button>
    </section>
  );
}
