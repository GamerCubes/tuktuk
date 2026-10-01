import { BASE_COMMENTS, C, ME, POSTS, type Comment, type Post } from './data';

export type Tab = 'feed' | 'fam' | 'rec' | 'post' | 'profil';
export type Sheet = '' | 'comments' | 'share' | 'invite';

export type State = {
  tab: Tab;
  idx: number;
  prog: number;
  paused: boolean;
  liked: Record<string, boolean>;
  saved: Record<string, boolean>;
  sheet: Sheet;
  comments: Record<string, Comment[]>;
  cDraft: string;
  shared: Record<string, boolean>;
  copied: boolean;
  rec: boolean;
  secs: number;
  maxLen: number;
  lastLen: number;
  draft: string;
  aud: number;
  posted: Post[];
};

export const initialState: State = {
  tab: 'feed',
  idx: 0,
  prog: 0,
  paused: false,
  liked: {},
  saved: {},
  sheet: '',
  comments: {},
  cDraft: '',
  shared: {},
  copied: false,
  rec: false,
  secs: 0,
  maxLen: 40,
  lastLen: 0,
  draft: '',
  aud: 0,
  posted: [],
};

export type Action =
  | { type: 'tick' }
  | { type: 'go'; tab: Tab }
  | { type: 'next' }
  | { type: 'prev' }
  | { type: 'togglePause' }
  | { type: 'toggleLike'; id: string }
  | { type: 'toggleSave'; id: string }
  | { type: 'openSheet'; sheet: Exclude<Sheet, ''> }
  | { type: 'closeSheet' }
  | { type: 'setCDraft'; value: string }
  | { type: 'sendComment'; id: string }
  | { type: 'toggleShare'; name: string }
  | { type: 'copyInvite' }
  | { type: 'toggleRec' }
  | { type: 'upload' }
  | { type: 'setDraft'; value: string }
  | { type: 'setAud'; value: number }
  | { type: 'publish' };

export const TICK_MS = 100;

export function feedList(s: State): Post[] {
  return [...s.posted, ...POSTS];
}

export function currentPost(s: State): Post {
  const list = feedList(s);
  return list[s.idx % list.length];
}

export function commentsFor(s: State, id: string): Comment[] {
  return [...(s.comments[id] ?? []), ...BASE_COMMENTS];
}

export function commentCount(s: State, p: Post): number {
  return p.cc + (s.comments[p.id]?.length ?? 0);
}

const stopRec = (s: State, secs: number): State => ({
  ...s, rec: false, lastLen: Math.round(secs), secs: 0, tab: 'post',
});

const toggle = (m: Record<string, boolean>, k: string) => ({ ...m, [k]: !m[k] });

export function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'tick': {
      if (s.rec) {
        const n = s.secs + TICK_MS / 1000;
        return n >= s.maxLen ? stopRec(s, s.maxLen) : { ...s, secs: n };
      }
      if (s.tab === 'feed' && !s.paused && !s.sheet) {
        const n = s.prog + 100 / (currentPost(s).len * (1000 / TICK_MS));
        return n >= 100 ? reducer(s, { type: 'next' }) : { ...s, prog: n };
      }
      return s;
    }
    case 'go':
      return { ...s, tab: a.tab, sheet: '', paused: false, rec: false, secs: 0, prog: a.tab === 'feed' ? s.prog : 0 };
    case 'next':
      return { ...s, idx: s.idx + 1, prog: 0, paused: false };
    case 'prev':
      return { ...s, idx: Math.max(0, s.idx - 1), prog: 0, paused: false };
    case 'togglePause':
      return { ...s, paused: !s.paused };
    case 'toggleLike':
      return { ...s, liked: toggle(s.liked, a.id) };
    case 'toggleSave':
      return { ...s, saved: toggle(s.saved, a.id) };
    case 'openSheet':
      return { ...s, sheet: a.sheet, copied: a.sheet === 'invite' ? false : s.copied };
    case 'closeSheet':
      return { ...s, sheet: '' };
    case 'setCDraft':
      return { ...s, cDraft: a.value };
    case 'sendComment': {
      const text = s.cDraft.trim();
      if (!text) return s;
      const c: Comment = { who: ME.name, i: ME.ini, c: ME.color, text, l: 0 };
      return { ...s, cDraft: '', comments: { ...s.comments, [a.id]: [c, ...(s.comments[a.id] ?? [])] } };
    }
    case 'toggleShare':
      return { ...s, shared: toggle(s.shared, a.name) };
    case 'copyInvite':
      return { ...s, copied: true };
    case 'toggleRec':
      return s.rec ? stopRec(s, Math.max(1, s.secs)) : { ...s, rec: true, secs: 0 };
    case 'upload':
      return { ...s, lastLen: 27, tab: 'post' };
    case 'setDraft':
      return { ...s, draft: a.value };
    case 'setAud':
      return { ...s, aud: a.value };
    case 'publish': {
      const np: Post = {
        id: 'n' + Date.now(), fam: true, name: ME.name, ini: ME.ini, role: 'Du', bg: C.sky, avc: ME.color,
        len: s.lastLen || 10, scene: 'Dein neuer Clip', caption: s.draft || 'Neuer Clip',
        sound: 'Originalton · ' + ME.name, likes: 0, cc: 0,
      };
      return { ...s, posted: [np, ...s.posted], draft: '', idx: 0, prog: 0, tab: 'feed' };
    }
  }
}
