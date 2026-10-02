// Manche Handys melden eine viel größere Seitenbreite als üblich (kleine Bildschirmzoom-Stufe,
// „Desktopwebsite“ in Chrome). Die App ist auf ~400 px Breite gestaltet – dort skalieren wir
// sie hoch, damit Knöpfe und Schrift so groß wirken wie in einer nativen App.

export const FULLSCREEN_QUERY =
  '(max-width: 500px), (hover: none) and (pointer: coarse), (display-mode: standalone), (display-mode: fullscreen)';

const DESIGN_WIDTH = 400;
const MIN_SCALED_WIDTH = 500;
const MAX_SCALE = 3;

function update() {
  const fullscreen = matchMedia(FULLSCREEN_QUERY).matches;
  const w = window.innerWidth;
  const scale = fullscreen && w > MIN_SCALED_WIDTH ? Math.min(w / DESIGN_WIDTH, MAX_SCALE) : 1;
  document.documentElement.style.setProperty('--ui-scale', String(scale));
}

export function initUiScale() {
  update();
  window.addEventListener('resize', update);
  matchMedia(FULLSCREEN_QUERY).addEventListener('change', update);
}
