export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 64;

const USERNAME_PATTERN = /^[a-z0-9_.-]+$/;

// Lowercases, trims and strips one leading "@". Returns null when the result is not a valid username.
export function normalizeUsername(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const value = input.trim().replace(/^@/, "").toLowerCase();
  if (value.length < USERNAME_MIN_LENGTH || value.length > USERNAME_MAX_LENGTH) return null;
  return USERNAME_PATTERN.test(value) ? value : null;
}

export const USERNAME_HELP =
  `Usernames are ${USERNAME_MIN_LENGTH}-${USERNAME_MAX_LENGTH} characters: letters, numbers, dots, dashes or underscores.`;
