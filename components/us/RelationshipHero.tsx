import { Heart, Pencil } from "lucide-react";
import PartnerAvatar from "@/components/us/PartnerAvatar";
import type { DurationState } from "@/hooks/useRelationshipDuration";
import type { CoupleProfile } from "@/data/relationshipData";
import { describeDuration, formatDate, isValidDate } from "@/lib/dates";
import { eyebrowClass } from "@/components/us/formStyles";

type RelationshipHeroProps = {
  profile: CoupleProfile;
  duration: DurationState;
  onEdit: () => void;
};

function durationLabel(duration: DurationState) {
  if (duration.status === "ready") return describeDuration(duration);
  if (duration.status === "future") return "Your story begins soon";
  if (duration.status === "invalid") return "Add your start date";
  return "\u00A0";
}

export default function RelationshipHero({ profile, duration, onEdit }: RelationshipHeroProps) {
  const { partnerOne, partnerTwo } = profile;
  const hasDate = isValidDate(profile.relationshipStartDate);

  return (
    <section aria-labelledby="us-title" className="relative overflow-hidden rounded-4xl border border-[#EDE2DC] bg-white px-5 pb-8 pt-7 text-center shadow-[0_18px_45px_rgba(78,55,51,0.07)] sm:px-10 sm:pb-10 sm:pt-9">
      <button
        type="button"
        onClick={onEdit}
        aria-label="Edit couple profile"
        className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full text-[#A35C69] transition hover:bg-[#FCF5F4] sm:right-5 sm:top-5"
      >
        <Pencil aria-hidden="true" size={17} />
      </button>

      <p className={eyebrowClass}>Our little universe</p>

      <div className="mt-6 flex items-center justify-center" role="group" aria-label={`${partnerOne.name} and ${partnerTwo.name}`}>
        <PartnerAvatar partner={partnerOne} className="h-28 w-28 sm:h-36 sm:w-36" textClassName="text-5xl" />
        <span className="z-10 -mx-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#EAD6D6] bg-[#FAF8F5] shadow-sm sm:-mx-4 sm:h-11 sm:w-11">
          <Heart aria-hidden="true" size={17} className="fill-[#B66D79] text-[#B66D79]" />
        </span>
        <PartnerAvatar partner={partnerTwo} className="h-28 w-28 sm:h-36 sm:w-36" textClassName="text-5xl" />
      </div>

      <h1 id="us-title" className="mx-auto mt-6 max-w-full break-words font-serif text-3xl font-medium tracking-tight text-[#342B2C] sm:text-5xl">
        {partnerOne.name} <span className="font-sans font-light text-[#B66D79]">+</span> {partnerTwo.name}
      </h1>
      {(partnerOne.nickname || partnerTwo.nickname) && (
        <p className="mt-2 text-xs text-[#8C7C78]">
          {[partnerOne.nickname, partnerTwo.nickname].filter(Boolean).join("  ·  ")}
        </p>
      )}
      {profile.tagline && <p className="mx-auto mt-4 max-w-md font-serif text-lg italic leading-7 text-[#6F5F5C]">&ldquo;{profile.tagline}&rdquo;</p>}

      <div className="mx-auto mt-7 flex max-w-sm flex-col items-center gap-1 border-t border-[#EFE5E0] pt-5">
        <p className="text-xs text-[#8C7C78]">
          Together since{" "}
          {hasDate ? <time dateTime={profile.relationshipStartDate} className="font-medium text-[#665753]">{formatDate(profile.relationshipStartDate)}</time> : "—"}
        </p>
        <p className="text-sm font-medium text-[#A35C69]">{durationLabel(duration)}</p>
      </div>
    </section>
  );
}
