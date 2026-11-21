import { eyebrowClass } from "@/components/us/formStyles";

export type RelationshipStat = {
  label: string;
  value: number | null;
  source: "records" | "demo" | "shared";
};

export default function RelationshipStats({ stats }: { stats: RelationshipStat[] }) {
  return (
    <section aria-labelledby="stats-title">
      <p className={eyebrowClass}>In numbers</p>
      <h2 id="stats-title" className="mt-2 font-serif text-3xl text-[#342B2C]">Our Statistics</h2>
      <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-[20px] border border-[#EEE5E0] bg-white p-4">
            <dd className="font-serif text-3xl tabular-nums text-[#3E3131]">{stat.value === null ? "–" : stat.value.toLocaleString("en-US")}</dd>
            <dt className="mt-1 text-xs text-[#766D69]">{stat.label}</dt>
            <p className={`mt-3 inline-block rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${stat.source === "demo" ? "bg-[#F3ECE8] text-[#8C7C78]" : "bg-[#F7E8E7] text-[#965461]"}`}>
              {stat.source === "demo" ? "Demo data" : stat.source === "shared" ? "Shared" : "Saved here"}
            </p>
          </div>
        ))}
      </dl>
    </section>
  );
}
