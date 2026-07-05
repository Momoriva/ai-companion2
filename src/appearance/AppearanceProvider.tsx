import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  APPEARANCE_ASSETS_BY_KEY,
  DEFAULT_APPEARANCE_SETTINGS,
} from "./appearanceDefaults";
import { loadAppearanceSettings, saveAppearanceSettings } from "./appearancePersistence";
import { deleteStoredAppearanceImage, getStoredAppearanceImage, saveStoredAppearanceImage } from "./imageStorage";
import type { AppearanceImageRole, AppearanceSettings, BackgroundTone } from "./appearanceTypes";

type AppearanceContextValue = {
  settings: AppearanceSettings;
  draftSettings: AppearanceSettings;
  hasUnsavedChanges: boolean;
  setDraftSettings: (settings: AppearanceSettings | ((settings: AppearanceSettings) => AppearanceSettings)) => void;
  saveDraftSettings: () => void;
  restoreDraftSettings: () => void;
  resetDraftToDefaults: () => void;
  saveCustomImage: (input: SaveCustomImageInput) => Promise<string>;
  deleteCustomImage: (key: string) => Promise<void>;
  getImageUrl: (key: string) => string | undefined;
  getImageUrlForRole: (role: AppearanceImageRole, draft?: boolean) => string | undefined;
};

const AppearanceContext = createContext<AppearanceContextValue | null>(null);

type SaveCustomImageInput = {
  role: AppearanceImageRole;
  blob: Blob;
  mimeType: string;
  width: number;
  height: number;
  tone?: BackgroundTone;
};

function areSettingsEqual(left: AppearanceSettings, right: AppearanceSettings) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function keyForRole(settings: AppearanceSettings, role: AppearanceImageRole) {
  if (role === "desktopBackground") return settings.desktopBackgroundKey;
  if (role === "chatBackground") return settings.chatBackgroundKey;
  if (role === "aiAvatar") return settings.aiAvatarKey;
  return settings.userAvatarKey;
}

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppearanceSettings>(() => loadAppearanceSettings());
  const [draftSettings, setDraftSettings] = useState<AppearanceSettings>(settings);
  const [customImageUrls, setCustomImageUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    const keys = [
      settings.desktopBackgroundKey,
      settings.chatBackgroundKey,
      settings.aiAvatarKey,
      settings.userAvatarKey,
      draftSettings.desktopBackgroundKey,
      draftSettings.chatBackgroundKey,
      draftSettings.aiAvatarKey,
      draftSettings.userAvatarKey,
    ].filter((key) => !APPEARANCE_ASSETS_BY_KEY[key]);

    let cancelled = false;
    Promise.all(Array.from(new Set(keys)).map(async (key) => {
      const image = await getStoredAppearanceImage(key);
      if (!image) return null;
      const url = URL.createObjectURL(image.blob);
      return [key, url] as const;
    })).then((entries) => {
      if (cancelled) return;
      setCustomImageUrls((current) => {
        const next = { ...current };
        entries.forEach((entry) => {
          if (entry) next[entry[0]] = entry[1];
        });
        return next;
      });
    }).catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [settings, draftSettings]);

  useEffect(() => {
    const desktopBackground = APPEARANCE_ASSETS_BY_KEY[settings.desktopBackgroundKey]?.src ?? customImageUrls[settings.desktopBackgroundKey];
    const chatBackground = APPEARANCE_ASSETS_BY_KEY[settings.chatBackgroundKey]?.src ?? customImageUrls[settings.chatBackgroundKey];
    const aiAvatar = APPEARANCE_ASSETS_BY_KEY[settings.aiAvatarKey]?.src ?? customImageUrls[settings.aiAvatarKey];
    const userAvatar = APPEARANCE_ASSETS_BY_KEY[settings.userAvatarKey]?.src ?? customImageUrls[settings.userAvatarKey];

    document.documentElement.dataset.fontTheme = settings.fontTheme;
    document.documentElement.dataset.desktopBackgroundTone = settings.desktopTone;
    document.documentElement.dataset.chatBackgroundTone = settings.chatTone;
    document.documentElement.dataset.desktopOverlay = settings.desktopOverlay;
    document.documentElement.dataset.chatOverlay = settings.chatOverlay;
    document.documentElement.dataset.desktopContrastMode = settings.desktopContrastMode;
    document.documentElement.dataset.chatContrastMode = settings.chatContrastMode;
    document.documentElement.style.setProperty("--appearance-desktop-background", desktopBackground ? `url("${desktopBackground}")` : "none");
    document.documentElement.style.setProperty("--appearance-chat-background", chatBackground ? `url("${chatBackground}")` : "none");
    document.documentElement.style.setProperty("--appearance-ai-avatar", aiAvatar ? `url("${aiAvatar}")` : "none");
    document.documentElement.style.setProperty("--appearance-user-avatar", userAvatar ? `url("${userAvatar}")` : "none");
  }, [customImageUrls, settings]);

  const value = useMemo<AppearanceContextValue>(() => ({
    settings,
    draftSettings,
    hasUnsavedChanges: !areSettingsEqual(settings, draftSettings),
    setDraftSettings,
    saveDraftSettings: () => {
      saveAppearanceSettings(draftSettings);
      setSettings(draftSettings);
    },
    restoreDraftSettings: () => setDraftSettings(settings),
    resetDraftToDefaults: () => setDraftSettings(DEFAULT_APPEARANCE_SETTINGS),
    saveCustomImage: async ({ role, blob, mimeType, width, height, tone }) => {
      const key = `custom-${role}-${Date.now()}`;
      await saveStoredAppearanceImage({
        key,
        role,
        blob,
        mimeType,
        width,
        height,
        tone,
        updatedAt: Date.now(),
      });

      const url = URL.createObjectURL(blob);
      setCustomImageUrls((current) => {
        if (current[key]) URL.revokeObjectURL(current[key]);
        return { ...current, [key]: url };
      });
      setDraftSettings((current) => {
        const next = { ...current };
        if (role === "desktopBackground") {
          next.desktopBackgroundKey = key;
          if (tone) next.desktopTone = tone;
        }
        if (role === "chatBackground") {
          next.chatBackgroundKey = key;
          if (tone) next.chatTone = tone;
        }
        if (role === "aiAvatar") next.aiAvatarKey = key;
        if (role === "userAvatar") next.userAvatarKey = key;
        return next;
      });
      return key;
    },
    deleteCustomImage: async (key: string) => {
      await deleteStoredAppearanceImage(key);
      setCustomImageUrls((current) => {
        if (current[key]) URL.revokeObjectURL(current[key]);
        const next = { ...current };
        delete next[key];
        return next;
      });
    },
    getImageUrl: (key: string) => APPEARANCE_ASSETS_BY_KEY[key]?.src ?? customImageUrls[key],
    getImageUrlForRole: (role: AppearanceImageRole, draft = false) => {
      const key = keyForRole(draft ? draftSettings : settings, role);
      return APPEARANCE_ASSETS_BY_KEY[key]?.src ?? customImageUrls[key];
    },
  }), [customImageUrls, draftSettings, settings]);

  return <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>;
}

export function useAppearance() {
  const context = useContext(AppearanceContext);
  if (!context) throw new Error("useAppearance must be used inside AppearanceProvider");
  return context;
}
