import type { CSSProperties } from "react";

export function LikeFlowerBurst({ seed }: { seed: number }) {
  if (!seed) return null;

  return (
    <div className="flower-burst" aria-hidden="true" key={seed}>
      {Array.from({ length: 5 }).map((_, index) => (
        <span
          key={`${seed}-${index}`}
          style={
            {
              "--flower-index": index,
              "--flower-drift": index % 2 === 0 ? 1 : -1,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
