export type FontThemeId = "font-group-1" | "font-group-2" | "font-group-3";
export type BackgroundTone = "light" | "dark";
export type OverlayStrength = "soft" | "medium" | "strong";
export type ContrastMode = "auto" | "light-content" | "dark-content";

export type AppearanceImageRole = "desktopBackground" | "chatBackground" | "aiAvatar" | "userAvatar";

export type AppearanceImageAsset = {
  key: string;
  label: string;
  role: AppearanceImageRole;
  src: string;
};

export type AppearanceSettings = {
  desktopBackgroundKey: string;
  chatBackgroundKey: string;
  aiAvatarKey: string;
  userAvatarKey: string;
  fontTheme: FontThemeId;
  desktopTone: BackgroundTone;
  chatTone: BackgroundTone;
  desktopOverlay: OverlayStrength;
  chatOverlay: OverlayStrength;
  desktopContrastMode: ContrastMode;
  chatContrastMode: ContrastMode;
};

export type StoredAppearanceImage = {
  key: string;
  role: AppearanceImageRole;
  blob: Blob;
  mimeType: string;
  width?: number;
  height?: number;
  tone?: BackgroundTone;
  updatedAt: number;
};
