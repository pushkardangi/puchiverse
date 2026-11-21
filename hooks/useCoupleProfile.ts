"use client";

import { useCallback, useEffect, useState } from "react";
import {
  defaultSettings,
  isAppSettings,
  US_STORAGE_KEYS,
  type AppSettings,
  type CoupleProfile,
  type SharedPreferences,
} from "@/data/relationshipData";
import { fetchCoupleProfile, saveCoupleProfile } from "@/lib/couple-profile-client";
import type { CoupleProfileData, CoupleProfileUpdate } from "@/lib/couple-profile-types";
import { usePersistentState } from "@/hooks/usePersistentState";

export function useCoupleProfile() {
  const [data, setData] = useState<CoupleProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loadAttempt, setLoadAttempt] = useState(0);
  const settingsState = usePersistentState<AppSettings>({
    key: US_STORAGE_KEYS.settings,
    fallback: defaultSettings,
    validate: isAppSettings,
  });

  useEffect(() => {
    const controller = new AbortController();
    fetchCoupleProfile(controller.signal)
      .then((result) => { setData(result); setError(""); })
      .catch((reason: unknown) => {
        if (!controller.signal.aborted)
          setError(reason instanceof Error ? reason.message : "Could not load your couple profile.");
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [loadAttempt]);

  const save = useCallback(async (update: CoupleProfileUpdate, avatars?: [string | null, string | null]) => {
    setError("");
    try {
      const result = await saveCoupleProfile(update);
      setData((current) => ({
        ...result,
        profile: {
          ...result.profile,
          partnerOne: { ...result.profile.partnerOne, avatar: avatars ? avatars[0] : current ? current.profile.partnerOne.avatar : result.profile.partnerOne.avatar },
          partnerTwo: { ...result.profile.partnerTwo, avatar: avatars ? avatars[1] : current ? current.profile.partnerTwo.avatar : result.profile.partnerTwo.avatar },
        },
      }));
      return true;
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not save your couple profile.");
      return false;
    }
  }, []);

  const updateProfile = useCallback((profile: CoupleProfile) => save({
    kind: "profile",
    nameOne: profile.partnerOne.name,
    nameTwo: profile.partnerTwo.name,
    nicknameOne: profile.partnerOne.nickname,
    nicknameTwo: profile.partnerTwo.nickname,
    relationshipStartDate: profile.relationshipStartDate,
    tagline: profile.tagline,
  }, [profile.partnerOne.avatar, profile.partnerTwo.avatar]), [save]);

  const updatePreferences = useCallback((
    changes: Pick<CoupleProfile, "tagline"> & { nicknames: [string, string] },
    preferences: SharedPreferences,
  ) => save({
    kind: "preferences",
    nicknameOne: changes.nicknames[0],
    nicknameTwo: changes.nicknames[1],
    tagline: changes.tagline,
    preferences,
  }), [save]);

  const retry = useCallback(() => {
    setError("");
    setLoading(true);
    setLoadAttempt((attempt) => attempt + 1);
  }, []);

  const { setValue: setSettings } = settingsState;
  const updateSettings = useCallback((update: (current: AppSettings) => AppSettings) => setSettings(update), [setSettings]);

  return {
    profile: data?.profile ?? null,
    preferences: data?.preferences ?? null,
    loading,
    error,
    settingsError: settingsState.error,
    retry,
    updateProfile,
    updatePreferences,
    settings: settingsState.value,
    updateSettings,
  };
}
