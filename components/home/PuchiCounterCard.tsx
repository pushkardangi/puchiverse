import { Heart, Plus } from "lucide-react";
import Link from "next/link";
import SectionHeader from "@/components/common/SectionHeader";
import { usePuchis } from "@/components/puchis/PuchiProvider";

type PuchiCounterCardProps = {
  showViewAll?: boolean;
};

export default function PuchiCounterCard({ showViewAll = true }: PuchiCounterCardProps) {
  const { count, addPuchi } = usePuchis();

  return (
    <section className="flex h-full min-w-0 flex-col">
      <SectionHeader title="Our little moments" action={showViewAll ? <Link href="/puchis" className="text-action">View all</Link> : undefined} />
      <div className="card-surface flex flex-1 flex-col gap-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-[#766d69]">Total puchis</p>
            <p className="mt-1 text-4xl font-semibold tracking-tight" aria-live="polite">{count}</p>
            <p className="mt-1 text-xs text-[#766d69]">Every single one counts.</p>
          </div>
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#F9ECEE]">
            <Heart aria-hidden="true" size={31} className="fill-[#C77F89] text-[#C77F89]" />
          </div>
        </div>
        <button type="button" onClick={addPuchi} className="button-primary mt-auto">
          <Plus aria-hidden="true" size={17} /> Send a puchi
        </button>
      </div>
    </section>
  );
}
