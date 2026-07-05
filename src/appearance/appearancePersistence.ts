import { APPEARANCE_STORAGE_KEY, DEFAULT_APPEARANCE_SETTINGS } from "./appearanceDefaults";
import type { AppearanceSettings, BackgroundTone, ContrastMode, FontThemeId, OverlayStrength } from "./appearanceTypes";

const fontThemes: FontThemeId[] = ["font-group-1", "font-group-2", "font-group-3"];
const backgroundTones: BackgroundTone[] = ["light", "dark"];
const overlayStrengths: OverlayStrength[] = ["soft", "medium", "strong"];
const contrastModes: ContrastMode[] = ["auto", "light-content", "dark-content"];

function stringValue(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function oneOf<T extends string>(value: unknown, allowed: T[], fallback: T) {
  return typeof value === "string" && allowed.includes(value as T) ? value as T : fallback;
}

function normalizeFontTheme(value: unknown): FontThemeId {
  if (value === "modern") return "font-group-1";
  if (value === "decorative") return "font-group-2";
  if (value === "cute") return "font-group-3";
  return oneOf(value, fontThemes, DEFAULT_APPEARANCE_SETTINGS.fontTheme);
}

export function normalizeAppearanceSettings(value: unknown): AppearanceSettings {
  const source = typeof value === "object" && value !== null ? value as Partial<AppearanceSettings> : {};

  return {
    desktopBackgroundKey: stringValue(source.desktopBackgroundKey, DEFAULT_APPEARANCE_SETTINGS.desktopBackgroundKey),
    chatBackgroundKey: stringValue(source.chatBackgroundKey, DEFAULT_APPEARANCE_SETTINGS.chatBackgroundKey),
    aiAvatarKey: stringValue(source.aiAvatarKey, DEFAULT_APPEARANCE_SETTINGS.aiAvatarKey),
    userAvatarKey: stringValue(source.userAvatarKey, DEFAULT_APPEARANCE_SETTINGS.userAvatarKey),
    fontTheme: normalizeFontTheme(source.fontTheme),
    desktopTone: oneOf(source.desktopTone, backgroundTones, DEFAULT_APPEARANCE_SETTINGS.desktopTone),
    chatTone: oneOf(source.chatTone, backgroundTones, DEFAULT_APPEARANCE_SETTINGS.chatTone),
    desktopOverlay: oneOf(source.desktopOverlay, overlayStrengths, DEFAULT_APPEARANCE_SETTINGS.desktopOverlay),
    chatOverlay: oneOf(source.chatOverlay, overlayStrengths, DEFAULT_APPEARANCE_SETTINGS.chatOverlay),
    desktopContrastMode: oneOf(source.desktopContrastMode, contrastModes, DEFAULT_APPEARANCE_SETTINGS.desktopContrastMode),
    chatContrastMode: oneOf(source.chatContrastMode, contrastModes, DEFAULT_APPEARANCE_SETTINGS.chatContrastMode),
  };
}

export function loadAppearanceSettings(): AppearanceSettings {
  try {
    const stored = window.localStorage.getItem(APPEARANCE_STORAGE_KEY);
    return stored ? normalizeAppearanceSettings(JSON.parse(stored)) : DEFAULT_APPEARANCE_SETTINGS;
  } catch {
    return DEFAULT_APPEARANCE_SETTINGS;
  }
}

export function saveAppearanceSettings(settings: AppearanceSettings) {
  window.localStorage.setItem(APPEARANCE_STORAGE_KEY, JSON.stringify(normalizeAppearanceSettings(settings)));
}

export function clearAppearanceSettings() {
  window.localStorage.removeItem(APPEARANCE_STORAGE_KEY);
}
