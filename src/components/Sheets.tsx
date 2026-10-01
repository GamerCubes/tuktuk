import { C, INVITE_LINK, PALETTE, SHARE_PEOPLE } from '../data';
import { commentCount, commentsFor, currentPost } from '../state';
import type { ScreenProps } from '../types';
import Avatar from './Avatar';

export function CommentsSheet({ s, dispatch }: ScreenProps) {
  const p = currentPost(s);
  const send = () => dispatch({ type: 'sendComment', id: p.id });
  const n = commentCount(s, p);

  return (
    <div className="sheet sheet-comments" role="dialog" aria-label="Kommentare">
      <div className="sheet-head">
        {n} {n === 1 ? 'Kommentar' : 'Kommentare'}
        <button className="plain sheet-close" onClick={() => dispatch({ type: 'closeSheet' })} aria-label="Schließen">✕</button>
      </div>
      <div className="comment-list">
        {commentsFor(s, p.id).map((c, k) => (
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

export function ShareSheet({ s, dispatch }: ScreenProps) {
  const n = Object.values(s.shared).filter(Boolean).length;
  const close = () => dispatch({ type: 'closeSheet' });

  return (
    <div className="sheet" role="dialog" aria-label="Teilen">
      <h2 className="display" style={{ fontSize: 20 }}>Teilen – nur in der Familie</h2>
      <div className="share-people">
        {SHARE_PEOPLE.map(([name, ini], k) => (
          <button
            key={name}
            className="plain share-person"
            aria-pressed={!!s.shared[name]}
            onClick={() => dispatch({ type: 'toggleShare', name })}
          >
            <Avatar initial={ini} color={PALETTE[k % 4]} ring={s.shared[name] ? C.orange : C.cream} style={{ margin: '0 auto' }} />
            <div>{name}</div>
          </button>
        ))}
      </div>
      <button className="pill pill-orange pill-block" style={{ marginTop: 18 }} onClick={close}>
        {n ? `Senden an ${n}` : 'Schließen'}
      </button>
      <div className="muted center" style={{ marginTop: 10, fontSize: 12 }}>Kein Teilen nach außen möglich.</div>
    </div>
  );
}

export function InviteSheet({ s, dispatch }: ScreenProps) {
  const copy = () => {
    navigator.clipboard?.writeText('https://' + INVITE_LINK).catch(() => {});
    dispatch({ type: 'copyInvite' });
  };

  return (
    <div className="sheet center" role="dialog" aria-label="Familie einladen">
      <h2 className="display" style={{ fontSize: 22 }}>Familie einladen</h2>
      <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>Der Link ist 48 Stunden gültig und nur einmal nutzbar.</div>
      <div className="qr">[ QR-Code ]</div>
      <div className="invite-link">{INVITE_LINK}</div>
      <button className="pill pill-orange pill-block" style={{ marginTop: 14 }} onClick={copy}>
        {s.copied ? 'Kopiert ✓' : 'Link kopieren'}
      </button>
      <button className="plain sheet-text-btn" onClick={() => dispatch({ type: 'closeSheet' })}>Schließen</button>
    </div>
  );
}
