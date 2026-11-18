"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import type { NavigationItem } from "@/components/layout/BottomNavigation";
import WelcomeCard from "@/components/home/WelcomeCard";
import PuchiCounterCard from "@/components/home/PuchiCounterCard";
import CountdownCard from "@/components/home/CountdownCard";
import LoveJarCard from "@/components/home/LoveJarCard";
import VirtualHugCard from "@/components/home/VirtualHugCard";
import MemoryLaneSection from "@/components/home/MemoryLaneSection";
import { loveNotes, memories, specialDate } from "@/data/demoData";

export default function HomePage() {
  const [active, setActive] = useState<NavigationItem>("home");
  const router = useRouter();

  return (
    <AppLayout active={active} onSelect={setActive}>
      <div className="space-y-6">
        <WelcomeCard />
        <div className="grid gap-6 md:grid-cols-2">
          <PuchiCounterCard />
          <CountdownCard targetDate={specialDate} />
          <LoveJarCard notes={loveNotes} />
          <VirtualHugCard />
        </div>
        <MemoryLaneSection memories={memories} onViewAll={() => router.push("/memories")} />
        <div className="py-5 text-center">
          <Heart aria-hidden="true" size={16} className="mx-auto fill-[#C77F89] text-[#C77F89]" />
          <p className="mt-2 text-xs tracking-wide text-[#766d69]">A little world made of us.</p>
        </div>
      </div>
    </AppLayout>
  );
}
