import { MEMORY_CATEGORIES } from "@/data/memories";

export type MemoryFilter = "All" | (typeof MEMORY_CATEGORIES)[number];

type MemoryFiltersProps = {
  selected: MemoryFilter;
  onSelect: (filter: MemoryFilter) => void;
};

export default function MemoryFilters({ selected, onSelect }: MemoryFiltersProps) {
  return (
    <nav aria-label="Filter memories" className="-mx-5 mt-8 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:-mx-8 sm:px-8">
      <div className="flex w-max min-w-full gap-2">
        {(["All", ...MEMORY_CATEGORIES] as MemoryFilter[]).map((filter) => (
          <button
            type="button"
            key={filter}
            aria-pressed={selected === filter}
            onClick={() => onSelect(filter)}
            className={`min-h-10 whitespace-nowrap rounded-full border px-4 text-xs font-medium transition ${
              selected === filter
                ? "border-[#A35C69] bg-[#A35C69] text-white shadow-sm"
                : "border-[#E8DFDA] bg-white text-[#766D69] hover:border-[#CFA7AA] hover:text-[#965461]"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </nav>
  );
}
