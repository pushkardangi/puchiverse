"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  addLoveJarNote,
  fetchLoveJarNotes,
  LoveJarRequestError,
} from "@/lib/love-jar-client";
import type { LoveJarNote } from "@/lib/love-jar-types";

function messageOf(error: unknown) {
  return error instanceof LoveJarRequestError
    ? error.message
    : "Something went wrong. Please try again.";
}

export function useLoveJar() {
  const [notes, setNotes] = useState<LoveJarNote[] | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const savingRef = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    fetchLoveJarNotes(controller.signal)
      .then((response) => setNotes(response.data))
      .catch((reason: unknown) => {
        if (
          controller.signal.aborted ||
          (reason instanceof DOMException && reason.name === "AbortError")
        ) {
          return;
        }
        setError(messageOf(reason));
      });
    return () => controller.abort();
  }, [loadAttempt]);

  const addNote = useCallback(async (note: string) => {
    if (savingRef.current || !note.trim()) return false;
    savingRef.current = true;
    setSaving(true);
    setError("");
    try {
      await addLoveJarNote(note.trim());
      return true;
    } catch (reason) {
      setError(messageOf(reason));
      return false;
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }, []);

  const retry = useCallback(() => {
    setError("");
    setLoadAttempt((attempt) => attempt + 1);
  }, []);

  const clearError = useCallback(() => setError(""), []);

  return { notes, error, saving, addNote, retry, clearError };
}
