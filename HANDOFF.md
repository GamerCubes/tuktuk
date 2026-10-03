# HANDOFF – TukTuk

> Aktueller Stand + nächster Schritt. Wird am Ende jeder Session **überschrieben**, nicht angehängt.

## Stand (03.10.2026)
- App läuft live auf https://gamercubes.github.io/tuktuk/ (GitHub Pages, Deploy bei jedem Push auf `main`).
- Funktionsumfang: Feed, Aufnahme mit echter Kamera, Upload, Posten, Likes, Kommentare, Profil. Alles wird lokal auf dem Gerät gespeichert (IndexedDB), kein Backend.
- Projekt nachträglich auf den board-getriebenen Ablauf umgestellt: GitHub Project „TukTuk" #6 (Owner Thommy169) mit den 9 Spalten, Phasen-Commands `/next-spalte`, `/conception`, `/development`, `/worktree-cleanup`, Regeln in `CLAUDE.md`.
- Entscheidung: kein Vercel, keine Branch-Previews, kein Slack-Push. Abnahme läuft live nach dem Merge (siehe `CLAUDE.md` → „Board-Prozess").

## Nächster Schritt
- PO sammelt Ideen als Karten in *Option* und zieht die wichtigste nach *Next*.
- Dann `/next-spalte <N>` in einem eigenen Worktree starten.
