"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { createImagePreview, isTemporaryImage, releaseImagePreview, validateImageFile } from "@/lib/imageStorage";

/**
 * Local image selection for forms. Owns the temporary preview URLs it creates and
 * revokes them when abandoned; `commit` keeps the final one for the saved record.
 */
export function useImagePicker(initial: string | null) {
  const [image, setImage] = useState<string | null>(initial);
  const [error, setError] = useState("");
  const owned = useRef<string[]>([]);
  const latest = useRef<string | null>(initial);
  const committed = useRef(false);

  useEffect(() => {
    const urls = owned.current;
    return () => {
      for (const url of urls) {
        if (!(committed.current && url === latest.current)) releaseImagePreview(url);
      }
    };
  }, []);

  const select = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const problem = validateImageFile(file);
    if (problem) {
      setError(problem);
      return;
    }
    const url = createImagePreview(file);
    owned.current.push(url);
    latest.current = url;
    setImage(url);
    setError("");
  };

  const remove = () => {
    latest.current = null;
    setImage(null);
    setError("");
  };

  const commit = () => {
    committed.current = true;
    if (isTemporaryImage(initial) && initial !== latest.current) releaseImagePreview(initial);
  };

  return { image, error, select, remove, commit };
}
