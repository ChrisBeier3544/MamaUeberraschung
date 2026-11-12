# 🐾 Mamas tierischer Adventskalender

Ein knuffiger Online-Adventskalender voller süßer Tiere – mit 24 Rätseln und einem Weihnachtsgeheimnis.

## So funktioniert's
- **Türchen 1–23:** Jeden Tag ein anderes Rätsel/Minispiel (Memory, Labyrinth, Keks-Krimi, Kapibara-Wellness …).
  Wer es löst, bekommt einen Buchstaben fürs **Buchstaben-Körbchen** (absichtlich durcheinander!).
- **Türchen 24:** Alle 23 Buchstaben in die richtige Reihenfolge bringen → große Überraschung 🎄
- Türchen öffnen sich erst am jeweiligen Dezembertag. Der Fortschritt wird im Browser gespeichert
  (also am besten immer auf demselben Gerät/Browser spielen).
- **Tiergehege:** Unten laufen ständig gezeichnete Tiere über die Seite – 100 verschiedene Varianten.
  Wer eins anklickt, beamt es ins Gehege (Knopf unten rechts). Dort laufen alle gefundenen Tiere herum,
  und das Sammelalbum zeigt, welche noch fehlen.
- **Polaroids:** Für jedes neu gefundene Tier gibt es Blitz, Auslöser-Geräusch und ein Polaroid, das sich langsam entwickelt –
  100 verschiedene Fotos mit eigener Szene und Bildunterschrift (`photos.js`). Im Sammelalbum kann man sie wieder ansehen.
- **Seltenheit:** 60 häufige, 25 seltene, 12 sehr seltene und 3 legendäre Tiere. Seltene leuchten beim Vorbeilaufen.
- **Einzugs-Wellen:** 61 Tiere gibt es von Anfang an. Ab Nikolaus (6.12.) ziehen die Tiere mit Weihnachtsmütze ein,
  ab dem 13.12. die mit Rentiergeweih, ab dem 20.12. die mit Krone. Die drei legendären kommen am 6., 13. und 20. dazu.
  Einstellbar in `animals.js` unter `WAVES`.
  Seltenheit einstellbar in `animals.js` unter `RARITY` (Gewichte) und `UNFOUND_BOOST` (noch nicht gefundene Tiere kommen öfter).
- Außerdem zum Anklicken: Lichterkette, Schneeflocken, Titelbuchstaben, das Herz (6×), Kalle das Kapibara (5× für die Orange).

## Anpassen
Ganz oben in `app.js` steht `CONFIG`:
- `solution` – der geheime Satz (genau **23 Buchstaben** ohne Leerzeichen)
- `finalTitle`, `finalMessage`, `signature` – der Text, der am 24. erscheint (hier deine persönliche Nachricht reinschreiben!)
- `year` – das Jahr

## Testen
- `index.html?vorschau` – alle Türchen sind sofort offen (mit Knopf zum Zurücksetzen)
- `index.html?reset` – Fortschritt löschen (Achtung: vor dem Verschenken einmal aufrufen!)

## Online stellen (GitHub Pages)
Repository → *Settings* → *Pages* → Branch auswählen → Ordner `/ (root)` → *Save*.
Nach ein paar Minuten ist der Kalender unter `https://<benutzername>.github.io/<repo>/` erreichbar.
