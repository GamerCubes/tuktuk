import { useEffect, useRef, useState } from 'react';
import { RECORD_BITS_PER_SECOND, pickRecorderMime, useCamera, videoDuration, type Facing } from '../media';
import type { ScreenProps } from '../types';

const STATIC_TOOLS: [icon: string, label: string][] = [['◐', 'Filter'], ['⏱', 'Timer'], ['✦', 'Effekte']];

export default function Recorder({ s, dispatch }: ScreenProps) {
  const [facing, setFacing] = useState<Facing>('user');
  const [notice, setNotice] = useState('');
  const { stream, error } = useCamera(facing);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const recorder = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = stream;
  }, [stream]);

  // MediaRecorder folgt s.rec – das 40-Sekunden-Limit setzt weiterhin der Reducer durch
  useEffect(() => {
    if (s.rec && stream && !recorder.current) {
      const mime = pickRecorderMime();
      const chunks: Blob[] = [];
      const r = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: RECORD_BITS_PER_SECOND });
      r.ondataavailable = (e) => e.data.size && chunks.push(e.data);
      r.onstop = () => {
        const type = r.mimeType || mime || 'video/webm';
        const url = URL.createObjectURL(new Blob(chunks, { type }));
        dispatch({ type: 'setMedia', media: { url, mime: type } });
      };
      r.start(250);
      recorder.current = r;
    } else if (!s.rec && recorder.current) {
      if (recorder.current.state !== 'inactive') recorder.current.stop();
      recorder.current = null;
    }
  }, [s.rec, stream, dispatch]);

  // Endet die Aufnahme durch das Zeitlimit, wechselt der Screen sofort – dann hier sauber abschließen
  useEffect(() => () => {
    const r = recorder.current;
    if (r && r.state !== 'inactive') r.stop();
  }, []);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const url = URL.createObjectURL(file);
    const secs = await videoDuration(url);
    if (secs > s.maxLen + 0.5) {
      URL.revokeObjectURL(url);
      setNotice(`Der Clip ist ${Math.round(secs)} s lang – erlaubt sind höchstens ${s.maxLen} s.`);
      return;
    }
    dispatch({ type: 'upload', media: { url, mime: file.type || 'video/mp4' }, secs: secs || 1 });
  };

  const pct = (s.secs / s.maxLen) * 100;
  const size = s.rec ? 30 : 58;
  const radius = s.rec ? 7 : 29;
  const message = notice || error;

  return (
    <div className="screen" style={{ background: 'var(--ink)' }}>
      {stream ? (
        <video
          ref={videoRef}
          className={'camera' + (facing === 'user' ? ' mirrored' : '')}
          autoPlay
          playsInline
          muted
        />
      ) : (
        <>
          <div className="fill stripes-faint" />
          <div className="camera-label">[ Kamera-Vorschau ]</div>
        </>
      )}
      {message && <div className="camera-notice" role="status">{message}</div>}

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
        <button
          className="plain"
          disabled={s.rec || !stream}
          onClick={() => setFacing((f) => (f === 'user' ? 'environment' : 'user'))}
          aria-label="Kamera wechseln"
        >
          ⟲<br />Drehen
        </button>
        {STATIC_TOOLS.map(([icon, label]) => (
          <div key={label}>{icon}<br />{label}</div>
        ))}
      </div>

      <input ref={fileRef} type="file" accept="video/*" hidden onChange={onFile} />
      <div className="rec-controls">
        <button className="plain rec-gallery" onClick={() => fileRef.current?.click()} disabled={s.rec} aria-label="Video aus Galerie wählen" />
        <button className="rec-button" onClick={() => { setNotice(''); dispatch({ type: 'toggleRec' }); }} aria-label={s.rec ? 'Aufnahme stoppen' : 'Aufnahme starten'}>
          <div style={{ width: size, height: size, borderRadius: radius }} />
        </button>
        <button className="plain rec-upload" onClick={() => fileRef.current?.click()} disabled={s.rec}>⬆<br />Upload</button>
      </div>
    </div>
  );
}
