import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';
import { initUiScale } from './uiScale';

initUiScale();

// Langes Drücken öffnet sonst das Seitenmenü des Browsers – etwa wenn nach dem Halten eines Clips
// die Lösch-Rückfrage unter dem noch liegenden Finger erscheint (#13). Textfelder behalten ihr Menü.
document.addEventListener('contextmenu', (e) => {
  if (e.target instanceof Element && e.target.closest('input, textarea')) return;
  e.preventDefault();
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}
