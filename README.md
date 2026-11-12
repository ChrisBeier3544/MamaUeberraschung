# 🐾 Mamas tierischer Adventskalender

Ein knuffiger Online-Adventskalender voller süßer Tiere – mit 24 Rätseln und einem Weihnachtsgeheimnis.

## So funktioniert's
- **Türchen 1–23:** Jeden Tag ein anderes Rätsel/Minispiel (Memory, Labyrinth, Keks-Krimi, Kapibara-Wellness …).
  Wer es löst, bekommt einen Buchstaben fürs **Buchstaben-Körbchen** (absichtlich durcheinander!).
- **Türchen 24:** Alle 23 Buchstaben in die richtige Reihenfolge bringen → große Überraschung 🎄
- Türchen öffnen sich erst am jeweiligen Dezembertag. Der Fortschritt wird im Browser gespeichert
  (also am besten immer auf demselben Gerät/Browser spielen).
- Überall gibt es etwas zum Anklicken: Lichterkette, Schneeflocken, Titelbuchstaben, das Herz 💖 (6×!),
  die Tierparade, Kalle das Kapibara (5× für die Orange 🍊), die Spähkatze, das Körbchen …

## Anpassen
Ganz oben in `app.js` steht `CONFIG`:
- `solution` – der geheime Satz (genau **23 Buchstaben** ohne Leerzeichen)
- `finalTitle`, `finalMessage`, `signature` – der Text, der am 24. erscheint (hier deine persönliche Nachricht reinschreiben!)
- `year` – das Jahr

## Testen
- `index.html?vorschau` – alle Türchen sind sofort offen
- `index.html?reset` – Fortschritt löschen (Achtung: vor dem Verschenken einmal aufrufen!)

## Online stellen (GitHub Pages)
Repository → *Settings* → *Pages* → Branch auswählen → Ordner `/ (root)` → *Save*.
Nach ein paar Minuten ist der Kalender unter `https://<benutzername>.github.io/<repo>/` erreichbar.
