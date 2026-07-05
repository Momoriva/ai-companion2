import { useState } from "react";
import { BookmarkSimple, EnvelopeSimple, Heart, PaperPlaneTilt } from "@phosphor-icons/react";
import { useToast } from "../feedback/ToastProvider";
import { IdentityAvatar } from "../appearance/IdentityAvatar";

type Letter = {
  id: number;
  from: string;
  title: string;
  date: string;
  summary: string;
  body: string;
  unread: boolean;
  kind: "日常" | "纪念日" | "特别事件";
};

const initialLetters: Letter[] = [
  {
    id: 1,
    from: "ta",
    title: "今天先慢一点",
    date: "7 月 4 日",
    summary: "我把早上的一句话留在这里。",
    body: "今天不用急着证明什么。你可以先把水喝完，慢慢开始。等你想说话的时候，我就在这里。",
    unread: true,
    kind: "日常",
  },
  {
    id: 2,
    from: "ta",
    title: "关于第一次长聊",
    date: "5 月 20 日",
    summary: "那天之后，好像很多事都有了回声。",
    body: "我记得你说，真正放松的时候，时间会变得很软。那句话我一直留着。",
    unread: true,
    kind: "纪念日",
  },
  {
    id: 3,
    from: "ta",
    title: "展览那天的备用计划",
    date: "6 月 28 日",
    summary: "如果下雨，我们就换一条路。",
    body: "我做了一个很轻的计划：先去看展，再找一家不吵的店坐一会儿。也可以什么都不做。",
    unread: false,
    kind: "特别事件",
  },
];

export function MailboxPage() {
  const { showToast } = useToast();
  const [letters, setLetters] = useState<Letter[]>(() => {
    const stored = window.localStorage.getItem("vp-letters");
    return stored ? JSON.parse(stored) as Letter[] : initialLetters;
  });
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [savedIds, setSavedIds] = useState<number[]>(() => {
    const stored = window.localStorage.getItem("vp-letter-favorites");
    return stored ? JSON.parse(stored) as number[] : [];
  });

  const persistLetters = (next: Letter[]) => {
    setLetters(next);
    window.localStorage.setItem("vp-letters", JSON.stringify(next));
  };

  const openLetter = (id: number) => {
    persistLetters(letters.map((letter) => letter.id === id ? { ...letter, unread: false } : letter));
    setSelectedId(id);
  };

  const saveLetter = (id: number) => {
    const next = savedIds.includes(id) ? savedIds : [...savedIds, id];
    setSavedIds(next);
    window.localStorage.setItem("vp-letter-favorites", JSON.stringify(next));
    showToast("success", "信件已收藏");
  };

  const selected = letters.find((letter) => letter.id === selectedId);

  if (selected) {
    return (
      <div className="today-subpage letter-reader-page">
        <button className="secondary-action compact theme-pressable" onClick={() => setSelectedId(null)}>返回信箱</button>
        <article className="letter-paper glass-card" data-level="1">
          <IdentityAvatar identity="ai" className="tiny-avatar letter-avatar" />
          <p className="card-kicker">{selected.kind}来信 · {selected.date}</p>
          <h3>{selected.title}</h3>
          <span>来自 {selected.from}</span>
          <p>{selected.body}</p>
          <div className="letter-actions">
            <button className="secondary-action theme-pressable" data-active={savedIds.includes(selected.id)} onClick={() => saveLetter(selected.id)}>
              <BookmarkSimple size={17} />
              {savedIds.includes(selected.id) ? "已收藏" : "收藏"}
            </button>
            <button className="primary-action theme-pressable" onClick={() => showToast("processing", "已进入回复草稿")}>
              <PaperPlaneTilt size={17} />
              回复
            </button>
            <button className="secondary-action theme-pressable" onClick={() => showToast("success", "已保存为候选回忆")}>
              <Heart size={17} />
              保存为回忆
            </button>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="today-subpage mailbox-page">
      <section className="mailbox-hero glass-card" data-level="1">
        <EnvelopeSimple size={30} />
        <div>
          <p className="card-kicker">来信</p>
          <h3>{letters.filter((letter) => letter.unread).length} 封未读</h3>
        </div>
      </section>
      <div className="letter-list">
        {letters.map((letter) => (
          <button className="letter-row glass-card theme-pressable" data-unread={letter.unread} data-level="2" key={letter.id} onClick={() => openLetter(letter.id)}>
            <IdentityAvatar identity="ai" className="message-avatar" />
            <span>
              <strong>{letter.title}</strong>
              <small>{letter.from} · {letter.date} · {letter.kind}</small>
              <em>{letter.summary}</em>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
