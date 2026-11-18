"use client";

import { MoreHorizontal, Pencil, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Memory } from "@/data/memories";

type MemoryActionsProps = {
  memory: Memory;
  onEdit: (memory: Memory) => void;
  onDelete: (memory: Memory) => void;
  onToggleFeatured: (memory: Memory) => void;
};

export default function MemoryActions({ memory, onEdit, onDelete, onToggleFeatured }: MemoryActionsProps) {
  const [open, setOpen] = useState(false);

  const run = (action: (memory: Memory) => void) => {
    setOpen(false);
    action(memory);
  };

  return (
    <div className="relative" onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
    }}>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          setOpen((value) => !value);
        }}
        aria-label={`Actions for ${memory.title}`}
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#6D615E] shadow-sm backdrop-blur transition hover:bg-white"
      >
        <MoreHorizontal aria-hidden="true" size={18} />
      </button>
      {open && (
        <div className="absolute right-0 top-11 z-20 w-44 rounded-2xl border border-[#EDE3DF] bg-white p-1.5 text-xs shadow-xl" role="menu">
          <button type="button" role="menuitem" onClick={(event) => { event.stopPropagation(); run(onEdit); }} className="flex min-h-10 w-full items-center gap-2 rounded-xl px-3 text-left hover:bg-[#FAF5F2]">
            <Pencil aria-hidden="true" size={14} /> Edit memory
          </button>
          <button type="button" role="menuitem" onClick={(event) => { event.stopPropagation(); run(onToggleFeatured); }} className="flex min-h-10 w-full items-center gap-2 rounded-xl px-3 text-left hover:bg-[#FAF5F2]">
            <Star aria-hidden="true" size={14} /> {memory.isFeatured ? "Remove featured" : "Feature this"}
          </button>
          <button type="button" role="menuitem" onClick={(event) => { event.stopPropagation(); run(onDelete); }} className="flex min-h-10 w-full items-center gap-2 rounded-xl px-3 text-left text-[#A14F5C] hover:bg-[#FFF2F2]">
            <Trash2 aria-hidden="true" size={14} /> Delete
          </button>
        </div>
      )}
    </div>
  );
}
