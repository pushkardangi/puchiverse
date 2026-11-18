"use client";

import Image from "next/image";
import { Check, ImagePlus, LoaderCircle, Replace, Trash2 } from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { MEMORY_CATEGORIES, type Memory } from "@/data/memories";
import type { MemoryInput } from "@/hooks/useMemories";
import ModalShell from "@/components/memories/ModalShell";

type MemoryFormProps = {
  memory?: Memory;
  onClose: () => void;
  onSave: (input: MemoryInput) => void | Promise<void>;
};

const emptyInput: MemoryInput = {
  title: "",
  description: "",
  date: new Date().toISOString().slice(0, 10),
  category: "Everyday Moments",
  location: "",
  image: undefined,
  isFeatured: false,
};

export default function MemoryForm({ memory, onClose, onSave }: MemoryFormProps) {
  const [values, setValues] = useState<MemoryInput>(memory ? {
    title: memory.title,
    description: memory.description,
    date: memory.date,
    category: memory.category,
    location: memory.location ?? "",
    image: memory.image,
    imageName: memory.imageName,
    isFeatured: memory.isFeatured,
  } : emptyInput);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const ownedUrl = useRef<string | undefined>(undefined);
  const saved = useRef(false);

  useEffect(() => () => {
    if (ownedUrl.current && !saved.current) URL.revokeObjectURL(ownedUrl.current);
  }, []);

  const selectImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("Please choose an image smaller than 8 MB.");
      return;
    }
    if (ownedUrl.current) URL.revokeObjectURL(ownedUrl.current);
    const image = URL.createObjectURL(file);
    ownedUrl.current = image;
    setValues((current) => ({ ...current, image, imageName: file.name }));
    setError("");
  };

  const removeImage = () => {
    if (ownedUrl.current) URL.revokeObjectURL(ownedUrl.current);
    ownedUrl.current = undefined;
    setValues((current) => ({ ...current, image: undefined, imageName: undefined }));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;
    if (!values.title.trim() || !values.date) {
      setError("Add a title and date to save this memory.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSave({ ...values, title: values.title.trim(), description: values.description.trim(), location: values.location?.trim() });
      saved.current = true;
    } catch {
      setError("This memory could not be saved. Please try again.");
      setSaving(false);
    }
  };

  return (
    <ModalShell titleId="memory-form-title" onClose={saving ? () => undefined : onClose}>
      <form onSubmit={submit} className="p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:p-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A35C69]">{memory ? "Edit a chapter" : "A new chapter"}</p>
        <h2 id="memory-form-title" className="mt-2 pr-12 font-serif text-3xl text-[#3E3131]">{memory ? "Revisit the details" : "Save a little moment"}</h2>
        <p className="mt-2 text-sm text-[#7B6F6B]">The details that make it yours.</p>

        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <label className="text-xs font-medium text-[#665753] sm:col-span-2">
            Memory title <span aria-hidden="true" className="text-[#A35C69]">*</span>
            <input required maxLength={100} value={values.title} onChange={(event) => setValues({ ...values, title: event.target.value })} placeholder="A moment to remember" className="mt-2 min-h-12 w-full rounded-2xl border border-[#E5DAD5] bg-white px-4 text-sm outline-none transition focus:border-[#B66D79] focus:ring-2 focus:ring-[#EAD1D4]" />
          </label>
          <label className="text-xs font-medium text-[#665753] sm:col-span-2">
            Description
            <textarea rows={4} maxLength={1200} value={values.description} onChange={(event) => setValues({ ...values, description: event.target.value })} placeholder="What made this moment feel like us?" className="mt-2 w-full resize-none rounded-2xl border border-[#E5DAD5] bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#B66D79] focus:ring-2 focus:ring-[#EAD1D4]" />
          </label>
          <label className="text-xs font-medium text-[#665753]">
            Memory date <span aria-hidden="true" className="text-[#A35C69]">*</span>
            <input required type="date" value={values.date} onChange={(event) => setValues({ ...values, date: event.target.value })} className="mt-2 min-h-12 w-full rounded-2xl border border-[#E5DAD5] bg-white px-4 text-sm outline-none focus:border-[#B66D79]" />
          </label>
          <label className="text-xs font-medium text-[#665753]">
            Category
            <select value={values.category} onChange={(event) => setValues({ ...values, category: event.target.value as Memory["category"] })} className="mt-2 min-h-12 w-full rounded-2xl border border-[#E5DAD5] bg-white px-4 text-sm outline-none focus:border-[#B66D79]">
              {MEMORY_CATEGORIES.map((category) => <option key={category}>{category}</option>)}
            </select>
          </label>
          <label className="text-xs font-medium text-[#665753] sm:col-span-2">
            Location <span className="font-normal text-[#A08F8A]">(optional)</span>
            <input maxLength={120} value={values.location} onChange={(event) => setValues({ ...values, location: event.target.value })} placeholder="Somewhere special" className="mt-2 min-h-12 w-full rounded-2xl border border-[#E5DAD5] bg-white px-4 text-sm outline-none focus:border-[#B66D79]" />
          </label>
          <div className="sm:col-span-2">
            <span className="text-xs font-medium text-[#665753]">Photograph</span>
            {values.image ? (
              <div className="relative mt-2 aspect-[16/7] overflow-hidden rounded-2xl border border-[#E5DAD5] bg-[#EDE2DC]">
                <Image src={values.image} alt="Memory preview" fill unoptimized className="object-cover" />
                <div className="absolute bottom-3 right-3 flex gap-2">
                  <label className="flex min-h-10 cursor-pointer items-center gap-2 rounded-xl bg-white/95 px-3 text-xs font-medium shadow-sm">
                    <Replace aria-hidden="true" size={14} /> Replace
                    <input type="file" accept="image/*" onChange={selectImage} className="sr-only" />
                  </label>
                  <button type="button" onClick={removeImage} aria-label="Remove photograph" className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/95 text-[#A14F5C] shadow-sm">
                    <Trash2 aria-hidden="true" size={15} />
                  </button>
                </div>
              </div>
            ) : (
              <label className="mt-2 flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#D5BFBA] bg-white/60 text-center transition hover:bg-white">
                <ImagePlus aria-hidden="true" size={24} className="text-[#B66D79]" strokeWidth={1.5} />
                <span className="mt-2 text-xs font-medium text-[#865760]">Choose a photograph</span>
                <span className="mt-1 text-[10px] text-[#A08F8A]">Images up to 8 MB</span>
                <input type="file" accept="image/*" onChange={selectImage} className="sr-only" />
              </label>
            )}
            {values.image?.startsWith("blob:") && (
              <p className="mt-2 text-[11px] leading-5 text-[#8B7770]">This is a temporary demo preview. It won&apos;t survive a refresh; Cloudinary storage can replace this later.</p>
            )}
          </div>
          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-[#E5DAD5] bg-white px-4 py-3 sm:col-span-2">
            <span>
              <span className="block text-xs font-medium text-[#665753]">Feature this memory</span>
              <span className="mt-1 block text-[11px] text-[#998A84]">Give it a special place in your story.</span>
            </span>
            <span className="relative">
              <input type="checkbox" checked={values.isFeatured} onChange={(event) => setValues({ ...values, isFeatured: event.target.checked })} className="peer sr-only" />
              <span className="block h-7 w-12 rounded-full bg-[#D7CDC8] transition peer-checked:bg-[#B66D79]" />
              <span className="absolute left-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm transition peer-checked:translate-x-5">
                <Check aria-hidden="true" size={11} className={values.isFeatured ? "text-[#B66D79]" : "text-transparent"} />
              </span>
            </span>
          </label>
        </div>

        {error && <p role="alert" className="mt-5 rounded-xl bg-[#FFF0EF] px-4 py-3 text-xs text-[#9A4652]">{error}</p>}
        <div className="mt-7 flex gap-3">
          <button type="button" disabled={saving} onClick={onClose} className="button-secondary">Cancel</button>
          <button type="submit" disabled={saving} className="button-primary disabled:cursor-not-allowed disabled:opacity-60">
            {saving ? <><LoaderCircle aria-hidden="true" size={16} className="animate-spin" /> Saving…</> : memory ? "Save changes" : "Save memory"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
