/* =========================================================
   Mamas tierischer Adventskalender – Kern
   ---------------------------------------------------------
   ✏️  HIER KANNST DU ALLES PERSÖNLICH ANPASSEN:
   ========================================================= */
const CONFIG = {
  // Jahr des Adventskalenders (Türchen öffnen sich ab dem 1.12. dieses Jahres)
  year: 2026,

  // Brief am 24. Dezember (erscheint nach dem Rätsel unter dem Weihnachtsbaum)
  christmasTitle: "Frohe Weihnachten, Mama! 🎄",
  christmasMessage:
    "Schau dir an, was aus dem tristen Gehege geworden ist – das warst alles du!\n\n" +
    "Danke, dass du immer für mich da bist, für deine Umarmungen, " +
    "dein Lachen und dafür, dass du jedes Tier dieser Welt streicheln willst.\n\n" +
    "Ich hab dich unendlich lieb!",

  // Brief zu Silvester (erscheint, wenn das Feuerwerk gekauft ist)
  newYearTitle: "Frohes neues Jahr, Mama! 🎆",
  newYearMessage:
    "31 Türchen, ein ganzes Gehege voller glücklicher Tiere – und eine Direktorin, " +
    "die sich das alles mehr als verdient hat.\n\n" +
    "Auf ein wunderbares neues Jahr mit dir!",

  signature: "In Liebe ❤️",
};

/* ========================================================= */

const App = (() => {
  const STORE_KEY = "mama-advent-" + CONFIG.year;
  const params = new URLSearchParams(location.search);
  const PREVIEW = !window.TEST && (!!window.FORCE_PREVIEW || params.has("vorschau") || params.has("test"));
  const LAST_DAY = 31;

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
  /* ---------- Ruhe beim Rätseln: Hinweise warten, bis kein Fenster mehr offen ist ---------- */
  const BUSY_SEL = ".gehege-overlay, .finale-overlay, .pola-wrap, .lightbox";
  const busy = () => !document.getElementById("modal")?.classList.contains("hidden") || !!document.querySelector(BUSY_SEL);
  const notes = [];
  function flushNotes() {
    document.body.classList.toggle("is-busy", busy());
    document.body.classList.toggle("covered", !!document.querySelector(".gehege-overlay, .lightbox"));
    if (!notes.length || busy() || document.getElementById("toast").classList.contains("show")) return;
    const [m, ms] = notes.shift(); toast(m, ms);
  }
  function notify(msg, ms) { notes.push([msg, ms]); flushNotes(); }
  setInterval(flushNotes, 600);
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
    return n.getFullYear() === CONFIG.year && n.getMonth() === 11 ? n.getDate() : 0;
  }

  /* ---------- Kalender ---------- */
  const DOOR_ORDER = [7, 15, 1, 22, 10, 18, 3, 13, 24, 5, 20, 9, 16, 2, 11, 23, 6, 19, 12, 4, 14, 8, 21, 17];
  const doors = {};

  const BONUS = [25, 26, 27, 28, 29, 30, 31];
  const bonusVisible = () => PREVIEW || !!state.solved[18];

  function makeDoor(day, i, box) {
    const p = puzzles[day] || {};
    const inside = el("div", { class: "door-inside" });
    const special = day === 24 ? "background:linear-gradient(150deg,#c9a04a,#8e2d3b)" : day > 24 ? "background:linear-gradient(160deg,#3c5a8a,#22314f)" : null;
    const door = el("button", { class: `door c${(i * 5 + day) % 6}`, "aria-label": "Türchen " + day, style: special },
      el("span", { class: "ribbon-v" }), el("span", { class: "ribbon-h" }),
      el("span", { class: "bow", html: BOW }),
      el("span", { class: "num", text: day }),
      el("span", { class: "paw", html: PAW }));
    const wrap = el("div", { class: "door-wrap" }, inside, door);
    door.addEventListener("click", (e) => { e.stopPropagation(); onDoor(day); });
    doors[day] = { wrap, door, inside };
    box.append(wrap);
    refreshDoor(day);
  }

  const PAW = `<svg viewBox="0 0 40 40" aria-hidden="true"><ellipse cx="20" cy="27" rx="9" ry="7.5" fill="currentColor"/><ellipse cx="9" cy="17" rx="3.6" ry="4.6" fill="currentColor"/><ellipse cx="16" cy="11" rx="3.6" ry="4.8" fill="currentColor"/><ellipse cx="24" cy="11" rx="3.6" ry="4.8" fill="currentColor"/><ellipse cx="31" cy="17" rx="3.6" ry="4.6" fill="currentColor"/></svg>`;
  const BOW = `<svg viewBox="0 0 60 32" aria-hidden="true"><path d="M30 16 C18 0 4 4 8 14 C11 22 22 20 30 16Z" fill="#fff"/><path d="M30 16 C42 0 56 4 52 14 C49 22 38 20 30 16Z" fill="#fff"/><path d="M28 17 l-8 14 l6 -2 l2 4z M32 17 l8 14 l-6 -2 l-2 4z" fill="#f3f3f3"/><circle cx="30" cy="16" r="5" fill="#ffe08a"/></svg>`;

  function buildCalendar() {
    const cal = document.getElementById("calendar");
    cal.innerHTML = "";
    DOOR_ORDER.forEach((day, i) => makeDoor(day, i, cal));
    buildBonus();
  }

  function buildBonus(reveal) {
    const sec = document.getElementById("bonus");
    if (!bonusVisible()) { sec.classList.add("hidden"); return; }
    sec.classList.remove("hidden");
    const cal = document.getElementById("calendar-bonus");
    cal.innerHTML = "";
    BONUS.forEach((day, i) => makeDoor(day, i, cal));
    if (reveal) {
      sec.classList.add("reveal");
      setTimeout(() => { sec.scrollIntoView({ behavior: "smooth", block: "center" }); burstAt(sec, ["🎁", "✨", "⭐"], 24, 240); sfx.jingle(); }, 300);
    }
  }

  function refreshDoor(day) {
    const d = doors[day]; if (!d) return;
    const p = puzzles[day] || { emoji: "🎁" };
    const solved = !!state.solved[day];
    d.door.classList.toggle("locked", !isUnlocked(day));
    d.door.classList.toggle("today", todayDay() === day && !solved);
    d.door.classList.toggle("missed", isUnlocked(day) && !solved && todayDay() !== day);
    d.door.querySelector(".lock")?.remove();
    if (!isUnlocked(day)) d.door.append(el("span", { class: "lock", text: "🔒" }));
    d.door.classList.toggle("open", solved);
    d.inside.innerHTML = "";
    const st = typeof Zoo !== "undefined" && Zoo.STORY[day];
    if (solved && st) d.inside.append(el("div", { class: "in-item", html: Zoo.preview(st.item) }), el("div", { class: "in-check", text: "✓" }));
    else d.inside.append(el("div", { class: "in-paw", html: PAW }));
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
      sfx.bad(); toast(Texts.say("gesperrt", { T: T(daysUntil(day)) }));
      return;
    }
    sfx.boop(500 + day * 15);
    if (typeof Animals !== "undefined") Animals.clearIn(d.wrap);
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
    const stItem = typeof Zoo !== "undefined" && Zoo.STORY[day];
    m.querySelector(".modal-art").innerHTML = stItem ? Zoo.preview(stItem.item) : "";
    m.querySelector(".modal-day").textContent = `Kapitel ${day} · ${day}. Dezember`;
    const story = typeof Zoo !== "undefined" && Zoo.STORY[day];
    const sb = m.querySelector(".modal-story");
    sb.innerHTML = "";
    if (story) sb.append(el("div", { class: "story-avatar", html: Animals.svg({ sp: "capy", col: 0, acc: "orange" }, { fit: true }) }), el("p", { text: story.story }));
    sb.classList.toggle("hidden", !story);
    m.querySelector(".modal-title").textContent = p.title;
    m.querySelector(".modal-intro").textContent = p.intro || "";
    const body = m.querySelector(".modal-body");
    body.innerHTML = "";
    m.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    if (state.solved[day]) showReward(day, true);
    else p.render(body, { solve: () => solved(day), day });
    if (!state.solved[day] && typeof Animals !== "undefined") Animals.hideIn("modal", m.querySelector(".modal-card"));
  }

  function closeModal() {
    const m = document.getElementById("modal");
    if (m.classList.contains("hidden")) return;
    m.classList.add("hidden");
    document.body.style.overflow = "";
    const body = m.querySelector(".modal-body");
    if (body._cleanup) { body._cleanup(); body._cleanup = null; }
    body.innerHTML = "";
    if (typeof Animals !== "undefined") Animals.clearIn(m.querySelector(".modal-card"));
    if (currentDay) refreshDoor(currentDay);
    currentDay = null;
  }

  function solved(day) {
    const first = !state.solved[day];
    state.solved[day] = true; save();
    if (first && typeof Extras !== "undefined") Extras.track("door");
    sfx.win(); confetti();
    setTimeout(() => showReward(day, false), 700);
  }

  function showReward(day, again) {
    const m = document.getElementById("modal");
    const body = m.querySelector(".modal-body");
    if (body._cleanup) { body._cleanup(); body._cleanup = null; }
    m.querySelector(".modal-intro").textContent = "";
    m.querySelector(".modal-story").classList.add("hidden");
    body.innerHTML = "";
    const st = Zoo.STORY[day], it = Zoo.info(st.item);
    const coins = again ? 0 : Zoo.earn(day);
    const coinBox = el("div", { class: "r-coins", html: `<span class="coin-ic"></span>+${coins || st.coins} Taler` });
    coinBox.querySelector(".coin-ic").innerHTML = document.getElementById("coin-icon").innerHTML;
    const has = Zoo.owns(st.item);
    const shopBtn = el("button", { class: "btn btn-green", text: has ? "Ist schon im Gehege ✓" : `Zum Shop: ${it[1]}`, onclick: () => { closeModal(); Zoo.openShop(st.item); } });
    shopBtn.disabled = has;
    const later = el("button", { class: "btn btn-soft", text: "Zurück zum Kalender", onclick: () => closeModal() });
    const replay = el("button", { class: "btn btn-soft", text: "Nochmal spielen", onclick: () => { body.innerHTML = ""; puzzles[day].render(body, { solve: () => { sfx.win(); confetti(); setTimeout(() => showReward(day, true), 600); }, day }); } });
    const letterBtn = day === 24 ? el("button", { class: "btn", text: "Zur Bescherung unter dem Baum", onclick: () => { closeModal(); const letter = () => Zoo.letter(CONFIG.christmasTitle, CONFIG.christmasMessage); typeof Extras !== "undefined" ? Extras.christmasShow(letter) : letter(); } })
      : day === 31 && typeof Extras !== "undefined" ? el("button", { class: "btn", text: "Jahresrückblick ansehen", onclick: () => { closeModal(); Extras.review(); } }) : null;
    body.append(el("div", { class: "reward" },
      el("h3", { text: again ? "Dieses Kapitel ist geschafft" : Texts.say("lob") }),
      again ? null : coinBox,
      puzzles[day].outro ? el("p", { class: "r-solution", text: puzzles[day].outro }) : null,
      el("div", { class: "r-story" }, el("div", { class: "r-item", html: Zoo.preview(st.item) }), el("p", { text: st.outro })),
      el("div", { class: "row" }, letterBtn, shopBtn, again ? replay : later)));
    if (!again && coins) { const r = coinBox.getBoundingClientRect(); setTimeout(() => Zoo.addCoins(coins, { x: r.left + r.width / 2, y: r.top + r.height / 2 }), 500); }
    if (!again && day === 18) setTimeout(() => buildBonus(true), 900);
  }

  /* ---------- Deko: Titel ---------- */
  function buildTitle() {
    const h = document.getElementById("title");
    const words = ["Mamas", "tierischer", "Adventskalender"];
    h.classList.add("title-serif");
    let k = 0;
    words.forEach((w, wi) => {
      const ws = el("span", { class: "t-word" + (wi === 1 ? " t-accent" : "") + (wi === 2 ? " t-break" : "") });
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
  const BULB_COLORS = ["#ffe7a3", "#ffd27a", "#fff3cf", "#f6c25b"];
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
      if (document.hidden || document.body.classList.contains("game-open") || document.body.classList.contains("covered") || box.childElementCount > (innerWidth < 600 ? 18 : 30)) return;
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
    // Wenn neben dem Inhalt kein Platz ist, schaut Kalle nur unten aus der Ecke und kommt zum Sprechen hoch
    const peek = () => innerWidth < 1420;
    const pastHero = () => (document.getElementById("topnav")?.getBoundingClientRect().top ?? 0) < 80;
    const say = (msg, ambient) => {
      if (ambient && (busy() || (peek() && !pastHero()))) return;
      bubble.textContent = msg; bubble.classList.add("show"); wrap.classList.add("up");
      clearTimeout(t); t = setTimeout(() => { bubble.classList.remove("show"); wrap.classList.remove("up"); }, 3000);
    };
    let clicks = 0;
    wrap.addEventListener("click", (e) => {
      e.stopPropagation(); clicks++;
      if (typeof Extras !== "undefined") Extras.track("kalle");
      capy.classList.remove("boing"); void capy.offsetWidth; capy.classList.add("boing");
      sfx.tone(220, 0.2, "sine", 0.25, 330);
      burstAt(capy, ["🤎", "💖", "🍊", "✨"], 7, 70);
      if (clicks % 5 === 0) { orange.classList.toggle("gone"); say(orange.classList.contains("gone") ? "Huch! Meine Orange! 🍊💨" : "Ah, da ist sie wieder 🍊😌"); }
      else say(Texts.say("kalle"));
    });
    setTimeout(() => {
      if (!peek() || pastHero()) { say(CAPY[0], true); return; }
      const onScroll = () => { if (!pastHero()) return; removeEventListener("scroll", onScroll); setTimeout(() => say(CAPY[0], true), 600); };
      addEventListener("scroll", onScroll, { passive: true });
    }, 1200);
    setInterval(() => { if (document.hidden || Math.random() < 0.5) return; const n = typeof Animals !== "undefined" ? Animals.hungryCount() : 0; say(n ? Texts.say("hunger", { N: n === 1 ? "ein Tier hat" : n + " Tiere haben" }) : Texts.say("kalle"), true); }, 22000);
  }

  /* ---------- Hintergrund-Klicks: Pfotenabdrücke ---------- */
  function setupPaws() {
    document.addEventListener("pointerdown", (e) => {
      if (e.target.closest("button, input, select, .modal-card, #modal, .walker, #capy-wrap, .flake, .finale-overlay, .gehege-overlay, .gift-parcel, .post-run")) return;
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
      c.append(el("button", { class: "btn btn-soft", text: "🔄 Fortschritt löschen", style: "padding:4px 10px;font-size:14px", onclick: () => { try { Object.keys(localStorage).filter((k) => k.startsWith("mama-")).forEach((k) => localStorage.removeItem(k)); } catch (e) {} location.reload(); } }));
      c.append(" ", el("a", { href: "test.html", class: "btn btn-soft", text: "📅 Testzentrale", style: "padding:4px 10px;font-size:14px;text-decoration:none;display:inline-block" }));
    }
    else if (n < unlockDate(1)) { const d = daysUntil(1); c.innerHTML = `Noch <b>${d}</b> ${d === 1 ? "Tag" : "Tage"} bis zum ersten Türchen`; }
    else if (t && (t <= 24 || bonusVisible())) c.innerHTML = `Heute ist der <b>${t}. Dezember</b> · Kapitel ${t} wartet auf dich`;
    else if (t) c.innerHTML = "Frohe Weihnachten! 🎄💖";
    else c.innerHTML = "Frohes neues Jahr! 🎆";
  }

  /* ---------- Start ---------- */
  function start() {
    load();
    if (typeof Zoo !== "undefined") Zoo.init();
    buildTitle(); buildLights(); buildCalendar();
    updateCountdown(); setupCapy(); setupPaws(); startSnow();
    if (typeof Animals !== "undefined") Animals.init();
    if (typeof Games !== "undefined") Games.init();
    if (typeof Extras !== "undefined") Extras.init();
    const st = document.getElementById("sound-toggle");
    const SND_ON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
    const SND_OFF = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
    st.classList.add("nav-icon"); st.title = "Ton an/aus";
    const setSnd = () => { st.innerHTML = soundOn ? SND_ON : SND_OFF; st.classList.toggle("off", !soundOn); };
    // Navigationsleiste: alle Knöpfe an einem Ort
    const navA = document.getElementById("nav-actions"), navI = document.getElementById("nav-icons");
    const gb = document.getElementById("gehege-btn");
    if (navA && gb) { gb.classList.add("nav-btn"); navA.prepend(gb); }
    if (navI) navI.append(st);
    setSnd();
    st.addEventListener("click", (e) => { e.stopPropagation(); soundOn = !soundOn; setSnd(); try { localStorage.setItem(STORE_KEY + "-sound", soundOn ? "on" : "off"); } catch (er) {} if (soundOn) sfx.good(); });
    const m = document.getElementById("modal");
    m.querySelector(".modal-close").addEventListener("click", closeModal);
    m.addEventListener("click", (e) => { if (e.target === m) closeModal(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
    // Akku schonen: Animationen außerhalb des Bildschirms anhalten
    if ("IntersectionObserver" in window) { const io = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle("offscreen", !e.isIntersecting)), { rootMargin: "80px" }); ["hero", "calendar", "calendar-bonus", "today"].forEach((id) => { const n = document.getElementById(id); if (n) io.observe(n); }); }
    let rt; addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(buildLights, 300); });
    setInterval(() => { updateCountdown(); Object.keys(doors).forEach((d) => { if (!currentDay) refreshDoor(+d); }); }, 60000);
  }

  return {
    start, config: CONFIG, get: (d) => puzzles[d],
    register: (day, def) => (puzzles[day] = def),
    isSolved: (d) => !!state.solved[d],
    markSolved: (d) => { state.solved[d] = true; save(); },
    closeModal, refreshDoor, isUnlocked, preview: PREVIEW, bonusVisible,
    h: { el, shuffle, seeded, pick, sleep, norm, sfx, burst, burstAt, confetti, rain, toast, notify, busy, shakeEl, textAnswer },
  };
})();
