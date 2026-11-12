# Mamas tierischer Adventskalender

Ein Online-Adventskalender mit einer Geschichte vom 1. bis 31. Dezember:
Mama wird Direktorin eines tristen Tiergeheges und verwandelt es Stück für Stück in ein Winterparadies.

## So funktioniert's
- **Geschichte:** Jedes Türchen ist ein Kapitel. Kalle das Kapibara erzählt, was im Gehege fehlt
  („Der Zaun ist kaputt …“). Mama löst das Rätsel des Tages und bekommt dafür **Taler**.
- **Shop:** Mit jedem Kapitel wird dort das passende Teil freigeschaltet (Rasen, Zaun, Teich, Laternen …),
  dazu gibt es Extras zum Verschönern. Gekaufte Teile erscheinen sofort im Gehege auf der Startseite.
  Der Himmel wird mit jeder Verbesserung blauer.
- **18. Dezember:** Ein Paket schaltet sieben Bonus-Türchen (25.–31.12.) frei. Silvester endet die
  Geschichte mit einem Feuerwerk.
- **Briefe:** Am 24. liegt ein Weihnachtsbrief unter dem Baum, zu Silvester kommt ein Neujahrsbrief.
- **Tierparade:** Unten laufen 100 verschiedene gezeichnete Tiere vorbei. Wer eins anklickt, holt es ins
  Gehege, bekommt ein Polaroid-Foto und ein paar Bonus-Taler (seltene Tiere bringen mehr).
  Manche Tiere ziehen erst ab Nikolaus, dem 13. oder dem 20. Dezember ein.
- Türchen öffnen sich erst am jeweiligen Tag. Der Fortschritt wird im Browser gespeichert
  (also immer auf demselben Gerät und im selben Browser spielen).

## Anpassen
- `app.js` → `CONFIG`: Jahr, Weihnachtsbrief (`christmasMessage`), Neujahrsbrief (`newYearMessage`), Unterschrift.
- `zoo.js` → `STORY`: die Texte der Kapitel und wie viele Taler es gibt; `ITEMS`/`EXTRAS`: Shop-Artikel und Preise.
- `puzzles.js`: die Rätsel. `photos.js`: die 100 Polaroid-Bildunterschriften.
- `animals.js`: `RARITY` (Seltenheit), `WAVES` (Einzugstage der Tiere).

## Testen
- `index.html?vorschau` – alle Türchen sofort offen, mit Knopf zum Zurücksetzen
- `index.html?reset` – Kalender-Fortschritt löschen. **Vor dem Verschenken einmal im Vorschau-Modus
  „Fortschritt löschen“ drücken**, damit Taler, Gehege und Tiere wieder bei null starten.

## Online stellen (GitHub Pages)
Repository → *Settings* → *Pages* → Branch auswählen → Ordner `/ (root)` → *Save*.
Nach ein paar Minuten ist der Kalender unter `https://<benutzername>.github.io/<repo>/` erreichbar.
