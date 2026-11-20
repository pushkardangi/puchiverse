"use client";

import { Plus, Route } from "lucide-react";
import { useState } from "react";
import MilestoneCard from "@/components/us/MilestoneCard";
import MilestoneDetail from "@/components/us/MilestoneDetail";
import MilestoneForm from "@/components/us/MilestoneForm";
import { eyebrowClass } from "@/components/us/formStyles";
import type { Milestone } from "@/data/relationshipData";
import { useCelebration } from "@/hooks/useCelebration";
import type { MilestoneInput } from "@/hooks/useMilestones";

type MilestonesSectionProps = {
  milestones: Milestone[];
  onAdd: (input: MilestoneInput) => Promise<Milestone | null>;
  onUpdate: (id: string, input: MilestoneInput) => Promise<boolean>;
  onDelete: (milestone: Milestone) => Promise<boolean>;
  loading: boolean;
  available: boolean;
  error?: string;
};

export default function MilestonesSection({ milestones, onAdd, onUpdate, onDelete, loading, available, error }: MilestonesSectionProps) {
  const [detailId, setDetailId] = useState<string>();
  const [formTarget, setFormTarget] = useState<Milestone | "new">();
  const [celebratingId, celebrate] = useCelebration();
  const detail = milestones.find((milestone) => milestone.id === detailId);

  const save = async (input: MilestoneInput) => {
    if (formTarget && formTarget !== "new") {
      if (!await onUpdate(formTarget.id, input)) return false;
    } else {
      const created = await onAdd(input);
      if (!created) return false;
      celebrate(created.id);
    }
    return true;
  };

  const remove = async (milestone: Milestone) => {
    if (!window.confirm(`Delete "${milestone.title}" from your milestones? This cannot be undone.`)) return;
    if (await onDelete(milestone)) setDetailId(undefined);
  };

  return (
    <section aria-labelledby="milestones-title">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className={eyebrowClass}>The journey so far</p>
          <h2 id="milestones-title" className="mt-2 font-serif text-3xl text-[#342B2C]">Our Milestones</h2>
        </div>
        <button type="button" disabled={!available} onClick={() => setFormTarget("new")} className="flex min-h-11 shrink-0 items-center gap-2 rounded-2xl bg-[#B66D79] px-4 text-sm font-medium text-white shadow-sm transition hover:bg-[#A35C69] disabled:opacity-50">
          <Plus aria-hidden="true" size={16} /> Add
        </button>
      </div>

      {loading ? <p className="mt-6 text-sm text-[#766D69]">Loading milestones...</p> : !available ? null : milestones.length === 0 ? (
        <div className="card-surface mt-6 text-center">
          <Route aria-hidden="true" size={26} strokeWidth={1.5} className="mx-auto text-[#B66D79]" />
          <p className="mt-3 font-serif text-xl text-[#3E3131]">Your story starts here</p>
          <p className="mx-auto mt-1 max-w-xs text-sm leading-6 text-[#766D69]">Add the first moment you want to remember: a meeting, a message, a first hello.</p>
          <button type="button" onClick={() => setFormTarget("new")} className="button-primary mx-auto mt-5 max-w-56">Add a milestone</button>
        </div>
      ) : (
        <div className="relative mt-6">
          <span aria-hidden="true" className="absolute bottom-3 left-[9px] top-3 w-px bg-[#E7D8D4]" />
          <ol className="space-y-4">
            {milestones.map((milestone) => (
              <MilestoneCard key={milestone.id} milestone={milestone} celebrating={celebratingId === milestone.id} onOpen={(item) => setDetailId(item.id)} />
            ))}
          </ol>
        </div>
      )}

      {detail && (
        <MilestoneDetail
          milestone={detail}
          onClose={() => setDetailId(undefined)}
          onEdit={(milestone) => { setDetailId(undefined); setFormTarget(milestone); }}
          onDelete={remove}
          error={error}
        />
      )}
      {formTarget && (
        <MilestoneForm milestone={formTarget === "new" ? undefined : formTarget} onClose={() => setFormTarget(undefined)} onSave={save} saveError={error} />
      )}
    </section>
  );
}
