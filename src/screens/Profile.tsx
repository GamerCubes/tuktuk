import { useEffect, useRef } from 'react';
import { C, ME_COLOR, displayName, familyTitle, initialOf } from '../data';
import type { ScreenProps } from '../types';
import Avatar from '../components/Avatar';

const HOLD_MS = 500;

export default function Profile({ s, dispatch }: ScreenProps) {
  const hearts = s.posted.filter((p) => s.liked[p.id]).length + s.posted.reduce((n, p) => n + p.likes, 0);

  // Gedrückthalten eines Clips öffnet die Lösch-Rückfrage; Loslassen oder Scrollen bricht ab.
  // Kurzes Antippen öffnet den Clip im Feed – aber nicht, wenn gerade gehalten wurde.
  const hold = useRef<number>(undefined);
  const held = useRef(false);
  const cancelHold = () => clearTimeout(hold.current);
  useEffect(() => cancelHold, []);
  const startHold = (id: string) => {
    cancelHold();
    held.current = false;
    hold.current = window.setTimeout(() => {
      held.current = true;
      navigator.vibrate?.(15);
      dispatch({ type: 'askDelete', id });
    }, HOLD_MS);
  };
  const tap = (id: string) => {
    if (held.current) return;
    dispatch({ type: 'openClip', id });
  };

  return (
    <div className="screen light scroll" style={{ paddingLeft: 18, paddingRight: 18 }}>
      <div className="profile-head">
        <Avatar initial={initialOf(s.profile)} color={ME_COLOR} size={92} ring={C.blue} />
        <h1 className="display" style={{ fontSize: 24, marginTop: 10 }}>{displayName(s.profile)}</h1>
        <div className="muted" style={{ fontSize: 13 }}>{familyTitle(s.profile)}</div>
      </div>

      <div className="stats">
        <div><b>1</b><div>Familie</div></div>
        <div><b>{s.posted.length}</b><div>Clips</div></div>
        <div><b>{hearts}</b><div>Herzen</div></div>
      </div>

      <div className="profile-buttons">
        <button className="pill pill-orange" onClick={() => dispatch({ type: 'openSheet', sheet: 'profile' })}>Profil bearbeiten</button>
        <button className="pill pill-outline" onClick={() => dispatch({ type: 'openSheet', sheet: 'invite' })}>Einladen</button>
      </div>

      <div className="profile-tabs">
        <div className="active">Clips</div>
        <div>Gemerkt</div>
        <div>Geliked</div>
      </div>

      {s.posted.length === 0 ? (
        <div className="empty-hint" style={{ marginBottom: 100 }}>
          Du hast noch keine Clips.
          <br />
          <button className="pill pill-orange pill-sm" onClick={() => dispatch({ type: 'go', tab: 'rec' })}>Clip aufnehmen</button>
        </div>
      ) : (
        <div className="clip-grid">
          {s.posted.map((p) => (
            <div
              key={p.id}
              className={'clip' + (p.thumb ? '' : ' clip-stripes')}
              style={{ background: C.blue }}
              onPointerDown={() => startHold(p.id)}
              onPointerUp={cancelHold}
              onPointerLeave={cancelHold}
              onPointerCancel={cancelHold}
              onClick={() => tap(p.id)}
              onContextMenu={(e) => e.preventDefault()}
            >
              {/* Nur ein kleines Bild statt des ganzen Videos – sonst stürzen ältere Geräte ab (#13) */}
              {p.thumb && <img src={p.thumb} alt="" draggable={false} />}
              <span>▶ {p.likes + (s.liked[p.id] ? 1 : 0)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
