import { useState } from "react";
import {
  Bell,
  Brain,
  CalendarBlank,
  CheckCircle,
  CloudArrowUp,
  Eye,
  GearSix,
  IdentificationCard,
  ImageSquare,
  LockKey,
  PaintBrush,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  Trash,
  User,
} from "@phosphor-icons/react";
import type { IconType, ManagePageId } from "../../types";
import { useToast } from "../feedback/ToastProvider";

export function ManageSubPage({ page }: { page: ManagePageId }) {
  if (page === "profile") return <ProfileEditPage />;
  if (page === "character") return <CharacterManagePage />;
  if (page === "user") return <UserManagePage />;
  if (page === "memory") return <MemoryManagePage />;
  if (page === "appearance") return <AppearancePage />;
  return <SystemSettingsPage />;
}

function useStoredState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) as T : initialValue;
  });

  const update = (nextValue: T | ((value: T) => T)) => {
    setValue((current) => {
      const resolved = typeof nextValue === "function" ? (nextValue as (value: T) => T)(current) : nextValue;
      window.localStorage.setItem(key, JSON.stringify(resolved));
      return resolved;
    });
  };

  return [value, update] as const;
}

function PageTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="manage-page-title">
      <p className="card-kicker">{subtitle}</p>
      <h3>{title}</h3>
    </div>
  );
}

function SaveButton({ saved, onSave }: { saved: boolean; onSave: () => void }) {
  return (
    <button className="primary-action theme-pressable" onClick={onSave}>
      {saved ? <CheckCircle size={17} weight="fill" /> : null}
      {saved ? "已保存" : "保存"}
    </button>
  );
}

function EmptyState({ title, action, onAction }: { title: string; action: string; onAction: () => void }) {
  return (
    <div className="empty-state glass-card" data-level="3">
      <CalendarBlank size={22} />
      <span>{title}</span>
      <button className="secondary-action compact theme-pressable" onClick={onAction}>{action}</button>
    </div>
  );
}

function ProfileEditPage() {
  const { showToast } = useToast();
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useStoredState("vp-profile", {
    name: "Mira",
    intro: "喜欢安静、清晰、有节奏的陪伴。",
    nickname: "小米",
    birthday: "1998-05-20",
    timezone: "Asia/Shanghai",
  });

  const save = () => {
    setSaved(true);
    showToast("success", "个人档案已保存");
  };

  return (
    <div className="manage-subpage profile-edit-page">
      <PageTitle title="个人档案" subtitle="Profile" />
      <div className="profile-edit-hero glass-card" data-level="1">
        <div className="profile-orb" aria-hidden="true" />
        <div>
          <strong>{profile.name}</strong>
          <span>{profile.intro}</span>
        </div>
      </div>
      <div className="edit-form-grid">
        {[
          ["昵称", "name"],
          ["简介", "intro"],
          ["常用称呼", "nickname"],
          ["生日", "birthday"],
          ["时区", "timezone"],
        ].map(([label, key]) => (
          <label className="edit-field" key={key}>
            <span>{label}</span>
            <input
              value={profile[key as keyof typeof profile]}
              onChange={(event) => {
                setSaved(false);
                setProfile((value) => ({ ...value, [key]: event.target.value }));
              }}
            />
          </label>
        ))}
      </div>
      <SaveButton saved={saved} onSave={save} />
    </div>
  );
}

function CharacterManagePage() {
  const { showToast } = useToast();
  const [saved, setSaved] = useState(false);
  const [tone, setTone] = useStoredState("vp-character-tone", "温和克制");
  const [opened, setOpened] = useState("角色档案");
  const sections = ["角色档案", "世界书", "语言风格", "称呼与关系", "角色成长", "原设锁定"];

  return (
    <div className="manage-subpage character-page">
      <PageTitle title="角色管理" subtitle="Identity" />
      <article className="character-profile-card glass-card" data-level="1">
        <IdentificationCard size={28} />
        <div>
          <strong>{opened}</strong>
          <span>资料卡、世界书与关系设定都以 Mock 内容展示。</span>
        </div>
      </article>
      <div className="character-entry-grid">
        {sections.map((item, index) => (
          <button className="character-entry theme-pressable" data-active={opened === item} key={item} onClick={() => { setOpened(item); showToast("processing", `${item}已打开`); }}>
            {index === 5 ? <LockKey size={18} /> : <Star size={18} />}
            <span>{item}</span>
          </button>
        ))}
      </div>
      <label className="edit-field">
        <span>语言风格</span>
        <input value={tone} onChange={(event) => { setTone(event.target.value); setSaved(false); }} />
      </label>
      <SaveButton saved={saved} onSave={() => { setSaved(true); showToast("success", "角色设定已保存"); }} />
    </div>
  );
}

function UserManagePage() {
  const { showToast } = useToast();
  const [saved, setSaved] = useState(false);
  const [activeTags, setActiveTags] = useStoredState("vp-user-tags", ["安静", "夜间提醒"]);
  const [routine, setRoutine] = useStoredState("vp-user-routine", "23:30");
  const tags = ["安静", "高频陪伴", "夜间提醒", "少打扰", "主动问候", "工作日"];

  const toggleTag = (tag: string) => {
    setSaved(false);
    setActiveTags((items) => items.includes(tag) ? items.filter((item) => item !== tag) : [...items, tag]);
  };

  return (
    <div className="manage-subpage user-page">
      <PageTitle title="用户管理" subtitle="User" />
      <div className="user-info-card glass-card" data-level="1">
        <User size={26} />
        <div>
          <strong>用户资料</strong>
          <span>偏好、作息、重要人物、重要日期与情绪偏好。</span>
        </div>
      </div>
      <label className="edit-field">
        <span>作息时间</span>
        <input type="time" value={routine} onChange={(event) => { setRoutine(event.target.value); setSaved(false); }} />
      </label>
      <div className="tag-picker">
        {tags.map((tag) => (
          <button className="tag-chip theme-pressable" data-active={activeTags.includes(tag)} key={tag} onClick={() => toggleTag(tag)}>
            {tag}
          </button>
        ))}
      </div>
      <div className="info-card-row">
        <span>情绪偏好：轻声确认</span>
        <span>生理周期：已关闭</span>
      </div>
      <EmptyState title="重要人物暂无新增" action="添加人物" onAction={() => showToast("processing", "添加人物为 Mock 演示")} />
      <EmptyState title="重要日期暂无提醒" action="添加日期" onAction={() => showToast("processing", "添加日期为 Mock 演示")} />
      <SaveButton saved={saved} onSave={() => { setSaved(true); showToast("success", "用户偏好已保存"); }} />
    </div>
  );
}

function MemoryManagePage() {
  const { showToast } = useToast();
  const [filter, setFilter] = useState("待确认");
  const [confirmed, setConfirmed] = useStoredState("vp-memory-confirmed", false);
  const [privateOn, setPrivateOn] = useStoredState("vp-memory-private", false);
  const [pinned, setPinned] = useStoredState("vp-memory-pinned", true);
  const hasPending = filter !== "来源";

  return (
    <div className="manage-subpage memory-page">
      <PageTitle title="记忆管理" subtitle="Memory" />
      <div className="filter-tabs">
        {["待确认", "已保存", "私密", "置顶", "来源", "导出"].map((item) => (
          <button className="tag-chip theme-pressable" data-active={filter === item} key={item} onClick={() => setFilter(item)}>
            {item}
          </button>
        ))}
      </div>
      {hasPending ? (
        <article className="memory-item-card glass-card" data-level="2">
          <div>
            <strong>{confirmed ? "已保存" : "待确认"} · 周末展览计划</strong>
            <span>来源：聊天 · 主动提及权限开启</span>
          </div>
          <button
            className="primary-action theme-pressable"
            onClick={() => {
              setConfirmed(true);
              showToast("success", "记忆已确认");
            }}
          >
            {confirmed ? "已保存" : "确认"}
          </button>
        </article>
      ) : (
        <EmptyState title="暂无来源筛选结果" action="查看全部" onAction={() => setFilter("待确认")} />
      )}
      <ToggleRow icon={LockKey} label="私密" checked={privateOn} onToggle={() => { setPrivateOn((value) => !value); showToast("success", "私密状态已更新"); }} />
      <ToggleRow icon={Star} label="置顶" checked={pinned} onToggle={() => { setPinned((value) => !value); showToast("success", "置顶状态已更新"); }} />
      <button className="secondary-action theme-pressable" onClick={() => showToast("processing", "导出流程已模拟启动")}>
        <CloudArrowUp size={17} />
        导出
      </button>
    </div>
  );
}

function AppearancePage() {
  const { showToast } = useToast();
  const [fontSize, setFontSize] = useStoredState("vp-font-size", 16);
  const [saved, setSaved] = useState(false);
  const [theme, setTheme] = useStoredState("vp-appearance-theme", "浅色玻璃");

  return (
    <div className="manage-subpage appearance-page">
      <PageTitle title="外观" subtitle="Appearance" />
      <div className="appearance-preview glass-card" data-level="1" style={{ fontSize }}>
        <ImageSquare size={28} />
        <div>
          <strong>{theme}</strong>
          <span>主页背景 · 聊天背景 · 朋友圈背景</span>
        </div>
      </div>
      <div className="visual-option-grid">
        {["AI 头像", "用户头像", "图标主题", "小组件"].map((item) => (
          <button className="visual-option theme-pressable" data-active={theme === item} key={item} onClick={() => { setTheme(item); setSaved(false); }}>
            <PaintBrush size={18} />
            <span>{item}</span>
          </button>
        ))}
      </div>
      <label className="range-field">
        <span>字号 {fontSize}px</span>
        <input type="range" min="14" max="20" value={fontSize} onChange={(event) => { setFontSize(Number(event.target.value)); setSaved(false); }} />
      </label>
      <EmptyState title="收藏图标暂无内容" action="选择图标" onAction={() => showToast("processing", "图标选择为 Mock 演示")} />
      <SaveButton saved={saved} onSave={() => { setSaved(true); showToast("success", "外观已保存"); }} />
    </div>
  );
}

function SystemSettingsPage() {
  const { showToast } = useToast();
  const [sync, setSync] = useStoredState("vp-sync", true);
  const [notice, setNotice] = useStoredState("vp-notice", true);
  const [dnd, setDnd] = useStoredState("vp-dnd", false);
  const [advanced, setAdvanced] = useStoredState("vp-advanced", false);
  const [dangerAction, setDangerAction] = useState<string | null>(null);

  const confirmDanger = () => {
    if (!dangerAction) return;
    window.localStorage.setItem("vp-last-danger-action", dangerAction);
    showToast("failure", `${dangerAction}已作为 Mock 状态记录`);
    setDangerAction(null);
  };

  return (
    <div className="manage-subpage system-page">
      <PageTitle title="系统设置" subtitle="System" />
      <section className="settings-cluster glass-card" data-level="2">
        <ToggleRow icon={User} label="账户" checked onToggle={() => showToast("processing", "账户页为 Mock 占位")} />
        <ToggleRow icon={CloudArrowUp} label="云同步" checked={sync} onToggle={() => { setSync((value) => !value); showToast("success", "同步设置已更新"); }} />
        <ToggleRow icon={Bell} label="通知" checked={notice} onToggle={() => { setNotice((value) => !value); showToast("success", "通知设置已更新"); }} />
        <ToggleRow icon={Eye} label="勿扰" checked={dnd} onToggle={() => { setDnd((value) => !value); showToast("success", "勿扰设置已更新"); }} />
        <ToggleRow icon={ShieldCheck} label="权限与隐私" checked onToggle={() => showToast("success", "权限状态已查看")} />
        <ToggleRow icon={GearSix} label="模型设置" checked={advanced} onToggle={() => { setAdvanced((value) => !value); showToast("success", "高级设置已更新"); }} />
      </section>
      <section className="danger-zone glass-card" data-level="2">
        <strong>危险操作</strong>
        {["数据删除", "清除全部记忆", "重置角色"].map((item) => (
          <button className="danger-action theme-pressable" key={item} onClick={() => setDangerAction(item)}>
            <Trash size={17} />
            {item}
          </button>
        ))}
      </section>
      {dangerAction && (
        <div className="confirm-sheet glass-card" data-level="1">
          <strong>确认执行“{dangerAction}”？</strong>
          <span>这里不会连接真实服务，只记录 Mock 状态。</span>
          <div>
            <button className="secondary-action theme-pressable" onClick={() => setDangerAction(null)}>取消</button>
            <button className="danger-action theme-pressable" onClick={confirmDanger}>确认</button>
          </div>
        </div>
      )}
    </div>
  );
}

function ToggleRow({
  icon: Icon,
  label,
  checked,
  onToggle,
}: {
  icon: IconType;
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button className="toggle-row theme-pressable" onClick={onToggle}>
      <Icon size={19} />
      <span>{label}</span>
      <i data-on={checked}>{checked ? "开启" : "关闭"}</i>
    </button>
  );
}
