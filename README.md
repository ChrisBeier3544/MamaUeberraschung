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
- **Nikolaus-Geschenk:** Am 6.12. (oder beim ersten Besuch danach) bringt Postbote Bello mit dem Tierpost-Wagen ein Paket.
  Angeklickt packt es sich aus: ein Brief der Tiere und 100 Taler. Text in `zoo.js` unter `GIFT`.
- **Briefe:** Am 24. liegt ein Weihnachtsbrief unter dem Baum, zu Silvester kommt ein Neujahrsbrief.
- **Versteckte Tiere:** 100 verschiedene gezeichnete Tiere verstecken sich überall: hinter Türchen und dem Titel,
  über dem Gehege, hinter Kalle, am Bildschirmrand, im Rätselfenster, im Shop und im Album – ab und zu läuft auch
  eins unten vorbei. Wer eins anklickt, holt es ins Gehege, bekommt ein Polaroid-Foto und Bonus-Taler.
- **Kleinigkeiten:** 15 günstige Deko-Teile (15–40 Taler) für zwischendurch. Nach jedem Kauf laufen drei Tiere
  hin und sagen, wie schön es ist (ohne eigene Tiere kommen Kalle, Mimi und Bello zu Besuch).
  Manche Tiere ziehen erst ab Nikolaus, dem 13. oder dem 20. Dezember ein.
- **Füttern:** Jede Tierart frisst etwas anderes (16 Sorten im Shop unter „Futter“: 3 Stück für 1 Taler, 7 für 2, 20 für 5). Im Gehege ein Tier
  antippen und „Füttern“ wählen. Wer 24 Stunden nichts bekommt, wird traurig.
- **Großes Gehege:** Über den Gehege-Knopf öffnet sich eine große Ansicht zum Zoomen (Mausrad, zwei Finger, +/−) und Verschieben.
- **Spielecke:** „Heuballen-Turm“, „Waschbär-Alarm“ und „Pinguin-Rutsche“. Bestimmte Punktzahlen bringen einmalig heimlich Taler
  (Stufen in `games.js` unter `RULES`).
- Türchen öffnen sich erst am jeweiligen Tag. Der Fortschritt wird im Browser gespeichert
  (also immer auf demselben Gerät und im selben Browser spielen).

## Anpassen
- `app.js` → `CONFIG`: Jahr, Weihnachtsbrief (`christmasMessage`), Neujahrsbrief (`newYearMessage`), Unterschrift.
- `zoo.js` → `STORY`: die Texte der Kapitel und wie viele Taler es gibt; `ITEMS`/`EXTRAS`: Shop-Artikel und Preise.
- `texts.js`: alle Sprechblasen (je 20 Varianten, ohne schnelle Wiederholung).
- `puzzles.js`: die Rätsel. `photos.js`: die 100 Polaroid-Bildunterschriften.
- `animals.js`: `RARITY` (Seltenheit), `WAVES` (Einzugstage der Tiere).

## Testen
- `index.html?vorschau` – alle Türchen sofort offen, mit Knopf zum Zurücksetzen
- `index.html?reset` – Kalender-Fortschritt löschen. **Vor dem Verschenken einmal im Vorschau-Modus
  „Fortschritt löschen“ drücken**, damit Taler, Gehege und Tiere wieder bei null starten.

## Online stellen (GitHub Pages)
Repository → *Settings* → *Pages* → Branch auswählen → Ordner `/ (root)` → *Save*.
Nach ein paar Minuten ist der Kalender unter `https://<benutzername>.github.io/<repo>/` erreichbar.

## Taler-Haushalt
- Türchen: 100 Taler (Nikolaus, Heiligabend, Silvester: 150) – zusammen 3.250
- Teile der Geschichte: 60–220 Taler, zusammen 3.570 – also mehr, als die Türchen allein bringen
- Zusätzlich: gefundene Tiere (3 / 8 / 20 / 60 Taler je nach Seltenheit, bis ca. 800) und geheime
  Spiel-Meilensteine (bis 315)
- Extras (50–400) und Kleinigkeiten (15–60) muss man sich vom Rest zusammensparen.
