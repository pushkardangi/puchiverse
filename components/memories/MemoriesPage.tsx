"use client";

import { useMemo, useState } from "react";
import { AlertCircle, Heart } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import type { NavigationItem } from "@/components/layout/BottomNavigation";
import MemoryPageHeader from "@/components/memories/MemoryPageHeader";
import FeaturedMemory from "@/components/memories/FeaturedMemory";
import MemoryFilters, { type MemoryFilter } from "@/components/memories/MemoryFilters";
import MemoryTimeline from "@/components/memories/MemoryTimeline";
import EmptyMemoryState from "@/components/memories/EmptyMemoryState";
import MemoryForm from "@/components/memories/MemoryForm";
import MemoryDetail from "@/components/memories/MemoryDetail";
import { useMemories, type MemoryInput } from "@/hooks/useMemories";
import type { Memory } from "@/data/memories";

export default function MemoriesPage() {
  const { memories, storageError, addMemory, updateMemory, deleteMemory, toggleFeatured } = useMemories();
  const [active, setActive] = useState<NavigationItem>("memories");
  const [filter, setFilter] = useState<MemoryFilter>("All");
  const [detailId, setDetailId] = useState<string>();
  const [formMemory, setFormMemory] = useState<Memory | "new">();
  const filtered = useMemo(
    () => filter === "All" ? memories : memories.filter((memory) => memory.category === filter),
    [filter, memories],
  );
  const featured = memories.find((memory) => memory.isFeatured) ?? memories[0];
  const detail = detailId ? memories.find((memory) => memory.id === detailId) : undefined;

  const openEdit = (memory: Memory) => {
    setDetailId(undefined);
    setFormMemory(memory);
  };

  const confirmDelete = (memory: Memory) => {
    if (!window.confirm(`Delete "${memory.title}" from your Memory Lane? This cannot be undone.`)) return;
    if (memory.image?.startsWith("blob:")) URL.revokeObjectURL(memory.image);
    deleteMemory(memory.id);
    setDetailId(undefined);
    setFormMemory(undefined);
  };

  const saveMemory = async (input: MemoryInput) => {
    await new Promise((resolve) => window.setTimeout(resolve, 240));
    if (formMemory && formMemory !== "new") {
      updateMemory(formMemory.id, input);
    } else {
      addMemory(input);
    }
    setFormMemory(undefined);
  };

  const changeFeatured = (memory: Memory) => toggleFeatured(memory.id);

  return (
    <AppLayout active={active} onSelect={setActive}>
      <div className="pb-4 pt-1 sm:pb-8">
        <MemoryPageHeader count={memories.length} onAdd={() => setFormMemory("new")} />
        {storageError && (
          <p role="alert" className="mt-6 flex items-start gap-2 rounded-2xl border border-[#E8C9C9] bg-[#FFF4F3] px-4 py-3 text-xs leading-5 text-[#914E58]">
            <AlertCircle aria-hidden="true" size={16} className="mt-0.5 shrink-0" /> {storageError}
          </p>
        )}
        {memories.length > 0 ? (
          <>
            {featured && <FeaturedMemory memory={featured} onOpen={(memory) => setDetailId(memory.id)} />}
            <MemoryFilters selected={filter} onSelect={setFilter} />
            {filtered.length > 0 ? (
              <MemoryTimeline
                memories={filtered}
                onOpen={(memory) => setDetailId(memory.id)}
                onEdit={openEdit}
                onDelete={confirmDelete}
                onToggleFeatured={changeFeatured}
              />
            ) : (
              <EmptyMemoryState filtered onAdd={() => setFormMemory("new")} onClear={() => setFilter("All")} />
            )}
          </>
        ) : (
          <EmptyMemoryState onAdd={() => setFormMemory("new")} />
        )}
        <div className="py-5 text-center">
          <Heart aria-hidden="true" size={16} className="mx-auto fill-[#C77F89] text-[#C77F89]" />
          <p className="mt-2 font-serif text-sm italic text-[#8E7C77]">Every memory is a little piece of home.</p>
        </div>
      </div>

      {detail && (
        <MemoryDetail
          memory={detail}
          onClose={() => setDetailId(undefined)}
          onEdit={openEdit}
          onDelete={confirmDelete}
          onToggleFeatured={changeFeatured}
        />
      )}
      {formMemory && (
        <MemoryForm
          memory={formMemory === "new" ? undefined : formMemory}
          onClose={() => setFormMemory(undefined)}
          onSave={saveMemory}
        />
      )}
    </AppLayout>
  );
}
