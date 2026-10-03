# HANDOFF – TukTuk

> Aktueller Stand + nächster Schritt. Wird am Ende jeder Session **überschrieben**, nicht angehängt.

## Stand (03.10.2026)
- App läuft live auf https://gamercubes.github.io/tuktuk/ (GitHub Pages, Deploy bei jedem Push auf `main`).
- Funktionsumfang: Feed, Aufnahme mit echter Kamera, Upload, Posten, Likes, Kommentare, Profil. Alles wird lokal auf dem Gerät gespeichert (IndexedDB), kein Backend.
- Projekt nachträglich auf den board-getriebenen Ablauf umgestellt: GitHub Project „TukTuk" #6 (Owner Thommy169) mit den 9 Spalten, Phasen-Commands `/next-spalte`, `/conception`, `/development`, `/worktree-cleanup`, Regeln in `CLAUDE.md`.
- Entscheidung: kein Vercel, keine Branch-Previews, kein Slack-Push. Abnahme läuft live nach dem Merge (siehe `CLAUDE.md` → „Board-Prozess").

- **#8 „Aufgenommene Videos löschen" ist live (PR #12), Karte in *PO Review*.** Im Profil öffnet Gedrückthalten eines Clips die Rückfrage „Clip löschen?"; Löschen entfernt Clip, Herzen, Merker, Kommentare und das Video aus IndexedDB. Auf PO-Wunsch ohne Design-Phase gebaut (Karte kam direkt aus *Option*).

## Nächster Schritt
- PO nimmt #8 live ab (echtes Gedrückthalten auf iPhone und Android prüfen). Abgenommen → Karte nach *Done*; sonst zurück nach *In Development*.
- Danach `/worktree-cleanup` aus dem Haupt-Checkout (Worktree `gamercubes-tuktuk-8-c85c6a`).
- Weitere Karten in *Option*: #7, #9, #10.
