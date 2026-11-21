"use client";

import { useState, type FormEvent } from "react";
import ModalShell from "@/components/memories/ModalShell";
import { eyebrowClass, inputClass, labelClass, textareaClass } from "@/components/us/formStyles";
import type { CoupleProfile, SharedPreferences } from "@/data/relationshipData";

type PreferencesFormProps = {
  profile: CoupleProfile;
  preferences: SharedPreferences;
  onClose: () => void;
  onSave: (profile: Pick<CoupleProfile, "tagline"> & { nicknames: [string, string] }, preferences: SharedPreferences) => Promise<boolean>;
  saveError?: string;
};

const toLines = (items: string[]) => items.join("\n");
const fromLines = (text: string) =>
  [...new Set(text.split("\n").map((line) => line.trim()).filter(Boolean))].slice(0, 12).map((line) => line.slice(0, 60));

export default function PreferencesForm({ profile, preferences, onClose, onSave, saveError }: PreferencesFormProps) {
  const [nicknameOne, setNicknameOne] = useState(profile.partnerOne.nickname);
  const [nicknameTwo, setNicknameTwo] = useState(profile.partnerTwo.nickname);
  const [tagline, setTagline] = useState(profile.tagline);
  const [activities, setActivities] = useState(toLines(preferences.activities));
  const [songs, setSongs] = useState(toLines(preferences.songs));
  const [places, setPlaces] = useState(toLines(preferences.places));
  const [saving, setSaving] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    const saved = await onSave(
      { tagline: tagline.trim(), nicknames: [nicknameOne.trim(), nicknameTwo.trim()] },
      { activities: fromLines(activities), songs: fromLines(songs), places: fromLines(places) },
    );
    if (saved) onClose();
    setSaving(false);
  };

  const listField = (label: string, value: string, set: (value: string) => void, placeholder: string) => (
    <label className={`${labelClass} sm:col-span-2`}>
      {label} <span className="font-normal text-[#A08F8A]">(one per line)</span>
      <textarea rows={3} value={value} onChange={(event) => set(event.target.value)} placeholder={placeholder} className={textareaClass} />
    </label>
  );

  return (
    <ModalShell titleId="preferences-form-title" onClose={() => { if (!saving) onClose(); }}>
      <form onSubmit={submit} className="p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:p-8">
        <fieldset disabled={saving}>
        <p className={eyebrowClass}>Shared preferences</p>
        <h2 id="preferences-form-title" className="mt-2 pr-12 font-serif text-3xl text-[#3E3131]">The little things we love</h2>
        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <label className={labelClass}>
            {profile.partnerOne.name || "Partner one"}&apos;s nickname
            <input maxLength={30} value={nicknameOne} onChange={(event) => setNicknameOne(event.target.value)} className={inputClass} />
          </label>
          <label className={labelClass}>
            {profile.partnerTwo.name || "Partner two"}&apos;s nickname
            <input maxLength={30} value={nicknameTwo} onChange={(event) => setNicknameTwo(event.target.value)} className={inputClass} />
          </label>
          <label className={`${labelClass} sm:col-span-2`}>
            Our tagline
            <input maxLength={80} value={tagline} onChange={(event) => setTagline(event.target.value)} placeholder="Two people, one beautiful story." className={inputClass} />
          </label>
          {listField("Favourite things to do together", activities, setActivities, "Slow Sunday coffee")}
          {listField("Favourite songs", songs, setSongs, "Our road trip playlist")}
          {listField("Favourite places", places, setPlaces, "Marine Drive")}
        </div>
        {saveError && <p role="alert" className="mt-5 rounded-xl bg-[#FFF0EF] px-4 py-3 text-xs text-[#9A4652]">{saveError}</p>}
        <div className="mt-7 flex gap-3">
          <button type="button" onClick={onClose} className="button-secondary">Cancel</button>
          <button type="submit" disabled={saving} className="button-primary">{saving ? "Saving..." : "Save preferences"}</button>
        </div>
        </fieldset>
      </form>
    </ModalShell>
  );
}
