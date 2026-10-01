import { useEffect, useReducer } from 'react';
import { initialState, reducer, TICK_MS } from './state';
import Feed from './screens/Feed';
import Family from './screens/Family';
import Recorder from './screens/Recorder';
import Compose from './screens/Compose';
import Profile from './screens/Profile';
import NavBar from './components/NavBar';
import { CommentsSheet, InviteSheet, ShareSheet } from './components/Sheets';

export default function App() {
  const [s, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const t = setInterval(() => dispatch({ type: 'tick' }), TICK_MS);
    return () => clearInterval(t);
  }, []);

  const props = { s, dispatch };

  return (
    <div className="wrap">
      <div className="phone">
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
      </div>
    </div>
  );
}
