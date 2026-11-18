import { Camera, Plus } from "lucide-react";

type EmptyMemoryStateProps = {
  filtered?: boolean;
  onAdd: () => void;
  onClear?: () => void;
};

export default function EmptyMemoryState({
  filtered = false,
  onAdd,
  onClear,
}: EmptyMemoryStateProps) {
  return (
    <section className="my-8 rounded-[28px] border border-dashed border-[#DCCBC6] bg-white/55 px-6 py-14 text-center">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#F5E6E4] text-[#A35C69]">
        <Camera aria-hidden="true" size={27} strokeWidth={1.5} />
      </span>
      <h2 className="mt-6 font-serif text-2xl text-[#453737]">
        {filtered
          ? "No memories in this chapter yet."
          : "Our story is still being written."}
      </h2>
      <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#7B6F6B]">
        {filtered
          ? "Try another category, or add a little moment to this one."
          : "Start saving those little moments that make us, us."}
      </p>
      <button
        type="button"
        onClick={filtered && onClear ? onClear : onAdd}
        className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#B66D79] px-5 text-sm font-medium text-white transition hover:bg-[#A35C69]"
      >
        {filtered && onClear ? (
          "Show all memories"
        ) : (
          <>
            <Plus aria-hidden="true" size={17} /> Add first memory
          </>
        )}
      </button>
    </section>
  );
}
