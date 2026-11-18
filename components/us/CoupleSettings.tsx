"use client";

import { Bell, ChevronRight, Info, LogOut, Palette, ShieldCheck, UserPen, type LucideIcon } from "lucide-react";
import { useState } from "react";
import ModalShell from "@/components/memories/ModalShell";
import ToggleRow from "@/components/us/ToggleRow";
import { dangerButtonClass, eyebrowClass } from "@/components/us/formStyles";
import { US_STORAGE_KEYS, type AppSettings } from "@/data/relationshipData";

type SheetKind = "notifications" | "privacy" | "theme" | "about" | "signout";

type CoupleSettingsProps = {
  settings: AppSettings;
  onChange: (update: (current: AppSettings) => AppSettings) => void;
  onEditProfile: () => void;
};

const rows: { id: SheetKind | "profile"; label: string; hint: string; icon: LucideIcon }[] = [
  { id: "profile", label: "Edit couple profile", hint: "Names, photos and start date", icon: UserPen },
  { id: "notifications", label: "Notification preferences", hint: "Reminders and updates", icon: Bell },
  { id: "privacy", label: "Privacy settings", hint: "Keep your world just for two", icon: ShieldCheck },
  { id: "theme", label: "Theme preferences", hint: "Ivory", icon: Palette },
  { id: "about", label: "About Puchiverse", hint: "Version and credits", icon: Info },
  { id: "signout", label: "Sign out", hint: "Account and demo data", icon: LogOut },
];

const sheetTitles: Record<SheetKind, string> = {
  notifications: "Notification preferences",
  privacy: "Privacy settings",
  theme: "Theme preferences",
  about: "About Puchiverse",
  signout: "Sign out",
};

export default function CoupleSettings({ settings, onChange, onEditProfile }: CoupleSettingsProps) {
  const [sheet, setSheet] = useState<SheetKind>();

  const resetDemoData = () => {
    if (!window.confirm("Reset all Us screen demo data on this device? Milestones, bucket list, dates and profile return to their defaults.")) return;
    Object.values(US_STORAGE_KEYS).forEach((key) => window.localStorage.removeItem(key));
    window.location.reload();
  };

  return (
    <section aria-labelledby="settings-title">
      <h2 id="settings-title" className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8C7C78]">Settings</h2>
      <ul className="mt-3 divide-y divide-[#F0E8E3] overflow-hidden rounded-[22px] border border-[#EEE5E0] bg-white">
        {rows.map(({ id, label, hint, icon: Icon }) => (
          <li key={id}>
            <button
              type="button"
              onClick={() => (id === "profile" ? onEditProfile() : setSheet(id))}
              className="flex min-h-14 w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-[#FCF8F6]"
            >
              <Icon aria-hidden="true" size={18} strokeWidth={1.7} className="shrink-0 text-[#8C7C78]" />
              <span className="min-w-0 flex-1">
                <span className="block text-sm text-[#4A3F3E]">{label}</span>
                <span className="block truncate text-[11px] text-[#A08F8A]">{hint}</span>
              </span>
              <ChevronRight aria-hidden="true" size={16} className="shrink-0 text-[#C9BAB5]" />
            </button>
          </li>
        ))}
      </ul>

      {sheet && (
        <ModalShell titleId="settings-sheet-title" onClose={() => setSheet(undefined)}>
          <div className="p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:p-8">
            <p className={eyebrowClass}>Settings</p>
            <h2 id="settings-sheet-title" className="mt-2 pr-12 font-serif text-3xl text-[#3E3131]">{sheetTitles[sheet]}</h2>

            {sheet === "notifications" && (
              <div className="mt-6 space-y-3">
                <ToggleRow label="Important date reminders" hint="For dates where you turned reminders on." checked={settings.notifications.dateReminders} onChange={(checked) => onChange((c) => ({ ...c, notifications: { ...c.notifications, dateReminders: checked } }))} />
                <ToggleRow label="Puchis" hint="When your person sends one." checked={settings.notifications.puchis} onChange={(checked) => onChange((c) => ({ ...c, notifications: { ...c.notifications, puchis: checked } }))} />
                <ToggleRow label="Memories and milestones" hint="Gentle nudges to look back." checked={settings.notifications.memories} onChange={(checked) => onChange((c) => ({ ...c, notifications: { ...c.notifications, memories: checked } }))} />
                <p className="text-[11px] leading-5 text-[#A08F8A]">Preferences are saved on this device. Delivery starts once push notifications are connected.</p>
              </div>
            )}
            {sheet === "privacy" && (
              <div className="mt-6 space-y-3">
                <ToggleRow label="Hide previews" hint="Blur photographs until tapped." checked={settings.privacy.hidePreviews} onChange={(checked) => onChange((c) => ({ ...c, privacy: { ...c.privacy, hidePreviews: checked } }))} />
                <ToggleRow label="Require unlock" hint="Ask for a passcode when opening the app." checked={settings.privacy.requireUnlock} onChange={(checked) => onChange((c) => ({ ...c, privacy: { ...c.privacy, requireUnlock: checked } }))} />
                <p className="text-[11px] leading-5 text-[#A08F8A]">Saved as preferences. They&apos;ll take effect once accounts and secure storage are added.</p>
              </div>
            )}
            {sheet === "theme" && (
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between rounded-2xl border border-[#B66D79] bg-white px-4 py-4">
                  <span><span className="block text-sm font-medium text-[#4A3F3E]">Ivory</span><span className="text-[11px] text-[#8C7C78]">Warm, soft and quiet.</span></span>
                  <span className="rounded-full bg-[#F7E8E7] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#965461]">Current</span>
                </div>
                <div aria-disabled="true" className="flex items-center justify-between rounded-2xl border border-[#EEE5E0] bg-[#FBF8F6] px-4 py-4 opacity-70">
                  <span><span className="block text-sm text-[#4A3F3E]">Evening</span><span className="text-[11px] text-[#8C7C78]">A softer dark theme.</span></span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8C7C78]">Coming soon</span>
                </div>
              </div>
            )}
            {sheet === "about" && (
              <div className="mt-6 space-y-3 text-sm leading-6 text-[#665753]">
                <p className="font-serif text-lg italic text-[#7B6A66]">Your little world, just for two.</p>
                <p>Puchiverse is a private space for two people to keep their story, plan their future and send each other small moments of love.</p>
                <p className="text-xs text-[#A08F8A]">Version 0.1.0 · Frontend demo. Data stays in this browser.</p>
              </div>
            )}
            {sheet === "signout" && (
              <div className="mt-6 space-y-4 text-sm leading-6 text-[#665753]">
                <p>Accounts aren&apos;t connected yet, so there&apos;s nothing to sign out of. Everything you add is stored in this browser only.</p>
                <button type="button" onClick={resetDemoData} className={`${dangerButtonClass} w-full`}>Reset Us demo data</button>
              </div>
            )}

            <button type="button" onClick={() => setSheet(undefined)} className="button-secondary mt-7">Done</button>
          </div>
        </ModalShell>
      )}
    </section>
  );
}
