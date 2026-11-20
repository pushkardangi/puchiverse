"use client";

import { useState, type FormEvent } from "react";
import ModalShell from "@/components/memories/ModalShell";
import ToggleRow from "@/components/us/ToggleRow";
import { eyebrowClass, inputClass, labelClass } from "@/components/us/formStyles";
import { DATE_CATEGORIES, type DateCategory, type ImportantDate } from "@/data/relationshipData";
import type { ImportantDateInput } from "@/hooks/useImportantDates";
import { isValidDate } from "@/lib/dates";

type ImportantDateFormProps = {
  item?: ImportantDate;
  onClose: () => void;
  onSave: (input: ImportantDateInput) => Promise<boolean>;
  saveError?: string;
};

export default function ImportantDateForm({ item, onClose, onSave, saveError }: ImportantDateFormProps) {
  const [title, setTitle] = useState(item?.title ?? "");
  const [date, setDate] = useState(item?.date ?? "");
  const [category, setCategory] = useState<DateCategory>(item?.category ?? "Special Occasion");
  const [isRecurring, setIsRecurring] = useState(item?.isRecurring ?? true);
  const [reminderEnabled, setReminderEnabled] = useState(item?.reminderEnabled ?? false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) return setError("Give this date a name.");
    if (!isValidDate(date)) return setError("Choose a valid date.");
    setError("");
    setSaving(true);
    const saved = await onSave({ title: title.trim(), date, category, isRecurring, reminderEnabled });
    setSaving(false);
    if (saved) onClose();
  };

  return (
    <ModalShell titleId="date-form-title" onClose={onClose}>
      <form onSubmit={submit} noValidate className="p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:p-8">
        <p className={eyebrowClass}>{item ? "Edit date" : "A date to remember"}</p>
        <h2 id="date-form-title" className="mt-2 pr-12 font-serif text-3xl text-[#3E3131]">{item ? "Update this date" : "Add an important date"}</h2>
        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <label className={`${labelClass} sm:col-span-2`}>
            Name <span aria-hidden="true" className="text-[#A35C69]">*</span>
            <input required maxLength={80} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Our anniversary" className={inputClass} />
          </label>
          <label className={labelClass}>
            Date <span aria-hidden="true" className="text-[#A35C69]">*</span>
            <input required type="date" value={date} onChange={(event) => setDate(event.target.value)} className={inputClass} />
          </label>
          <label className={labelClass}>
            Category
            <select value={category} onChange={(event) => setCategory(event.target.value as DateCategory)} className={inputClass}>
              {DATE_CATEGORIES.map((value) => <option key={value}>{value}</option>)}
            </select>
          </label>
          <ToggleRow className="sm:col-span-2" label="Repeats every year" hint="Birthdays and anniversaries roll to the next occurrence." checked={isRecurring} onChange={setIsRecurring} />
          <ToggleRow className="sm:col-span-2" label="Remind me" hint="Saved now; delivered once notifications are connected." checked={reminderEnabled} onChange={setReminderEnabled} />
        </div>
        {(error || saveError) && <p role="alert" className="mt-5 rounded-xl bg-[#FFF0EF] px-4 py-3 text-xs text-[#9A4652]">{error || saveError}</p>}
        <div className="mt-7 flex gap-3">
          <button type="button" onClick={onClose} className="button-secondary">Cancel</button>
          <button type="submit" disabled={saving} className="button-primary">{saving ? "Saving..." : item ? "Save changes" : "Save date"}</button>
        </div>
      </form>
    </ModalShell>
  );
}
