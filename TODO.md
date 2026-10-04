# TODO – TukTuk

> Laufende lose Enden mit Datum. Größeres gehört als Karte aufs Board. Erledigtes nach unten.

## Offen
- 03.10.2026 – Board #6: im Browser eine **Board-Ansicht** anlegen („+ New view" → Board, gruppiert nach Status). Geht nicht per CLI. (PO)
- 03.10.2026 – App in mehreren Tabs gleichzeitig offen: Speichert ein Tab mit altem Stand, nachdem im anderen ein Clip gelöscht wurde, taucht der Clip ohne Video wieder auf (letzter Schreiber gewinnt beim Snapshot). Für die Familien-App aktuell vertretbar.
- 04.10.2026 – Update auf IndexedDB-Version 2 (#13): Ist noch ein altes TukTuk-Fenster offen (installierte App und Browser-Tab gleichzeitig), wartet das neue Fenster, bis das alte geschlossen ist, und bleibt so lange leer. Ab v2 geben alte Verbindungen nach (`onversionchange`); ein Hinweis bei `onblocked` fehlt noch.
- 04.10.2026 – Wird ein Clip gelöscht, während sein Vorschaubild noch entsteht, bleibt eine kleine Object-URL bis zum Schließen im Speicher (#13, Review). Vernachlässigbar.
- 04.10.2026 – Vorschaubilder, deren Erzeugen fehlschlägt, werden bei jedem Start erneut versucht (bis 8 s pro Clip). Bewusst so; beobachten.

- 04.10.2026 – Eigene Farbe (`ME_COLOR`) und Clip-Hintergrund werden in jedem Kommentar/Clip mitgespeichert (seit #17 als `var(--orange)`/`var(--sky)`, ältere als Hex). Sauberer wäre, die eigene Farbe beim Anzeigen abzuleiten statt zu speichern – erst relevant, wenn Teilen zwischen Geräten kommt.

## Erledigt
- 04.10.2026 – Farben/Maße als Tokens: als Chore-Karte #17 aufs Board (Option).
- 03.10.2026 – Board, `CLAUDE.md`, Phasen-Commands, `HANDOFF.md`, `TODO.md` angelegt.
- 03.10.2026 – `.claude/settings.json` mit Git-/`gh`-Freigaben angelegt.
