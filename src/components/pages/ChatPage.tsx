import { FormEvent, PointerEvent, useEffect, useRef, useState } from "react";
import {
  Brain,
  Camera,
  DotsThree,
  File,
  ImageSquare,
  LinkSimple,
  ListChecks,
  MapPin,
  Microphone,
  PaperPlaneTilt,
  Plus,
  Smiley,
  Waveform,
} from "@phosphor-icons/react";
import { SendLetterMotion } from "../motion/SendLetterMotion";
import { useToast } from "../feedback/ToastProvider";
import { IdentityAvatar } from "../appearance/IdentityAvatar";

type MessageKind = "text" | "image" | "voice" | "web" | "activity" | "memory";
type Message = {
  id: number;
  from: "ai" | "user";
  text: string;
  kind: MessageKind;
  status?: "sending" | "sent";
};

const initialMessages: Message[] = [
  { id: 1, from: "ai", text: "早安。今天可以慢一点，我在这里。", kind: "text" },
  { id: 2, from: "user", text: "刚好需要这句话，谢谢你。", kind: "text", status: "sent" },
  { id: 3, from: "ai", text: "这张天空很像今天的节奏。", kind: "image" },
  { id: 4, from: "ai", text: "00:12", kind: "voice" },
  { id: 5, from: "ai", text: "晚间散步计划 · 19:30", kind: "activity" },
];

const plusActions: Array<{ label: string; icon: typeof ImageSquare; kind: MessageKind }> = [
  { label: "图片", icon: ImageSquare, kind: "image" },
  { label: "相机", icon: Camera, kind: "image" },
  { label: "网页", icon: LinkSimple, kind: "web" },
  { label: "活动", icon: ListChecks, kind: "activity" },
  { label: "文件", icon: File, kind: "text" },
  { label: "位置", icon: MapPin, kind: "text" },
];

export function ChatPage() {
  const { showToast } = useToast();
  const [messages, setMessages] = useState<Message[]>(() => {
    const stored = window.localStorage.getItem("virtual-phone-chat");
    return stored ? JSON.parse(stored) as Message[] : initialMessages;
  });
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [plusOpen, setPlusOpen] = useState(false);
  const [menuMessage, setMenuMessage] = useState<Message | null>(null);
  const [memorySaved, setMemorySaved] = useState(window.localStorage.getItem("virtual-phone-chat-memory") === "saved");
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const pressTimer = useRef<number | null>(null);

  useEffect(() => {
    window.localStorage.setItem("virtual-phone-chat", JSON.stringify(messages));
    const node = messagesRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
    window.localStorage.setItem("virtual-phone-chat-scroll", String(node.scrollTop));
  }, [messages]);

  useEffect(() => {
    const node = messagesRef.current;
    if (!node) return;
    const stored = Number(window.localStorage.getItem("virtual-phone-chat-scroll") ?? node.scrollHeight);
    node.scrollTop = stored;
    const saveScroll = () => window.localStorage.setItem("virtual-phone-chat-scroll", String(node.scrollTop));
    node.addEventListener("scroll", saveScroll);
    return () => node.removeEventListener("scroll", saveScroll);
  }, []);

  const send = (event: FormEvent) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;

    const id = Date.now();
    setSending(true);
    setDraft("");
    setMessages((items) => [...items, { id, from: "user", text, kind: "text", status: "sending" }]);
    window.setTimeout(() => {
      setMessages((items) => items.map((item) => item.id === id ? { ...item, status: "sent" } : item));
      setSending(false);
      showToast("success", "消息已发送");
    }, 460);
  };

  const addMockMessage = (label: string, kind: MessageKind) => {
    setMessages((items) => [...items, {
      id: Date.now(),
      from: "user",
      kind,
      text: kind === "voice" ? "00:08" : `${label}已发送`,
      status: "sent",
    }]);
    setPlusOpen(false);
    showToast("success", `${label}已发送`);
  };

  const startPress = (event: PointerEvent<HTMLDivElement>, message: Message) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    pressTimer.current = window.setTimeout(() => setMenuMessage(message), 520);
  };

  const endPress = () => {
    if (pressTimer.current) window.clearTimeout(pressTimer.current);
  };

  const menuAction = (label: string) => {
    if (label === "删除" && menuMessage) {
      setMessages((items) => items.filter((item) => item.id !== menuMessage.id));
    }
    if (label === "保存为回忆") {
      setMemorySaved(true);
      window.localStorage.setItem("virtual-phone-chat-memory", "saved");
    }
    showToast("success", `${label}已记录`);
    setMenuMessage(null);
  };

  return (
    <div className="chat-window chat-wechat">
      <div className="chat-header">
        <IdentityAvatar identity="ai" className="tiny-avatar" />
        <div>
          <h3>ta</h3>
          <p>在线 · 轻声回复中</p>
        </div>
        <button className="icon-soft-button theme-pressable" onClick={() => showToast("processing", "聊天设置为 Mock 演示")} aria-label="更多">
          <DotsThree size={20} />
        </button>
      </div>

      <div className="messages private-chat-scroll" ref={messagesRef}>
        <div className="time-divider">今天 09:41</div>
        {messages.map((message) => (
          <div className={`chat-message-row ${message.from}`} key={message.id}>
            {message.from === "ai" && <IdentityAvatar identity="ai" className="message-avatar" />}
            <div
              className={`bubble ${message.from}`}
              data-kind={message.kind}
              onPointerDown={(event) => startPress(event, message)}
              onPointerUp={endPress}
              onPointerLeave={endPress}
              onContextMenu={(event) => {
                event.preventDefault();
                setMenuMessage(message);
              }}
            >
              {message.kind === "image" && <div className="image-message"><ImageSquare size={24} /><span>{message.text}</span></div>}
              {message.kind === "voice" && <div className="voice-message"><Waveform size={19} /><span>{message.text}</span></div>}
              {message.kind === "web" && <div className="web-message"><LinkSimple size={18} /><span>{message.text}</span></div>}
              {message.kind === "activity" && <div className="activity-message"><ListChecks size={18} /><span>{message.text}</span></div>}
              {message.kind === "text" && <span>{message.text}</span>}
              {message.status && <small>{message.status === "sending" ? "发送中" : "已发送"}</small>}
            </div>
            {message.from === "user" && <IdentityAvatar identity="user" className="message-avatar user-avatar" />}
          </div>
        ))}

        <div className="special-card glass-card memory-confirm-card" data-level="3">
          <Brain size={20} />
          <div>
            <strong>{memorySaved ? "已保存的回忆" : "候选回忆"}</strong>
            <span>{memorySaved ? "这段对话已进入回忆管理。" : "这段对话可以保存为纪念。"}</span>
          </div>
          <button className="mini-button theme-pressable" data-active={memorySaved} onClick={() => menuAction("保存为回忆")}>
            {memorySaved ? "已保存" : "确认"}
          </button>
        </div>
      </div>

      {menuMessage && (
        <div className="message-menu glass-card" data-level="1">
          {["复制", "引用", "收藏", "删除", "重新生成", "保存为回忆", "反馈角色偏离"].map((item) => (
            <button className="theme-pressable" key={item} onClick={() => menuAction(item)}>{item}</button>
          ))}
          <button className="secondary-action compact theme-pressable" onClick={() => setMenuMessage(null)}>关闭</button>
        </div>
      )}

      {plusOpen && (
        <div className="chat-plus-panel glass-card" data-level="1">
          {plusActions.map((item) => {
            const Icon = item.icon;
            return (
              <button className="theme-pressable" key={item.label} onClick={() => addMockMessage(item.label, item.kind)}>
                <Icon size={22} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}

      <form className="chat-input wechat-composer" onSubmit={send}>
        <button className="icon-soft-button theme-pressable" type="button" onClick={() => addMockMessage("语音", "voice")} aria-label="语音">
          <Microphone size={18} />
        </button>
        <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="写给ta..." aria-label="输入聊天内容" />
        <button className="icon-soft-button theme-pressable" type="button" onClick={() => showToast("processing", "表情面板为 Mock 演示")} aria-label="表情">
          <Smiley size={18} />
        </button>
        <button className="icon-soft-button theme-pressable" type="button" onClick={() => setPlusOpen((value) => !value)} aria-label="更多功能">
          <Plus size={18} />
        </button>
        <button className="send-button theme-pressable" type="submit" disabled={!draft.trim() || sending} aria-label="发送">
          <PaperPlaneTilt size={19} />
        </button>
        <SendLetterMotion active={sending} />
      </form>
    </div>
  );
}
