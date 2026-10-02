// Speichert eigene Inhalte dauerhaft auf diesem Gerät (IndexedDB).
// Videos liegen als Blob in einem eigenen Store, der Rest als ein Snapshot.
import type { Comment, Post, Profile } from './data';
import type { State } from './state';

const DB_NAME = 'tuktuk';
const DB_VERSION = 1;
const KV = 'kv';
const VIDEOS = 'videos';
const SNAPSHOT_KEY = 'snapshot';

/** Post ohne Object-URL – die URL gilt nur bis zum Schließen der App. */
type StoredPost = Omit<Post, 'video'> & { hasVideo: boolean };

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
      req.result.createObjectStore(KV);
      req.result.createObjectStore(VIDEOS);
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
    snap.posted.map(async ({ hasVideo, ...p }): Promise<Post> => {
      if (!hasVideo) return p;
      const blob = await run<Blob | undefined>(VIDEOS, 'readonly', (s) => s.get(p.id));
      return blob ? { ...p, video: URL.createObjectURL(blob) } : p;
    }),
  );
  return { profile: snap.profile, posted, liked: snap.liked, saved: snap.saved, comments: snap.comments };
}

const storedVideos = new Set<string>();

export async function saveState(s: State): Promise<void> {
  // Neue Videos einmalig als Blob ablegen (die Object-URL lässt sich direkt wieder einlesen)
  for (const p of s.posted) {
    if (!p.video || storedVideos.has(p.id)) continue;
    const blob = await fetch(p.video).then((r) => r.blob());
    await run(VIDEOS, 'readwrite', (st) => st.put(blob, p.id));
    storedVideos.add(p.id);
  }
  const snap: Snapshot = {
    profile: s.profile,
    posted: s.posted.map(({ video, ...p }) => ({ ...p, hasVideo: !!video })),
    liked: s.liked,
    saved: s.saved,
    comments: s.comments,
  };
  await run(KV, 'readwrite', (st) => st.put(snap, SNAPSHOT_KEY));
}

export function markVideosStored(posts: Post[]) {
  for (const p of posts) if (p.video) storedVideos.add(p.id);
}

/** Bittet den Browser, die Daten nicht bei Speicherknappheit zu löschen. */
export function requestPersistence() {
  navigator.storage?.persist?.().catch(() => {});
}
