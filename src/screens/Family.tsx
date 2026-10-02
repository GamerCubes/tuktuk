import { C, ME_COLOR, displayName, familyTitle, initialOf } from '../data';
import type { ScreenProps } from '../types';
import Avatar from '../components/Avatar';

export default function Family({ s, dispatch }: ScreenProps) {
  const invite = () => dispatch({ type: 'openSheet', sheet: 'invite' });

  return (
    <div className="screen light scroll">
      <div className="row-between">
        <h1 className="display" style={{ fontSize: 30 }}>{familyTitle(s.profile)}</h1>
        <button className="pill pill-orange pill-sm" onClick={invite}>+ Einladen</button>
      </div>

      <h2 className="display section-title" style={{ marginTop: 18 }}>Familienbaum</h2>
      <div className="tree">
        <div className="tree-person">
          <Avatar initial={initialOf(s.profile)} color={ME_COLOR} ring={C.blue} />
          <div className="tree-name">{displayName(s.profile)}</div>
        </div>
      </div>
      <div className="empty-hint">
        Hier erscheinen deine Familienmitglieder, sobald sie deiner Einladung gefolgt sind.
        <br />
        <button className="pill pill-orange pill-sm" onClick={invite}>Familie einladen</button>
      </div>

      <div style={{ height: 110 }} />
    </div>
  );
}
