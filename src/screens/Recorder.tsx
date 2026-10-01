import type { ScreenProps } from '../types';

const TOOLS: [icon: string, label: string][] = [['⟲', 'Drehen'], ['◐', 'Filter'], ['⏱', 'Timer'], ['✦', 'Effekte']];

export default function Recorder({ s, dispatch }: ScreenProps) {
  const pct = (s.secs / s.maxLen) * 100;
  const size = s.rec ? 30 : 58;
  const radius = s.rec ? 7 : 29;

  return (
    <div className="screen" style={{ background: 'var(--ink)' }}>
      <div className="fill stripes-faint" />
      <div className="camera-label">[ Kamera-Vorschau ]</div>

      <div className="rec-top">
        <button className="plain rec-close" onClick={() => dispatch({ type: 'go', tab: 'feed' })} aria-label="Schließen">✕</button>
        <div className="glass-pill">♪ Sound wählen</div>
        <div style={{ width: 40 }} />
      </div>

      <div className="rec-bar"><div style={{ width: `${pct}%` }} /></div>
      <div className="rec-time">
        0:{String(Math.floor(s.secs)).padStart(2, '0')} <span style={{ opacity: 0.7 }}>/ 0:{s.maxLen} max.</span>
      </div>

      <div className="rec-tools">
        {TOOLS.map(([icon, label]) => (
          <div key={label}>{icon}<br />{label}</div>
        ))}
      </div>

      <div className="rec-controls">
        <div className="rec-gallery" />
        <button className="rec-button" onClick={() => dispatch({ type: 'toggleRec' })} aria-label={s.rec ? 'Aufnahme stoppen' : 'Aufnahme starten'}>
          <div style={{ width: size, height: size, borderRadius: radius }} />
        </button>
        <button className="plain rec-upload" onClick={() => dispatch({ type: 'upload' })}>⬆<br />Upload</button>
      </div>
    </div>
  );
}
