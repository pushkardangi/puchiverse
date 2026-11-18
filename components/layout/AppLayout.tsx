import type { ReactNode } from "react";
import AppHeader from "@/components/layout/AppHeader";
import BottomNavigation, { type NavigationItem } from "@/components/layout/BottomNavigation";

type AppLayoutProps = {
  active: NavigationItem;
  onSelect: (item: NavigationItem) => void;
  children: ReactNode;
};

export default function AppLayout({ active, onSelect, children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#302C2C]">
      <div className="mx-auto max-w-[960px] pb-[calc(6rem+env(safe-area-inset-bottom))]">
        <AppHeader />
        <main className="px-5 sm:px-8">{children}</main>
      </div>
      <BottomNavigation active={active} onSelect={onSelect} />
    </div>
  );
}
