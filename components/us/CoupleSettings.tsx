"use client";

import { Bell, ChevronRight, Info, LogOut, Palette, ShieldCheck, UserPen, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { SignOutButton } from "@clerk/nextjs";
import ModalShell from "@/components/memories/ModalShell";
import ToggleRow from "@/components/us/ToggleRow";
import { dangerButtonClass, eyebrowClass } from "@/components/us/formStyles";

type SheetKind = "notifications" | "privacy" | "theme" | "about" | "signout";

type CoupleSettingsProps = {
  onEditProfile: () => void;
  profileAvailable: boolean;
};

const rows: { id: SheetKind | "profile"; label: string; hint: string; icon: LucideIcon }[] = [
  { id: "profile", label: "Edit couple profile", hint: "Names, photos and start date", icon: UserPen },
  { id: "notifications", label: "Notification preferences", hint: "Reminders and updates", icon: Bell },
  { id: "privacy", label: "Privacy settings", hint: "Keep your world just for two", icon: ShieldCheck },
  { id: "theme", label: "Theme preferences", hint: "Ivory", icon: Palette },
  { id: "about", label: "About Puchiverse", hint: "Version and credits", icon: Info },
  { id: "signout", label: "Sign out", hint: "Sign out of your account", icon: LogOut },
];

const sheetTitles: Record<SheetKind, string> = {
  notifications: "Notification preferences",
  privacy: "Privacy settings",
  theme: "Theme preferences",
  about: "About Puchiverse",
  signout: "Sign out",
};

export default function CoupleSettings({ onEditProfile, profileAvailable }: CoupleSettingsProps) {
  const [sheet, setSheet] = useState<SheetKind>();

  return (
    <section aria-labelledby="settings-title">
      <h2 id="settings-title" className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8C7C78]">Settings</h2>
      <ul className="mt-3 divide-y divide-[#F0E8E3] overflow-hidden rounded-[22px] border border-[#EEE5E0] bg-white">
        {rows.map(({ id, label, hint, icon: Icon }) => (
          <li key={id}>
            <button
              type="button"
              disabled={id === "profile" && !profileAvailable}
              onClick={() => (id === "profile" ? onEditProfile() : setSheet(id))}
              className="flex min-h-14 w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-[#FCF8F6] disabled:opacity-50"
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
                <ToggleRow label="Important date reminders" hint="For dates where you turned reminders on." checked={false} onChange={() => {}} disabled />
                <ToggleRow label="Hugs" hint="When your person sends you a hug." checked={false} onChange={() => {}} disabled />
                <ToggleRow label="Memories and milestones" hint="Gentle nudges to look back." checked={false} onChange={() => {}} disabled />
                <p className="text-[11px] leading-5 text-[#A08F8A]">Notifications are off for now. These preferences will become available when push notifications are connected.</p>
              </div>
            )}
            {sheet === "privacy" && (
              <div className="mt-6 space-y-3">
                <ToggleRow label="Hide previews" hint="Blur photographs until tapped." checked={false} onChange={() => {}} disabled />
                <ToggleRow label="Require unlock" hint="Ask for a passcode when opening the app." checked={false} onChange={() => {}} disabled />
                <p className="text-[11px] leading-5 text-[#A08F8A]">Privacy settings are off for now. They&apos;ll become available once accounts and secure storage are added.</p>
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
              <div className="mt-6 space-y-5 text-sm leading-6 text-[#665753]">
                <p className="font-serif text-lg italic text-[#7B6A66]">Your little world, just for two.</p>
                <p>Puchiverse is a private, relationship-focused space where two people can celebrate moments, plan together and keep small acts of affection in one place.</p>

                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8C7C78]">How Puchiverse works</p>
                  <ul className="space-y-2">
                    <li className="rounded-2xl border border-[#EEE5E0] bg-[#FCF8F6] px-4 py-3">
                      <span className="font-medium text-[#4A3F3E]">Connect with your person</span>
                      <span className="block text-xs leading-5 text-[#8C7C78]">Search by username and accept a relationship request to start sharing features.</span>
                    </li>
                    <li className="rounded-2xl border border-[#EEE5E0] bg-[#FCF8F6] px-4 py-3">
                      <span className="font-medium text-[#4A3F3E]">Share your story</span>
                      <span className="block text-xs leading-5 text-[#8C7C78]">Save milestones, important dates, memories and bucket-list goals together.</span>
                    </li>
                    <li className="rounded-2xl border border-[#EEE5E0] bg-[#FCF8F6] px-4 py-3">
                      <span className="font-medium text-[#4A3F3E]">Send small moments of love</span>
                      <span className="block text-xs leading-5 text-[#8C7C78]">Exchange puchis, love notes and virtual hugs to make ordinary days feel special.</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-[#EEE5E0] px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8C7C78]">Built for understanding</p>
                  <p className="mt-1 text-xs leading-5 text-[#8C7C78]">Puchiverse helps couples keep context close: what happened, what matters, and what they hope to experience next. Account access and shared relationship data keep the experience connected to the right two people.</p>
                </div>

                <div className="border-t border-[#EEE5E0] pt-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8C7C78]">Developer</p>
                  <p className="mt-1 font-medium text-[#665753]">Pushkar Dangi</p>
                  <a href="mailto:web.pushkar@gmail.com" className="text-[#A35C69] underline underline-offset-2">web.pushkar@gmail.com</a>
                  <p className="text-xs text-[#A08F8A]">3+ years of web development experience</p>
                </div>
                <p className="text-xs text-[#A08F8A]">Puchiverse · Version 0.1.0</p>
              </div>
            )}
            {sheet === "signout" && (
              <div className="mt-6 space-y-4 text-sm leading-6 text-[#665753]">
                <p>Sign out of your Puchiverse account.</p>
                <SignOutButton>
                  <button type="button" className={`${dangerButtonClass} w-full`}>Sign out</button>
                </SignOutButton>
              </div>
            )}
          </div>
        </ModalShell>
      )}
    </section>
  );
}
