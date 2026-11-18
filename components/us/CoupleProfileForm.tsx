"use client";

import { Camera, Trash2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import ModalShell from "@/components/memories/ModalShell";
import PartnerAvatar from "@/components/us/PartnerAvatar";
import { eyebrowClass, inputClass, labelClass } from "@/components/us/formStyles";
import type { CoupleProfile } from "@/data/relationshipData";
import { useImagePicker } from "@/hooks/useImagePicker";
import { isValidDate, localToday } from "@/lib/dates";
import { isTemporaryImage } from "@/lib/imageStorage";

type CoupleProfileFormProps = {
  profile: CoupleProfile;
  onClose: () => void;
  onSave: (profile: CoupleProfile) => void;
};

export default function CoupleProfileForm({ profile, onClose, onSave }: CoupleProfileFormProps) {
  const [nameOne, setNameOne] = useState(profile.partnerOne.name);
  const [nameTwo, setNameTwo] = useState(profile.partnerTwo.name);
  const [nicknameOne, setNicknameOne] = useState(profile.partnerOne.nickname);
  const [nicknameTwo, setNicknameTwo] = useState(profile.partnerTwo.nickname);
  const [startDate, setStartDate] = useState(profile.relationshipStartDate);
  const [tagline, setTagline] = useState(profile.tagline);
  const [error, setError] = useState("");
  const avatarOne = useImagePicker(profile.partnerOne.avatar);
  const avatarTwo = useImagePicker(profile.partnerTwo.avatar);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!nameOne.trim() || !nameTwo.trim()) return setError("Both names are needed.");
    if (!isValidDate(startDate)) return setError("Choose a valid relationship start date.");
    if (startDate > localToday()) return setError("Your start date can't be in the future.");
    avatarOne.commit();
    avatarTwo.commit();
    onSave({
      ...profile,
      partnerOne: { name: nameOne.trim(), nickname: nicknameOne.trim(), avatar: avatarOne.image },
      partnerTwo: { name: nameTwo.trim(), nickname: nicknameTwo.trim(), avatar: avatarTwo.image },
      relationshipStartDate: startDate,
      tagline: tagline.trim(),
    });
  };

  const partnerFields = (
    label: string,
    name: string,
    setName: (value: string) => void,
    nickname: string,
    setNickname: (value: string) => void,
    picker: ReturnType<typeof useImagePicker>,
  ) => (
    <fieldset className="rounded-2xl border border-[#EEE5E0] bg-white p-4">
      <legend className="px-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8C7C78]">{label}</legend>
      <div className="flex items-center gap-4">
        <PartnerAvatar partner={{ name, avatar: picker.image }} className="h-20 w-20 shrink-0" textClassName="text-3xl" />
        <div className="flex flex-col gap-2">
          <label className="flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-[#EAD9D8] px-3 text-xs font-medium text-[#965461] hover:bg-[#FCF5F4]">
            <Camera aria-hidden="true" size={14} /> {picker.image ? "Change photo" : "Add photo"}
            <input type="file" accept="image/*" onChange={picker.select} className="sr-only" aria-label={`${label} photograph`} />
          </label>
          {picker.image && (
            <button type="button" onClick={picker.remove} className="flex min-h-9 items-center gap-2 px-1 text-xs text-[#A14F5C]">
              <Trash2 aria-hidden="true" size={13} /> Remove photo
            </button>
          )}
        </div>
      </div>
      {isTemporaryImage(picker.image) && <p className="mt-3 text-[11px] leading-5 text-[#8B7770]">Temporary demo preview until cloud storage is connected.</p>}
      {picker.error && <p role="alert" className="mt-2 text-xs text-[#9A4652]">{picker.error}</p>}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          Name <span aria-hidden="true" className="text-[#A35C69]">*</span>
          <input required maxLength={40} value={name} onChange={(event) => setName(event.target.value)} className={inputClass} />
        </label>
        <label className={labelClass}>
          Nickname
          <input maxLength={30} value={nickname} onChange={(event) => setNickname(event.target.value)} className={inputClass} />
        </label>
      </div>
    </fieldset>
  );

  return (
    <ModalShell titleId="profile-form-title" onClose={onClose}>
      <form onSubmit={submit} noValidate className="p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:p-8">
        <p className={eyebrowClass}>Couple profile</p>
        <h2 id="profile-form-title" className="mt-2 pr-12 font-serif text-3xl text-[#3E3131]">Edit our story</h2>
        <div className="mt-7 space-y-5">
          {partnerFields("Partner one", nameOne, setNameOne, nicknameOne, setNicknameOne, avatarOne)}
          {partnerFields("Partner two", nameTwo, setNameTwo, nicknameTwo, setNicknameTwo, avatarTwo)}
          <label className={`block ${labelClass}`}>
            Together since <span aria-hidden="true" className="text-[#A35C69]">*</span>
            <input required type="date" max={localToday()} value={startDate} onChange={(event) => setStartDate(event.target.value)} className={inputClass} />
          </label>
          <label className={`block ${labelClass}`}>
            Tagline
            <input maxLength={80} value={tagline} onChange={(event) => setTagline(event.target.value)} placeholder="Two people, one beautiful story." className={inputClass} />
          </label>
        </div>
        {error && <p role="alert" className="mt-5 rounded-xl bg-[#FFF0EF] px-4 py-3 text-xs text-[#9A4652]">{error}</p>}
        <div className="mt-7 flex gap-3">
          <button type="button" onClick={onClose} className="button-secondary">Cancel</button>
          <button type="submit" className="button-primary">Save profile</button>
        </div>
      </form>
    </ModalShell>
  );
}
