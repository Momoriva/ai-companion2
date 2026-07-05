import type { AppearanceImageAsset, AppearanceImageRole, AppearanceSettings } from "./appearanceTypes";

export const APPEARANCE_STORAGE_KEY = "vp-appearance-settings-v1";
export const APPEARANCE_DB_NAME = "virtual-phone-appearance";
export const APPEARANCE_DB_VERSION = 1;
export const APPEARANCE_IMAGE_STORE = "images";

export const DEFAULT_APPEARANCE_SETTINGS: AppearanceSettings = {
  desktopBackgroundKey: "default-blue-desktop-background",
  chatBackgroundKey: "default-blue-chat-background",
  aiAvatarKey: "default-blue-ai-avatar",
  userAvatarKey: "default-blue-user-avatar",
  fontTheme: "font-group-1",
  desktopTone: "dark",
  chatTone: "dark",
  desktopOverlay: "medium",
  chatOverlay: "medium",
  desktopContrastMode: "auto",
  chatContrastMode: "auto",
};

export const DEFAULT_APPEARANCE_ASSETS: AppearanceImageAsset[] = [
  {
    key: "default-blue-desktop-background",
    label: "蓝色组桌面背景",
    role: "desktopBackground",
    src: "/assets/appearance/blue/theme-blue-home-bg.png",
  },
  {
    key: "default-blue-chat-background",
    label: "蓝色组聊天背景",
    role: "chatBackground",
    src: "/assets/appearance/blue/theme-blue-chat-bg.png",
  },
  {
    key: "default-blue-ai-avatar",
    label: "蓝色组 AI 头像",
    role: "aiAvatar",
    src: "/assets/appearance/blue/theme-blue-ai-avatar.png",
  },
  {
    key: "default-blue-user-avatar",
    label: "蓝色组用户头像",
    role: "userAvatar",
    src: "/assets/appearance/blue/theme-blue-user-avatar.png",
  },
];

export const APPEARANCE_ASSETS_BY_KEY = DEFAULT_APPEARANCE_ASSETS.reduce<Record<string, AppearanceImageAsset>>((items, asset) => {
  items[asset.key] = asset;
  return items;
}, {});
