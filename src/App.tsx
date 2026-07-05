import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { CaretLeft, Checks, ClockCounterClockwise, Phone, Plus, Star, X } from "@phosphor-icons/react";
import { featureGroups, pages } from "./data/features";
import type { ChildFeature, FeatureGroup, ManagePageId, Overlay, PageId, ThemeId } from "./types";
import { ToastProvider, useToast } from "./components/feedback/ToastProvider";
import { CalendarPage } from "./components/pages/CalendarPage";
import { ChatPage } from "./components/pages/ChatPage";
import { MailboxPage } from "./components/pages/MailboxPage";
import { ManageSubPage } from "./components/pages/ManagePages";
import { MomentsPage } from "./components/pages/MomentsPage";
import { MoodPage } from "./components/pages/MoodPage";
import { QuickActionPage } from "./components/pages/QuickActionPages";
import { Dock } from "./components/layout/Dock";
import { PhoneShell } from "./components/layout/PhoneShell";
import { AppearanceProvider } from "./appearance";
import {
  CompanionLayout,
  DesktopPage,
  ManageLayout,
  MemoryLayout,
  TodayLayout,
} from "./components/layout/PageLayouts";

type PreviewMode = "full" | "phone";
type TodayTheme = "aurora-light";
const AURORA_THEME: TodayTheme = "aurora-light";

function App() {
  return (
    <ToastProvider>
      <AppearanceProvider>
        <VirtualPhoneApp />
      </AppearanceProvider>
    </ToastProvider>
  );
}

function VirtualPhoneApp() {
  const { showToast } = useToast();
  const [page, setPage] = useState<PageId>(0);
  const [theme, setTheme] = useState<ThemeId>("monochrome-base");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("full");
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [dragStart, setDragStart] = useState<number | null>(null);
  const scrollPositions = useRef<Record<string, number>>({});

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const rememberScroll = () => {
    const activePage = document.querySelector<HTMLElement>('.desktop-page[data-active="true"]');
    if (activePage) scrollPositions.current[`desktop-${page}`] = activePage.scrollTop;
  };

  const restoreScroll = (targetPage = page) => {
    window.requestAnimationFrame(() => {
      const activePage = document.querySelector<HTMLElement>(`.desktop-page[data-page="${targetPage}"]`);
      if (activePage) activePage.scrollTop = scrollPositions.current[`desktop-${targetPage}`] ?? 0;
    });
  };

  const closeOverlay = () => {
    setOverlay(null);
    restoreScroll();
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (overlay) {
        if (event.key === "Escape") closeOverlay();
        return;
      }
      if (event.key === "ArrowRight") switchPage(Math.min(3, page + 1) as PageId);
      if (event.key === "ArrowLeft") switchPage(Math.max(0, page - 1) as PageId);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [overlay, page]);

  const currentFeatures = useMemo(() => featureGroups.filter((feature) => feature.page === page), [page]);

  const switchPage = (nextPage: PageId) => {
    rememberScroll();
    setOverlay(null);
    setPage(nextPage);
    restoreScroll(nextPage);
  };

  const openOverlay = (nextOverlay: NonNullable<Overlay>) => {
    rememberScroll();
    setOverlay(nextOverlay);
  };

  const openFeature = (group: FeatureGroup) => {
    openOverlay({ type: "feature", group });
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (overlay) return;
    setDragStart(event.clientX);
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (overlay || dragStart === null) return;
    const delta = event.clientX - dragStart;
    if (Math.abs(delta) > 48) {
      if (delta < 0) switchPage(Math.min(3, page + 1) as PageId);
      if (delta > 0) switchPage(Math.max(0, page - 1) as PageId);
    }
    setDragStart(null);
  };

  const layoutProps = {
    onOpen: openFeature,
    onOpenChat: () => openOverlay({ type: "chat" }),
    onOpenMoments: () => openOverlay({ type: "moments" }),
    onOpenCalendar: () => openOverlay({ type: "calendar" }),
    onOpenMailbox: () => openOverlay({ type: "mailbox" }),
    onOpenMood: () => openOverlay({ type: "mood" }),
    onOpenQuick: (quickPage: "call" | "voice-note" | "ai-help") => openOverlay({ type: "quick", page: quickPage }),
    onOpenManage: (managePage: ManagePageId) => openOverlay({ type: "manage", page: managePage }),
  };

  return (
    <main className="app-shell theme-page" data-preview-mode={previewMode} data-aurora-theme={AURORA_THEME}>
      <section className="preview-stage" aria-label="Virtual Phone Light Base Preview">
        <aside className="preview-intro">
          <p>Virtual Phone · Light Base Preview</p>
          <h1>A calmer, lighter, more human way to stay connected.</h1>
          <div className="theme-pill-row" aria-label="主题切换">
            <button className="theme-pill theme-pressable" data-active={theme === "monochrome-base"} onClick={() => setTheme("monochrome-base")}>
              Light base
            </button>
            <button className="theme-pill theme-pressable" data-active={theme === "snowfield-film"} onClick={() => setTheme("snowfield-film")}>
              Snowfield
            </button>
          </div>
          <div className="preview-mode-switch" aria-label="预览模式">
            <button className="theme-pill theme-pressable" data-active={previewMode === "full"} onClick={() => setPreviewMode("full")}>
              完整展示
            </button>
            <button className="theme-pill theme-pressable" data-active={previewMode === "phone"} onClick={() => setPreviewMode("phone")}>
              仅手机
            </button>
          </div>
        </aside>

        <PhoneShell auroraTheme={AURORA_THEME} onPointerDown={handlePointerDown} onPointerUp={handlePointerUp}>
          <div className="desktop-track" style={{ transform: `translateX(-${page * 100}%)` }}>
            {pages.map((desktop) => {
              const features = featureGroups.filter((feature) => feature.page === desktop.id);
              return (
                <DesktopPage key={desktop.id} pageId={desktop.id} active={page === desktop.id} title={desktop.title} description={desktop.description}>
                  {desktop.id === 0 && <TodayLayout features={features} todayTheme={AURORA_THEME} {...layoutProps} />}
                  {desktop.id === 1 && <CompanionLayout features={features} todayTheme={AURORA_THEME} {...layoutProps} />}
                  {desktop.id === 2 && <MemoryLayout features={features} todayTheme={AURORA_THEME} {...layoutProps} />}
                  {desktop.id === 3 && <ManageLayout features={features} todayTheme={AURORA_THEME} {...layoutProps} />}
                </DesktopPage>
              );
            })}
          </div>
          <PageIndicator current={page} onChange={switchPage} />
          <Dock page={page} chatActive={overlay?.type === "chat"} onPageChange={switchPage} onOpenChat={() => openOverlay({ type: "chat" })} />
          {overlay && <PhoneOverlay overlay={overlay} auroraTheme={AURORA_THEME} onClose={closeOverlay} setPage={switchPage} />}
        </PhoneShell>

        <aside className="preview-notes">
          <p>Four core pages of the virtual phone experience.</p>
          <div>
            {currentFeatures.slice(0, 3).map((feature) => (
              <button className="recent-row theme-pressable" key={feature.id} onClick={() => openFeature(feature)}>
                <feature.icon size={18} />
                <span>{feature.recent}</span>
              </button>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}

function PageIndicator({ current, onChange }: { current: PageId; onChange: (page: PageId) => void }) {
  return (
    <div className="page-indicator" aria-label="桌面页码">
      {pages.map((item) => (
        <button
          key={item.id}
          aria-label={`切换到${item.title}`}
          className="theme-pressable"
          data-active={current === item.id}
          onClick={() => onChange(item.id)}
        />
      ))}
    </div>
  );
}

function overlayTitle(overlay: NonNullable<Overlay>) {
  if (overlay.type === "chat") return "聊天";
  if (overlay.type === "moments") return "动态";
  if (overlay.type === "calendar") return "日历";
  if (overlay.type === "mailbox") return "信箱";
  if (overlay.type === "mood") return "情绪";
  if (overlay.type === "quick") {
    return { call: "通话", "voice-note": "语音便签", "ai-help": "AI 帮助" }[overlay.page];
  }
  if (overlay.type === "manage") {
    return {
      profile: "个人档案",
      character: "角色管理",
      user: "用户管理",
      memory: "记忆管理",
      appearance: "外观",
      system: "系统设置",
    }[overlay.page];
  }
  if (overlay.type === "feature") return overlay.group.title;
  if (overlay.type === "call") return "通话";
  return overlay.title;
}

function PhoneOverlay({
  overlay,
  auroraTheme,
  onClose,
  setPage,
}: {
  overlay: NonNullable<Overlay>;
  auroraTheme: TodayTheme;
  onClose: () => void;
  setPage: (page: PageId) => void;
}) {
  const auroraScope = isAuroraOverlay(overlay);

  return (
    <section className="phone-page-overlay" data-theme={auroraTheme} data-aurora-scope={auroraScope} aria-label="手机内功能页">
      <header className="phone-page-header">
        <button className="secondary-action compact theme-pressable" onClick={onClose}>
          <CaretLeft size={16} />
          返回
        </button>
        <strong>{overlayTitle(overlay)}</strong>
        <button className="close-button theme-pressable" onClick={onClose} aria-label="关闭">
          <X size={16} />
        </button>
      </header>
      {overlay.type === "feature" && <FeatureSheet overlay={overlay} onClose={onClose} setPage={setPage} />}
      {overlay.type === "chat" && <ChatPage />}
      {overlay.type === "moments" && <MomentsPage />}
      {overlay.type === "calendar" && <CalendarPage />}
      {overlay.type === "mailbox" && <MailboxPage />}
      {overlay.type === "mood" && <MoodPage />}
      {overlay.type === "quick" && <QuickActionPage page={overlay.page} />}
      {overlay.type === "manage" && <ManageSubPage page={overlay.page} />}
      {overlay.type === "call" && <CallSheet />}
      {overlay.type === "dock" && <DockSheet title={overlay.title} actions={overlay.actions} />}
    </section>
  );
}

function isAuroraOverlay(overlay: NonNullable<Overlay>) {
  if (overlay.type === "feature") return true;
  return true;
}

function FeatureSheet({
  overlay,
  onClose,
  setPage,
}: {
  overlay: Extract<NonNullable<Overlay>, { type: "feature" }>;
  onClose: () => void;
  setPage: (page: PageId) => void;
}) {
  const { showToast } = useToast();
  const [selected, setSelected] = useState<ChildFeature | null>(overlay.child ?? null);
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    showToast("success", "已保存为模拟状态");
  };

  if (selected) {
    const Icon = selected.icon;
    return (
      <div className="sheet-content child-detail" data-template={selected.template}>
        <button className="back-link theme-pressable" onClick={() => setSelected(null)}>
          <CaretLeft size={16} />
          返回{overlay.group.title}
        </button>
        <div className="sheet-title-row">
          <Icon size={30} />
          <div>
            <p>{overlay.group.title}</p>
            <h3>{selected.title}</h3>
          </div>
        </div>
        <p className="sheet-copy">{selected.note}</p>
        <PrototypeTemplate template={selected.template} />
        <div className="sheet-actions">
          {overlay.group.page === 2 && (
            <button
              className="secondary-action theme-pressable"
              onClick={() => {
                setPage(3);
                onClose();
              }}
            >
              去管理
            </button>
          )}
          <button className="primary-action theme-pressable" data-active={saved} onClick={save}>
            <Checks size={17} />
            {saved ? "已保存" : "保存"}
          </button>
        </div>
      </div>
    );
  }

  const Icon = overlay.group.icon;
  return (
    <div className="sheet-content">
      <div className="sheet-title-row">
        <Icon size={30} />
        <div>
          <p>{overlay.group.subtitle}</p>
          <h3>{overlay.group.title}</h3>
        </div>
      </div>
      <p className="sheet-copy">{overlay.group.detail}</p>
      <div className="recommendation glass-card" data-level="3">
        <Star size={18} aria-hidden="true" />
        <span>建议先从“{overlay.group.recent}”继续，结束后再决定是否保存为共同经历。</span>
      </div>
      <div className="child-grid">
        {overlay.group.children.map((child) => {
          const ChildIcon = child.icon;
          return (
            <button key={child.id} className="child-button theme-pressable" onClick={() => setSelected(child)}>
              <ChildIcon size={17} />
              <span>{child.title}</span>
            </button>
          );
        })}
      </div>
      <ActivityLog />
    </div>
  );
}

function PrototypeTemplate({ template }: { template: ChildFeature["template"] }) {
  if (template === "timeline") {
    return (
      <div className="prototype-template timeline-template">
        <span />
        <p>昨天 22:40 生成候选回忆</p>
        <span />
        <p>今天 08:42 被再次提及</p>
      </div>
    );
  }

  if (template === "settings") {
    return (
      <div className="prototype-template settings-template">
        {["启用", "需要确认", "仅作原型展示"].map((item) => (
          <label key={item}>
            <input type="checkbox" defaultChecked />
            <span>{item}</span>
          </label>
        ))}
      </div>
    );
  }

  return (
    <div className={`prototype-template ${template}-template`}>
      <div className="skeleton-line wide" />
      <div className="skeleton-line" />
      <div className="template-preview">
        <ClockCounterClockwise size={24} />
        <strong>模拟状态</strong>
        <span>这里展示加载、空状态和成功反馈，不连接真实服务。</span>
      </div>
    </div>
  );
}

function ActivityLog() {
  return (
    <div className="activity-log">
      <p className="card-kicker">活动记录占位</p>
      <div>
        <span>昨天 22:40</span>
        <strong>一次陪伴结束，生成一条候选回忆。</strong>
      </div>
      <div>
        <span>周二 19:16</span>
        <strong>共同播放列表新增一首歌。</strong>
      </div>
    </div>
  );
}

function CallSheet() {
  const { showToast } = useToast();

  return (
    <div className="sheet-content">
      <div className="call-prep glass-card" data-level="2">
        <Phone size={32} />
        <h3>通话准备</h3>
        <p>这是通话入口原型，不接入真实语音。</p>
        <div className="wave-row" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
      <div className="child-grid">
        {["普通通话", "睡眠陪伴", "做饭陪伴", "散步陪伴"].map((item) => (
          <button className="child-button theme-pressable" key={item} onClick={() => showToast("processing", `${item}正在准备`)}>
            <Phone size={16} />
            <span>{item}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function DockSheet({ title, actions }: { title: string; actions: string[] }) {
  const { showToast } = useToast();

  return (
    <div className="sheet-content">
      <h3>{title}</h3>
      <div className="child-grid">
        {actions.map((action) => (
          <button className="child-button theme-pressable" key={action} onClick={() => showToast("success", `${action}已打开`)}>
            <Plus size={16} />
            <span>{action}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
