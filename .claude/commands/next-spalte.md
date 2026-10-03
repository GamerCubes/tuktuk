---
description: Grillen & Finalisieren eines Tickets in der Next-Spalte (PO-freundlich)
argument-hint: <Issue-Nummer oder Titel>
---

Du führst eine **PO-freundliche Grill-Session** für das Ticket: $ARGUMENTS

Kontext: Repo `GamerCubes/tuktuk`, Project-Board #6 „TukTuk" (Owner Thommy169). PO ist **kein Entwickler** – stelle Fragen ohne Tech-Jargon, trage die Dev-Brille (Machbarkeit, Schnitt, Randfälle) nur im Kopf.

Ablauf:
1. **Verstehen:** Lies das Issue (falls Nummer: `gh issue view <NR> --repo GamerCubes/tuktuk`). Falls es nur ein loser Titel ist, erst das Problem dahinter erfragen.
2. **Grillen:** Stelle gezielte Rückfragen, eine Sache nach der anderen – Ziel, Nutzen, Randfälle, was NICHT dazugehört (Scope-Grenze). Nutze bei echten Entscheidungen Auswahlfragen mit einer Empfehlung. Kläre unklare Begriffe und pflege sie in `CONTEXT.md` (anlegen, falls nicht vorhanden). **`CONTEXT.md` ist Doku – sofort über die Doku-Spur nach `main` sichern:** aus deinem Worktree `git add CONTEXT.md` → `git commit` → **separat** `git push origin HEAD:main` (kombiniertes add+commit+push wird geblockt). Push abgelehnt, weil jemand schneller war? `git pull --rebase origin main`, dann erneut pushen. Nie als uncommitteten Stand im Arbeitsbaum liegen lassen. So bleibt **kein ungemergter Branch** übrig (`CLAUDE.md` → „Git-Entscheidungen: Zwei Spuren"). Der finale Issue-Text selbst geht über `gh` (Schritt 3), nicht über Git.
3. **Finalisieren:** Schreibe den Issue-Body in dieser Struktur:
   - **Fette einzeilige Scrum-User-Story:** „**Als … möchte ich … damit …**"
   - **Beschreibung** (kurz, konkret)
   - **Entscheidungen** (was wir festgelegt haben)
   - **Akzeptanzkriterien** (überprüfbar, als Checkliste)
   - **Ergebnisse der Grill-Session** (offene Punkte, Annahmen)
   Aktualisiere das Issue: `gh issue edit <NR> --repo GamerCubes/tuktuk --body-file <datei>`.
4. **Folge-Tickets:** Tauchen neue Ideen auf, schlage sie vor – aber lege sie erst nach dem OK des PO an (Status „Option"): `gh issue create --repo GamerCubes/tuktuk --title "…" --body-file <datei>` → `gh project item-add 6 --owner Thommy169 --url <issue-url> --format json` (liefert die Item-ID) → `gh project item-edit --id <itemId> --project-id PVT_kwHODCvQbc4BlmXK --field-id PVTSSF_lAHODCvQbc4BlmXKzhkSlJ8 --single-select-option-id a91fdd74`.

Wichtig: Die Karte ziehst du **nicht** selbst weiter – das macht der PO. Kein Feature-Code in dieser Phase.
