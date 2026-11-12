/* =========================================================
   Zoo – Geschichte, Taler, Shop und das Gehege, das mit
   jedem Kauf schöner wird
   ========================================================= */
const Zoo = (() => {
  /* ---------- Die Geschichte: ein Kapitel pro Türchen ---------- */
  // item = was an diesem Tag im Shop freigeschaltet wird, coins = Belohnung fürs Rätsel
  const STORY = {
    1: { item: "rasen", coins: 100, story: "Liebe Mama, ich bin Kalle, das Kapibara. Wir Tiere wohnen in einem kleinen Gehege am Stadtrand – und ehrlich gesagt ist es furchtbar: matschiger Boden, ein kaputter Zaun, kein einziger Baum. Unser alter Pfleger ist in Rente gegangen, und jetzt hoffen wir alle auf dich. Wirst du unsere neue Gehege-Direktorin? Fangen wir klein an: Unsere Pfoten versinken im Matsch. Frischer Rasen wäre ein Traum.", outro: "Deine ersten Taler! Im Shop wartet frischer Rasen auf dich." },
    2: { item: "zaun", coins: 100, story: "Heute Nacht hat der Wind den alten Zaun endgültig umgeweht. Rocky, der Waschbär, war schon zweimal draußen und hat die Mülltonnen der Nachbarn „inspiziert“. Es wird Zeit für einen neuen Zaun!", outro: "Mit diesen Talern reicht es für einen stabilen Holzzaun. Rocky ist enttäuscht." },
    3: { item: "baeume", coins: 100, story: "Die Katzen beschweren sich: kein Baum zum Klettern, kein Ast zum Draufliegen. Mimi hat versucht, stattdessen auf Kalle zu klettern. Kalle fand das nur mäßig entspannend. Zwei Bäume müssen her.", outro: "Zwei Bäume liegen jetzt im Shop bereit. Die Katzen sitzen schon in den Startlöchern." },
    4: { item: "teich", coins: 100, story: "Kapibaras ohne Wasser sind wie Weihnachten ohne Plätzchen. Kalle sitzt seit Tagen in einer Pfütze und tut so, als wäre es ein See. Kaufen wir ihm einen richtigen Teich?", outro: "Ein echter Teich! Kalle hat schon sein Handtuch geholt." },
    5: { item: "futter", coins: 100, story: "Beim Frühstück gab es Streit: Alle fressen aus einer einzigen alten Schüssel, und heute hat sich der Pinguin hineingesetzt. Eine ordentliche Futterstation würde den Frieden retten.", outro: "Futter für alle, und jeder bekommt seinen eigenen Napf." },
    6: { item: "laternen", coins: 150, story: "Nikolaus! Heute Abend wollen die Tiere ihre Stiefel rausstellen. Aber es wird so früh dunkel, dass der Nikolaus das Gehege glatt übersehen würde. Ein paar Laternen würden helfen.", outro: "Mit Laternen findet der Nikolaus garantiert den Weg." },
    7: { item: "buehne", coins: 100, story: "Die Tiere haben ein Orchester gegründet. Leider proben sie zwischen Futternapf und Pfütze, und die Akustik ist … ausbaufähig. Eine kleine Bühne wäre wunderbar.", outro: "Die Bühne ist im Shop. Das Orchester stimmt schon mal die Instrumente." },
    8: { item: "huette", coins: 100, story: "Skandal: Rocky hat die Keksvorräte geplündert. Schon wieder. Wir brauchen eine Vorratshütte mit einem Code-Schloss, das selbst ein Waschbär nicht knackt.", outro: "Eine Vorratshütte mit Schloss. Rocky hat sich schon Notizen gemacht." },
    9: { item: "blumen", coins: 100, story: "Ein grauer Dezember braucht Farbe! Die Hasen wünschen sich Blumenbeete – Christrosen und Winterlinge blühen sogar im Schnee.", outro: "Blumenbeete für die Hasen. Sie versprechen, nur ein bisschen davon zu essen." },
    10: { item: "hoehle", coins: 100, story: "Die Nächte werden kalt. Die Kleinen frieren und kuscheln sich nachts an den Elefanten, der dadurch kaum schlafen kann. Eine warme Kuschelhöhle muss her.", outro: "Eine Kuschelhöhle! Der Elefant bedankt sich mit einem langen, zufriedenen Seufzer." },
    11: { item: "schild", coins: 100, story: "Spaziergänger fragen ständig, was das hier eigentlich für ein Gehege ist. Zeit für ein ordentliches Schild am Eingang – mit deinem Namen darauf!", outro: "Ab sofort steht es schwarz auf weiß: Das ist Mamas Tiergehege." },
    12: { item: "bank", coins: 100, story: "Die Nachbarinnen vom Lindenweg kommen jetzt regelmäßig zu Besuch. Damit sie nicht im Stehen plaudern müssen, braucht es eine gemütliche Parkbank.", outro: "Eine Bank für Besuch. Die Katzen haben sie natürlich schon reserviert." },
    13: { item: "weg", coins: 100, story: "Nach dem Regen ist der Eingang eine einzige Matschbahn. Der Igel hat sich gestern verlaufen und ist erst nach Stunden wieder aufgetaucht. Ein Kiesweg würde allen helfen.", outro: "Ein richtiger Weg – nie wieder verlorene Igel." },
    14: { item: "onsen", coins: 100, story: "Kalle hat einen Wunsch und trägt ihn sehr höflich vor: eine heiße Badewanne. In Japan haben Kapibaras so etwas. Er sagt, er sei nicht neidisch. Er ist es aber ein bisschen.", outro: "Kalles Badewanne ist im Shop. Er hat schon eine Mandarine bereitgelegt." },
    15: { item: "kletter", coins: 100, story: "Die jungen Tiere langweilen sich und haben vor Übermut die Bank angeknabbert. Ein Kletterbaum würde ihre Energie in die richtigen Bahnen lenken.", outro: "Ein Kletterbaum für die Wilden. Die Bank atmet auf." },
    16: { item: "vogelhaus", coins: 100, story: "Eine Fledermaus hat eine verschlüsselte Nachricht geschickt: Sie und ihre Freunde, die Wintervögel, suchen ein Zuhause. Ein Vogelhäuschen wäre die perfekte Einladung.", outro: "Das Vogelhäuschen ist bereit für die neuen Mitbewohner." },
    17: { item: "spielplatz", coins: 100, story: "Im Gehege gibt es Nachwuchs! Ein Lämmchen, zwei Ferkel und ein kleiner Fuchs toben herum. Für die Kleinen braucht es einen Sandkasten mit Rutsche.", outro: "Ein Spielplatz für die Kleinen – die Großen wollen natürlich auch rutschen." },
    18: { item: "lichter", coins: 100, story: "Heute Morgen stand ein riesiges Paket vor dem Tor. Auf dem Deckel klebt ein Silbenrätsel und ein Zettel: „Nur für die Gehege-Direktorin.“ Kalle meint, das Paket öffnet sich erst, wenn jemand Kluges das Rätsel löst.", outro: "Im Paket steckt eine Lichterkette – und sieben kleine Päckchen mit den Zahlen 25 bis 31! Der Adventskalender geht nach Weihnachten weiter." },
    19: { item: "schneemann", coins: 100, story: "Der erste richtige Schnee! Leider verschlafen ihn die Siebenschläfer. Weck sie auf – dann bauen alle zusammen einen Schneemann.", outro: "Alle sind wach, und im Shop wartet ein Schneemann." },
    20: { item: "fotowand", coins: 100, story: "Die Tiere wollen ein Weihnachtsfoto für ihre Verwandten in anderen Zoos machen. Dafür brauchen sie eine schöne Fotowand.", outro: "Die Fotowand steht bereit. Bitte recht freundlich!" },
    21: { item: "stand", coins: 100, story: "Nach dem Zimtstern-Vorfall hat Kalle beschlossen: Plätzchen gibt es ab jetzt ganz offiziell, an einem eigenen Plätzchenstand. Vorher muss aber der Dieb gefunden werden.", outro: "Fall gelöst! Der Plätzchenstand bekommt ein großes Schild: „Bitte nicht waschen.“" },
    22: { item: "rodel", coins: 100, story: "Der Schnee bleibt liegen! Die Pinguine wollen rodeln, die Otter auch, und Kalle will zuschauen. Ein Rodelhügel muss her.", outro: "Der Rodelhügel ist im Shop. Die Pinguine haben schon ihre Bäuche aufgewärmt." },
    23: { item: "bruecke", coins: 100, story: "Morgen kommt die ganze Tierfamilie zum Weihnachtsfoto, aber die Hälfte will am Teich keine nassen Füße bekommen. Eine kleine Brücke wäre die Lösung.", outro: "Eine Brücke über den Teich. Morgen ist Heiligabend!" },
    24: { item: "tanne", coins: 150, story: "Heiligabend. Das Gehege ist kaum wiederzuerkennen. Jetzt fehlt nur noch eins: ein echter Weihnachtsbaum, unter dem sich alle versammeln können.", outro: "Frohe Weihnachten! Der Weihnachtsbaum ist im Shop – und unter dem Baum liegt ein Brief für dich." },
    25: { item: "eisbahn", coins: 100, story: "Erster Weihnachtstag! Der Teich ist über Nacht zugefroren, und die Pinguine haben ihn sofort zur Eisbahn erklärt. Mit Bande und Fähnchen wäre sie perfekt.", outro: "Die Eisbahn ist eröffnet. Bitte nicht drängeln, Pinguine." },
    26: { item: "iglu", coins: 100, story: "Zweiter Weihnachtstag. Den Eisbären ist die Kuschelhöhle zu warm. Sie wünschen sich ein Iglu – ganz klassisch.", outro: "Ein Iglu für die Eisbären. Die Pinguine wollen Untermieter werden." },
    27: { item: "kakao", coins: 100, story: "Nach dem Eislaufen frieren alle. Ein Kakao-Stand mit Sahne und Marshmallows würde die Stimmung retten.", outro: "Kakao für alle. Der Mops möchte bitte die doppelte Portion Sahne." },
    28: { item: "feuer", coins: 100, story: "Die Abende zwischen den Jahren sind lang. Die Tiere möchten am Lagerfeuer sitzen und sich Geschichten erzählen – am liebsten die von der neuen Direktorin.", outro: "Ein Lagerfeuer. Heute Abend erzählt Kalle, wie alles anfing." },
    29: { item: "teleskop", coins: 100, story: "Rocky behauptet, er hätte einen Stern mit Waschbär-Maske gesehen. Niemand glaubt ihm. Mit einem Teleskop ließe sich das klären.", outro: "Ein Teleskop! Rocky sucht schon den Himmel ab." },
    30: { item: "karussell", coins: 100, story: "Der Elefant hat einen Traum: einmal Karussell fahren. Er verspricht, sich ganz leicht zu machen.", outro: "Ein Karussell! Der Elefant hat Tränen in den Augen." },
    31: { item: "feuerwerk", coins: 150, story: "Silvester! Das letzte Türchen. Alle Tiere sitzen auf der Bank, im Iglu und auf dem Rodelhügel und warten auf Mitternacht. Es fehlt nur noch das Feuerwerk – ein leises natürlich, wegen der Tiere.", outro: "Kauf das Feuerwerk im Shop – und dann: Frohes neues Jahr!" },
  };

  /* ---------- Shop-Artikel ---------- */
  // [key, Name, Preis, Beschreibung, Vorschau-Ausschnitt x y w h]
  const ITEMS = [
    ["rasen", "Frischer Rasen", 60, "Saftig grünes Gras statt Matsch.", [380, 300, 240, 140]],
    ["zaun", "Neuer Holzzaun", 90, "Stabil, schön und waschbärsicher.", [0, 170, 330, 120]],
    ["baeume", "Zwei Bäume", 110, "Schatten, Äste und Kletterspaß.", [190, 120, 150, 180]],
    ["teich", "Teich", 170, "Endlich richtig planschen.", [630, 380, 340, 140]],
    ["futter", "Futterstation", 70, "Ein Napf für jeden.", [310, 330, 110, 90]],
    ["laternen", "Laternen", 120, "Warmes Licht für dunkle Abende.", [600, 360, 90, 130]],
    ["buehne", "Bühne", 140, "Für das Tier-Orchester.", [605, 180, 150, 120]],
    ["huette", "Vorratshütte", 90, "Mit waschbärsicherem Schloss.", [825, 190, 120, 110]],
    ["blumen", "Blumenbeete", 70, "Christrosen und Winterlinge.", [240, 530, 260, 80]],
    ["hoehle", "Kuschelhöhle", 130, "Warm, weich und gemütlich.", [20, 320, 150, 100]],
    ["schild", "Eingangsschild", 60, "„Mamas Tiergehege“", [10, 510, 150, 100]],
    ["bank", "Parkbank", 80, "Für Besuch und Katzen.", [545, 245, 90, 50]],
    ["weg", "Kiesweg", 110, "Nie wieder verlaufene Igel.", [400, 280, 220, 320]],
    ["onsen", "Kalles Badewanne", 170, "Heißes Bad mit Mandarinen.", [550, 330, 130, 90]],
    ["kletter", "Kletterbaum", 100, "Für die wilden Kleinen.", [370, 160, 90, 130]],
    ["vogelhaus", "Vogelhäuschen", 70, "Ein Zuhause für Wintervögel.", [300, 170, 70, 120]],
    ["spielplatz", "Spielplatz", 150, "Sandkasten mit Rutsche.", [420, 360, 130, 90]],
    ["lichter", "Lichterkette", 90, "Funkelt am ganzen Zaun.", [0, 170, 330, 80]],
    ["schneemann", "Schneemann", 70, "Mit Karottennase und Schal.", [930, 480, 70, 120]],
    ["fotowand", "Fotowand", 90, "Bitte recht freundlich!", [140, 480, 110, 120]],
    ["stand", "Plätzchenstand", 120, "Offizielle Plätzchen-Ausgabe.", [735, 190, 95, 105]],
    ["rodel", "Rodelhügel", 160, "Bauchrutschen erlaubt.", [0, 130, 240, 160]],
    ["bruecke", "Brücke", 110, "Trockene Pfoten am Teich.", [710, 400, 180, 90]],
    ["tanne", "Weihnachtsbaum", 220, "Geschmückt, mit Stern.", [430, 70, 140, 230]],
    ["eisbahn", "Eisbahn", 140, "Der Teich als Schlittschuhbahn.", [630, 380, 340, 140]],
    ["iglu", "Iglu", 120, "Für Eisbären mit Stil.", [810, 500, 130, 100]],
    ["kakao", "Kakao-Stand", 90, "Mit Sahne und Marshmallows.", [640, 480, 110, 100]],
    ["feuer", "Lagerfeuer", 80, "Geschichten am Feuer.", [520, 460, 90, 80]],
    ["teleskop", "Teleskop", 110, "Für Sterne mit Maske.", [900, 260, 90, 90]],
    ["karussell", "Karussell", 200, "Auch für Elefanten.", [170, 300, 130, 110]],
    ["feuerwerk", "Feuerwerk", 180, "Leise, bunt und wunderschön.", [0, 0, 1000, 260]],
  ];
  const EXTRAS = [
    ["pilze", "Fliegenpilze", 50, "Rot mit weißen Punkten.", [110, 440, 90, 60]],
    ["zwerg", "Gartenzwerg", 80, "Bewacht das Gehege.", [400, 450, 60, 80]],
    ["vogelbad", "Vogeltränke", 90, "Für die gefiederten Gäste.", [700, 420, 70, 80]],
    ["wimpel", "Wimpelkette", 120, "Bunte Fähnchen im Wind.", [250, 110, 750, 60]],
    ["schaukel", "Reifenschaukel", 150, "Am großen Baum.", [930, 160, 90, 150]],
    ["statue", "Kalle-Statue", 400, "Golden. Gelassen. Ewig.", [215, 420, 90, 100]],
  ];
  // Kleinigkeiten für zwischendurch – günstig und jederzeit kaufbar
  const SMALL = [
    ["ball", "Bunter Ball", 20, "Zum Kicken und Hinterherjagen.", [566, 420, 48, 46]],
    ["wasserschale", "Wassernapf", 15, "Frisches Wasser für alle.", [710, 362, 60, 32]],
    ["giesskanne", "Gießkanne", 20, "Damit die Blumen blühen.", [746, 552, 68, 42]],
    ["meisen", "Meisenknödel", 20, "Für die gefiederten Nachbarn.", [450, 250, 55, 92]],
    ["kissen", "Kuschelkissen", 25, "Weich, rosa, heiß begehrt.", [18, 442, 80, 44]],
    ["kranz", "Kranz am Zaun", 30, "Tannengrün mit roter Schleife.", [402, 192, 56, 62]],
    ["vogel", "Rotkehlchen", 25, "Sitzt am liebsten auf dem Zaun.", [678, 172, 48, 34]],
    ["briefkasten", "Wunschzettel-Briefkasten", 35, "Für Post an den Weihnachtsmann.", [32, 238, 60, 82]],
    ["strohballen", "Strohballen", 30, "Zum Draufsitzen und Reinkuscheln.", [304, 464, 92, 46]],
    ["eiszapfen", "Eiszapfen", 35, "Glitzern am Zaun in der Sonne.", [598, 230, 206, 40]],
    ["kerzen", "Lichtertüten", 40, "Kleine Lichter am Wegrand.", [428, 428, 166, 112]],
    ["windrad", "Windrad", 40, "Dreht sich bei jedem Lüftchen.", [836, 276, 68, 104]],
    ["holz", "Holzstapel", 35, "Für kalte Tage.", [548, 552, 86, 46]],
    ["teddy", "Teddybär", 45, "Wohnt auf der Kuschelhöhle.", [68, 284, 56, 50]],
    ["sternschnuppe", "Sternschnuppe", 60, "Wer sie sieht, darf sich etwas wünschen.", [56, 50, 138, 76]],
  ];
  /* ---------- Futter: jede Tierart frisst etwas anderes ---------- */
  const FOOD = {
    capy: ["Mandarine", `<circle cx="20" cy="22" r="13" fill="#ff9f1c"/><circle cx="15" cy="17" r="3.5" fill="#ffc46b"/><path d="M20 9 q7 -7 12 -2 q-7 3 -12 2z" fill="#4caf50"/>`],
    waschbaer: ["Weintrauben", [[14, 14], [24, 14], [19, 21], [29, 21], [9, 21], [14, 28], [24, 28], [19, 34]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5.5" fill="#8e5ac8"/>`).join("") + `<path d="M19 9 v-5 l6 -2" stroke="#6b4a35" stroke-width="2" fill="none"/>`],
    katze: ["Thunfisch", `<path d="M6 20 q14 -14 28 0 q-14 14 -28 0z" fill="#7d93b2"/><path d="M33 20 l6 -6 v12z" fill="#7d93b2"/><circle cx="12" cy="18" r="1.8" fill="#1a1a1a"/>`],
    hund: ["Knochen", `<rect x="10" y="16" width="20" height="8" rx="4" fill="#fffaf0"/><circle cx="9" cy="15" r="5" fill="#fffaf0"/><circle cx="9" cy="25" r="5" fill="#fffaf0"/><circle cx="31" cy="15" r="5" fill="#fffaf0"/><circle cx="31" cy="25" r="5" fill="#fffaf0"/><path d="M10 16 h20 M10 24 h20" stroke="#e8dcc6"/>`],
    giraffe: ["Akazienblätter", `<path d="M8 34 Q20 20 32 6" stroke="#7a5537" stroke-width="2.5" fill="none"/>` + [[14, 26], [20, 19], [26, 12], [10, 20], [17, 13], [24, 7]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="5" ry="3" fill="#4f9e5c"/>`).join("")],
    fuchs: ["Waldbeeren", [[14, 20], [24, 18], [19, 27], [28, 27], [11, 29]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#d93a4a"/><circle cx="${x - 1.5}" cy="${y - 1.5}" r="1.3" fill="#fff" opacity=".7"/>`).join("") + `<path d="M18 13 q4 -6 10 -6" stroke="#4f9e5c" stroke-width="2" fill="none"/>`],
    panda_rot: ["Bambus", `<rect x="16" y="4" width="8" height="33" rx="3" fill="#8fc66a"/><path d="M16 14 h8 M16 24 h8" stroke="#5f9a45" stroke-width="2"/><path d="M24 12 q8 -4 12 -2 q-6 4 -12 2z M16 22 q-8 -4 -12 -2 q6 4 12 2z" fill="#5aa86a"/>`],
    pinguin: ["Hering", `<path d="M5 20 q15 -12 28 0 q-13 12 -28 0z" fill="#c9d6e3"/><path d="M32 20 l7 -6 v12z" fill="#c9d6e3"/><path d="M10 21 q10 3 20 -1" stroke="#9fb0c2" fill="none"/><circle cx="11" cy="18" r="1.6" fill="#1a1a1a"/>`],
    igel: ["Knusperkörner", `<path d="M6 22 h28 q-2 12 -14 12 q-12 0 -14 -12z" fill="#e85d75"/>` + [[12, 20], [18, 18], [24, 19], [29, 21], [15, 22], [22, 22]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="#a0703f"/>`).join("")],
    hase: ["Möhre", `<path d="M13 12 L29 28 Q31 31 27 31 L11 15z" fill="#f39c32" transform="rotate(10 20 20)"/><path d="M12 12 q-6 -6 -4 -8 M12 12 q-2 -8 2 -8 M12 12 q-8 0 -8 -4" stroke="#4caf50" stroke-width="2.4" fill="none"/>`],
    schaf: ["Heu", `<path d="M8 32 Q12 10 20 8 Q28 10 32 32z" fill="#e8c46b"/><path d="M14 30 q2 -12 6 -18 M20 31 v-20 M26 30 q-2 -12 -6 -18" stroke="#c9a03d" stroke-width="1.6" fill="none"/><rect x="9" y="21" width="22" height="4" fill="#d9534f"/>`],
    schwein: ["Kartoffeln", `<ellipse cx="15" cy="23" rx="9" ry="7" fill="#c9965c"/><ellipse cx="26" cy="19" rx="8" ry="6.5" fill="#b98550"/><circle cx="13" cy="21" r="1" fill="#8a5a33"/><circle cx="27" cy="18" r="1" fill="#8a5a33"/>`],
    elefant: ["Bananen", `<path d="M8 12 Q12 32 32 30 Q16 26 14 10z" fill="#ffd84d"/><path d="M12 10 Q18 28 34 24 Q20 22 18 8z" fill="#f6c531"/><path d="M8 12 l2 -3 M12 10 l2 -3" stroke="#6b4a35" stroke-width="2"/>`],
    otter: ["Muscheln", `<path d="M20 32 L8 14 Q20 4 32 14z" fill="#f5c9a8"/><path d="M20 32 L14 10 M20 32 L20 8 M20 32 L26 10" stroke="#e0a37f" stroke-width="1.6"/>`],
    ente: ["Haferflocken", `<path d="M6 22 h28 q-2 12 -14 12 q-12 0 -14 -12z" fill="#58b6ff"/>` + [[11, 20], [17, 18], [23, 19], [29, 20], [14, 22], [26, 22], [20, 21]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="3" ry="1.8" fill="#f0dcae"/>`).join("")],
    baer: ["Honig", `<path d="M10 14 h20 l-2 20 q-8 3 -16 0z" fill="#d99a2b"/><rect x="9" y="10" width="22" height="6" rx="2" fill="#b07a52"/><path d="M14 18 q2 6 0 9" stroke="#ffd84d" stroke-width="3" fill="none"/><text x="20" y="29" text-anchor="middle" font-size="7" font-weight="700" font-family="Arial, sans-serif" fill="#fff6c9">HONIG</text>`],
  };
  const foodIcon = (sp) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" style="width:100%;height:100%">${FOOD[sp][1]}</svg>`;
  const foodCount = (sp) => st.food[sp] || 0;
  function useFood(sp, id) {
    if (!foodCount(sp)) return false;
    st.food[sp]--; st.fed[id] = Date.now(); save(); return true;
  }
  // Futterpackungen: [Preis, Stück]
  const FOOD_PACKS = [[1, 3], [2, 7], [5, 20]];
  function buyFood(sp, price, qty) {
    if (st.coins < price) return false;
    st.coins -= price; st.food[sp] = foodCount(sp) + qty; save(); refresh(); return true;
  }

  const ALL = [...ITEMS, ...EXTRAS, ...SMALL];
  const anchorOf = (key) => { const [x, y, w, h] = info(key)[4]; const [dx, dy] = (st.pos && st.pos[key]) || [0, 0]; return [x + w / 2 + dx, Math.max(300, Math.min(585, y + h + 6 + dy))]; };
  const info = (key) => ALL.find((i) => i[0] === key);
  const dayOfItem = (key) => +Object.keys(STORY).find((d) => STORY[d].item === key) || 0;

  /* ---------- Spielstand ---------- */
  const KEY = "mama-zoo-" + CONFIG.year;
  let st = { coins: 0, owned: [], paid: {}, food: {}, fed: {}, high: {}, ms: {}, pos: {} };
  const load = () => { try { const r = localStorage.getItem(KEY); if (r) st = Object.assign(st, JSON.parse(r)); } catch (e) {} };
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} };
  const owns = (k) => st.owned.includes(k);
  const available = (key) => { const d = dayOfItem(key); return !d || App.isSolved(d); };

  /* ---------- Zeichnen (Szene 1000 × 600) ---------- */
  const mix = (a, b, t) => { const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)); const x = p(a), y = p(b); return "#" + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, "0")).join(""); };
  const rnd = (seed) => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
  const tree = (x, y, s = 1, c = "#4f9e5c") => `<rect x="${x - 7 * s}" y="${y - 60 * s}" width="${14 * s}" height="${60 * s}" fill="#7a5537"/><circle cx="${x}" cy="${y - 85 * s}" r="${38 * s}" fill="${c}"/><circle cx="${x - 26 * s}" cy="${y - 64 * s}" r="${26 * s}" fill="${c}"/><circle cx="${x + 26 * s}" cy="${y - 66 * s}" r="${28 * s}" fill="${mix(c, "#000000", 0.12)}"/>`;

  const DRAW = {
    rasen: () => `<ellipse cx="500" cy="372" rx="118" ry="58" fill="#a8d78f"/>` + Array.from({ length: 14 }, (_, i) => `<path d="M${410 + (i % 7) * 28} ${352 + Math.floor(i / 7) * 34} q2 -10 4 0 q2 -10 4 0" stroke="#6fae5c" stroke-width="2.5" fill="none"/>`).join(""),
    zaun: () => { let o = ""; for (let x = 5; x < 1000; x += 48) o += `<rect x="${x}" y="196" width="11" height="58" rx="3" fill="#a0703f"/>`; return `<rect y="206" width="1000" height="9" fill="#b9824f"/><rect y="230" width="1000" height="9" fill="#b9824f"/>` + o; },
    baeume: () => tree(262, 262, 1) + tree(972, 262, 1.15, "#5aa86a"),
    teich: () => `<ellipse cx="800" cy="452" rx="152" ry="56" fill="#7fbfe0"/><ellipse cx="800" cy="446" rx="130" ry="42" fill="#a6d8f0"/><ellipse cx="740" cy="440" rx="22" ry="6" fill="#5aa86a"/><path d="M820 455 q12 -5 24 0 M760 470 q12 -5 24 0" stroke="#fff" stroke-width="2.5" fill="none"/>`,
    futter: () => `<rect x="320" y="372" width="90" height="22" rx="8" fill="#8a5a3b"/><ellipse cx="365" cy="372" rx="45" ry="8" fill="#b9824f"/><circle cx="345" cy="368" r="5" fill="#f39c32"/><circle cx="360" cy="366" r="5" fill="#e85d75"/><circle cx="378" cy="368" r="5" fill="#ffd84d"/><rect x="330" y="340" width="6" height="34" fill="#7a5537"/><rect x="394" y="340" width="6" height="34" fill="#7a5537"/><path d="M322 344 L365 326 L408 344z" fill="#c94060"/>`,
    laternen: () => [[645, 470], [160, 470], [990, 420]].map(([x, y]) => `<circle cx="${x}" cy="${y - 100}" r="26" fill="#ffe28a" opacity=".35"/><rect x="${x - 3}" y="${y - 96}" width="6" height="96" fill="#3f3f46"/><rect x="${x - 10}" y="${y - 112}" width="20" height="22" rx="4" fill="#ffe28a" stroke="#3f3f46" stroke-width="3"/><path d="M${x - 12} ${y - 112} L${x} ${y - 122} L${x + 12} ${y - 112}z" fill="#3f3f46"/>`).join(""),
    buehne: () => `<rect x="615" y="258" width="130" height="28" fill="#9c6b45"/><rect x="615" y="258" width="130" height="6" fill="#b9824f"/><rect x="622" y="200" width="6" height="58" fill="#7a5537"/><rect x="732" y="200" width="6" height="58" fill="#7a5537"/><path d="M610 204 L680 178 L750 204z" fill="#e85d75"/><path d="M640 236 q4 -10 8 -2 v-14 M700 232 q4 -10 8 -2 v-14" stroke="#3a2a24" stroke-width="2.5" fill="none"/>`,
    huette: () => `<rect x="840" y="226" width="90" height="62" fill="#9c6b45"/><path d="M830 228 L885 192 L940 228z" fill="#5a3b2e"/><rect x="872" y="250" width="26" height="38" fill="#6b4a35"/><rect x="890" y="264" width="10" height="10" rx="2" fill="#ffd84d"/><path d="M850 240 h18 M850 252 h18" stroke="#7a5537" stroke-width="3"/>`,
    blumen: () => [[300, 572], [430, 586]].map(([x, y], k) => `<ellipse cx="${x}" cy="${y}" rx="62" ry="16" fill="#8a5a3b"/>` + [-44, -26, -8, 10, 28, 46].map((dx, i) => `<path d="M${x + dx} ${y} v-16" stroke="#4f9e5c" stroke-width="3"/><circle cx="${x + dx}" cy="${y - 18}" r="7" fill="${["#e85d75", "#fff", "#ffd84d", "#c77dff", "#ff8fa3", "#fff"][(i + k) % 6]}"/><circle cx="${x + dx}" cy="${y - 18}" r="2.5" fill="#f39c32"/>`).join("")).join(""),
    hoehle: () => `<path d="M24 410 Q24 330 95 326 Q166 330 166 410z" fill="#8f8577"/><path d="M60 410 Q60 368 95 366 Q130 368 130 410z" fill="#3e352d"/><path d="M68 410 q27 -16 54 0" fill="#d9a05c"/><circle cx="60" cy="340" r="5" fill="#7a7065"/>`,
    schild: () => `<rect x="38" y="540" width="8" height="60" fill="#7a5537"/><rect x="122" y="540" width="8" height="60" fill="#7a5537"/><rect x="18" y="512" width="132" height="44" rx="8" fill="#b9824f" stroke="#7a5537" stroke-width="4"/><text x="84" y="531" text-anchor="middle" font-family="Fredoka, Arial, sans-serif" font-size="13" font-weight="700" fill="#fff">Mamas</text><text x="84" y="549" text-anchor="middle" font-family="Fredoka, Arial, sans-serif" font-size="13" font-weight="700" fill="#fff">Tiergehege</text>`,
    bank: () => `<rect x="550" y="262" width="80" height="8" rx="3" fill="#b9824f"/><rect x="550" y="248" width="80" height="7" rx="3" fill="#b9824f"/><rect x="556" y="270" width="6" height="18" fill="#3f3f46"/><rect x="618" y="270" width="6" height="18" fill="#3f3f46"/>`,
    weg: () => `<path d="M440 600 Q470 470 500 400 Q530 330 505 290 L525 290 Q560 340 540 410 Q520 480 560 600z" fill="#e3d3b3"/>` + Array.from({ length: 26 }, (_, i) => { const t = i / 26; return `<circle cx="${470 + Math.sin(t * 7) * 18 + (i % 3) * 14}" cy="${590 - t * 290}" r="3" fill="#cdb998"/>`; }).join(""),
    onsen: () => `<path d="M560 400 q0 -10 10 -10 h100 q10 0 10 10 v-6" fill="none"/><rect x="560" y="370" width="120" height="36" rx="10" fill="#a0703f"/><ellipse cx="620" cy="372" rx="58" ry="10" fill="#9fd8f0"/><path d="M590 360 q-6 -10 0 -20 M620 356 q-6 -10 0 -20 M650 360 q-6 -10 0 -20" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="600" cy="372" r="6" fill="#ff9f1c"/><circle cx="642" cy="374" r="6" fill="#ff9f1c"/><path d="M566 382 h108 M566 394 h108" stroke="#8a5a33" stroke-width="2"/>`,
    kletter: () => `<rect x="404" y="190" width="14" height="96" fill="#7a5537"/><path d="M411 230 L380 206 M411 214 L446 190 M411 250 L444 236" stroke="#7a5537" stroke-width="8" stroke-linecap="round"/><rect x="384" y="198" width="34" height="8" rx="3" fill="#b9824f"/><path d="M444 236 v40" stroke="#d9c7b4" stroke-width="3"/><circle cx="444" cy="278" r="5" fill="#d9c7b4"/>`,
    vogelhaus: () => `<rect x="331" y="210" width="8" height="78" fill="#7a5537"/><rect x="312" y="186" width="46" height="34" fill="#e85d75"/><path d="M306 190 L335 168 L364 190z" fill="#5a3b2e"/><circle cx="335" cy="203" r="7" fill="#3a2a24"/><circle cx="352" cy="180" r="6" fill="#58b6ff"/><path d="M357 180 l6 1 l-6 2z" fill="#f39c32"/>`,
    spielplatz: () => `<rect x="420" y="410" width="80" height="26" rx="4" fill="#d9a05c"/><rect x="424" y="414" width="72" height="18" rx="3" fill="#f3dfb0"/><path d="M500 436 L540 380 L548 380 L548 436" stroke="#58b6ff" stroke-width="6" fill="none"/><rect x="540" y="376" width="14" height="6" fill="#e85d75"/><path d="M500 436 Q520 400 540 382" stroke="#ffd84d" stroke-width="7" fill="none"/>`,
    lichter: () => { let o = `<path d="M0 200 Q83 214 166 200 T333 200 T500 200 T666 200 T833 200 T1000 200" stroke="#3f6b4f" stroke-width="2" fill="none"/>`; for (let i = 0; i < 40; i++) { const x = 12 + i * 25, y = 203 + Math.sin((x / 166) * Math.PI) * 3; o += `<circle cx="${x}" cy="${y + 4}" r="4.5" fill="${["#ff5a7a", "#ffcf3f", "#4fd18b", "#58b6ff", "#c77dff"][i % 5]}"/>`; } return o; },
    schneemann: () => `<circle cx="965" cy="568" r="30" fill="#fff" stroke="#dbe9f3" stroke-width="2"/><circle cx="965" cy="522" r="21" fill="#fff" stroke="#dbe9f3" stroke-width="2"/><circle cx="958" cy="517" r="2.5" fill="#333"/><circle cx="972" cy="517" r="2.5" fill="#333"/><path d="M965 524 l14 4 l-14 2z" fill="#f39c32"/><rect x="944" y="536" width="42" height="8" rx="4" fill="#e85d75"/><rect x="950" y="490" width="30" height="8" fill="#333"/><rect x="955" y="474" width="20" height="18" fill="#333"/>`,
    fotowand: () => `<rect x="152" y="490" width="86" height="80" rx="6" fill="#fff" stroke="#e85d75" stroke-width="6"/><rect x="166" y="570" width="6" height="30" fill="#7a5537"/><rect x="218" y="570" width="6" height="30" fill="#7a5537"/><text x="195" y="536" text-anchor="middle" font-family="Fredoka, Arial, sans-serif" font-size="15" font-weight="700" fill="#e85d75">CHEESE!</text><path d="M168 552 l4 8 l8 3 l-8 3 l-4 8 l-4 -8 l-8 -3 l8 -3z" fill="#ffd84d"/>`,
    stand: () => `<rect x="744" y="236" width="76" height="52" fill="#fff4e3"/><path d="M738 238 h88 l-6 -26 h-76z" fill="#e85d75"/><path d="M751 212 v26 M767 212 v26 M783 212 v26 M799 212 v26 M815 212 v26" stroke="#fff" stroke-width="6"/><rect x="740" y="262" width="84" height="10" fill="#b9824f"/><circle cx="760" cy="258" r="6" fill="#d9a05c"/><circle cx="782" cy="258" r="6" fill="#c98b4a"/><circle cx="804" cy="258" r="6" fill="#d9a05c"/>`,
    rodel: () => `<path d="M0 262 Q40 150 120 140 Q200 150 236 262z" fill="#fff"/><path d="M0 262 Q40 150 120 140 Q200 150 236 262" stroke="#dbe9f3" stroke-width="3" fill="none"/><path d="M118 146 Q150 190 200 252 M126 146 Q160 190 210 252" stroke="#cfe3f0" stroke-width="2" fill="none"/><rect x="170" y="214" width="26" height="6" rx="2" fill="#c94060" transform="rotate(40 183 217)"/>`,
    bruecke: () => `<path d="M716 470 Q800 404 884 470" stroke="#9c6b45" stroke-width="16" fill="none"/><path d="M716 456 Q800 390 884 456" stroke="#7a5537" stroke-width="4" fill="none"/>` + [730, 760, 800, 840, 870].map((x) => `<path d="M${x} ${470 - Math.sin(((x - 716) / 168) * Math.PI) * 33} v-16" stroke="#7a5537" stroke-width="4"/>`).join(""),
    tanne: () => `<rect x="490" y="262" width="22" height="26" fill="#7a5537"/><polygon points="500,92 548,170 452,170" fill="#2f8a52"/><polygon points="500,130 566,222 434,222" fill="#2f8a52"/><polygon points="500,176 584,268 416,268" fill="#2f8a52"/>` +
      [[486, 150, "#e85d75"], [514, 160, "#ffd84d"], [470, 200, "#58b6ff"], [530, 196, "#e85d75"], [500, 210, "#c77dff"], [450, 250, "#ffd84d"], [552, 246, "#58b6ff"], [500, 252, "#e85d75"], [476, 234, "#4fd18b"], [526, 232, "#ffd84d"]].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="6" fill="${c}"/>`).join("") +
      `<polygon points="500,72 506,86 521,86 509,95 513,110 500,101 487,110 491,95 479,86 494,86" fill="#ffd84d"/><rect x="452" y="270" width="26" height="20" fill="#e85d75"/><rect x="462" y="270" width="6" height="20" fill="#fff"/><rect x="524" y="268" width="30" height="22" fill="#58b6ff"/><rect x="536" y="268" width="6" height="22" fill="#fff"/>`,
    eisbahn: () => `<ellipse cx="800" cy="452" rx="152" ry="56" fill="#dff3fb" stroke="#b9e1f2" stroke-width="5"/><path d="M700 450 q50 -20 100 0 t100 0 M730 470 q40 -14 80 0" stroke="#fff" stroke-width="3" fill="none"/>` + [660, 700, 900, 940].map((x, i) => `<path d="M${x} ${i % 3 ? 410 : 432} v-24" stroke="#7a5537" stroke-width="3"/><path d="M${x} ${(i % 3 ? 410 : 432) - 24} l14 5 l-14 5z" fill="${["#e85d75", "#ffd84d", "#58b6ff", "#4fd18b"][i]}"/>`).join(""),
    iglu: () => `<path d="M816 594 Q816 512 874 510 Q932 512 932 594z" fill="#f4fbff" stroke="#cfe3f0" stroke-width="3"/><path d="M826 560 h96 M820 578 h108 M840 540 h68 M874 510 v30 M850 540 v20 M898 540 v20 M860 560 v18 M890 560 v18" stroke="#cfe3f0" stroke-width="2"/><path d="M856 594 Q856 566 874 564 Q892 566 892 594z" fill="#4a5a75"/>`,
    kakao: () => `<rect x="650" y="526" width="80" height="44" fill="#8a5a3b"/><path d="M644 528 h92 l-8 -22 h-76z" fill="#58b6ff"/><path d="M662 506 v22 M680 506 v22 M698 506 v22 M716 506 v22" stroke="#fff" stroke-width="5"/><rect x="664" y="510" width="16" height="14" rx="3" fill="#e85d75"/><path d="M672 504 q-4 -8 0 -14" stroke="#fff" stroke-width="2" fill="none"/><rect x="694" y="510" width="16" height="14" rx="3" fill="#fff"/>`,
    feuer: () => `<ellipse cx="565" cy="528" rx="38" ry="9" fill="#8f8577"/><path d="M540 526 l50 -10 M540 516 l50 10" stroke="#7a5537" stroke-width="7" stroke-linecap="round"/><path d="M548 520 q6 -36 17 -48 q4 20 12 14 q10 16 -2 34z" fill="#f39c32"/><path d="M558 520 q2 -20 9 -26 q6 14 3 26z" fill="#ffd84d"/><circle cx="565" cy="490" r="34" fill="#ffb347" opacity=".18"/>`,
    teleskop: () => `<path d="M935 338 l-14 0 M935 338 l14 0 M935 300 l-16 38 M935 300 l16 38 M935 300 v38" stroke="#3f3f46" stroke-width="4"/><rect x="908" y="282" width="60" height="16" rx="6" fill="#58b6ff" transform="rotate(-28 938 290)"/><rect x="958" y="270" width="12" height="20" rx="3" fill="#3f3f46" transform="rotate(-28 938 290)"/>`,
    karussell: () => `<ellipse cx="235" cy="392" rx="62" ry="12" fill="#c94060"/><rect x="232" y="318" width="6" height="74" fill="#ffd84d"/><path d="M168 330 Q235 290 302 330z" fill="#e85d75"/><path d="M168 330 q11 8 22 0 q11 8 22 0 q11 8 23 0 q11 8 22 0 q11 8 22 0 q11 8 23 0" fill="#fff"/><path d="M190 334 v40 M282 334 v40" stroke="#ffd84d" stroke-width="3"/><ellipse cx="190" cy="372" rx="12" ry="7" fill="#fff"/><ellipse cx="282" cy="372" rx="12" ry="7" fill="#58b6ff"/><circle cx="235" cy="296" r="6" fill="#ffd84d"/>`,
    feuerwerk: () => [[170, 90, "#ff5a7a"], [480, 60, "#ffd84d"], [800, 100, "#58b6ff"], [640, 150, "#c77dff"], [320, 160, "#4fd18b"]].map(([x, y, c], k) => `<g class="fw" style="animation-delay:${k * 0.45}s">` + Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return `<path d="M${x + Math.cos(a) * 12} ${y + Math.sin(a) * 12} L${x + Math.cos(a) * 46} ${y + Math.sin(a) * 46}" stroke="${c}" stroke-width="4" stroke-linecap="round"/>`; }).join("") + `<circle cx="${x}" cy="${y}" r="6" fill="#fff"/></g>`).join(""),
    pilze: () => [[130, 488, 1], [166, 482, 0.8], [148, 470, 0.6]].map(([x, y, s]) => `<rect x="${x - 5 * s}" y="${y - 20 * s}" width="${10 * s}" height="${20 * s}" rx="3" fill="#fff6e8"/><path d="M${x - 18 * s} ${y - 18 * s} Q${x} ${y - 46 * s} ${x + 18 * s} ${y - 18 * s}z" fill="#e5383b"/><circle cx="${x - 6 * s}" cy="${y - 28 * s}" r="${3 * s}" fill="#fff"/><circle cx="${x + 7 * s}" cy="${y - 25 * s}" r="${2.4 * s}" fill="#fff"/>`).join(""),
    zwerg: () => `<path d="M412 520 h36 l-4 -34 h-28z" fill="#4f7fe0"/><circle cx="430" cy="478" r="13" fill="#f5c9a8"/><path d="M416 486 q14 26 28 0 q-14 8 -28 0z" fill="#fff"/><path d="M414 474 L430 440 L446 474z" fill="#e5383b"/><circle cx="430" cy="482" r="3" fill="#e88a8a"/>`,
    vogelbad: () => `<rect x="728" y="458" width="14" height="40" fill="#b9b2a8"/><ellipse cx="735" cy="498" rx="22" ry="6" fill="#a59d93"/><ellipse cx="735" cy="456" rx="30" ry="9" fill="#b9b2a8"/><ellipse cx="735" cy="454" rx="24" ry="5" fill="#9fd8f0"/><circle cx="752" cy="440" r="7" fill="#e85d75"/><path d="M758 440 l6 1 l-6 2z" fill="#f39c32"/>`,
    wimpel: () => `<path d="M260 120 Q630 170 990 120" stroke="#8a5a3b" stroke-width="2" fill="none"/>` + Array.from({ length: 22 }, (_, i) => { const x = 270 + i * 33, y = 120 + Math.sin(((x - 260) / 730) * Math.PI) * 24; return `<polygon points="${x},${y} ${x + 20},${y + 1} ${x + 10},${y + 22}" fill="${["#e85d75", "#ffd84d", "#58b6ff", "#4fd18b", "#c77dff"][i % 5]}"/>`; }).join(""),
    schaukel: () => `<path d="M948 182 v86 M990 182 v86" stroke="#8a7a66" stroke-width="3"/><circle cx="969" cy="278" r="16" fill="none" stroke="#2f2f35" stroke-width="9"/>`,
    ball: () => `<circle cx="590" cy="446" r="16" fill="#fff"/><path d="M574 446 a16 16 0 0 1 32 0z" fill="#e85d75"/><path d="M590 430 a16 16 0 0 1 0 32" fill="none" stroke="#58b6ff" stroke-width="5"/><ellipse cx="590" cy="463" rx="14" ry="3" fill="#000" opacity=".12"/>`,
    wasserschale: () => `<ellipse cx="740" cy="384" rx="26" ry="9" fill="#9aa4b1"/><ellipse cx="740" cy="380" rx="22" ry="6" fill="#9fd8f0"/><path d="M730 379 q5 -2 10 0" stroke="#fff" stroke-width="2" fill="none"/>`,
    giesskanne: () => `<rect x="760" y="566" width="34" height="26" rx="5" fill="#4fae7f"/><path d="M794 572 l16 -12 l3 4 l-15 14z" fill="#4fae7f"/><path d="M766 566 q11 -14 22 0" stroke="#388a61" stroke-width="4" fill="none"/>`,
    meisen: () => `<rect x="467" y="262" width="5" height="76" fill="#7a5537"/><path d="M469 268 h20" stroke="#7a5537" stroke-width="4"/><path d="M487 268 v12" stroke="#c9b79c" stroke-width="2"/><circle cx="487" cy="290" r="10" fill="#c9a26b"/><path d="M479 284 l16 12 M495 284 l-16 12" stroke="#4f9e5c" stroke-width="1.5"/>`,
    kissen: () => `<rect x="24" y="452" width="68" height="30" rx="13" fill="#ff8fa3"/><circle cx="58" cy="467" r="3" fill="#e85d75"/><path d="M30 456 q28 8 56 0" stroke="#ffb3c1" stroke-width="2" fill="none"/>`,
    kranz: () => `<circle cx="430" cy="222" r="17" fill="none" stroke="#2f8a52" stroke-width="9"/><circle cx="418" cy="214" r="3" fill="#e5383b"/><circle cx="442" cy="228" r="3" fill="#e5383b"/><circle cx="436" cy="208" r="3" fill="#e5383b"/><path d="M430 238 l-10 12 M430 238 l10 12" stroke="#e85d75" stroke-width="4"/><circle cx="430" cy="238" r="4" fill="#e85d75"/>`,
    vogel: () => `<ellipse cx="702" cy="192" rx="13" ry="11" fill="#8a5a3b"/><circle cx="712" cy="184" r="7" fill="#8a5a3b"/><ellipse cx="706" cy="194" rx="8" ry="7" fill="#e8743a"/><circle cx="714" cy="182" r="1.6" fill="#1a1a1a"/><path d="M718 184 l5 1 l-5 2z" fill="#3a2a24"/><path d="M690 192 l-8 -4 l2 8z" fill="#6b4a35"/>`,
    briefkasten: () => `<rect x="60" y="272" width="5" height="44" fill="#7a5537"/><rect x="40" y="246" width="44" height="28" rx="10" fill="#ffd84d" stroke="#d4a72c" stroke-width="2"/><rect x="50" y="256" width="20" height="4" rx="2" fill="#5a3b2e"/><path d="M82 252 v-12 h10 v6 h-10" fill="#e5383b"/>`,
    strohballen: () => `<rect x="308" y="478" width="50" height="30" rx="8" fill="#e8c46b"/><rect x="344" y="470" width="48" height="38" rx="8" fill="#dcb354"/><path d="M314 486 h38 M314 496 h38 M350 480 h36 M350 492 h36" stroke="#c9a03d" stroke-width="2"/>`,
    eiszapfen: () => Array.from({ length: 16 }, (_, i) => `<path d="M${604 + i * 12.5} 239 l5 ${12 + ((i * 7) % 16)} l5 -${12 + ((i * 7) % 16)}z" fill="#d6f0fb" stroke="#a9d8ee" stroke-width="1"/>`).join(""),
    kerzen: () => [[448, 470], [574, 450], [440, 532], [584, 516]].map(([x, y]) => `<circle cx="${x}" cy="${y - 8}" r="14" fill="#ffe28a" opacity=".35"/><path d="M${x - 8} ${y} l2 -18 h12 l2 18z" fill="#fff3d6" stroke="#e6cfa0"/><circle cx="${x}" cy="${y - 8}" r="3" fill="#ffb347"/>`).join(""),
    windrad: () => `<rect x="868" y="304" width="4" height="72" fill="#7a5537"/><path d="M870 304 l-22 -12 l12 -10z" fill="#e85d75"/><path d="M870 304 l12 -22 l10 12z" fill="#ffd84d"/><path d="M870 304 l22 12 l-12 10z" fill="#58b6ff"/><path d="M870 304 l-12 22 l-10 -12z" fill="#4fd18b"/><circle cx="870" cy="304" r="3" fill="#fff"/>`,
    holz: () => [[566, 588], [592, 588], [618, 588], [579, 566], [605, 566]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="12" fill="#9c6b45"/><circle cx="${x}" cy="${y}" r="7" fill="#d9a877"/><circle cx="${x}" cy="${y}" r="2.5" fill="#9c6b45"/>`).join(""),
    teddy: () => `<circle cx="96" cy="316" r="15" fill="#b07a52"/><circle cx="96" cy="296" r="11" fill="#b07a52"/><circle cx="87" cy="288" r="5" fill="#b07a52"/><circle cx="105" cy="288" r="5" fill="#b07a52"/><ellipse cx="96" cy="300" rx="5" ry="4" fill="#e3c4a2"/><circle cx="92" cy="294" r="1.6" fill="#2b1a10"/><circle cx="100" cy="294" r="1.6" fill="#2b1a10"/><ellipse cx="96" cy="318" rx="8" ry="9" fill="#e3c4a2"/><path d="M88 307 l8 4 l8 -4 l-8 -3z" fill="#e85d75"/>`,
    sternschnuppe: () => `<path d="M70 110 Q120 96 160 80" stroke="#fff6c9" stroke-width="5" stroke-linecap="round" opacity=".7" fill="none"/><path d="M90 108 Q125 98 158 84" stroke="#ffe28a" stroke-width="2" fill="none"/><polygon points="170,62 175,74 188,75 178,83 181,96 170,89 159,96 162,83 152,75 165,74" fill="#ffd84d"/>`,
    statue: () => `<rect x="226" y="482" width="70" height="30" fill="#d9d2c6"/><rect x="220" y="476" width="82" height="8" fill="#ece6dc"/><g transform="translate(228 430) scale(.55)">${typeof Animals !== "undefined" ? Animals.inner({ sp: "capy", col: 2, acc: "krone" }).content : ""}</g>`,
  };
  const BACK = ["sternschnuppe", "rodel", "wimpel", "baeume", "zaun", "lichter", "eiszapfen", "kranz", "vogel", "schaukel", "vogelhaus", "kletter", "meisen", "tanne", "bank", "buehne", "stand", "huette", "teleskop"];
  const MID = ["briefkasten", "hoehle", "teddy", "kissen", "karussell", "futter", "spielplatz", "onsen", "wasserschale", "windrad", "teich", "eisbahn", "bruecke", "ball", "pilze", "statue", "strohballen", "zwerg", "vogelbad", "laternen"];
  const FRONT = ["feuer", "kerzen", "kakao", "iglu", "blumen", "holz", "giesskanne", "schild", "fotowand", "schneemann"];

  const LIVE = ["ball", "vogel"]; // werden als bewegliche Figuren ins Gehege gesetzt (animals.js)

  function brokenFence() {
    const r = rnd(42);
    let o = "";
    for (let x = 5; x < 1000; x += 48) {
      if (r() < 0.25) continue;
      const tilt = (r() - 0.5) * 30, h = 34 + r() * 24;
      o += `<rect x="${x}" y="${254 - h}" width="10" height="${h}" fill="#8f8577" transform="rotate(${tilt.toFixed(1)} ${x + 5} 254)"/>`;
    }
    for (let x = 0; x < 1000; x += 160) { const w = 60 + r() * 70; o += `<rect x="${x + r() * 40}" y="${214 + r() * 16}" width="${w}" height="7" fill="#9c9183" transform="rotate(${((r() - 0.5) * 14).toFixed(1)} ${x + w / 2} 220)"/>`; }
    return o + `<rect x="300" y="262" width="80" height="7" fill="#9c9183" transform="rotate(8 340 265)"/>`;
  }

  // Teile, die sich nicht sinnvoll verschieben lassen
  const NOMOVE = ["zaun", "lichter", "eiszapfen", "wimpel", "weg", "feuerwerk", "rodel", "sternschnuppe", "kranz", "vogel"];
  // Lichtschein bei Nacht
  const GLOW = {
    laternen: [[645, 360, 34], [160, 360, 34], [990, 310, 34]], feuer: [[565, 495, 60]], kerzen: [[448, 462, 18], [574, 442, 18], [440, 524, 18], [584, 508, 18]],
    lichter: Array.from({ length: 40 }, (_, i) => [12 + i * 25, 207, 7]), tanne: [[500, 82, 26], [486, 150, 9], [530, 196, 9], [450, 250, 9], [552, 246, 9]], stand: [[782, 250, 30]],
  };
  function scene(newKey, ownedOverride, plain) {
    const own = ownedOverride || st.owned;
    const o = new Set(own);
    const progress = own.filter((k) => ITEMS.some((i) => i[0] === k)).length / ITEMS.length;
    const dark = !plain && typeof Extras !== "undefined" && Extras.isNight();
    const night = o.has("feuerwerk") || dark;
    const sky = night ? "#1d2b52" : mix("#b4b7bd", "#bfe3f7", Math.min(1, progress * 1.6));
    const hill = night ? "#2c3d6b" : o.has("rasen") ? mix("#9fbf8f", "#8fcf86", progress) : "#a49b89";
    const ground = night ? "#4d6b5a" : o.has("rasen") ? "#a8d78f" : "#b5a58a";
    const r = rnd(7);
    let s = `<rect width="1000" height="600" fill="${sky}"/>`;
    if (night) s += Array.from({ length: 40 }, () => `<circle cx="${(r() * 1000) | 0}" cy="${(r() * 190) | 0}" r="${(1 + r() * 1.8).toFixed(1)}" fill="#fff6c9"/>`).join("") + `<circle cx="900" cy="60" r="22" fill="#fff3c4"/>`;
    else {
      if (progress > 0.15) s += `<circle cx="900" cy="70" r="34" fill="#ffe28a" opacity="${Math.min(1, progress * 1.5).toFixed(2)}"/>`;
      const cl = (1 - Math.min(1, progress * 1.4)).toFixed(2);
      s += `<g fill="#9aa0a8" opacity="${cl}"><ellipse cx="160" cy="60" rx="110" ry="32"/><ellipse cx="520" cy="45" rx="150" ry="36"/><ellipse cx="840" cy="70" rx="120" ry="30"/></g>`;
      s += `<g fill="#fff" opacity="${(Math.min(1, progress * 1.5) * 0.9).toFixed(2)}"><ellipse cx="300" cy="80" rx="60" ry="18"/><ellipse cx="680" cy="60" rx="70" ry="20"/></g>`;
    }
    s += `<path d="M0 205 Q180 150 380 195 T760 185 T1000 190 V280 H0Z" fill="${hill}"/><rect y="250" width="1000" height="350" fill="${ground}"/>`;
    if (!o.has("rasen")) s += [[150, 330, 70], [520, 430, 90], [330, 540, 80], [880, 330, 60], [700, 560, 70]].map(([x, y, w]) => `<ellipse cx="${x}" cy="${y}" rx="${w}" ry="${w / 5}" fill="#9c8b70"/>`).join("");
    else s += Array.from({ length: 46 }, () => { const x = (r() * 1000) | 0, y = 270 + ((r() * 320) | 0); return `<path d="M${x} ${y} q2 -9 4 0 q2 -9 4 0" stroke="${night ? "#3f5a4b" : "#7fbf6a"}" stroke-width="2" fill="none"/>`; }).join("");
    if (o.has("schneemann")) s += [[120, 470, 90], [600, 330, 110], [430, 500, 70], [880, 560, 80], [300, 300, 60]].map(([x, y, w]) => `<ellipse cx="${x}" cy="${y}" rx="${w}" ry="${w / 6}" fill="#fff" opacity=".85"/>`).join("");
    if (!o.has("teich") && !o.has("eisbahn")) s += `<ellipse cx="800" cy="455" rx="44" ry="10" fill="#8f8a7a"/><ellipse cx="800" cy="453" rx="36" ry="7" fill="#a6b2b6"/>`;
    if (!o.has("baeume")) s += `<rect x="248" y="258" width="28" height="22" fill="#6b5a4a"/><ellipse cx="262" cy="258" rx="14" ry="4" fill="#8a7a66"/>`;
    const g = (k) => {
      if (!o.has(k) || LIVE.includes(k)) return "";
      const [dx, dy] = (!ownedOverride && st.pos[k]) || [0, 0];
      return `<g class="zi${k === newKey ? " zi-new" : ""}${NOMOVE.includes(k) ? "" : " movable"}" data-k="${k}"${dx || dy ? ` transform="translate(${dx} ${dy})"` : ""}>${DRAW[k]()}</g>`;
    };
    BACK.forEach((k) => { s += k === "zaun" && !o.has("zaun") ? brokenFence() : g(k); });
    if (o.has("weg")) s += g("weg");
    MID.forEach((k) => (s += k === "teich" && o.has("eisbahn") ? "" : g(k)));
    if (!o.has("rasen")) s += `<circle cx="700" cy="560" r="20" fill="none" stroke="#3a3a40" stroke-width="9"/><rect x="180" y="500" width="44" height="30" fill="#8f7a5f" transform="rotate(-12 202 515)"/><path d="M184 506 l36 18" stroke="#6b5a4a" stroke-width="3"/>`;
    FRONT.forEach((k) => (s += g(k)));
    if (o.has("schneemann") && !night) s += Array.from({ length: 30 }, () => `<circle cx="${(r() * 1000) | 0}" cy="${(r() * 560) | 0}" r="${(1.5 + r() * 2).toFixed(1)}" fill="#fff" opacity=".9"/>`).join("");
    if (night) {
      s += `<rect width="1000" height="600" fill="#0a1636" opacity="${o.has("feuerwerk") && !dark ? 0.12 : 0.36}" pointer-events="none"/>`;
      Object.entries(GLOW).forEach(([k, pts]) => { if (!o.has(k)) return; const [dx, dy] = (!ownedOverride && st.pos[k]) || [0, 0]; pts.forEach(([x, y, r]) => (s += `<circle cx="${x + dx}" cy="${y + dy}" r="${r}" fill="#ffd97a" opacity=".55" pointer-events="none"/><circle cx="${x + dx}" cy="${y + dy}" r="${r * 0.4}" fill="#fff6d0" opacity=".9" pointer-events="none"/>`)); });
    }
    if (o.has("feuerwerk")) s += `<g class="zi${newKey === "feuerwerk" ? " zi-new" : ""}">${DRAW.feuerwerk()}</g>`;
    return `<svg class="zoo-svg" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${s}</svg>`;
  }

  function preview(key, bare) {
    const it = info(key); const [x, y, w, h] = it[4];
    const bg = bare ? "" : `<rect x="${x - 50}" y="${y - 50}" width="${w + 100}" height="${h + 100}" fill="${key === "feuerwerk" ? "#1d2b52" : "#e9f5e2"}"/>`;
    return `<svg viewBox="${x} ${y} ${w} ${h}" preserveAspectRatio="xMidYMid meet" style="width:100%;height:100%;overflow:visible">${bg}${DRAW[key]()}</svg>`;
  }

  /* ---------- UI ---------- */
  let H;
  const coinSvg = `<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#f6c544" stroke="#d49b16" stroke-width="2"/><circle cx="12" cy="12" r="7" fill="none" stroke="#d49b16" stroke-width="1.5"/><text x="12" y="16" text-anchor="middle" font-size="10" font-weight="700" font-family="Arial, sans-serif" fill="#a3720f">T</text></svg>`;

  // Teile nach Weihnachten bleiben geheim, bis am 18.12. das Paket geöffnet wurde
  const visibleItems = () => ITEMS.filter(([k]) => dayOfItem(k) <= 24 || App.bonusVisible());
  function refresh(newKey) {
    document.querySelectorAll(".zoo-scene").forEach((n) => (n.innerHTML = scene(newKey)));
    const c = document.getElementById("coin-count"); if (c) c.textContent = st.coins;
    const vis = visibleItems();
    const done = vis.filter(([k]) => owns(k)).length;
    const pr = document.getElementById("zoo-progress");
    if (pr) pr.innerHTML = `<div class="zp-bar"><div style="width:${(done / vis.length) * 100}%"></div></div><span>${done} von ${vis.length} Verbesserungen</span>`;
    const sb = document.getElementById("shop-btn");
    if (sb) sb.classList.toggle("has-new", [...ITEMS, ...EXTRAS].some(([k, , p]) => !owns(k) && available(k) && p <= st.coins));
  }

  function addCoins(n, from) {
    st.coins += n; save();
    const c = document.getElementById("coin-count");
    if (c) { c.textContent = st.coins; const b = c.closest(".coins"); b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump"); }
    if (from && H) { const tr = (c || document.body).getBoundingClientRect(); for (let i = 0; i < Math.min(12, Math.ceil(n / 15)); i++) { const p = H.el("div", { class: "fly-coin", html: coinSvg, style: `left:${from.x}px;top:${from.y}px` }); document.getElementById("fx").append(p); p.animate([{ transform: "translate(-50%,-50%) scale(1)" }, { transform: `translate(calc(-50% + ${tr.left + 10 - from.x}px), calc(-50% + ${tr.top + 10 - from.y}px)) scale(.6)`, opacity: 0.6 }], { duration: 700 + i * 70, easing: "cubic-bezier(.5,0,.3,1)", delay: i * 40 }).onfinish = () => p.remove(); } }
    refresh();
  }
  // Belohnung pro Türchen nur einmal
  function earn(day) {
    if (st.paid[day]) return 0;
    st.paid[day] = true; save();
    return STORY[day] ? STORY[day].coins : 100;
  }

  function buy(key) {
    const it = info(key);
    if (owns(key) || st.coins < it[2] || !available(key)) return false;
    st.coins -= it[2]; st.owned.push(key); save();
    if (typeof Extras !== "undefined") Extras.track("bought", 1, it[1]);
    H.sfx.win();
    refresh(key);
    if (typeof Animals !== "undefined") { Animals.refreshPens(); const [ax, ay] = anchorOf(key); setTimeout(() => Animals.celebrate(ax, ay, it[1]), 1300); }
    document.getElementById("zoo")?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => { const z = document.getElementById("zoo-pen"); if (z) H.burstAt(z, ["✨", "⭐", "💖"], 20, 220); }, 400);
    H.toast(`Neu im Gehege: ${it[1]}!`, 3500);
    if (key === "feuerwerk") setTimeout(() => letter(CONFIG.newYearTitle, CONFIG.newYearMessage, true), 3200);
    return true;
  }

  function openShop(highlight) {
    const wantTab = highlight === "@futter" ? "futter" : null;
    if (wantTab) highlight = null;
    const ov = H.el("div", { class: "gehege-overlay shop-overlay", role: "dialog", "aria-label": "Shop" });
    const close = () => { if (typeof Animals !== "undefined") Animals.clearIn(ov); ov.remove(); document.body.style.overflow = ""; document.removeEventListener("keydown", esc); };
    const esc = (e) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", esc);
    const coinsEl = H.el("div", { class: "coins big", html: `${coinSvg}<b>${st.coins}</b> Taler` });
    const area = H.el("div", { class: "g-area" });
    const card = (it) => {
      const [key, name, price, desc] = it;
      const has = owns(key), afford = st.coins >= price;
      const btn = H.el("button", { class: "btn" + (afford ? "" : " btn-soft"), text: has ? "Im Gehege ✓" : afford ? "Kaufen" : `Noch ${price - st.coins} Taler` });
      btn.disabled = has || !afford;
      btn.onclick = () => { if (buy(key)) close(); };
      return H.el("div", { class: "shop-card" + (has ? " owned" : "") + (key === highlight ? " hl" : "") },
        H.el("div", { class: "shop-pic", html: preview(key) }),
        H.el("div", { class: "shop-info" }, H.el("b", { text: name }), H.el("small", { text: desc })),
        H.el("div", { class: "shop-buy" }, has ? null : H.el("div", { class: "shop-price", html: `${coinSvg}<span>${price}</span>` }), btn));
    };
    const vis = visibleItems();
    const TABS = [
      ["neu", "Neu freigeschaltet", vis.filter(([k]) => available(k) && !owns(k)), "Gerade gibt es kein neues Teil aus der Geschichte. Mit dem nächsten Türchen kommt wieder etwas dazu!"],
      ["klein", "Kleinigkeiten", SMALL.filter(([k]) => !owns(k)), "Alle Kleinigkeiten stehen schon im Gehege."],
      ["extras", "Extras", EXTRAS.filter(([k]) => !owns(k)), "Alle Extras stehen schon im Gehege."],
      ["futter", "Futter", Object.keys(FOOD), ""],
      ["gehege", "Schon im Gehege", ALL.filter(([k]) => owns(k)), "Noch ist nichts gekauft – leg los!"],
    ];
    const foodCard = (sp) => {
      const [name] = FOOD[sp];
      const plural = typeof Animals !== "undefined" ? Animals.SPECIES[sp].plural : sp;
      const mine = typeof Animals !== "undefined" ? Animals.ownedOf(sp) : 0;
      const stock = H.el("b", { class: "food-stock", text: `Vorrat: ${foodCount(sp)}` });
      const mk = ([n, qty]) => {
        const b = H.el("button", { class: "btn" + (st.coins >= n ? "" : " btn-soft"), text: `${qty} Stück · ${n} T` });
        b.disabled = st.coins < n;
        b.onclick = () => { if (buyFood(sp, n, qty)) { H.sfx.pop(); stock.textContent = `Vorrat: ${foodCount(sp)}`; coinsEl.querySelector("b").textContent = st.coins; area.querySelectorAll(".food-card .btn").forEach((x) => { const need = +x.dataset.n; x.disabled = st.coins < need; x.classList.toggle("btn-soft", st.coins < need); }); } };
        b.dataset.n = n;
        return b;
      };
      return H.el("div", { class: "shop-card food-card" + (mine ? "" : " nobody") },
        H.el("div", { class: "shop-pic food-pic", html: foodIcon(sp) }),
        H.el("div", { class: "shop-info" }, H.el("b", { text: name }), H.el("small", { text: `für ${plural}` + (mine ? ` · ${mine} im Gehege` : " · noch keine im Gehege") }), stock),
        H.el("div", { class: "shop-buy food-buy" }, ...FOOD_PACKS.map(mk)));
    };
    const tabBar = H.el("div", { class: "shop-tabs", role: "tablist" });
    const show = (id) => {
      const [, , list, emptyText] = TABS.find((t) => t[0] === id);
      tabBar.querySelectorAll("button").forEach((b) => b.classList.toggle("active", b.dataset.t === id));
      if (typeof Animals !== "undefined") Animals.clearIn(area);
      area.innerHTML = "";
      if (id === "futter") {
        const order = list.slice().sort((a, b) => (Animals.ownedOf(b) > 0) - (Animals.ownedOf(a) > 0));
        area.append(H.el("p", { class: "shop-note", text: "Jede Tierart frisst etwas anderes. Tiere, die einen Tag lang nichts bekommen, werden traurig. Größere Packungen sind günstiger." }), H.el("div", { class: "shop-grid" }, ...order.map(foodCard)));
      } else area.append(list.length ? H.el("div", { class: "shop-grid" + (id === "gehege" ? " mini" : "") }, ...list.map(card)) : H.el("p", { class: "shop-empty", text: emptyText }));
      if (typeof Animals !== "undefined") Animals.hideIn("shop", area);
    };
    TABS.forEach(([id, label, list]) => {
      const b = H.el("button", { class: "g-tab", role: "tab", "data-t": id }, label, id !== "gehege" && id !== "futter" && list.length ? H.el("span", { class: "tab-n", text: list.length }) : null);
      b.onclick = () => { H.sfx.tick(); show(id); };
      tabBar.append(b);
    });
    ov.append(H.el("div", { class: "g-head" }, H.el("div", {}, H.el("h2", { text: "Gehege-Shop" })), coinsEl,
      H.el("button", { class: "modal-close", "aria-label": "Schließen", text: "✖", onclick: close })), H.el("div", { class: "shop-tabwrap" }, tabBar), area);
    document.body.append(ov); document.body.style.overflow = "hidden";
    const start = highlight ? (SMALL.some((i) => i[0] === highlight) ? "klein" : EXTRAS.some((i) => i[0] === highlight) ? "extras" : owns(highlight) ? "gehege" : "neu") : TABS[0][2].length ? "neu" : "klein";
    show(wantTab || start);
  }

  function letter(title, msg, fireworks) {
    const ov = H.el("div", { class: "finale-overlay" + (fireworks ? " night" : "") });
    const parade = [{ sp: "capy", col: 0, acc: "orange" }, { sp: "katze", col: 0, acc: "muetze" }, { sp: "hund", col: 0, acc: "schal", accColor: "#e85d75" }, { sp: "waschbaer", col: 0, acc: "krone" }, { sp: "pinguin", col: 0, acc: "fliege", accColor: "#e85d75" }, { sp: "giraffe", col: 0, acc: "geweih" }, { sp: "igel", col: 0, acc: "muetze" }];
    ov.append(H.el("div", { class: "finale-card" },
      H.el("div", { class: "finale-animals" }, ...parade.map((a) => H.el("div", { class: "fa", html: Animals.svg(a, { walk: true, width: Animals.SPECIES[a.sp].W * 0.6 }) }))),
      H.el("h2", { text: title }),
      !fireworks ? H.el("figure", { class: "letter-photo" }, H.el("img", { src: "fotos/24.jpg", alt: "", onerror: (e) => e.target.parentElement.remove() }), H.el("figcaption", { text: "Wir zwei." })) : null,
      H.el("div", { class: "msg", text: msg }), H.el("p", { class: "sig", text: CONFIG.signature }),
      H.el("div", { class: "row", style: "margin-top:16px" }, H.el("button", { class: "btn", text: "Nochmal Konfetti!", onclick: () => { H.confetti(); H.sfx.jingle(); } }), H.el("button", { class: "btn btn-soft", text: "Schließen", onclick: () => ov.remove() }))));
    document.body.append(ov);
    H.sfx.jingle(); H.confetti();
    setTimeout(() => H.rain(fireworks ? ["🎆", "✨", "⭐", "🎇", "💖"] : ["💖", "🎄", "⭐", "🎁"], 70), 1400);
  }

  /* ---------- Nikolaus: Die Tiere schenken Mama 100 ersparte Taler ---------- */
  const GIFT = {
    title: "Ein Geschenk von uns allen",
    text:
      "Liebe Mama,\n\n" +
      "wir haben ganz heimlich jeden Taler zur Seite gelegt, den wir unter Kissen, im Stroh und hinter dem Futternapf gefunden haben. " +
      "Sogar Rocky hat (fast) nichts davon für Kekse ausgegeben!\n\n" +
      "Wir sind so unendlich froh, dass wir dich haben. Du bist ein ganz toller, herzensguter und liebenswerter Mensch – " +
      "die beste Gehege-Direktorin, die sich ein Tier nur wünschen kann.\n\n" +
      "Frohen Nikolaus!",
    from: "Deine Tiere aus dem Gehege – Kalle, Mimi, Bello, Rocky und alle anderen",
  };
  const PARCEL = `<svg viewBox="0 0 120 120" class="parcel-svg" aria-hidden="true">
    <ellipse cx="60" cy="112" rx="44" ry="6" fill="rgba(0,0,0,.15)"/>
    <g class="p-body"><rect x="16" y="46" width="88" height="62" rx="6" fill="#e85d75"/><rect x="54" y="46" width="12" height="62" fill="#ffd84d"/>
      <path d="M22 60 l6 -6 M30 100 l8 -8 M86 64 l8 -8 M80 102 l10 -10" stroke="#f08aa0" stroke-width="3" stroke-linecap="round"/></g>
    <g class="p-lid"><rect x="10" y="34" width="100" height="18" rx="5" fill="#d94a64"/><rect x="54" y="34" width="12" height="18" fill="#f6c531"/>
      <g class="p-bow"><path d="M60 34 C44 10 26 18 32 30 C36 38 50 36 60 34Z" fill="#ffd84d"/><path d="M60 34 C76 10 94 18 88 30 C84 38 70 36 60 34Z" fill="#ffd84d"/><circle cx="60" cy="33" r="6" fill="#f6c531"/></g>
      <rect x="70" y="40" width="30" height="9" rx="2" fill="#fff"/><text x="85" y="47" text-anchor="middle" font-size="6.5" font-weight="700" font-family="Arial, sans-serif" fill="#e85d75">FÜR MAMA</text></g>
  </svg>`;
  const CART = `<svg viewBox="0 0 230 120" class="cart-svg" aria-hidden="true">
    <path d="M196 70 L232 58" stroke="#5a3b2e" stroke-width="5" stroke-linecap="round"/>
    <rect x="18" y="40" width="182" height="50" rx="8" fill="#ffcf3f"/><rect x="18" y="40" width="182" height="10" rx="5" fill="#f2b51f"/>
    <text x="70" y="78" text-anchor="middle" font-size="18" font-weight="700" font-family="Fredoka, Arial, sans-serif" fill="#2f5fa8">TIERPOST</text>
    <g transform="translate(150 54)" fill="#2f5fa8"><ellipse cx="14" cy="20" rx="7" ry="6"/><ellipse cx="6" cy="12" rx="2.6" ry="3.4"/><ellipse cx="11" cy="7" rx="2.6" ry="3.6"/><ellipse cx="17" cy="7" rx="2.6" ry="3.6"/><ellipse cx="22" cy="12" rx="2.6" ry="3.4"/></g>
    <g class="cart-parcel" transform="translate(72 -2) scale(.42)">${"$"}{PARCEL_INNER}</g>
    <g class="wheel" style="transform-origin:58px 96px"><circle cx="58" cy="96" r="17" fill="#c94060"/><circle cx="58" cy="96" r="6" fill="#fff"/><path d="M58 80 V112 M42 96 H74" stroke="#fff" stroke-width="3"/></g>
    <g class="wheel" style="transform-origin:166px 96px"><circle cx="166" cy="96" r="17" fill="#c94060"/><circle cx="166" cy="96" r="6" fill="#fff"/><path d="M166 80 V112 M150 96 H182" stroke="#fff" stroke-width="3"/></g>
  </svg>`;
  function nikolausGift() {
    if (document.querySelector(".gehege-overlay, .finale-overlay, .pola-wrap, .post-run, .gift-parcel") || !document.getElementById("modal").classList.contains("hidden")) { setTimeout(nikolausGift, 4000); return; }
    const parcelInner = PARCEL.replace(/^<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
    const run = H.el("div", { class: "post-run" });
    const dogW = innerWidth < 600 ? 90 : 130, cartW = innerWidth < 600 ? 150 : 220;
    run.innerHTML = `<div class="post-cart" style="width:${cartW}px">${CART.replace("${PARCEL_INNER}", parcelInner)}</div><div class="post-dog"><div class="pd-in">${Animals.svg({ sp: "hund", col: 0, acc: "postmuetze" }, { walk: true, width: dogW })}</div></div>`;
    document.body.append(run);
    const runW = run.offsetWidth, mid = innerWidth / 2 - runW / 2;
    const bubble = H.el("div", { class: "bubble post-bubble", text: "Post für Mama!" });
    run.querySelector(".post-dog").append(bubble);
    run.classList.add("rolling");
    H.sfx.tone(660, 0.12, "triangle", 0.12); H.sfx.tone(880, 0.12, "triangle", 0.12, null, 0.15);
    run.animate([{ transform: `translateX(${-runW - 40}px)` }, { transform: `translateX(${mid}px)` }], { duration: 3600, easing: "cubic-bezier(.25,.6,.35,1)", fill: "forwards" }).onfinish = () => {
      run.classList.remove("rolling");
      run.querySelector(".post-dog svg").classList.remove("walking");
      bubble.classList.add("show"); H.sfx.jingle();
      setTimeout(() => {
        // Paket springt vom Wagen in die Bildschirmmitte
        const cp = run.querySelector(".cart-parcel"), r = cp.getBoundingClientRect();
        cp.style.visibility = "hidden";
        const size = Math.min(240, innerWidth * 0.55);
        const parcel = H.el("button", { class: "gift-parcel", "aria-label": "Geschenk öffnen", html: PARCEL, style: `width:${size}px;height:${size}px;left:${innerWidth / 2 - size / 2}px;top:${innerHeight / 2 - size / 2 - 30}px` });
        const hint = H.el("div", { class: "gift-hint", text: "Ein Geschenk für dich! Tippe zum Auspacken." });
        parcel.append(hint);
        document.body.append(parcel);
        const pr = parcel.getBoundingClientRect();
        parcel.animate([
          { transform: `translate(${r.left + r.width / 2 - pr.left - pr.width / 2}px, ${r.top + r.height / 2 - pr.top - pr.height / 2}px) scale(${r.width / pr.width})` },
          { transform: `translate(${(r.left + r.width / 2 - pr.left - pr.width / 2) * 0.4}px, -120px) scale(.8) rotate(-10deg)`, offset: 0.55 },
          { transform: "none" }], { duration: 1200, easing: "ease-in-out" });
        H.sfx.tone(400, 0.4, "sine", 0.15, 900);
        parcel.addEventListener("click", (e) => { e.stopPropagation(); openGift(parcel); }, { once: true });
        bubble.textContent = "Frohen Nikolaus!";
        setTimeout(() => {
          bubble.classList.remove("show");
          run.classList.add("rolling"); run.querySelector(".post-dog svg").classList.add("walking");
          run.animate([{ transform: `translateX(${mid}px)` }, { transform: `translateX(${innerWidth + 40}px)` }], { duration: 3000, easing: "ease-in", fill: "forwards" }).onfinish = () => run.remove();
        }, 1800);
      }, 1400);
    };
  }
  function openGift(parcel) {
    parcel.classList.add("opening");
    parcel.querySelector(".gift-hint")?.remove();
    H.sfx.tone(300, 0.15, "square", 0.06); setTimeout(() => H.sfx.win(), 650);
    const r = parcel.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    setTimeout(() => { H.burst(cx, cy, ["💖", "✨", "⭐", "🐾", "💝"], 30, 220); H.confetti(["💖", "✨", "🐾", "⭐", "🎁"], 70); }, 600);
    st.gift6 = true; save();
    setTimeout(() => {
      parcel.remove();
      const ov = H.el("div", { class: "finale-overlay gift-letter" });
      const animals = [{ sp: "capy", col: 0, acc: "orange" }, { sp: "katze", col: 1, acc: "schleife", accColor: "#e85d75" }, { sp: "hund", col: 0, acc: "postmuetze" }, { sp: "waschbaer", col: 0, acc: "muetze" }, { sp: "hase", col: 0, acc: "blume", accColor: "#e85d75" }, { sp: "pinguin", col: 1, acc: "schal", accColor: "#e85d75" }];
      const coin = H.el("div", { class: "r-coins", html: `${coinSvg}+100 Taler` });
      ov.append(H.el("div", { class: "finale-card gift-card" },
        H.el("div", { class: "finale-animals" }, ...animals.map((a) => H.el("div", { class: "fa", html: Animals.svg(a, { walk: true, width: Animals.SPECIES[a.sp].W * 0.55 }) }))),
        H.el("h2", { text: GIFT.title }), coin,
        H.el("div", { class: "msg gift-msg", text: GIFT.text }),
        H.el("p", { class: "sig", text: GIFT.from }),
        H.el("div", { class: "row", style: "margin-top:14px" }, H.el("button", { class: "btn", text: "Danke, ihr Lieben!", onclick: () => ov.remove() }))));
      document.body.append(ov);
      setTimeout(() => { const c = coin.getBoundingClientRect(); addCoins(100, { x: c.left + c.width / 2, y: c.top + c.height / 2 }); }, 900);
    }, 1300);
  }

  function init() {
    H = App.h;
    load();
    if (!st.gift6 && App.isUnlocked(6)) setTimeout(nikolausGift, 3500);
    document.getElementById("coin-icon").innerHTML = coinSvg;
    document.getElementById("shop-btn").addEventListener("click", (e) => { e.stopPropagation(); H.sfx.boop(600); openShop(); });
    refresh();
  }

  // Spiele: Rekorde & geheime Meilensteine
  function gameResult(game, score, rule) {
    const old = st.high[game] || 0;
    if (score > old) st.high[game] = score;
    let coins = 0;
    rule.ms.forEach(([m, c]) => { const k = game + m; if (score >= m && !st.ms[k]) { st.ms[k] = true; coins += c; } });
    save();
    return { old, high: st.high[game] || 0, coins };
  }

  function setPos(key, dx, dy) { st.pos[key] = [Math.round(Math.max(-450, Math.min(450, dx))), Math.round(Math.max(-300, Math.min(250, dy)))]; save(); refresh(); }
  const posOf = (key) => st.pos[key] || [0, 0];
  const ownedList = () => st.owned.slice();
  return { SMALL, EXTRAS, NOMOVE, setPos, posOf, ownedList, foodStock: () => ({ ...st.food }), setFood: (sp, n) => { st.food[sp] = Math.max(0, n); save(); }, STORY, ITEMS, FOOD, foodIcon, foodCount, useFood, fedAt: (id) => st.fed[id] || 0, gameResult, high: (g) => st.high[g] || 0, init, scene, preview, refresh, earn, addCoins, openShop, letter, info, anchorOf, coins: () => st.coins, owns };
})();
