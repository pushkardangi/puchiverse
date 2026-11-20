"use client";

import { useRef, useState, type FormEvent } from "react";
import { Gift, LoaderCircle, Plus, Sparkles } from "lucide-react";
import SectionHeader from "@/components/common/SectionHeader";
import ModalShell from "@/components/memories/ModalShell";
import { useLoveJar } from "@/hooks/useLoveJar";
import { LOVE_JAR_NOTE_MAX_LENGTH } from "@/lib/love-jar-types";

export default function LoveJarCard() {
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [sent, setSent] = useState(false);
  const [addingNote, setAddingNote] = useState(false);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const { notes, error, saving, addNote: saveNote, retry, clearError } = useLoveJar();
  const selectedNote = notes?.find((note) => note.id === selectedNoteId);

  function closeForm() {
    setAddingNote(false);
    setDraft("");
    clearError();
    addButtonRef.current?.focus();
  }

  function openNote() {
    if (!notes?.length) return;
    const choices = notes.filter((note) => note.id !== selectedNoteId);
    const next = choices[Math.floor(Math.random() * choices.length)] ?? notes[0];
    setSelectedNoteId(next.id);
  }

  async function addNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(false);
    if (await saveNote(draft)) {
      closeForm();
      setSent(true);
    }
  }

  return (
    <section className="flex h-full min-w-0 flex-col">
      <SectionHeader
        title="Love Jar"
        action={
          <span className="text-xs text-[#766d69]">
            {notes
              ? `${notes.length} ${notes.length === 1 ? "note" : "notes"} for you`
              : "Our little keepsakes"}
          </span>
        }
      />
      <div className="card-surface flex flex-1 flex-col">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#F9ECEE]">
            <Gift aria-hidden="true" size={27} strokeWidth={1.8} className="text-[#A35C69]" />
          </div>
          <div>
            <h3 className="font-semibold">Little notes, lots of love</h3>
            <p className="mt-1 text-xs leading-5 text-[#766d69]">
              Leave a note for your person, or open one they wrote for you.
            </p>
          </div>
          <button
            type="button"
            ref={addButtonRef}
            aria-label="Add a love note"
            onClick={() => {
              setSent(false);
              setAddingNote(true);
            }}
            disabled={!notes}
            className="icon-button ml-auto disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus aria-hidden="true" size={20} />
          </button>
        </div>
        <div aria-live="polite" className="flex-1">
          {selectedNote && (
            <blockquote className="mt-4 rounded-xl bg-[#FAF5F2] p-4 text-sm leading-6 text-[#705c5d]">
              <Sparkles aria-hidden="true" size={15} className="mb-2 text-[#A35C69]" />
              &ldquo;{selectedNote.note}&rdquo;
            </blockquote>
          )}
          {notes?.length === 0 && (
            <p className="mt-4 rounded-xl bg-[#FAF5F2] p-4 text-sm leading-6 text-[#766d69]">
              No notes from your person yet. Leave one for them with the plus button.
            </p>
          )}
        </div>
        <button type="button" onClick={openNote} disabled={!notes?.length} className="button-secondary mt-4">
          {!notes && !error ? (
            <LoaderCircle aria-hidden="true" size={16} className="animate-spin" />
          ) : (
            <Gift aria-hidden="true" size={16} />
          )}
          {!notes
            ? error ? "Jar unavailable" : "Loading your jar…"
            : notes.length === 0
              ? "No notes for you yet"
              : selectedNote
                ? "Open another note"
                : "Open a love note"}
        </button>
        {sent && <p role="status" className="mt-3 text-xs text-[#766d69]">Your note is in your partner&apos;s jar.</p>}
        {error && !addingNote && (
          <p role="alert" className="mt-3 rounded-xl bg-[#FFF0EF] px-3 py-2 text-xs text-[#9A4652]">
            {error}
            {notes === null && (
              <button
                type="button"
                onClick={retry}
                className="ml-2 underline"
              >
                Try again
              </button>
            )}
          </p>
        )}
      </div>
      {addingNote && (
        <ModalShell titleId="love-jar-form-title" onClose={saving ? () => undefined : closeForm} className="sm:max-w-lg">
          <form onSubmit={addNote} className="p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:p-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A35C69]">A little love, just for them</p>
            <h2 id="love-jar-form-title" className="mt-2 pr-12 font-serif text-3xl text-[#3E3131]">Write a love note</h2>
            <p className="mt-2 text-sm leading-6 text-[#7B6F6B]">Only your partner can open this note in their jar.</p>
            <label htmlFor="love-jar-note" className="mt-7 block text-xs font-medium text-[#665753]">Your note</label>
            <textarea
              id="love-jar-note"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              maxLength={LOVE_JAR_NOTE_MAX_LENGTH}
              rows={4}
              placeholder="One thing I love about you is…"
              disabled={saving}
              className="mt-2 w-full resize-none rounded-2xl border border-[#E5DAD5] bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-[#B66D79] focus:ring-2 focus:ring-[#EAD1D4] disabled:opacity-60"
            />
            <p className="mt-1 text-right text-[11px] text-[#998A84]">{draft.length}/{LOVE_JAR_NOTE_MAX_LENGTH}</p>
            {error && <p role="alert" className="mt-4 rounded-xl bg-[#FFF0EF] px-4 py-3 text-xs text-[#9A4652]">{error}</p>}
            <div className="mt-7 flex gap-3">
              <button type="button" onClick={closeForm} disabled={saving} className="button-secondary">Cancel</button>
              <button type="submit" disabled={!draft.trim() || saving} className="button-primary disabled:cursor-not-allowed disabled:opacity-60">
                {saving && <LoaderCircle aria-hidden="true" size={16} className="animate-spin" />}
                {saving ? "Adding…" : "Add to jar"}
              </button>
            </div>
          </form>
        </ModalShell>
      )}
    </section>
  );
}
