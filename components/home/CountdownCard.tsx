"use client";

import { CalendarDays, Heart, Pencil, Plus, Sparkles, Trash2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import ModalShell from "@/components/memories/ModalShell";
import { inputClass, labelClass } from "@/components/us/formStyles";
import { useEvents } from "@/hooks/useEvents";
import { useToday } from "@/hooks/useToday";
import { formatDate, isValidDate } from "@/lib/dates";
import { closestEvent, type SharedEvent } from "@/lib/event-types";

type Schedule = Extract<SharedEvent, { tag: "schedule" }>;

export default function CountdownCard() {
  const { events, loading, ready, error, save, remove, retry } = useEvents();
  const today = useToday();
  const closest = today ? closestEvent(events, today) : null;
  const [form, setForm] = useState<Schedule | "new">();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [validation, setValidation] = useState("");
  const [saving, setSaving] = useState(false);

  const open = (item: Schedule | "new") => {
    setTitle(item === "new" ? "" : item.title);
    setDate(item === "new" ? "" : item.date);
    setValidation("");
    setForm(item);
  };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) return setValidation("Give this event a name.");
    if (!isValidDate(date) || (today && date < today)) return setValidation("Choose today or a future date.");
    setValidation("");
    setSaving(true);
    const result = await save({ tag: "schedule", title: title.trim(), date }, form === "new" ? undefined : form?.id);
    setSaving(false);
    if (result) setForm(undefined);
  };

  return (
    <section aria-labelledby="countdown-title" className="min-w-0 rounded-[var(--radius-card)] border border-[#EDE8E1] bg-[#F1EEE8] p-5 sm:p-6 md:mt-14">
      <div className="flex items-center justify-between gap-4">
        <h2 id="countdown-title" className="flex items-center gap-2 text-sm font-semibold">
          <CalendarDays aria-hidden="true" size={17} className="text-[#8b6857]" /> Something special
        </h2>
        <Sparkles aria-hidden="true" size={17} className="text-[#8b6857]" />
      </div>
      {loading || !today ? <p className="mt-4 text-sm text-[#766d69]">Loading upcoming events...</p> : closest ? (
        <div className="mt-4 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="break-words text-sm text-[#766d69]">{closest.event.title}</p>
            <p className="mt-1 text-5xl font-semibold tracking-tight">
              {closest.daysRemaining}<span className="ml-2 text-sm font-normal text-[#766d69]">{closest.daysRemaining === 1 ? "day" : "days"} left</span>
            </p>
            <p className="mt-2 text-xs text-[#766d69]"><time dateTime={closest.date}>{formatDate(closest.date)}</time></p>
          </div>
          <Heart aria-hidden="true" size={30} className="mb-2 shrink-0 fill-[#D4A6A0] text-[#D4A6A0]" />
        </div>
      ) : ready && <p className="mt-4 text-sm text-[#766d69]">No upcoming events yet. Add a date to look forward to.</p>}
      {error && <p role="alert" className="mt-3 text-xs text-[#9A4652]">{error}</p>}
      <div className="mt-4 flex flex-wrap gap-2">
        {!ready && !loading && <button type="button" onClick={retry} className="min-h-10 rounded-xl px-3 text-xs text-[#865760]">Retry</button>}
        <button type="button" disabled={!ready} onClick={() => open("new")} className="flex min-h-10 items-center gap-1 rounded-xl bg-[#B66D79] px-3 text-xs font-medium text-white disabled:opacity-50"><Plus aria-hidden="true" size={15} /> Add event</button>
        {closest?.event.tag === "schedule" && <>
          <button type="button" onClick={() => open(closest.event as Schedule)} className="flex min-h-10 items-center gap-1 rounded-xl px-3 text-xs text-[#865760]"><Pencil aria-hidden="true" size={14} /> Edit</button>
          <button type="button" onClick={() => { if (window.confirm(`Delete "${closest.event.title}"?`)) void remove(closest.event.id); }} className="flex min-h-10 items-center gap-1 rounded-xl px-3 text-xs text-[#865760]"><Trash2 aria-hidden="true" size={14} /> Delete</button>
        </>}
      </div>
      {form && <ModalShell titleId="schedule-form-title" onClose={() => setForm(undefined)}>
        <form onSubmit={submit} className="p-5 sm:p-8">
          <h2 id="schedule-form-title" className="pr-12 font-serif text-3xl text-[#3E3131]">{form === "new" ? "Add an event" : "Edit event"}</h2>
          <p className="mt-2 text-sm text-[#766d69]">Scheduled events appear in Something special, not in your milestones or important dates.</p>
          <div className="mt-6 grid gap-5">
            <label className={labelClass}>Name<input required maxLength={100} value={title} onChange={(event) => setTitle(event.target.value)} className={inputClass} /></label>
            <label className={labelClass}>Date<input required type="date" min={today ?? undefined} value={date} onChange={(event) => setDate(event.target.value)} className={inputClass} /></label>
          </div>
          {(validation || error) && <p role="alert" className="mt-5 text-xs text-[#9A4652]">{validation || error}</p>}
          <div className="mt-7 flex gap-3">
            <button type="button" onClick={() => setForm(undefined)} className="button-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="button-primary">{saving ? "Saving..." : "Save event"}</button>
          </div>
        </form>
      </ModalShell>}
    </section>
  );
}
