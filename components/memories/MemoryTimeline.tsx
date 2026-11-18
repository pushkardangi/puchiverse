import type { Memory } from "@/data/memories";
import MemoryCard from "@/components/memories/MemoryCard";

type MemoryTimelineProps = {
  memories: Memory[];
  onOpen: (memory: Memory) => void;
  onEdit: (memory: Memory) => void;
  onDelete: (memory: Memory) => void;
  onToggleFeatured: (memory: Memory) => void;
};

export default function MemoryTimeline({
  memories,
  onOpen,
  onEdit,
  onDelete,
  onToggleFeatured,
}: MemoryTimelineProps) {
  const ordered = [...memories].sort((a, b) => b.date.localeCompare(a.date));
  const groups = ordered.reduce<Record<string, Record<string, Memory[]>>>(
    (years, memory) => {
      const date = new Date(`${memory.date}T12:00:00`);
      const year = date.getFullYear().toString();
      const month = date.toLocaleDateString("en-US", { month: "long" });
      years[year] ??= {};
      years[year][month] ??= [];
      years[year][month].push(memory);
      return years;
    },
    {},
  );
  const years = Object.keys(groups).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="mt-8">
      {years.map((year) => {
        const months = groups[year];
        return (
          <section
            key={year}
            aria-labelledby={`memory-year-${year}`}
            className="mb-10"
          >
            <div className="flex items-center gap-4">
              <h2
                id={`memory-year-${year}`}
                className="font-serif text-3xl text-[#574747]"
              >
                {year}
              </h2>
              <span className="h-px flex-1 bg-[#E7DDD8]" />
            </div>
            {Object.entries(months).map(([month, items]) => (
              <div
                key={`${year}-${month}`}
                className="relative mt-6 pl-4 sm:pl-6"
              >
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-0 top-1 w-px bg-[#DDCBC7]"
                />
                <span
                  aria-hidden="true"
                  className="absolute -left-[3px] top-2 h-[7px] w-[7px] rounded-full bg-[#B66D79]"
                />
                <div className="mb-4 flex items-baseline justify-between">
                  <h3 className="text-sm font-semibold tracking-wide text-[#665451]">
                    {month}
                  </h3>
                  <span className="text-[11px] text-[#A0918C]">
                    {items.length} {items.length === 1 ? "memory" : "memories"}
                  </span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((memory) => (
                    <MemoryCard
                      key={memory.id}
                      memory={memory}
                      onOpen={onOpen}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onToggleFeatured={onToggleFeatured}
                    />
                  ))}
                </div>
              </div>
            ))}
          </section>
        );
      })}
    </div>
  );
}
