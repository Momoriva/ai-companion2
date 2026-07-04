export function TimelineCard() {
  const items = [
    ["May 20", "A start trip in the lake"],
    ["May 18", "Late-night talk"],
    ["May 13", "A small but happy day"],
  ];

  return (
    <article className="timeline-card glass-card" data-level="2">
      <div className="section-title-row">
        <strong>Timeline</strong>
        <span className="text-link">See all</span>
      </div>
      <div className="timeline-list">
        {items.map(([date, title]) => (
          <div className="timeline-row" key={title}>
            <span />
            <time>{date}</time>
            <p>{title}</p>
            <i />
          </div>
        ))}
      </div>
    </article>
  );
}
