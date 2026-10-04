# HANDOFF – TukTuk

> Aktueller Stand + nächster Schritt. Wird am Ende jeder Session **überschrieben**, nicht angehängt.

## Stand (04.10.2026)
- App läuft live auf https://gamercubes.github.io/tuktuk/ (GitHub Pages, Deploy bei jedem Push auf `main`).
- Funktionsumfang: Feed, Aufnahme mit echter Kamera (720p), Upload, Posten, Likes, Kommentare, Profil, Clips löschen per Gedrückthalten. Alles lokal auf dem Gerät (IndexedDB), kein Backend.
- Board-Ablauf siehe `CLAUDE.md`, Board = GitHub Project „TukTuk" #6 (Owner Thommy169).

- **#13 „Absturz beim Gedrückthalten eines Clips im Profil" ist live (PR #14), Karte in *PO Review*.** Auf dem älteren Android-Handy des Sohnes stürzte Chrome beim Gedrückthalten im Profil ab, weil jede Kachel ein volles Video lud. Jetzt: JPEG-Vorschaubilder (Store `thumbs`, **IndexedDB-Version 2**, alte Clips bekommen ihr Bild nach dem ersten Start), kurzes Antippen öffnet den Clip im Feed, Aufnahme in 1280×720. Ladefehler sperren das Speichern (Hinweis statt leerer App). Bug ohne Design-Phase umgesetzt (PO-Entscheidung).
- **#8 „Aufgenommene Videos löschen"** (PR #12) steht weiter in *PO Review*: Auf dem Gerät des PO klappt es; auf dem Gerät des Sohnes war es wegen #13 nicht testbar.

## Nächster Schritt
- PO nimmt #13 und #8 auf beiden Handys ab: alle TukTuk-Fenster schließen, neu öffnen, im Profil Vorschaubilder prüfen, Clip antippen (öffnet im Feed), Clip gedrückt halten (Rückfrage „Clip löschen?" ohne Absturz). Abgenommen → beide Karten nach *Done*; sonst zurück nach *In Development*.
- Danach `/worktree-cleanup` aus dem Haupt-Checkout (u. a. Worktrees `gamercubes-tuktuk-8-c85c6a`, `gamercubes-tuktuk-13`).
- Weitere Karten in *Option*: #7, #9, #10.
