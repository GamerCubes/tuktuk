import { AUDIENCES, C } from '../data';
import type { ScreenProps } from '../types';

const SETTINGS: [label: string, on: boolean][] = [
  ['Kommentare erlauben', true],
  ['Duett erlauben', true],
  ['Download', false],
];

export default function Compose({ s, dispatch }: ScreenProps) {
  return (
    <div className="screen light scroll" style={{ paddingLeft: 18, paddingRight: 18 }}>
      <div className="row-between">
        <button className="plain" style={{ fontSize: 22 }} onClick={() => dispatch({ type: 'go', tab: 'rec' })} aria-label="Zurück">←</button>
        <h1 className="display" style={{ fontSize: 22 }}>Posten</h1>
        <div style={{ width: 22 }} />
      </div>

      <div className="compose-row">
        <div className="compose-thumb">
          {s.media && <video src={s.media.url} autoPlay loop muted playsInline />}
          <span>0:{String(s.lastLen).padStart(2, '0')}</span>
        </div>
        <textarea
          className="compose-text"
          value={s.draft}
          onChange={(e) => dispatch({ type: 'setDraft', value: e.target.value })}
          placeholder="Beschreibung … @Oma #Sonntag"
        />
      </div>

      <div className="compose-label">Wer darf das sehen?</div>
      <div className="audiences" role="radiogroup">
        {AUDIENCES.map(([label, sub], k) => (
          <button
            key={label}
            role="radio"
            aria-checked={s.aud === k}
            className={'audience' + (s.aud === k ? ' active' : '')}
            onClick={() => dispatch({ type: 'setAud', value: k })}
          >
            <b>{label}</b>
            <span>{sub}</span>
          </button>
        ))}
      </div>

      <div className="settings">
        {SETTINGS.map(([label, on]) => (
          <div key={label} className="row-between">
            <span>{label}</span>
            <b style={{ color: on ? C.blue : C.gray }}>{on ? 'An' : 'Aus'}</b>
          </div>
        ))}
      </div>

      <button className="pill pill-orange pill-block publish" onClick={() => dispatch({ type: 'publish' })}>
        In der Familie posten
      </button>
    </div>
  );
}
