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
import { useBucketList } from "@/hooks/useBucketList";
import { useCoupleProfile } from "@/hooks/useCoupleProfile";
import { useEvents } from "@/hooks/useEvents";
import { useMemories } from "@/hooks/useMemories";
import { useLoveJar } from "@/hooks/useLoveJar";
import { useRelationshipDuration } from "@/hooks/useRelationshipDuration";
import { useToday } from "@/hooks/useToday";
import { nextOccurrence } from "@/lib/dates";

export default function UsPage() {
  const [editingProfile, setEditingProfile] = useState(false);
  const { profile, updateProfile, preferences, updatePreferences, loading: profileLoading, error: profileError, settingsError, retry: retryProfile } = useCoupleProfile();
  const duration = useRelationshipDuration(profile?.relationshipStartDate ?? "");
  const events = useEvents();
  const today = useToday();
  const bucketList = useBucketList();
  const { memories } = useMemories();
  const { summary: puchiSummary } = usePuchis();
  const loveJar = useLoveJar();

  const storageError = profileError || settingsError || events.error || bucketList.error || loveJar.error;
  const milestones = events.events.filter((item) => item.tag === "milestone")
    .sort((a, b) => a.date.localeCompare(b.date) || a.createdAt.localeCompare(b.createdAt));
  const rawDates = events.events.filter((item) => item.tag === "important-date");
  const dates = today ? rawDates.flatMap((item) => {
    const occurrence = nextOccurrence(item.date, today, item.isRecurring);
    return occurrence ? [{ ...item, nextDate: occurrence.date, daysRemaining: occurrence.daysRemaining, years: occurrence.years }] : [];
  }).sort((a, b) => {
    const aPast = a.daysRemaining < 0;
    const bPast = b.daysRemaining < 0;
    if (aPast !== bPast) return aPast ? 1 : -1;
    return aPast ? b.daysRemaining - a.daysRemaining : a.daysRemaining - b.daysRemaining;
  }) : [];

  const stats: RelationshipStat[] = [
    { label: "Days together", value: duration.status === "ready" ? duration.totalDays : null, source: "records" },
    { label: "Memories saved", value: memories.length, source: "records" },
    { label: "Milestones celebrated", value: events.ready ? milestones.length : null, source: "shared" },
    { label: "Dreams completed", value: bucketList.completed.length, source: "records" },
    { label: "Puchis exchanged", value: puchiSummary?.totalPuchis ?? null, source: "shared" },
    { label: "Love notes received", value: loveJar.notes?.length ?? null, source: "shared" },
  ];

  return (
    <>
      <div className="space-y-12 pb-4 pt-1 sm:space-y-14 sm:pb-8">
        {storageError && (
          <p role="alert" className="flex items-start gap-2 rounded-2xl border border-[#E8C9C9] bg-[#FFF4F3] px-4 py-3 text-xs leading-5 text-[#914E58]">
            <AlertCircle aria-hidden="true" size={16} className="mt-0.5 shrink-0" /> {storageError}
          </p>
        )}
        {events.error && !events.ready && <button type="button" onClick={events.retry} className="button-secondary">Retry loading events</button>}
        {loveJar.error && loveJar.notes === null && <button type="button" onClick={loveJar.retry} className="button-secondary">Retry loading love notes</button>}
        {bucketList.error && !bucketList.ready && <button type="button" onClick={bucketList.retry} className="button-secondary">Retry loading bucket list</button>}
        {profileError && !profile && <button type="button" onClick={retryProfile} className="button-secondary">Retry loading profile</button>}

        {profile ? (
          <div className="space-y-6">
            <RelationshipHero profile={profile} duration={duration} onEdit={() => setEditingProfile(true)} />
            <RelationshipDuration duration={duration} />
          </div>
        ) : profileLoading ? <p role="status" className="text-sm text-[#766D69]">Loading your couple profile...</p> : null}

        <MilestonesSection
          milestones={milestones}
          loading={events.loading}
          available={events.ready}
          error={events.error}
          onAdd={async (input) => {
            const result = await events.save({ ...input, tag: "milestone" });
            return result?.tag === "milestone" ? result : null;
          }}
          onUpdate={async (id, input) => !!await events.save({ ...input, tag: "milestone" }, id)}
          onDelete={(item) => events.remove(item.id)}
        />

        <div className="grid items-start gap-12 md:grid-cols-2 md:gap-8">
          <BucketListSection
            total={bucketList.items.length}
            pending={bucketList.pending}
            completed={bucketList.completed}
            loading={bucketList.loading}
            available={bucketList.ready}
            onAdd={bucketList.addItem}
            onUpdate={bucketList.updateItem}
            onToggle={bucketList.toggleItem}
            onDelete={bucketList.deleteItem}
          />
          <ImportantDatesSection
            dates={dates}
            rawDates={rawDates}
            loading={events.loading || !today}
            available={events.ready}
            error={events.error}
            onAdd={async (input) => !!await events.save({ ...input, tag: "important-date" })}
            onUpdate={async (id, input) => !!await events.save({ ...input, tag: "important-date" }, id)}
            onDelete={(id) => { void events.remove(id); }}
            onToggleReminder={(id) => {
              const item = rawDates.find((date) => date.id === id);
              if (item) void events.save({ ...item, reminderEnabled: !item.reminderEnabled }, id);
            }}
          />
        </div>

        <RelationshipStats stats={stats} />

        {profile && preferences && (
          <SharedPreferences profile={profile} preferences={preferences} onSave={updatePreferences} saveError={profileError} />
        )}

        <CoupleSettings onEditProfile={() => setEditingProfile(true)} profileAvailable={!!profile} />

        <div className="py-2 text-center">
          <Heart aria-hidden="true" size={16} className="mx-auto fill-[#C77F89] text-[#C77F89]" />
          <p className="mt-2 font-serif text-sm italic text-[#8E7C77]">The best chapters are still ahead.</p>
        </div>
      </div>

      {editingProfile && profile && (
        <CoupleProfileForm
          profile={profile}
          onClose={() => setEditingProfile(false)}
          onSave={updateProfile}
          saveError={profileError}
        />
      )}
    </>
  );
}
