"use client";

import { useState } from "react";
import { AlertCircle, Heart } from "lucide-react";
import BucketListSection from "@/components/us/BucketListSection";
import CoupleProfileForm from "@/components/us/CoupleProfileForm";
import CoupleSettings from "@/components/us/CoupleSettings";
import ImportantDatesSection from "@/components/us/ImportantDatesSection";
import MilestonesSection from "@/components/us/MilestonesSection";
import RelationshipDuration from "@/components/us/RelationshipDuration";
import RelationshipHero from "@/components/us/RelationshipHero";
import RelationshipStats, { type RelationshipStat } from "@/components/us/RelationshipStats";
import SharedPreferences from "@/components/us/SharedPreferences";
import { usePuchis } from "@/components/puchis/PuchiProvider";
import { loveNotes } from "@/data/demoData";
import { useBucketList } from "@/hooks/useBucketList";
import { useCoupleProfile } from "@/hooks/useCoupleProfile";
import { useImportantDates } from "@/hooks/useImportantDates";
import { useMemories } from "@/hooks/useMemories";
import { useMilestones } from "@/hooks/useMilestones";
import { useRelationshipDuration } from "@/hooks/useRelationshipDuration";

export default function UsPage() {
  const [editingProfile, setEditingProfile] = useState(false);
  const { profile, updateProfile, preferences, updatePreferences, settings, updateSettings, error: profileError } = useCoupleProfile();
  const duration = useRelationshipDuration(profile.relationshipStartDate);
  const milestones = useMilestones();
  const bucketList = useBucketList();
  const importantDates = useImportantDates();
  const { memories } = useMemories();
  const { count: puchiCount } = usePuchis();

  const storageError = profileError || milestones.error || bucketList.error || importantDates.error;

  const stats: RelationshipStat[] = [
    { label: "Days together", value: duration.status === "ready" ? duration.totalDays : null, source: "records" },
    { label: "Memories saved", value: memories.length, source: "records" },
    { label: "Milestones celebrated", value: milestones.milestones.length, source: "records" },
    { label: "Dreams completed", value: bucketList.completed.length, source: "records" },
    { label: "Puchis exchanged", value: puchiCount, source: "demo" },
    { label: "Love notes", value: loveNotes.length, source: "demo" },
  ];

  return (
    <>
      <div className="space-y-12 pb-4 pt-1 sm:space-y-14 sm:pb-8">
        {storageError && (
          <p role="alert" className="flex items-start gap-2 rounded-2xl border border-[#E8C9C9] bg-[#FFF4F3] px-4 py-3 text-xs leading-5 text-[#914E58]">
            <AlertCircle aria-hidden="true" size={16} className="mt-0.5 shrink-0" /> {storageError}
          </p>
        )}

        <div className="space-y-6">
          <RelationshipHero profile={profile} duration={duration} onEdit={() => setEditingProfile(true)} />
          <RelationshipDuration duration={duration} />
        </div>

        <MilestonesSection
          milestones={milestones.milestones}
          onAdd={milestones.addMilestone}
          onUpdate={milestones.updateMilestone}
          onDelete={milestones.deleteMilestone}
        />

        <div className="grid items-start gap-12 md:grid-cols-2 md:gap-8">
          <BucketListSection
            total={bucketList.items.length}
            pending={bucketList.pending}
            completed={bucketList.completed}
            onAdd={bucketList.addItem}
            onUpdate={bucketList.updateItem}
            onToggle={bucketList.toggleItem}
            onDelete={bucketList.deleteItem}
          />
          <ImportantDatesSection
            dates={importantDates.dates}
            rawDates={importantDates.rawDates}
            loading={importantDates.loading}
            onAdd={importantDates.addDate}
            onUpdate={importantDates.updateDate}
            onDelete={importantDates.deleteDate}
            onToggleReminder={importantDates.toggleReminder}
          />
        </div>

        <RelationshipStats stats={stats} />

        <SharedPreferences
          profile={profile}
          preferences={preferences}
          onSave={({ tagline, nicknames }, nextPreferences) => {
            updateProfile((current) => ({
              ...current,
              tagline,
              partnerOne: { ...current.partnerOne, nickname: nicknames[0] },
              partnerTwo: { ...current.partnerTwo, nickname: nicknames[1] },
            }));
            updatePreferences(nextPreferences);
          }}
        />

        <CoupleSettings settings={settings} onChange={updateSettings} onEditProfile={() => setEditingProfile(true)} />

        <div className="py-2 text-center">
          <Heart aria-hidden="true" size={16} className="mx-auto fill-[#C77F89] text-[#C77F89]" />
          <p className="mt-2 font-serif text-sm italic text-[#8E7C77]">The best chapters are still ahead.</p>
        </div>
      </div>

      {editingProfile && (
        <CoupleProfileForm
          profile={profile}
          onClose={() => setEditingProfile(false)}
          onSave={(next) => {
            updateProfile(next);
            setEditingProfile(false);
          }}
        />
      )}
    </>
  );
}
