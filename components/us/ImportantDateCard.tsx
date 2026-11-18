"use client";

import { Bell, BellOff, Pencil, Repeat, Trash2 } from "lucide-react";
import type { ImportantDateView } from "@/hooks/useImportantDates";
import { formatDate, ordinal } from "@/lib/dates";

type ImportantDateCardProps = {
  item: ImportantDateView;
  onEdit: (item: ImportantDateView) => void;
  onDelete: (item: ImportantDateView) => void;
  onToggleReminder: (item: ImportantDateView) => void;
};

function countdown(days: number): { value: string; unit: string } {
  if (days === 0) return { value: "Today", unit: "" };
  if (days === 1) return { value: "1", unit: "day" };
  if (days === -1) return { value: "1", unit: "day ago" };
  return days > 0 ? { value: String(days), unit: "days" } : { value: String(-days), unit: "days ago" };
}

export default function ImportantDateCard({ item, onEdit, onDelete, onToggleReminder }: ImportantDateCardProps) {
  const { value, unit } = countdown(item.daysRemaining);
  const past = item.daysRemaining < 0;
  const note = item.isRecurring && item.category === "Anniversary" && item.years > 0 ? `${ordinal(item.years)} anniversary` : null;

  return (
    <li className={`flex items-center gap-3 rounded-2xl border border-[#EEE5E0] p-3 ${past ? "bg-[#FBF8F6]" : "bg-white"}`}>
      <div className={`flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl text-center ${past ? "bg-[#F2ECE8] text-[#8C7C78]" : item.daysRemaining === 0 ? "bg-[#B66D79] text-white" : "bg-[#F7E8E7] text-[#965461]"}`}>
        <span className={`font-serif leading-none ${value === "Today" ? "text-sm" : "text-2xl"}`}>{value}</span>
        {unit && <span className="mt-1 text-[9px] font-semibold uppercase tracking-wider">{unit}</span>}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-serif text-[17px] text-[#3E3131]">{item.title}</p>
        <p className="mt-0.5 text-xs text-[#8C7C78]">
          <time dateTime={item.nextDate}>{formatDate(item.nextDate, { month: "short", day: "numeric", year: "numeric" })}</time>
          {note && <> · {note}</>}
        </p>
        <p className="mt-1 flex items-center gap-2 text-[10px] uppercase tracking-wider text-[#A08F8A]">
          {item.category}
          {item.isRecurring && <span className="flex items-center gap-1"><Repeat aria-hidden="true" size={10} /> Yearly</span>}
        </p>
      </div>
      <div className="flex shrink-0 flex-col sm:flex-row">
        <button type="button" onClick={() => onToggleReminder(item)} aria-pressed={item.reminderEnabled} aria-label={`Reminder for ${item.title}`} className={`flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-[#F7EDEB] ${item.reminderEnabled ? "text-[#A35C69]" : "text-[#B3A5A0]"}`}>
          {item.reminderEnabled ? <Bell aria-hidden="true" size={16} /> : <BellOff aria-hidden="true" size={16} />}
        </button>
        <div className="flex">
          <button type="button" onClick={() => onEdit(item)} aria-label={`Edit ${item.title}`} className="flex h-11 w-11 items-center justify-center rounded-full text-[#A08F8A] transition hover:bg-[#F7EDEB] hover:text-[#A35C69]">
            <Pencil aria-hidden="true" size={15} />
          </button>
          <button type="button" onClick={() => onDelete(item)} aria-label={`Delete ${item.title}`} className="flex h-11 w-11 items-center justify-center rounded-full text-[#A08F8A] transition hover:bg-[#F7EDEB] hover:text-[#A14F5C]">
            <Trash2 aria-hidden="true" size={15} />
          </button>
        </div>
      </div>
    </li>
  );
}
