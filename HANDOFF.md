# HANDOFF – TukTuk

> Aktueller Stand + nächster Schritt. Wird am Ende jeder Session **überschrieben**, nicht angehängt.

## Stand (04.10.2026)
- App läuft live auf https://gamercubes.github.io/tuktuk/ (GitHub Pages, Deploy bei jedem Push auf `main`).
- Funktionsumfang: Feed, Aufnahme mit echter Kamera (1280×720), Upload, Posten, Likes, Kommentare, Profil mit JPEG-Vorschaubildern, Clip antippen öffnet ihn im Feed, Clips löschen per Gedrückthalten. Alles lokal auf dem Gerät (IndexedDB **Version 2**: Stores `kv`, `videos`, `thumbs`), kein Backend.
- Board-Ablauf siehe `CLAUDE.md`, Board = GitHub Project „TukTuk" #6 (Owner Thommy169).

- **#13 Done** (PR #14 + Korrektur PR #15): Absturz beim Gedrückthalten im Profil auf älterem Android behoben (Vorschaubilder statt Videos, 720p-Aufnahme); Browser-Seitenmenü beim langen Drücken wird außerhalb von Textfeldern unterdrückt. Vom PO auf beiden Handys abgenommen.
- **#8 Done** (PR #12): Clips löschen per Gedrückthalten, auf beiden Handys abgenommen.

## Nächster Schritt
- `/worktree-cleanup` aus dem Haupt-Checkout (u. a. Worktrees `gamercubes-tuktuk-8-c85c6a`, `gamercubes-tuktuk-13`).
- Karten in *Option*: #7, #9, #10. **Achtung #7** („Kamera-Auflösung verbessern"): widerspricht der 720p-Grenze aus #13 – Varianten sind im Issue-Kommentar notiert, beim Grillen klären.
