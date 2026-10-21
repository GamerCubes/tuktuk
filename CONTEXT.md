# CONTEXT.md – Begriffe in TukTuk

Gemeinsame Sprache zwischen PO und Entwicklung. Kurz halten, nur Begriffe, die schon einmal unklar waren.

- **Tipp-Markierung** – die blaue Fläche, die Android-Browser von sich aus über ein angetipptes Element legen. Unerwünscht, in der App ausgeschaltet (#10).
- **Tipp-Feedback** – die eigene, dezente Reaktion der App beim Antippen: Buttons und Vorschaubilder drücken sich kurz leicht ein. Gilt nicht für das bildschirmfüllende Feed-Video (#10).
- **Tastatur-Markierung** – der Rahmen um ein Element, wenn man am Computer mit der Tab-Taste durchspringt. Bleibt erhalten, erscheint nie beim Klicken oder Tippen.
- **Wischen** – Finger auf dem Feed-Video nach oben ziehen = nächster Clip, nach unten = vorheriger. Einziger sichtbarer Weg zum Blättern; die Pfeil-Knöpfe ↑ ↓ entfallen (#9).
- **Knopf-Spalte** – die Knöpfe rechts im Feed (Profilbild, Herz, Kommentare, Merken, Teilen).
- **Grundfarben (Farb-Tokens)** – die festen App-Farben Blau, Orange, Tinte, Creme, Himmelblau, Grau, Rot. Sie stehen an genau einer Stelle (`src/styles.css`, Abschnitt `:root`); jede andere Farbe in der App leitet sich davon ab (#17).
- **Familien-Code** – der geheime Schlüssel einer Familie. Steckt im Einladungslink und im QR-Code; wer ihn hat, kommt in die Familie. Bleibt vorerst fest (#20, Ändern: #23).
- **Gemeinsamer Feed** – der Feed mit den Clips aller Familienmitglieder, gespeichert im Online-Speicher (Supabase, Frankfurt). Löst den bisherigen Feed ab, der nur Clips des eigenen Geräts zeigte (#20).
- **Nur auf diesem Gerät** – Hinweis an alten Clips, die noch nicht im gemeinsamen Feed liegen, sondern nur in der Browser-Datenbank des Handys. Werden mit #22 hochgeladen.
- **Familienmitglied** – eine Person in der Familie mit Name. Man wählt sich beim Beitritt aus der Liste der Mitglieder aus („Ich bin neu" legt eine Person an); mehrere Geräte können dieselbe Person sein (#20).
