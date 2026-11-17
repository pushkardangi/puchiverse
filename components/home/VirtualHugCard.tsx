import { useState } from "react";
import { HeartHandshake } from "lucide-react";
import SectionHeader from "@/components/common/SectionHeader";

export default function VirtualHugCard() {
  const [prepared, setPrepared] = useState(false);

  return (
    <section className="flex h-full min-w-0 flex-col">
      <SectionHeader title="A little closeness" />
      <div className="card-surface flex flex-1 flex-col">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#F9ECEE]">
            <HeartHandshake aria-hidden="true" size={27} strokeWidth={1.8} className="text-[#A35C69]" />
          </div>
          <div>
            <h3 className="font-semibold">Send a virtual hug</h3>
            <p className="mt-1 text-xs leading-5 text-[#766d69]">A little warmth for when we&apos;re apart.</p>
          </div>
        </div>
        <div aria-live="polite" className="flex-1">
          {prepared && (
            <p className="mt-4 rounded-xl bg-[#FAF5F2] p-4 text-sm leading-6 text-[#705c5d]">
              Your hug is ready. Sending will be available once connected.
            </p>
          )}
        </div>
        <button type="button" onClick={() => setPrepared(true)} className="button-secondary mt-4">
          <HeartHandshake aria-hidden="true" size={16} /> {prepared ? "Hug prepared" : "Prepare a hug"}
        </button>
      </div>
    </section>
  );
}
