"use client";

import { Check, Heart, Loader2 } from "lucide-react";
import PartnerAvatar from "@/components/us/PartnerAvatar";
import type { PublicProfile, RequestState } from "@/lib/relationship-types";

type UserSearchResultProps = {
  profile: PublicProfile;
  requestState: RequestState;
  busy: boolean;
  errorMessage: string | null;
  onSend: () => void;
  onAccept: () => void;
};

const actionClass =
  "mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#B66D79] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#A35C69] disabled:cursor-not-allowed disabled:opacity-60";

export default function UserSearchResult({
  profile,
  requestState,
  busy,
  errorMessage,
  onSend,
  onAccept,
}: UserSearchResultProps) {
  return (
    <article className="mt-5 rounded-2xl border border-[#F0E8E3] bg-[#FAF8F5] p-4" aria-live="polite">
      <div className="flex items-center gap-4">
        <PartnerAvatar
          partner={{ name: profile.displayName, avatar: profile.avatar ?? "" }}
          className="h-16 w-16 shrink-0"
          textClassName="text-2xl"
        />
        <div className="min-w-0">
          <h3 className="truncate font-semibold">{profile.displayName}</h3>
          <p className="truncate text-sm text-[#766d69]">@{profile.username}</p>
        </div>
      </div>

      {requestState === "none" && (
        <button type="button" onClick={onSend} disabled={busy} className={actionClass}>
          {busy ? (
            <Loader2 aria-hidden="true" size={16} className="animate-spin" />
          ) : (
            <Heart aria-hidden="true" size={16} />
          )}
          {busy ? "Sending…" : "Send Relationship Request"}
        </button>
      )}

      {requestState === "outgoing_pending" && (
        <p role="status" className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-[#F9ECEE] px-4 py-3 text-center text-sm text-[#80595f]">
          <Check aria-hidden="true" size={16} className="shrink-0" />
          You&apos;ve already sent a relationship request to this person.
        </p>
      )}

      {requestState === "incoming_pending" && (
        <>
          <p className="mt-4 text-center text-sm text-[#80595f]">
            {profile.displayName} has already sent you a relationship request.
          </p>
          <button type="button" onClick={onAccept} disabled={busy} className={actionClass.replace("mt-4", "mt-3")}>
            {busy ? (
              <Loader2 aria-hidden="true" size={16} className="animate-spin" />
            ) : (
              <Check aria-hidden="true" size={16} />
            )}
            {busy ? "Accepting…" : "Review & Accept Request"}
          </button>
        </>
      )}

      {errorMessage && (
        <p role="alert" className="mt-3 text-center text-xs leading-5 text-[#A14F5C]">
          {errorMessage}
        </p>
      )}
    </article>
  );
}
