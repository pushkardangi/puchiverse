import { useState } from "react";
import { Gift, Sparkles } from "lucide-react";
import SectionHeader from "@/components/common/SectionHeader";

type LoveJarCardProps = {
  notes: readonly string[];
};

export default function LoveJarCard({ notes }: LoveJarCardProps) {
  const [noteIndex, setNoteIndex] = useState<number | null>(null);

  function openNote() {
    if (notes.length === 0) return;
    const choices = notes.length > 1 && noteIndex !== null ? notes.length - 1 : notes.length;
    const next = Math.floor(Math.random() * choices);
    setNoteIndex(noteIndex !== null && notes.length > 1 && next >= noteIndex ? next + 1 : next);
  }

  return (
    <section className="flex h-full min-w-0 flex-col">
      <SectionHeader title="A note for you" action={<span className="text-xs text-[#766d69]">From me, to you</span>} />
      <div className="card-surface flex flex-1 flex-col">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#F9ECEE]">
            <Gift aria-hidden="true" size={27} strokeWidth={1.8} className="text-[#A35C69]" />
          </div>
          <div>
            <h3 className="font-semibold">Love Jar</h3>
            <p className="mt-1 text-xs leading-5 text-[#766d69]">A tiny reminder of how much you mean to me.</p>
          </div>
        </div>
        <div aria-live="polite" className="flex-1">
          {noteIndex !== null && (
            <blockquote className="mt-4 rounded-xl bg-[#FAF5F2] p-4 text-sm leading-6 text-[#705c5d]">
              <Sparkles aria-hidden="true" size={15} className="mb-2 text-[#A35C69]" />
              &ldquo;{notes[noteIndex]}&rdquo;
            </blockquote>
          )}
        </div>
        <button type="button" onClick={openNote} disabled={notes.length === 0} className="button-secondary mt-4">
          <Gift aria-hidden="true" size={16} /> {notes.length === 0 ? "No notes yet" : noteIndex === null ? "Open your love note" : "Open another note"}
        </button>
      </div>
    </section>
  );
}
