# HANDOFF – TukTuk

> Aktueller Stand + nächster Schritt. Wird am Ende jeder Session **überschrieben**, nicht angehängt.

## Stand (04.10.2026)
- App läuft live auf https://gamercubes.github.io/tuktuk/ (GitHub Pages, Deploy bei jedem Push auf `main`).
- Funktionsumfang: Feed, Aufnahme mit echter Kamera (1280×720), Upload, Posten, Likes, Kommentare, Profil mit JPEG-Vorschaubildern, Clip antippen öffnet ihn im Feed, Clips löschen per Gedrückthalten. Alles lokal auf dem Gerät (IndexedDB **Version 2**: Stores `kv`, `videos`, `thumbs`), kein Backend.
- Board-Ablauf siehe `CLAUDE.md`, Board = GitHub Project „TukTuk" #6 (Owner Thommy169). Begriffe in `CONTEXT.md` (neu).

- **#10 Done** (PR #16, vom PO abgenommen): Blaue Tipp-Markierung app-weit aus, Buttons und Clip-Vorschauen drücken sich beim Antippen ein (`scale(.95)`). Nur CSS in `src/styles.css`. Review-Hinweise, falls der PO etwas bemängelt: Bei breiten Buttons ggf. `.97` statt `.95`; am Desktop könnte die `:active`-Regel auf `@media (hover: none)` beschränkt werden.
- **#7 Done** (PR #11, Kamera ohne Zoom-Effekt) – Karte hing noch in *Option*, nachgezogen.
- **#13 Done**, **#8 Done**.

## Nächster Schritt
- #9 (Hoch-/Runter-Pfeile entfernen) ist die einzige Karte in *Option*.
- `/worktree-cleanup` aus dem Haupt-Checkout (u. a. `gamercubes-tuktuk-8-c85c6a`, `gamercubes-tuktuk-13`, `board-tasks-review-b07623`).
