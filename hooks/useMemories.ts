"use client";

import { useEffect, useState } from "react";
import { sampleMemories, type Memory } from "@/data/memories";

const STORAGE_KEY = "puchiverse.memories.v1";

export type MemoryInput = Omit<Memory, "id" | "createdAt">;

function isStoredMemory(value: unknown): value is Memory {
  if (!value || typeof value !== "object") return false;
  const memory = value as Partial<Memory>;
  return (
    typeof memory.id === "string" &&
    typeof memory.title === "string" &&
    typeof memory.date === "string" &&
    typeof memory.category === "string" &&
    typeof memory.createdAt === "string"
  );
}

function persistable(memories: Memory[]) {
  return memories.map((memory) => ({
    ...memory,
    image: memory.image?.startsWith("blob:") ? undefined : memory.image,
  }));
}

export function useMemories() {
  const [memories, setMemories] = useState<Memory[]>(sampleMemories);
  const [storageReady, setStorageReady] = useState(false);
  const [storageError, setStorageError] = useState("");

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed: unknown = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.every(isStoredMemory)) {
            setMemories(parsed);
          }
        }
      } catch {
        setStorageError("Saved memories could not be loaded. Showing the demo collection instead.");
      } finally {
        setStorageReady(true);
      }
    }, 0);
    return () => window.clearTimeout(loadTimer);
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    let errorTimer: number | undefined;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable(memories)));
    } catch {
      errorTimer = window.setTimeout(() => {
        setStorageError("Changes are available now, but this browser could not save them for later.");
      }, 0);
    }
    return () => {
      if (errorTimer) window.clearTimeout(errorTimer);
    };
  }, [memories, storageReady]);

  const addMemory = (input: MemoryInput) => {
    const memory: Memory = {
      ...input,
      id: `memory_${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
    };
    setMemories((current) => [memory, ...current]);
    return memory;
  };

  const updateMemory = (id: string, input: MemoryInput) => {
    setMemories((current) =>
      current.map((memory) => (memory.id === id ? { ...memory, ...input } : memory)),
    );
  };

  const deleteMemory = (id: string) => {
    setMemories((current) => current.filter((memory) => memory.id !== id));
  };

  const toggleFeatured = (id: string) => {
    setMemories((current) =>
      current.map((memory) =>
        memory.id === id ? { ...memory, isFeatured: !memory.isFeatured } : memory,
      ),
    );
  };

  return {
    memories,
    storageReady,
    storageError,
    addMemory,
    updateMemory,
    deleteMemory,
    toggleFeatured,
  };
}
