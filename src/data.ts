export type Post = {
  id: string;
  name: string;
  ini: string;
  role: string;
  bg: string;
  avc: string;
  len: number;
  scene: string;
  caption: string;
  sound: string;
  likes: number;
  cc: number;
  /** Object-URL eines echten Clips (nur lokal auf diesem Gerät). */
  video?: string;
  /** Object-URL des JPEG-Vorschaubilds; leerer String = Erzeugen fehlgeschlagen */
  thumb?: string;
};

export type Media = { url: string; mime: string };

export type Comment = { who: string; i: string; c: string; text: string; l: number };

export type Profile = { name: string; family: string };

/** Grundfarben für Inline-Styles – die Werte selbst stehen nur in styles.css (:root, #17). */
export const C = {
  blue: 'var(--blue)',
  orange: 'var(--orange)',
  ink: 'var(--ink)',
  cream: 'var(--cream)',
  sky: 'var(--sky)',
  gray: 'var(--gray)',
  red: 'var(--red)',
} as const;

export const ME_COLOR = C.orange;

export const AUDIENCES: [label: string, sub: string][] = [
  ['Ganze Familie', 'alle Mitglieder'],
  ['Nur Kernfamilie', 'Eltern & Geschwister'],
  ['Ausgewählte', 'du wählst'],
];

export const displayName = (p: Profile) => p.name.trim() || 'Du';
export const initialOf = (p: Profile) => (p.name.trim()[0] ?? '?').toUpperCase();
export const familyTitle = (p: Profile) => (p.family.trim() ? `Familie ${p.family.trim()}` : 'Meine Familie');
