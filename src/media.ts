import { useEffect, useState } from 'react';

export type Facing = 'user' | 'environment';

// Safari nimmt MP4 auf, Chrome/Firefox meist WebM – die erste unterstützte Variante gewinnt
const MIME_CANDIDATES = [
  'video/mp4;codecs=avc1,mp4a',
  'video/mp4',
  'video/webm;codecs=vp9,opus',
  'video/webm;codecs=vp8,opus',
  'video/webm',
];

export function pickRecorderMime(): string | undefined {
  if (typeof MediaRecorder === 'undefined') return undefined;
  return MIME_CANDIDATES.find((m) => MediaRecorder.isTypeSupported(m));
}

export function canRecord(): boolean {
  return !!navigator.mediaDevices?.getUserMedia && typeof MediaRecorder !== 'undefined';
}

function cameraErrorText(err: unknown): string {
  const name = err instanceof DOMException ? err.name : '';
  if (name === 'NotAllowedError') return 'Kein Kamerazugriff – bitte in den Browser-Einstellungen erlauben.';
  if (name === 'NotFoundError' || name === 'OverconstrainedError') return 'Keine Kamera gefunden.';
  if (name === 'NotReadableError') return 'Die Kamera wird gerade von einer anderen App benutzt.';
  return 'Kamera konnte nicht gestartet werden.';
}

/** Setzt einen vom Gerät gemerkten Kamera-Zoom auf den kleinsten Wert (voller Bildausschnitt). */
function resetZoom(ms: MediaStream) {
  const track = ms.getVideoTracks()[0];
  // zoom fehlt noch in den TS-DOM-Typen, wird aber von Chrome auf Android unterstützt
  const zoom = (track?.getCapabilities?.() as { zoom?: { min: number } } | undefined)?.zoom;
  if (!zoom) return;
  track.applyConstraints({ advanced: [{ zoom: zoom.min } as MediaTrackConstraintSet] }).catch(() => {});
}

/** Öffnet Kamera und Mikrofon und gibt sie beim Verlassen oder Kamerawechsel wieder frei. */
export function useCamera(facing: Facing) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!canRecord()) {
      setError('Dieser Browser kann keine Videos aufnehmen.');
      return;
    }
    let active = true;
    let opened: MediaStream | null = null;
    navigator.mediaDevices
      .getUserMedia({
        // Maße in Sensor-Ausrichtung (quer) anfragen: Ein Hochformat-Wunsch zwingt den Browser,
        // einen schmalen Streifen aus dem Sensorbild zu schneiden – das wirkt wie starker Zoom.
        // Gedreht wird das Bild auf dem Handy trotzdem automatisch.
        video: { facingMode: facing, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: true,
      })
      .then((ms) => {
        if (!active) return ms.getTracks().forEach((t) => t.stop());
        resetZoom(ms);
        opened = ms;
        setStream(ms);
        setError('');
      })
      .catch((err) => active && setError(cameraErrorText(err)));
    return () => {
      active = false;
      opened?.getTracks().forEach((t) => t.stop());
      setStream(null);
    };
  }, [facing]);

  return { stream, error };
}

/** Liest die Länge einer Videodatei in Sekunden. */
export function videoDuration(url: string): Promise<number> {
  return new Promise((resolve) => {
    const v = document.createElement('video');
    v.preload = 'metadata';
    v.onloadedmetadata = () => resolve(Number.isFinite(v.duration) ? v.duration : 0);
    v.onerror = () => resolve(0);
    v.src = url;
  });
}
