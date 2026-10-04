# HANDOFF – TukTuk

> Aktueller Stand + nächster Schritt. Wird am Ende jeder Session **überschrieben**, nicht angehängt.

## Stand (04.10.2026)
- App läuft live auf https://gamercubes.github.io/tuktuk/ (GitHub Pages, Deploy bei jedem Push auf `main`).
- Funktionsumfang: Feed (Blättern per Wischen, am Computer Mausrad/Pfeiltasten), Aufnahme mit echter Kamera (1280×720), Upload, Posten, Likes, Kommentare, Profil mit JPEG-Vorschaubildern, Clip antippen öffnet ihn im Feed, Clips löschen per Gedrückthalten. Alles lokal auf dem Gerät (IndexedDB **Version 2**: Stores `kv`, `videos`, `thumbs`), kein Backend.
- Board-Ablauf siehe `CLAUDE.md`, Board = GitHub Project „TukTuk" #6 (Owner Thommy169). Begriffe in `CONTEXT.md`.

- **#9 Done** (PR #18, vom PO abgenommen): Pfeil-Knöpfe ↑ ↓ im Feed entfernt, Knopf-Spalte rückt ~84px nach unten. Nur `Feed.tsx` + `styles.css`, Review ohne Findings.
- **#17 in Next** (Chore): Farben und Maße als zentrale Tokens statt fester Werte in `styles.css`.
- #7, #8, #10, #13 Done.

## Nächster Schritt

- #17 ist die einzige offene Karte (in *Next*) – als Nächstes `/next-spalte 17`.
- `/worktree-cleanup` aus dem Haupt-Checkout (u. a. `offene-issues-9784f1`, `gamercubes-tuktuk-8-c85c6a`, `gamercubes-tuktuk-13`, `board-tasks-review-b07623`).
- Hinweis Preview: `.claude/launch.json` (untracked) zeigt mit `cwd` auf den Haupt-Checkout – zum Testen eines Worktrees vorübergehend einen eigenen Eintrag mit anderem Port anlegen.
