import { EnvelopeSimple } from "@phosphor-icons/react";

export function SendLetterMotion({ active }: { active: boolean }) {
  if (!active) return null;

  return (
    <div className="send-letter" aria-hidden="true">
      <EnvelopeSimple size={20} weight="fill" />
    </div>
  );
}
