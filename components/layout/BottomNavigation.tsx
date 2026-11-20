"use client";

import { Camera, Heart, House, UserRound } from "lucide-react";
import Link, { useLinkStatus } from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { id: "home", label: "Home", icon: House, href: "/" },
  { id: "puchis", label: "Puchis", icon: Heart, href: "/puchis" },
  { id: "memories", label: "Memories", icon: Camera, href: "/memories" },
  { id: "profile", label: "Us", icon: UserRound, href: "/us" },
] as const;

function NavigationContent({ item, active }: { item: (typeof navItems)[number]; active: boolean }) {
  const { pending } = useLinkStatus();
  const Icon = item.icon;
  const highlighted = active || pending;

  return (
    <span className={`flex min-h-12 min-w-15 flex-col items-center justify-center gap-1 rounded-xl px-2 transition-colors hover:bg-[#F4E9E7] active:bg-[#EEDDDD] ${highlighted ? "text-[#A35C69]" : "text-[#766d69]"}`}>
      <Icon aria-hidden="true" size={21} strokeWidth={highlighted ? 2.2 : 1.8} />
      <span className="text-[11px] font-medium">{item.label}</span>
    </span>
  );
}

export default function BottomNavigation() {
  const pathname = usePathname();
  return (
    <nav aria-label="Main navigation" className="fixed inset-x-0 bottom-0 z-50 border-t border-[#EEE8E3] bg-[#FAF8F5]/95 px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl">
      <div className="mx-auto flex max-w-lg items-center justify-around">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`));
          return (
            <Link key={item.id} href={item.href} aria-current={active ? "page" : undefined} className="rounded-xl">
              <NavigationContent item={item} active={active} />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
