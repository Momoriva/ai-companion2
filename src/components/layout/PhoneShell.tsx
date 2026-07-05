import type { ReactNode, PointerEvent as ReactPointerEvent } from "react";

export function PhoneShell({
  children,
  onPointerDown,
  onPointerUp,
  auroraTheme,
}: {
  children: ReactNode;
  onPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerUp: (event: ReactPointerEvent<HTMLDivElement>) => void;
  auroraTheme?: "aurora-light";
}) {
  return (
    <div className="phone-shell" data-aurora-theme={auroraTheme}>
      <div className="status-bar">
        <span>9:41</span>
        <span />
        <span>86%</span>
      </div>
      <div className="desktop-viewport" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
        {children}
      </div>
    </div>
  );
}
