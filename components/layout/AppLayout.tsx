import type { ReactNode } from "react";
import AppHeader from "@/components/layout/AppHeader";
import BottomNavigation from "@/components/layout/BottomNavigation";

type AppLayoutProps = {
  children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#302C2C]">
      <div className="mx-auto max-w-[960px] pb-[calc(6rem+env(safe-area-inset-bottom))]">
        <AppHeader />
        <main className="px-5 sm:px-8">{children}</main>
      </div>
      <BottomNavigation />
    </div>
  );
}
