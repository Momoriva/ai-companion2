import type { ComponentType } from "react";

export type IconWeight = "thin" | "light" | "regular" | "bold" | "fill" | "duotone";

export type IconType = ComponentType<{
  size?: number;
  weight?: IconWeight;
  className?: string;
}>;

export type ThemeId = "monochrome-base" | "snowfield-film";
export type PageId = 0 | 1 | 2 | 3;
export type FeatureSize = "mini" | "wide" | "hero" | "round" | "list";
export type FeatureLevel = 1 | 2 | 3;
export type ChildTemplate = "waterfall" | "magazine" | "asymmetric" | "timeline" | "immersive" | "settings";

export type ChildFeature = {
  id: string;
  title: string;
  note: string;
  icon: IconType;
  template: ChildTemplate;
};

export type FeatureGroup = {
  id: string;
  page: PageId;
  title: string;
  subtitle: string;
  detail: string;
  metric: string;
  icon: IconType;
  size: FeatureSize;
  level: FeatureLevel;
  children: ChildFeature[];
  recent: string;
};

export type ToastKind = "success" | "processing" | "failure";
export type ManagePageId = "profile" | "character" | "user" | "memory" | "appearance" | "system";

export type Overlay =
  | { type: "feature"; group: FeatureGroup; child?: ChildFeature }
  | { type: "chat" }
  | { type: "calendar" }
  | { type: "mailbox" }
  | { type: "mood" }
  | { type: "quick"; page: "call" | "voice-note" | "ai-help" }
  | { type: "call" }
  | { type: "dock"; title: string; actions: string[] }
  | { type: "moments" }
  | { type: "manage"; page: ManagePageId }
  | null;
