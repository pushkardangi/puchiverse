import { useRef, useState } from "react";
import { HeartHandshake, LoaderCircle } from "lucide-react";
import SectionHeader from "@/components/common/SectionHeader";
import HugAnimation from "@/components/home/HugAnimation";
import { fetchHugSelection, sendHug, VirtualHugRequestError } from "@/lib/virtual-hug-client";

export default function VirtualHugCard() {
  const [files, setFiles] = useState<string[]>([]);
  const [selected, setSelected] = useState(0);
  const [pending, setPending] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const busyRef = useRef(false);

  async function select() {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    setError("");
    try {
      const { data } = await fetchHugSelection();
      setPending(data.outgoingPending);
      setFiles(data.outgoingPending ? [] : data.gifFileNames);
      setSelected(0);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not load hugs. Please try again.");
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }

  async function send() {
    if (busyRef.current || !files[selected]) return;
    busyRef.current = true;
    setBusy(true);
    setError("");
    try {
      await sendHug(files[selected]);
      setPending(true);
      setFiles([]);
    } catch (reason) {
      if (reason instanceof VirtualHugRequestError && reason.code === "hug_pending") {
        setPending(true);
        setFiles([]);
      }
      setError(reason instanceof Error ? reason.message : "Could not send your hug. Please try again.");
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }

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
          {files.length > 0 && (
            <div>
              <HugAnimation key={files[selected]} gifFileName={files[selected]} />
              <p className="text-center text-xs text-[#766d69]">Preview {selected + 1} of {files.length}</p>
            </div>
          )}
          {pending && <p className="mt-4 rounded-xl bg-[#FAF5F2] p-4 text-sm leading-6 text-[#705c5d]">Your last hug is waiting for your partner. You can send another once they see it.</p>}
          {error && <p role="alert" className="mt-4 rounded-xl bg-[#FFF0EF] px-3 py-2 text-xs text-[#9A4652]">{error}</p>}
        </div>
        {files.length > 0 ? (
          <div className="mt-4 flex flex-col gap-2">
            <button type="button" disabled={busy || files.length < 2} onClick={() => setSelected((index) => (index + 1) % files.length)} className="button-secondary">
              Choose another hug
            </button>
            <button type="button" disabled={busy} onClick={send} className="button-primary disabled:opacity-60">
              {busy ? <LoaderCircle aria-hidden="true" size={16} className="animate-spin" /> : <HeartHandshake aria-hidden="true" size={16} />}
              {busy ? "Sending…" : "Send this hug"}
            </button>
          </div>
        ) : (
          <button type="button" onClick={select} disabled={busy} className="button-secondary mt-4">
            {busy ? <LoaderCircle aria-hidden="true" size={16} className="animate-spin" /> : <HeartHandshake aria-hidden="true" size={16} />}
            {busy ? "Loading…" : pending ? "Check again" : "Select a hug"}
          </button>
        )}
      </div>
    </section>
  );
}
