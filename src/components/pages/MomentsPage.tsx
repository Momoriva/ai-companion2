import { FormEvent, useState } from "react";
import { BookmarkSimple, ChatCircle, Heart, ImageSquare, PaperPlaneTilt, Sparkle } from "@phosphor-icons/react";
import { LikeFlowerBurst } from "../motion/LikeFlowerBurst";
import { useToast } from "../feedback/ToastProvider";
import { IdentityAvatar } from "../appearance/IdentityAvatar";

type Post = {
  id: number;
  name: string;
  time: string;
  text: string;
  type: "text" | "image" | "share";
  images: number;
  liked: boolean;
  likes: number;
  comments: string[];
};

const initialPosts: Post[] = [
  { id: 1, name: "ta", time: "今天 08:42", text: "早上的风很轻。今天可以慢一点。", type: "text", images: 0, liked: false, likes: 8, comments: ["你：收到。"] },
  { id: 2, name: "ta", time: "昨天 21:18", text: "把这张云留给你。", type: "image", images: 1, liked: true, likes: 12, comments: ["你：像一封信。", "ta：那就先收着。"] },
  { id: 3, name: "ta", time: "周二 19:30", text: "散步计划已经准备好，路线可以临时变。", type: "share", images: 3, liked: false, likes: 6, comments: [] },
];

export function MomentsPage() {
  const { showToast } = useToast();
  const [posts, setPosts] = useState<Post[]>(() => {
    const stored = window.localStorage.getItem("vp-moment-posts");
    return stored ? JSON.parse(stored) as Post[] : initialPosts;
  });
  const [burstSeed, setBurstSeed] = useState(0);
  const [commentingId, setCommentingId] = useState<number | null>(null);
  const [draft, setDraft] = useState("");

  const persist = (next: Post[]) => {
    setPosts(next);
    window.localStorage.setItem("vp-moment-posts", JSON.stringify(next));
  };

  const like = (postId: number) => {
    const next = posts.map((post) => post.id === postId ? {
      ...post,
      liked: !post.liked,
      likes: post.liked ? post.likes - 1 : post.likes + 1,
    } : post);
    persist(next);
    setBurstSeed(Date.now());
    showToast("success", next.find((post) => post.id === postId)?.liked ? "已喜欢" : "已取消喜欢");
  };

  const comment = (event: FormEvent) => {
    event.preventDefault();
    if (!commentingId || !draft.trim()) return;
    persist(posts.map((post) => post.id === commentingId ? { ...post, comments: [...post.comments, `你：${draft.trim()}`] } : post));
    setDraft("");
    setCommentingId(null);
    showToast("success", "评论已发布");
  };

  return (
    <div className="moments-page moments-feed">
      <LikeFlowerBurst seed={burstSeed} />
      <section className="moment-cover glass-card" data-level="1">
        <div>
          <p className="card-kicker">朋友圈</p>
          <h3>今天也有一点回声</h3>
        </div>
        <div className="moment-profile">
          <IdentityAvatar identity="ai" className="tiny-avatar" />
          <span>ta</span>
        </div>
      </section>

      <div className="moment-feed-list">
        {posts.map((post) => (
          <article className="moment-post glass-card" data-level="2" key={post.id}>
            <div className="moment-author">
              <IdentityAvatar identity="ai" className="tiny-avatar" />
              <div>
                <h3>{post.name}</h3>
                <p>{post.time}</p>
              </div>
            </div>
            <p className="moment-text">{post.text}</p>
            {post.type === "image" && (
              <div className="moment-image single">
                <ImageSquare size={34} />
                <span>浅云图片</span>
              </div>
            )}
            {post.type === "share" && (
              <div className="moment-share-card">
                <Sparkle size={22} />
                <div>
                  <strong>活动分享 · 晚间散步</strong>
                  <span>19:30 · 可以临时改路线</span>
                </div>
              </div>
            )}
            {post.images > 1 && (
              <div className="moment-photo-grid">
                {Array.from({ length: post.images }).map((_, index) => <i key={index} />)}
              </div>
            )}
            <div className="moment-actions">
              <button className="theme-pressable" data-active={post.liked} onClick={() => like(post.id)}>
                <Heart size={17} weight={post.liked ? "fill" : "regular"} />
                {post.likes}
              </button>
              <button className="theme-pressable" onClick={() => setCommentingId(post.id)}>
                <ChatCircle size={17} />
                评论
              </button>
              <button className="theme-pressable" onClick={() => showToast("success", "已保存为候选回忆")}>
                <BookmarkSimple size={17} />
                保存
              </button>
            </div>
            {(post.likes > 0 || post.comments.length > 0) && (
              <div className="moment-social-box">
                <p><Heart size={14} weight="fill" /> {post.liked ? "你、" : ""}Luna、Mira 等 {post.likes} 人</p>
                {post.comments.map((item, index) => <p key={`${post.id}-${index}`}>{item}</p>)}
              </div>
            )}
          </article>
        ))}
      </div>

      {commentingId && (
        <form className="bottom-action-sheet glass-card" data-level="1" onSubmit={comment}>
          <strong>写评论</strong>
          <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="写一条评论..." />
          <div>
            <button className="secondary-action theme-pressable" type="button" onClick={() => setCommentingId(null)}>取消</button>
            <button className="primary-action theme-pressable" type="submit" disabled={!draft.trim()}>
              <PaperPlaneTilt size={17} />
              发布
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
