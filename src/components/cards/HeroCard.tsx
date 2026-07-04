import { ChatCircle } from "@phosphor-icons/react";

export function HeroCareCard({ onReply }: { onReply: () => void }) {
  return (
    <article className="hero-care-card glass-card" data-level="1">
      <div className="hero-cloud" aria-hidden="true" />
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
