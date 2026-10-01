import { C, FAMILY_TREE } from '../data';
import type { ScreenProps } from '../types';
import Avatar from '../components/Avatar';

const STEM = 14;

export default function Family({ dispatch }: ScreenProps) {
  const goRec = () => dispatch({ type: 'go', tab: 'rec' });

  return (
    <div className="screen light scroll">
      <div className="row-between">
        <h1 className="display" style={{ fontSize: 30 }}>Familie Berger</h1>
        <button className="pill pill-orange pill-sm" onClick={() => dispatch({ type: 'openSheet', sheet: 'invite' })}>
          + Einladen
        </button>
      </div>

      <div className="reminder">
        <div className="display reminder-day">14</div>
        <div className="reminder-text">
          <b>Oma Hilde wird 78 am Samstag.</b>
          <br />
          Noch 3 Tage – nimm einen Gruß auf.
        </div>
      </div>
      <button className="link-right" onClick={goRec}>Gruß aufnehmen →</button>

      <h2 className="display section-title">Familienbaum</h2>
      <div className="tree">
        {FAMILY_TREE.map((gen, g) => {
          const root = g === 0;
          return (
            <div className="tree-gen" key={g}>
              {!root && <div className="tree-stem" style={{ height: STEM }} />}
              <div className="tree-row" style={root ? undefined : { borderTop: `2px solid ${C.blue}`, width: 280 }}>
                {gen.map((m) => (
                  <div className="tree-person" key={m.n}>
                    {!root && <div className="tree-stem" style={{ height: STEM }} />}
                    <Avatar initial={m.i} color={m.c} ring={m.ring ?? C.blue} dot={m.dot} />
                    <div className="tree-name">{m.n}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <h2 className="display section-title" style={{ marginTop: 22 }}>Challenge der Woche</h2>
      <div className="challenge">
        <div className="challenge-tag">#OmaKochtNach</div>
        <div className="challenge-text">Koch Omas Lieblingsrezept nach – in 40 Sekunden. 6 von 9 sind dabei.</div>
        <button className="pill pill-ink" onClick={goRec}>Mitmachen</button>
      </div>
      <div style={{ height: 110 }} />
    </div>
  );
}
