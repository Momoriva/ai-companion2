import { CaretRight } from "@phosphor-icons/react";
import type { FeatureGroup } from "../../types";

export function FeatureCard({
  feature,
  onOpen,
  onOpenMoments,
}: {
  feature: FeatureGroup;
  onOpen: (feature: FeatureGroup) => void;
  onOpenMoments: () => void;
}) {
  const Icon = feature.icon;
  const isSmall = feature.size === "mini" || feature.size === "round";
  const isMoment = feature.id === "moments";

  return (
    <button
      className={`feature-card theme-pressable size-${feature.size}`}
      data-level={feature.level}
      onClick={() => (isMoment ? onOpenMoments() : onOpen(feature))}
    >
      <span className="icon-plate">
        <Icon size={feature.size === "round" ? 27 : 22} />
      </span>
      <span className="feature-copy">
        <strong>{feature.title}</strong>
        {!isSmall && <small>{feature.subtitle}</small>}
      </span>
      {!isSmall && <em>{feature.detail}</em>}
      {!isSmall && <CaretRight className="feature-arrow" size={16} />}
    </button>
  );
}
