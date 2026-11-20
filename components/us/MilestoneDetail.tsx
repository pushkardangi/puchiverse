"use client";

import Image from "next/image";
import { CalendarDays, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import ModalShell from "@/components/memories/ModalShell";
import { dangerButtonClass } from "@/components/us/formStyles";
import type { Milestone } from "@/data/relationshipData";
import { formatDate } from "@/lib/dates";

type MilestoneDetailProps = {
  milestone: Milestone;
  onClose: () => void;
  onEdit: (milestone: Milestone) => void;
  onDelete: (milestone: Milestone) => void;
  error?: string;
};

export default function MilestoneDetail({ milestone, onClose, onEdit, onDelete, error }: MilestoneDetailProps) {
  const [failed, setFailed] = useState(false);

  return (
    <ModalShell titleId="milestone-detail-title" onClose={onClose}>
      {milestone.image && !failed && (
        <div className="relative aspect-[16/10] overflow-hidden bg-[#E9DDD6]">
          <Image src={milestone.image} alt={milestone.title} fill unoptimized onError={() => setFailed(true)} className="object-cover" />
        </div>
      )}
      <div className="p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:p-9">
        <span className="rounded-full bg-[#F2DFDF] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#965461]">{milestone.category}</span>
        <h2 id="milestone-detail-title" className="mt-5 pr-10 font-serif text-3xl leading-tight text-[#3B2F2F] sm:text-4xl">{milestone.title}</h2>
        <p className="mt-4 flex items-center gap-2 text-xs text-[#877772]">
          <CalendarDays aria-hidden="true" size={15} /> <time dateTime={milestone.date}>{formatDate(milestone.date)}</time>
        </p>
        <p className="mt-6 whitespace-pre-wrap font-serif text-lg leading-8 text-[#5F514E]">{milestone.description || "A moment worth remembering."}</p>
        {error && <p role="alert" className="mt-4 text-xs text-[#9A4652]">{error}</p>}
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <button type="button" onClick={() => onEdit(milestone)} className="button-secondary"><Pencil aria-hidden="true" size={15} /> Edit</button>
          <button type="button" onClick={() => onDelete(milestone)} className={dangerButtonClass}><Trash2 aria-hidden="true" size={15} /> Delete</button>
        </div>
      </div>
    </ModalShell>
  );
}
