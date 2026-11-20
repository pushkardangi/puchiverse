export type BucketListInput = {
  title: string;
  description: string;
};

export type BucketListItem = BucketListInput & {
  id: string;
  isCompleted: boolean;
  completedAt: string | null;
  createdAt: string;
};

export function parseBucketListInput(value: unknown): BucketListInput | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Record<string, unknown>;
  if (
    typeof item.title !== "string" ||
    !item.title.trim() ||
    item.title.trim().length > 100 ||
    typeof item.description !== "string" ||
    item.description.length > 300
  )
    return null;
  return { title: item.title.trim(), description: item.description.trim() };
}
