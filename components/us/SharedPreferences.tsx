"use client";

import { Music2, Pencil, Quote, Ticket, MapPin } from "lucide-react";
import { useState } from "react";
import PreferencesForm from "@/components/us/PreferencesForm";
import { eyebrowClass } from "@/components/us/formStyles";
import type { CoupleProfile, SharedPreferences as Preferences } from "@/data/relationshipData";

type SharedPreferencesProps = {
  profile: CoupleProfile;
  preferences: Preferences;
  onSave: (profile: Pick<CoupleProfile, "tagline"> & { nicknames: [string, string] }, preferences: Preferences) => Promise<boolean>;
  saveError?: string;
};

function Chips({ icon: Icon, title, items }: { icon: typeof Music2; title: string; items: string[] }) {
  return (
    <div>
      <h3 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8C7C78]">
        <Icon aria-hidden="true" size={14} /> {title}
      </h3>
      {items.length > 0 ? (
        <ul className="mt-3 flex flex-wrap gap-2">
          {items.map((item) => <li key={item} className="rounded-full border border-[#EBDDD8] bg-[#FFFDFC] px-3 py-1.5 text-xs text-[#6F5F5C]">{item}</li>)}
        </ul>
      ) : (
        <p className="mt-3 text-xs text-[#A08F8A]">Nothing added yet.</p>
      )}
    </div>
  );
}

export default function SharedPreferences({ profile, preferences, onSave, saveError }: SharedPreferencesProps) {
  const [editing, setEditing] = useState(false);
  const { partnerOne, partnerTwo } = profile;

  return (
    <section aria-labelledby="preferences-title">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className={eyebrowClass}>Just us</p>
          <h2 id="preferences-title" className="mt-2 font-serif text-3xl text-[#342B2C]">Shared Preferences</h2>
        </div>
        <button type="button" onClick={() => setEditing(true)} className="flex min-h-11 shrink-0 items-center gap-2 rounded-2xl border border-[#EAD9D8] px-4 text-sm font-medium text-[#965461] transition hover:bg-[#FCF5F4]">
          <Pencil aria-hidden="true" size={15} /> Edit
        </button>
      </div>

      <div className="card-surface mt-6 space-y-7">
        <div className="grid gap-4 sm:grid-cols-2">
          {[partnerOne, partnerTwo].map((partner, index) => (
            <p key={index} className="text-sm text-[#665753]">
              <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8C7C78]">{partner.name || "Partner"} is also</span>
              <span className="mt-1 block font-serif text-xl text-[#3E3131]">{partner.nickname || "—"}</span>
            </p>
          ))}
        </div>
        <p className="flex gap-3 border-t border-[#F0E6E1] pt-6 font-serif text-lg italic text-[#6F5F5C]">
          <Quote aria-hidden="true" size={16} className="mt-1.5 shrink-0 text-[#B66D79]" />
          {profile.tagline || "Add a tagline that sounds like you two."}
        </p>
        <div className="grid gap-7 border-t border-[#F0E6E1] pt-6 sm:grid-cols-3">
          <Chips icon={Ticket} title="Together we love" items={preferences.activities} />
          <Chips icon={Music2} title="Our songs" items={preferences.songs} />
          <Chips icon={MapPin} title="Our places" items={preferences.places} />
        </div>
      </div>

      {editing && (
        <PreferencesForm
          profile={profile}
          preferences={preferences}
          onClose={() => setEditing(false)}
          onSave={onSave}
          saveError={saveError}
        />
      )}
    </section>
  );
}
