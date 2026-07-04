import { FormEvent, useMemo, useState } from "react";
import { CalendarBlank, Clock, Heart, Plus, Sparkle } from "@phosphor-icons/react";
import { useToast } from "../feedback/ToastProvider";

type CalendarEvent = {
  id: number;
  day: number;
  title: string;
  time: string;
  note: string;
  type: "纪念日" | "共同活动" | "提醒" | "主动安排";
};

const initialEvents: CalendarEvent[] = [
  { id: 1, day: 4, title: "第一次深夜长聊", time: "全天", note: "关系纪念日", type: "纪念日" },
  { id: 2, day: 8, title: "一起整理歌单", time: "20:30", note: "共同活动", type: "共同活动" },
  { id: 3, day: 12, title: "晚间复盘提醒", time: "21:40", note: "轻提醒", type: "提醒" },
  { id: 4, day: 18, title: "ta 安排了一次散步", time: "19:00", note: "角色主动安排", type: "主动安排" },
];

export function CalendarPage() {
  const { showToast } = useToast();
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const stored = window.localStorage.getItem("vp-calendar-events");
    return stored ? JSON.parse(stored) as CalendarEvent[] : initialEvents;
  });
  const [selectedDay, setSelectedDay] = useState(4);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [draft, setDraft] = useState({ title: "", time: "19:30", note: "" });

  const selectedEvents = useMemo(() => events.filter((event) => event.day === selectedDay), [events, selectedDay]);
  const upcoming = useMemo(() => events.filter((event) => event.day >= selectedDay).slice(0, 3), [events, selectedDay]);

  const saveEvent = (event: FormEvent) => {
    event.preventDefault();
    if (!draft.title.trim()) return;
    const next = [...events, {
      id: Date.now(),
      day: selectedDay,
      title: draft.title.trim(),
      time: draft.time,
      note: draft.note.trim() || "新建 Mock 事件",
      type: "共同活动" as const,
    }];
    setEvents(next);
    window.localStorage.setItem("vp-calendar-events", JSON.stringify(next));
    setDraft({ title: "", time: "19:30", note: "" });
    setSheetOpen(false);
    showToast("success", "事件已添加");
  };

  return (
    <div className="today-subpage calendar-page">
      <div className="calendar-month glass-card" data-level="1">
        <div className="calendar-title-row">
          <div>
            <p className="card-kicker">2026 年 7 月</p>
            <h3>这个月的共同节奏</h3>
          </div>
          <CalendarBlank size={28} />
        </div>
        <div className="month-grid">
          {Array.from({ length: 30 }).map((_, index) => {
            const day = index + 1;
            const hasEvent = events.some((item) => item.day === day);
            return (
              <button
                className="calendar-day theme-pressable"
                data-active={selectedDay === day}
                data-marked={hasEvent}
                key={day}
                onClick={() => setSelectedDay(day)}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      <section className="event-panel glass-card" data-level="2">
        <div className="section-title-row">
          <strong>{selectedDay} 日事件</strong>
          <button className="primary-action compact theme-pressable" onClick={() => setSheetOpen(true)}>
            <Plus size={16} />
            添加
          </button>
        </div>
        {selectedEvents.length ? selectedEvents.map((item) => (
          <article className="event-row" key={item.id}>
            <span>{item.time}</span>
            <div>
              <strong>{item.title}</strong>
              <small>{item.type} · {item.note}</small>
            </div>
          </article>
        )) : (
          <div className="inline-empty">
            <Sparkle size={18} />
            <span>这一天还没有安排。</span>
          </div>
        )}
      </section>

      <section className="upcoming-events">
        <p className="section-label">即将到来</p>
        {upcoming.map((item) => (
          <article className="upcoming-card glass-card" data-level="3" key={item.id}>
            {item.type === "纪念日" ? <Heart size={18} /> : <Clock size={18} />}
            <div>
              <strong>{item.title}</strong>
              <span>7 月 {item.day} 日 · {item.time}</span>
            </div>
          </article>
        ))}
      </section>

      {sheetOpen && (
        <form className="bottom-action-sheet glass-card" data-level="1" onSubmit={saveEvent}>
          <strong>添加事件</strong>
          <input value={draft.title} onChange={(event) => setDraft((value) => ({ ...value, title: event.target.value }))} placeholder="标题" />
          <input value={draft.time} onChange={(event) => setDraft((value) => ({ ...value, time: event.target.value }))} type="time" />
          <input value={draft.note} onChange={(event) => setDraft((value) => ({ ...value, note: event.target.value }))} placeholder="备注" />
          <div>
            <button className="secondary-action theme-pressable" type="button" onClick={() => setSheetOpen(false)}>取消</button>
            <button className="primary-action theme-pressable" type="submit" disabled={!draft.title.trim()}>保存</button>
          </div>
        </form>
      )}
    </div>
  );
}
