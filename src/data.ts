export type Post = {
  id: string;
  fam: boolean;
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
};

export type Comment = { who: string; i: string; c: string; text: string; l: number };

export type Member = { n: string; i: string; c: string; dot?: string; ring?: string };

export const C = {
  blue: '#1A1AA7',
  orange: '#FFA142',
  ink: '#181819',
  cream: '#F7F3E6',
  sky: '#B1D5F0',
  gray: '#5E6064',
  red: '#c2261b',
} as const;

export const PALETTE = [C.blue, C.orange, C.gray, C.sky];

export const POSTS: Post[] = [
  { id: 'a', fam: true, name: 'Oma Hilde', ini: 'H', role: 'Oma', bg: C.blue, avc: C.sky, len: 32, scene: 'Kuchen backen', caption: 'Zimtschnecken wie früher – wer kommt Sonntag vorbei?', sound: 'Originalton · Oma Hilde', likes: 12, cc: 4 },
  { id: 'b', fam: true, name: 'Ben', ini: 'B', role: 'Bruder', bg: C.gray, avc: C.orange, len: 18, scene: 'Skateboard-Trick', caption: 'Endlich geschafft!! Papa, schau hin 🛹', sound: 'Sommer-Beat', likes: 9, cc: 3 },
  { id: 'c', fam: false, name: 'Tante Lena', ini: 'L', role: 'Tante', bg: C.sky, avc: C.orange, len: 40, scene: 'Urlaub Italien', caption: 'Der Sonnenuntergang hat sich gelohnt.', sound: 'Dolce Vita', likes: 14, cc: 6 },
  { id: 'd', fam: false, name: 'Opa Karl', ini: 'K', role: 'Opa', bg: C.orange, avc: C.sky, len: 25, scene: 'Garten', caption: 'Die Tomaten sind größer als mein Kopf.', sound: 'Originalton · Opa Karl', likes: 17, cc: 8 },
];

export const BASE_COMMENTS: Comment[] = [
  { who: 'Oma Hilde', i: 'H', c: C.sky, text: 'Wunderbar, mein Schatz!', l: 3 },
  { who: 'Papa', i: 'P', c: C.orange, text: 'Das muss ich Mama zeigen 😂', l: 2 },
  { who: 'Ben', i: 'B', c: C.sky, text: 'Erster!', l: 1 },
];

/** Generationen des Familienbaums, oben die Großeltern. */
export const FAMILY_TREE: Member[][] = [
  [
    { n: 'Oma Hilde', i: 'H', c: C.sky, dot: C.orange, ring: C.orange },
    { n: 'Opa Karl', i: 'K', c: C.orange, dot: C.red, ring: C.red },
  ],
  [
    { n: 'Papa', i: 'P', c: C.sky, dot: C.gray },
    { n: 'Mama', i: 'M', c: C.orange, dot: C.gray },
    { n: 'Tante Lena', i: 'L', c: C.sky, dot: C.gray },
  ],
  [
    { n: 'Mia', i: 'M', c: C.orange, dot: C.gray },
    { n: 'Ben', i: 'B', c: C.sky, dot: C.gray },
    { n: 'Cousin Leo', i: 'L', c: C.orange, dot: C.gray },
  ],
];

export const SHARE_PEOPLE: [name: string, initial: string][] = [
  ['Oma', 'H'], ['Opa', 'K'], ['Papa', 'P'], ['Mama', 'M'], ['Tante', 'L'], ['Ben', 'B'],
];

export const AUDIENCES: [label: string, sub: string][] = [
  ['Ganze Familie', 'alle 9 Mitglieder'],
  ['Nur Kernfamilie', 'Eltern & Geschwister'],
  ['Ausgewählte', 'du wählst'],
];

export const ME = { name: 'Mia', ini: 'M', color: C.orange };

export const INVITE_LINK = 'tuktuk.app/join/BERGER-7K4Q';
