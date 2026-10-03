---
description: Verwaiste git-Worktrees gefahrlos aufräumen (gemergte/gelöschte Branches)
---

Du räumst **verwaiste git-Worktrees und die zugehörigen, bereits gemergten origin-Branches** dieses Repos auf – von abgeschlossenen Tickets übrig geblieben. Ziel: sauber aufräumen, **ohne** etwas Lebendiges zu löschen, und mit **einer einzigen Sammelfreigabe** statt Branch-für-Branch. Repo `GamerCubes/tuktuk`.

**Sicherheitsregeln (unverhandelbar):**
- Entferne **niemals** den aktuell aktiven Worktree (den, in dem diese Session läuft) und **niemals** den Haupt-Checkout (`main`).
- Entferne nur Worktrees, deren Arbeit sicher in `main` steckt – d. h. der Branch existiert **nicht mehr auf `origin`** (PR gemergt + Branch gelöscht) **oder** sein/der detached-HEAD-Commit ist bereits **in `origin/main` enthalten**.
- Lösche origin-Branches **nur**, wenn ihre Spitze bereits **in `origin/main` enthalten** ist (`git merge-base --is-ancestor origin/<branch> origin/main`) – dann ist die Arbeit sicher in `main`, nichts geht verloren. `origin/main` selbst und jeden **nicht** enthaltenen Branch (offener PR, ungemergte Conception/Arbeit) **nie** anfassen.
- Im Zweifel **stehen lassen**, nicht löschen. Ein liegengebliebener Worktree/Branch ist harmlos; ein fälschlich gelöschter kostet Arbeit.

**Ablauf:**

1. **Stand holen.** Vom Haupt-Ordner aus:
   - `git fetch --prune` (aktualisiert die Remote-Referenzen, entfernt gelöschte Branches)
   - `git worktree prune` (räumt tote Verwaltungs-Einträge, deren Ordner es nicht mehr gibt)
   - Aktiven Worktree merken: `git rev-parse --show-toplevel`.

2. **Worktree-Kandidaten bestimmen.** `git worktree list --porcelain` lesen. Für jeden Worktree unter `.claude/worktrees/` bzw. `../tuktuk-*` (nie der Haupt-Checkout, nie der aktive):
   - Hat er einen Branch? Prüfe, ob dieser noch auf `origin` liegt: `git ls-remote --exit-code --heads origin <branch>`. **Fehlschlag (Branch weg)** → Kandidat.
   - Detached HEAD? Prüfe `git merge-base --is-ancestor <HEAD-sha> origin/main`. **Enthalten** → Kandidat.
   - Branch existiert noch auf `origin` **und ist nicht in `origin/main` enthalten** (offener PR, laufende Arbeit) → **stehen lassen**.

3. **origin-Branch-Kandidaten bestimmen.** Alle Remote-Branches durchgehen: `git ls-remote --heads origin`. Für jeden (außer `main`): steckt seine Spitze schon in `origin/main`? `git merge-base --is-ancestor origin/<branch> origin/main`.
   - **Enthalten** → gemergt/aufgebraucht → Lösch-Kandidat (typisch: `conception/*`, `next-spalte/*`, `docs/*` sowie Feature-Branches, die nach dem PR-Merge auf `origin` nicht auto-gelöscht wurden).
   - **Nicht enthalten** → **stehen lassen** (offener PR, ungemergte Conception/Arbeit). Im Zweifel behalten.

4. **Bestätigen – EINE Sammelfreigabe.** Liste dem PO **alles Löschbare kompakt in einer einzigen Freigabe** auf (Worktree-Pfade + origin-Branches, je mit Grund „gemergt / in main enthalten") und was verschont bleibt. Formuliere ihm den Freigabe-Satz zum Zurückspiegeln vor, z. B. „Räume auf: Worktrees X, Y + origin-Branches A, B, C (alle in main enthalten)." Er bestätigt **einmal** – frag **nicht** Branch-für-Branch. Findet sich nichts zum Aufräumen: sag das und beende.

5. **Entfernen.** Nach dem einen OK:
   - Worktrees: je `git worktree remove --force <pfad>`, danach `git worktree prune`.
   - origin-Branches: je `git push origin --delete <branch>`.
   Zeige die frische `git worktree list` und `git ls-remote --heads origin` als Beleg.

**Hinweise:**
- Windows/`gh` ggf. via PATH: `export PATH="$PATH:/c/Program Files/GitHub CLI"`.
- Schlägt das Löschen mit „directory is locked/in use" fehl, hält meist eine andere laufende Session diesen Ordner – dann diesen Kandidaten überspringen und den PO bitten, jene Session zu schließen und den Command erneut zu starten.
- Dieser Command räumt lokale Worktrees **und gemergte origin-Branches** (nur solche, die in `origin/main` enthalten sind) – kein Board, keine ungemergte Arbeit. `origin/main` selbst wird nie angefasst.
