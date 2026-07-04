import { useState } from "react";
import {
  Brain,
  CalendarBlank,
  CaretRight,
  DeviceMobile,
  EnvelopeSimple,
  GearSix,
  House,
  IdentificationCard,
  Images,
  Microphone,
  PaintBrush,
  Phone,
  Smiley,
  Sparkle,
  SlidersHorizontal,
  User,
} from "@phosphor-icons/react";
import type { FeatureGroup, IconType, ManagePageId, PageId } from "../../types";
import { HeroCareCard } from "../cards/HeroCard";
import { FeatureCard } from "../cards/FeatureCard";
import { MusicVinylCard } from "../cards/MusicVinylCard";

type LayoutProps = {
  features: FeatureGroup[];
  todayTheme?: "aurora-dark" | "aurora-light";
  onOpen: (group: FeatureGroup) => void;
  onOpenChat: () => void;
  onOpenMoments: () => void;
  onOpenCalendar: () => void;
  onOpenMailbox: () => void;
  onOpenMood: () => void;
  onOpenQuick: (page: "call" | "voice-note" | "ai-help") => void;
  onOpenManage: (page: ManagePageId) => void;
};

export function DesktopPage({
  pageId,
  title,
  description,
  active,
  children,
}: {
  pageId: PageId;
  title: string;
  description: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="desktop-page" data-page={pageId} data-active={active}>
      <div className="page-heading">
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        {pageId === 3 ? <GearSix size={22} aria-hidden="true" /> : <DeviceMobile size={22} aria-hidden="true" />}
      </div>
      {children}
    </section>
  );
}

export function TodayLayout({
  onOpenChat,
  onOpenMoments,
  onOpenCalendar,
  onOpenMailbox,
  onOpenMood,
  onOpenQuick,
  todayTheme = "aurora-dark",
}: LayoutProps) {
  return (
    <div className="layout-today today-real-app today-page airy-layout" data-theme={todayTheme}>
      <HeroCareCard onReply={onOpenChat} />

      <div className="today-middle">
        <article className="connection-ring glass-card" data-level="1">
          <div className="ring-visual" aria-hidden="true">
            <span>82%</span>
          </div>
          <small>连接状态</small>
          <strong>很亲近</strong>
        </article>
        <button className="recent-chat-card recent-chat-button glass-card theme-pressable" data-level="2" onClick={onOpenChat}>
          <p className="card-kicker">最近聊天</p>
          <strong>你</strong>
          <span>刚好需要这句话，谢谢你。</span>
          <strong>ta</strong>
          <span>我会把今天的语气放轻一点。</span>
        </button>
      </div>

      <section className="today-core-links">
        <button className="today-link-card calendar-link glass-card theme-pressable" data-level="2" onClick={onOpenCalendar}>
          <CalendarBlank size={22} />
          <span>
            <strong>日历</strong>
            <small>今晚 21:40 复盘提醒</small>
          </span>
          <em>2 件</em>
        </button>
        <button className="today-link-card mailbox-link glass-card theme-pressable" data-level="3" onClick={onOpenMailbox}>
          <EnvelopeSimple size={22} />
          <span>
            <strong>信箱</strong>
            <small>3 封来信</small>
          </span>
        </button>
        <button className="today-link-card mood-link glass-card theme-pressable" data-level="3" onClick={onOpenMood}>
          <Smiley size={22} />
          <span>
            <strong>情绪</strong>
            <small>今日还没记录</small>
          </span>
        </button>
        <button className="today-link-card moments-link glass-card theme-pressable" data-level="2" onClick={onOpenMoments}>
          <Images size={22} />
          <span>
            <strong>动态</strong>
            <small>新的朋友圈更新</small>
          </span>
        </button>
      </section>

      <section className="quick-section">
        <p className="section-label">Quick Actions</p>
        <div className="today-quick-row">
          <button className="quick-action-card theme-pressable" onClick={() => onOpenQuick("call")}>
            <Phone size={22} />
            <span>通话</span>
          </button>
          <button className="quick-action-card theme-pressable" onClick={() => onOpenQuick("voice-note")}>
            <Microphone size={22} />
            <span>语音便签</span>
          </button>
          <button className="quick-action-pill theme-pressable" onClick={() => onOpenQuick("ai-help")}>
            <Sparkle size={20} />
            <span>AI 帮助</span>
          </button>
        </div>
      </section>
    </div>
  );
}

export function CompanionLayout({ features, onOpen, onOpenMoments, todayTheme = "aurora-dark" }: LayoutProps) {
  const musicFeature = features.find((feature) => feature.id === "listen-music");
  const lifeFeature = features.find((feature) => feature.id === "life");
  const funFeature = features.find((feature) => feature.id === "fun");
  const growthFeature = features.find((feature) => feature.id === "growth");
  const cameraFeature = features.find((feature) => feature.id === "camera");

  return (
    <div className="layout-companion companion-page airy-layout" data-theme={todayTheme}>
      <MusicVinylCard onListen={() => musicFeature && onOpen(musicFeature)} />
      <div className="companion-asymmetric">
        {lifeFeature && <FeatureCard feature={lifeFeature} onOpen={onOpen} onOpenMoments={onOpenMoments} />}
        {funFeature && <FeatureCard feature={funFeature} onOpen={onOpen} onOpenMoments={onOpenMoments} />}
        {growthFeature && <FeatureCard feature={growthFeature} onOpen={onOpen} onOpenMoments={onOpenMoments} />}
        {cameraFeature && <FeatureCard feature={cameraFeature} onOpen={onOpen} onOpenMoments={onOpenMoments} />}
      </div>
      <button className="save-rhythm-button secondary-action theme-pressable" onClick={() => musicFeature && onOpen(musicFeature)}>
        保存这一刻
      </button>
    </div>
  );
}

export function MemoryLayout({ features, onOpen, todayTheme = "aurora-dark" }: LayoutProps) {
  const [writing, setWriting] = useState(false);
  const [saved, setSaved] = useState(window.localStorage.getItem("vp-letter-saved") === "true");

  const saveLetter = () => {
    setSaved(true);
    window.localStorage.setItem("vp-letter-saved", "true");
  };

  if (writing) {
    return (
      <div className="layout-memory memory-page airy-layout" data-theme={todayTheme}>
        <article className="letter-draft-page glass-card" data-level="1">
          <button className="secondary-action theme-pressable" onClick={() => setWriting(false)}>返回回忆</button>
          <p className="card-kicker">写一封信</p>
          <h3>把这一刻写下来</h3>
          <label>
            <span>信件草稿</span>
            <textarea placeholder="写一段只保存在原型里的信..." />
          </label>
          <button className="primary-action theme-pressable" onClick={saveLetter}>{saved ? "已保存" : "保存"}</button>
        </article>
      </div>
    );
  }

  return (
    <div className="layout-memory memory-page airy-layout" data-theme={todayTheme}>
      <article className="memory-editorial-card glass-card" data-level="1">
        <div className="memory-editorial-copy">
          <p className="card-kicker">5 月 20 日</p>
          <h3>时间会经过，但感受会留下。</h3>
          <button className="primary-action theme-pressable" onClick={() => setWriting(true)}>写一封信</button>
        </div>
        <div className="letter-visual" aria-hidden="true" />
      </article>
      <section className="memory-timeline-section glass-card" data-level="2">
        <div className="section-title-row">
          <strong>时间线</strong>
          <button className="secondary-action compact theme-pressable" onClick={() => features[0] && onOpen(features[0])}>查看全部</button>
        </div>
        <div className="memory-timeline-list">
          {[
            ["5 月 20", "湖边散步的开始"],
            ["5 月 18", "深夜的一次聊天"],
            ["5 月 13", "很小但很开心的一天"],
          ].map(([date, title], index) => (
            <button className="memory-timeline-row theme-pressable" key={title} onClick={() => features[0] && onOpen(features[0])}>
              <span className="timeline-dot" />
              <time>{date}</time>
              <p>{title}</p>
              <i data-size={index === 0 ? "large" : "small"} />
            </button>
          ))}
        </div>
      </section>
      <section className="memory-filmstrip">
        <div className="section-title-row">
          <strong>珍藏</strong>
          <span>23 条</span>
        </div>
        <div className="filmstrip-scroll">
          {features.map((feature, index) => (
            <button className="filmstrip-item theme-pressable" data-featured={index === 0} key={feature.id} onClick={() => onOpen(feature)}>
              <feature.icon size={20} />
              <span>{feature.title}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

const manageEntries: Array<{ id: ManagePageId; title: string; subtitle: string; icon: IconType }> = [
  { id: "character", title: "角色管理", subtitle: "档案、世界书、语言风格", icon: IdentificationCard },
  { id: "user", title: "用户管理", subtitle: "资料、偏好、作息", icon: User },
  { id: "memory", title: "记忆管理", subtitle: "待确认、私密、导出", icon: Brain },
  { id: "appearance", title: "外观", subtitle: "背景、字体、小组件", icon: PaintBrush },
  { id: "system", title: "系统设置", subtitle: "账户、同步、权限", icon: SlidersHorizontal },
];

export function ManageLayout({ onOpenManage, todayTheme = "aurora-dark" }: LayoutProps) {
  return (
    <div className="layout-manage manage-page airy-layout" data-theme={todayTheme}>
      <button className="profile-card profile-card-button glass-card theme-pressable" data-level="1" onClick={() => onOpenManage("profile")}>
        <div className="profile-orb" aria-hidden="true" />
        <div>
          <strong>个人档案</strong>
          <span>头像、昵称、常用称呼</span>
        </div>
        <span className="profile-edit">编辑</span>
        <CaretRight size={16} />
      </button>
      <ManageSection title="Profile">
        <ManageEntry icon={IdentificationCard} title="个人档案" subtitle="资料、生日、时区" onClick={() => onOpenManage("profile")} />
      </ManageSection>
      <ManageSection title="Identity & Memory">
        {manageEntries.slice(0, 3).map((entry) => (
          <ManageEntry key={entry.id} icon={entry.icon} title={entry.title} subtitle={entry.subtitle} onClick={() => onOpenManage(entry.id)} />
        ))}
      </ManageSection>
      <ManageSection title="Appearance & System">
        {manageEntries.slice(3).map((entry) => (
          <ManageEntry key={entry.id} icon={entry.icon} title={entry.title} subtitle={entry.subtitle} onClick={() => onOpenManage(entry.id)} />
        ))}
      </ManageSection>
    </div>
  );
}

function ManageSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="manage-section">
      <h3>{title}</h3>
      <div className="manage-section-list glass-card" data-level="2">{children}</div>
    </section>
  );
}

function ManageEntry({
  icon: Icon,
  title,
  subtitle,
  onClick,
}: {
  icon: IconType;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button className="manage-entry-row theme-pressable" onClick={onClick}>
      <Icon size={20} />
      <span>
        <strong>{title}</strong>
        <small>{subtitle}</small>
      </span>
      <CaretRight size={16} />
    </button>
  );
}
