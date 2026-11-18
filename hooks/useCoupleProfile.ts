"use client";

import { useCallback } from "react";
import {
  defaultPreferences,
  defaultProfile,
  defaultSettings,
  isAppSettings,
  isCoupleProfile,
  isPreferences,
  US_STORAGE_KEYS,
  type AppSettings,
  type CoupleProfile,
  type SharedPreferences,
} from "@/data/relationshipData";
import { persistableImage } from "@/lib/imageStorage";
import { usePersistentState } from "@/hooks/usePersistentState";

const profileToStorable = (profile: CoupleProfile): CoupleProfile => ({
  ...profile,
  partnerOne: { ...profile.partnerOne, avatar: persistableImage(profile.partnerOne.avatar) },
  partnerTwo: { ...profile.partnerTwo, avatar: persistableImage(profile.partnerTwo.avatar) },
});

export function useCoupleProfile() {
  const profileState = usePersistentState<CoupleProfile>({
    key: US_STORAGE_KEYS.profile,
    fallback: defaultProfile,
    validate: isCoupleProfile,
    toStorable: profileToStorable,
  });
  const preferencesState = usePersistentState<SharedPreferences>({
    key: US_STORAGE_KEYS.preferences,
    fallback: defaultPreferences,
    validate: isPreferences,
  });
  const settingsState = usePersistentState<AppSettings>({
    key: US_STORAGE_KEYS.settings,
    fallback: defaultSettings,
    validate: isAppSettings,
  });

  const { setValue: setSettings } = settingsState;
  const updateSettings = useCallback((update: (current: AppSettings) => AppSettings) => setSettings(update), [setSettings]);

  return {
    profile: profileState.value,
    updateProfile: profileState.setValue,
    preferences: preferencesState.value,
    updatePreferences: preferencesState.setValue,
    settings: settingsState.value,
    updateSettings,
    error: profileState.error || preferencesState.error || settingsState.error,
  };
}
