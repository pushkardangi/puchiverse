import { CalendarHeart } from "lucide-react";
import type { DurationState } from "@/hooks/useRelationshipDuration";
import { eyebrowClass } from "@/components/us/formStyles";

type RelationshipDurationProps = {
  duration: DurationState;
};

export default function RelationshipDuration({ duration }: RelationshipDurationProps) {
  const ready = duration.status === "ready";
  const units = [
    { label: "Years", value: ready ? duration.years : null },
    { label: "Months", value: ready ? duration.months : null },
    { label: "Days", value: ready ? duration.days : null },
  ];

  let caption = "Every day with you is another favourite day.";
  if (duration.status === "invalid") caption = "Set a valid start date in your couple profile to begin counting.";
  if (duration.status === "future") caption = "Your start date is still ahead. The count begins when your story does.";

  return (
    <section aria-labelledby="duration-title" className="card-surface text-center">
      <p className={eyebrowClass}>
        <span id="duration-title">Time together</span>
      </p>
      <dl className="mt-5 grid grid-cols-3 divide-x divide-[#F0E6E1]">
        {units.map(({ label, value }) => (
          <div key={label} className="px-2">
            <dd className="font-serif text-5xl font-medium tabular-nums text-[#3E3131] sm:text-6xl">{value ?? "–"}</dd>
            <dt className="mt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[#8C7C78]">
              {value === 1 ? label.slice(0, -1) : label}
            </dt>
          </div>
        ))}
      </dl>
      <p className="mt-6 font-serif text-base italic text-[#7B6A66]">{caption}</p>
      {ready && (
        <p className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full bg-[#FAF0EE] px-4 py-2 text-xs text-[#865760]">
          <CalendarHeart aria-hidden="true" size={14} />
          {duration.isAnniversaryToday
            ? "Happy anniversary! Today is your day."
            : `${duration.totalDays.toLocaleString("en-US")} days together · anniversary in ${duration.daysToAnniversary} ${duration.daysToAnniversary === 1 ? "day" : "days"}`}
        </p>
      )}
    </section>
  );
}
