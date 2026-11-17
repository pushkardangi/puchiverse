import { ChevronRight } from "lucide-react";
import EmptyState from "@/components/common/EmptyState";
import SectionHeader from "@/components/common/SectionHeader";
import MemoryCard from "@/components/home/MemoryCard";
import type { Memory } from "@/data/demoData";

type MemoryLaneSectionProps = {
  memories: readonly Memory[];
  onViewAll: () => void;
};

export default function MemoryLaneSection({ memories, onViewAll }: MemoryLaneSectionProps) {
  return (
    <section className="min-w-0">
      <SectionHeader title="Memory Lane" action={<button type="button" onClick={onViewAll} className="text-action">See all <ChevronRight aria-hidden="true" size={14} /></button>} />
      {memories.length === 0 ? (
        <EmptyState message="Your memories will find a home here." />
      ) : (
        <div role="region" aria-label="Memory carousel" tabIndex={0} className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2">
          {memories.map((memory) => <MemoryCard key={`${memory.title}-${memory.date}`} memory={memory} />)}
        </div>
      )}
    </section>
  );
}
