"use client";

import Image from "next/image";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import type { Milestone } from "@/data/relationshipData";
import { formatDate } from "@/lib/dates";

type MilestoneCardProps = {
  milestone: Milestone;
  celebrating: boolean;
  onOpen: (milestone: Milestone) => void;
};

export default function MilestoneCard({ milestone, celebrating, onOpen }: MilestoneCardProps) {
  const [failedSrc, setFailedSrc] = useState<string>();
  const showImage = milestone.image && failedSrc !== milestone.image;

  return (
    <li className={`relative pl-8 ${celebrating ? "animate-us-pop" : ""}`}>
      <span aria-hidden="true" className="absolute left-[3px] top-6 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-[#FAF8F5] bg-[#B66D79] ring-1 ring-[#E7CFD1]" />
      <button
        type="button"
        onClick={() => onOpen(milestone)}
        className="group flex w-full items-stretch gap-4 rounded-[22px] border border-[#EEE5E0] bg-white p-4 text-left shadow-[0_8px_22px_rgba(75,54,50,0.04)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(75,54,50,0.08)]"
      >
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <time dateTime={milestone.date} className="text-[11px] font-medium text-[#8C7C78]">{formatDate(milestone.date)}</time>
            <span className="rounded-full bg-[#F7E8E7] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#965461]">{milestone.category}</span>
            {celebrating && <Sparkles aria-label="Newly celebrated" size={14} className="text-[#B66D79]" />}
          </span>
          <span className="mt-2 block font-serif text-xl leading-snug text-[#3B2F2F]">{milestone.title}</span>
          {milestone.description && <span className="mt-1.5 line-clamp-2 block text-[13px] leading-5 text-[#766D69]">{milestone.description}</span>}
        </span>
        {showImage && (
          <span className="relative hidden h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-[#EDE2DC] min-[400px]:block">
            <Image src={milestone.image!} alt="" fill unoptimized onError={() => setFailedSrc(milestone.image!)} className="object-cover" />
          </span>
        )}
      </button>
    </li>
  );
}
