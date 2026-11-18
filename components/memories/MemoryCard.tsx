"use client";

import Image from "next/image";
import { MapPin } from "lucide-react";
import { useState } from "react";
import type { Memory } from "@/data/memories";
import MemoryActions from "@/components/memories/MemoryActions";

type MemoryCardProps = {
  memory: Memory;
  onOpen: (memory: Memory) => void;
  onEdit: (memory: Memory) => void;
  onDelete: (memory: Memory) => void;
  onToggleFeatured: (memory: Memory) => void;
};

export default function MemoryCard({ memory, onOpen, onEdit, onDelete, onToggleFeatured }: MemoryCardProps) {
  const [failed, setFailed] = useState(false);
  const date = new Date(`${memory.date}T12:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <article className="group overflow-hidden rounded-[22px] border border-[#EEE5E0] bg-white shadow-[0_8px_22px_rgba(75,54,50,0.04)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(75,54,50,0.08)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#EDE2DC]">
        <button type="button" onClick={() => onOpen(memory)} className="absolute inset-0 h-full w-full">
          {memory.image && !failed ? (
            <Image
              src={memory.image}
              alt=""
              fill
              unoptimized
              sizes="(min-width: 768px) 300px, 100vw"
              onError={() => setFailed(true)}
              className="object-cover transition duration-500 group-hover:scale-[1.02]"
            />
          ) : (
            <span className="flex h-full items-center justify-center bg-[linear-gradient(145deg,#F3E8E3,#DED0C8)]">
              <span className="font-serif text-5xl text-white/80">♡</span>
            </span>
          )}
          <span className="sr-only">Open {memory.title}</span>
        </button>
        <div className="absolute right-3 top-3">
          <MemoryActions memory={memory} onEdit={onEdit} onDelete={onDelete} onToggleFeatured={onToggleFeatured} />
        </div>
      </div>
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#A35C69]">
          <span>{memory.category}</span>
          <time dateTime={memory.date} className="tracking-normal text-[#968984]">{date}</time>
        </div>
        <button type="button" onClick={() => onOpen(memory)} className="mt-3 block w-full text-left">
          <h3 className="font-serif text-xl leading-tight text-[#3D3030] transition group-hover:text-[#A35C69]">{memory.title}</h3>
        </button>
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#7A6E6A]">{memory.description || "A little moment, kept forever."}</p>
        {memory.location && (
          <p className="mt-4 flex items-center gap-1.5 truncate text-[11px] text-[#998A84]">
            <MapPin aria-hidden="true" size={12} /> {memory.location}
          </p>
        )}
      </div>
    </article>
  );
}
