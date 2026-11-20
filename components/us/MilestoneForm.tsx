"use client";

import Image from "next/image";
import { ImagePlus, Replace, Trash2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import ModalShell from "@/components/memories/ModalShell";
import { eyebrowClass, inputClass, labelClass, textareaClass } from "@/components/us/formStyles";
import { MILESTONE_CATEGORIES, type Milestone } from "@/data/relationshipData";
import type { MilestoneInput } from "@/hooks/useMilestones";
import { useImagePicker } from "@/hooks/useImagePicker";
import { isValidDate, localToday } from "@/lib/dates";
import { isTemporaryImage } from "@/lib/imageStorage";

type MilestoneFormProps = {
  milestone?: Milestone;
  onClose: () => void;
  onSave: (input: MilestoneInput) => Promise<boolean>;
  saveError?: string;
};

export default function MilestoneForm({ milestone, onClose, onSave, saveError }: MilestoneFormProps) {
  const [title, setTitle] = useState(milestone?.title ?? "");
  const [description, setDescription] = useState(milestone?.description ?? "");
  const [date, setDate] = useState(milestone?.date ?? localToday());
  const [category, setCategory] = useState<Milestone["category"]>(milestone?.category ?? "Custom");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const picker = useImagePicker(milestone?.image ?? null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) return setError("Give this milestone a title.");
    if (!isValidDate(date)) return setError("Choose a valid date.");
    setError("");
    setSaving(true);
    const saved = await onSave({ title: title.trim(), description: description.trim(), date, category, image: picker.image });
    if (saved) {
      picker.commit();
      onClose();
    }
    setSaving(false);
  };

  return (
    <ModalShell titleId="milestone-form-title" onClose={onClose}>
      <form onSubmit={submit} noValidate className="p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:p-8">
        <p className={eyebrowClass}>{milestone ? "Edit milestone" : "A new milestone"}</p>
        <h2 id="milestone-form-title" className="mt-2 pr-12 font-serif text-3xl text-[#3E3131]">{milestone ? "Revisit this chapter" : "Mark a moment"}</h2>

        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <label className={`${labelClass} sm:col-span-2`}>
            Title <span aria-hidden="true" className="text-[#A35C69]">*</span>
            <input required maxLength={100} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="The day we..." className={inputClass} />
          </label>
          <label className={`${labelClass} sm:col-span-2`}>
            Description
            <textarea rows={4} maxLength={800} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What made it matter?" className={textareaClass} />
          </label>
          <label className={labelClass}>
            Date <span aria-hidden="true" className="text-[#A35C69]">*</span>
            <input required type="date" value={date} onChange={(event) => setDate(event.target.value)} className={inputClass} />
          </label>
          <label className={labelClass}>
            Category
            <select value={category} onChange={(event) => setCategory(event.target.value as Milestone["category"])} className={inputClass}>
              {MILESTONE_CATEGORIES.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <div className="sm:col-span-2">
            <span className={labelClass}>Photograph <span className="font-normal text-[#A08F8A]">(optional)</span></span>
            {picker.image ? (
              <div className="relative mt-2 aspect-[16/7] overflow-hidden rounded-2xl border border-[#E5DAD5] bg-[#EDE2DC]">
                <Image src={picker.image} alt="Milestone preview" fill unoptimized className="object-cover" />
                <div className="absolute bottom-3 right-3 flex gap-2">
                  <label className="flex min-h-10 cursor-pointer items-center gap-2 rounded-xl bg-white/95 px-3 text-xs font-medium shadow-sm">
                    <Replace aria-hidden="true" size={14} /> Replace
                    <input type="file" accept="image/*" onChange={picker.select} className="sr-only" />
                  </label>
                  <button type="button" onClick={picker.remove} aria-label="Remove photograph" className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/95 text-[#A14F5C] shadow-sm">
                    <Trash2 aria-hidden="true" size={15} />
                  </button>
                </div>
              </div>
            ) : (
              <label className="mt-2 flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#D5BFBA] bg-white/60 text-center transition hover:bg-white">
                <ImagePlus aria-hidden="true" size={22} className="text-[#B66D79]" strokeWidth={1.5} />
                <span className="mt-2 text-xs font-medium text-[#865760]">Choose a photograph</span>
                <span className="mt-1 text-[10px] text-[#A08F8A]">Images up to 8 MB</span>
                <input type="file" accept="image/*" onChange={picker.select} className="sr-only" />
              </label>
            )}
            {isTemporaryImage(picker.image) && (
              <p className="mt-2 text-[11px] leading-5 text-[#8B7770]">Temporary demo preview. It won&apos;t survive a refresh until cloud storage is connected.</p>
            )}
            {picker.error && <p role="alert" className="mt-2 text-xs text-[#9A4652]">{picker.error}</p>}
          </div>
        </div>

        {(error || saveError) && <p role="alert" className="mt-5 rounded-xl bg-[#FFF0EF] px-4 py-3 text-xs text-[#9A4652]">{error || saveError}</p>}
        <div className="mt-7 flex gap-3">
          <button type="button" onClick={onClose} className="button-secondary">Cancel</button>
          <button type="submit" disabled={saving} className="button-primary">{saving ? "Saving..." : milestone ? "Save changes" : "Save milestone"}</button>
        </div>
      </form>
    </ModalShell>
  );
}
