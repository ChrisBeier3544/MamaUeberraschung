/* =========================================================
   Texts – alle Sprechblasen, je 20 Varianten.
   Texts.say("liste", {platzhalter}) zieht wie aus einer Wundertüte:
   Ein Spruch kommt erst wieder, wenn alle anderen einmal dran waren.
   ========================================================= */
const Texts = (() => {
  const L = {
    // Kalle unten links
    kalle: [
      "Hallo Ute! 🍊", "Ich bin Kalle, das Kapibara.", "Ganz entspannt bleiben …", "Hast du heute schon ein Türchen geöffnet?", "Streichelst du mich?",
      "Kapibaras sind mit allen befreundet.", "Eine Orange auf dem Kopf ist ein Statement.", "Ich mag Badewannen.", "Rätseln macht hungrig.", "Du schaffst das!",
      "Hast du die Tiere schon gefunden? Die verstecken sich gern.", "Im Shop gibt es neue Kleinigkeiten.", "Ich hab heute schon dreimal gebadet.", "Weißt du, was das Beste am Advent ist? Du.",
      "Mein Lieblingswetter: warm und nass.", "Pssst … hinter den Päckchen sitzt manchmal wer.", "Wenn ich groß bin, werde ich Bademeister.", "Kakao? Kakao!",
      "Ich zähle schon die Tage bis Weihnachten.", "Danke, dass du dich so lieb um uns kümmerst.",
    ],
    // Kalle erinnert ans Füttern – {N} = "ein Tier hat" / "3 Tiere haben"
    hunger: [
      "Psst, Ute: {N} Hunger! Futter gibt's im Shop.", "Ute, {N} Hunger – schau mal ins Gehege.", "Hörst du das Magenknurren? {N} Hunger.", "Oh je, {N} Hunger. Futter kostet nur 1 Taler.",
      "Ich will ja nicht drängeln, aber {N} Hunger.", "Notfall im Gehege: {N} Hunger!", "Kleiner Hinweis von Kalle: {N} Hunger.", "{N} Hunger. Das sieht man sofort.",
      "Im Gehege ist es so still … {N} Hunger.", "Ute? {N} Hunger. Einfach das Tier antippen!", "Ich hab nachgezählt: {N} Hunger.", "Kannst du mal nachsehen? {N} Hunger.",
      "Leise gesagt: {N} Hunger.", "Die Näpfe sind leer – {N} Hunger.", "Wenn du kurz Zeit hast: {N} Hunger.", "Ich würde ja teilen, aber {N} Hunger.",
      "Schon gemerkt? {N} Hunger.", "Ein kleiner Snack wäre schön – {N} Hunger.", "Kalle meldet: {N} Hunger!", "Bevor ich's vergesse: {N} Hunger.",
    ],
    // Überschrift nach einem gelösten Rätsel
    lob: [
      "Bravo, Ute!", "Glänzend kombiniert!", "Messerscharf gelöst!", "Respekt!", "Elegant gemacht!", "Klasse!", "Sauber gelöst!", "Tierisch gut!", "Ganz große Klasse!", "Wie immer souverän!",
      "Meisterhaft!", "Das war spitze!", "Einfach genial!", "Die Tiere jubeln!", "Kalle ist beeindruckt!", "Was für ein Köpfchen!", "Volltreffer!", "Mit Leichtigkeit!", "Großartig gelöst!", "Chapeau, Ute!",
    ],
    // geschlossene Türchen – {T} = "3 Tage"
    gesperrt: [
      "Nicht schummeln, Ute! Noch {T}.", "Die Katze sitzt noch auf diesem Päckchen. Noch {T}.", "Der Waschbär hat abgeschlossen. Noch {T}.", "Gut Ding will Weile haben – noch {T}.",
      "Hier wird noch geprobt. Premiere in {T}.", "Kalle sagt: Geduld! Noch {T}.", "Das Päckchen ist noch zugeklebt. Noch {T}.", "Psst, noch nicht! Noch {T}.",
      "Die Schleife hält noch fest. Noch {T}.", "Der Pinguin bewacht dieses Türchen. Noch {T}.", "Zu früh! Noch {T}.", "Noch ein bisschen schlafen: {T}.",
      "Die Tiere packen noch ein. Noch {T}.", "Hier ist noch Baustelle. Noch {T}.", "Vorfreude ist die schönste Freude – noch {T}.", "Der Igel sitzt drauf und lässt nicht los. Noch {T}.",
      "Erst Plätzchen, dann Türchen: noch {T}.", "Dieses Kapitel wird noch geschrieben. Noch {T}.", "Klopf, klopf … niemand da. Noch {T}.", "Bald, ganz bald! Noch {T}.",
    ],
    // nach einem Kauf: erster Satz mit {item}
    neuesTeil: [
      "Oh, {item}! Wie schön!", "Schaut mal, {item}!", "Wow – {item}! Ist das für uns?", "{item}! Das ist ja großartig!", "Ein neues Teil: {item}! Hurra!",
      "Ist das etwa {item}? Wie toll!", "{item} – genau das hat gefehlt!", "Juhu, {item}!", "Na so was: {item}! Danke, Ute!", "{item}! Ich bin begeistert.",
      "Seht nur, {item}!", "Oh, wie hübsch: {item}!", "{item}? Ich glaub's ja nicht!", "Endlich {item}!", "Da ist ja {item}! Herrlich!",
      "Ute hat uns {item} besorgt!", "Hallo, {item}! Willkommen im Gehege.", "{item} – sieht das gut aus!", "Neu bei uns: {item}!", "Was für eine Überraschung: {item}!",
    ],
    // nach einem Kauf: zweiter und dritter Satz
    freude: [
      "Hier fühle ich mich gleich viel wohler.", "Genau das hat uns gefehlt!", "Danke, Ute – das ist wunderbar!", "Jetzt ist es richtig gemütlich hier.", "Wie hübsch! Das muss ich sofort Kalle zeigen.",
      "Ich glaube, das wird mein neuer Lieblingsplatz.", "So ein schönes Zuhause hatte ich noch nie.", "Ich bin ganz gerührt.", "Unser Gehege wird immer schöner!", "Ute hat wirklich Geschmack.",
      "Hier bleibe ich für immer.", "Das ist ja wie im Urlaub!", "Ich muss das sofort allen erzählen.", "Schöner geht's kaum.", "Jetzt fühlt sich das hier wie Zuhause an.",
      "Ich könnte vor Freude hüpfen!", "Ute, du bist die Allerbeste!", "Das macht den ganzen Tag schöner.", "Ab heute ist das mein Platz!", "So viel Liebe zum Detail!",
    ],
    // Füttern: Anfang mit {food}, dann ein Nachsatz
    futterAn: [
      "Mmmh, {food}!", "Oh, {food}!", "{food}! Mein Lieblingsessen!", "Juhu, {food}!", "Lecker, {food}!", "{food} – genau richtig!", "Für mich? {food}!", "Ich liebe {food}!", "{food}! Danke!", "Ah, {food}!",
      "Endlich {food}!", "{food}, mjam!", "Oh ja, {food}!", "Wow, {food}!", "{food}! Wie lecker!", "Hurra, {food}!", "Mjam, {food}!", "{food} für mich?!", "Schau, {food}!", "Mmmh … {food}.",
    ],
    futterNach: [
      "Danke, Ute!", "Du bist die Beste!", "Mehr davon, bitte!", "Jetzt geht's mir wieder gut!", "Lecker, lecker!", "Das war genau richtig.", "Ich bin so glücklich!", "Mein Bauch tanzt.",
      "Ich hab dich lieb!", "Das hat gefehlt.", "Jetzt kann ich wieder spielen!", "Himmlisch!", "Bestes Futter der Welt.", "Ich bin ganz satt und froh.", "Kann ich morgen wieder was haben?",
      "Du verwöhnst uns!", "So schmeckt Glück.", "Mjam mjam!", "Danke, danke, danke!", "Jetzt bin ich wieder fröhlich!",
    ],
    // traurige, hungrige Tiere
    traurig: [
      "Ich hab solchen Hunger …", "Bekomme ich heute nichts?", "Mein Bauch knurrt …", "Ein kleiner Snack wäre schön …", "Hat jemand an mich gedacht?", "Mir ist ganz flau im Magen.",
      "Ich warte auf mein Futter …", "Schnüff …", "Ich bin so traurig.", "Gibt's bald was zu essen?", "Mein Napf ist leer.", "Ich träume schon von Futter.", "Hunger, Hunger, Hunger …",
      "Bitte, Ute, nur ein Häppchen.", "Ich hab keine Kraft mehr zum Spielen.", "Seit gestern nichts …", "Alle anderen haben gegessen …", "Mein Magen macht komische Geräusche.", "Ich bin ganz schlapp.", "Wann gibt's Futter?",
    ],
    // Tiere benutzen Sachen im Gehege
    trinken: [
      "*schlürf*", "Ahh, erfrischend!", "Ein Schlückchen geht immer.", "*schlabber schlabber*", "Kühles Wasser – herrlich.", "Prost, alle zusammen!", "Durst gelöscht!", "*gluck gluck*", "Das tut gut.", "Wasser marsch!",
      "Frisch wie ein Bergbach.", "Noch ein Schluck …", "*plitsch*", "So lecker kann Wasser sein.", "Ich hatte so Durst!", "Jetzt bin ich wieder fit.", "*schlürf schlürf*", "Ein Tröpfchen für mich.", "Hmm, schön kalt.", "Wer hat noch Durst?",
    ],
    essen: [
      "*mampf mampf*", "Lecker!", "Ein Plätzchen, bitte!", "Mit extra Sahne!", "Hmm, köstlich.", "Ich nehm noch eins.", "*knusper*", "Das schmeckt nach Weihnachten.", "Mein Bauch freut sich.", "Nur noch ein ganz kleines Stück …",
      "Wer hat das gebacken? Himmlisch!", "*schmatz*", "Mahlzeit!", "Lecker, lecker, lecker!", "Davon könnte ich jeden Tag essen.", "Ich teile auch. Vielleicht.", "Krümel inklusive!", "Hier gibt's das Beste.", "Zum Glück ist Advent.", "Satt und zufrieden.",
    ],
    schlafen: [
      "Zzz …", "Nur fünf Minuten …", "So kuschelig hier …", "*gähn*", "Gute Nacht, alle zusammen.", "Ich mach nur kurz die Augen zu.", "Herrlich weich.", "Zzz … Mandarinen … zzz", "Nicht stören, ich träume.", "Mittagsschlaf ist heilig.",
      "Schön warm hier.", "*schnarch*", "Ich bleib einfach liegen.", "Kuschelzeit!", "Ich könnte ewig hier liegen.", "Psst, ich schlafe.", "So gemütlich war es noch nie.", "Weck mich zum Abendessen.", "Kurz ausruhen.", "Zzz … zzz …",
    ],
    spielen: [
      "Juhu!", "Huiii!", "Noch eine Runde!", "Ich bin ganz oben!", "Höher!", "Schneller!", "Das macht so Spaß!", "Wer will mitspielen?", "Pirouette!", "Guck mal, was ich kann!",
      "Nochmal, nochmal!", "Ich bin der Schnellste!", "Wheee!", "Achtung, ich komme!", "Das ist besser als Rätseln!", "Hui, mir ist ganz schwindelig.", "Bestes Gehege der Welt!", "Ich kann gar nicht mehr aufhören.", "Hast du das gesehen?", "Einmal noch, bitte!",
    ],
    ball: [
      "Fang!", "Tor!", "Abgefangen!", "Zu mir, zu mir!", "Kick!", "Pass auf!", "Volltreffer!", "Der Ball ist meiner!", "Hoppla!", "Weit geschossen!",
      "Wer holt ihn?", "Ich bin ein Profi.", "Elfmeter!", "Ball-Alarm!", "Noch ein Schuss!", "Hinterher!", "Was für ein Dribbling!", "Kopfball!", "Rollt und rollt …", "Spiel mit mir!",
    ],
    waermen: [
      "Schön warm!", "Ahhh … herrlich.", "Das wärmt die Pfoten.", "So mollig.", "Da taut man richtig auf.", "Wie im Spa!", "Wärme von oben bis unten.", "Mmmh, gemütlich.", "Hier bleibe ich bis Silvester.", "Kalt? Was ist kalt?",
      "Perfekte Temperatur.", "Meine Ohren werden warm.", "So lässt sich der Winter aushalten.", "*seufz* wie schön.", "Das tut den Knochen gut.", "Warme Füße, glückliches Tier.", "Einfach mal entspannen.", "Wellness pur.", "Wer braucht schon Sommer?", "Ich glühe vor Glück.",
    ],
    staunen: [
      "Ist das schön hier.", "Ich staune nur.", "Das muss ich mir genauer ansehen.", "Wunderschön!", "Wer hat das so schön gemacht?", "Ute natürlich!", "Das glitzert ja!", "Ich mach ein Foto im Kopf.", "So hübsch!", "Ich könnte stundenlang gucken.",
      "Das ist ja zauberhaft.", "Hach …", "Unser Gehege ist das schönste.", "Da wird mir ganz warm ums Herz.", "Einfach toll.", "Wie im Bilderbuch.", "Das erzähl ich meiner Oma.", "Bezaubernd!", "Ich bin hin und weg.", "Schau mal da!",
    ],
  };
  const bags = {}, lastPick = {};
  function next(name) {
    const list = L[name];
    if (!bags[name] || !bags[name].length) {
      const a = list.slice();
      for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
      if (a.length > 1 && a[a.length - 1] === lastPick[name]) [a[0], a[a.length - 1]] = [a[a.length - 1], a[0]];
      bags[name] = a;
    }
    return (lastPick[name] = bags[name].pop());
  }
  function say(name, vars = {}) {
    let t = next(name);
    for (const [k, v] of Object.entries(vars)) t = t.split("{" + k + "}").join(v);
    return t.charAt(0).toUpperCase() + t.slice(1);
  }
  return { say, next, lists: L };
})();
