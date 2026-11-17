import Image from "next/image";
import type { Memory } from "@/data/demoData";

type MemoryCardProps = {
  memory: Memory;
};

export default function MemoryCard({ memory }: MemoryCardProps) {
  return (
    <article className="w-[210px] shrink-0 snap-start overflow-hidden rounded-[var(--radius-memory)] border border-[#EEE7E2] bg-white sm:w-[240px]">
      <Image src={memory.image} alt={memory.title} width={480} height={288} unoptimized className="h-36 w-full object-cover" />
      <div className="p-3">
        <h3 className="text-sm font-semibold">{memory.title}</h3>
        <p className="mt-1 text-xs text-[#766d69]">{memory.date}</p>
      </div>
    </article>
  );
}
