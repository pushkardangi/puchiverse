import { CalendarDays, Heart, Sparkles } from "lucide-react";
import { useCountdown } from "@/hooks/useCountdown";

type CountdownCardProps = {
  targetDate: string;
};

export default function CountdownCard({ targetDate }: CountdownCardProps) {
  const days = useCountdown(targetDate);

  return (
    <section aria-labelledby="countdown-title" className="min-w-0 rounded-[var(--radius-card)] border border-[#EDE8E1] bg-[#F1EEE8] p-5 sm:p-6 md:mt-14">
      <div className="flex items-center justify-between gap-4">
        <h2 id="countdown-title" className="flex items-center gap-2 text-sm font-semibold">
          <CalendarDays aria-hidden="true" size={17} className="text-[#8b6857]" /> Something special
        </h2>
        <Sparkles aria-hidden="true" size={17} className="text-[#8b6857]" />
      </div>
      <div className="mt-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm text-[#766d69]">Counting down to our day</p>
          <p className="mt-1 text-5xl font-semibold tracking-tight">
            {days ?? "—"}<span className="ml-2 text-sm font-normal text-[#766d69]">days left</span>
          </p>
        </div>
        <Heart aria-hidden="true" size={30} className="mb-2 shrink-0 fill-[#D4A6A0] text-[#D4A6A0]" />
      </div>
    </section>
  );
}
