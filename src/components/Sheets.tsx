import { useState } from 'react';
import { commentCount, commentsFor, currentPost } from '../state';
import type { ScreenProps } from '../types';
import Avatar from './Avatar';

export function CommentsSheet({ s, dispatch }: ScreenProps) {
  const p = currentPost(s);
  if (!p) return null;
  const send = () => dispatch({ type: 'sendComment', id: p.id });
  const n = commentCount(s, p);
  const list = commentsFor(s, p.id);

  return (
    <div className="sheet sheet-comments" role="dialog" aria-label="Kommentare">
      <div className="sheet-head">
        {n} {n === 1 ? 'Kommentar' : 'Kommentare'}
        <button className="plain sheet-close" onClick={() => dispatch({ type: 'closeSheet' })} aria-label="Schließen">✕</button>
      </div>
      <div className="comment-list">
        {list.length === 0 && <div className="muted center" style={{ marginTop: 40, fontSize: 14 }}>Noch keine Kommentare – schreib den ersten.</div>}
        {list.map((c, k) => (
          <div className="comment" key={k}>
            <Avatar initial={c.i} color={c.c} size={34} style={{ flex: 'none', fontSize: 14 }} />
            <div className="comment-body">
              <span className="comment-who">{c.who}</span>
              <div>{c.text}</div>
            </div>
            <div className="comment-likes">♡<br />{c.l}</div>
          </div>
        ))}
      </div>
      <form className="comment-form" onSubmit={(e) => { e.preventDefault(); send(); }}>
        <input
          value={s.cDraft}
          onChange={(e) => dispatch({ type: 'setCDraft', value: e.target.value })}
          placeholder="Kommentar hinzufügen …"
          autoFocus
        />
        <button type="submit" className="pill pill-orange">Senden</button>
      </form>
    </div>
  );
}

export function ShareSheet({ dispatch }: ScreenProps) {
  return (
    <div className="sheet" role="dialog" aria-label="Teilen">
      <h2 className="display" style={{ fontSize: 20 }}>Teilen – nur in der Familie</h2>
      <div className="muted" style={{ marginTop: 12, fontSize: 14, lineHeight: 1.45 }}>
        Noch ist niemand aus deiner Familie dabei. Lade zuerst jemanden ein, dann kannst du Clips gezielt an einzelne Personen senden.
      </div>
      <button className="pill pill-orange pill-block" style={{ marginTop: 18 }} onClick={() => dispatch({ type: 'openSheet', sheet: 'invite' })}>
        Familie einladen
      </button>
      <button className="plain sheet-text-btn" onClick={() => dispatch({ type: 'closeSheet' })}>Schließen</button>
    </div>
  );
}

export function InviteSheet({ dispatch }: ScreenProps) {
  return (
    <div className="sheet center" role="dialog" aria-label="Familie einladen">
      <h2 className="display" style={{ fontSize: 22 }}>Familie einladen</h2>
      <div className="qr">[ QR-Code ]</div>
      <div className="muted" style={{ fontSize: 14, lineHeight: 1.45 }}>
        Einladungslinks funktionieren, sobald die App mit einem Server verbunden ist. Bis dahin bleiben deine Clips auf diesem Gerät.
      </div>
      <button className="plain sheet-text-btn" onClick={() => dispatch({ type: 'closeSheet' })}>Schließen</button>
    </div>
  );
}

export function ProfileSheet({ s, dispatch }: ScreenProps) {
  const [name, setName] = useState(s.profile.name);
  const [family, setFamily] = useState(s.profile.family);

  return (
    <form
      className="sheet"
      role="dialog"
      aria-label="Profil bearbeiten"
      onSubmit={(e) => { e.preventDefault(); dispatch({ type: 'setProfile', profile: { name: name.trim(), family: family.trim() } }); }}
    >
      <h2 className="display" style={{ fontSize: 22 }}>Profil bearbeiten</h2>
      <label className="field">
        <span>Dein Name</span>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="z. B. Mia" maxLength={30} autoFocus />
      </label>
      <label className="field">
        <span>Familienname</span>
        <input value={family} onChange={(e) => setFamily(e.target.value)} placeholder="z. B. Berger" maxLength={30} />
      </label>
      <button type="submit" className="pill pill-orange pill-block" style={{ marginTop: 18 }}>Speichern</button>
      <button type="button" className="plain sheet-text-btn" onClick={() => dispatch({ type: 'closeSheet' })}>Abbrechen</button>
    </form>
  );
}
