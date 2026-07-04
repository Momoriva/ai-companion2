import { useState } from "react";
import { Heart, Pause, Play, SkipBack, SkipForward } from "@phosphor-icons/react";

export function MusicVinylCard({ onListen }: { onListen: () => void }) {
  const [playing, setPlaying] = useState(() => window.localStorage.getItem("vp-music-playing") !== "false");
  const [liked, setLiked] = useState(() => window.localStorage.getItem("vp-music-liked") === "true");

  const togglePlaying = () => {
    setPlaying((value) => {
      window.localStorage.setItem("vp-music-playing", String(!value));
      return !value;
    });
  };

  const toggleLiked = () => {
    setLiked((value) => {
      window.localStorage.setItem("vp-music-liked", String(!value));
      return !value;
    });
  };

  return (
    <article className="music-vinyl-card glass-card theme-pressable" data-level="1" onClick={onListen}>
      <div className="music-card-head">
        <div>
          <p className="card-kicker">一起听歌</p>
          <h3>Listen Together</h3>
        </div>
        <button
          className="round-soft-button theme-pressable"
          data-active={liked}
          aria-label={liked ? "已收藏当前歌曲" : "收藏当前歌曲"}
          onClick={(event) => {
            event.stopPropagation();
            toggleLiked();
          }}
        >
          <Heart size={17} weight={liked ? "fill" : "regular"} />
        </button>
      </div>
      <div className="vinyl-stage" aria-hidden="true">
        <div className="vinyl-record">
          <span />
        </div>
        <div className="tone-arm" />
      </div>
      <div className="track-copy">
        <span className="now-playing">{playing ? "正在播放" : "已暂停"}</span>
        <strong>Aurora Skies</strong>
        <small>Owen Eastwood · Shared playlist</small>
      </div>
      <div className="music-progress">
        <span>01:24</span>
        <div>
          <i />
        </div>
        <span>03:58</span>
      </div>
      <div className="music-controls" aria-label="播放控制">
        <SkipBack size={18} weight="fill" aria-hidden="true" />
        <button
          className="pause-button theme-pressable"
          aria-label={playing ? "暂停" : "播放"}
          onClick={(event) => {
            event.stopPropagation();
            togglePlaying();
          }}
        >
          {playing ? <Pause size={18} weight="fill" /> : <Play size={18} weight="fill" />}
        </button>
        <SkipForward size={18} weight="fill" aria-hidden="true" />
      </div>
      <button
        className="listen-cta primary-action theme-pressable"
        onClick={(event) => {
          event.stopPropagation();
          onListen();
        }}
      >
        一起听歌
      </button>
    </article>
  );
}
