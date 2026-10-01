# TukTuk

Klickbarer Prototyp einer privaten Familien-Video-App: Clips im Feed, Familienbaum, Aufnahme, Posten mit Sichtbarkeit, Profil sowie Sheets für Kommentare, Teilen und Einladen.

Umgesetzt aus dem Claude-Design-Projekt „TukTuk Familie App Design“ mit React, Vite und TypeScript. Der ursprüngliche Design-Export liegt unter `design/export.html`.

## Lokal starten

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Das Ergebnis landet in `dist/`. Bei jedem Push auf `main` baut `.github/workflows/deploy.yml` die App und veröffentlicht sie auf GitHub Pages (in den Repo-Einstellungen unter Pages als Quelle „GitHub Actions“ wählen).

## Struktur

- `src/state.ts` – gesamter App-Zustand als Reducer (Feed-Fortschritt, Aufnahme-Timer, Likes, Kommentare …)
- `src/data.ts` – Farben, Beispiel-Clips, Familienmitglieder
- `src/screens/` – Feed, Familie, Aufnahme, Posten, Profil
- `src/components/` – Navigation, Sheets, Avatar

## Bedienung im Feed

Klick aufs Video pausiert, Mausrad, Wischen oder Pfeiltasten wechseln den Clip, Leertaste pausiert.
