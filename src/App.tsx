import { useEffect, useReducer, useRef } from 'react';
import { initialState, reducer, TICK_MS } from './state';
import { loadState, markVideosStored, requestPersistence, saveState } from './storage';
import { makeThumbnail } from './media';
import Feed from './screens/Feed';
import Family from './screens/Family';
import Recorder from './screens/Recorder';
import Compose from './screens/Compose';
import Profile from './screens/Profile';
import NavBar from './components/NavBar';
import { CommentsSheet, DeleteSheet, InviteSheet, ProfileSheet, ShareSheet } from './components/Sheets';

export default function App() {
  const [s, dispatch] = useReducer(reducer, initialState);
  const saving = useRef(Promise.resolve());
  const thumbing = useRef(new Set<string>());
  const thumbBusy = useRef(false);

  useEffect(() => {
    const t = setInterval(() => dispatch({ type: 'tick' }), TICK_MS);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    requestPersistence();
    loadState()
      .then((data) => {
        if (data) markVideosStored(data.posted);
        dispatch({ type: 'hydrate', data });
      })
      .catch(() => dispatch({ type: 'loadFailed' }));
  }, []);

  // Erst nach dem Laden speichern, sonst würde der leere Startzustand die gespeicherten Daten überschreiben.
  // Speichervorgänge laufen nacheinander, damit kein älterer Stand einen neueren überholt.
  useEffect(() => {
    if (!s.loaded) return;
    saving.current = saving.current.then(() => saveState(s)).catch(() => {});
  }, [s.loaded, s.profile, s.posted, s.liked, s.saved, s.comments]);

  // Fehlende Vorschaubilder nacheinander erzeugen – auch für Clips von vor #13.
  // Immer nur ein Video zur Zeit, damit schwache Geräte nicht überlastet werden.
  // Fehlgeschlagene Versuche (thumb '') werden nicht gespeichert und beim nächsten Start erneut versucht.
  useEffect(() => {
    if (!s.loaded || thumbBusy.current) return;
    const p = s.posted.find((x) => x.video && x.thumb === undefined && !thumbing.current.has(x.id));
    if (!p?.video) return;
    thumbing.current.add(p.id);
    thumbBusy.current = true;
    makeThumbnail(p.video).then((blob) => {
      thumbBusy.current = false;
      // setThumb erzeugt immer ein neues posted-Array und stößt so das nächste Vorschaubild an
      dispatch({ type: 'setThumb', id: p.id, url: blob ? URL.createObjectURL(blob) : '' });
    });
  }, [s.loaded, s.posted]);

  const props = { s, dispatch };

  return (
    <div className="wrap">
      <div className="phone">
        {s.loadError ? (
          <div className="screen load-error" role="alert">
            <h1 className="display">Deine Clips konnten nicht geladen werden</h1>
            <p>Schließ TukTuk ganz und öffne es neu. Deine gespeicherten Clips bleiben dabei erhalten.</p>
          </div>
        ) : !s.loaded ? null : (
          <>
            {s.tab === 'feed' && <Feed {...props} />}
            {s.tab === 'fam' && <Family {...props} />}
            {s.tab === 'rec' && <Recorder {...props} />}
            {s.tab === 'post' && <Compose {...props} />}
            {s.tab === 'profil' && <Profile {...props} />}

            <NavBar {...props} />

            {s.sheet && <div className="backdrop" onClick={() => dispatch({ type: 'closeSheet' })} />}
            {s.sheet === 'comments' && <CommentsSheet {...props} />}
            {s.sheet === 'share' && <ShareSheet {...props} />}
            {s.sheet === 'invite' && <InviteSheet {...props} />}
            {s.sheet === 'profile' && <ProfileSheet {...props} />}
            {s.sheet === 'delete' && <DeleteSheet {...props} />}
          </>
        )}
      </div>
    </div>
  );
}
