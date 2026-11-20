import { motion, useAnimationControls, useReducedMotion } from "framer-motion";
import { Heart, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import SectionHeader from "@/components/common/SectionHeader";
import { usePuchis } from "@/components/puchis/PuchiProvider";

const floatingHearts = [
  { size: 30, color: "#c77f89", drift: 0, rise: -105, rotate: 8, delay: 0 },
  { size: 13, color: "#e4aeb5", drift: -45, rise: -80, rotate: -22, delay: 0.08 },
  { size: 15, color: "#d998a2", drift: 43, rise: -92, rotate: 22, delay: 0.14 },
  { size: 9, color: "#edbdc3", drift: 23, rise: -120, rotate: -12, delay: 0.22 },
];

function PuchiConfirmation({ reducedMotion }: { reducedMotion: boolean }) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-[60] flex justify-center px-4">
      <motion.div
        role="status"
        className="rounded-full border border-[#F0E2E0] bg-[#FFFAF8] px-[1.1rem] py-3 text-sm font-medium text-[#80595F] shadow-[0_8px_25px_rgba(78,55,51,0.12)]"
        initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
        animate={reducedMotion
          ? { opacity: 0 }
          : { opacity: [0, 1, 1, 0], y: [8, 0, 0, -4] }}
        transition={reducedMotion
          ? { delay: 2.8, duration: 0 }
          : { duration: 2.8, times: [0, 0.12, 0.82, 1], ease: "easeInOut" }}
        onAnimationComplete={() => setVisible(false)}
      >
        A little puchi sent! <span aria-hidden="true">❤️</span>
      </motion.div>
    </div>
  );
}

type PuchiCounterCardProps = {
  showViewAll?: boolean;
};

export default function PuchiCounterCard({ showViewAll = true }: PuchiCounterCardProps) {
  const {
    summary,
    loading,
    sending,
    error,
    errorCode,
    reload,
    sendPuchi,
  } = usePuchis();
  const [celebrationRevision, setCelebrationRevision] = useState(0);
  const activation = useRef(0);
  const celebrated = celebrationRevision > 0;
  const reducedMotion = useReducedMotion() === true;
  const buttonAnimation = useAnimationControls();

  useLayoutEffect(() => {
    return () => {
      activation.current += 1;
      setCelebrationRevision(0);
    };
  }, []);

  async function handleSend() {
    const currentActivation = activation.current;
    const sent = await sendPuchi();
    if (sent && currentActivation === activation.current) {
      setCelebrationRevision((revision) => revision + 1);
    }
  }

  useEffect(() => {
    if (!celebrated) return;
    if (reducedMotion) {
      buttonAnimation.set({ scale: 1 });
      return;
    }
    void buttonAnimation.start({
      scale: [1, 0.96, 1.025, 1],
      transition: { duration: 0.5, times: [0, 0.25, 0.6, 1], ease: [0.2, 0.8, 0.25, 1] },
    });
    return () => buttonAnimation.stop();
  }, [buttonAnimation, celebrated, reducedMotion, celebrationRevision]);

  return (
    <section className="flex h-full min-w-0 flex-col">
      <SectionHeader title="Our little moments" action={showViewAll ? <Link href="/puchis" className="text-action">View all</Link> : undefined} />
      <div className="card-surface flex flex-1 flex-col gap-5" aria-busy={loading || sending}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-[#766d69]">Total puchis</p>
            {loading ? (
              <div aria-label="Loading puchi total" className="mt-2 h-10 w-24 animate-pulse rounded-lg bg-[#F4E9E7]" />
            ) : (
              <p className="mt-1 text-4xl font-semibold tracking-tight" aria-live="polite">
                <motion.span
                  key={celebrationRevision}
                  className="inline-block"
                  initial={celebrated && !reducedMotion ? { opacity: 0.4, y: 8, scale: 0.95 } : false}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.45, ease: [0.2, 0.8, 0.25, 1] }}
                >
                  {summary?.totalPuchis ?? "—"}
                </motion.span>
              </p>
            )}
            <p className="mt-1 text-xs text-[#766d69]">Every single one counts.</p>
          </div>
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#F9ECEE]">
            <motion.span
              key={celebrationRevision}
              aria-hidden="true"
              initial={celebrated && !reducedMotion ? { scale: 1 } : false}
              animate={{ scale: celebrated && !reducedMotion ? [1, 1.22, 0.96, 1.08, 1] : 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="flex"
            >
              <Heart size={31} className="fill-[#C77F89] text-[#C77F89]" />
            </motion.span>
          </div>
        </div>
        {error && (
          <div role="alert" className="text-sm leading-5 text-[#8F4E5A]">
            <p>{errorCode === "not_connected" ? "Connect with your partner to send puchis." : error}</p>
            {errorCode !== "not_connected" && !summary && (
              <button type="button" onClick={() => void reload()} className="mt-1 font-medium underline">
                Try again
              </button>
            )}
          </div>
        )}
        <div className="relative mt-auto">
          {celebrated && !reducedMotion && (
            <div key={celebrationRevision} aria-hidden="true" className="pointer-events-none absolute inset-0 z-10">
              <div className="absolute bottom-[45%] left-1/2">
                {floatingHearts.map(({ size, color, drift, rise, rotate, delay }) => (
                  <motion.span
                    key={size}
                    className="absolute bottom-0"
                    style={{ color, marginLeft: -size / 2 }}
                    initial={{ opacity: 0, x: 0, y: 0, scale: 0.35, rotate: -12 }}
                    animate={{
                      opacity: [0, 1, 0],
                      x: [0, 0, drift],
                      y: [0, -10, rise],
                      scale: [0.35, 1.1, 0.8],
                      rotate: [-12, 4, rotate],
                    }}
                    transition={{ duration: 1.15, delay, times: [0, 0.18, 1], ease: [0.2, 0.7, 0.25, 1] }}
                  >
                    <Heart size={size} fill="currentColor" />
                  </motion.span>
                ))}
              </div>
            </div>
          )}
          <motion.button
            type="button"
            onClick={() => void handleSend()}
            disabled={loading || sending || !summary}
            initial={false}
            animate={buttonAnimation}
            className="button-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus aria-hidden="true" size={17} /> {sending ? "Sending…" : "Send a puchi"}
          </motion.button>
        </div>
      </div>
      {celebrated && (
        <PuchiConfirmation key={celebrationRevision} reducedMotion={reducedMotion} />
      )}
    </section>
  );
}
