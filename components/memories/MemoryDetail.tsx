"use client";

import Image from "next/image";
import { CalendarDays, Clock3, MapPin, Pencil, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Memory } from "@/data/memories";
import ModalShell from "@/components/memories/ModalShell";

type MemoryDetailProps = {
  memory: Memory;
  onClose: () => void;
  onEdit: (memory: Memory) => void;
  onDelete: (memory: Memory) => void;
  onToggleFeatured: (memory: Memory) => void;
};

export default function MemoryDetail({ memory, onClose, onEdit, onDelete, onToggleFeatured }: MemoryDetailProps) {
  const [failed, setFailed] = useState(false);
  const formatDate = (date: string) => new Date(`${date}T12:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const createdDate = new Date(memory.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return (
    <ModalShell titleId="memory-detail-title" onClose={onClose} className="sm:max-w-3xl">
      <div className="relative aspect-[16/10] overflow-hidden bg-[#E9DDD6]">
        {memory.image && !failed ? (
          <Image src={memory.image} alt={memory.title} fill priority unoptimized onError={() => setFailed(true)} className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_top,#F6E8E3,#D9CBC3)]">
            <span className="font-serif text-8xl text-white/70">♡</span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
      <div className="p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:p-9">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#F2DFDF] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#965461]">{memory.category}</span>
          {memory.isFeatured && <span className="rounded-full border border-[#E3D3CE] bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#8C6E64]">Featured</span>}
        </div>
        <h2 id="memory-detail-title" className="mt-5 pr-4 font-serif text-3xl leading-tight text-[#3B2F2F] sm:text-4xl">{memory.title}</h2>
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-xs text-[#877772]">
          <span className="flex items-center gap-2"><CalendarDays aria-hidden="true" size={15} /> <time dateTime={memory.date}>{formatDate(memory.date)}</time></span>
          {memory.location && <span className="flex items-center gap-2"><MapPin aria-hidden="true" size={15} /> {memory.location}</span>}
        </div>
        <p className="mt-7 whitespace-pre-wrap font-serif text-lg leading-8 text-[#5F514E]">{memory.description || "A little moment, kept forever."}</p>
        <p className="mt-7 flex items-center gap-2 border-t border-[#E7DDD8] pt-5 text-[11px] text-[#A08F8A]">
          <Clock3 aria-hidden="true" size={13} /> Added to our story on {createdDate}
        </p>
        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          <button type="button" onClick={() => onEdit(memory)} className="button-secondary"><Pencil aria-hidden="true" size={15} /> Edit</button>
          <button type="button" onClick={() => onToggleFeatured(memory)} className="button-secondary"><Star aria-hidden="true" size={15} /> {memory.isFeatured ? "Unfeature" : "Feature"}</button>
          <button type="button" onClick={() => onDelete(memory)} className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-[#E7CBCD] bg-[#FFF7F7] px-4 py-3 text-sm font-medium text-[#A14F5C] transition hover:bg-[#FFF0F0]"><Trash2 aria-hidden="true" size={15} /> Delete</button>
        </div>
      </div>
    </ModalShell>
  );
}
