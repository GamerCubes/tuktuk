import { C, ME_COLOR, displayName, initialOf, type Comment, type Media, type Post, type Profile } from './data';
import type { Restored } from './storage';

export type Tab = 'feed' | 'fam' | 'rec' | 'post' | 'profil';
export type Sheet = '' | 'comments' | 'share' | 'invite' | 'profile' | 'delete';

export type State = {
  /** true, sobald gespeicherte Inhalte vom Gerät geladen sind */
  loaded: boolean;
  tab: Tab;
  idx: number;
  prog: number;
  paused: boolean;
  liked: Record<string, boolean>;
  saved: Record<string, boolean>;
  sheet: Sheet;
  /** Clip, für den die Lösch-Rückfrage offen ist */
  delId: string;
  comments: Record<string, Comment[]>;
  cDraft: string;
  profile: Profile;
  rec: boolean;
  secs: number;
  maxLen: number;
  lastLen: number;
  /** Zuletzt aufgenommener oder hochgeladener Clip, der gepostet werden kann. */
  media: Media | null;
  draft: string;
  aud: number;
  posted: Post[];
};

export const initialState: State = {
  loaded: false,
  tab: 'feed',
  idx: 0,
  prog: 0,
  paused: false,
  liked: {},
  saved: {},
  sheet: '',
  delId: '',
  comments: {},
  cDraft: '',
  profile: { name: '', family: '' },
  rec: false,
  secs: 0,
  maxLen: 40,
  lastLen: 0,
  media: null,
  draft: '',
  aud: 0,
  posted: [],
};

export type Action =
  | { type: 'tick' }
  | { type: 'hydrate'; data: Restored | null }
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
  | { type: 'setProfile'; profile: Profile }
  | { type: 'toggleRec' }
  | { type: 'setProg'; value: number }
  | { type: 'setMedia'; media: Media }
  | { type: 'upload'; media: Media; secs: number }
  | { type: 'setDraft'; value: string }
  | { type: 'setAud'; value: number }
  | { type: 'publish' }
  | { type: 'askDelete'; id: string }
  | { type: 'deletePost' };

export const TICK_MS = 100;

export function currentPost(s: State): Post | undefined {
  const list = s.posted;
  return list.length ? list[s.idx % list.length] : undefined;
}

export function commentsFor(s: State, id: string): Comment[] {
  return s.comments[id] ?? [];
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
      // Echte Videos treiben den Fortschritt selbst (siehe setProg)
      const p = currentPost(s);
      if (p && !p.video && s.tab === 'feed' && !s.paused && !s.sheet) {
        const n = s.prog + 100 / (p.len * (1000 / TICK_MS));
        return n >= 100 ? reducer(s, { type: 'next' }) : { ...s, prog: n };
      }
      return s;
    }
    case 'hydrate':
      return { ...s, ...(a.data ?? {}), loaded: true };
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
      return { ...s, sheet: a.sheet };
    case 'closeSheet':
      return { ...s, sheet: '' };
    case 'setCDraft':
      return { ...s, cDraft: a.value };
    case 'sendComment': {
      const text = s.cDraft.trim();
      if (!text) return s;
      const c: Comment = { who: displayName(s.profile), i: initialOf(s.profile), c: ME_COLOR, text, l: 0 };
      return { ...s, cDraft: '', comments: { ...s.comments, [a.id]: [c, ...(s.comments[a.id] ?? [])] } };
    }
    case 'setProfile':
      return { ...s, profile: a.profile, sheet: '' };
    case 'toggleRec':
      return s.rec ? stopRec(s, Math.max(1, s.secs)) : { ...s, rec: true, secs: 0, media: null };
    case 'setProg':
      return { ...s, prog: a.value };
    case 'setMedia':
      return { ...s, media: a.media };
    case 'upload':
      return { ...s, media: a.media, lastLen: Math.max(1, Math.round(a.secs)), tab: 'post' };
    case 'setDraft':
      return { ...s, draft: a.value };
    case 'setAud':
      return { ...s, aud: a.value };
    case 'publish': {
      const name = displayName(s.profile);
      const np: Post = {
        id: 'n' + Date.now(), name, ini: initialOf(s.profile), role: 'Du', bg: C.sky, avc: ME_COLOR,
        len: s.lastLen || 10, scene: 'Dein neuer Clip', caption: s.draft || 'Neuer Clip',
        sound: 'Originalton · ' + name, likes: 0, cc: 0, video: s.media?.url,
      };
      return { ...s, posted: [np, ...s.posted], media: null, draft: '', idx: 0, prog: 0, tab: 'feed' };
    }
    case 'askDelete':
      return { ...s, sheet: 'delete', delId: a.id };
    case 'deletePost': {
      // Herzen, Merker und Kommentare des Clips gehen mit
      const id = s.delId;
      const { [id]: _l, ...liked } = s.liked;
      const { [id]: _s, ...saved } = s.saved;
      const { [id]: _c, ...comments } = s.comments;
      return { ...s, posted: s.posted.filter((p) => p.id !== id), liked, saved, comments, sheet: '', delId: '', idx: 0, prog: 0 };
    }
  }
}
