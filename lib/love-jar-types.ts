export type LoveJarNote = {
  id: string;
  note: string;
  createdAt: string;
};

export const LOVE_JAR_NOTE_MAX_LENGTH = 240;

export function parseLoveJarNote(value: unknown): string | null {
  if (!value || typeof value !== "object") return null;
  const note = (value as Record<string, unknown>).note;
  if (typeof note !== "string") return null;
  const trimmed = note.trim();
  return trimmed.length > 0 && trimmed.length <= LOVE_JAR_NOTE_MAX_LENGTH
    ? trimmed
    : null;
}
