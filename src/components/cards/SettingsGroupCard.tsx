import { CaretRight } from "@phosphor-icons/react";
import type { IconType } from "../../types";

export function SettingsGroupCard({
  title,
  items,
}: {
  title: string;
  items: Array<{ icon: IconType; label: string; detail: string; onClick: () => void }>;
}) {
  return (
    <section className="settings-group">
      <h3>{title}</h3>
      <div className="settings-list glass-card" data-level="2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button className="settings-row theme-pressable" key={item.label} onClick={item.onClick}>
              <Icon size={20} />
              <span>
                <strong>{item.label}</strong>
                <small>{item.detail}</small>
              </span>
              <CaretRight size={16} />
            </button>
          );
        })}
      </div>
    </section>
  );
}
