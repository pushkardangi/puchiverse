import { Camera, Plus } from "lucide-react";

type MemoryPageHeaderProps = {
  count: number;
  onAdd: () => void;
};

export default function MemoryPageHeader({ count, onAdd }: MemoryPageHeaderProps) {
  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#A35C69]">
          <Camera aria-hidden="true" size={14} strokeWidth={1.8} /> Our story, kept close
        </p>
        <h1 className="mt-3 font-serif text-4xl font-medium tracking-tight text-[#342B2C] sm:text-5xl">
          Memory Lane <span className="font-sans text-3xl font-normal text-[#B66D79]">♡</span>
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#766D69]">Every little moment, worth remembering.</p>
        <p className="mt-1 text-xs font-medium text-[#A35C69]">
          {count} {count === 1 ? "beautiful memory" : "beautiful memories"}
        </p>
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#B66D79] px-5 text-sm font-medium text-white shadow-sm transition hover:bg-[#A35C69] active:scale-[0.99]"
      >
        <Plus aria-hidden="true" size={17} /> Add memory
      </button>
    </header>
  );
}
