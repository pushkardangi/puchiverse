"use client";

import { Check, Pencil, Sparkles, Trash2 } from "lucide-react";
import type { BucketListItem as BucketItem } from "@/data/relationshipData";

type BucketListItemProps = {
  item: BucketItem;
  celebrating: boolean;
  onToggle: (item: BucketItem) => void;
  onEdit: (item: BucketItem) => void;
  onDelete: (item: BucketItem) => void;
};

function completedLabel(completedAt: string | null) {
  if (!completedAt) return "";
  const date = new Date(completedAt);
  if (Number.isNaN(date.getTime())) return "";
  return `Done ${date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
}

export default function BucketListItem({ item, celebrating, onToggle, onEdit, onDelete }: BucketListItemProps) {
  return (
    <li className={`relative flex items-start gap-1 rounded-2xl border px-2 py-1 transition-colors duration-300 ${item.isCompleted ? "border-[#EFE3DF] bg-[#FBF5F3]" : "border-[#EEE5E0] bg-white"} ${celebrating ? "animate-us-pop" : ""}`}>
      <button
        type="button"
        role="checkbox"
        aria-checked={item.isCompleted}
        aria-label={`${item.isCompleted ? "Mark as not done" : "Mark as done"}: ${item.title}`}
        onClick={() => onToggle(item)}
        className="flex h-11 w-11 shrink-0 items-center justify-center"
      >
        <span className={`flex h-6 w-6 items-center justify-center rounded-full border transition-colors duration-300 ${item.isCompleted ? "border-[#B66D79] bg-[#B66D79] text-white" : "border-[#D9C6C1] bg-white text-transparent"}`}>
          <Check aria-hidden="true" size={14} strokeWidth={2.6} />
        </span>
      </button>
      <div className="min-w-0 flex-1 py-2.5">
        <p className={`font-serif text-[17px] leading-snug ${item.isCompleted ? "text-[#8C7C78] line-through decoration-[#D6BDB8]" : "text-[#3E3131]"}`}>
          {item.title}
          {celebrating && <Sparkles aria-label="Dream completed" size={14} className="ml-2 inline text-[#B66D79]" />}
        </p>
        {item.description && !item.isCompleted && <p className="mt-0.5 text-xs leading-5 text-[#8C7C78]">{item.description}</p>}
        {item.isCompleted && item.completedAt && <p className="mt-0.5 text-[11px] text-[#A08F8A]">{completedLabel(item.completedAt)}</p>}
      </div>
      <div className="flex shrink-0">
        <button type="button" onClick={() => onEdit(item)} aria-label={`Edit ${item.title}`} className="flex h-11 w-11 items-center justify-center rounded-full text-[#A08F8A] transition hover:bg-[#F7EDEB] hover:text-[#A35C69]">
          <Pencil aria-hidden="true" size={15} />
        </button>
        <button type="button" onClick={() => onDelete(item)} aria-label={`Delete ${item.title}`} className="flex h-11 w-11 items-center justify-center rounded-full text-[#A08F8A] transition hover:bg-[#F7EDEB] hover:text-[#A14F5C]">
          <Trash2 aria-hidden="true" size={15} />
        </button>
      </div>
    </li>
  );
}
