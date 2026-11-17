import { Heart, Sparkles } from "lucide-react";

export default function WelcomeCard() {
  return (
    <section className="relative overflow-hidden rounded-[var(--radius-feature)] bg-[#EEDDDD] p-6 sm:p-8">
      <div className="relative z-10">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#80595f]">A little reminder</span>
        <h1 className="mt-4 text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
          Hey, Beautiful <span className="text-[#A35C69]">♡</span>
        </h1>
        <p className="mt-3 max-w-[280px] text-sm leading-6 text-[#705c5d]">
          Somewhere between all the chaos, you became my favourite part.
        </p>
        <div className="mt-5 flex items-center gap-2 text-xs font-medium text-[#80595f]">
          <Sparkles aria-hidden="true" size={14} /> Made with love, just for you
        </div>
      </div>
      <Heart aria-hidden="true" size={85} className="absolute bottom-5 right-5 rotate-12 fill-white/30 text-white/50" />
    </section>
  );
}
