"use client";

import { useState, type FormEvent } from "react";
import ModalShell from "@/components/memories/ModalShell";
import { eyebrowClass, inputClass, labelClass, textareaClass } from "@/components/us/formStyles";
import type { BucketListItem } from "@/data/relationshipData";
import type { BucketListInput } from "@/hooks/useBucketList";

type BucketListFormProps = {
  item?: BucketListItem;
  onClose: () => void;
  onSave: (input: BucketListInput) => void;
};

export default function BucketListForm({ item, onClose, onSave }: BucketListFormProps) {
  const [title, setTitle] = useState(item?.title ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [error, setError] = useState("");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) return setError("Tell us what you'd love to do together.");
    onSave({ title: title.trim(), description: description.trim() });
  };

  return (
    <ModalShell titleId="bucket-form-title" onClose={onClose}>
      <form onSubmit={submit} noValidate className="p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:p-8">
        <p className={eyebrowClass}>{item ? "Edit dream" : "A new dream"}</p>
        <h2 id="bucket-form-title" className="mt-2 pr-12 font-serif text-3xl text-[#3E3131]">{item ? "Refine this dream" : "Something to look forward to"}</h2>
        <div className="mt-7 space-y-5">
          <label className={`block ${labelClass}`}>
            What would you love to do? <span aria-hidden="true" className="text-[#A35C69]">*</span>
            <input required maxLength={100} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Watch a sunrise together" className={inputClass} />
          </label>
          <label className={`block ${labelClass}`}>
            Details <span className="font-normal text-[#A08F8A]">(optional)</span>
            <textarea rows={3} maxLength={300} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Where, when, or how?" className={textareaClass} />
          </label>
        </div>
        {error && <p role="alert" className="mt-5 rounded-xl bg-[#FFF0EF] px-4 py-3 text-xs text-[#9A4652]">{error}</p>}
        <div className="mt-7 flex gap-3">
          <button type="button" onClick={onClose} className="button-secondary">Cancel</button>
          <button type="submit" className="button-primary">{item ? "Save changes" : "Add to our list"}</button>
        </div>
      </form>
    </ModalShell>
  );
}
