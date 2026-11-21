"use client";

import { useState, type FormEvent } from "react";
import ModalShell from "@/components/memories/ModalShell";
import PartnerAvatar from "@/components/us/PartnerAvatar";
import { eyebrowClass, inputClass, labelClass } from "@/components/us/formStyles";
import type { CoupleProfile } from "@/data/relationshipData";
import { isValidDate, localToday } from "@/lib/dates";

type CoupleProfileFormProps = {
  profile: CoupleProfile;
  onClose: () => void;
  onSave: (profile: CoupleProfile) => Promise<boolean>;
  saveError?: string;
};

export default function CoupleProfileForm({ profile, onClose, onSave, saveError }: CoupleProfileFormProps) {
  const [nameOne, setNameOne] = useState(profile.partnerOne.name);
  const [nameTwo, setNameTwo] = useState(profile.partnerTwo.name);
  const [nicknameOne, setNicknameOne] = useState(profile.partnerOne.nickname);
  const [nicknameTwo, setNicknameTwo] = useState(profile.partnerTwo.nickname);
  const [startDate, setStartDate] = useState(profile.relationshipStartDate);
  const [tagline, setTagline] = useState(profile.tagline);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!nameOne.trim() || !nameTwo.trim()) return setError("Both names are needed.");
    if (startDate && !isValidDate(startDate)) return setError("Choose a valid relationship start date.");
    if (startDate > localToday()) return setError("Your start date can't be in the future.");
    setError("");
    setSaving(true);
    const saved = await onSave({
      ...profile,
      partnerOne: { name: nameOne.trim(), nickname: nicknameOne.trim(), avatar: profile.partnerOne.avatar },
      partnerTwo: { name: nameTwo.trim(), nickname: nicknameTwo.trim(), avatar: profile.partnerTwo.avatar },
      relationshipStartDate: startDate,
      tagline: tagline.trim(),
    });
    if (saved) onClose();
    setSaving(false);
  };

  const partnerFields = (
    label: string,
    name: string,
    setName: (value: string) => void,
    nickname: string,
    setNickname: (value: string) => void,
    avatar: string | null,
  ) => (
    <fieldset className="rounded-2xl border border-[#EEE5E0] bg-white p-4">
      <legend className="px-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8C7C78]">{label}</legend>
      <div className="grid grid-cols-[80px_minmax(0,1fr)] items-center gap-4 sm:grid-cols-[80px_minmax(0,1fr)_minmax(0,1fr)]">
        <PartnerAvatar partner={{ name, avatar }} className="h-20 w-20 shrink-0" textClassName="text-3xl" />
        <div className="grid gap-3 sm:contents">
          <label className={labelClass}>
            Name <span aria-hidden="true" className="text-[#A35C69]">*</span>
            <input required maxLength={40} value={name} onChange={(event) => setName(event.target.value)} className={inputClass} />
          </label>
          <label className={labelClass}>
            Nickname
            <input maxLength={30} value={nickname} onChange={(event) => setNickname(event.target.value)} className={inputClass} />
          </label>
        </div>
      </div>
    </fieldset>
  );

  return (
    <ModalShell titleId="profile-form-title" onClose={() => { if (!saving) onClose(); }}>
      <form onSubmit={submit} noValidate className="p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:p-8">
        <fieldset disabled={saving}>
        <p className={eyebrowClass}>Couple profile</p>
        <h2 id="profile-form-title" className="mt-2 pr-12 font-serif text-3xl text-[#3E3131]">Edit our story</h2>
        <div className="mt-7 space-y-5">
          {partnerFields("Partner one", nameOne, setNameOne, nicknameOne, setNicknameOne, profile.partnerOne.avatar)}
          {partnerFields("Partner two", nameTwo, setNameTwo, nicknameTwo, setNicknameTwo, profile.partnerTwo.avatar)}
          <label className={`block ${labelClass}`}>
            Together since <span className="font-normal text-[#A08F8A]">(optional)</span>
            <input type="date" max={localToday()} value={startDate} onChange={(event) => setStartDate(event.target.value)} className={inputClass} />
          </label>
          <label className={`block ${labelClass}`}>
            Tagline
            <input maxLength={80} value={tagline} onChange={(event) => setTagline(event.target.value)} placeholder="Two people, one beautiful story." className={inputClass} />
          </label>
        </div>
        {(error || saveError) && <p role="alert" className="mt-5 rounded-xl bg-[#FFF0EF] px-4 py-3 text-xs text-[#9A4652]">{error || saveError}</p>}
        <div className="mt-7 flex gap-3">
          <button type="button" onClick={onClose} className="button-secondary">Cancel</button>
          <button type="submit" disabled={saving} className="button-primary">{saving ? "Saving..." : "Save profile"}</button>
        </div>
        </fieldset>
      </form>
    </ModalShell>
  );
}
