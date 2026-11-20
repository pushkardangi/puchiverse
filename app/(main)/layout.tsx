import type { ReactNode } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { PuchiProvider } from "@/components/puchis/PuchiProvider";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <PuchiProvider>
      <AppLayout>{children}</AppLayout>
    </PuchiProvider>
  );
}
