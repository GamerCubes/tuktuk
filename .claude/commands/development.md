---
description: Development-Phase für ein dev-reifes TukTuk-Ticket – baut das Feature stiltreu, lässt es separat reviewen, merged nach dem Code Review und zieht die Karte nach PO Review mit der Live-URL.
argument-hint: <Issue-Nummer oder -URL>
---

Du setzt ein dev-reifes TukTuk-Ticket um und ziehst es zu Beginn selbst nach **In Development** – als Senior-Dev, eine Karte zur Zeit. Ziel: das Feature stiltreu bauen, `npm run build` grün halten, separat reviewen lassen (der Review-Subagent zieht die Karte nach **Code Review**), den PR mit „Closes #N" öffnen, Feedback einarbeiten, **selbst mergen**, den Live-Deploy prüfen und die Karte nach **PO Review** ziehen – mit der Live-URL für die Abnahme.

**Ticket:** `$ARGUMENTS` (Issue-Nummer oder -URL; Repo `GamerCubes/tuktuk`, Board #6). Wenn leer, frage einmal nach der Nummer und brich sonst nicht ab.

## Vorab – Worktree-Gate (zuerst prüfen)
Diese Phase läuft **in einem eigenen Worktree für genau dieses Ticket**, nicht im Haupt-Checkout (`CLAUDE.md` → „Tooling-Fallen").

**Allererster Schritt:** `git rev-parse --show-toplevel`.
- Eigener Worktree → weiter im Ablauf.
- Haupt-Checkout (`…/tuktuk`) → bitte den PO, die Karte in einem eigenen Fenster mit Worktree zu öffnen, und setze dort fort.
- Ausnahme: Der PO bestätigt ausdrücklich Single-Track (sicher keine zweite Session) → dann ist der Haupt-Checkout ok.

## Karte nach In Development ziehen (sofort nach dem Gate)
Der Aufruf von `/development <N>` **ist** die PO-Beauftragung, genau dieses Ticket jetzt zu bauen.
- Item-ID holen und Status auf **In Development** (`1d5cead5`) setzen – Befehle siehe „Board-Referenz".
- **Idempotent:** Liegt die Karte schon dort, kein Schaden.
- Keine Karte zur Nummer? Offen ansprechen statt still weiterzubauen.

## Geltende Regeln (verlinkt, nicht dupliziert)
Vor dem Bauen lesen, nicht aus dem Gedächtnis arbeiten:
- **`CLAUDE.md`** – maßgeblich: „Arbeitsweise", „Konventionen" (Gerätedaten sind echt, Service Worker), „Board-Prozess" (Abnahme live), „Git-Entscheidungen", „Code Review".
- **`HANDOFF.md`** – Stand + nächster Schritt. **`TODO.md`** – lose Enden (betrifft etwas dieses Ticket?). **`CONTEXT.md`** – Fachsprache, falls vorhanden.

Tauchen Regel und Realität in Konflikt, gewinnt die Regel – oder du sprichst den Konflikt offen an.

## Ablauf

### 1. Grundlage einlesen (still, ohne Bericht)
- Die oben verlinkten Dateien.
- **Ticket-Body:** `gh issue view <N> --repo GamerCubes/tuktuk --json title,body,number,labels`. Der Design-Abschnitt nennt Entscheidungen, finalen Wortlaut und Andockpunkt.
- **Design-Paket unter `design/feature-<N>/`**, falls vorhanden: Handoff-Datei maßgeblich für Wortlaut und States, Clickdummy fürs Interaktionsgefühl.
- **Codebase am Andockpunkt:** `src/state.ts` (Reducer), `src/storage.ts` (IndexedDB), `src/media.ts`, `src/screens/`, `src/components/`, `src/styles.css`. Festhalten, was wiederverwendbar ist.

### 2. Konkreter Vorgehensplan
Knapp: State (neue Actions im Reducer?), Daten (ändert sich das gespeicherte Format?), UI (Komponenten/States), Styles, die abzuhakenden Akzeptanzkriterien. Dann selbständig abarbeiten – Rückfragen nur bei echter **Produkt**-Lücke.

### 3. Bauen (stiltreu, nicht über-engineeren)
- **Bestehende Muster wiederverwenden:** vorhandene CSS-Klassen, Reducer-Muster, Sheets/Komponenten.
- **Gerätedaten schützen.** Ändert sich, was in IndexedDB liegt, die DB-Version hochzählen und alte Einträge migrieren. Nie bestehende Clips, Likes oder Kommentare stillschweigend verwerfen – der PO testet live mit echten Familienclips.
- **Service Worker:** Ändert sich `public/sw.js`, den Cache-Namen hochzählen.
- **Wortlaut exakt** aus dem Handoff (Du-Form, aktiv, deutsche Anführungszeichen). Animationen zurückhaltend, mit `prefers-reduced-motion`-Fallback.
- `.dc.html` im Design-Paket ist **Referenz, kein Produktionscode**.
- Neues wiederverwendbares Muster oder Inkonsistenz entdeckt? `Design-Schuld:`-Eintrag in `TODO.md`, nicht nebenbei mitlösen.

### 4. Grün halten + verifizieren
- `npm run build` (inkl. Typecheck) grün, bevor reviewt wird.
- **Browser-Verifikation** über den Dev-Server (`preview_start` mit `tuktuk`): Flow durchklicken, Konsole prüfen, mobile Breite (`resize_window` mobile). Kamera ist headless nicht echt testbar – die Simulation offen als solche benennen.
- **Datenwirkung prüfen:** Was gespeichert wird, muss nach einem Neuladen noch da sein.

### 5. Self-Review + separater Review-Subagent (Pflicht)
- Erst selbst gegen die Akzeptanzkriterien und das Handoff durchgehen.
- Dann **einen eigenen Review-Subagenten** beauftragen (frischer Blick: Korrektheit, Datenverlust-Risiko, Vereinfachung, Edge Cases, Konsistenz mit `styles.css`). **Der Review-Subagent zieht als Teil seines Auftrags die Karte selbst nach *Code Review*** (`85f87c97`) – gib ihm Item-ID-Lookup, Project-/Feld-ID und Option-ID aus „Board-Referenz" mit.
- **Belastbare Findings einarbeiten**, danach `npm run build` erneut grün. Nicht-Belastbares offen begründet ablehnen.

### 6. Git + PR (eigenständig, ohne Rückfrage)
- Feature-Branch `feature/<N>-<kurz>` im eigenen Worktree. Viele kleine Commits an grünen Zwischenständen; keine Temp-Dateien.
- Branch pushen, **ein PR pro Issue** mit **„Closes #N"** im Body (`Was/Warum/Getestet`).

### 7. Mergen und Live-Deploy prüfen
- Erst wenn das Review-Feedback eingearbeitet und der Build grün ist: `gh pr merge <PR> --repo GamerCubes/tuktuk --squash --delete-branch`.
- Den Pages-Deploy abwarten: `gh run list --repo GamerCubes/tuktuk --workflow deploy.yml --limit 1`, dann `gh run watch <run-id> --repo GamerCubes/tuktuk`. Erst bei grünem Deploy weiter. Schlägt er fehl: Ursache beheben (neuer PR), Karte bleibt in *Code Review*.

### 8. Karte nach PO Review + Live-URL
- Karte nach **PO Review** (`d8c5a087`) ziehen.
- Dem PO ungefragt im Chat melden: **https://gamercubes.github.io/tuktuk/** – „App neu laden" (installierte App: einmal schließen und neu öffnen). Dazu knapp den **Abnahme-Fokus**: was antippen, was danach noch da sein muss.
- Reine Doku-/Refactor-Chore ohne sichtbare Änderung: statt der Live-URL den PR-Diff-Link `https://github.com/GamerCubes/tuktuk/pull/<PR>/files`.
- Nimmt der PO ab → Karte nach **Done** (`48940c1d`). Nimmt er nicht ab → Karte zurück nach *In Development*, Korrektur als neuer PR, gleicher Ablauf.

### 9. Doku aktuell halten (Doku-Spur)
- `HANDOFF.md` überschreiben („#<N> live, Karte in PO Review" + nächster Schritt) und ggf. `TODO.md`/`CONTEXT.md` aktualisieren – direkt nach `main`, nicht in den Feature-PR: `git add` → `git commit` → separat `git push origin HEAD:main`.

## Board-Referenz (Projekt 6, Thommy169)
- Project-ID `PVT_kwHODCvQbc4BlmXK`, Status-Feld `PVTSSF_lAHODCvQbc4BlmXKzhkSlJ8`.
- Status-Optionen: Option `a91fdd74` · Next `d7794073` · In Conception `95f09747` · Ready for Development `16f53672` · **In Development `1d5cead5`** · **Code Review `85f87c97`** · **PO Review `d8c5a087`** · Ready to Deploy `44859f86` (wird übersprungen) · Done `48940c1d`.
- Item-ID des Tickets: `gh project item-list 6 --owner Thommy169 --format json`. Setzen: `gh project item-edit --id <itemId> --project-id PVT_kwHODCvQbc4BlmXK --field-id PVTSSF_lAHODCvQbc4BlmXKzhkSlJ8 --single-select-option-id <optionId>`.

## Haltung
Senior-Dev: die einfachere Lösung bevorzugen, stiltreu zum Bestehenden, ehrlich bei dem, was (noch) nicht verifizierbar ist. Gegenstück zu `/conception` eine Spalte weiter rechts.
