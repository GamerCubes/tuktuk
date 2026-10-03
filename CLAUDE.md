# CLAUDE.md – TukTuk

## Was das ist
TukTuk ist eine private Familien-Video-App als installierbare PWA: Clips aufnehmen und im Feed ansehen, Likes, Kommentare, Profil. Die App startet leer, alle Inhalte legt die Familie selbst an. Umgesetzt aus dem Claude-Design-Projekt „TukTuk Familie App Design" (Export unter `design/export.html`).

**Leitsatz: nicht über-engineeren. Im Zweifel die einfachere Lösung.**

> **Neue Session?** Zuerst `HANDOFF.md` lesen (aktueller Stand + nächster Schritt) und `TODO.md` (lose Enden). `HANDOFF.md` am Ende jeder Session aktualisieren – überschreiben, nicht anhängen.

## Arbeitsweise (verbindlich)
- **Discovery vor Code:** bei neuen Features erst verstehen und nachfragen, dann bauen.
- **Board ist die Wahrheit.** Up-/Downstream über das Kanban-Board, eine Karte zur Zeit, Feature für Feature.
- **Kein Feature-Code, bevor die Karte in „In Development" gezogen ist.** Der technische Rahmen steht; Änderungen am Rahmen sind bewusste Entscheidungen, kein beiläufiges Bauen.
- **PO entscheidet das Produkt, der Agent entscheidet Git.** Den PO nie nach Commits/PRs fragen.

## Rollen
- **PO (Thomas) = kein Entwickler.** Hands-on-Schritte (GitHub-Einstellungen, Geräte) Schritt für Schritt anleiten. PO kommt beim PO Review auf der Live-URL ins Spiel.
- **Claude = Senior Dev.** Baut, committet, reviewt, verifiziert.

## Tech-Stack + Befehle
- **Vite + React + TypeScript**, installierbare **PWA** (Manifest, Icons, Service Worker `public/sw.js`), mobil zuerst.
- **Kein Backend.** Clips, Profil, Likes und Kommentare liegen in der Browser-Datenbank des Geräts (IndexedDB, `src/storage.ts`). Teilen zwischen Geräten gibt es noch nicht.
- **Deploy:** GitHub Pages über `.github/workflows/deploy.yml`, bei jedem Push auf `main`. Live-URL: https://gamercubes.github.io/tuktuk/
- **Keine Branch-Previews.** Abnahme läuft auf der Live-URL (siehe „Board-Prozess").
- Befehle: `npm install`, `npm run dev`, `npm run build` (enthält den Typecheck, vor jedem Review grün halten).

## Konventionen
- Styles zentral in `src/styles.css`; vorhandene Klassen und Farben wiederverwenden statt neue Werte zu erfinden. Mobil zuerst, Eingaben ≥16px (iOS-Zoom).
- Texte aktiv und konkret in der Stimme der Oberfläche, Du-Form, deutsche Anführungszeichen.
- **Gerätedaten sind echt.** Der PO testet live mit den Clips der Familie. Änderungen am gespeicherten Datenformat (`src/storage.ts`) müssen alte Einträge weiter lesen können (Versionssprung + Migration in IndexedDB) – nie Daten stillschweigend verwerfen.
- **Service Worker:** Seiten kommen netzwerk-zuerst, neue Deploys sind also nach einem Neuladen sichtbar. Ändert sich `sw.js` selbst, den Cache-Namen (`tuktuk-vN`) hochzählen.
- **Secrets:** gibt es aktuell keine. Kommt ein Backend dazu, nur publishable Keys in den Client (`.env.local`, Prefix `VITE_`), nie Secrets committen.

## Board-Prozess
`Option → Next → In Conception → Ready for Development → In Development → Code Review → PO Review → Ready to Deploy → Done`
- Board: GitHub Project „TukTuk" #6 (Owner Thommy169), Issues im Repo `GamerCubes/tuktuk`.
- Beim Einzug in *In Conception* wird die Karte zum echten Issue (Body: fette Scrum-User-Story „Als … möchte ich … damit …", dann Beschreibung, Entscheidungen, Akzeptanzkriterien).
- **Abnahme live (Entscheidung vom 03.10.2026):** Nach dem Code Review merged der Agent den PR selbst nach `main`. GitHub Pages deployt, der Agent prüft den grünen Deploy, zieht die Karte nach **PO Review** und meldet die Live-URL im Chat. Der PO lädt die App neu und testet. Abgenommen → **Done**. Nicht abgenommen → Karte zurück nach *In Development*, Korrektur als neuer PR.
- *Ready to Deploy* wird dadurch übersprungen (Merge = Deploy).
- Reihenfolge verbindlich: erst **Code Review**, dann Merge, dann **PO Review**.
- Karte bei jedem Schritt aktiv ziehen. Lose Enden → `TODO.md` (nicht aufs Board).

## Git-Entscheidungen (liegen beim Agenten)
Git-Entscheidungen triffst du selbst, ohne Rückfrage. Committe an jedem sinnvollen Zwischenstand (`npm run build` grün) mit aussagekräftiger Message; viele kleine Commits sind erwünscht. Öffne den PR automatisch, sobald das Feature funktional fertig ist, ein PR pro Issue mit „Closes #N" im Body. Frage den PO nie, *ob* committet/ge-PR-t/gemerged wird.

**Zwei Spuren nach `main`:**
- **Feature-Spur (App-Code):** eigener Worktree + eigener Branch → PR mit „Closes #N" → Code Review → Merge durch den Agenten → PO Review live.
- **Doku-Spur (kein App-Code):** `HANDOFF.md`, `TODO.md`, `CONTEXT.md`, Briefs unter `design/`, diese Datei. Kein Branch, kein PR. Aus dem eigenen Worktree `git add <datei>` → `git commit` → **separat** `git push origin HEAD:main`. Push abgelehnt? `git pull --rebase origin main`, dann erneut pushen. Hinweis: Auch ein Doku-Push löst einen Pages-Deploy aus – harmlos, die App bleibt gleich.

## Code Review
Pro PR einen **eigenen, separaten Review-Subagenten** beauftragen (frischer Blick: Korrektheit, Datenverlust-Risiko auf dem Gerät, Vereinfachung) zusätzlich zum lokalen Self-Review. **Kein** AFK-Review über GitHub Actions.

## Tooling-Fallen (Windows)
- `gh` ggf. via PATH verfügbar machen (`export PATH="$PATH:/c/Program Files/GitHub CLI"`).
- PowerShell + Umlaute: GraphQL-Mutationen und Issue-Bodies mit Umlauten aus Datei (`--body-file`) statt inline.
- Das Repo gehört `GamerCubes`, das Board `Thommy169` – deshalb ist das Repo nicht mit dem Board verknüpft. Issues kommen per `gh project item-add 6 --owner Thommy169 --url <issue-url>` aufs Board.
- **Feature-Arbeit und Board-Commands (`/next-spalte`, `/conception`, `/development`) nur aus einem eigenen git-Worktree – nie im Haupt-Checkout.** Der Haupt-Checkout `C:\Users\ThomasNelis\dev\tuktuk` bleibt auf `main`. Sonst schieben parallele Sessions HEAD gegenseitig weg.
- Nach dem Merge bleibt der Worktree verwaist → **`/worktree-cleanup`** (aus dem Haupt-Checkout, frische Session) räumt gemergte Worktrees und origin-Branches mit einer Sammelfreigabe weg.
