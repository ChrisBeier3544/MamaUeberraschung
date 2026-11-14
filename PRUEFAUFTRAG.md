# Prüfauftrag: Mamas tierischer Adventskalender – Komplettprüfung

> Diesen Text komplett als Auftrag an Claude Code geben (in einer Sitzung mit dem Repository `ChrisBeier3544/MamaUeberraschung`).

---

## 0. Deine Rolle und die Spielregeln

Du bist QA-Tester und Entwickler für einen persönlichen Online-Adventskalender. Chris hat ihn für seine Mama Ute gebaut.
Prüfe den **gesamten** Kalender gründlich: Logik, richtige Tage und Uhrzeiten, Taler-Rechnung, Überlappungen, Grafik, Animationen, Texte, Speichern und Technik.

**Wichtig: Ändere zunächst nichts am Code.** Erst prüfen, dann eine Liste der Befunde vorlegen und fragen, welche behoben werden sollen. Erst nach dem „Go“ beheben.

Feste Regeln:
- **Geprüft wird als Samsung-Handy, nicht als iPhone.** Ute hat ein Samsung. Standardprofil in Playwright: Viewport 360 × 780, `isMobile: true`, `hasTouch: true`, User-Agent von Samsung Internet (`Mozilla/5.0 (Linux; Android 14; SM-S911B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/25.0 Chrome/121.0.0.0 Mobile Safari/537.36`). Stichprobenartig zusätzlich: 412 × 915, Querformat 780 × 360 und Desktop 1280 × 800.
- Chromium und Playwright sind vorinstalliert (`require('playwright')`). **Nicht** `playwright install` ausführen.
- Lokal mit `python3 -m http.server 8765` im Repo-Ordner starten.
- Zu jedem Befund gehören ein **direkter Testlink** (Testmodus-Anker, siehe unten) und, wo sinnvoll, ein Screenshot.
- Tiere und Kalle sprechen Ute mit **„Ute“** an. Nur Chris’ Briefe sagen **„Mama“**. Das gehört zur Prüfung.
- Git: Nur auf dem vorgegebenen Entwicklungs-Branch committen. Vor jedem Veröffentlichen `python3 tools/bump-version.py` ausführen (löst die Auto-Aktualisierung bei Ute aus). In `main` erst nach Rückfrage mergen. `main` wird über GitHub Pages veröffentlicht.

---

## 1. Aufbau – das musst du wissen

| Datei | Inhalt |
|---|---|
| `index.html` | Seite, Reihenfolge der Skripte, `BUILD`-Konstante + Versions-Check gegen `version.txt` (Auto-Reload) |
| `test.js` | Testmodus: tauscht `Date` aus, speichert mit Präfix `test:` getrennt vom echten Stand |
| `app.js` | `CONFIG` (Jahr 2026, Briefe, Fotos, Unterschrift), Türchen, Schloss bis 28.11. 9:00, Aufschließ-Animation, Partikel/Konfetti, Hinweise (`notify`/`busy`) |
| `munkel.js` | Der Munkelvogel (SVG-Figur, Gesichtsausdrücke `f-*`, Beine, Flügel, Sprechblasen, Hut/Schal/schlank) |
| `munkel-scenes.js` | 28 Szenen vom 14.–27.11. (morgens/abends), Sammelstücke, Himmel mit echter Mondphase, Schlaf-Logik, Szenen-Album |
| `zoo.js` | Taler, Münzflug-Animation, `STORY` (31 Kapitel), Shop (`ITEMS`/`EXTRAS`/`SMALL`/Futter), Gehege-Szene, Startgeschenk, Nikolaus-Paket, Briefe |
| `animals.js` | 100 Tiere, Seltenheiten, Einzugswellen, versteckte Tiere, Polaroids, Hunger, Gehege-Besetzung (stündlich wechselnd), großes Gehege |
| `extras.js` | Wetter, Spieluhr, Adventskranz, Tier-Fakten, Erinnerungen, Aufgabe des Tages, Tagebuch, Zufallsereignisse, Besucher/Spendenbox, 20 Abzeichen, Weihnachtsmann, Heiligabend-Show, Weihnachtsfoto, Rückblick, Abspann, Keks, Dank nach Silvester |
| `games.js` | Heuballen-Turm, Waschbär-Alarm, Pinguin-Rutsche + geheime Taler-Meilensteine (`RULES`) |
| `puzzles.js` | 31 Rätsel (24–31 sind Varianten früherer Typen über `like()`) |
| `intro.js` | Erklärung von Kalle (Schritte), Fragezeichen-Knopf |
| `backup.js` | Spielstand als Link/Datei sichern und wiederherstellen |
| `texts.js`, `photos.js` | Sprechblasen, 100 Polaroid-Unterschriften |
| `test.html` | Testzentrale (Tabs: Munkel-Szenen, Tage, Spielstand; Geräte; „Nach 21 Uhr“) |
| `fotos/`, `icons/`, `manifest.webmanifest` | Fotos (01–26, brief, neujahr, portrait, 24), App-Icons für den Startbildschirm |

**Speicher-Schlüssel** (localStorage), alle mit `-2026`: `mama-advent-` (gelöste Türchen), `mama-advent-2026-sound`, `mama-zoo-` (Taler, Käufe, Futter, Positionen, Rekorde, Geschenke), `mama-gehege-` (gefundene Tiere), `mama-extras-`, `mama-munkel-`, `mama-aufgeschlossen-`, `mama-sicherung-`, `mama-wuensche-`, dazu der Intro-Schlüssel.

**Testmodus:**
- `index.html#test-JJJJ-MM-TT-HHMM`, z. B. `#test-2026-12-06-1830`.
- Mit `-leer` am Ende startet der Testspielstand leer.
- Alternativ `?testdatum=2026-12-08&zeit=20:00`.
- Getrennter Speicher mit Präfix `test:`.
- Eingebettet in `test.html` ohne Testleiste.
- `?vorschau`: alles offen. `?vorschau&schloss`: Schloss trotz Vorschau.
- `?reset`: löscht den Kalenderfortschritt.

Prüfe zuerst, dass der Testmodus selbst korrekt arbeitet:
- Das Datum stimmt, auch `new Date(y, m, d)` mit Argumenten.
- `Date.now()` ist verschoben.
- Der echte Spielstand wird **nicht** angefasst.
- Der Wechsel zwischen Testdaten funktioniert.
- `-leer` leert wirklich nur den Test-Speicher.
- `Backup` sammelt im Testmodus nur `test:`-Schlüssel ein.

---

## 2. Zeitachse – jeden Stichtag einzeln prüfen

Für jeden Punkt: Testlink öffnen, Ablauf beobachten (Screenshots in Abständen), Konsole auf Fehler prüfen, danach neu laden und prüfen, dass nichts doppelt passiert.

### 2.1 Vor dem 14.11. (z. B. 10.11., 13.11. 8:00 / 20:00 / 22:30)
- Schloss-Bildschirm mit Countdown-Uhr bis 28.11. 9:00. Die Zahlen stimmen: Tage, Stunden, Minuten, Sekunden laufen, kein „-1“, keine `NaN`.
- Der Munkelvogel sitzt auf dem Schloss, schunkelt verträumt und wackelt mit den Beinchen. Antippen zeigt die Sprüche aus `MUNKEL_LOCK` reihum.
- **Es darf noch keine Szene laufen** (`MunkelShow.currentSlot()` = `null`). Das Album zeigt nur „?“.
- Ab 21:00 schläft er (Zzz). Antippen ergibt „psst, ich schlafe“. Ab 6:00 wacht er ohne Szene auf.
- Altdaten-Bereinigung: Szenen, die vor dem 14.11. als gesehen gespeichert wurden, werden entfernt. Hat das den Nestbau `14e` betroffen, verschwindet auch das Nest.

### 2.2 14.11.–27.11.: die 28 Munkel-Szenen
Für **jede** der 28 Szenen (14m … 27e) gilt:
- Sie startet einmal automatisch im richtigen Tagesabschnitt.
  - Morgens: 6:00–16:59.
  - Abends: 17:00–5:59; 0:00–5:59 zählt zum Vorabend.
- Sie ist danach als gesehen gespeichert und startet nach dem Neuladen nicht noch einmal.
- Grenzzeiten prüfen: 5:59, 6:00, 10:59, 11:00, 16:59, 17:00, 20:59, 21:00, 23:59, 0:00.
- Läuft eine Szene über den Wechsel 16:59 → 17:00, darf sie nicht abbrechen und die nächste darf nicht darüberlaufen.

Die Szenen und ihre Sammelstücke (sie müssen dauerhaft am Schloss bleiben):

| Tag | Morgens | Abends |
|---|---|---|
| 14. | Aufwachen | Einnicken im Nest → **Nest** |
| 15. | Postflug → **Brief** | Sterne anknipsen (Sterne bleiben nachts) |
| 16. | Frühstück | Gute-Nacht-Lied |
| 17. | Durchs Schlüsselloch | Schneeflocken fangen (Flocke auf dem Schnabel) |
| 18. | Morgensport → **schlank** (Hantel, Waage mit LCD-Anzeige) | Schal stricken → **Schal** (Farbe bleibt) |
| 19. | Schlüssel knacken | Laterne & Glühwürmchen → **Laterne**, Glühwürmchen bleiben die ganze Nacht |
| 20. | Seifenblasen | Sternschnuppe |
| 21. | Mützen-Anprobe → **Mütze** | Besuch der Eule (Eule nicht im Nest versteckt) |
| 22. | Mini-Schneemann → **Schneemann** | Kerze anzünden → **Kerze** (nicht verdeckt) |
| 23. | Wurm-Tauziehen (Wurm nach außen, mit Kopf) | Polarlicht (ohne Streifenlinie) |
| 24. | Federputz-Show | Mond-Schaukel (echte Mondphase) |
| 25. | Looping-Ausflug (gleichmäßige Bahn) | Lichterkette → **Lichter** |
| 26. | Schloss polieren → **Glanz** | Schattenspiel |
| 27. | Aufregung | Schäfchen zählen (20 Schafe, weiße Schafe mit Kopf/Augen) |

Pro Szene außerdem prüfen:
- **Interaktion:** Wo „Tipp …“ steht, muss das Antippen auf Samsung (Touch) funktionieren. Die Trefferfläche muss groß genug sein und darf nichts blockieren. Ohne Antippen muss die Szene nach der Wartezeit von selbst weiterlaufen.
- **Hinweise** („Tipp …“) sind klein, ganz lesbar (nicht abgeschnitten) und stehen nicht über dem Vogel.
- **Sprechblasen:**
  - Es ist immer nur eine sichtbar.
  - Sie ist klein und dezent, nicht gespiegelt und folgt dem Kopf.
  - Sie verschwindet, wenn der Vogel aus dem Bild fliegt oder ausgeblendet ist.
  - Sie ragt nie über den Bildschirmrand und überdeckt keine Augen.
- **Holen von Dingen:** Der Vogel fliegt **ganz** aus dem Bild und kommt mit dem Gegenstand zurück. Nichts erscheint aus dem Nichts.
- **Gegenstände:** Sie liegen am Schloss verankert, schweben nicht und sind nicht vom Vogel, vom Brief oder von anderen Dingen verdeckt. Die Stapelreihenfolge stimmt (Nest hinten/vorne, Vogel sitzt *im* Nest, fällt nicht hindurch).
- **Flugbahnen:** Start und Landung sind flüssig. Keine Sprünge, kein Ruckeln, kein Teleportieren, keine Drehung in die falsche Richtung.
- **Gesicht:** Ausdrücke wechseln sauber, Augen überlappen nicht.
- **Ende:** Der Vogel kehrt ins Nest zurück (ab 14e) bzw. auf seinen Platz. Keine Reste der Szene bleiben stehen.
- **Abbruch:** Was passiert bei Neuladen, Tab-Wechsel (`document.hidden`) oder Bildschirm-Aus mitten in der Szene? Danach darf nichts hängen bleiben: kein `busy`, kein `scene-on`, keine halben Gegenstände.

Schlaf-Logik:
- **Abendszene vor 21:00:** Danach sagt er „Boah, bin ich müde …“ und bleibt wach.
- **Ab 21:00:** Er schläft nach der Abendszene ein. Liegt er schon im Nest, schläft er dort.
- **Morgens:**
  - Die Aufwach-Einleitung kommt nur, wenn er schlief oder wenn die Szene automatisch vor 11:00 startet.
  - Am Nachmittag (z. B. 14:00) gibt es keine Aufwach-Einleitung.
  - `14m` hat sein eigenes Aufwachen und darf es nicht doppelt zeigen.
- Zwischen 6:00 und 21:00 wacht ein schlafender Vogel still auf (`wakeQuiet`).

Verpasste Szenen:
- Nicht gesehene, vergangene Szenen stehen im Album als „verpasst“ (gesperrt).
- Die aktuelle Szene ist im Album offen.
- Gesehene Szenen lassen sich nochmals abspielen, ohne Sammelstücke doppelt zu vergeben.
- Der Zähler „x / 28“ stimmt.

**Aber:** Sammelstücke verpasster Szenen fehlen dann. Prüfe, ob spätere Szenen davon ausgehen, dass ein Stück schon da ist, und dann falsch aussehen (z. B. Nest, Schal, Laterne). Beispiel: Ute öffnet erst am 20.11. zum ersten Mal.

Himmel:
- Die Mondphase stimmt für das echte Datum (gegen eine Mondphasen-Tabelle für Nov. 2026 prüfen).
- Der Mond ist richtig herum beleuchtet.
- Es gibt nie zwei Monde.
- Tagsüber Sonne/Tageshimmel. Die Sterne von 15e bleiben nachts bestehen.

### 2.3 28.11.: Das Schloss öffnet
- **28.11. 0:00–5:59:** Gilt als Abend des 27. (27e).
- **28.11. 6:00–8:59:** Achtung, `currentSlot` liefert dann `27m`. Prüfen, ob dort eine Szene unerwartet (nach-)läuft oder etwas doppelt kommt, und was sinnvoll wäre.
- **8:59** öffnen und offen lassen: Was passiert um 9:00 ohne Neuladen? Springt das Schloss von selbst auf, oder erst beim Neuladen? Beides bewerten.
- **9:00, erster Besuch:** Der Vogel bringt den Schlüssel, die Aufschließ-Animation läuft (Schlüssel dreht, Bügel springt auf). Die Mütze aus Szene 21m sitzt dabei weiter auf dem Kopf.
- Danach der Reihe nach, ohne Überlappung:
  1. Chris’ Brief („Liebe Mama,“ mit Foto `fotos/brief.jpg`, Unterschrift „Dein Chris ❤️“)
  2. Kalles Erklärung (alle Schritte, Punkte-Navigation, Zurück/Weiter)
  3. Startgeschenk 20 Taler mit Münzflug
- Die Animation läuft nur **einmal** (`mama-aufgeschlossen-2026`). Prüfen: Neuladen mitten in der Animation, mitten im Brief und mitten in der Erklärung. Es darf nichts verloren gehen (Startgeschenk!) und nichts doppelt kommen.
- **Erstbesuch erst später** (z. B. am 5.12., 6.12., 24.12. oder 31.12.): Alles muss in sinnvoller Reihenfolge nacheinander kommen und nicht übereinander. Dazu gehören:
  - Schloss, Brief, Erklärung, Startgeschenk
  - Nikolaus-Paket
  - Einzugswellen-Hinweise
  - Weihnachtsmann
  - Weihnachtsfoto
  - Hinweise auf verpasste Türchen

### 2.4 28.–30.11.: Vorgeschmack
- Alle Türchen sind zu und zeigen ein Schloss. Antippen zeigt einen der `LOCKED_MSGS` mit korrekter Restzeit. Die Kopfzeile zeigt „Noch X Tage bis zum ersten Türchen“, auch mit korrekter Einzahl („1 Tag“).
- Versteckte Tiere:
  - Höchstens **7**, selten, keine legendären.
  - Beim 7. kommt der Hinweis „Ab dem 1. Dezember ziehen viele weitere ein“.
  - Danach erscheinen keine weiteren bis zum 1.12.
- Shop, Gehege und Spiele sind nutzbar. Prüfen, was ohne gelöste Kapitel gekauft werden kann. Das Gehege ist trist (kaputter Zaun).
- **29.11. ist der 1. Advent:** Am Adventskranz brennt 1 Kerze. Am 6.12. 2, am 13.12. 3, am 20.12. 4. Am Samstag davor jeweils eine weniger.

### 2.5 Dezember: jedes Türchen 1–31
Für **jeden Tag** um 0:00, 9:00, 18:00 und 23:59:
- Das Türchen des Tages öffnet um 0:00. Das Türchen von morgen ist noch zu und zeigt die richtige Restzeit.
- Vergangene, ungelöste Türchen sind als „verpasst“ markiert und lassen sich nachholen (inklusive Taler). Das heutige Türchen ist nicht als verpasst markiert.
- Gelöstes Türchen öffnen: Die Belohnung bzw. Geschichte ist erneut ansehbar, es gibt **keine** zweiten Taler.
- Taler pro Türchen: **100**, an 6., 24. und 31. **150**. Die Gutschrift erfolgt genau einmal, auch bei Doppeltipp, schnellem Schließen oder Neuladen während der Animation.
- Das Story-Kapitel (`STORY[n]`) passt zum Tag. Das Teil wird im Shop freigeschaltet und hervorgehoben. Nach dem Kauf erscheint es im Gehege an der richtigen Stelle, ohne andere Teile zu verdecken.

Besondere Tage:
- **6.12. Nikolaus** (oder erster Besuch danach):
  - Postbote Bello bringt mit dem Tierpost-Wagen ein Paket. Angetippt gibt es den Brief der Tiere und 100 Taler, genau einmal.
  - Es erscheint nicht, solange ein anderes Fenster offen ist, sondern wartet.
  - Ab heute gibt es Tiere mit Mütze (Welle).
- **13.12.:** Welle Rentiergeweih plus Hinweis. **20.12.:** Welle Krone plus Hinweis. Jeder Hinweis kommt nur einmal. Tiere einer Welle tauchen vorher nirgends auf (auch nicht in Spielen, Shows oder auf dem Weihnachtsfoto).
- **17.12.:** Nachwuchs (Babys ohne Namen mit dem Hinweis „gib mir einen Namen“).
- **18.12.:** Das Paket schaltet die Bonus-Türchen 25–31 frei, **erst wenn Türchen 18 gelöst ist**. Die Bonus-Türchen erscheinen mit Animation und öffnen sich trotzdem erst an ihrem Datum.
- **21.12.:**
  - Rocky ist geläutert: Er trägt die Postmütze und klaut kein Futter mehr.
  - Der Keks-Text ändert sich.
  - Gilt das auch für alle Texte, die vorher von Rocky als Dieb sprechen?
- **23.12.:** Nach dem Lösen von Türchen 23 kommt das Weihnachtsfoto:
  - Countdown 3-2-1, Blitz.
  - Mindestens 6 Tiere, notfalls mit Gästen Bello, Mimi, Rocky, Frieda, Pingu.
  - Kalle steht in der Mitte.
  - Es liegt danach im Album und kommt nur einmal.
- **24.12. Heiligabend:**
  - Der Weihnachtsmann-Schlitten fliegt einmal (ab 24. bis 31., falls verpasst), und alle Tiere bekommen Leckerlis.
  - Nach dem Rätsel: Heiligabend-Show unter dem Baum, danach der Weihnachtsbrief mit Foto `fotos/24.jpg`, Bildunterschrift „Wir zwei.“, Unterschrift „Dein Chris ❤️“, Konfetti.
  - Prüfen: Der Text lautet genau wie in `CONFIG.christmasMessage`.
  - Die Tanne ist kaufbar.
- **25.–31.:**
  - Die Bonus-Rätsel sind Varianten (`like()`) von 2, 11, 6, 9, 13, 1, 8, 23. Sie dürfen nicht dieselben Antworten oder Bilder wie das Original haben und müssen lösbar sein.
  - Gibt es für 27–31 Fotos/Erinnerungen? In `fotos/` liegen nur `01–26.jpg`. Prüfen, ob irgendwo ein Bild für diese Tage erwartet wird (kaputtes Bild oder leerer Rahmen).
- **31.12. Silvester:**
  - Das Feuerwerk ist kaufbar. Nach dem Kauf kommen Nachthimmel, Feuerwerk im Gehege und nach ~3 s der Neujahrsbrief („Frohes neues Jahr, Mama! 🎆“, Foto `fotos/neujahr.jpg`, „Wir vier.“).
  - Beim Schließen kommt der Abspann.
  - Am Türchen 31 gibt es den Knopf „Jahresrückblick ansehen“.
  - Zum Rückblick prüfen:
    - Alle Kacheln zeigen korrekte Zahlen.
    - Das Porträt `fotos/portrait.jpg` ist zu sehen.
    - Vorher/Nachher stimmt.
    - Das Weihnachtsfoto ist aufrufbar.
- **Ab 1.1.2027:**
  - Einmal der Dank „Danke, Ute!“, danach nie wieder.
  - Das Gehege bleibt nutzbar und alle Türchen sind offen.
  - Kein Türchen gilt als „heute“, keines darf fälschlich „verpasst“ oder „noch X Tage“ zeigen.
  - Countdown- und Kopfzeilentexte sind sinnvoll.
  - Aufgabe des Tages, Keks und Ereignisse funktionieren weiter oder sind sinnvoll abgeschaltet.
  - Prüfen bis z. B. 15.1.2027.

---

## 3. Tageszeit, Nacht, Wetter

- Gehege-Nacht (`Extras.isNight`): 17:00–6:59. Munkel-Abend: 17:00–5:59. Munkel-Schlaf: 21:00–5:59. **Zwischen 6:00 und 6:59** sind Gehege und Vogel unterschiedlich (Gehege Nacht, Vogel Morgen). Bewerten, ob das stört.
- Beim Wechsel Tag ↔ Nacht während die Seite offen ist, aktualisieren sich Gehege, Laternen, Lichter und Tiere (innerhalb von 1 Min.), ohne dass offene Fenster zugehen.
- Das Wetter ist pro Tag fest (gleich nach dem Neuladen) und das Tagebuch passt dazu.
- Die Gehege-Besetzung zeigt tags max. 25, nachts max. 15 Tiere und wechselt zur vollen Stunde. Neue und hungrige Tiere sind immer draußen. Die Anzeige „x draußen, y im Stall“ stimmt.

---

## 4. Taler – die komplette Rechnung

Jede Quelle prüfen: richtige Höhe, nur einmal, Münzflug-Animation, Zähler oben stimmt danach mit dem gespeicherten Wert überein.

| Quelle | Höhe | Einmaligkeit |
|---|---|---|
| Startgeschenk | 20 | einmal |
| Türchen | 100 (6./24./31.: 150) | je Türchen einmal |
| Nikolaus-Paket | 100 | einmal |
| Gefundenes Tier | 3 / 8 / 20 / 60 je Seltenheit | je Tier einmal |
| Spiele-Meilensteine | Turm 10/20/35/50 → 15/20/30/40; Waschbär 30/60/100/150 → 15/20/30/40; Pinguin 400/800/1500/2500 → 15/20/30/40 | je Stufe einmal; mehrere Stufen auf einmal übersprungen? |
| Abzeichen | 5 je Abzeichen, erst beim Antippen in der Übersicht | einmal |
| Aufgabe des Tages | 5–20 | einmal pro Tag |
| Keks | 2 | einmal pro Tag |
| Schmetterling / Sternschnuppe / Kalle findet Taler | 5 / 8 / 3 | max. 4 Ereignisse pro Tag |
| Spendenbox | bis 20 pro Tag | einmal pro Tag |

- Kein negativer Kontostand. Kaufen ohne genug Taler wird freundlich abgelehnt. Schnelles Mehrfachtippen auf „Kaufen“ kauft nicht doppelt.
- Rockys Diebstahl zieht nur Futter ab, keine Taler.
- **Machbarkeit:** Reichen die Taler bei normalem Spielen, um jedes Story-Teil am selben Tag zu kaufen? (README: Story-Teile zusammen 3.570, Türchen 3.250.) Durchrechnen für drei Spielertypen:
  1. nur Türchen
  2. Türchen + ein bisschen Tiere/Aufgaben
  3. Vielspielerin

  Ist das Feuerwerk am 31. sicher bezahlbar? Kann man sich durch Extras „verkaufen“ und dann ein Pflicht-Teil nicht mehr kaufen? Wenn ja: Hinweis oder Sicherheitsnetz vorschlagen.
- Münzflug-Warteschlange: Mehrere Gutschriften kurz hintereinander laufen sauber nacheinander. Am Ende stimmt die Summe, auch wenn die Seite währenddessen neu geladen wird.

---

## 5. Shop und Gehege

- Tabs Story-Teile, Extras, Kleinigkeiten, Futter:
  - Story-Teile werden erst mit ihrem Kapitel freigeschaltet.
  - Preise und Texte stimmen.
  - Bereits gekaufte Teile sind als gekauft markiert.
  - Nach jedem Kauf laufen drei Tiere hin und sagen etwas. Ohne eigene Tiere kommen Kalle, Mimi und Bello.
- Der Kauf-Ring bzw. Highlight im Gehege stimmt.
- **Ebenen:** `BACK` / `MID` / `FRONT`. Mit vielen gekauften Teilen gleichzeitig prüfen:
  - Nichts verdeckt Wichtiges.
  - Kein Teil schwebt.
  - Der Schnee liegt richtig.
  - Laternen leuchten nachts an den 5 festen Plätzen.
  - Die Zonen Ruheecke, Marktplatz, Weihnachtsplatz, Wasserwelt und Winterwald sind sinnvoll gefüllt.
- Mit jeder Verbesserung wird der Himmel blauer.
- **Umräumen:**
  - Verschieben bleibt in den Grenzen.
  - `NOMOVE`-Teile lassen sich nicht bewegen.
  - Teile lassen sich ein/aus schalten.
  - Positionen bleiben nach dem Neuladen.
  - Folgeteile wandern mit (`FOLLOW`: Teddy → Höhle, Kerzen → Weg).
- **Großes Gehege:**
  - Zoom mit zwei Fingern auf Samsung, +/−, Verschieben.
  - Kein Herausscrollen ins Leere.
  - Die Seite darunter scrollt nicht mit.
  - Schließen funktioniert.
  - Nach dem Schließen ist das Seiten-Scrollen wieder frei (`overflow`).
- **Futter:**
  - 16 Sorten, Packs 1/2/5 Taler für 3/7/20 Stück.
  - Jede Tierart frisst nur ihr Futter.
  - Füttern über Tier antippen → „Füttern“.
  - Bestand sinkt.
  - Nach 24 h ohne Futter ist das Tier traurig und zeigt „hat Hunger!“. Nach dem Füttern ist es wieder froh.
  - Neu gefundene Tiere starten nicht sofort hungrig.
- **Umbenennen:** Leere Namen, sehr lange Namen, Emojis, HTML-Zeichen (`<b>`). Wird das sicher als Text angezeigt? Ist der Name überall gleich (Polaroid, Album, Weihnachtsfoto, Abspann)?
- **Wunschliste** (`mama-wuensche-`), falls vorhanden: funktioniert und wird gespeichert.

---

## 6. Versteckte Tiere (100 Stück)

- Verstecke:
  - hinter Türchen und Titel
  - über dem Gehege
  - hinter Kalle
  - am Bildschirmrand (links/rechts gedreht)
  - im Rätselfenster
  - im Shop
  - im Album
  - unten vorbeilaufend

  Auf 360 px Breite müssen alle sichtbar und antippbar sein. Keines darf halb außerhalb des Bildschirms unerreichbar sein oder Bedienelemente überdecken.
- Antippen ergibt Polaroid mit passender Unterschrift (`photos.js`), Taler nach Seltenheit und Einzug ins Gehege.
- **Seltenheiten:**
  - Häufig / selten / sehr selten / legendär (3 Stück mit Krone: Capy, Elefant, Bär).
  - Noch nicht gefundene werden bevorzugt.
- **Einzugswellen:** Mütze ab 6.12., Geweih ab 13.12., Krone ab 20.12. Kein Tier erscheint vor seinem Tag.
- Kein Tier ist doppelt im Bild gleichzeitig. Ein bereits gefundenes Tier bringt kein zweites Mal Taler.
- **Sammelalbum:** 100 Plätze, Zähler, Filter/Seltenheit, Weihnachtsfoto-Eintrag.
- Sind alle 100 bis zum 31.12. realistisch findbar (Häufigkeit × Besuchsdauer)? Grob abschätzen.

---

## 7. Die 31 Rätsel

Jedes Rätsel auf Samsung (Touch, 360 px) **vollständig lösen** und einmal absichtlich falsch versuchen:

1. Memory der Doppelgänger
2. Wer bin ich?
3. Das Pixel-Porträt (Nonogramm, eindeutig lösbar?)
4. Tier-Sudoku (eindeutig?)
5. Das große Gewusel (Zahl stimmt?)
6. Nikolaus’ Buchstabensalat
7. Das Tier-Orchester (braucht Ton – was bei stummem Handy / Ton aus?)
8. Der Code-Knacker
9. Tierische Redewendungen
10. Das Waagen-Rätsel
11. Quiz für Tierkennerinnen (Fakten korrekt?)
12. Die Nachbarinnen vom Lindenweg (Logikrätsel eindeutig?)
13. Der Winterwald (Labyrinth lösbar?)
14. Kalles Porträt (Schiebepuzzle immer lösbar?)
15. Ein langes Leben (Lebenserwartungen korrekt?)
16. Die Geheimbotschaft
17. Wie heißt das Kleine?
18. Das Silbenrätsel
19. Weck die Siebenschläfer (Lights-Out, lösbar?)
20. Finde die 6 Unterschiede (Unterschiede auf 360 px erkennbar und antippbar?)
21. Der Zimtstern-Krimi (eindeutig?)
22. Das Buchstabengitter
23. Das Weihnachts-Suchbild
24–31. Varianten

Pro Rätsel:
- **Antworten:**
  - Groß/klein, Umlaute (ä/ae), ß/ss, Leerzeichen, Bindestrich, Artikel („der Igel“) werden toleriert.
  - Falsche Antwort gibt freundliche Rückmeldung.
- **Bedienung:**
  - Die Samsung-Tastatur verdeckt das Eingabefeld nicht.
  - Kein Zoom beim Fokussieren (Schriftgröße ≥ 16 px).
  - Tippen und Ziehen funktionieren, kein versehentliches Scrollen beim Wischen.
- Neuladen mitten im Rätsel: Was geht verloren? Ist das akzeptabel?
- Schließen und wieder öffnen.
- Nach dem Lösen kommen Belohnung, Geschichte, Shop-Hinweis und Konfetti.
- Rätsel, Texte und Bilder passen in 360 px ohne horizontales Scrollen.
- **Schwierigkeit:** Für Ute machbar? Gibt es Hilfen/Tipps? Bleibt man irgendwo hängen ohne Ausweg?

---

## 8. Spielecke

Heuballen-Turm, Waschbär-Alarm, Pinguin-Rutsche:
- Steuerung per Touch auf Samsung.
- Flüssig (Bildrate), keine Ruckler auf einem Mittelklasse-Handy (CPU-Drosselung 4× in DevTools simulieren).
- Rekorde werden gespeichert. Die Meilenstein-Taler kommen einmalig mit „Überraschung!“-Hinweis.
- Spiel schließen mitten im Lauf, Tab-Wechsel und Bildschirm-Sperre: Das Spiel pausiert oder endet sauber. Keine Schleife läuft im Hintergrund weiter (Akku!).
- Die Aufgabe des Tages „Spiele eine Runde“ zählt korrekt.

---

## 9. Extras

- **Heute im Gehege:** Tier des Tages mit Fakt (Fakten korrekt?), Kalles Tagebuch (passt zu dem, was wirklich passiert ist), Aufgabe des Tages (10 Varianten; Fortschritt zählt; Belohnung genau einmal; neuer Tag ergibt neue Aufgabe).
- **Zufallsereignisse:**
  - Schmetterling, Sternschnuppe, Taler-Fund, Rocky, Schneesturm.
  - Max. 4 pro Tag.
  - Nur wenn das Gehege sichtbar ist und kein Fenster offen ist.
  - Schneesturm endet nach 20 s.
- **Besucher und Spendenbox:** Sprüche, Spende pro Tag richtig berechnet (`min(20, 2 + 0,6 × Anzahl Teile)`), einmal pro Tag.
- **20 Abzeichen:**
  - Jedes einzeln auslösen.
  - Die Meldung kommt einmal.
  - Der Punkt am Knopf zeigt nicht abgeholte Abzeichen.
  - Taler gibt es erst beim Antippen.
  - Alte Spielstände ohne `claimed` werden nicht doppelt bezahlt.
- **Spieluhr:** An/aus, merkt sich die Einstellung. Startet nach dem Neuladen erst nach dem ersten Tippen (Autoplay-Regel). Läuft nicht doppelt.
- **Ton aus/an** (Lautsprecher-Knopf): Wirklich alle Töne aus, auch Munkel-Szenen, Spiele und Orchester-Rätsel?
- **Keks:** Täglich an einer anderen Stelle, antippbar, nicht unter anderen Elementen versteckt.
- **Erinnerungen / Polaroid-Album** mit Fotos `01–26`.
- **Spielstand sichern (Schild-Symbol):**
  - Link teilen bzw. kopieren und Datei speichern.
  - Wiederherstellen per Link, Einfügen und Datei.
  - Ungültiger Code gibt freundliche Meldung.
  - Der Hinweis „lange nicht gesichert“ kommt ab 3 gelösten Türchen nach 7 Tagen.
  - **Rundreise testen:** Sichern → leeren → Wiederherstellen ergibt genau denselben Stand (alle Schlüssel inkl. Munkel, Extras, Gehege).
  - Funktioniert der Link in Samsung Internet und WhatsApp (Länge der URL!)?

---

## 10. Schloss-Bildschirm und Navigation

- Text: „Hier wartet etwas ganz Besonderes auf dich, liebe Mama.“ / „Das Schloss öffnet sich am 28. November um 9 Uhr morgens.“ Zeilenumbruch sauber, nichts abgeschnitten.
- Countdown-Uhr, Brief-Symbol am Schloss, Knopf „Munkels Szenen“ mit Zähler: alles überlappungsfrei auf 360 px, auch mit Sprechblasen und Gegenständen.
- Während des Schlosses ist keine Navigation sichtbar und nichts dahinter antippbar.
- Navigation nach dem Öffnen auf 360 px:
  - Alle Symbole sind sichtbar (Sichern, Abzeichen, Spieluhr, Ton, Hilfe), Taler, Gehege-Zähler, Spiele, Shop.
  - Kein horizontales Scrollen (`scrollWidth` = Viewport).
  - Mit großer Schrift prüfen (siehe 11).
- Kalle unten links: Sprechblasen verdecken auf dem Handy keine Inhalte. 5× streicheln zählt für die Aufgabe.

---

## 11. Darstellung auf dem Samsung – Spezialfälle

- **Samsung Internet Dunkelmodus** (Einstellung „Dunkler Modus“ bzw. „Websites dunkel anzeigen“). Er kann Farben von Seiten erzwingen. Mit `colorScheme: 'dark'` und, wenn möglich, Simulation der erzwungenen Abdunklung prüfen: Bleibt alles lesbar? Wirken die Bilder nicht kaputt? Ist `<meta name="color-scheme">` gesetzt?
- **Große Schrift:** Android-Systemschrift auf 130 % und 150 % (Text-Zoom in Samsung Internet). Brechen Navigation, Türchen, Briefe oder Rätsel?
- Hochformat ↔ Querformat drehen mitten in einer Munkel-Szene, im Rätsel und im großen Gehege: Positionen werden neu berechnet, nichts klebt falsch.
- „Animationen reduzieren“ (`prefers-reduced-motion`): Bleibt alles bedienbar?
- Statusleiste und Gestennavigation (Safe Areas): Unten und oben wird nichts verdeckt.
- **Zum Startbildschirm hinzugefügt (PWA):**
  - Icon, Name und Startfarbe.
  - Der Start im Vollbild funktioniert.
  - Der Vogel und alle Szenen erscheinen auch dort.
  - Die Auto-Aktualisierung lädt die neue Version.
- **Auto-Aktualisierung:**
  - `version.txt` ≠ `BUILD` lädt die Seite neu.
  - Darf **nicht** mitten in einer Munkel-Szene, einem Rätsel, einer Brief-Anzeige, dem Aufschließen oder während der Eingabe neu laden. Prüfen, wann genau geprüft und neu geladen wird.
  - Keine Endlosschleife, wenn `version.txt` fehlt oder Müll enthält.
- Offline bzw. schlechtes Netz: Fehlende Fotos werden sauber ausgeblendet (`onerror`). Schriftarten fallen auf Ersatzschriften zurück.

---

## 12. Gleichzeitigkeit und Fenster-Stapel

- Mehrere Ereignisse gleichzeitig dürfen sich nicht überlagern. Sie stellen sich an (`busy`, `whenFree`, `notify`-Warteschlange).
- Typische Kollisionen gezielt herbeiführen:
  - Nikolaus-Paket + Abzeichen-Meldung + Einzugswellen-Hinweis + Zufallsereignis
  - Weihnachtsmann + Weihnachtsfoto + Rätsel-Fenster
  - Startgeschenk + Intro + Brief
  - Schneesturm + großes Gehege
- Langer Besuch: Seite 3 Stunden offen lassen, mit zeitbeschleunigtem Test oder per Rechnung. Wachsen Intervalle, DOM-Knoten oder Speicher? Laufen mehrere `setInterval` doppelt?
- Zwei Tabs gleichzeitig offen: Kann der Spielstand kaputtgehen (doppelte Taler, überschriebene Käufe)?

---

## 13. Texte

- Alle Texte lesen (Sprechblasen in `texts.js`, Story, Rätsel, Briefe, Hinweise, Abzeichen, Szenen, Tagebuch, Fakten):
  - Rechtschreibung, Grammatik, deutsche Anführungszeichen „…“, Gedankenstrich –.
  - Kein Englisch, keine Platzhalter (`undefined`, `NaN`, `[object Object]`, `${…}`).
- **Anrede:** Tiere, Kalle und Munkel sagen „Ute“, Chris’ Briefe sagen „Mama“. Gesucht wird jede Abweichung.
- **Namen** sind überall gleich: Kalle (Kapibara), Rocky (Waschbär), Mimi (Katze), Bello (Hund, Postbote), Frieda, Pingu, Munkelvogel.
- **Einzahl/Mehrzahl:** „1 Tag / 2 Tage“, „1 Punkt / 2 Punkte“, „1 Taler“ usw.
- **Datumsangaben** in Texten stimmen mit der Logik überein (z. B. „ab dem 1. Dezember“, „Nikolaus“, „18.“).
- Briefe stehen genau wie in `CONFIG` mit Absätzen.

---

## 14. Technik

- Konsole: Bei allen oben genannten Abläufen **null** Fehler und keine Warnungen über fehlende Dateien. Alle Dateien liefern 200, inklusive Fotos und Icons.
- `node --check` für alle `.js`-Dateien.
- Leistung: Ladezeit auf gedrosseltem 4G. Die Fotogröße ist angemessen (Fotos ggf. verkleinern?). Keine Endlos-Animationen mit hoher CPU-Last im Hintergrund (Akku).
- localStorage voll oder gesperrt (privater Modus): Die Seite stürzt nicht ab.
- Jahr: Alles hängt an `CONFIG.year = 2026`. Funktioniert der Jahreswechsel 31.12. 23:59 → 1.1. 0:00 während die Seite offen ist?
- Sicherheit: Nutzereingaben (Tiernamen, eingefügter Sicherungslink) werden nie als HTML ausgeführt.
- `robots.txt` hält Suchmaschinen fern.

---

## 15. Ergebnis – so lieferst du ab

1. Zuerst eine kurze Zusammenfassung: Was wurde geprüft, wie viele Befunde je Schwere.
2. Dann die **Liste aller Befunde**, sortiert nach Schwere:
   - 🔴 **Kritisch:** Ute kommt nicht weiter, Taler und Fortschritt gehen verloren, ein falscher Tag oder ein Absturz.
   - 🟠 **Mittel:** sichtbarer Fehler, Überlappung, falscher Text, unschöne Animation.
   - 🟡 **Klein:** Feinschliff.

   Jeder Befund enthält:
   - Was passiert und was erwartet wäre.
   - Wo im Code (`datei.js:zeile`).
   - Direkter Testlink zum Nachstellen (z. B. `index.html#test-2026-12-06-1830-leer`) und Schritte.
   - Screenshot (Samsung-Profil).
   - Vorschlag zur Behebung in einem Satz.
3. Am Ende fragen, welche Punkte behoben werden sollen. **Erst nach Zustimmung ändern.**
4. Nach dem Beheben: jeden Punkt erneut auf Samsung prüfen, `python3 tools/bump-version.py`, committen, pushen und den Testlink mitschicken. In `main` erst nach Rückfrage mergen.
