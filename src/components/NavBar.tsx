import type { Tab } from '../state';
import type { ScreenProps } from '../types';

const ITEMS: { id: Tab; icon: string; label: string; plus?: boolean }[] = [
  { id: 'feed', icon: '⌂', label: 'Start' },
  { id: 'fam', icon: '❀', label: 'Familie' },
  { id: 'rec', icon: '+', label: 'Aufnehmen', plus: true },
  { id: 'profil', icon: '☺', label: 'Profil' },
];

const HIDDEN_ON: Tab[] = ['rec', 'post'];

export default function NavBar({ s, dispatch }: ScreenProps) {
  if (HIDDEN_ON.includes(s.tab)) return null;
  const dark = s.tab === 'feed';

  return (
    <nav className={'nav' + (dark ? ' dark' : '')}>
      {ITEMS.map((it) => (
        <button
          key={it.id}
          className={'nav-item' + (s.tab === it.id ? ' active' : '')}
          onClick={() => dispatch({ type: 'go', tab: it.id })}
          aria-label={it.label}
          aria-current={s.tab === it.id ? 'page' : undefined}
        >
          <div className={it.plus ? 'nav-icon nav-plus' : 'nav-icon'}>{it.icon}</div>
          {!it.plus && it.label}
        </button>
      ))}
    </nav>
  );
}
