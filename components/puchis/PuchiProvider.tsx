"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { initialPuchiCount } from "@/data/demoData";

type PuchiContextValue = {
  count: number;
  history: readonly number[];
  addPuchi: () => void;
};

const PuchiContext = createContext<PuchiContextValue | null>(null);

export function PuchiProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<number[]>([]);
  const addPuchi = useCallback(() => {
    const time = Date.now();
    setHistory((previous) => [time, ...previous]);
  }, []);

  return (
    <PuchiContext.Provider value={{ count: initialPuchiCount + history.length, history, addPuchi }}>
      {children}
    </PuchiContext.Provider>
  );
}

export function usePuchis() {
  const context = useContext(PuchiContext);
  if (!context) {
    throw new Error("usePuchis must be used within PuchiProvider");
  }
  return context;
}
