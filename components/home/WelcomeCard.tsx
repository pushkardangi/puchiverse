import { Heart, Sparkles } from "lucide-react";

export default function WelcomeCard() {
  return (
    <section className="relative overflow-hidden rounded-[var(--radius-feature)] bg-gradient-to-br from-[#FFF5D6] via-[#FFE9B5] to-[#F8D8B5] p-6 sm:p-8">
      <div className="relative z-10">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#876334]">A little sunshine for you</span>
        <h1 className="mt-4 text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
          Hey, my sunflower <span className="text-[#C17A2C]">♡</span>
        </h1>
        <p className="mt-3 max-w-[280px] text-sm leading-6 text-[#725D46]">
          You make even the ordinary days feel a little brighter. I’m so lucky to have you.
        </p>
        <div className="mt-5 flex items-center gap-2 text-xs font-medium text-[#876334]">
          <Sparkles aria-hidden="true" size={14} /> Made with love, just for you
        </div>
      </div>
      <svg
        aria-hidden="true"
        viewBox="0 0 120 150"
        className="animate-sunflower-sway absolute -bottom-4 sm:bottom-0 right-0 h-36 w-28 origin-bottom opacity-90 sm:right-8 sm:h-44 sm:w-36"
      >
        <path d="M60 83 C58 108 62 126 60 150" fill="none" stroke="#68834A" strokeLinecap="round" strokeWidth="5" />
        <path d="M59 123 C43 110 35 118 39 130 C46 134 54 130 59 123Z" fill="#80975A" />
        <path d="M61 137 C77 123 86 130 81 141 C74 146 67 143 61 137Z" fill="#80975A" />
        {Array.from({ length: 12 }, (_, index) => (
          <ellipse
            key={index}
            cx="60"
            cy="31"
            rx="8"
            ry="20"
            fill={index % 2 === 0 ? "#F5B82E" : "#FFD15A"}
            transform={`rotate(${index * 30} 60 60)`}
          />
        ))}
        <circle cx="60" cy="60" r="20" fill="#74421F" />
        <circle cx="60" cy="60" r="15" fill="#8C5427" />
        <Heart x="54" y="54" width="12" height="12" fill="#FDE7A0" stroke="#FDE7A0" />
      </svg>
    </section>
  );
}
