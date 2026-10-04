import { useCallback, useEffect, useRef, useState } from 'react';
import { C } from '../data';
import { commentCount, currentPost } from '../state';
import type { ScreenProps } from '../types';
import Avatar from '../components/Avatar';

const WHEEL_THROTTLE_MS = 500;
const SWIPE_MIN_PX = 50;

type FeedVideoProps = {
  src: string;
  playing: boolean;
  muted: boolean;
  onProgress: (pct: number) => void;
  onEnded: () => void;
  onBlocked: () => void;
};

function FeedVideo({ src, playing, muted, onProgress, onEnded, onBlocked }: FeedVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = muted;
    if (!playing) return v.pause();
    // Browser blockieren Autoplay mit Ton oft – dann stumm weiterspielen
    v.play().catch(() => {
      if (v.muted) return;
      onBlocked();
    });
  }, [playing, muted, onBlocked]);

  return (
    <video
      ref={ref}
      className="feed-video"
      src={src}
      playsInline
      preload="auto"
      onTimeUpdate={(e) => {
        const v = e.currentTarget;
        if (v.duration) onProgress((v.currentTime / v.duration) * 100);
      }}
      onEnded={onEnded}
    />
  );
}

export default function Feed(props: ScreenProps) {
  return currentPost(props.s) ? <FeedPlayer {...props} /> : <EmptyFeed {...props} />;
}

function EmptyFeed({ dispatch }: ScreenProps) {
  return (
    <div className="screen empty-feed">
      <div className="fill stripes-faint" />
      <div className="empty-feed-body">
        <h1 className="display">Noch keine Clips</h1>
        <p>Nimm deinen ersten Clip auf – er erscheint dann hier im Feed.</p>
        <button className="pill pill-orange" onClick={() => dispatch({ type: 'go', tab: 'rec' })}>Ersten Clip aufnehmen</button>
      </div>
    </div>
  );
}

function FeedPlayer({ s, dispatch }: ScreenProps) {
  const p = currentPost(s)!;
  const liked = !!s.liked[p.id];
  const saved = !!s.saved[p.id];
  const [muted, setMuted] = useState(false);
  const muteOnBlock = useCallback(() => setMuted(true), []);
  const lastWheel = useRef(0);
  const touchY = useRef<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (s.sheet) return;
      if (e.key === 'ArrowDown') dispatch({ type: 'next' });
      if (e.key === 'ArrowUp') dispatch({ type: 'prev' });
      if (e.key === ' ') { e.preventDefault(); dispatch({ type: 'togglePause' }); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [s.sheet, dispatch]);

  const onWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - lastWheel.current < WHEEL_THROTTLE_MS) return;
    lastWheel.current = now;
    dispatch({ type: e.deltaY > 0 ? 'next' : 'prev' });
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchY.current === null) return;
    const dy = touchY.current - e.changedTouches[0].clientY;
    touchY.current = null;
    if (Math.abs(dy) >= SWIPE_MIN_PX) dispatch({ type: dy > 0 ? 'next' : 'prev' });
  };

  return (
    <div
      className="screen"
      onWheel={onWheel}
      onTouchStart={(e) => (touchY.current = e.touches[0].clientY)}
      onTouchEnd={onTouchEnd}
    >
      <div className="fill" style={{ background: p.bg }} />
      {p.video ? (
        <FeedVideo key={p.id + '-' + s.idx} src={p.video} playing={!s.paused && !s.sheet} muted={muted}
          onProgress={(v) => dispatch({ type: 'setProg', value: v })}
          onEnded={() => dispatch({ type: 'next' })}
          onBlocked={muteOnBlock} />
      ) : (
        <div className="fill stripes" />
      )}
      <div className="fill" onClick={() => dispatch({ type: 'togglePause' })} />
      <div className="video-label">
        {!p.video && <>[ Video · {p.len} s · {p.scene} ]</>}
        <div className="pause-icon" style={{ opacity: s.paused ? 0.9 : 0 }}>❚❚</div>
      </div>
      {p.video && (
        <button className="mute" onClick={() => setMuted((m) => !m)} aria-label={muted ? 'Ton an' : 'Ton aus'}>
          {muted ? '🔇' : '🔊'}
        </button>
      )}
      <div className="shade-top" />
      <div className="shade-bottom" />

      <div className="feed-actions">
        <button className="plain" onClick={() => dispatch({ type: 'go', tab: 'profil' })} aria-label={`Profil von ${p.name}`}>
          <Avatar initial={p.ini} color={p.avc} size={46} ring={C.cream} ringWidth={2} />
        </button>

        <button className="action" onClick={() => dispatch({ type: 'toggleLike', id: p.id })} aria-pressed={liked} aria-label="Herz">
          <svg width="38" height="38" viewBox="0 0 24 24">
            <path
              d="M12 21C5 15.5 2.5 12 2.5 8.6 2.5 6 4.5 4 7 4c2 0 3.8 1.1 5 3 1.2-1.9 3-3 5-3 2.5 0 4.5 2 4.5 4.6C21.5 12 19 15.5 12 21z"
              style={{ fill: liked ? C.orange : 'none', stroke: liked ? C.orange : C.cream }}
              strokeWidth="1.5"
            />
          </svg>
          <span>{p.likes + (liked ? 1 : 0)}</span>
        </button>

        <button className="action" onClick={() => dispatch({ type: 'openSheet', sheet: 'comments' })} aria-label="Kommentare">
          <svg width="36" height="36" viewBox="0 0 24 24">
            <path d="M4 4h16a1 1 0 011 1v11a1 1 0 01-1 1H10l-5 4v-4H4a1 1 0 01-1-1V5a1 1 0 011-1z" style={{ fill: C.cream }} />
            <circle cx="8" cy="10.5" r="1.3" style={{ fill: C.ink }} />
            <circle cx="12" cy="10.5" r="1.3" style={{ fill: C.ink }} />
            <circle cx="16" cy="10.5" r="1.3" style={{ fill: C.ink }} />
          </svg>
          <span>{commentCount(s, p)}</span>
        </button>

        <button className="action" onClick={() => dispatch({ type: 'toggleSave', id: p.id })} aria-pressed={saved}>
          <svg width="32" height="32" viewBox="0 0 24 24">
            <path d="M6 3h12v18l-6-4.5L6 21z" style={{ fill: saved ? C.orange : 'none', stroke: C.cream }} strokeWidth="1.5" />
          </svg>
          <span>{saved ? 'Gemerkt' : 'Merken'}</span>
        </button>

        <button className="action" onClick={() => dispatch({ type: 'openSheet', sheet: 'share' })}>
          <svg width="32" height="32" viewBox="0 0 24 24">
            <path d="M21 3L3 10.5l7 2.5 2.5 7z" style={{ fill: C.cream }} />
          </svg>
          <span>Teilen</span>
        </button>
      </div>

      <div className="feed-meta">
        <div className="feed-meta-head">
          <span className="feed-name">{p.name}</span>
          <span className="role-chip">{p.role}</span>
        </div>
        <div className="feed-caption">{p.caption}</div>
        <div className="feed-sound">♪ {p.sound}</div>
      </div>

      <div className="progress">
        <div style={{ width: `${s.prog}%` }} />
      </div>
    </div>
  );
}
