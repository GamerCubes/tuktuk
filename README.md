# TukTuk

Private Familien-Video-App: Clips aufnehmen und im Feed ansehen, Likes, Kommentare, Profil. Die App startet leer – alle Inhalte legst du selbst an.

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
- `src/storage.ts` – dauerhaftes Speichern auf dem Gerät
- `src/data.ts` – Typen, Farben, Texthelfer
- `src/screens/` – Feed, Familie, Aufnahme, Posten, Profil
- `src/components/` – Navigation, Sheets, Avatar

## Kamera und Upload

Die Aufnahme nutzt die echte Kamera und das Mikrofon des Geräts (max. 40 s, Front- und Rückkamera über „Drehen“). Über „Upload“ oder das Galerie-Feld lässt sich ein vorhandenes Video wählen. Clips, Profil, Likes und Kommentare werden in der Browser-Datenbank des Geräts (IndexedDB) gespeichert und bleiben nach dem Schließen erhalten. Sie sind nur auf diesem Gerät sichtbar – ein Backend zum Teilen und für Einladungen gibt es noch nicht. Wer die Website-Daten der App im Browser löscht, löscht auch die Clips.

Ohne Kamera oder ohne Erlaubnis läuft die Aufnahme als Simulation weiter, damit sich der Ablauf trotzdem testen lässt.

## Als App installieren

Die Seite ist eine installierbare Web-App (Manifest, Icons, Service Worker):

- **iPhone (Safari):** Teilen → „Zum Home-Bildschirm“
- **Android (Chrome):** Menü ⋮ → „App installieren“ bzw. „Zum Startbildschirm hinzufügen“

Danach startet TukTuk im Vollbild ohne Adressleiste.

## Bedienung im Feed

Klick aufs Video pausiert, Mausrad, Wischen oder Pfeiltasten wechseln den Clip, Leertaste pausiert.
