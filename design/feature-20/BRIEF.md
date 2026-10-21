# Design-Brief #20 – Familien-Code und gemeinsamer Feed

Issue: https://github.com/GamerCubes/tuktuk/issues/20 · Designsprache: Projekt „TukTuk Familie App Design" (`design/export.html`) und `src/styles.css`

## Auftrag / Kontext
**Als Familienmitglied möchte ich mit einem Einladungslink in den gemeinsamen Feed kommen und dort Clips der ganzen Familie sehen und posten, damit wir uns gegenseitig auf dem eigenen Handy Clips zeigen können.**

Bisher ist TukTuk eine App für ein einzelnes Gerät. Mit dieser Karte wird sie zur echten Familien-App: Ein Einladungslink (oder QR-Code) bringt ein Familienmitglied hinein, man wählt sich aus der Liste der Mitglieder aus und sieht den **gemeinsamen Feed**. Für bis zu 10 Personen, von Kind bis Oma – also einfach, groß, wenige Schritte. Mobil zuerst, Eingaben ≥ 16 px.

## Fest (nicht neu aufmachen)
- **Familien-Code** steckt im Einladungslink und im QR-Code; wer den Link öffnet, ist ohne Abtippen drin. Der Code ist fest (Ändern kommt mit #23).
- **Wer bin ich:** Nach dem Öffnen des Links zeigt die App alle Familienmitglieder plus „Ich bin neu". Kein Passwort, die Familie vertraut sich.
- **Herzen und Kommentare** sind in dieser Karte **ausgeblendet** (kommen mit #21).
- **Alte Clips** des PO bleiben im Profil mit dem Hinweis **„nur auf diesem Gerät"**; der Feed zeigt nur gemeinsame Clips. Hochladen kommt mit #22.
- **Löschen** nur eigener Clips (Gedrückthalten im Profil wie heute); der Clip verschwindet **bei allen**.
- **Ohne Netz:** Posten sagt „Gerade keine Verbindung", der Clip bleibt im Posten-Bildschirm zum erneuten Versuch. Der Feed zeigt ohne Netz einen Hinweis.
- **Aktualisieren** beim Öffnen und beim Zurückkehren in die App. Keine Live-Aktualisierung, keine Benachrichtigungen.
- **Familien-Bildschirm** = einfache Liste der Mitglieder, kein Familienbaum (#26).
- Designsprache bleibt: Grundfarben aus `:root`, Pills (`pill-orange`, `pill-outline`), Sheets von unten, `display`-Schrift für Titel, Du-Form, deutsche Anführungszeichen.

## Was heute schon existiert (Andockpunkte)
- **Einladen-Sheet** `src/components/Sheets.tsx:60` – Titel „Familie einladen", Platzhalter `[ QR-Code ]`, Text „Einladungslinks funktionieren, sobald die App mit einem Server verbunden ist …". Wird mit echtem QR-Code und Link gefüllt. Aufgerufen aus Familie (`Family.tsx:6`, „+ Einladen") und Profil (`Profile.tsx:47`).
- **Familien-Bildschirm** `src/screens/Family.tsx:15` – „Familienbaum" mit nur einer Person (dir) und Leerhinweis „Hier erscheinen deine Familienmitglieder …". Wird zur Mitgliederliste.
- **Feed** `src/screens/Feed.tsx:130` – Knopf-Spalte (Profilbild, Herz, Kommentare, Merken, Teilen), `feed-meta` mit Name + `role-chip` + Beschreibung (`:171`). Leerzustand „Noch keine Clips" (`:56`).
- **Posten** `src/screens/Compose.tsx` – Vorschau + Beschreibung, Auswahl „Wer darf das sehen?" (Ganze Familie / Nur Kernfamilie / Ausgewählte, `:32`), Einstellungen-Block (Kommentare erlauben, Duett, Download – reine Attrappe, `:48`), Knopf „In der Familie posten" (`:57`). Kein Lade- oder Fehlerzustand.
- **Profil** `src/screens/Profile.tsx:63` – Raster eigener Clips, Gedrückthalten → Lösch-Sheet (`Sheets.tsx:100`: „… verschwindet … von diesem Gerät").
- **Teilen-Sheet** `Sheets.tsx:44` – „Noch ist niemand aus deiner Familie dabei …".
- **Fehlt komplett:** ein Bildschirm vor der App (Willkommen / Beitritt / Familie gründen), Lade- und Fehlerzustände für alles, was übers Netz geht, eine Kennzeichnung lokaler Clips, Farben für andere Personen.

## Zustände zum Durchspielen
1. **Familie gründen (einmalig, PO):** Der PO hat die App schon mit Profil und Clips. Er gründet die Familie (Familienname aus dem Profil) und landet beim Einladen-Sheet.
2. **Erster Start ohne Einladung:** jemand öffnet die App direkt, nicht über einen Link → Hinweis „Du brauchst eine Einladung" + „Familie gründen".
3. **Beitritt über Link:** Willkommen „Familie Berger lädt dich ein" → Wer bist du? (Mitglieder + „Ich bin neu") → bei „Ich bin neu" Name eingeben → Feed.
4. **Link ungültig / Familie nicht gefunden.**
5. **Einladen-Sheet** mit QR-Code, Link, Knopf zum Verschicken/Kopieren.
6. **Familien-Bildschirm** mit 1, 4 und 10 Mitgliedern; sehr langer Name.
7. **Feed:** Clip einer anderen Person (Name, Farbe), eigener Clip, **ohne** Herz- und Kommentar-Knopf. Laden beim Start. **Gemeinsamer Feed leer.** **Ohne Netz.**
8. **Posten:** Hochladen läuft (ein Clip ist bis ~12 MB, das dauert im Mobilnetz spürbar), Erfolg, **keine Verbindung**, **Speicher voll**.
9. **Profil:** gemeinsame eigene Clips + alte Clips „nur auf diesem Gerät"; Profil ganz leer.
10. **Löschen-Rückfrage:** neuer Wortlaut „verschwindet bei allen".

## Offene Design-Fragen
**1. Wer bist du? – Auswahl beim Beitritt**
- a) Große runde Avatar-Kacheln mit Namen im Raster (wie der Familienbaum heute), „Ich bin neu" als letzte Kachel mit „+".
- b) Schlichte Liste (Avatar klein + Name pro Zeile), darunter Pill „Ich bin neu".
- c) Gleich ein Namensfeld, darunter bekannte Namen als Vorschläge zum Antippen.
- **Empfehlung a)** – für Kinder und Großeltern am leichtesten, greift die vorhandene Avatar-Sprache auf; bei 10 Personen passt ein 3er-Raster noch auf einen Bildschirm.

**2. Kennzeichnung „nur auf diesem Gerät" im Profil**
- a) Eigener Abschnitt unter den gemeinsamen Clips mit Überschrift „Nur auf diesem Gerät" und einem Satz Erklärung.
- b) Kleines Abzeichen (z. B. 📱) auf jeder betroffenen Kachel im selben Raster.
- c) Betroffene Kacheln blasser dargestellt plus Hinweis über dem Raster.
- **Empfehlung a)** – eindeutig, ohne Symbol-Rätsel, und der Abschnitt verschwindet mit #22 einfach wieder.

**3. Hochladen beim Posten**
- a) Man bleibt im Posten-Bildschirm; der Knopf wird zur Fortschrittsanzeige („Wird hochgeladen … 40 %"), danach Feed.
- b) Sofort zum Feed, oben ein schmales Band „Dein Clip wird hochgeladen …".
- c) Vollbild-Ladeschirm mit Fortschritt.
- **Empfehlung a)** – passt zur Entscheidung, dass der Clip bei Fehlern im Posten-Bildschirm bleibt; Fehler und erneuter Versuch passieren an derselben Stelle.

**4. „Wer darf das sehen?" und Einstellungen im Posten-Bildschirm** (die Auswahl wirkt heute nicht, mit echtem Teilen würde sie täuschen)
- a) Auswahl und Einstellungen-Block entfernen, stattdessen ein Satz „Alle in Familie Berger sehen diesen Clip."
- b) Nur „Ganze Familie" fest anzeigen, Einstellungen bleiben.
- c) Unverändert lassen.
- **Empfehlung a)** – ehrlich und einfacher; „Kommentare erlauben" ergibt ohne Kommentare ohnehin keinen Sinn.

**5. Andere Personen im Feed: Farbe und Profilbild-Tipp**
- a) Jedes Mitglied bekommt fest eine Grundfarbe (in Beitrittsreihenfolge); Tipp aufs Profilbild öffnet nur beim eigenen Clip das Profil, bei anderen passiert nichts.
- b) Wie a), Tipp auf fremdes Profilbild öffnet den Familien-Bildschirm.
- c) Alle anderen in derselben Farbe (Himmelblau), Tipp wie a).
- **Empfehlung a)** – man erkennt auf einen Blick, wer gepostet hat; fremde Profile sind nicht Teil dieser Karte. Den `role-chip` (heute leer/„Ich") nur beim eigenen Clip zeigen oder ganz weglassen – bitte mitentscheiden.

**6. Teilen-Knopf im Feed** (gezieltes Senden kommt erst mit #25)
- a) Wie Herz und Kommentar ausblenden; die Knopf-Spalte besteht dann aus Profilbild und Merken.
- b) Knopf bleibt, Sheet sagt „Kommt bald".
- c) Knopf teilt den Einladungslink.
- **Empfehlung a)** – keine toten Knöpfe; Merken bleibt, weil es ohne Server funktioniert.

**7. Feed ohne Netz**
- a) Vollbild-Hinweis im Stil von „Noch keine Clips": „Gerade keine Verbindung" + Pill „Nochmal versuchen".
- b) Schmales Band oben, darunter die zuletzt geladenen Clips (sofern noch abspielbar).
- c) Nur ein kleiner Hinweis in der Navigationsleiste.
- **Empfehlung a)** – einfach und eindeutig; Clips ohne Netz vorzuhalten wäre ein eigenes Vorhaben.

## Wortlaut zum Prüfen (Vorschläge)
- Ohne Einladung: „Willkommen bei TukTuk" / „Um mitzumachen, brauchst du eine Einladung aus deiner Familie." / Pill „Familie gründen"
- Willkommen per Link: „Familie Berger lädt dich ein" / „Wer bist du?" / „Ich bin neu"
- Neu: „Wie heißt du?" / Pill „Los geht's"
- Link ungültig: „Diese Einladung funktioniert nicht. Bitte frag nach einem neuen Link."
- Einladen-Sheet: „Zeig diesen Code oder schick den Link – wer ihn öffnet, ist in eurer Familie." / Pill „Link teilen"
- Feed leer: „Noch keine Clips in der Familie" / „Nimm den ersten auf – alle sehen ihn dann hier."
- Keine Verbindung: „Gerade keine Verbindung" / „Prüf dein Internet und versuch es nochmal."
- Speicher voll: „Der Familienspeicher ist voll. Sag Thomas Bescheid." (Formulierung ohne Namen bevorzugt?)
- Löschen: „Der Clip verschwindet für die ganze Familie. Das lässt sich nicht rückgängig machen."

## Deliverable
- Die Zustände 1–10 als Screens **nebeneinander** zum Vergleichen (Handy-Format), offene Fragen jeweils in der empfohlenen Variante, Alternativen nur wo du unsicher bist.
- **Kleiner Clickdummy nur für den Beitritt** (Link öffnen → Willkommen → Wer bist du? → Ich bin neu → Feed), weil das ein echter neuer Ablauf ist. Alles andere als statische Zustände.
- Handoff als `.dc.html` mit Entscheidungen und finalem Wortlaut inline.
