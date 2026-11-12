/* =========================================================
   Extras – Tag & Nacht, Wetter, Spieluhr, Adventskranz,
   Tier des Tages, Kalles Tagebuch, Mini-Aufgaben,
   Zufallsereignisse, Besucher & Spendenbox, Abzeichen,
   Weihnachtsmann, Heiligabend-Show, Jahresrückblick
   ========================================================= */
const Extras = (() => {
  let H;
  const KEY = "mama-extras-" + CONFIG.year;
  let st = { stats: {}, daily: {}, log: {}, badges: [], events: {}, donation: {}, santa: false, music: false, tasks: 0 };
  const load = () => { try { const r = localStorage.getItem(KEY); if (r) st = Object.assign(st, JSON.parse(r)); } catch (e) {} };
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} };
  const dkey = (d = new Date()) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  const seedOf = (str) => { let h = 7; for (const c of str) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; };
  const rnd = (seed) => { let x = seed || 1; return () => (x = (x * 16807) % 2147483647) / 2147483647; };
  // Tag im Dezember (1–31), davor 0, danach 32
  const dayNum = () => { const d = new Date(); if (d.getFullYear() < CONFIG.year || (d.getFullYear() === CONFIG.year && d.getMonth() < 11)) return 0; if (d.getFullYear() > CONFIG.year) return 32; return d.getDate(); };

  /* ================= Tag & Nacht ================= */
  function isNight() { const h = new Date().getHours(); return h >= 17 || h < 7; }

  /* ================= Wetter ================= */
  const WEATHER = { sonne: "Sonnenschein", schnee: "Schneefall", wolkig: "Wolkig", nebel: "Nebel" };
  function weather() { const r = rnd(seedOf(dkey()))(); return r < 0.4 ? "schnee" : r < 0.65 ? "sonne" : r < 0.85 ? "wolkig" : "nebel"; }
  function decoratePen(field) {
    H = H || App.h;
    field.classList.toggle("night", isNight());
    field.querySelector(".weather")?.remove();
    const w = weather();
    if (w !== "sonne") field.append(H.el("div", { class: "weather w-" + w }));
    if (field.id === "zoo-pen") { donationBox(field); }
  }

  /* ================= Spieluhr ================= */
  const NOTE = (n) => { const m = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }; const o = +n.slice(-1), k = m[n[0]] + (n[1] === "#" ? 1 : 0); return 440 * Math.pow(2, (k + (o - 4) * 12 - 9) / 12); };
  const SONGS = [
    { beat: 0.34, notes: "E4 1|E4 1|E4 2|E4 1|E4 1|E4 2|E4 1|G4 1|C4 1.5|D4 .5|E4 4|F4 1|F4 1|F4 1.5|F4 .5|F4 1|E4 1|E4 1|E4 .5|E4 .5|E4 1|D4 1|D4 1|E4 1|D4 2|G4 2|E4 1|E4 1|E4 2|E4 1|E4 1|E4 2|E4 1|G4 1|C4 1.5|D4 .5|E4 4|F4 1|F4 1|F4 1|F4 1|F4 1|E4 1|E4 1|E4 .5|E4 .5|G4 1|G4 1|F4 1|D4 1|C4 4" },
    { beat: 0.27, notes: "G4 1.5|A4 .5|G4 1|E4 3|G4 1.5|A4 .5|G4 1|E4 3|D5 2|D5 1|B4 3|C5 2|C5 1|G4 3|A4 2|A4 1|C5 1.5|B4 .5|A4 1|G4 1.5|A4 .5|G4 1|E4 3|A4 2|A4 1|C5 1.5|B4 .5|A4 1|G4 1.5|A4 .5|G4 1|E4 3|D5 2|D5 1|F5 1.5|D5 .5|B4 1|C5 3|E5 3|C5 1.5|G4 .5|E4 1|G4 1.5|F4 .5|D4 1|C4 6" },
  ].map((s) => ({ beat: s.beat, notes: s.notes.split("|").map((x) => { const [n, b] = x.split(" "); return [NOTE(n), +b]; }) }));
  let mctx = null, mTimer = null, mSong = 0, mIdx = 0, mNext = 0;
  function bell(freq, t, dur, vol = 0.05) {
    [[1, vol], [2, vol * 0.35], [3.01, vol * 0.12]].forEach(([mul, v]) => {
      const o = mctx.createOscillator(), g = mctx.createGain();
      o.type = "sine"; o.frequency.value = freq * mul;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + Math.max(0.6, dur * 1.6));
      o.connect(g).connect(mctx.destination); o.start(t); o.stop(t + Math.max(0.7, dur * 1.7));
    });
  }
  function tick() {
    if (!mctx) return;
    while (mNext < mctx.currentTime + 0.4) {
      const song = SONGS[mSong];
      if (mIdx >= song.notes.length) { mIdx = 0; mSong = (mSong + 1) % SONGS.length; mNext += 2.2; continue; }
      const [f, b] = song.notes[mIdx++];
      bell(f, mNext, b * song.beat); mNext += b * song.beat;
    }
  }
  function music(on) {
    st.music = on; save();
    const b = document.getElementById("music-toggle"); if (b) b.classList.toggle("off", !on);
    if (on) { mctx = mctx || new (window.AudioContext || window.webkitAudioContext)(); mctx.resume(); mNext = mctx.currentTime + 0.2; clearInterval(mTimer); mTimer = setInterval(tick, 120); }
    else { clearInterval(mTimer); if (mctx) mctx.suspend(); }
  }
  // einmalig ein Lied spielen (Heiligabend-Show)
  function playSong(i, vol = 0.07) {
    mctx = mctx || new (window.AudioContext || window.webkitAudioContext)(); mctx.resume();
    let t = mctx.currentTime + 0.3; SONGS[i].notes.forEach(([f, b]) => { bell(f, t, b * SONGS[i].beat * 1.2, vol); t += b * SONGS[i].beat * 1.2; });
    return (t - mctx.currentTime) * 1000;
  }

  /* ================= Adventskranz ================= */
  function wreath() {
    const sundays = [new Date(CONFIG.year, 10, 29), new Date(CONFIG.year, 11, 6), new Date(CONFIG.year, 11, 13), new Date(CONFIG.year, 11, 20)];
    const lit = App.preview ? 4 : sundays.filter((d) => new Date() >= d).length;
    const cx = [52, 84, 116, 148];
    let svg = `<svg viewBox="0 0 200 110" aria-hidden="true"><ellipse cx="100" cy="88" rx="92" ry="20" fill="#2f8a52"/>`;
    for (let i = 0; i < 22; i++) { const a = (i / 22) * Math.PI * 2; svg += `<ellipse cx="${100 + Math.cos(a) * 82}" cy="${88 + Math.sin(a) * 16}" rx="14" ry="6" fill="${i % 2 ? "#3f9e62" : "#2b7a47"}" transform="rotate(${(a * 180) / Math.PI} ${100 + Math.cos(a) * 82} ${88 + Math.sin(a) * 16})"/>`; }
    [[30, 96], [170, 96], [100, 104], [64, 100], [136, 100]].forEach(([x, y]) => (svg += `<circle cx="${x}" cy="${y}" r="5" fill="#e5383b"/>`));
    cx.forEach((x, i) => {
      svg += `<rect x="${x - 8}" y="${36 + (i % 2) * 6}" width="16" height="${48 - (i % 2) * 6}" rx="3" fill="#e85d75"/><path d="M${x} ${36 + (i % 2) * 6} v-6" stroke="#3a2a24" stroke-width="2"/>`;
      if (i < lit) svg += `<g class="flame" style="animation-delay:-${i * 0.3}s"><ellipse cx="${x}" cy="${22 + (i % 2) * 6}" rx="6" ry="10" fill="#ffb347"/><ellipse cx="${x}" cy="${25 + (i % 2) * 6}" rx="3" ry="6" fill="#fff3b0"/></g>`;
    });
    svg += `</svg>`;
    const el = H.el("button", { id: "wreath", class: "wreath", title: lit ? `${lit}. Advent` : "Bald ist der 1. Advent", html: svg });
    el.addEventListener("click", (e) => { e.stopPropagation(); H.burstAt(el, ["✨", "⭐"], 10, 60); [784, 988, 1175, 1568].slice(0, Math.max(1, lit)).forEach((f, i) => H.sfx.tone(f, 0.6, "sine", 0.12, null, i * 0.18)); H.toast(lit ? `Heute brennen ${lit === 1 ? "eine Kerze" : lit + " Kerzen"} – ${lit}. Advent.` : "Am 29. November wird die erste Kerze angezündet."); });
    document.getElementById("countdown").before(el);
  }

  /* ================= Tier des Tages ================= */
  const FACTS = [
    ["capy", "Kapibaras sind so entspannt, dass sich Vögel, Affen und sogar Schildkröten gern auf ihren Rücken setzen."],
    ["waschbaer", "Waschbären haben extrem empfindliche Vorderpfoten – beim Tasten „sehen“ sie mehr als mit den Augen."],
    ["katze", "Katzen verbringen etwa ein Drittel ihrer wachen Zeit mit Fellpflege."],
    ["hund", "Die Nase eines Hundes ist so einzigartig wie ein menschlicher Fingerabdruck."],
    ["giraffe", "Giraffen schlafen oft nur wenige Minuten am Stück – insgesamt kaum eine halbe Stunde am Tag."],
    ["fuchs", "Füchse springen beim Mäusefangen hoch in die Luft und tauchen kopfüber in den Schnee."],
    ["panda_rot", "Rote Pandas wickeln sich bei Kälte in ihren buschigen Schwanz ein wie in eine Decke."],
    ["pinguin", "Manche Pinguin-Männchen schenken ihrer Herzdame einen besonders schönen Kieselstein."],
    ["igel", "Ein Igel trägt etwa 6.000 bis 8.000 Stacheln auf dem Rücken."],
    ["hase", "Wenn Kaninchen vor Freude Luftsprünge machen, nennt man das „Binky“."],
    ["schaf", "Schafe können sich die Gesichter von bis zu 50 anderen Schafen jahrelang merken."],
    ["schwein", "Schweine sind sehr schlau – manche Aufgaben lernen sie schneller als viele Hunde."],
    ["elefant", "Elefanten trösten traurige Artgenossen, indem sie sie sanft mit dem Rüssel berühren."],
    ["otter", "Seeotter haben eine Hautfalte unter dem Arm, in der sie ihren Lieblingsstein aufbewahren."],
    ["ente", "Entenküken folgen dem ersten Lebewesen, das sie nach dem Schlüpfen sehen."],
    ["baer", "Eisbären haben schwarze Haut und durchsichtige Haare – weiß wirken sie nur durch das Licht."],
    ["capy", "Kapibaras können bis zu fünf Minuten lang unter Wasser bleiben."],
    ["katze", "Katzen schnurren nicht nur vor Glück – sie beruhigen sich damit auch selbst."],
    ["hund", "Hunde können sich die Bedeutung von über hundert Wörtern merken."],
    ["pinguin", "Kaiserpinguine können über 500 Meter tief tauchen."],
    ["waschbaer", "Waschbären erinnern sich jahrelang an die Lösung einer kniffligen Aufgabe."],
    ["giraffe", "Die Zunge einer Giraffe ist rund 50 Zentimeter lang und dunkel gefärbt."],
    ["otter", "Otterbabys können anfangs nicht schwimmen – Mama Otter bringt es ihnen bei."],
    ["schaf", "Ein Schaf liefert im Jahr mehrere Kilo Wolle – genug für einige kuschelige Pullover."],
    ["fuchs", "Junge Füchse heißen Welpen und spielen genauso gern wie junge Hunde."],
    ["elefant", "Elefanten erkennen sich selbst im Spiegel."],
    ["igel", "Igel sind trotz kurzer Beine echte Wanderer – nachts laufen sie mehrere Kilometer."],
    ["hase", "Feldhasen können bis zu 70 Kilometer pro Stunde schnell rennen."],
    ["schwein", "Schweine wälzen sich im Schlamm, weil sie kaum schwitzen können – das kühlt und schützt die Haut."],
    ["ente", "Enten fetten ihr Gefieder mit einem Öl aus einer Drüse am Schwanz ein – so bleibt es wasserdicht."],
    ["panda_rot", "Rote Pandas verschlafen bis zu 13 Stunden am Tag, am liebsten hoch oben in den Bäumen."],
  ];
  const factOfDay = () => { const d = dayNum(); const i = d >= 1 && d <= 31 ? d - 1 : seedOf(dkey()) % 31; return FACTS[i]; };

  /* ================= Mini-Aufgaben ================= */
  const TASKS = [
    { id: "feed3", text: "Füttere heute 3 Tiere.", type: "fed", goal: 3, reward: 15 },
    { id: "find2", text: "Finde heute 2 versteckte Tiere.", type: "found", goal: 2, reward: 15 },
    { id: "game1", text: "Spiele eine Runde in der Spielecke.", type: "games", goal: 1, reward: 10 },
    { id: "kalle5", text: "Streichle Kalle unten links 5 Mal.", type: "kalle", goal: 5, reward: 10 },
    { id: "buy1", text: "Kaufe heute etwas im Shop.", type: "bought", goal: 1, reward: 10 },
    { id: "door", text: "Löse das Rätsel von heute.", type: "door", goal: 1, reward: 10 },
    { id: "album", text: "Schau ins Sammelalbum deiner Tiere.", type: "album", goal: 1, reward: 5 },
    { id: "feed5", text: "Füttere heute 5 Tiere.", type: "fed", goal: 5, reward: 20 },
    { id: "find1", text: "Finde ein Tier, das sich versteckt hat.", type: "found", goal: 1, reward: 10 },
    { id: "game2", text: "Spiele heute 2 Runden in der Spielecke.", type: "games", goal: 2, reward: 15 },
  ];
  const today = () => { const k = dkey(); if (!st.daily[k]) st.daily[k] = { c: {}, claimed: false }; return st.daily[k]; };
  const taskOfDay = () => TASKS[seedOf(dkey() + "x") % TASKS.length];

  /* ================= Zähler & Tagebuch ================= */
  function track(type, n = 1, detail) {
    if (!H) return;
    st.stats[type] = (st.stats[type] || 0) + n;
    const t = today(); t.c[type] = (t.c[type] || 0) + n;
    const lg = (st.log[dkey()] = st.log[dkey()] || { bought: [], fed: 0, found: 0, games: 0, door: 0 });
    if (type === "bought" && detail) lg.bought.push(detail);
    if (["fed", "found", "games", "door"].includes(type)) lg[type] += n;
    save(); renderToday(); checkBadges();
  }
  const OPEN = {
    schnee: ["Heute hat es den ganzen Tag geschneit.", "Draußen tanzen die Schneeflocken.", "Schnee, Schnee, Schnee – die Pinguine sind im Glück."],
    sonne: ["Heute hat die Wintersonne geschienen.", "Was für ein klarer, sonniger Tag!", "Die Sonne hat unsere Nasen gewärmt."],
    wolkig: ["Heute war es grau und gemütlich.", "Dicke Wolken, aber gute Laune.", "Ein ruhiger, wolkiger Tag im Gehege."],
    nebel: ["Heute Morgen war alles in Nebel gehüllt.", "Im Nebel haben wir Verstecken gespielt.", "So neblig, dass Rocky sich zweimal verlaufen hat."],
  };
  const CLOSE = ["Ich bin gespannt auf morgen.", "Jetzt kuschle ich mich ein. Gute Nacht!", "Danke, Mama. Für alles.", "Was für ein schöner Tag.", "Morgen wird bestimmt wieder wunderbar.", "Ich träume heute sicher von Mandarinen."];
  function diaryEntry(k) {
    const lg = st.log[k] || { bought: [], fed: 0, found: 0, games: 0, door: 0 };
    const [y, m, d] = k.split("-").map(Number);
    const r = rnd(seedOf(k));
    const w = (() => { const x = rnd(seedOf(k))(); return x < 0.4 ? "schnee" : x < 0.65 ? "sonne" : x < 0.85 ? "wolkig" : "nebel"; })();
    const lines = [OPEN[w][Math.floor(r() * 3)]];
    if (lg.door) lines.push("Mama hat das Rätsel des Tages gelöst – ganz schön clever!");
    if (lg.bought.length) lines.push(`Neu bei uns: ${lg.bought.join(", ")}. Alle sind begeistert.`);
    if (lg.found) lines.push(lg.found === 1 ? "Ein neues Tier ist bei uns eingezogen." : `${lg.found} neue Tiere sind bei uns eingezogen.`);
    if (lg.fed) lines.push(lg.fed === 1 ? "Ein Tier hat leckeres Futter bekommen." : `${lg.fed} Mal gab es leckeres Futter.`);
    if (lg.games) lines.push("In der Spielecke wurde gespielt und gelacht.");
    if (lines.length === 1) lines.push("Es war ein ruhiger Tag – wir haben dich vermisst!");
    lines.push(CLOSE[Math.floor(r() * CLOSE.length)]);
    return { date: `${d}. ${["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"][m - 1]}`, text: lines.join(" ") };
  }
  function openDiary() {
    const keys = Object.keys(st.log).sort((a, b) => new Date(b.replace(/-/g, "/")) - new Date(a.replace(/-/g, "/")));
    if (!keys.includes(dkey())) keys.unshift(dkey());
    const ov = overlay("Kalles Tagebuch", "Jeden Tag schreibt Kalle auf, was im Gehege passiert ist.");
    ov.area.append(H.el("div", { class: "diary" }, ...keys.map((k) => { const e = diaryEntry(k); return H.el("div", { class: "diary-entry" }, H.el("b", { text: e.date }), H.el("p", { text: e.text })); })));
  }

  /* ================= Tagesleiste ================= */
  function renderToday() {
    const box = document.getElementById("today"); if (!box || !H) return;
    const [sp, fact] = factOfDay(), spec = Animals.SPECIES[sp];
    const t = today(), task = taskOfDay(), have = Math.min(task.goal, t.c[task.type] || 0), done = have >= task.goal;
    const entry = diaryEntry(dkey());
    box.innerHTML = "";
    const claim = H.el("button", { class: "btn" + (done && !t.claimed ? " btn-green" : " btn-soft"), text: t.claimed ? "Erledigt ✓" : done ? `${task.reward} Taler abholen` : `${have} / ${task.goal}` });
    claim.disabled = !done || t.claimed;
    claim.onclick = (e) => { e.stopPropagation(); if (t.claimed) return; t.claimed = true; st.tasks = (st.tasks || 0) + 1; save(); const r = claim.getBoundingClientRect(); Zoo.addCoins(task.reward, { x: r.left + r.width / 2, y: r.top }); H.sfx.win(); renderToday(); checkBadges(); };
    box.append(
      H.el("div", { class: "today-card" }, H.el("div", { class: "tc-head" }, H.el("span", { class: "tc-pic", html: Animals.svg({ sp, col: 0, acc: "" }, { fit: true }) }), H.el("div", {}, H.el("small", { text: "Tier des Tages" }), H.el("b", { text: spec.name }))), H.el("p", { text: fact })),
      H.el("div", { class: "today-card" }, H.el("div", { class: "tc-head" }, H.el("span", { class: "tc-pic", html: Animals.svg({ sp: "capy", col: 0, acc: "brille" }, { fit: true }) }), H.el("div", {}, H.el("small", { text: "Kalles Tagebuch" }), H.el("b", { text: entry.date }))), H.el("p", { class: "tc-diary", text: entry.text }), H.el("button", { class: "btn btn-soft", text: "Ganzes Tagebuch", onclick: (e) => { e.stopPropagation(); openDiary(); } })),
      H.el("div", { class: "today-card" }, H.el("div", { class: "tc-head" }, H.el("span", { class: "tc-pic", html: Animals.svg({ sp: "hund", col: 0, acc: "postmuetze" }, { fit: true }) }), H.el("div", {}, H.el("small", { text: "Aufgabe des Tages" }), H.el("b", { text: `${task.reward} Taler Belohnung` }))), H.el("p", { text: task.text }), H.el("div", { class: "zp-bar" }, H.el("div", { style: `width:${(have / task.goal) * 100}%` })), claim),
      H.el("div", { class: "today-card small" }, H.el("small", { text: "Heute im Gehege" }), H.el("b", { text: `${WEATHER[weather()]}${isNight() ? " · Nacht" : ""}` }), H.el("button", { class: "btn btn-soft", text: "Abzeichen", onclick: (e) => { e.stopPropagation(); openBadges(); } }),
        dayNum() >= 31 && App.isSolved(31) ? H.el("button", { class: "btn", text: "Jahresrückblick", onclick: (e) => { e.stopPropagation(); review(); } }) : null));
  }

  /* ================= Zufallsereignisse ================= */
  const EVENTS = ["schmetterling", "taler", "rocky", "sturm", "stern"];
  function randomEvent() {
    const k = dkey(); st.events[k] = st.events[k] || 0;
    const field = document.getElementById("zoo-pen");
    if (!field || st.events[k] >= 4 || document.hidden || document.querySelector(".gehege-overlay, .finale-overlay, .pola-wrap") || !document.getElementById("modal").classList.contains("hidden")) return;
    const rect = field.getBoundingClientRect(); if (rect.bottom < 0 || rect.top > innerHeight) return;
    st.events[k]++; save();
    const ev = H.pick(EVENTS);
    if (ev === "schmetterling" || ev === "stern") {
      const star = ev === "stern";
      const f = H.el("button", { class: "ev-fly " + (star ? "ev-star" : "ev-butterfly"), "aria-label": star ? "Sternschnuppe" : "Schmetterling", html: star ? `<svg viewBox="0 0 60 30"><path d="M2 22 Q28 14 44 8" stroke="#fff6c9" stroke-width="4" stroke-linecap="round" opacity=".8"/><polygon points="50,2 53,9 60,10 55,15 56,22 50,18 44,22 45,15 40,10 47,9" fill="#ffd84d"/></svg>` : `<svg viewBox="0 0 40 30"><ellipse cx="13" cy="11" rx="11" ry="9" fill="#ff8fa3"/><ellipse cx="27" cy="11" rx="11" ry="9" fill="#ffb347"/><ellipse cx="14" cy="22" rx="7" ry="6" fill="#c77dff"/><ellipse cx="26" cy="22" rx="7" ry="6" fill="#58b6ff"/><rect x="18.5" y="6" width="3" height="20" rx="1.5" fill="#3a2a24"/></svg>` });
      field.append(f);
      const dur = star ? 5000 : 14000;
      f.animate(star ? [{ left: "-8%", top: "8%" }, { left: "100%", top: "30%" }] : [{ left: "-6%", top: "60%" }, { left: "30%", top: "40%" }, { left: "55%", top: "65%" }, { left: "80%", top: "45%" }, { left: "104%", top: "55%" }], { duration: dur, easing: "ease-in-out", fill: "forwards" }).onfinish = () => f.remove();
      f.addEventListener("click", (e) => { e.stopPropagation(); const r = f.getBoundingClientRect(); f.remove(); Zoo.addCoins(star ? 8 : 5, { x: r.left, y: r.top }); H.sfx.good(); H.toast(star ? "Eine Sternschnuppe! Du darfst dir etwas wünschen – und bekommst 8 Taler." : "Ein Glücks-Schmetterling! 5 Taler für dich."); });
      H.toast(star ? "Schau mal ins Gehege – eine Sternschnuppe!" : "Ein Schmetterling hat sich ins Gehege verirrt!");
    } else if (ev === "taler") {
      Animals.sayRandom("Oh! Ich hab einen Taler im Stroh gefunden!"); setTimeout(() => { const r = field.getBoundingClientRect(); Zoo.addCoins(3, { x: r.left + r.width / 2, y: r.top + r.height / 2 }); }, 1200);
    } else if (ev === "rocky") {
      const stock = Zoo.foodStock(); const sps = Object.keys(stock).filter((s) => stock[s] > 0);
      const coon = H.el("div", { class: "ev-coon", html: Animals.svg({ sp: "waschbaer", col: 0, acc: "muetze" }, { walk: true, width: 80 }) });
      field.append(coon);
      coon.animate([{ left: "-12%" }, { left: "106%" }], { duration: 5000, fill: "forwards" }).onfinish = () => coon.remove();
      if (sps.length) { const s = H.pick(sps); Zoo.setFood(s, stock[s] - 1); H.toast(`Rocky hat sich ${Zoo.FOOD[s][0]} stibitzt – und ist schon weg!`); }
      else H.toast("Rocky schleicht durchs Gehege … zum Glück ist die Futterkiste leer!");
    } else if (ev === "sturm") {
      field.classList.add("storm"); Animals.sayRandom("Brrr! Was für ein Schneesturm!"); setTimeout(() => Animals.sayRandom("Alle zusammenkuscheln!"), 3500);
      setTimeout(() => field.classList.remove("storm"), 20000); H.toast("Ein Schneesturm fegt durchs Gehege!");
    }
  }

  /* ================= Besucher & Spendenbox ================= */
  const BESUCHER = ["Wie schön es hier ist!", "Schau mal, ein Kapibara!", "So ein liebevolles Gehege.", "Hier komme ich jetzt jeden Tag her.", "Wer hat das so hübsch gemacht?", "Die Tiere sehen so glücklich aus.", "Ein echtes Winterparadies!", "Ich werf was in die Spendenbox.", "Wie gemütlich!", "Das muss ich meinen Freunden zeigen.",
    "Die Direktorin hat ein Händchen dafür.", "Oh, ein Waschbär mit Mütze!", "Hier riecht es nach Plätzchen.", "Schöner als jeder Zoo.", "Mama, darf ich da rein?", "So viel Liebe steckt hier drin.", "Ich hab noch nie so süße Tiere gesehen.", "Hier ist es so friedlich.", "Ein Foto, bitte!", "Ich komme bald wieder!"];
  const beauty = () => Zoo.ownedList().length;
  const donationToday = () => Math.min(20, 2 + Math.floor(beauty() * 0.6));
  function donationBox(field) {
    if (beauty() < 3) return;
    const ready = !st.donation[dkey()];
    const b = H.el("button", { class: "donation" + (ready ? " ready" : ""), "aria-label": "Spendenbox", html: `<svg viewBox="0 0 60 70"><rect x="27" y="40" width="6" height="30" fill="#7a5537"/><rect x="8" y="12" width="44" height="32" rx="6" fill="#4fae7f"/><rect x="20" y="16" width="20" height="4" rx="2" fill="#2f6b4a"/><text x="30" y="36" text-anchor="middle" font-size="9" font-weight="700" font-family="Arial, sans-serif" fill="#fff">SPENDEN</text></svg>` });
    if (ready) b.append(H.el("span", { class: "don-badge", text: `+${donationToday()}` }));
    b.onclick = (e) => {
      e.stopPropagation();
      if (st.donation[dkey()]) { H.toast("Die Spendenbox ist für heute leer – morgen kommen neue Besucher."); return; }
      const n = donationToday(); st.donation[dkey()] = n; st.stats.spenden = (st.stats.spenden || 0) + 1; save();
      const r = b.getBoundingClientRect(); Zoo.addCoins(n, { x: r.left + r.width / 2, y: r.top });
      H.toast(`Heute haben ${Math.max(2, Math.round(n * 0.7))} Besucher ${n} Taler in die Spendenbox geworfen!`); H.sfx.good(); b.classList.remove("ready"); b.querySelector(".don-badge")?.remove(); checkBadges();
    };
    field.append(b);
  }
  function visitor() {
    const field = document.getElementById("zoo-pen");
    if (!field || document.hidden || beauty() < 3 || isNight() || field.querySelectorAll(".visitor").length >= 2) return;
    const r = rnd(Date.now() % 100000);
    const coat = H.pick(["#e85d75", "#4f7fe0", "#3f9e6e", "#f39c32", "#9b5fd0", "#5a3b2e"]), hair = H.pick(["#3a2a24", "#c98b4a", "#f2d27a", "#8a8a8a", "#7a3b1f"]), skin = H.pick(["#f5d0b5", "#e0b08c", "#a8775a", "#f3dccb"]);
    const v = H.el("div", { class: "visitor", html: `<svg viewBox="0 0 40 80" aria-hidden="true"><rect class="vl" x="12" y="56" width="6" height="22" rx="3" fill="#3a3a48"/><rect class="vr" x="22" y="56" width="6" height="22" rx="3" fill="#3a3a48"/><rect x="8" y="28" width="24" height="32" rx="10" fill="${coat}"/><rect x="9" y="28" width="22" height="7" rx="3" fill="#fff" opacity=".85"/><circle cx="20" cy="18" r="11" fill="${skin}"/><path d="M9 16 Q20 0 31 16 Q26 9 20 10 Q14 9 9 16z" fill="${hair}"/><circle cx="16" cy="19" r="1.4" fill="#2b1a10"/><circle cx="24" cy="19" r="1.4" fill="#2b1a10"/><path d="M17 23 q3 2 6 0" stroke="#2b1a10" stroke-width="1.2" fill="none"/></svg>` });
    const ltr = r() < 0.5;
    v.style.top = 86 + r() * 8 + "%";
    if (!ltr) v.classList.add("rtl");
    field.append(v);
    const dur = 16000 + r() * 6000;
    v.animate([{ left: ltr ? "-6%" : "102%" }, { left: ltr ? "102%" : "-6%" }], { duration: dur, fill: "forwards" }).onfinish = () => v.remove();
    setTimeout(() => { if (!v.isConnected) return; const b = H.el("div", { class: "pen-say", text: Texts.lists && BESUCHER[Math.floor(Math.random() * BESUCHER.length)] }); v.append(b); setTimeout(() => b.remove(), 3000); }, dur * (0.3 + r() * 0.3));
  }

  /* ================= Abzeichen ================= */
  const S = (k) => st.stats[k] || 0;
  const BADGES = [
    ["tuer1", "Erstes Kapitel", "Das erste Rätsel gelöst.", "1", () => solvedCount() >= 1],
    ["tuer7", "Eine Woche dabei", "7 Rätsel gelöst.", "7", () => solvedCount() >= 7],
    ["tuer12", "Halbzeit", "12 Rätsel gelöst.", "½", () => solvedCount() >= 12],
    ["tuer24", "Heiligabend", "Das Rätsel vom 24. gelöst.", "★", () => App.isSolved(24)],
    ["tuer31", "Die ganze Geschichte", "Alle 31 Kapitel gelöst.", "♛", () => solvedCount() >= 31],
    ["tier10", "Tierfreundin", "10 Tiere gefunden.", "10", () => Animals.foundCount() >= 10],
    ["tier50", "Tiersammlerin", "50 Tiere gefunden.", "50", () => Animals.foundCount() >= 50],
    ["tier100", "Alle 100!", "Jedes einzelne Tier gefunden.", "100", () => Animals.foundCount() >= 100],
    ["legende", "Legendär", "Alle drei legendären Tiere gefunden.", "✦", () => Animals.VARIANTS.filter((v) => v.rarity === "legendaer").every((v) => Animals.isFound(v.id))],
    ["futter10", "Gute Fee", "10 Mal gefüttert.", "♥", () => S("fed") >= 10],
    ["futter100", "Futterkönigin", "100 Mal gefüttert.", "♥♥", () => S("fed") >= 100],
    ["shop10", "Einrichtungsprofi", "10 Dinge gekauft.", "⌂", () => S("bought") >= 10],
    ["klein", "Liebe zum Detail", "Alle Kleinigkeiten gekauft.", "✿", () => Zoo.SMALL.every(([k]) => Zoo.owns(k))],
    ["turm", "Turmbauerin", "Heuballen-Turm mit 20 Ballen.", "▲", () => Zoo.high("turm") >= 20],
    ["pinguin", "Eisprinzessin", "1000 Punkte in der Pinguin-Rutsche.", "❄", () => Zoo.high("pinguin") >= 1000],
    ["waschbaer", "Keks-Retterin", "60 Punkte im Waschbär-Alarm.", "●", () => Zoo.high("waschbaer") >= 60],
    ["namen", "Taufpatin", "Einem Tier einen eigenen Namen gegeben.", "✎", () => S("renamed") >= 1],
    ["spende", "Beliebtes Gehege", "5 Mal die Spendenbox geleert.", "☺", () => S("spenden") >= 5],
    ["aufgabe", "Fleißig", "7 Aufgaben des Tages erledigt.", "✓", () => (st.tasks || 0) >= 7],
    ["deko", "Innenarchitektin", "Etwas im Gehege umgestellt.", "↔", () => S("moved") >= 1],
  ];
  const solvedCount = () => { let n = 0; for (let d = 1; d <= 31; d++) if (App.isSolved(d)) n++; return n; };
  function checkBadges() {
    if (!H || typeof Animals === "undefined") return;
    BADGES.forEach(([id, name]) => {
      if (st.badges.includes(id)) return;
      let ok = false; try { ok = BADGES.find((b) => b[0] === id)[4](); } catch (e) {}
      if (ok) { st.badges.push(id); save(); setTimeout(() => { H.toast(`Abzeichen freigeschaltet: „${name}“ – 5 Taler!`, 4000); Zoo.addCoins(5); H.sfx.good(); }, 600); }
    });
  }
  function badgeGrid() {
    return H.el("div", { class: "badges" }, ...BADGES.map(([id, name, desc, icon]) => { const has = st.badges.includes(id); return H.el("div", { class: "badge" + (has ? " has" : "") }, H.el("div", { class: "medal", text: icon }), H.el("b", { text: name }), H.el("small", { text: desc })); }));
  }
  function openBadges() { const ov = overlay("Abzeichen", `${st.badges.length} von ${BADGES.length} freigeschaltet`); ov.area.append(badgeGrid()); }

  /* ================= Overlay-Helfer ================= */
  function overlay(title, sub, cls = "") {
    const ov = H.el("div", { class: "gehege-overlay " + cls, role: "dialog", "aria-label": title });
    const area = H.el("div", { class: "g-area" });
    const close = () => { ov.remove(); document.body.style.overflow = ""; document.removeEventListener("keydown", esc); };
    const esc = (e) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", esc);
    ov.append(H.el("div", { class: "g-head" }, H.el("div", {}, H.el("h2", { text: title }), H.el("div", { class: "g-sub", text: sub })), H.el("button", { class: "modal-close", "aria-label": "Schließen", text: "✖", onclick: close })), area);
    document.body.append(ov); document.body.style.overflow = "hidden";
    return { ov, area, close };
  }

  /* ================= Weihnachtsmann (24.12.) ================= */
  function santa() {
    if (document.querySelector(".gehege-overlay, .finale-overlay, .pola-wrap, .post-run, .gift-parcel") || !document.getElementById("modal").classList.contains("hidden")) { setTimeout(santa, 5000); return; }
    st.santa = true; save();
    const fly = H.el("div", { class: "santa-fly" });
    const deer = Animals.svg({ sp: "hund", col: 2, acc: "geweih" }, { walk: true, width: 70 });
    fly.innerHTML = `<div class="sleigh"><svg viewBox="0 0 160 90" aria-hidden="true"><path d="M10 60 Q20 80 60 78 L130 78 Q150 78 152 64" stroke="#d9a521" stroke-width="5" fill="none"/><path d="M20 30 L120 30 L132 64 L28 64 Q14 64 16 48z" fill="#d93a4a"/><path d="M20 30 L120 30" stroke="#ffd84d" stroke-width="4"/><circle cx="70" cy="18" r="14" fill="#d93a4a"/><circle cx="70" cy="14" r="9" fill="#f5d0b5"/><path d="M60 18 Q70 34 80 18z" fill="#fff"/><path d="M60 10 L70 -6 L82 10z" fill="#d93a4a"/><circle cx="70" cy="-6" r="3.5" fill="#fff"/><rect x="58" y="8" width="24" height="4" rx="2" fill="#fff"/><rect x="92" y="14" width="22" height="18" fill="#58b6ff"/><rect x="100" y="14" width="5" height="18" fill="#fff"/></svg></div><div class="deer">${deer}</div><div class="deer">${deer}</div>`;
    document.body.append(fly);
    H.sfx.jingle(); H.toast("Ho ho ho! Der Weihnachtsmann fliegt übers Gehege!", 4000);
    const field = document.getElementById("zoo-pen");
    field?.scrollIntoView({ behavior: "smooth", block: "center" });
    fly.animate([{ transform: `translateX(-420px) translateY(0)` }, { transform: `translateX(${innerWidth * 0.5}px) translateY(-20px)` }, { transform: `translateX(${innerWidth + 60}px) translateY(10px)` }], { duration: 9000, easing: "linear", fill: "forwards" }).onfinish = () => fly.remove();
    // Geschenke fallen ins Gehege
    const owned = [...new Set(Animals.VARIANTS.filter((v) => Animals.isFound(v.id)).map((v) => v.sp))];
    for (let i = 0; i < 8; i++) setTimeout(() => {
      const r = fly.querySelector(".sleigh").getBoundingClientRect(); if (!r.width) return;
      const g = H.el("div", { class: "santa-gift", html: `<svg viewBox="0 0 20 20"><rect x="2" y="6" width="16" height="13" fill="${["#e85d75", "#58b6ff", "#ffd84d", "#4fae7f"][i % 4]}"/><rect x="8.5" y="6" width="3" height="13" fill="#fff"/><rect x="1" y="4" width="18" height="4" fill="#fff" opacity=".9"/></svg>`, style: `left:${r.left + r.width * 0.6}px;top:${r.top + r.height * 0.6}px` });
      document.getElementById("fx").append(g);
      const fr = field ? field.getBoundingClientRect() : { left: 0, width: innerWidth, top: innerHeight * 0.6, height: 100 };
      const tx = fr.left + fr.width * (0.1 + Math.random() * 0.8) - (r.left + r.width * 0.6), ty = fr.top + fr.height * (0.55 + Math.random() * 0.35) - (r.top + r.height * 0.6);
      g.animate([{ transform: "translate(0,0) rotate(0)" }, { transform: `translate(${tx}px, ${ty}px) rotate(${Math.random() * 360}deg)` }], { duration: 1600, easing: "cubic-bezier(.5,0,.8,.6)", fill: "forwards" }).onfinish = () => { H.burst(r.left + r.width * 0.6 + tx, r.top + r.height * 0.6 + ty, ["✨", "⭐"], 6, 40); g.remove(); };
    }, 2000 + i * 650);
    setTimeout(() => {
      if (owned.length) { owned.forEach((sp) => Zoo.setFood(sp, (Zoo.foodStock()[sp] || 0) + 3)); Zoo.refresh(); H.toast("Der Weihnachtsmann hat für jede Tierart 3 Leckerlis dagelassen!", 5000); Animals.sayRandom("Ein Geschenk vom Weihnachtsmann!"); setTimeout(() => Animals.sayRandom("Frohe Weihnachten, Mama!"), 3200); }
      else { Zoo.addCoins(30); H.toast("Der Weihnachtsmann hat 30 Taler für dich dagelassen!", 5000); }
    }, 8200);
  }

  /* ================= Heiligabend-Show ================= */
  function christmasShow(after) {
    const ov = H.el("div", { class: "xmas-show" });
    const stage = H.el("div", { class: "xs-stage" });
    stage.innerHTML = `<div class="xs-stars"></div><div class="xs-tree">${Zoo.preview("tanne", true)}</div>`;
    ov.append(stage, H.el("div", { class: "xs-caption", text: "Alle Tiere versammeln sich unter dem Weihnachtsbaum …" }));
    document.body.append(ov);
    const mine = Animals.VARIANTS.filter((v) => Animals.isFound(v.id));
    const cast = (mine.length ? H.shuffle(mine).slice(0, 14) : [{ sp: "capy", col: 0, acc: "orange", name: "Kalle" }, { sp: "katze", col: 1, acc: "schleife", name: "Mimi" }, { sp: "hund", col: 0, acc: "schal", name: "Bello" }, { sp: "waschbaer", col: 0, acc: "muetze", name: "Rocky" }]);
    const n = cast.length;
    const actors = cast.map((v, i) => {
      const left = i % 2 === 0;
      const sp = Animals.SPECIES[v.sp], w = Math.min(110, innerWidth * 0.12) * (sp.scale || 1);
      const a = H.el("div", { class: "xs-animal" + (left ? "" : " flip"), html: Animals.svg(v, { walk: true, width: w }) });
      const slot = Math.floor(i / 2), side = left ? -1 : 1;
      const tx = 50 + side * (14 + slot * (34 / Math.ceil(n / 2))), ty = 72 + (slot % 2) * 8;
      a.style.left = left ? "-15%" : "110%"; a.style.top = ty + "%";
      stage.append(a);
      setTimeout(() => { a.style.transition = `left ${2.5 + slot * 0.3}s ease-out`; a.style.left = tx + "%"; setTimeout(() => { a.querySelector("svg")?.classList.remove("walking"); a.classList.toggle("flip", tx > 50); }, (2.5 + slot * 0.3) * 1000); }, 300 + i * 220);
      return a;
    });
    const LINES = ["♪ Stille Nacht ♪", "♪ heilige Nacht ♪", "♪ alles schläft ♪", "♪ einsam wacht ♪", "♪ nur das traute ♪", "♪ hochheilige Paar ♪", "♪ holder Knabe ♪", "♪ im lockigen Haar ♪", "♪ schlaf in himmlischer Ruh ♪", "♪ schlaf in himmlischer Ruh ♪"];
    setTimeout(() => {
      ov.querySelector(".xs-caption").textContent = "… und singen gemeinsam für dich.";
      const ms = playSong(1, 0.06);
      const step = ms / LINES.length;
      LINES.forEach((l, i) => setTimeout(() => { const a = actors[i % actors.length]; const b = H.el("div", { class: "pen-say", text: l }); a.append(b); setTimeout(() => b.remove(), step * 1.4); }, i * step));
      setTimeout(() => {
        ov.querySelector(".xs-caption").textContent = "Frohe Weihnachten, Mama!";
        for (let i = 0; i < 6; i++) setTimeout(() => { const s = H.el("div", { class: "xs-shoot" }); stage.append(s); setTimeout(() => s.remove(), 1600); }, i * 500);
        H.rain(["✨", "⭐", "💖"], 50);
        ov.append(H.el("button", { class: "btn btn-green xs-btn", text: "Den Brief unter dem Baum öffnen", onclick: () => { ov.remove(); after && after(); } }));
      }, ms + 500);
    }, 300 + n * 220 + 3200);
    ov.append(H.el("button", { class: "xs-skip", text: "Überspringen", onclick: () => { ov.remove(); after && after(); } }));
  }

  /* ================= Jahresrückblick + Abschiedsbrief (31.12.) ================= */
  const FAREWELL =
    "Liebe Mama,\n\n" +
    "erinnerst du dich an den 1. Dezember? Matsch, ein kaputter Zaun, kein einziger Baum – und wir mittendrin, ganz schön traurig. " +
    "Dann bist du gekommen. Kapitel für Kapitel hast du unser Gehege in ein Winterparadies verwandelt.\n\n" +
    "Du hast uns gefüttert, getröstet, gesucht und gefunden. Du hast Rätsel gelöst, Türme gebaut und Waschbären verjagt. " +
    "Und vor allem warst du einfach da.\n\n" +
    "Wir wünschen dir ein wunderbares neues Jahr – mit genauso viel Wärme, wie du sie uns geschenkt hast. " +
    "Wir sind so froh, dass es dich gibt.";
  function review() {
    const { area } = overlay("Mamas Dezember", "Ein Rückblick auf 31 Kapitel im Tiergehege", "review-overlay");
    const found = Animals.VARIANTS.filter((v) => Animals.isFound(v.id));
    const favs = found.length ? found.slice().sort((a, b) => Zoo.fedAt(b.id) - Zoo.fedAt(a.id))[0] : null;
    const tile = (n, l) => H.el("div", { class: "rv-tile" }, H.el("b", { text: n }), H.el("span", { text: l }));
    area.append(
      H.el("div", { class: "rv-tiles" }, tile(solvedCount(), "Rätsel gelöst"), tile(`${found.length}/100`, "Tiere gefunden"), tile(S("fed"), "Mal gefüttert"), tile(Zoo.ownedList().length, "Dinge im Gehege"),
        tile(st.badges.length, "Abzeichen"), tile(Zoo.high("turm"), "Turm-Rekord"), tile(Zoo.high("waschbaer"), "Waschbär-Rekord"), tile(Zoo.high("pinguin"), "Pinguin-Rekord")),
      H.el("h3", { text: "Vorher und nachher" }),
      H.el("div", { class: "rv-before" }, H.el("figure", {}, H.el("div", { class: "rv-scene", html: Zoo.scene(null, [], true) }), H.el("figcaption", { text: "1. Dezember" })), H.el("figure", {}, H.el("div", { class: "rv-scene", html: Zoo.scene(null, null, true) }), H.el("figcaption", { text: "31. Dezember" }))),
      favs ? H.el("p", { class: "rv-fav", text: `Zuletzt gefüttert: ${favs.name} – ${Animals.desc(favs)}` }) : null,
      H.el("h3", { text: `Deine Fotowand (${found.length} Polaroids)` }),
      H.el("div", { class: "rv-wall" }, ...found.map((v, i) => H.el("button", { class: "rv-pola", style: `--r:${((i * 37) % 9) - 4}deg`, html: `<div class="rv-pic">${Photos.scene(v)}</div><small>${v.name}</small>`, onclick: () => Photos.show(v, { replay: true }) }))),
      H.el("div", { class: "rv-letter" }, H.el("h3", { text: "Ein Brief zum Abschied" }), H.el("div", { class: "gift-msg", text: FAREWELL }), H.el("p", { class: "sig", text: "Deine Tiere aus dem Gehege" })));
  }

  /* ================= Start ================= */
  function init() {
    H = App.h;
    load();
    // Spieluhr-Knopf
    const mb = H.el("button", { id: "music-toggle", class: "music-toggle" + (st.music ? "" : " off"), title: "Spieluhr an/aus", text: "♪" });
    mb.addEventListener("click", (e) => { e.stopPropagation(); music(!st.music); H.toast(st.music ? "Die Spieluhr spielt." : "Die Spieluhr ist aus."); });
    document.body.append(mb);
    if (st.music) { const once = () => { music(true); document.removeEventListener("pointerdown", once); }; document.addEventListener("pointerdown", once); }
    wreath();
    renderToday();
    checkBadges();
    setTimeout(randomEvent, 60000 + Math.random() * 60000); setInterval(randomEvent, 240000 + Math.random() * 120000);
    setTimeout(visitor, 8000); setInterval(visitor, 26000);
    if (!st.santa && App.isUnlocked(24)) setTimeout(santa, 9000);
    // Tag/Nacht regelmäßig aktualisieren
    let wasNight = isNight();
    setInterval(() => { if (isNight() !== wasNight) { wasNight = isNight(); Zoo.refresh(); Animals.refreshPens(); renderToday(); } }, 60000);
  }
  return { init, isNight, weather, decoratePen, track, checkBadges, renderToday, openBadges, badgeGrid, christmasShow, review, santa, BADGES };
})();
