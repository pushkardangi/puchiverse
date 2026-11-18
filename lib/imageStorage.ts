// Single seam for image handling. Today images are only previewed locally via
// object URLs; swap these helpers for a Cloudinary upload later without
// touching the screens. Nothing here ever writes image bytes to localStorage.

export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

export function validateImageFile(file: File): string | null {
  if (!file.type.startsWith("image/")) return "Please choose an image file.";
  if (file.size > MAX_IMAGE_BYTES) return "Please choose an image smaller than 8 MB.";
  return null;
}

export function isTemporaryImage(url?: string | null): url is string {
  return !!url && url.startsWith("blob:");
}

export function createImagePreview(file: File) {
  return URL.createObjectURL(file);
}

export function releaseImagePreview(url?: string | null) {
  if (isTemporaryImage(url)) URL.revokeObjectURL(url);
}

/** Only durable (remote) image URLs may be written to localStorage. */
export function persistableImage(url?: string | null): string | null {
  return url && !isTemporaryImage(url) ? url : null;
}
