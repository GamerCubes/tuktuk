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
- `src/media.ts` – Kamera-Zugriff, Aufnahmeformat, Videolänge
- `src/data.ts` – Farben, Beispiel-Clips, Familienmitglieder
- `src/screens/` – Feed, Familie, Aufnahme, Posten, Profil
- `src/components/` – Navigation, Sheets, Avatar

## Kamera und Upload

Die Aufnahme nutzt die echte Kamera und das Mikrofon des Geräts (max. 40 s, Front- und Rückkamera über „Drehen“). Über „Upload“ oder das Galerie-Feld lässt sich ein vorhandenes Video wählen. Clips bleiben nur im Speicher dieses Geräts und sind nach dem Neuladen weg – ein Backend zum Teilen gibt es noch nicht.

Ohne Kamera oder ohne Erlaubnis läuft die Aufnahme als Simulation weiter, damit sich der Ablauf trotzdem testen lässt.

## Als App installieren

Die Seite ist eine installierbare Web-App (Manifest, Icons, Service Worker):

- **iPhone (Safari):** Teilen → „Zum Home-Bildschirm“
- **Android (Chrome):** Menü ⋮ → „App installieren“ bzw. „Zum Startbildschirm hinzufügen“

Danach startet TukTuk im Vollbild ohne Adressleiste.

## Bedienung im Feed

Klick aufs Video pausiert, Mausrad, Wischen oder Pfeiltasten wechseln den Clip, Leertaste pausiert.
