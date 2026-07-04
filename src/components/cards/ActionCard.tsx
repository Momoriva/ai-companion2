import type { IconType } from "../../types";

export function QuickActionCard({
  icon: Icon,
  title,
  onClick,
}: {
  icon: IconType;
  title: string;
  onClick: () => void;
}) {
  return (
    <button className="quick-action-card theme-pressable" onClick={onClick}>
      <Icon size={22} />
      <span>{title}</span>
    </button>
  );
}
