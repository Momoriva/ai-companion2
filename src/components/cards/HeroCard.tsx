import { ChatCircle } from "@phosphor-icons/react";
import { IdentityAvatar } from "../appearance/IdentityAvatar";

export function HeroCareCard({ onReply }: { onReply: () => void }) {
  return (
    <article className="hero-care-card glass-card" data-level="1">
      <IdentityAvatar identity="ai" className="hero-cloud" label="AI 关怀头像" />
      <div className="hero-care-copy">
        <p className="card-kicker">AI 关怀</p>
        <h3>慢慢来，你已经做得很好。</h3>
        <p>今天先把呼吸放稳，再开始下一件事。</p>
        <button className="primary-action theme-pressable" onClick={onReply}>
          <ChatCircle size={17} />
          回复ta
        </button>
      </div>
    </article>
  );
}
