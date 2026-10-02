import { C, ME } from '../data';
import type { ScreenProps } from '../types';
import Avatar from '../components/Avatar';

type Clip = { bg: string; v: number; video?: string };

const SAMPLE_CLIPS: Clip[] = [
  { bg: C.blue, v: 21 },
  { bg: C.orange, v: 14 },
  { bg: C.gray, v: 8 },
];

export default function Profile({ s, dispatch }: ScreenProps) {
  const grid: Clip[] = [...s.posted.map((p) => ({ bg: C.blue, v: 0, video: p.video })), ...SAMPLE_CLIPS];

  return (
    <div className="screen light scroll" style={{ paddingLeft: 18, paddingRight: 18 }}>
      <div className="profile-head">
        <Avatar initial={ME.ini} color={ME.color} size={92} ring={C.blue} />
        <h1 className="display" style={{ fontSize: 24, marginTop: 10 }}>{ME.name}</h1>
        <div className="muted" style={{ fontSize: 13 }}>Enkelin · Familie Berger</div>
      </div>

      <div className="stats">
        <div><b>9</b><div>Familie</div></div>
        <div><b>{SAMPLE_CLIPS.length + s.posted.length}</b><div>Clips</div></div>
        <div><b>214</b><div>Herzen</div></div>
      </div>

      <div className="profile-buttons">
        <button className="pill pill-orange">Profil bearbeiten</button>
        <button className="pill pill-outline" onClick={() => dispatch({ type: 'openSheet', sheet: 'invite' })}>Einladen</button>
      </div>

      <div className="profile-tabs">
        <div className="active">Clips</div>
        <div>Gemerkt</div>
        <div>Geliked</div>
      </div>

      <div className="clip-grid">
        {grid.map((c, k) => (
          <div key={k} className={'clip' + (c.video ? '' : ' clip-stripes')} style={{ background: c.bg }}>
            {/* #t=0.1 lässt iOS ein Standbild als Vorschau zeigen */}
            {c.video && <video src={c.video + '#t=0.1'} muted playsInline preload="metadata" />}
            <span>▶ {c.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
