---
description: Conception – Brief an Claude Design schreiben; bei Rückkehr das Handoff verarbeiten/prüfen und nach OK nach Ready for Development ziehen
argument-hint: <Issue-Nummer oder Titel>
---

Du übersetzt das **fertige** Ticket in einen Design-Brief: $ARGUMENTS

Kontext: Repo `GamerCubes/tuktuk`, Board #6 (Owner Thommy169). Hier wird **nicht neu gegrillt** – das Problem steht schon (User-Story + Akzeptanzkriterien im Issue). Verbindliche Designsprache: das Claude-Design-Projekt „TukTuk Familie App Design" (Export `design/export.html`) und die umgesetzten Styles in `src/styles.css`.

## Vorab – Worktree-Gate (zuerst prüfen)
Diese Phase committet und pusht den Brief – also **echte Git-Arbeit**. Sie läuft **in einem eigenen Worktree**, nicht im Haupt-Checkout (`CLAUDE.md` → „Tooling-Fallen"). Der Brief ist **kein App-Code** → er geht über die **Doku-Spur direkt nach `main`** (`git push origin HEAD:main`), nicht über einen eigenen Branch (`CLAUDE.md` → „Git-Entscheidungen: Zwei Spuren").

**Allererster Schritt:** `git rev-parse --show-toplevel`.
- Eigener Worktree → weiter im Ablauf.
- Haupt-Checkout (`…/tuktuk`) → **dort keinen Branch auschecken oder committen.** Bitte den PO, die Conception in einem eigenen Fenster/Worktree fortzusetzen.
- Ausnahme: Der PO bestätigt ausdrücklich Single-Track (sicher keine zweite Session) → dann ist der Haupt-Checkout ok.

**Karte nach In Conception ziehen (dann):** Der Aufruf von `/conception <N>` **ist** die PO-Beauftragung – du ziehst die Karte selbst aus *Next* nach **In Conception** (`95f09747`), bevor du loslegst. Item-ID: `gh project item-list 6 --owner Thommy169 --format json`; setzen: `gh project item-edit --id <itemId> --project-id PVT_kwHODCvQbc4BlmXK --field-id PVTSSF_lAHODCvQbc4BlmXKzhkSlJ8 --single-select-option-id 95f09747`. Idempotent: liegt die Karte schon dort, kein Schaden. Steht sie ganz woanders (noch *Option*, schon weiter) → nicht blind verschieben, PO kurz hinweisen. Keine Karte zur Nummer? Offen ansprechen.

Ablauf:
1. **Andockpunkt erkunden:** Schau in den Code (`src/screens/`, `src/components/`, `src/styles.css`) – was existiert schon (Sheets, Buttons, Zustände), welches UI-Muster fehlt komplett? Halte das knapp fest, mit Datei:Zeile.
2. **Brief schreiben** nach `design/feature-<N>/BRIEF.md`:
   - **Auftrag/Kontext:** worum es geht (aus der User-Story), für wen, mobil zuerst.
   - **Fest (nicht neu aufmachen):** was Akzeptanzkriterien, Grill-Ergebnisse und die bestehende Designsprache bereits festlegen.
   - **Was heute schon existiert:** der Andockpunkt aus Schritt 1.
   - **Zustände zum Durchspielen:** auch Randfälle (leerer Feed, keine Kamera-Erlaubnis, sehr lange Texte …), nicht nur das Ideal.
   - **Offene Design-Fragen:** je **bis zu 3 konkrete Varianten (a/b/c) + begründete Empfehlung**. Nie blank lassen.
   - **Deliverable:** Zustände/Screens **nebeneinander** zum Vergleichen; **Clickdummy nur bei echtem Flow**.
   - Im Zweifel die einfachere Lösung; lieber wenige scharfe offene Fragen als eine Wunschliste.
3. **Brief direkt nach `main` pushen (Doku-Spur):** `git add design/feature-<N>/BRIEF.md` → `git commit` → **separat** `git push origin HEAD:main`. Push abgelehnt? `git pull --rebase origin main`, dann erneut pushen.
4. **Claude Design den Pfad nennen:** dem PO einen Copy-Paste-Satz geben, z. B. „Claude Design: lies `design/feature-<N>/BRIEF.md` aus dem Repo GamerCubes/tuktuk."
5. **Verlinken:** den Brief im Issue-Body auf `https://github.com/GamerCubes/tuktuk/blob/main/design/feature-<N>/BRIEF.md` verlinken (Umlaute → `--body-file`).

Danach gestaltet der PO in Claude Design. **Die Karte bleibt in *In Conception*.** Kein Feature-Code in dieser Phase.

## Wenn der PO das Design-Handoff aus Claude Design zurückbringt
Nicht neu briefen, sondern **verarbeiten und prüfen**. Das Handoff kommt als Upload ins Repo oder als Nachricht „Implement: `<Datei>.dc.html`" über den claude-design MCP (dann zuerst `list_files` auf das Projekt, die genannte `.dc.html` mit `read_file` lesen – sie trägt Entscheidungen, Wortlaut und States inline; ein README ist Bonus, kein Muss).

1. **Issue und Repo-Brief in Einklang bringen:** Eine frische `/development`-Session liest Repo + Issue.
   - **Issue:** direkt unter die Akzeptanzkriterien eine klickbare Zeile mit dem Claude-Design-Link, dann einen Abschnitt „## Design (Handoff von Claude Design)" anhängen: getroffene Entscheidungen, finaler Wortlaut, Andockpunkt im Code (Datei:Zeile), Datenwirkung („ändert sich das gespeicherte Datenformat? ja/nein"). Wer nur das Issue liest, weiß, was zu bauen ist. Explizit markieren, wo das Handoff den Brief überschreibt.
   - **Repo-Brief nachziehen:** offene Fragen auf die gewählte Variante auflösen.
   - **Handoff ins Repo legen:** `.dc.html` (+ ggf. README) nach `design/feature-<N>/handoff/`.
   - Alles per Doku-Spur nach `main` pushen.
2. **Prüfen:** Deckt das Handoff alle offenen Fragen und Akzeptanzkriterien ab? Passt es zur bestehenden Designsprache (mobil zuerst, ≥16px)? Lücken offen benennen.
3. **Fragen, dann ziehen:** Ist das Handoff tragfähig, **frage den PO**, ob das Ticket nach *Ready for Development* soll. Erst auf sein OK ziehst du die Karte dorthin (`16f53672`), gleiche `item-edit`-Mechanik wie oben.
