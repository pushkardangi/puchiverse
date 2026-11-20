"use client";

import { Plus, Telescope } from "lucide-react";
import { useState } from "react";
import BucketListForm from "@/components/us/BucketListForm";
import BucketListItemRow from "@/components/us/BucketListItem";
import { eyebrowClass } from "@/components/us/formStyles";
import type { BucketListItem } from "@/data/relationshipData";
import { useCelebration } from "@/hooks/useCelebration";
import type { BucketListInput } from "@/hooks/useBucketList";

type BucketListSectionProps = {
  total: number;
  pending: BucketListItem[];
  completed: BucketListItem[];
  loading: boolean;
  available: boolean;
  onAdd: (input: BucketListInput) => void;
  onUpdate: (id: string, input: BucketListInput) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function BucketListSection({
  total,
  pending,
  completed,
  loading,
  available,
  onAdd,
  onUpdate,
  onToggle,
  onDelete,
}: BucketListSectionProps) {
  const [formTarget, setFormTarget] = useState<BucketListItem | "new">();
  const [celebratingId, celebrate] = useCelebration();
  const percent = total ? Math.round((completed.length / total) * 100) : 0;

  const toggle = (item: BucketListItem) => {
    if (!item.isCompleted) celebrate(item.id);
    onToggle(item.id);
  };

  const remove = (item: BucketListItem) => {
    if (window.confirm(`Remove "${item.title}" from your bucket list?`))
      onDelete(item.id);
  };

  const save = (input: BucketListInput) => {
    if (formTarget && formTarget !== "new") onUpdate(formTarget.id, input);
    else onAdd(input);
    setFormTarget(undefined);
  };

  const rows = (items: BucketListItem[]) => (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <BucketListItemRow
          key={item.id}
          item={item}
          celebrating={celebratingId === item.id}
          onToggle={toggle}
          onEdit={setFormTarget}
          onDelete={remove}
        />
      ))}
    </ul>
  );

  return (
    <section aria-labelledby="bucket-title" className="min-w-0">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className={eyebrowClass}>Still to come</p>
          <h2
            id="bucket-title"
            className="mt-2 font-serif text-3xl text-[#342B2C]"
          >
            Our Bucket List
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setFormTarget("new")}
          className="flex min-h-11 shrink-0 items-center gap-2 rounded-2xl bg-[#B66D79] px-4 text-sm font-medium text-white shadow-sm transition hover:bg-[#A35C69]"
        >
          <Plus aria-hidden="true" size={16} /> Add
        </button>
      </div>

      {!available && loading ? (
        <div className="card-surface mt-6 text-center" role="status">
          <Telescope
            aria-hidden="true"
            size={26}
            strokeWidth={1.5}
            className="mx-auto text-[#B66D79]"
          />
          <p className="mt-3 font-serif text-xl text-[#3E3131]">
            Loading your dreams
          </p>
        </div>
      ) : total === 0 ? (
        <div className="card-surface mt-6 text-center">
          <Telescope
            aria-hidden="true"
            size={26}
            strokeWidth={1.5}
            className="mx-auto text-[#B66D79]"
          />
          <p className="mt-3 font-serif text-xl text-[#3E3131]">
            Your list is waiting
          </p>
          <p className="mx-auto mt-1 max-w-xs text-sm leading-6 text-[#766D69]">
            Add the first thing you&apos;d love to do together.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-6 rounded-[22px] border border-[#F0E6E1] bg-[#FFFDFC] p-5">
            <p className="font-serif text-xl text-[#3E3131]">
              {completed.length} of {total} dreams completed
            </p>
            <div
              role="progressbar"
              aria-label="Bucket list progress"
              aria-valuemin={0}
              aria-valuemax={total}
              aria-valuenow={completed.length}
              className="mt-3 h-2 overflow-hidden rounded-full bg-[#F1E6E2]"
            >
              <div
                className="h-full rounded-full bg-[#B66D79] transition-[width] duration-700"
                style={{ width: `${percent}%` }}
              />
            </div>
            <p className="mt-2 text-[11px] text-[#8C7C78]">
              {pending.length === 0
                ? "Every dream ticked off. Time to dream bigger."
                : `${pending.length} still to look forward to`}
            </p>
          </div>

          <div className="mt-5 space-y-6">
            {pending.length > 0 && (
              <div>
                <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8C7C78]">
                  Dreaming of
                </h3>
                {rows(pending)}
              </div>
            )}
            {completed.length > 0 && (
              <div>
                <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8C7C78]">
                  Lived together
                </h3>
                {rows(completed)}
              </div>
            )}
          </div>
        </>
      )}

      {formTarget && (
        <BucketListForm
          item={formTarget === "new" ? undefined : formTarget}
          onClose={() => setFormTarget(undefined)}
          onSave={save}
        />
      )}
    </section>
  );
}
