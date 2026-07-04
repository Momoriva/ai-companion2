import { CalendarBlank, ChatCircle, GearSix, Heart, House } from "@phosphor-icons/react";
import type { PageId } from "../../types";

const dockItems = [
  { label: "Today", icon: CalendarBlank, page: 0 as PageId },
  { label: "Companion", icon: Heart, page: 1 as PageId },
  { label: "Chat", icon: ChatCircle, primary: true },
  { label: "Memories", icon: House, page: 2 as PageId },
  { label: "Manage", icon: GearSix, page: 3 as PageId },
];

export function Dock({
  page,
  chatActive,
  onPageChange,
  onOpenChat,
}: {
  page: PageId;
  chatActive: boolean;
  onPageChange: (page: PageId) => void;
  onOpenChat: () => void;
}) {
  return (
    <nav className="phone-dock glass-card" data-level="3" aria-label="固定 Dock">
      {dockItems.map((item) => {
        const Icon = item.icon;
        const active = item.primary ? chatActive : page === item.page && !chatActive;
        return (
          <button
            className={`dock-item theme-pressable ${item.primary ? "dock-primary" : ""}`}
            data-active={active}
            key={`${item.label}-${item.page ?? "chat"}`}
            onClick={() => (item.primary ? onOpenChat() : onPageChange(item.page as PageId))}
            aria-label={item.label}
          >
            <Icon size={item.primary ? 25 : 20} weight={item.primary ? "fill" : "regular"} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
