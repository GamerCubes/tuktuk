import { useEffect, useReducer, useRef } from 'react';
import { initialState, reducer, TICK_MS } from './state';
import { loadState, markVideosStored, requestPersistence, saveState } from './storage';
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
      .catch(() => dispatch({ type: 'hydrate', data: null }));
  }, []);

  // Erst nach dem Laden speichern, sonst würde der leere Startzustand die gespeicherten Daten überschreiben.
  // Speichervorgänge laufen nacheinander, damit kein älterer Stand einen neueren überholt.
  useEffect(() => {
    if (!s.loaded) return;
    saving.current = saving.current.then(() => saveState(s)).catch(() => {});
  }, [s.loaded, s.profile, s.posted, s.liked, s.saved, s.comments]);

  const props = { s, dispatch };

  return (
    <div className="wrap">
      <div className="phone">
        {!s.loaded ? null : (
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
