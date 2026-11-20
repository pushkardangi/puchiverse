"use client";

import { CalendarHeart, Plus } from "lucide-react";
import { useState } from "react";
import ImportantDateCard from "@/components/us/ImportantDateCard";
import ImportantDateForm from "@/components/us/ImportantDateForm";
import { eyebrowClass } from "@/components/us/formStyles";
import type { ImportantDate } from "@/data/relationshipData";
import type { ImportantDateInput, ImportantDateView } from "@/hooks/useImportantDates";

type ImportantDatesSectionProps = {
  dates: ImportantDateView[];
  rawDates: ImportantDate[];
  loading: boolean;
  available: boolean;
  onAdd: (input: ImportantDateInput) => Promise<boolean>;
  onUpdate: (id: string, input: ImportantDateInput) => Promise<boolean>;
  onDelete: (id: string) => void;
  onToggleReminder: (id: string) => void;
  error?: string;
};

export default function ImportantDatesSection({ dates, rawDates, loading, available, onAdd, onUpdate, onDelete, onToggleReminder, error }: ImportantDatesSectionProps) {
  const [formTarget, setFormTarget] = useState<ImportantDate | "new">();

  const save = async (input: ImportantDateInput) => {
    const saved = formTarget && formTarget !== "new" ? await onUpdate(formTarget.id, input) : await onAdd(input);
    return saved;
  };

  const remove = (item: ImportantDate) => {
    if (window.confirm(`Remove "${item.title}" from your important dates?`)) onDelete(item.id);
  };

  return (
    <section aria-labelledby="dates-title" className="min-w-0">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className={eyebrowClass}>Days that matter</p>
          <h2 id="dates-title" className="mt-2 font-serif text-3xl text-[#342B2C]">Important Dates</h2>
        </div>
        <button type="button" disabled={!available} onClick={() => setFormTarget("new")} className="flex min-h-11 shrink-0 items-center gap-2 rounded-2xl bg-[#B66D79] px-4 text-sm font-medium text-white shadow-sm transition hover:bg-[#A35C69] disabled:opacity-50">
          <Plus aria-hidden="true" size={16} /> Add
        </button>
      </div>

      {loading ? (
        <div aria-hidden="true" className="mt-6 space-y-3">
          {[0, 1, 2].map((key) => <div key={key} className="h-[90px] animate-pulse rounded-2xl bg-[#F3ECE8]" />)}
        </div>
      ) : !available ? null : dates.length === 0 ? (
        <div className="card-surface mt-6 text-center">
          <CalendarHeart aria-hidden="true" size={26} strokeWidth={1.5} className="mx-auto text-[#B66D79]" />
          <p className="mt-3 font-serif text-xl text-[#3E3131]">No dates yet</p>
          <p className="mx-auto mt-1 max-w-xs text-sm leading-6 text-[#766D69]">Add birthdays, anniversaries and little occasions so they never slip by.</p>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {dates.map((item) => (
            <ImportantDateCard
              key={item.id}
              item={item}
              onEdit={(value) => setFormTarget(rawDates.find((date) => date.id === value.id))}
              onDelete={remove}
              onToggleReminder={(value) => onToggleReminder(value.id)}
            />
          ))}
        </ul>
      )}

      {formTarget && <ImportantDateForm item={formTarget === "new" ? undefined : formTarget} onClose={() => setFormTarget(undefined)} onSave={save} saveError={error} />}
    </section>
  );
}
