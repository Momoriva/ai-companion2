import { FormEvent, useEffect, useState } from "react";
import { Microphone, Phone, Sparkle, Trash, Waveform } from "@phosphor-icons/react";
import { useToast } from "../feedback/ToastProvider";

export function QuickActionPage({ page }: { page: "call" | "voice-note" | "ai-help" }) {
  if (page === "call") return <CallPrepPage />;
  if (page === "voice-note") return <VoiceNotePage />;
  return <AiHelpPage />;
}

function CallPrepPage() {
  const { showToast } = useToast();
  const [micOn, setMicOn] = useState(true);
  const [started, setStarted] = useState(false);

  return (
    <div className="today-subpage call-page">
      <section className="call-stage glass-card" data-level="1">
        <div className="large-avatar">AI</div>
        <p className="card-kicker">通话准备</p>
        <h3>{started ? "正在等待接通" : "准备一次轻声通话"}</h3>
        <span>{micOn ? "麦克风已开启" : "麦克风已关闭"} · 普通通话</span>
        <div className="wave-row" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </section>
      <div className="call-actions">
        <button className="secondary-action theme-pressable" onClick={() => setMicOn((value) => !value)}>
          <Microphone size={17} />
          {micOn ? "关闭麦克风" : "打开麦克风"}
        </button>
        <button className="primary-action theme-pressable" onClick={() => { setStarted(true); showToast("processing", "通话正在准备"); }}>
          <Phone size={17} />
          开始
        </button>
        <button className="secondary-action theme-pressable" onClick={() => { setStarted(false); showToast("success", "已取消通话"); }}>
          取消
        </button>
      </div>
    </div>
  );
}

function VoiceNotePage() {
  const { showToast } = useToast();
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(() => Number(window.localStorage.getItem("vp-voice-note-seconds") ?? 0));
  const [saved, setSaved] = useState(window.localStorage.getItem("vp-voice-note-saved") === "true");

  useEffect(() => {
    if (!recording) return;
    const timer = window.setInterval(() => {
      setSeconds((value) => {
        const next = value + 1;
        window.localStorage.setItem("vp-voice-note-seconds", String(next));
        return next;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [recording]);

  const reset = () => {
    setRecording(false);
    setSeconds(0);
    setSaved(false);
    window.localStorage.removeItem("vp-voice-note-seconds");
    window.localStorage.removeItem("vp-voice-note-saved");
    showToast("success", "语音便签已删除");
  };

  return (
    <div className="today-subpage voice-note-page">
      <section className="recorder-card glass-card" data-level="1">
        <p className="card-kicker">语音便签</p>
        <button className="record-button theme-pressable" data-recording={recording} onClick={() => setRecording((value) => !value)}>
          <Microphone size={30} weight={recording ? "fill" : "regular"} />
        </button>
        <h3>{recording ? "正在录音" : "轻按开始录音"}</h3>
        <span>{String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}</span>
        <div className="voice-wave" aria-hidden="true">
          {Array.from({ length: 18 }).map((_, index) => <i key={index} />)}
        </div>
      </section>
      <div className="call-actions">
        <button className="secondary-action theme-pressable" onClick={reset}>
          <Trash size={17} />
          删除
        </button>
        <button
          className="primary-action theme-pressable"
          disabled={seconds === 0}
          onClick={() => {
            setSaved(true);
            window.localStorage.setItem("vp-voice-note-saved", "true");
            showToast("success", "语音便签已保存");
          }}
        >
          <Waveform size={17} />
          {saved ? "已保存" : "保存"}
        </button>
      </div>
    </div>
  );
}

function AiHelpPage() {
  const { showToast } = useToast();
  const [question, setQuestion] = useState("");
  const [reply, setReply] = useState(window.localStorage.getItem("vp-help-reply") || "可以先选一个问题，我会给出轻量建议。");
  const prompts = ["今天该先做什么？", "帮我整理一条回复", "我有点累，怎么安排？"];

  const ask = (event: FormEvent) => {
    event.preventDefault();
    const text = question.trim();
    if (!text) return;
    const next = `关于“${text}”，建议先保留一件最小可完成的事，其余安排放轻一点。`;
    setReply(next);
    window.localStorage.setItem("vp-help-reply", next);
    setQuestion("");
    showToast("success", "Mock 回复已生成");
  };

  return (
    <div className="today-subpage ai-help-page">
      <section className="help-hero glass-card" data-level="1">
        <Sparkle size={28} />
        <div>
          <p className="card-kicker">AI 帮助</p>
          <h3>只给你一点轻量建议</h3>
        </div>
      </section>
      <div className="prompt-list">
        {prompts.map((item) => (
          <button className="prompt-chip theme-pressable" key={item} onClick={() => setQuestion(item)}>
            {item}
          </button>
        ))}
      </div>
      <section className="help-reply glass-card" data-level="2">
        <strong>Mock 回复</strong>
        <p>{reply}</p>
      </section>
      <form className="help-input" onSubmit={ask}>
        <input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="输入一个小问题" />
        <button className="primary-action theme-pressable" type="submit" disabled={!question.trim()}>发送</button>
      </form>
    </div>
  );
}
