/* ============================================================
   Munkelvogel-Szenen bis zum 28.11.
   - jeden Tag (14.–27.11.) eine Morgen- und eine Abendszene
   - Mama kann in jeder Szene mitmachen (Antippen)
   - Sammelstücke bleiben am Schloss
   - Szenen-Album zum Nochmal-Ansehen
   - Himmel passend zur Uhrzeit
   Koordinaten der Szenen: Schloss-SVG 200 × 240
   (Schlosskörper x 22–178, Oberkante y 104, Schlüsselloch ~ 100/150)
   ============================================================ */
const MunkelShow = (() => {
  const KEY = "mama-munkel-" + (typeof CONFIG !== "undefined" ? CONFIG.year : "2026");
  let st = { seen: {}, items: [], hat: null };
  try { st = Object.assign(st, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} };
  const H = () => App.h;
  const tone = (...a) => { try { H().sfx.tone(...a); } catch (e) {} };
  const HOME = [146, 104];

  /* ---------- Zeit: welcher Tag, morgens oder abends ---------- */
  const isEvening = (d = new Date()) => d.getHours() >= 17 || d.getHours() < 6;
  function currentSlot(d = new Date()) {
    let day = d.getMonth() === 10 ? d.getDate() : d.getMonth() < 10 ? 14 : 27;
    if (d.getMonth() === 10 && d.getDate() >= 28) day = 27;
    day = Math.max(14, Math.min(27, day));
    return day + (isEvening(d) ? "e" : "m");
  }
  const slotOrder = (id) => (parseInt(id) - 14) * 2 + (id.endsWith("e") ? 1 : 0);
  const free = () => !!(window.TEST || (typeof App !== "undefined" && App.preview));

  /* ---------- kleine Bilder ---------- */
  const S = (vb, body) => `<svg viewBox="${vb}" aria-hidden="true">${body}</svg>`;
  const ART = {
    letter: S("0 0 60 42", `<rect x="2" y="2" width="56" height="38" rx="4" fill="#fffaf0" stroke="#d9c7a3" stroke-width="2"/><path d="M3 4 L30 24 L57 4" fill="none" stroke="#d9c7a3" stroke-width="2"/><circle cx="30" cy="24" r="7" fill="#8e2d3b"/><path d="M30 28 c-3 -2 -5 -4 -5 -6 a2.5 2.5 0 0 1 5 -1 a2.5 2.5 0 0 1 5 1 c0 2 -2 4 -5 6z" fill="#f3dc93"/><text x="30" y="37" text-anchor="middle" font-family="Caveat, cursive" font-size="7" fill="#6f2230">Für Ute</text>`),
    twig: S("0 0 60 40", `<path d="M2 30 Q24 22 58 8" stroke="#6b4a35" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M20 25 q-4 -10 6 -14 q2 8 -6 14z M38 17 q2 -10 12 -8 q-4 8 -12 8z" fill="#4f9e5c"/>${[[16, 30], [22, 33], [30, 26], [44, 20], [50, 24]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="#d93a4a"/><circle cx="${x - 1.3}" cy="${y - 1.3}" r="1.2" fill="#fff" opacity=".7"/>`).join("")}`),
    berry: S("0 0 20 20", `<circle cx="10" cy="11" r="7.5" fill="#d93a4a"/><circle cx="7.5" cy="8.5" r="2.2" fill="#fff" opacity=".7"/><path d="M10 4 q2 -3 5 -2" stroke="#4f9e5c" stroke-width="1.6" fill="none"/>`),
    pin: `<path d="M-2 0 L26 -2 L26 2 L-2 4Z" fill="#c9a04a" stroke="#8f6a24" stroke-width=".8"/><circle cx="-3" cy="2" r="2.5" fill="#e8c46b"/>`,
    bubble: S("0 0 40 40", `<defs><radialGradient id="bbG" cx=".35" cy=".3" r=".7"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset=".45" stop-color="#c8f0ff" stop-opacity=".25"/><stop offset=".8" stop-color="#ffb3e6" stop-opacity=".35"/><stop offset="1" stop-color="#b3d4ff" stop-opacity=".6"/></radialGradient></defs><circle cx="20" cy="20" r="18" fill="url(#bbG)" stroke="#fff" stroke-opacity=".7"/><path d="M10 14 a11 11 0 0 1 8 -6" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>`),
    mirror: S("0 0 40 60", `<ellipse cx="20" cy="22" rx="16" ry="20" fill="#c9a04a"/><ellipse cx="20" cy="22" rx="12.5" ry="16.5" fill="#dff3fb"/><path d="M12 14 q4 -6 10 -6" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round"/><rect x="17" y="40" width="6" height="18" rx="3" fill="#8f6a24"/>`),
    snowman: S("0 0 40 56", `<circle cx="20" cy="40" r="14" fill="#fff" stroke="#dbe8f2" stroke-width="1.5"/><circle cx="20" cy="18" r="10" fill="#fff" stroke="#dbe8f2" stroke-width="1.5"/><circle cx="16.5" cy="16" r="1.4" fill="#333"/><circle cx="23.5" cy="16" r="1.4" fill="#333"/><circle cx="20" cy="21" r="2.4" fill="#d93a4a" class="sm-nose"/><circle cx="20" cy="36" r="1.4" fill="#333"/><circle cx="20" cy="42" r="1.4" fill="#333"/><path d="M8 27 q12 6 24 0" stroke="#8e2d3b" stroke-width="3.4" fill="none" stroke-linecap="round"/>`),
    worm: S("0 0 30 60", `<path d="M15 60 C15 46 8 40 12 30 C16 20 22 18 18 8" stroke="#f0a0a8" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M15 54 h1 M12 44 h1 M14 34 h1 M18 24 h1" stroke="#d9808a" stroke-width="9" stroke-linecap="round" opacity=".35"/><circle cx="16" cy="7" r="1.3" fill="#2b1a10"/><circle cx="20.5" cy="8" r="1.3" fill="#2b1a10"/><path d="M16 11 q2 2 4 0" stroke="#2b1a10" stroke-width="1" fill="none"/>`),
    lantern: S("0 0 30 50", `<path d="M15 0 v6" stroke="#3f3f46" stroke-width="2"/><path d="M8 8 h14 l-2 -3 h-10z" fill="#3f3f46"/><rect x="7" y="8" width="16" height="26" rx="3" fill="#ffe7a3" stroke="#3f3f46" stroke-width="2.4"/><path d="M15 16 q-3 5 0 10 q3 -5 0 -10z" fill="#f39c32"/><rect x="6" y="33" width="18" height="4" rx="1.5" fill="#3f3f46"/>`),
    owl: S("0 0 60 64", `<ellipse cx="30" cy="40" rx="20" ry="22" fill="#9c7a5b"/><ellipse cx="30" cy="46" rx="13" ry="14" fill="#e9d8bd"/><path d="M14 22 l-4 -12 l12 8z M46 22 l4 -12 l-12 8z" fill="#7d5f45"/><circle cx="22" cy="28" r="8" fill="#fff"/><circle cx="38" cy="28" r="8" fill="#fff"/><circle class="ow-p" cx="23" cy="28" r="4.5" fill="#2b1a10"/><circle class="ow-p" cx="37" cy="28" r="4.5" fill="#2b1a10"/><circle cx="24.5" cy="26.5" r="1.4" fill="#fff"/><circle cx="38.5" cy="26.5" r="1.4" fill="#fff"/><path d="M27 34 l3 5 l3 -5z" fill="#e5a13c"/><path d="M22 50 l2 2 l2 -2 M30 52 l2 2 l2 -2 M36 49 l2 2 l2 -2" stroke="#b39673" stroke-width="1.2" fill="none"/>`),
    candle: S("0 0 20 46", `<ellipse class="cd-glow" cx="10" cy="12" rx="10" ry="12" fill="#ffd27a" opacity=".45"/><path class="cd-flame" d="M10 4 q-4 7 0 12 q4 -5 0 -12z" fill="#f39c32"/><path d="M10 9 q-1.6 3 0 6 q1.6 -3 0 -6z" fill="#fff3c4"/><rect x="5" y="17" width="10" height="24" rx="2" fill="#fffaf0" stroke="#e6d6b4"/><path d="M5 21 q5 3 10 0" stroke="#e6d6b4" fill="none"/><ellipse cx="10" cy="42" rx="8" ry="3" fill="#c9a04a"/>`),
    moon: S("0 0 80 80", `<path d="M58 10 A34 34 0 1 0 70 58 A28 28 0 1 1 58 10Z" fill="#fff3c4" stroke="#f3dc93" stroke-width="2"/>`),
    sheep: S("0 0 50 40", `<g fill="#fffaf0" stroke="#e6dccb" stroke-width="1.2">${[[14, 16], [22, 12], [30, 14], [36, 20], [28, 24], [18, 24], [12, 20]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7"/>`).join("")}</g><ellipse cx="40" cy="16" rx="6" ry="7" fill="#3a3a40"/><circle cx="42" cy="14" r="1.2" fill="#fff"/><path d="M16 28 v8 M22 28 v8 M30 28 v8 M34 26 v8" stroke="#3a3a40" stroke-width="2.6" stroke-linecap="round"/>`),
    cloth: S("0 0 30 24", `<path d="M2 6 q6 -6 14 -2 q8 4 12 -2 l-2 16 q-6 6 -12 2 q-6 -4 -12 2z" fill="#e8a0ab"/><path d="M6 10 q8 4 18 0" stroke="#fff" stroke-opacity=".6" fill="none"/>`),
    needles: `<path d="M-12 -2 L14 10 M-10 8 L16 -4" stroke="#c9a04a" stroke-width="2.2" stroke-linecap="round"/><circle cx="-12" cy="-2" r="2" fill="#8e2d3b"/><circle cx="-10" cy="8" r="2" fill="#8e2d3b"/>`,
    key: `<g transform="rotate(-20)"><circle cx="-2" cy="0" r="6" fill="none" stroke="#c9a04a" stroke-width="3"/><path d="M4 0 h22 M18 0 v5 M23 0 v4" stroke="#c9a04a" stroke-width="3" stroke-linecap="round"/></g>`,
    letterBeak: `<g transform="translate(-14 -4) scale(.5)"><rect x="2" y="2" width="56" height="38" rx="4" fill="#fffaf0" stroke="#d9c7a3" stroke-width="2"/><path d="M3 4 L30 24 L57 4" fill="none" stroke="#d9c7a3" stroke-width="2"/><circle cx="30" cy="24" r="7" fill="#8e2d3b"/></g>`,
    twigBeak: `<g transform="translate(-6 -6) scale(.55)"><path d="M2 30 Q24 22 58 8" stroke="#6b4a35" stroke-width="3" fill="none"/><circle cx="16" cy="30" r="4" fill="#d93a4a"/><circle cx="30" cy="26" r="4" fill="#d93a4a"/><circle cx="44" cy="20" r="4" fill="#d93a4a"/><path d="M38 17 q2 -10 12 -8 q-4 8 -12 8z" fill="#4f9e5c"/></g>`,
    bulbBeak: `<path d="M-30 -2 Q-10 10 10 0 Q26 -8 40 2" stroke="#3f6b4f" stroke-width="1.6" fill="none"/>${[-24, -10, 6, 22, 34].map((x, i) => `<circle cx="${x}" cy="${[2, 5, 1, -3, 1][i]}" r="2.8" fill="${["#ff5a7a", "#ffcf3f", "#4fd18b", "#58b6ff", "#c77dff"][i]}"/>`).join("")}`,
  };
  const HATS = {
    zylinder: `<rect x="56" y="-6" width="28" height="22" rx="2" fill="#2b241f"/><rect x="50" y="14" width="40" height="5" rx="2.5" fill="#2b241f"/><rect x="56" y="8" width="28" height="5" fill="#8e2d3b"/>`,
    weihnachten: `<path d="M48 18 Q62 -12 90 2 Q78 2 86 16Z" fill="#c9302c"/><rect x="46" y="14" width="44" height="7" rx="3.5" fill="#fff"/><circle cx="91" cy="3" r="5" fill="#fff"/>`,
    krone: `<path d="M52 18 L54 2 L62 10 L70 -2 L78 10 L86 2 L88 18Z" fill="#f2c84b" stroke="#c9961f" stroke-width="1.2"/><circle cx="62" cy="13" r="2" fill="#d93a4a"/><circle cx="70" cy="12" r="2" fill="#58b6ff"/><circle cx="78" cy="13" r="2" fill="#4fd18b"/>`,
    bommel: `<path d="M48 19 Q50 -2 70 -2 Q90 -2 92 19Z" fill="#8e2d3b"/><path d="M54 6 h32 M51 12 h38" stroke="#b5485a" stroke-width="2.4"/><rect x="46" y="16" width="48" height="7" rx="3.5" fill="#f3e3b5"/><circle cx="70" cy="-5" r="7" fill="#f3e3b5"/>`,
  };
  const HAT_NAMES = { zylinder: "Zylinder", weihnachten: "Weihnachtsmütze", krone: "Krone", bommel: "Bommelmütze" };

  /* ---------- Bühne ---------- */
  let lock, pad, perch, bird, stage = null;
  const pct = (x, y) => [(x / 200) * 100, (y / 240) * 100];
  function place(el, x, y) { const [l, t] = pct(x, y); el.style.left = l + "%"; el.style.top = t + "%"; }

  function makeCtx() {
    const token = { dead: false };
    const made = [];
    let cur = HOME.slice();
    const check = () => { if (token.dead) throw new Error("abgebrochen"); };
    const wait = (ms) => new Promise((res, rej) => setTimeout(() => (token.dead ? rej(new Error("abgebrochen")) : res()), ms));
    const say = (t, ms = 3000) => { check(); bird.say(t, ms); };
    const pose = (cls, on = true) => bird.classList.toggle(cls, on);
    const prop = (html, x, y, w, o = {}) => {
      const d = document.createElement("div");
      d.className = "mk-prop" + (o.cls ? " " + o.cls : "");
      d.innerHTML = html;
      place(d, x, y);
      d.style.width = (w / 200) * 100 + "%";
      if (o.z) d.style.zIndex = o.z;
      if (o.anchor === "center") d.style.transform = "translate(-50%, -50%)";
      if (o.anchor === "top") d.style.transform = "translate(-50%, 0)";
      if (o.onTap) { d.classList.add("tappable"); d.addEventListener("click", (e) => { e.stopPropagation(); o.onTap(d, e); }); }
      (o.parent || pad).append(d);
      if (!o.keep) made.push(d);
      return d;
    };
    const sky = (html, xPct, yPct, wPx, o = {}) => {
      const d = document.createElement("div");
      d.className = "mk-sky" + (o.cls ? " " + o.cls : "");
      d.innerHTML = html;
      d.style.left = xPct + "%"; d.style.top = yPct + "%"; d.style.width = wPx + "px";
      if (o.onTap) { d.classList.add("tappable"); d.addEventListener("click", (e) => { e.stopPropagation(); o.onTap(d, e); }); }
      lock.append(d); made.push(d);
      return d;
    };
    const anim = (el, frames, ms, opt = {}) => el.animate(frames, { duration: ms, easing: "ease-in-out", fill: "forwards", ...opt });
    // Vogel bewegen (Sitzpunkt in Schloss-Koordinaten), optional im Bogen und fliegend
    const moveTo = async (x, y, ms, o = {}) => {
      check();
      const fly = o.fly !== false, arc = o.arc ?? 30, from = cur.slice();
      if (fly) pose("mk-fly");
      const frames = [];
      for (let i = 0; i <= 10; i++) { const t = i / 10, e = t * t * (3 - 2 * t); const px = from[0] + (x - from[0]) * e, py = from[1] + (y - from[1]) * e - Math.sin(Math.PI * t) * arc; const [l, tp] = pct(px, py); frames.push({ left: l + "%", top: tp + "%" }); }
      const a = perch.animate(frames, { duration: ms, easing: "linear", fill: "forwards" });
      await new Promise((r) => (a.onfinish = r));
      place(perch, x, y); a.cancel(); cur = [x, y];
      if (fly && !o.keepFlying) pose("mk-fly", false);
      check();
    };
    const home = (ms = 1100) => moveTo(HOME[0], HOME[1], ms, { arc: 26 });
    const waitTap = (el, ms) => new Promise((res) => {
      let done = false; const fin = (v) => { if (!done) { done = true; res(v); } };
      const h = (e) => { e.stopPropagation(); el.removeEventListener("click", h); fin(true); };
      el.addEventListener("click", h); el.classList.add("tappable");
      setTimeout(() => { el.removeEventListener("click", h); fin(false); }, ms);
    });
    const hint = (t, ms = 5000) => { const h = document.createElement("div"); h.className = "mk-hint"; h.textContent = t; lock.append(h); made.push(h); setTimeout(() => h.remove(), ms); };
    const burstAt = (el, sym, n = 8, spread = 50) => { try { H().burstAt(el, sym, n, spread); } catch (e) {} };
    const burstPt = (x, y, sym, n = 8, spread = 50) => { const r = pad.getBoundingClientRect(); try { H().burst(r.left + (x / 200) * r.width, r.top + (y / 240) * r.height, sym, n, spread); } catch (e) {} };
    const cleanup = () => { token.dead = true; made.forEach((d) => d.remove()); bird.carry(""); ["mk-fly", "mk-sleep", "mk-wow", "mk-open", "mk-stretch", "mk-sad", "mk-sing"].forEach((c) => bird.classList.remove(c)); perch.getAnimations().forEach((a) => a.cancel()); perch.style.transform = ""; place(perch, HOME[0], HOME[1]); bird.onSceneTap = null; };
    return { token, wait, say, pose, prop, sky, anim, moveTo, home, waitTap, hint, burstAt, burstPt, cleanup, made, get cur() { return cur; } };
  }

  /* ---------- Sammelstücke am Schloss ---------- */
  function addItem(name) { if (!st.items.includes(name)) { st.items.push(name); save(); renderItems(); } }
  function renderItems() {
    if (!pad) return;
    pad.querySelectorAll(".mk-item").forEach((d) => d.remove());
    const put = (html, x, y, w, extra = "", title = "") => { const d = document.createElement("div"); d.className = "mk-prop mk-item" + extra; d.innerHTML = html; place(d, x, y); d.style.width = (w / 200) * 100 + "%"; if (title) d.title = title; d.addEventListener("click", (e) => { e.stopPropagation(); d.classList.remove("wiggle"); void d.offsetWidth; d.classList.add("wiggle"); tone(900 + Math.random() * 300, 0.08, "sine", 0.06); }); pad.append(d); return d; };
    if (st.items.includes("brief")) put(ART.letter, 40, 236, 36, " lean", "Brief für Ute – erst am 28. öffnen!");
    if (st.items.includes("schneemann")) put(ART.snowman, 74, 106, 22, "", "Mini-Schneemann");
    if (st.items.includes("kerze")) put(ART.candle, 120, 106, 12, " lit candle", "Adventskerze");
    if (st.items.includes("laterne")) put(ART.lantern, 34, 106, 14, " lit lantern-item", "Laterne");
    if (st.items.includes("lichter")) {
      const d = document.createElement("div"); d.className = "mk-prop mk-item mk-lights"; d.style.left = "0"; d.style.top = "0"; d.style.width = "100%"; d.style.height = "100%"; d.style.transform = "none";
      const pts = []; for (let i = 0; i <= 12; i++) { const a = Math.PI - (i / 12) * Math.PI; pts.push([100 + Math.cos(a) * 48, 74 - Math.sin(a) * 48]); }
      [[52, 108], [52, 92]].reverse().forEach((p) => pts.unshift(p)); [[148, 92], [148, 108]].forEach((p) => pts.push(p));
      d.innerHTML = `<svg viewBox="0 0 200 240">${pts.map(([x, y], i) => `<circle class="bulb" style="animation-delay:-${(i * 0.23).toFixed(2)}s" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.3" fill="${["#ff5a7a", "#ffcf3f", "#4fd18b", "#58b6ff", "#c77dff"][i % 5]}"/>`).join("")}</svg>`;
      pad.append(d);
    }
    if (st.hat && bird) bird.setHat(HATS[st.hat]);
  }

  /* ---------- Himmel nach Uhrzeit ---------- */
  function sky() {
    if (!lock) return;
    const h = new Date().getHours();
    const mode = h >= 6 && h < 11 ? "morning" : h >= 11 && h < 16 ? "day" : h >= 16 && h < 19 ? "evening" : "night";
    lock.dataset.sky = mode;
    if (!lock.querySelector(".sky-orb")) lock.prepend(Object.assign(document.createElement("div"), { className: "sky-orb" }), Object.assign(document.createElement("div"), { className: "sky-stars" }));
  }

  /* ---------- Die Szenen ---------- */
  const SCENES = {
    /* ---------------- 14.11. ---------------- */
    "14m": { title: "Aufwachen", async run(c) {
      c.pose("mk-sleep"); const z = c.prop(`<span>z</span><span>Z</span><span>z</span>`, 166, 70, 20, { cls: "mk-zzz" });
      c.hint("Tipp den Munkelvogel an, um ihn zu wecken!");
      const woke = await c.waitTap(bird, 7000);
      z.remove(); c.pose("mk-sleep", false); c.pose("mk-wow"); tone(700, 0.2, "triangle", 0.1, 1100);
      await c.wait(500); c.pose("mk-wow", false); c.pose("mk-stretch"); c.pose("mk-open"); tone(300, 0.6, "sine", 0.06, 200);
      c.say(woke ? "Uaaah … guten Morgen, Ute!" : "Uaaah … schon so spät?", 2600);
      await c.wait(1600); c.pose("mk-open", false); c.pose("mk-stretch", false);
      bird.classList.add("mk-fluff"); c.burstAt(bird, ["·"], 10, 40); await c.wait(900); bird.classList.remove("mk-fluff");
      bird.act("mk-flutter", 900); c.say("So. Jetzt bin ich wach. Fast.", 2600); await c.wait(2400);
    } },
    "14e": { title: "Einnicken", async run(c) {
      c.say("Ich bin gar nicht müde …", 2200); await c.wait(2300);
      for (let i = 0; i < 2; i++) {
        c.pose("mk-sleep"); await c.wait(1300); c.pose("mk-sleep", false); c.pose("mk-wow"); tone(900, 0.08, "square", 0.04); await c.wait(500); c.pose("mk-wow", false);
      }
      c.hint("Pssst … tipp ihn an, wenn du ihn noch mal wecken willst.");
      c.pose("mk-sleep"); const z = c.prop(`<span>z</span><span>Z</span><span>z</span>`, 166, 70, 20, { cls: "mk-zzz" });
      if (await c.waitTap(bird, 5000)) { z.remove(); c.pose("mk-sleep", false); c.pose("mk-wow"); c.say("Hä? Ich hab nicht geschlafen!", 2400); await c.wait(2300); c.pose("mk-wow", false); c.pose("mk-sleep"); c.prop(`<span>z</span><span>Z</span><span>z</span>`, 166, 70, 20, { cls: "mk-zzz" }); }
      await c.wait(3500);
    }, end: (c) => c.pose("mk-sleep", false) },

    /* ---------------- 15.11. ---------------- */
    "15m": { title: "Postflug", async run(c) {
      c.say("Moment, ich hab Post für dich!", 2000); await c.wait(1600);
      await c.moveTo(260, 20, 1300, { arc: 50 }); await c.wait(900);
      bird.carry(ART.letterBeak); await c.moveTo(150, 60, 1400, { arc: -20, keepFlying: true }); await c.moveTo(108, 168, 900, { arc: 10, keepFlying: true });
      c.say("Passt der … ins Schlüsselloch?", 2200);
      for (let i = 0; i < 3; i++) { await c.moveTo(102, 166, 220, { arc: 0, keepFlying: true }); await c.moveTo(110, 168, 220, { arc: 0, keepFlying: true }); }
      c.say("Nö. Ich leg ihn ordentlich hin.", 2200);
      await c.moveTo(48, 214, 900, { arc: 20 }); bird.carry(""); addItem("brief");
      c.burstPt(40, 220, ["✨"], 8, 30); tone(880, 0.1, "sine", 0.08);
      c.hint("Tipp den Brief an!");
      const b = pad.querySelector(".mk-item.lean");
      const tapped = b ? await c.waitTap(b, 5000) : false;
      c.say(tapped ? "Nicht aufmachen! Erst am 28.!" : "Für Ute. Erst am 28. öffnen!", 2600);
      await c.wait(1400); await c.home();
    } },
    "15e": { title: "Sterne anknipsen", async run(c) {
      c.say("Es ist so dunkel … ich mach mal Licht.", 2400); await c.wait(1800);
      const spots = [[18, 14], [32, 9], [70, 12], [84, 20], [58, 6], [12, 26], [90, 8]];
      for (const [x, y] of spots) { bird.act("mk-flutter", 500); await c.wait(380); c.sky(`<div class="mk-star"></div>`, x, y, 14, { cls: "pop" }); tone(1200 + Math.random() * 900, 0.15, "sine", 0.06); }
      c.hint("Tipp in den Himmel – mach selbst Sterne an!");
      let mine = 0;
      const tapSky = (e) => { if (e.target.closest(".lock-pad, .lock-clock, .mk-album-btn, .mk-album")) return; mine++; const x = (e.clientX / innerWidth) * 100, y = (e.clientY / innerHeight) * 100; c.sky(`<div class="mk-star"></div>`, x, y, 14, { cls: "pop" }); tone(1400 + Math.random() * 900, 0.12, "sine", 0.06); };
      lock.addEventListener("click", tapSky); await c.wait(6000); lock.removeEventListener("click", tapSky);
      c.sky(ART.moon, 80, 4, 60, { cls: "pop slow" }); tone(660, 0.6, "sine", 0.06);
      c.say(mine ? `${mine} Sterne von dir! Und dazu der Mond.` : "Und zum Schluss: der Mond.", 2800); await c.wait(3200);
    } },

    /* ---------------- 16.11. ---------------- */
    "16m": { title: "Frühstück", async run(c) {
      const t = c.prop(ART.twig, 120, 106, 44);
      c.say("Frühstück! Beeren!", 1800); await c.wait(1200);
      for (let i = 0; i < 3; i++) { bird.act("mk-tilt", 600); c.pose("mk-open"); tone(1100, 0.05, "square", 0.04); await c.wait(300); c.pose("mk-open", false); await c.wait(300); }
      const b = c.prop(ART.berry, 128, 104, 9);
      await c.anim(b, [{ left: "64%", top: "43%" }, { left: "80%", top: "60%" }, { left: "86%", top: "100%" }], 1300, { easing: "ease-in" }).finished;
      c.pose("mk-sad"); c.say("Oh nein … meine Lieblingsbeere!", 2400);
      c.hint("Wirf ihm die Beere zurück – tipp sie an!");
      const back = await c.waitTap(b, 6000);
      if (back) {
        c.pose("mk-sad", false); await c.anim(b, [{ left: "86%", top: "100%" }, { left: "78%", top: "28%" }, { left: "73%", top: "36%" }], 900).finished; b.remove();
        c.pose("mk-open"); tone(1300, 0.1, "sine", 0.08, 1700); await c.wait(300); c.pose("mk-open", false); bird.act("mk-hop", 700); c.say("Danke, Ute! Lecker!", 2400); c.burstAt(bird, ["💖"], 6, 40);
      } else { c.pose("mk-sad", false); c.say("Na gut …", 1600); }
      await c.wait(1800);
      for (let i = 0; i < 3; i++) { bird.act("mk-hop", 500); c.say("Hicks!", 600); tone(1500, 0.06, "sine", 0.08, 2200); await c.wait(900); }
      t.remove(); await c.wait(400);
    } },
    "16e": { title: "Gute-Nacht-Lied", async run(c) {
      c.say("Ein Lied für dich …", 2000); await c.wait(1500); c.pose("mk-sing");
      const melody = [523, 587, 659, 523, 659, 698, 784, 659, 587, 523];
      c.hint("Tipp die Noten an – dann klingen sie noch mal!");
      for (const f of melody) {
        tone(f, 0.45, "triangle", 0.07);
        const n = c.prop(`<span>${Math.random() < 0.5 ? "♪" : "♫"}</span>`, 160 + Math.random() * 20, 70, 14, { cls: "mk-note" , onTap: (d) => { tone(f * 2, 0.3, "sine", 0.08); d.classList.add("hit"); } });
        c.anim(n, [{ transform: "translate(-50%,-100%) translate(0,0)", opacity: 0 }, { opacity: 1, offset: 0.15 }, { transform: `translate(-50%,-100%) translate(${(Math.random() - 0.3) * 60}px,-120px)`, opacity: 0 }], 3600, { easing: "ease-out" });
        await c.wait(520);
      }
      await c.wait(1500); c.pose("mk-sing", false); c.say("Schlaf schön, Ute.", 2400); await c.wait(2400);
    } },

    /* ---------------- 17.11. ---------------- */
    "17m": { title: "Durchs Schlüsselloch", async run(c) {
      c.say("Was ist da wohl drin …?", 2000); await c.wait(1500);
      await c.moveTo(100, 104, 900, { arc: 20 });
      c.anim(perch, [{ transform: "translate(-50%,-79%) rotate(0)" }, { transform: "translate(-50%,-79%) rotate(180deg)" }], 700);
      await c.wait(900);
      const eyes = c.prop(`<svg viewBox="0 0 30 14"><ellipse cx="8" cy="7" rx="5" ry="5.5" fill="#fff"/><ellipse cx="22" cy="7" rx="5" ry="5.5" fill="#fff"/><circle cx="9" cy="8" r="3" fill="#2b1a10"/><circle cx="23" cy="8" r="3" fill="#2b1a10"/></svg>`, 100, 154, 16, { cls: "mk-peek", anchor: "center" });
      await c.wait(1200); c.pose("mk-wow"); tone(1600, 0.15, "square", 0.05, 600);
      c.anim(perch, [{ transform: "translate(-50%,-79%) rotate(180deg)" }, { transform: "translate(-50%,-90%) rotate(160deg)" }, { transform: "translate(-50%,-79%) rotate(180deg)" }], 400);
      c.say("AH! Da guckt jemand zurück!", 2400); await c.wait(1600);
      c.hint("Tipp aufs Schlüsselloch!");
      const peeked = await c.waitTap(eyes, 5000);
      if (peeked) { eyes.classList.add("blink"); tone(500, 0.3, "triangle", 0.08, 700); c.say("Das war ein Kapibara! Mit einer Orange auf dem Kopf!", 3000); await c.wait(2400); }
      eyes.remove(); c.pose("mk-wow", false);
      c.anim(perch, [{ transform: "translate(-50%,-79%) rotate(180deg)" }, { transform: "translate(-50%,-79%) rotate(360deg)" }], 600); await c.wait(700); perch.getAnimations().forEach((a) => a.cancel());
      await c.home(); c.say("Psst. Ich hab nichts gesehen.", 2400); await c.wait(2400);
    } },
    "17e": { title: "Schneeflocken fangen", async run(c) {
      c.say("Es schneit!", 1600); let caught = 0;
      c.hint("Tipp die Schneeflocken an – er fängt sie!");
      const flake = () => {
        const x = 10 + Math.random() * 80;
        const f = c.sky(`<div class="mk-flake">❄</div>`, x, -4, 26, { onTap: async (d) => { d.remove(); caught++; c.pose("mk-open"); tone(1500, 0.08, "sine", 0.08, 2000); bird.act("mk-hop", 600); await c.wait(300).catch(() => {}); c.pose("mk-open", false); } });
        c.anim(f, [{ transform: "translate(0,0) rotate(0)" }, { transform: `translate(${(Math.random() - 0.5) * 80}px, ${innerHeight * 0.9}px) rotate(360deg)` }], 6500 + Math.random() * 2000, { easing: "linear" }).onfinish = () => f.remove();
      };
      for (let i = 0; i < 14; i++) { flake(); await c.wait(450); }
      await c.wait(1200);
      const big = c.prop(`<div class="mk-flake big">❄</div>`, 152, 30, 14);
      await c.anim(big, [{ top: "5%" }, { top: "38%" }], 1500, { easing: "ease-in" }).finished;
      c.pose("mk-wow"); c.say("Eine … auf … meinem … Schnabel …", 2200); await c.wait(1800);
      big.remove(); c.pose("mk-wow", false); bird.act("mk-hop", 600); tone(300, 0.15, "sawtooth", 0.06, 120); c.say("HATSCHI!", 1400); c.burstPt(150, 80, ["❄️", "·"], 14, 60);
      await c.wait(1400); c.say(caught ? `${caught} Flocken gefangen! Danke!` : "Gesundheit, sagt man da!", 2400); await c.wait(2400);
    } },

    /* ---------------- 18.11. ---------------- */
    "18m": { title: "Morgensport", async run(c) {
      c.say("Morgensport! Machst du mit?", 2200); await c.wait(1800);
      c.hint("Feuere ihn an – tipp ihn an!");
      let cheers = 0; bird.onSceneTap = () => { cheers++; c.burstAt(bird, ["⭐", "✨"], 6, 40); tone(1000 + cheers * 60, 0.08, "triangle", 0.08); };
      for (let i = 1; i <= 5; i++) { bird.act("mk-squat", 700); c.say(String(i), 600); tone(400 + i * 60, 0.08, "triangle", 0.06); await c.wait(800); }
      for (let i = 0; i < 4; i++) { c.pose("mk-stretch", i % 2 === 0); bird.act("mk-hop", 500); await c.wait(550); }
      c.pose("mk-stretch", false);
      const cl = c.prop(`<div class="mk-sweat">💧</div>`, 160, 72, 8); await c.wait(500); cl.remove();
      bird.act("mk-tilt", 1400); c.say(cheers ? `Mit ${cheers}× Anfeuern ging's viel leichter!` : "Puh! Geschafft.", 2600); await c.wait(2600);
    } },
    "18e": { title: "Schal stricken", async run(c) {
      bird.carry(ART.needles); c.say("Ich stricke mir einen längeren Schal.", 2400); await c.wait(1500);
      const scarf = c.prop(`<div class="mk-knit"></div>`, 154, 112, 9, { anchor: "top" });
      c.hint("Tipp ihn an – dann strickt er schneller!");
      let len = 4, speed = 1; bird.onSceneTap = () => { speed = Math.min(4, speed + 1); tone(900, 0.05, "square", 0.04); };
      for (let i = 0; i < 26; i++) { len += 2.2 * speed; scarf.firstChild.style.height = len + "px"; tone(1800, 0.02, "square", 0.02); bird.act("mk-knit", 300); await c.wait(260); if (len > 110) break; }
      c.say("Oh … der ist ein bisschen lang geworden.", 2400); await c.wait(1600);
      scarf.remove(); bird.carry(""); c.pose("mk-wrapped"); c.say("Kuschelig!", 1800); await c.wait(2600); c.pose("mk-wrapped", false);
    } },

    /* ---------------- 19.11. ---------------- */
    "19m": { title: "Schlüssel knacken", async run(c) {
      c.say("Ich krieg das Schloss schon auf …", 2200); await c.wait(1300);
      await c.moveTo(118, 176, 900, { arc: 20, keepFlying: true }); bird.carry(`<g transform="translate(-8 4) rotate(195)">${ART.pin}</g>`);
      c.hint("Pssst – tipp ihn an, wenn du ihn erwischst!");
      let caught = false; bird.onSceneTap = () => { caught = true; };
      for (let i = 0; i < 4 && !caught; i++) { await c.moveTo(114, 174, 250, { arc: 0, keepFlying: true }); await c.moveTo(118, 177, 250, { arc: 0, keepFlying: true }); tone(2400, 0.03, "square", 0.03); }
      c.burstPt(100, 160, ["✦", "✨"], 10, 30); tone(2000, 0.1, "sawtooth", 0.05, 400); c.pose("mk-wow");
      await c.moveTo(118, 168, 300, { arc: 0 }); bird.carry(""); c.pose("mk-wow", false);
      await c.home(800); bird.act("mk-tilt", 1400);
      c.say(caught ? "Erwischt? Ich? Ich hab nur … poliert!" : "Ich? Gar nichts. Ich sitz hier nur.", 2800); await c.wait(2800);
    } },
    "19e": { title: "Laterne & Glühwürmchen", async run(c) {
      c.say("Ich hab eine Laterne mitgebracht.", 2200); const l = c.prop(ART.lantern, 166, 106, 14, { cls: "lit" }); await c.wait(1600);
      const flies = [];
      for (let i = 0; i < 8; i++) { const f = c.prop(`<div class="mk-firefly"></div>`, 20 + Math.random() * 160, 20 + Math.random() * 180, 6, { cls: "drift", onTap: (d) => { d.classList.add("bright"); tone(1800 + Math.random() * 600, 0.12, "sine", 0.06); c.anim(d, [{ left: d.style.left, top: d.style.top }, { left: "83%", top: "38%" }], 1200); } }); f.style.animationDelay = -Math.random() * 6 + "s"; flies.push(f); await c.wait(250); }
      c.hint("Tipp die Glühwürmchen an – sie fliegen zur Laterne!");
      await c.wait(7000); l.remove(); addItem("laterne");
      c.say("Die Laterne bleibt hier. Für gemütliche Abende.", 2800); await c.wait(2800);
    } },

    /* ---------------- 20.11. ---------------- */
    "20m": { title: "Seifenblasen", async run(c) {
      c.say("Seifenblasen!", 1600); await c.wait(900); c.hint("Lass die Seifenblasen platzen!");
      let popped = 0;
      for (let i = 0; i < 9; i++) {
        c.pose("mk-open"); tone(600 + i * 40, 0.15, "sine", 0.04, 900);
        const b = c.prop(ART.bubble, 158, 88, 12 + Math.random() * 10, { cls: "mk-bubble-prop", onTap: (d) => { popped++; d.classList.add("pop"); tone(1600, 0.05, "square", 0.05); c.burstAt(d, ["·"], 5, 20); setTimeout(() => d.remove(), 250); } });
        c.anim(b, [{ transform: "translate(-50%,-100%) translate(0,0)" }, { transform: `translate(-50%,-100%) translate(${(Math.random() - 0.4) * 160}px, ${-120 - Math.random() * 120}px)` }], 4200 + Math.random() * 1500, { easing: "ease-out" });
        await c.wait(250); c.pose("mk-open", false); await c.wait(350);
      }
      const big = c.prop(ART.bubble, 146, 112, 46, { cls: "mk-bubble-prop" });
      await c.wait(600); c.pose("mk-wow"); c.say("Huch – die trägt mich!", 2000);
      c.anim(big, [{ top: "46.6%" }, { top: "20%" }, { top: "46.6%" }], 2400);
      await c.moveTo(146, 40, 1200, { fly: false, arc: 0 }); await c.moveTo(146, 104, 1200, { fly: false, arc: 0 });
      big.classList.add("pop"); tone(1600, 0.08, "square", 0.06); c.pose("mk-wow", false); await c.wait(300); big.remove();
      c.say(popped ? `${popped} Blasen geplatzt – du bist schnell!` : "Plopp!", 2400); await c.wait(2400);
    } },
    "20e": { title: "Sternschnuppe", async run(c) {
      c.say("Schau mal nach oben …", 2000); await c.wait(1800);
      c.hint("Tipp die Sternschnuppe an – wünsch dir was!");
      let wished = false;
      for (let i = 0; i < 3 && !wished; i++) {
        const s = c.sky(`<div class="mk-shoot"></div>`, 5 + i * 15, 8 + i * 5, 140, { onTap: () => { wished = true; } });
        await c.anim(s, [{ transform: "translate(0,0) rotate(18deg)", opacity: 0 }, { opacity: 1, offset: 0.2 }, { transform: `translate(${innerWidth * 0.55}px, ${innerHeight * 0.18}px) rotate(18deg)`, opacity: 0 }], 2200, { easing: "ease-in" }).finished;
        s.remove();
      }
      c.pose("mk-sleep"); c.say(wished ? "Wir haben uns beide was gewünscht …" : "Ich wünsch mir was. Psst!", 2600);
      for (let i = 0; i < 16; i++) { c.burstPt(140 + Math.random() * 20, 30, ["✦", "✨"], 1, 30); await c.wait(150); }
      await c.wait(1200); c.pose("mk-sleep", false); bird.act("mk-hop", 700); c.say("Es geht bestimmt in Erfüllung!", 2400); await c.wait(2400);
    } },

    /* ---------------- 21.11. ---------------- */
    "21m": { title: "Mützen-Anprobe", async run(c) {
      c.say("Oh! Mützen!", 1600); await c.wait(900);
      const keys = ["zylinder", "weihnachten", "krone", "bommel"]; const icons = [];
      keys.forEach((k, i) => { const p = c.prop(`<svg viewBox="40 -14 60 40">${HATS[k]}</svg>`, 40 + i * 40, -40, 26, { cls: "mk-hatprop" }); c.anim(p, [{ top: "-17%" }, { top: `${((96 - (i % 2) * 8) / 240) * 100}%` }], 900 + i * 200, { easing: "cubic-bezier(.3,1.4,.5,1)" }); icons.push(p); });
      await c.wait(1600);
      const poses = ["Wie ein Zauberer!", "Ho ho ho!", "Majestätisch.", "Kuschelig!"];
      for (let i = 0; i < 4; i++) { bird.setHat(HATS[keys[i]]); bird.act(i % 2 ? "mk-tilt" : "mk-hop", 900); c.say(poses[i], 1300); tone(700 + i * 120, 0.15, "triangle", 0.08); await c.wait(1500); }
      c.hint("Welche soll er behalten? Tipp eine Mütze an!");
      let pick = null; icons.forEach((p, i) => { p.classList.add("tappable"); p.onclick = (e) => { e.stopPropagation(); pick = keys[i]; }; });
      for (let t = 0; t < 70 && !pick; t++) await c.wait(100);
      pick = pick || "bommel"; st.hat = pick; save(); bird.setHat(HATS[pick]); icons.forEach((p) => p.remove());
      c.burstAt(bird, ["✨", "⭐"], 10, 50); tone(1047, 0.2, "triangle", 0.1); bird.act("mk-hop", 700);
      c.say(`Die ${HAT_NAMES[pick]} behalte ich!`, 2600); await c.wait(2600);
    } },
    "21e": { title: "Besuch der Eule", async run(c) {
      const o = c.prop(ART.owl, 280, 20, 34, { cls: "mk-owl" });
      tone(400, 0.3, "sine", 0.08, 350); tone(330, 0.4, "sine", 0.08, 300, 0.35);
      await c.anim(o, [{ left: "140%", top: "8%" }, { left: "70%", top: "20%" }, { left: "50%", top: "44%" }], 1800).finished;
      c.say("Oh, hallo Frau Eule!", 1800); await c.wait(1800);
      const bubbles = ["?", "!", "?!", "…", "!!"];
      for (const b of bubbles) { const q = c.prop(`<span>${b}</span>`, 98 + Math.random() * 40, 60, 12, { cls: "mk-whisper" }); c.anim(q, [{ opacity: 0, transform: "translate(-50%,-100%) scale(.5)" }, { opacity: 1, transform: "translate(-50%,-140%) scale(1)", offset: 0.3 }, { opacity: 0, transform: "translate(-50%,-220%) scale(.9)" }], 1600); bird.act("mk-tilt", 800); tone(1200 + Math.random() * 600, 0.05, "sine", 0.05); await c.wait(700); }
      c.hint("Tipp die Eule an!");
      if (await c.waitTap(o, 4500)) { o.classList.add("hoot"); tone(380, 0.3, "sine", 0.1, 330); tone(330, 0.5, "sine", 0.1, 300, 0.35); c.say("Sie sagt: „Huhu, Ute!“", 2200); await c.wait(2000); }
      c.say("Sie hat gemunkelt … über einen Waschbären!", 2600); await c.wait(1800);
      await c.anim(o, [{ left: "50%", top: "44%" }, { left: "80%", top: "10%" }, { left: "-60%", top: "-10%" }], 1800).finished; await c.wait(600);
    } },

    /* ---------------- 22.11. ---------------- */
    "22m": { title: "Mini-Schneemann", async run(c) {
      c.say("Schnee! Ich bau was!", 1800);
      for (let i = 0; i < 12; i++) { const f = c.sky(`<div class="mk-flake">❄</div>`, Math.random() * 100, -4, 18); c.anim(f, [{ transform: "translateY(0)" }, { transform: `translateY(${innerHeight}px)` }], 5000, { easing: "linear" }).onfinish = () => f.remove(); }
      await c.moveTo(92, 104, 900, { arc: 16 });
      const ball = c.prop(`<div class="mk-snowball"></div>`, 82, 106, 4);
      for (let i = 0; i < 8; i++) { ball.style.width = ((4 + i * 1.6) / 200) * 100 + "%"; bird.act("mk-hop", 400); tone(300 + i * 30, 0.05, "sine", 0.04); await c.wait(350); }
      ball.remove(); const sm = c.prop(ART.snowman, 74, 106, 22, { cls: "grow" });
      c.hint("Tipp den Schneemann an!");
      if (await c.waitTap(sm, 4000)) { sm.classList.add("wiggle"); tone(900, 0.2, "triangle", 0.08); c.say("Er hat „Hallo Ute“ gesagt!", 2200); await c.wait(1600); }
      c.say("Er bleibt hier und passt mit auf.", 2400); sm.remove(); addItem("schneemann"); await c.wait(1200); await c.home();
    } },
    "22e": { title: "Kerze anzünden", async run(c) {
      c.say("Bald ist der erste Advent …", 2200); await c.wait(1800);
      const k = c.prop(ART.candle.replace('class="cd-flame"', 'class="cd-flame" style="opacity:0"').replace('class="cd-glow"', 'class="cd-glow" style="opacity:0"'), 120, 106, 12);
      await c.moveTo(128, 104, 800, { arc: 14 }); c.say("Ganz vorsichtig …", 1600); c.pose("mk-open");
      await c.wait(1200); c.pose("mk-open", false); k.remove(); addItem("kerze"); tone(523, 0.6, "sine", 0.08); tone(784, 0.6, "sine", 0.06, null, 0.1);
      lock.classList.add("candle-glow");
      c.hint("Tipp die Kerze an!");
      const kk = pad.querySelector(".mk-item.candle");
      if (kk && await c.waitTap(kk, 5000)) { kk.classList.add("flare"); tone(1047, 0.3, "sine", 0.08); setTimeout(() => kk.classList.remove("flare"), 1200); c.say("Wie schön sie flackert.", 2000); await c.wait(1600); }
      await c.home(); c.say("Jetzt ist es richtig gemütlich.", 2600); await c.wait(2600);
    } },

    /* ---------------- 23.11. ---------------- */
    "23m": { title: "Wurm-Tauziehen", async run(c) {
      const w = c.prop(ART.worm, 168, 132, 12);
      c.anim(w, [{ clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0 0 0 0)" }], 800);
      c.say("Ein Wurm! Frühstück!", 1800); await c.wait(1000);
      await c.moveTo(166, 104, 400, { arc: 6 });
      c.hint("Hilf ihm ziehen – tipp den Wurm an!");
      let help = 0; w.addEventListener("click", (e) => { e.stopPropagation(); help++; tone(500 + help * 40, 0.06, "triangle", 0.06); }); w.classList.add("tappable");
      for (let i = 0; i < 6; i++) { c.anim(perch, [{ transform: "translate(-50%,-79%) rotate(0)" }, { transform: "translate(-50%,-79%) rotate(-10deg) translateX(-4%)" }, { transform: "translate(-50%,-79%) rotate(0)" }], 500); c.anim(w, [{ transform: "translate(-50%,-100%) scaleY(1)" }, { transform: "translate(-50%,-100%) scaleY(1.15)" }, { transform: "translate(-50%,-100%) scaleY(1)" }], 500); await c.wait(550); }
      c.anim(perch, [{ transform: "translate(-50%,-79%) rotate(0)" }, { transform: "translate(-50%,-79%) rotate(-80deg) translateX(-20%)" }], 400); tone(200, 0.3, "sawtooth", 0.06, 90); c.pose("mk-wow");
      await c.wait(500); c.say("Ups!", 1200);
      c.anim(w, [{ transform: "translate(-50%,-100%) rotate(0)" }, { transform: "translate(-50%,-100%) rotate(14deg)" }, { transform: "translate(-50%,-100%) rotate(-14deg)" }, { transform: "translate(-50%,-100%) rotate(0)" }], 900);
      await c.wait(900); c.anim(w, [{ clipPath: "inset(0 0 0 0)" }, { clipPath: "inset(100% 0 0 0)" }], 600); await c.wait(700);
      perch.getAnimations().forEach((a) => a.cancel()); c.pose("mk-wow", false); bird.classList.add("mk-fluff"); await c.home(600); bird.classList.remove("mk-fluff");
      c.say(help ? "Danke fürs Helfen. Der Wurm war stärker." : "Hmpf. Dann eben Beeren.", 2600); await c.wait(2600);
    } },
    "23e": { title: "Polarlicht", async run(c) {
      const a = c.sky(`<div class="mk-aurora"></div>`, 0, 0, innerWidth, { cls: "full" });
      c.pose("mk-wow"); c.pose("mk-open"); c.say("Ohhh …", 2000); tone(392, 1.2, "sine", 0.05); tone(587, 1.2, "sine", 0.04, null, 0.4);
      c.hint("Tipp in den Himmel – andere Farben!");
      let hue = 0; const tapSky = (e) => { if (e.target.closest(".lock-pad, .lock-clock, .mk-album-btn, .mk-album")) return; hue = (hue + 70) % 360; a.firstChild.style.filter = `hue-rotate(${hue}deg)`; tone(500 + hue, 0.4, "sine", 0.05); };
      lock.addEventListener("click", tapSky);
      await c.wait(4000); c.pose("mk-open", false); c.say("Das ist das Schönste, was ich je gesehen hab.", 2800); await c.wait(5000);
      lock.removeEventListener("click", tapSky); c.pose("mk-wow", false); a.classList.add("fade"); await c.wait(1500);
    } },

    /* ---------------- 24.11. ---------------- */
    "24m": { title: "Federputz-Show", async run(c) {
      c.say("Kurz schick machen …", 1800); await c.wait(1200);
      for (let i = 0; i < 4; i++) { bird.act(i % 2 ? "mk-preenL" : "mk-preenR", 700); tone(2400, 0.03, "sine", 0.03); await c.wait(750); }
      const m = c.prop(ART.mirror, 176, 112, 18);
      c.say("Spieglein, Spieglein …", 1800); await c.wait(1400);
      c.hint("Tipp den Spiegel an!");
      const t = await c.waitTap(m, 4000);
      c.burstAt(m, ["✨", "✦"], t ? 12 : 6, 30); tone(1568, 0.2, "sine", 0.08);
      bird.act("mk-wink", 900); c.say(t ? "… wer ist der Schönste? Ich. Und du, Ute!" : "*zwinker*", 2600); await c.wait(2600);
    } },
    "24e": { title: "Mond-Schaukel", async run(c) {
      const moon = c.prop(ART.moon, 146, -60, 50, { cls: "mk-moonswing" });
      await c.anim(moon, [{ top: "-25%" }, { top: "38%" }], 1600, { easing: "cubic-bezier(.3,1.2,.5,1)" }).finished;
      await c.moveTo(146, 92, 700, { arc: 10 });
      c.hint("Tipp den Mond an – dann schwingt er höher!");
      let amp = 8; moon.classList.add("tappable"); moon.addEventListener("click", (e) => { e.stopPropagation(); amp = Math.min(26, amp + 6); tone(880, 0.2, "sine", 0.06); });
      const box = [moon, perch]; const notes = [784, 659, 698, 587, 659, 523, 587, 494];
      for (let i = 0; i < 8; i++) {
        const deg = (i % 2 ? -1 : 1) * amp;
        box.forEach((el) => el.animate([{ rotate: `${-deg}deg` }, { rotate: `${deg}deg` }], { duration: 900, easing: "ease-in-out", fill: "forwards" }));
        tone(notes[i], 0.5, "triangle", 0.05); await c.wait(900);
      }
      box.forEach((el) => el.getAnimations().forEach((a) => a.cancel()));
      c.say("Gute Nacht, Ute …", 2200); await c.wait(1200); await c.home(700);
      await c.anim(moon, [{ top: "38%" }, { top: "-25%" }], 1400).finished;
    } },

    /* ---------------- 25.11. ---------------- */
    "25m": { title: "Looping-Ausflug", async run(c) {
      c.say("Ich dreh eine Runde!", 1800); await c.wait(1200);
      let extra = false; c.hint("Tipp ihn im Flug an – noch ein Looping!");
      bird.onSceneTap = () => { extra = true; };
      const trail = setInterval(() => { const r = perch.getBoundingClientRect(); try { H().burst(r.left + r.width / 2, r.top + r.height / 2, ["·"], 1, 6); } catch (e) {} }, 90);
      try {
        await c.moveTo(-40, 40, 1300, { arc: 40, keepFlying: true });
        await c.moveTo(240, 20, 1600, { arc: -30, keepFlying: true });
        const loop = async (cx, cy, r) => { for (let i = 0; i <= 12; i++) { const a = (i / 12) * Math.PI * 2; await c.moveTo(cx + Math.sin(a) * r, cy - (1 - Math.cos(a)) * r, 90, { arc: 0, keepFlying: true }); } };
        await loop(150, 70, 50); if (extra) { tone(1200, 0.3, "triangle", 0.08, 1800); await loop(150, 70, 60); }
        c.pose("mk-fly", false);
        await c.moveTo(152, 104, 500, { arc: 4 });
        c.anim(perch, [{ transform: "translate(-50%,-79%)" }, { transform: "translate(-30%,-79%) rotate(8deg)" }, { transform: "translate(-50%,-79%)" }], 700); tone(250, 0.2, "sawtooth", 0.05, 120);
      } finally { clearInterval(trail); }
      await c.wait(700); perch.getAnimations().forEach((a) => a.cancel()); place(perch, HOME[0], HOME[1]);
      c.say(extra ? "Zwei Loopings! Mir ist schwindelig." : "Gelandet! Fast elegant.", 2400); await c.wait(2400);
    } },
    "25e": { title: "Lichterkette", async run(c) {
      c.say("Ich hab eine Lichterkette gefunden!", 2200); bird.carry(ART.bulbBeak); await c.wait(1400);
      const path = [[52, 108], [52, 74], [72, 34], [100, 26], [128, 34], [148, 74], [148, 108]];
      for (const [x, y] of path) await c.moveTo(x, y, 500, { arc: 6, keepFlying: true });
      c.pose("mk-fly", false); bird.carry(""); addItem("lichter");
      const bulbs = [...pad.querySelectorAll(".mk-lights .bulb")];
      bulbs.forEach((b, i) => { b.style.opacity = 0; setTimeout(() => { b.style.opacity = 1; tone(900 + i * 70, 0.06, "sine", 0.05); }, 300 + i * 160); });
      await c.wait(400 + bulbs.length * 160);
      c.hint("Tipp die Lämpchen an – sie wechseln die Farbe!");
      const pal = ["#ff5a7a", "#ffcf3f", "#4fd18b", "#58b6ff", "#c77dff", "#fff3cf"];
      const lights = pad.querySelector(".mk-lights"); lights.style.pointerEvents = "auto";
      const onTap = (e) => { const b = e.target.closest(".bulb"); if (!b) return; e.stopPropagation(); b.setAttribute("fill", pal[(pal.indexOf(b.getAttribute("fill")) + 1) % pal.length]); tone(1200, 0.06, "sine", 0.06); };
      lights.addEventListener("click", onTap);
      await c.home(900); c.say("Jetzt funkelt unser Schloss!", 2400); await c.wait(5200);
      lights.removeEventListener("click", onTap); lights.style.pointerEvents = "";
    } },

    /* ---------------- 26.11. ---------------- */
    "26m": { title: "Schloss polieren", async run(c) {
      c.say("Das Schloss muss glänzen!", 1800); bird.carry(`<g transform="translate(-10 -4) scale(.6)">${ART.cloth.replace(/<\/?svg[^>]*>/g, "")}</g>`); await c.wait(1000);
      c.hint("Hilf mit – tipp auf das Schloss zum Polieren!");
      const shine = (x, y) => { const s = c.prop(`<div class="mk-shine"></div>`, x, y, 24, { anchor: "center" }); setTimeout(() => s.remove(), 900); tone(2000 + Math.random() * 800, 0.06, "sine", 0.04); };
      const tapPad = (e) => { if (e.target.closest(".munkel, .mk-item")) return; const r = pad.getBoundingClientRect(); shine(((e.clientX - r.left) / r.width) * 200, ((e.clientY - r.top) / r.height) * 240); };
      pad.addEventListener("click", tapPad, true);
      const route = [[40, 140], [80, 130], [130, 160], [160, 200], [100, 210], [50, 190]];
      for (const [x, y] of route) { await c.moveTo(x, y, 700, { arc: 6, keepFlying: true }); for (let i = 0; i < 2; i++) { c.anim(perch, [{ transform: "translate(-50%,-79%)" }, { transform: "translate(-40%,-79%)" }, { transform: "translate(-60%,-79%)" }, { transform: "translate(-50%,-79%)" }], 400); await c.wait(420); } shine(x, y + 10); }
      pad.removeEventListener("click", tapPad, true);
      c.pose("mk-fly", false); bird.carry(""); pad.classList.add("polished"); setTimeout(() => pad.classList.remove("polished"), 2500);
      await c.home(900); bird.act("mk-wink", 900); c.say("Ich kann mich darin spiegeln!", 2400); await c.wait(2600);
    } },
    "26e": { title: "Schattenspiel", async run(c) {
      const l = c.prop(ART.lantern, 166, 106, 14, { cls: "lit" });
      c.say("Rate mal, was das ist …", 2200); await c.wait(1500);
      const SH = {
        Hase: `<svg viewBox="0 0 100 80"><path d="M30 70 C10 70 10 44 30 40 C30 20 34 4 40 6 C44 8 42 24 42 36 C46 22 54 6 60 8 C66 12 54 30 50 40 C70 40 86 52 82 66 C80 74 70 74 60 70Z" fill="#0b1712"/></svg>`,
        Kapibara: `<svg viewBox="0 0 120 80"><ellipse cx="54" cy="46" rx="40" ry="24" fill="#0b1712"/><rect x="70" y="24" width="40" height="32" rx="14" fill="#0b1712"/><circle cx="82" cy="22" r="6" fill="#0b1712"/><rect x="26" y="60" width="10" height="16" rx="4" fill="#0b1712"/><rect x="70" y="60" width="10" height="16" rx="4" fill="#0b1712"/><circle cx="88" cy="10" r="8" fill="#0b1712"/></svg>`,
        Herz: `<svg viewBox="0 0 100 90"><path d="M50 84 C20 62 4 46 4 28 A22 22 0 0 1 50 18 A22 22 0 0 1 96 28 C96 46 80 62 50 84Z" fill="#0b1712"/></svg>`,
      };
      const names = Object.keys(SH); let i = 0;
      const screen = c.prop(`<div class="mk-shadow"></div>`, 100, 226, 104, { cls: "mk-shadow-screen" });
      const show = () => { screen.firstChild.innerHTML = SH[names[i % names.length]]; screen.firstChild.classList.remove("in"); void screen.offsetWidth; screen.firstChild.classList.add("in"); bird.act("mk-flutter", 700); tone(600 + (i % 3) * 120, 0.2, "triangle", 0.06); };
      c.hint("Tipp die Schattenfigur an – dann kommt die nächste!");
      screen.classList.add("tappable"); screen.addEventListener("click", (e) => { e.stopPropagation(); i++; show(); c.say(names[i % names.length] + "!", 1200); });
      show(); c.say(names[i % names.length] + "!", 1200); for (let k = 0; k < 3; k++) { await c.wait(2600); i++; show(); c.say(names[i % names.length] + "!", 1200); }
      await c.wait(2500); c.say("Das Kapibara kennst du bald persönlich.", 2600); await c.wait(2600); l.remove();
    } },

    /* ---------------- 27.11. ---------------- */
    "27m": { title: "Aufregung", async run(c) {
      c.say("MORGEN! Morgen ist es so weit!", 2000);
      c.hint("Tipp ihn an – dann hüpft er noch höher!");
      let high = 0; bird.onSceneTap = () => { high++; c.anim(perch, [{ top: "43.4%" }, { top: "20%" }, { top: "43.4%" }], 700, { easing: "cubic-bezier(.3,.7,.4,1)" }); tone(800 + high * 80, 0.1, "triangle", 0.08); c.burstAt(bird, ["⭐"], 5, 30); };
      for (let i = 0; i < 6; i++) { bird.act("mk-hop", 500); bird.act(i % 2 ? "mk-tilt" : "mk-flutter", 500); tone(700 + i * 50, 0.06, "triangle", 0.05); await c.wait(550); }
      await c.moveTo(120, 60, 600, { arc: 10, keepFlying: true }); await c.moveTo(170, 60, 600, { arc: -10, keepFlying: true }); await c.moveTo(146, 104, 600, { arc: 10 });
      for (let n = 1; n <= 3; n++) { bird.act("mk-preenR", 600); c.say(`Noch ${["drei", "zwei", "eine"][n - 1]} Feder${n === 3 ? "" : "n"} … äh, ein Tag!`, 1300); await c.wait(1300); }
      c.say("Ich bin sooo aufgeregt!", 2400); await c.wait(2400);
    } },
    "27e": { title: "Schäfchen zählen", async run(c) {
      c.say("Ich kann nicht schlafen … ich zähl Schäfchen.", 2600); await c.wait(1800);
      c.hint("Tipp ein Schäfchen an – es springt höher!");
      let n = 0;
      while (n < 12) {
        n++; const sh = c.prop(ART.sheep, -20, 232, 26, { onTap: (d) => { d.classList.add("high"); tone(1000, 0.1, "triangle", 0.06); } });
        const hi = () => (sh.classList.contains("high") ? -18 : 18);
        const a = c.anim(sh, [{ left: "-12%", top: "96.6%" }, { left: "30%", top: "96.6%", offset: 0.35 }, { left: "50%", top: `${hi()}%`, offset: 0.55 }, { left: "70%", top: "96.6%", offset: 0.75 }, { left: "112%", top: "96.6%" }], 2400, { easing: "linear" });
        a.onfinish = () => sh.remove();
        c.say(String(n), 900); tone(500 + n * 25, 0.08, "triangle", 0.05);
        if (n > 8) c.pose("mk-sleep", n % 2 === 1);
        await c.wait(900);
      }
      c.pose("mk-sleep"); c.prop(`<span>z</span><span>Z</span><span>z</span>`, 166, 70, 20, { cls: "mk-zzz" }); c.say("Zwölf … zzz …", 2000); await c.wait(4000);
    }, end: (c) => c.pose("mk-sleep", false) },
  };

  /* ---------- Abspielen ---------- */
  async function play(id, { auto } = {}) {
    if (!SCENES[id] || !bird) return;
    if (stage) stage.cleanup();
    const c = makeCtx(); stage = c; bird.busy = true; lock.classList.add("scene-on");
    try { await c.wait(auto ? 1200 : 200); await SCENES[id].run(c); }
    catch (e) { if (e && e.message !== "abgebrochen") console.error("Munkel-Szene " + id + ":", e); }
    finally {
      if (stage === c) {
        if (SCENES[id].end) SCENES[id].end(c);
        c.cleanup(); stage = null; bird.busy = false; lock.classList.remove("scene-on");
        if (!st.seen[id]) { st.seen[id] = Date.now(); save(); }
        renderItems(); updateAlbumBtn();
      }
    }
  }

  /* ---------- Szenen-Album ---------- */
  let albumBtn;
  function updateAlbumBtn() { if (albumBtn) albumBtn.querySelector("b").textContent = `${Object.keys(st.seen).length} / 28`; }
  function openAlbum() {
    if (document.querySelector(".mk-album")) return;
    const now = currentSlot(), nowOrder = slotOrder(now);
    const wrap = document.createElement("div"); wrap.className = "mk-album"; wrap.setAttribute("role", "dialog");
    const close = () => wrap.remove();
    let html = `<div class="mka-card"><button class="mka-close" aria-label="Schließen">✕</button><h2>Munkels Szenen-Album</h2><p>Alle Szenen, die du schon gesehen hast – zum Nochmal-Ansehen.</p><div class="mka-grid">`;
    for (let d = 14; d <= 27; d++) {
      html += `<div class="mka-day"><small>${d}. November</small>`;
      for (const p of ["m", "e"]) {
        const id = d + p, seen = !!st.seen[id], order = slotOrder(id);
        const state = seen || free() || order === nowOrder ? "open" : order < nowOrder ? "missed" : "future";
        html += `<button class="mka-scene ${state}" data-id="${id}" ${state === "open" ? "" : "disabled"}><span class="mka-ic">${p === "m" ? "☀" : "☾"}</span><span>${state === "open" ? SCENES[id].title : state === "missed" ? "verpasst" : "?"}</span></button>`;
      }
      html += `</div>`;
    }
    html += `</div></div>`;
    wrap.innerHTML = html;
    wrap.addEventListener("click", (e) => { if (e.target === wrap || e.target.closest(".mka-close")) { close(); return; } const b = e.target.closest(".mka-scene.open"); if (b) { close(); play(b.dataset.id); } });
    document.body.append(wrap);
  }

  /* ---------- Start auf dem Schloss-Bildschirm ---------- */
  function attach(lockEl, padEl, perchEl, birdEl) {
    lock = lockEl; pad = padEl; perch = perchEl; bird = birdEl;
    place(perch, HOME[0], HOME[1]);
    sky(); setInterval(sky, 60000);
    renderItems();
    albumBtn = document.createElement("button"); albumBtn.className = "mk-album-btn";
    albumBtn.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5C4 4.7 4.7 4 5.5 4H11v15H5.5A1.5 1.5 0 0 1 4 17.5z M20 5.5c0-.8-.7-1.5-1.5-1.5H13v15h5.5c.8 0 1.5-.7 1.5-1.5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg><span>Munkels Szenen</span><b></b>`;
    albumBtn.addEventListener("click", (e) => { e.stopPropagation(); openAlbum(); });
    lock.append(albumBtn); updateAlbumBtn();
    // die Szene des aktuellen Tagesabschnitts einmal von selbst abspielen
    let last = currentSlot();
    if (!st.seen[last]) setTimeout(() => play(last, { auto: true }), 2600);
    setInterval(() => { const s = currentSlot(); if (s !== last) { last = s; if (!st.seen[s] && !stage) play(s, { auto: true }); } }, 30000);
  }
  return { attach, play, openAlbum, currentSlot, SCENES, HATS, ART, state: () => st };
})();
