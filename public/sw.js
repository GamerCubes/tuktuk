// Kleiner Service Worker: macht die App installierbar und startet sie auch offline.
// Seiten kommen bevorzugt frisch aus dem Netz (neue Deploys sofort sichtbar),
// Assets haben gehashte Dateinamen und dürfen aus dem Cache kommen.
const CACHE = 'tuktuk-v1';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

const store = (req, res) => {
  if (res.ok) {
    const copy = res.clone();
    caches.open(CACHE).then((c) => c.put(req, copy));
  }
  return res;
};

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).then((res) => store(req, res)).catch(() => caches.match(req).then((hit) => hit || caches.match('./'))),
    );
    return;
  }

  event.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => store(req, res))));
});
