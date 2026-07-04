import { FormEvent, useState } from "react";
import { CloudSun, Heartbeat, Moon, Smiley, Sparkle, Sun, TrendUp } from "@phosphor-icons/react";
import { useToast } from "../feedback/ToastProvider";

const moodOptions = [
  { id: "calm", label: "平静", icon: CloudSun },
  { id: "bright", label: "轻快", icon: Sun },
  { id: "soft", label: "温柔", icon: Sparkle },
  { id: "tired", label: "疲惫", icon: Moon },
  { id: "heavy", label: "低落", icon: Heartbeat },
  { id: "okay", label: "还好", icon: Smiley },
];

export function MoodPage() {
  const { showToast } = useToast();
  const [record, setRecord] = useState(() => {
    const stored = window.localStorage.getItem("vp-mood-record");
    return stored ? JSON.parse(stored) as { mood: string; intensity: number; note: string; saved: boolean } : {
      mood: "calm",
      intensity: 62,
      note: "",
      saved: false,
    };
  });

  const update = (next: Partial<typeof record>) => {
    const resolved = { ...record, ...next, saved: false };
    setRecord(resolved);
    window.localStorage.setItem("vp-mood-record", JSON.stringify(resolved));
  };

  const save = (event: FormEvent) => {
    event.preventDefault();
    const resolved = { ...record, saved: true };
    setRecord(resolved);
    window.localStorage.setItem("vp-mood-record", JSON.stringify(resolved));
    showToast("success", "今日情绪已保存");
  };

  return (
    <form className="today-subpage mood-page" onSubmit={save}>
      <section className="mood-picker glass-card" data-level="1">
        <p className="card-kicker">今日情绪</p>
        <div className="mood-option-grid">
          {moodOptions.map((item) => {
            const Icon = item.icon;
            return (
              <button
                className="mood-option theme-pressable"
                data-active={record.mood === item.id}
                key={item.id}
                type="button"
                onClick={() => update({ mood: item.id })}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      <label className="mood-strength glass-card" data-level="2">
        <span>情绪强度 {record.intensity}%</span>
        <input type="range" min="0" max="100" value={record.intensity} onChange={(event) => update({ intensity: Number(event.target.value) })} />
      </label>

      <label className="mood-note glass-card" data-level="2">
        <span>一句备注</span>
        <textarea value={record.note} onChange={(event) => update({ note: event.target.value })} placeholder="写一点今天的感受..." />
      </label>

      <section className="mood-trend glass-card" data-level="2">
        <div className="section-title-row">
          <strong>本周趋势</strong>
          <TrendUp size={18} />
        </div>
        <div className="trend-bars" aria-label="7 天情绪趋势">
          {[46, 58, 52, 68, record.intensity, 63, 71].map((value, index) => (
            <i key={index} style={{ "--bar-height": `${value}%` } as React.CSSProperties} />
          ))}
        </div>
        <p>这一周整体更稳定，今天适合少安排一点，把注意力放回身体。</p>
      </section>

      <section className="mood-reply glass-card" data-level="1">
        <Sparkle size={22} />
        <div>
          <strong>ta 的回应</strong>
          <span>我会把今天的语气放轻一点。你不用解释太多，我会慢慢听。</span>
        </div>
      </section>

      <button className="primary-action theme-pressable" type="submit">
        {record.saved ? "已保存" : "保存今日情绪"}
      </button>
    </form>
  );
}
