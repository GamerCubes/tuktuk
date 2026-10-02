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
};

export type Media = { url: string; mime: string };

export type Comment = { who: string; i: string; c: string; text: string; l: number };

export type Profile = { name: string; family: string };

export const C = {
  blue: '#1A1AA7',
  orange: '#FFA142',
  ink: '#181819',
  cream: '#F7F3E6',
  sky: '#B1D5F0',
  gray: '#5E6064',
  red: '#c2261b',
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
