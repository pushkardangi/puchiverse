import { Camera, Heart, House, UserRound } from "lucide-react";
import Link from "next/link";

const navItems = [
  { id: "home", label: "Home", icon: House, href: "/" },
  { id: "puchis", label: "Puchis", icon: Heart, href: "/puchis" },
  { id: "memories", label: "Memories", icon: Camera, href: "/memories" },
  { id: "profile", label: "Us", icon: UserRound, href: "/us" },
] as const;

export type NavigationItem = (typeof navItems)[number]["id"];

type BottomNavigationProps = {
  active: NavigationItem;
  onSelect: (item: NavigationItem) => void;
};

export default function BottomNavigation({ active, onSelect }: BottomNavigationProps) {
  return (
    <nav aria-label="Main navigation" className="fixed inset-x-0 bottom-0 z-50 border-t border-[#EEE8E3] bg-[#FAF8F5]/95 px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl">
      <div className="mx-auto flex max-w-lg items-center justify-around">
        {navItems.map((item) => {
          const { id, label, icon: Icon } = item;
          const className = `flex min-h-12 min-w-15 flex-col items-center justify-center gap-1 rounded-xl px-2 transition-colors hover:bg-[#F4E9E7] active:bg-[#EEDDDD] ${active === id ? "text-[#A35C69]" : "text-[#766d69]"}`;
          const content = (
            <>
              <Icon aria-hidden="true" size={21} strokeWidth={active === id ? 2.2 : 1.8} />
              <span className="text-[11px] font-medium">{label}</span>
            </>
          );
          return "href" in item ? (
            <Link key={id} href={item.href} onClick={() => onSelect(id)} aria-current={active === id ? "page" : undefined} className={className}>
              {content}
            </Link>
          ) : (
            <button type="button" key={id} onClick={() => onSelect(id)} aria-pressed={active === id} className={className}>
              {content}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
