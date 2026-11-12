/* =========================================================
   Mamas tierischer Adventskalender – Kern
   ---------------------------------------------------------
   ✏️  HIER KANNST DU ALLES PERSÖNLICH ANPASSEN:
   ========================================================= */
const CONFIG = {
  // Jahr des Adventskalenders (Türchen öffnen sich ab dem 1.12. dieses Jahres)
  year: 2026,

  // Die geheime Lösung. Muss (ohne Leerzeichen) genau 23 Buchstaben haben!
  // Leerzeichen trennen die Wörter (werden am 24. als Lücken angezeigt).
  solution: "DU BIST DIE ALLERBESTE MAMA",

  // Überschrift + Nachricht, die nach dem allerletzten Rätsel erscheint
  finalTitle: "Frohe Weihnachten, Mama! 🎄",
  finalMessage:
    "Du hast alle 24 Rätsel gelöst – du bist einfach unschlagbar!\n\n" +
    "Danke, dass du immer für mich da bist, für deine Umarmungen, " +
    "dein Lachen und dafür, dass du jedes Tier dieser Welt streicheln willst. 🐾\n\n" +
    "Ich hab dich unendlich lieb!",
  signature: "In Liebe ❤️",

  // Kleiner Satz, der am 24. als Hinweis zur Lösung angezeigt wird
  finalClue: "Ein Satz aus 5 Wörtern – und er ist zu 100 % wahr. 💕",
};

/* ========================================================= */

const App = (() => {
  const STORE_KEY = "mama-advent-" + CONFIG.year;
  const params = new URLSearchParams(location.search);
  const PREVIEW = !!window.FORCE_PREVIEW || params.has("vorschau") || params.has("test");
  const WORDS = CONFIG.solution.trim().toUpperCase().split(/\s+/);
  const LETTERS = WORDS.join("").split("");
  if (LETTERS.length !== 23) console.warn("⚠️ Die Lösung hat " + LETTERS.length + " statt 23 Buchstaben!");

  const puzzles = {};
  let state = { solved: {}, flakes: 0 };
  let soundOn = true;

  /* ---------- Speicher ---------- */
  function load() {
    try {
      if (params.has("reset")) localStorage.removeItem(STORE_KEY);
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) state = Object.assign(state, JSON.parse(raw));
      soundOn = localStorage.getItem(STORE_KEY + "-sound") !== "off";
    } catch (e) { /* privates Fenster o. ä. – egal */ }
  }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {}
  }

  /* ---------- Hilfsfunktionen ---------- */
  function el(tag, props = {}, ...kids) {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(props || {})) {
      if (v == null) continue;
      if (k === "class") n.className = v;
      else if (k === "text") n.textContent = v;
      else if (k === "html") n.innerHTML = v;
      else if (k === "style") n.style.cssText = v;
      else if (k.startsWith("on")) n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v);
    }
    for (const kid of kids.flat()) if (kid != null) n.append(kid);
    return n;
  }
  function seeded(seed) {
    let s = seed >>> 0;
    return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  function shuffle(arr, rnd = Math.random) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  function norm(s) {
    return String(s).toLowerCase().trim()
      .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
      .replace(/[^a-z0-9]/g, "");
  }

  /* ---------- Buchstaben-Verteilung ---------- */
  // Jeder Tag 1–23 bekommt einen Buchstaben – absichtlich durcheinander!
  const ORDER = shuffle(LETTERS.map((_, i) => i), seeded(2412));
  const letterFor = (day) => LETTERS[ORDER[day - 1]];

  /* ---------- Sound (selbst gebaut, keine Dateien nötig) ---------- */
  let actx = null;
  function ctx() {
    if (!actx) { try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; } }
    if (actx.state === "suspended") actx.resume();
    return actx;
  }
  function tone(freq, dur = 0.15, type = "sine", vol = 0.18, slideTo = null, delay = 0) {
    if (!soundOn) return;
    const c = ctx(); if (!c) return;
    const t = c.currentTime + delay;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(c.destination); o.start(t); o.stop(t + dur + 0.05);
  }
  const sfx = {
    tone,
    pop: () => tone(600 + Math.random() * 500, 0.09, "sine", 0.2, 1400),
    boop: (f = 440) => tone(f, 0.18, "triangle", 0.2, f * 1.5),
    tick: () => tone(900, 0.05, "square", 0.05),
    good: () => [523, 659, 784].forEach((f, i) => tone(f, 0.18, "triangle", 0.18, null, i * 0.08)),
    bad: () => { tone(300, 0.18, "sawtooth", 0.08, 200); tone(220, 0.25, "sawtooth", 0.07, 150, 0.12); },
    meow: () => { tone(700, 0.35, "sawtooth", 0.06, 450); tone(1050, 0.2, "sine", 0.08, 800); },
    squeak: () => tone(1200, 0.12, "sine", 0.15, 2200),
    win: () => [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) => tone(f, 0.22, "triangle", 0.18, null, i * 0.11)),
    jingle: () => [659, 659, 659, 0, 659, 659, 659, 0, 659, 784, 523, 587, 659].forEach((f, i) => f && tone(f, 0.2, "triangle", 0.15, null, i * 0.15)),
  };

  /* ---------- Effekte ---------- */
  const fx = () => document.getElementById("fx");
  function particle(x, y, content, { dx = 0, dy = -120, rot = 0, dur = 1000, size = 24, delay = 0, scale = 1 } = {}) {
    const p = el("div", { class: "particle", text: content, style: `left:${x}px;top:${y}px;font-size:${size}px` });
    fx().append(p);
    const anim = p.animate(
      [
        { transform: "translate(-50%,-50%) scale(.3) rotate(0deg)", opacity: 1 },
        { transform: `translate(calc(-50% + ${dx * 0.6}px), calc(-50% + ${dy * 0.6}px)) scale(${scale}) rotate(${rot * 0.6}deg)`, opacity: 1, offset: 0.6 },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(${scale * 0.8}) rotate(${rot}deg)`, opacity: 0 },
      ],
      { duration: dur, delay, easing: "cubic-bezier(.2,.7,.4,1)", fill: "backwards" }
    );
    anim.onfinish = () => p.remove();
  }
  function burst(x, y, emojis = ["💖", "✨", "🐾"], n = 10, spread = 120) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, r = spread * (0.5 + Math.random() * 0.7);
      particle(x, y, pick(emojis), { dx: Math.cos(a) * r, dy: Math.sin(a) * r - 40, rot: (Math.random() - 0.5) * 360, dur: 800 + Math.random() * 600, size: 16 + Math.random() * 18 });
    }
  }
  function burstAt(node, emojis, n, spread) {
    const r = node.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, emojis, n, spread);
  }
  function confetti(emojis = ["🎉", "✨", "💖", "🐾", "⭐", "🎀", "❄️"], n = 60) {
    const W = innerWidth;
    for (let i = 0; i < n; i++) {
      particle(Math.random() * W, -20, pick(emojis), { dx: (Math.random() - 0.5) * 200, dy: innerHeight + 60, rot: (Math.random() - 0.5) * 720, dur: 2200 + Math.random() * 1800, size: 18 + Math.random() * 20, delay: Math.random() * 900, scale: 1 });
    }
  }
  function rain(emojis, n = 40) { confetti(emojis, n); }

  let toastTimer;
  function toast(msg, ms = 2600) {
    const t = document.getElementById("toast");
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), ms);
  }
  function shakeEl(n) { n.classList.remove("shake"); void n.offsetWidth; n.classList.add("shake"); }

  /* ---------- Textantwort-Baustein ---------- */
  function textAnswer(root, { answers, placeholder = "Deine Antwort…", onRight, wrong = ["Hmm, nicht ganz! 🙈", "Fast! Probier's nochmal 🐾", "Nope – aber du schaffst das! 💪"], button = "Prüfen ✔️", type = "text" }) {
    const input = el("input", { class: "text-in", placeholder, type, autocomplete: "off", autocapitalize: "off", spellcheck: "false", inputmode: type === "number" ? "numeric" : null });
    const fb = el("div", { class: "feedback" });
    const ok = answers.map(norm);
    const check = () => {
      if (!input.value.trim()) { shakeEl(input); return; }
      const v = norm(input.value);
      if (ok.some((a) => v === a || (a.length >= 4 && v.endsWith(a)))) { input.disabled = true; btn.disabled = true; onRight(); }
      else { sfx.bad(); shakeEl(input); fb.textContent = pick(wrong); }
    };
    const btn = el("button", { class: "btn", text: button, onclick: check });
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") check(); });
    root.append(el("div", { class: "row", style: "margin-top:14px" }, input, btn), fb);
    return input;
  }

  /* ---------- Datum ---------- */
  function now() { return new Date(); }
  function unlockDate(day) { return new Date(CONFIG.year, 11, day, 0, 0, 0); }
  function isUnlocked(day) { return PREVIEW || now() >= unlockDate(day); }
  function daysUntil(day) { return Math.ceil((unlockDate(day) - now()) / 86400000); }
  function todayDay() {
    const n = now();
    return n.getFullYear() === CONFIG.year && n.getMonth() === 11 && n.getDate() <= 24 ? n.getDate() : 0;
  }

  /* ---------- Kalender ---------- */
  const DOOR_ORDER = [7, 15, 1, 22, 10, 18, 3, 13, 24, 5, 20, 9, 16, 2, 11, 23, 6, 19, 12, 4, 14, 8, 21, 17];
  const doors = {};

  function buildCalendar() {
    const cal = document.getElementById("calendar");
    cal.innerHTML = "";
    DOOR_ORDER.forEach((day, i) => {
      const p = puzzles[day] || { emoji: "🎁" };
      const inside = el("div", { class: "door-inside" });
      const door = el("button", { class: `door c${(i * 5 + day) % 6}`, "aria-label": "Türchen " + day, style: day === 24 ? "background:linear-gradient(135deg,#e85d75,#ffb84d)" : null },
        el("span", { class: "num", text: day }),
        el("span", { class: "d-art", html: p.art && (typeof Animals !== "undefined") ? Animals.svg(p.art, { fit: true }) : "🎁" }),
        el("span", { class: "knob" })
      );
      const wrap = el("div", { class: "door-wrap" }, inside, door);
      door.addEventListener("click", (e) => { e.stopPropagation(); onDoor(day); });
      doors[day] = { wrap, door, inside };
      cal.append(wrap);
      refreshDoor(day);
    });
  }

  function refreshDoor(day) {
    const d = doors[day]; if (!d) return;
    const p = puzzles[day] || { emoji: "🎁" };
    const solved = !!state.solved[day];
    d.door.classList.toggle("locked", !isUnlocked(day));
    d.door.classList.toggle("today", todayDay() === day && !solved);
    d.door.querySelector(".lock")?.remove();
    if (!isUnlocked(day)) d.door.append(el("span", { class: "lock", text: "🔒" }));
    d.door.classList.toggle("open", solved);
    d.inside.innerHTML = "";
    if (solved && day !== 24) d.inside.append(el("div", {}, el("div", { class: "in-letter", text: letterFor(day) }), el("div", { class: "in-art", html: Animals.svg(p.art, { fit: true }) })));
    else if (solved) d.inside.append(el("div", { class: "in-letter", text: "♥" }));
    else d.inside.append(el("div", { class: "in-art", html: p.art ? Animals.svg(p.art, { fit: true }) : "" }));
  }

  const T = (n) => `${n} ${n === 1 ? "Tag" : "Tage"}`;
  const LOCKED_MSGS = [
    (n) => `Nicht schummeln, Mama! Noch ${T(n)}.`,
    (n) => `Die Katze sitzt noch auf diesem Türchen. Noch ${T(n)}.`,
    (n) => `Der Waschbär hat abgeschlossen. Noch ${T(n)}.`,
    (n) => `Gut Ding will Weile haben – noch ${T(n)}.`,
    (n) => `Hier wird noch geprobt. Premiere in ${T(n)}.`,
  ];

  function onDoor(day) {
    const d = doors[day];
    if (!isUnlocked(day)) {
      d.door.classList.remove("shake"); void d.door.offsetWidth; d.door.classList.add("shake");
      sfx.bad(); toast(pick(LOCKED_MSGS)(daysUntil(day)));
      return;
    }
    sfx.boop(500 + day * 15);
    d.door.classList.add("open");
    burstAt(d.door, ["✨", "⭐", "❄️"], 8, 70);
    setTimeout(() => openPuzzle(day), 450);
  }

  /* ---------- Modal ---------- */
  const PRAISE = ["Bravo, Mama!", "Glänzend kombiniert!", "Messerscharf gelöst!", "Respekt!", "Elegant gemacht!", "Klasse!", "Sauber gelöst!", "Tierisch gut!", "Ganz große Klasse!", "Wie immer souverän!"];
  let currentDay = null;

  function openPuzzle(day) {
    currentDay = day;
    const p = puzzles[day];
    const m = document.getElementById("modal");
    m.querySelector(".modal-art").innerHTML = p.art ? Animals.svg(p.art, { fit: true, walk: true }) : "";
    m.querySelector(".modal-day").textContent = `Türchen ${day} · ${day}. Dezember`;
    m.querySelector(".modal-title").textContent = p.title;
    m.querySelector(".modal-intro").textContent = p.intro || "";
    const body = m.querySelector(".modal-body");
    body.innerHTML = "";
    m.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    if (state.solved[day] && day !== 24) showReward(day, true);
    else p.render(body, { solve: () => solved(day), day });
  }

  function closeModal() {
    const m = document.getElementById("modal");
    if (m.classList.contains("hidden")) return;
    m.classList.add("hidden");
    document.body.style.overflow = "";
    const body = m.querySelector(".modal-body");
    if (body._cleanup) { body._cleanup(); body._cleanup = null; }
    body.innerHTML = "";
    if (currentDay) refreshDoor(currentDay);
    currentDay = null;
  }

  function solved(day) {
    const first = !state.solved[day];
    state.solved[day] = true; save();
    sfx.win(); confetti();
    if (day === 24) return; // Finale macht das Rätsel selbst
    setTimeout(() => showReward(day, false, first), 700);
  }

  function showReward(day, again, first) {
    const m = document.getElementById("modal");
    const body = m.querySelector(".modal-body");
    if (body._cleanup) { body._cleanup(); body._cleanup = null; }
    m.querySelector(".modal-intro").textContent = "";
    body.innerHTML = "";
    const letter = letterFor(day);
    const btn = el("button", { class: "btn btn-green", text: again ? "Zurück zum Kalender 🏠" : "Ins Körbchen legen 🧺" });
    const replay = el("button", { class: "btn btn-soft", text: "🔁 Nochmal spielen", onclick: () => { body.innerHTML = ""; puzzles[day].render(body, { solve: () => { sfx.win(); confetti(); setTimeout(() => showReward(day, true), 600); }, day }); } });
    const letterBox = el("div", { class: "r-letter", text: letter });
    letterBox.addEventListener("click", () => { sfx.pop(); burstAt(letterBox, ["💖", "✨"], 10); });
    body.append(el("div", { class: "reward" },
      el("h3", { text: again ? "Dein Buchstabe von heute" : pick(PRAISE) }),
      el("p", { text: again ? "Der liegt schon sicher im Körbchen." : "Dein Buchstabe für heute:" }),
      letterBox,
      el("p", { text: puzzles[day].outro || "" }),
      el("div", { class: "row" }, btn, again ? replay : null)
    ));
    btn.onclick = () => {
      const r = letterBox.getBoundingClientRect();
      closeModal();
      if (!again) flyToBasket(letter, r, day);
    };
  }

  function flyToBasket(letter, from, day) {
    const target = document.getElementById("basket");
    const tr = target.getBoundingClientRect();
    const p = el("div", { class: "particle", text: letter, style: `left:${from.left + from.width / 2}px;top:${from.top + from.height / 2}px;font-size:70px;font-weight:700;color:#e85d75` });
    fx().append(p);
    const dx = tr.left + tr.width / 2 - (from.left + from.width / 2), dy = tr.top + 30 - (from.top + from.height / 2);
    p.animate([{ transform: "translate(-50%,-50%) scale(1)" }, { transform: `translate(calc(-50% + ${dx * 0.5}px), calc(-50% + ${dy * 0.5 - 120}px)) scale(1.2) rotate(180deg)` }, { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(.3) rotate(360deg)`, opacity: 0.6 }], { duration: 900, easing: "ease-in-out" }).onfinish = () => {
      p.remove(); renderBasket(day);
      const icon = document.querySelector(".basket-icon");
      icon.classList.remove("wiggle"); void icon.offsetWidth; icon.classList.add("wiggle");
      burstAt(target, ["💖", "✨", "🐾"], 12, 90); sfx.good();
    };
  }

  /* ---------- Körbchen ---------- */
  function renderBasket(popDay) {
    const box = document.getElementById("basket-letters");
    box.innerHTML = "";
    let count = 0;
    for (let d = 1; d <= 23; d++) {
      const has = !!state.solved[d];
      if (has) count++;
      const b = el("div", { class: "b-letter" + (has ? "" : " empty") + (popDay === d ? " pop" : ""), title: "Türchen " + d },
        has ? letterFor(d) : "?", el("small", { text: d }));
      if (has) b.addEventListener("click", (e) => { e.stopPropagation(); sfx.boop(300 + d * 20); burstAt(b, ["💖", "✨"], 6, 50); });
      box.append(b);
    }
    document.getElementById("basket-count").textContent = `${count} / 23 gesammelt`;
  }

  /* ---------- Deko: Titel ---------- */
  function buildTitle() {
    const h = document.getElementById("title");
    const words = ["Mamas", "tierischer", "Adventskalender"];
    let k = 0;
    words.forEach((w, wi) => {
      const ws = el("span", { class: "t-word" + (wi === 1 ? " t-green" : "") });
      [...w].forEach((ch) => {
        const s = el("span", { class: "t-letter", text: ch, "aria-hidden": "true" });
        const f = 330 + (k++ % 12) * 40;
        s.addEventListener("click", (e) => { e.stopPropagation(); s.classList.remove("jump"); void s.offsetWidth; s.classList.add("jump"); sfx.boop(f); burstAt(s, ["✨", "⭐"], 4, 40); });
        ws.append(s);
      });
      h.append(ws, " ");
    });
    let hearts = 0;
    const heart = document.getElementById("title-heart");
    heart.addEventListener("click", (e) => {
      e.stopPropagation(); hearts++; sfx.pop(); burstAt(heart, ["💖", "💗", "💕"], 8, 60);
      heart.style.transform = `scale(${1 + Math.min(hearts, 6) * 0.15})`;
      if (hearts === 6) { rain(["💖", "💗", "💕", "💞", "🐾"], 70); toast("Herzregen für die beste Mama! 💖"); sfx.win(); hearts = 0; setTimeout(() => (heart.style.transform = ""), 400); }
    });
  }

  /* ---------- Deko: Lichterkette ---------- */
  const BULB_COLORS = ["#ff5a7a", "#ffcf3f", "#4fd18b", "#58b6ff", "#c77dff", "#ff9a3c"];
  function buildLights() {
    const box = document.getElementById("lights");
    box.innerHTML = "";
    const n = Math.max(8, Math.floor(innerWidth / 48));
    for (let i = 0; i < n; i++) {
      let c = i % BULB_COLORS.length;
      const b = el("button", { class: "bulb", "aria-label": "Lämpchen", style: `background:${BULB_COLORS[c]};color:${BULB_COLORS[c]};animation-delay:${(i % 4) * 0.4}s;margin-top:${14 + Math.sin(i / n * Math.PI) * 10}px` });
      b.addEventListener("click", (e) => {
        e.stopPropagation(); c = (c + 1) % BULB_COLORS.length;
        b.style.background = b.style.color = BULB_COLORS[c];
        sfx.tone(523 * Math.pow(2, c / 6), 0.15, "sine", 0.15);
      });
      box.append(b);
    }
  }

  /* ---------- Deko: Schnee ---------- */
  function startSnow() {
    const box = document.getElementById("snow");
    const flakes = ["❄", "❅", "❆", "✻"];
    setInterval(() => {
      if (document.hidden || box.childElementCount > 40) return;
      const size = 14 + Math.random() * 18;
      const f = el("div", { class: "flake", text: pick(flakes), style: `left:${Math.random() * 100}vw;font-size:${size}px;animation-duration:${9 + Math.random() * 9}s;--drift:${(Math.random() - 0.5) * 160}px;opacity:${0.6 + Math.random() * 0.4}` });
      f.addEventListener("animationend", () => f.remove());
      f.addEventListener("pointerdown", (e) => {
        e.stopPropagation();
        burst(e.clientX, e.clientY, ["💖", "✨", "💧"], 6, 50); sfx.pop(); f.remove();
        state.flakes = (state.flakes || 0) + 1; save();
        if (state.flakes % 15 === 0) toast(`❄️ ${state.flakes} Schneeflocken gefangen! Profi-Fängerin!`);
      });
      box.append(f);
    }, 700);
  }

  /* ---------- Deko: Kapibara ---------- */
  const CAPY = ["Hallo Mama! 🍊", "Ich bin Kalle, das Kapibara 🥰", "Ganz entspannt bleiben… 🧘", "Hast du heute schon ein Türchen geöffnet?", "Streichelst du mich? 🥺", "Kapibaras sind mit allen befreundet 💕", "Orange auf dem Kopf = Stil 🍊", "Ich mag Badewannen 🛁", "Rätseln macht hungrig 🍉", "Du schaffst das! 💪", "*kuschel* 🤎"];
  function setupCapy() {
    const wrap = document.getElementById("capy-wrap"), capy = document.getElementById("capy"), bubble = document.getElementById("capy-bubble"), orange = document.getElementById("capy-orange");
    let t;
    const say = (msg) => { bubble.textContent = msg; bubble.classList.add("show"); clearTimeout(t); t = setTimeout(() => bubble.classList.remove("show"), 3000); };
    let clicks = 0;
    wrap.addEventListener("click", (e) => {
      e.stopPropagation(); clicks++;
      capy.classList.remove("boing"); void capy.offsetWidth; capy.classList.add("boing");
      sfx.tone(220, 0.2, "sine", 0.25, 330);
      burstAt(capy, ["🤎", "💖", "🍊", "✨"], 7, 70);
      if (clicks % 5 === 0) { orange.classList.toggle("gone"); say(orange.classList.contains("gone") ? "Huch! Meine Orange! 🍊💨" : "Ah, da ist sie wieder 🍊😌"); }
      else say(pick(CAPY));
    });
    setTimeout(() => say(CAPY[0]), 1200);
    setInterval(() => { if (!document.hidden && Math.random() < 0.5) say(pick(CAPY)); }, 22000);
  }

  /* ---------- Hintergrund-Klicks: Pfotenabdrücke ---------- */
  function setupPaws() {
    document.addEventListener("pointerdown", (e) => {
      if (e.target.closest("button, input, select, .modal-card, #modal, .walker, #capy-wrap, .flake, .finale-overlay, .gehege-overlay")) return;
      const p = el("div", { class: "paw", text: pick(["🐾", "🐾", "🐾", "💗", "⭐"]), style: `left:${e.clientX - 10}px;top:${e.clientY - 10}px;--r:${Math.random() * 60 - 30}deg` });
      fx().append(p); p.addEventListener("animationend", () => p.remove());
      sfx.tone(800 + Math.random() * 400, 0.06, "sine", 0.08);
    });
  }

  /* ---------- Countdown ---------- */
  function updateCountdown() {
    const c = document.getElementById("countdown");
    const n = now();
    const t = todayDay();
    if (PREVIEW) {
      c.innerHTML = "🔓 <b>Vorschau-Modus</b>: alle Türchen offen · ";
      c.append(el("button", { class: "btn btn-soft", text: "🔄 Fortschritt löschen", style: "padding:4px 10px;font-size:14px", onclick: () => { try { localStorage.removeItem(STORE_KEY); } catch (e) {} location.reload(); } }));
    }
    else if (n < unlockDate(1)) { const d = daysUntil(1); c.innerHTML = `Noch <b>${d}</b> ${d === 1 ? "Tag" : "Tage"} bis zum ersten Türchen! 🐾`; }
    else if (t) c.innerHTML = `Heute ist der <b>${t}. Dezember</b> – Türchen ${t} wartet auf dich! 🎁`;
    else c.innerHTML = "Frohe Weihnachten! 🎄💖";
  }

  /* ---------- Start ---------- */
  function start() {
    load();
    buildTitle(); buildLights(); buildCalendar(); renderBasket();
    updateCountdown(); setupCapy(); setupPaws(); startSnow();
    if ((typeof Animals !== "undefined")) Animals.init();
    const st = document.getElementById("sound-toggle");
    st.textContent = soundOn ? "🔔" : "🔕";
    st.addEventListener("click", (e) => { e.stopPropagation(); soundOn = !soundOn; st.textContent = soundOn ? "🔔" : "🔕"; try { localStorage.setItem(STORE_KEY + "-sound", soundOn ? "on" : "off"); } catch (er) {} if (soundOn) sfx.good(); });
    const m = document.getElementById("modal");
    m.querySelector(".modal-close").addEventListener("click", closeModal);
    m.addEventListener("click", (e) => { if (e.target === m) closeModal(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
    let rt; addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(buildLights, 300); });
    setInterval(() => { updateCountdown(); Object.keys(doors).forEach((d) => { if (!currentDay) refreshDoor(+d); }); }, 60000);
  }

  return {
    start, config: CONFIG, words: WORDS, letters: LETTERS, letterFor,
    register: (day, def) => (puzzles[day] = def),
    isSolved: (d) => !!state.solved[d],
    markSolved: (d) => { state.solved[d] = true; save(); },
    renderBasket, closeModal, refreshDoor, isUnlocked, preview: PREVIEW,
    h: { el, shuffle, seeded, pick, sleep, norm, sfx, burst, burstAt, confetti, rain, toast, shakeEl, textAnswer },
  };
})();
