import type { ReactNode } from "react";

export function GlassCard({
  children,
  className = "",
  level = 2,
}: {
  children: ReactNode;
  className?: string;
  level?: 1 | 2 | 3;
}) {
  return (
    <article className={`glass-card ${className}`} data-level={level}>
      {children}
    </article>
  );
}
