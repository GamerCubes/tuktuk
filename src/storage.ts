// Speichert eigene Inhalte dauerhaft auf diesem Gerät (IndexedDB).
// Videos und Vorschaubilder liegen als Blob in eigenen Stores, der Rest als ein Snapshot.
import type { Comment, Post, Profile } from './data';
import type { State } from './state';

const DB_NAME = 'tuktuk';
// v2 (#13): Store „thumbs“ für JPEG-Vorschaubilder. Bestehende Stores bleiben unverändert;
// Vorschaubilder alter Clips erzeugt die App nach dem Laden nach.
const DB_VERSION = 2;
const KV = 'kv';
const VIDEOS = 'videos';
const THUMBS = 'thumbs';
const SNAPSHOT_KEY = 'snapshot';

/** Post ohne Object-URLs – sie gelten nur bis zum Schließen der App. hasThumb fehlt bei Einträgen vor v2. */
type StoredPost = Omit<Post, 'video' | 'thumb'> & { hasVideo: boolean; hasThumb?: boolean };

export type Snapshot = {
  profile: Profile;
  posted: StoredPost[];
  liked: Record<string, boolean>;
  saved: Record<string, boolean>;
  comments: Record<string, Comment[]>;
};

export type Restored = Pick<State, 'profile' | 'posted' | 'liked' | 'saved' | 'comments'>;

let dbPromise: Promise<IDBDatabase> | null = null;

function db(): Promise<IDBDatabase> {
  dbPromise ??= new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const d = req.result;
      for (const name of [KV, VIDEOS, THUMBS]) if (!d.objectStoreNames.contains(name)) d.createObjectStore(name);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

function run<T>(store: string, mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return db().then(
    (d) =>
      new Promise<T>((resolve, reject) => {
        const req = fn(d.transaction(store, mode).objectStore(store));
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      }),
  );
}

export async function loadState(): Promise<Restored | null> {
  const snap = await run<Snapshot | undefined>(KV, 'readonly', (s) => s.get(SNAPSHOT_KEY));
  if (!snap) return null;
  const posted = await Promise.all(
    snap.posted.map(async ({ hasVideo, hasThumb, ...p }): Promise<Post> => {
      const post: Post = { ...p };
      if (hasVideo) {
        const blob = await run<Blob | undefined>(VIDEOS, 'readonly', (s) => s.get(p.id));
        if (blob) post.video = URL.createObjectURL(blob);
      }
      if (hasThumb) {
        const blob = await run<Blob | undefined>(THUMBS, 'readonly', (s) => s.get(p.id));
        if (blob) post.thumb = URL.createObjectURL(blob);
      }
      return post;
    }),
  );
  return { profile: snap.profile, posted, liked: snap.liked, saved: snap.saved, comments: snap.comments };
}

/** Gespeicherte Videos und Vorschaubilder: Clip-ID → Object-URL */
const storedVideos = new Map<string, string>();
const storedThumbs = new Map<string, string>();

export async function saveState(s: State): Promise<void> {
  // Neue Videos einmalig als Blob ablegen (die Object-URL lässt sich direkt wieder einlesen)
  for (const p of s.posted) {
    if (!p.video || storedVideos.has(p.id)) continue;
    const blob = await fetch(p.video).then((r) => r.blob());
    await run(VIDEOS, 'readwrite', (st) => st.put(blob, p.id));
    storedVideos.set(p.id, p.video);
  }
  for (const p of s.posted) {
    if (!p.thumb || storedThumbs.has(p.id)) continue;
    const blob = await fetch(p.thumb).then((r) => r.blob());
    await run(THUMBS, 'readwrite', (st) => st.put(blob, p.id));
    storedThumbs.set(p.id, p.thumb);
  }
  const snap: Snapshot = {
    profile: s.profile,
    posted: s.posted.map(({ video, thumb, ...p }) => ({ ...p, hasVideo: !!video, hasThumb: !!thumb })),
    liked: s.liked,
    saved: s.saved,
    comments: s.comments,
  };
  await run(KV, 'readwrite', (st) => st.put(snap, SNAPSHOT_KEY));

  // Videos und Vorschaubilder gelöschter Clips erst entfernen, wenn der Snapshot ohne sie gespeichert ist
  const ids = new Set(s.posted.map((p) => p.id));
  for (const [store, stored] of [[VIDEOS, storedVideos], [THUMBS, storedThumbs]] as const) {
    for (const [id, url] of stored) {
      if (ids.has(id)) continue;
      await run(store, 'readwrite', (st) => st.delete(id));
      stored.delete(id);
      URL.revokeObjectURL(url);
    }
  }
}

export function markVideosStored(posts: Post[]) {
  for (const p of posts) {
    if (p.video) storedVideos.set(p.id, p.video);
    if (p.thumb) storedThumbs.set(p.id, p.thumb);
  }
}

/** Bittet den Browser, die Daten nicht bei Speicherknappheit zu löschen. */
export function requestPersistence() {
  navigator.storage?.persist?.().catch(() => {});
}
