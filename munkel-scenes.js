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

  ART.moss = S("0 0 30 18", `<path d="M2 14 C2 6 10 2 15 6 C20 1 28 5 28 12 C28 17 4 18 2 14Z" fill="#6f9a52"/><path d="M6 12 q3 -4 6 -1 M15 9 q3 -3 7 0" stroke="#4f7a3a" stroke-width="1.4" fill="none"/>`);
  ART.mossBeak = `<g transform="translate(-9 -2) scale(.6)"><path d="M2 14 C2 6 10 2 15 6 C20 1 28 5 28 12 C28 17 4 18 2 14Z" fill="#6f9a52"/></g>`;
  ART.twigBeak2 = `<path d="M-18 2 L20 -3" stroke="#7a5537" stroke-width="2.6" stroke-linecap="round"/><path d="M8 -2 l6 -6 M-6 1 l-5 -6" stroke="#7a5537" stroke-width="1.8" stroke-linecap="round"/>`;
  ART.featherBeak = `<g transform="rotate(-70) translate(-4 -12)"><path d="M6 1 C11 7 11 16 6 23 C1 16 1 7 6 1Z" fill="#fff6e8" stroke="#e6d6b4" stroke-width=".8"/><path d="M6 3 V22" stroke="#d9c7a3" stroke-width=".8"/></g>`;
  // Nest: nur der vordere Rand – so sitzt der Vogel sichtbar „drin“
  const NEST = (stage) => S("0 0 100 44", stage < 1 ? `<ellipse cx="50" cy="30" rx="30" ry="5" fill="rgba(0,0,0,.15)"/>` :
    `<path d="M4 14 C4 40 96 40 96 14 C80 24 20 24 4 14Z" fill="${stage >= 2 ? "#8a5a3b" : "#6f9a52"}"/>` +
    `<path d="M4 14 C20 24 80 24 96 14" stroke="#6f9a52" stroke-width="7" fill="none" stroke-linecap="round"/>` +
    (stage >= 2 ? `<path d="M8 22 C26 32 74 32 92 22 M16 30 C32 37 68 37 84 30" stroke="#a8784f" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M0 12 l14 8 M100 12 l-14 8 M34 34 l-8 8 M66 34 l8 8 M48 36 l2 8" stroke="#7a5537" stroke-width="2.6" stroke-linecap="round"/>` : "") +
    (stage >= 3 ? `<g transform="translate(78 4) rotate(35)"><path d="M6 1 C11 7 11 16 6 23 C1 16 1 7 6 1Z" fill="#fff6e8" stroke="#e6d6b4"/><path d="M6 3 V22" stroke="#d9c7a3"/></g>` : ""));
  ART.nest = NEST(3);
  ART.dumbbell = `<g transform="scale(1.5)"><path d="M-16 -2 H16" stroke="#7a5537" stroke-width="2.6" stroke-linecap="round"/><circle cx="-18" cy="-2" r="6.5" fill="#d93a4a"/><circle cx="-20" cy="-4" r="2" fill="#fff" opacity=".6"/><circle cx="18" cy="-2" r="6.5" fill="#d93a4a"/><circle cx="16" cy="-4" r="2" fill="#fff" opacity=".6"/></g>`;
  ART.scale = S("0 0 60 26", `<rect x="2" y="6" width="56" height="18" rx="6" fill="#e8f1f4" stroke="#b9c9cf" stroke-width="1.5"/><rect x="2" y="20" width="56" height="4" rx="2" fill="#c8d6db"/><circle cx="30" cy="13" r="6.5" fill="#fff" stroke="#9fb0b6"/><g class="sc-needle"><path d="M30 13 L30 7.6" stroke="#d93a4a" stroke-width="1.4" stroke-linecap="round"/></g><circle cx="30" cy="13" r="1.2" fill="#2b241f"/>`);
  ART.yarn = "";
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

  // Sitzplätze (Fußpunkt in Schloss-Koordinaten) und Beinhaltung
  const SEATS = {
    home: [146, 104, "dangle"], edgeL: [58, 104, "dangle"], top: [100, 5, "stand"], ground: [34, 226, "stand"], groundR: [168, 226, "stand"],
    keyhole: [100, 178, "stand"], nest: [150, 109, "tuck"], letter: [42, 214, "stand"],
  };
  const FACE_MAP = { "mk-wow": "wow", "mk-sleep": "sleep", "mk-sad": "sad" };
  function makeCtx() {
    const token = { dead: false };
    const made = [];
    let cur = HOME.slice(), legs = "dangle";
    const check = () => { if (token.dead) throw new Error("abgebrochen"); };
    const wait = (ms) => new Promise((res, rej) => setTimeout(() => (token.dead ? rej(new Error("abgebrochen")) : res()), ms));
    const say = (t, ms = 3000) => { check(); bird.say(t, ms); };
    const face = (f) => bird.face(f);
    // ältere Posen-Namen weiter unterstützen
    const pose = (cls, on = true) => {
      if (FACE_MAP[cls]) { bird.face(on ? FACE_MAP[cls] : undefined); return; }
      const m = { "mk-open": "mouth", "mk-sing": "sing", "mk-stretch": "wings-up", "mk-fluff": "fluff", "mk-wrapped": "mk-wrapped" }[cls];
      if (cls === "mk-fly") { bird.fly(on); if (!on) bird.legs(legs); return; }
      bird.classList.toggle(m || cls, on);
    };
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
    // kleine Federn, die herabschweben
    const feathers = (n = 3, x = cur[0], y = cur[1] - 30) => {
      for (let i = 0; i < n; i++) {
        const f = prop(`<svg viewBox="0 0 12 24"><path d="M6 1 C11 7 11 16 6 23 C1 16 1 7 6 1Z" fill="#8e6142"/><path d="M6 3 V22" stroke="#6e4630" stroke-width=".8"/></svg>`, x + (Math.random() - 0.5) * 30, y, 5, { cls: "mk-feather" });
        const dx = (Math.random() - 0.5) * 60;
        anim(f, [{ transform: "translate(-50%,-100%) rotate(0)", opacity: 1 }, { transform: `translate(calc(-50% + ${dx * 0.5}px), -40%) rotate(${dx}deg)`, opacity: 1, offset: 0.5 }, { transform: `translate(calc(-50% + ${dx}px), 40%) rotate(${-dx}deg)`, opacity: 0 }], 2200 + Math.random() * 800, { easing: "ease-in-out" }).onfinish = () => f.remove();
      }
    };
    // Fliegen: Abheben → Bogen mit Kurvenlage (und Gleiten auf langen Strecken) → Abbremsen → Landung
    const moveTo = async (x, y, ms, o = {}) => {
      check();
      const fly = o.fly !== false, from = cur.slice();
      const land = o.land || (o.keepFlying ? null : legs);
      const dist = Math.hypot(x - from[0], y - from[1]);
      if (fly && !bird.classList.contains("flying")) {
        bird.classList.add("crouch"); await wait(170); bird.classList.remove("crouch");
        bird.fly(true); tone(260, 0.12, "sine", 0.05, 420);
      }
      bird.classList.toggle("flip", fly && x < from[0] - 4);
      const arc = o.arc ?? Math.min(40, dist * 0.25);
      const cx = (from[0] + x) / 2 + (o.curve || 0), cy = (from[1] + y) / 2 - arc;
      const P = (t) => { const u = 1 - t; return [u * u * from[0] + 2 * u * t * cx + t * t * x, u * u * from[1] + 2 * u * t * cy + t * t * y]; };
      const N = 28, frames = [];
      for (let i = 0; i <= N; i++) {
        const t = i / N, e = 0.5 - Math.cos(Math.PI * t) / 2;
        const [px, py] = P(e), [qx, qy] = P(Math.min(1, e + 0.04));
        const bob = fly ? Math.sin(t * Math.PI * Math.max(2, ms / 160)) * 1.6 * Math.sin(Math.PI * t) : 0;
        const bank = fly ? Math.max(-20, Math.min(20, (qx - px) * 2.2)) : 0;
        const [l, tp] = pct(px, py + bob);
        frames.push({ left: l + "%", top: tp + "%", rotate: bank + "deg" });
      }
      const a = perch.animate(frames, { duration: ms, easing: "linear", fill: "forwards" });
      const timers = [];
      if (fly && dist > 110 && ms > 1100) { timers.push(setTimeout(() => bird.glide(true), ms * 0.3), setTimeout(() => bird.glide(false), ms * 0.72)); }
      if (fly && land) timers.push(setTimeout(() => bird.classList.add("flare"), ms * 0.82));
      await new Promise((r) => (a.onfinish = r));
      timers.forEach(clearTimeout);
      place(perch, x, y); a.cancel(); cur = [x, y];
      bird.glide(false); bird.classList.remove("flare");
      if (fly && land) {
        bird.fly(false); bird.classList.remove("flip"); legs = land; bird.legs(land);
        bird.act("squash", 450); tone(180, 0.08, "triangle", 0.05);
        if (o.feathers) feathers(o.feathers);
      }
      check();
    };
    const jump = (x, y) => { place(perch, x, y); cur = [x, y]; };
    const seat = (name, ms = 1100, o = {}) => { const [x, y, l] = SEATS[name]; return moveTo(x, y, ms, { ...o, land: l }); };
    const home = (ms = 1200) => seat("home", ms);
    const waitTap = (el, ms) => new Promise((res) => {
      let done = false; const fin = (v) => { if (!done) { done = true; res(v); } };
      const h = (e) => { e.stopPropagation(); el.removeEventListener("click", h); fin(true); };
      el.addEventListener("click", h); el.classList.add("tappable");
      setTimeout(() => { el.removeEventListener("click", h); fin(false); }, ms);
    });
    const hint = (t, ms = 5000) => { lock.querySelectorAll(".mk-hint").forEach((h) => h.remove()); const h = document.createElement("div"); h.className = "mk-hint"; h.textContent = t; lock.append(h); made.push(h); setTimeout(() => { h.classList.add("out"); setTimeout(() => h.remove(), 300); }, ms); };
    const burstAt = (el, sym, n = 8, spread = 50) => { try { H().burstAt(el, sym, n, spread); } catch (e) {} };
    const burstPt = (x, y, sym, n = 8, spread = 50) => { const r = pad.getBoundingClientRect(); try { H().burst(r.left + (x / 200) * r.width, r.top + (y / 240) * r.height, sym, n, spread); } catch (e) {} };
    const cleanup = () => {
      token.dead = true; made.forEach((d) => d.remove()); bird.carry(""); bird._bubble?.remove();
      ["flying", "gliding", "flare", "flip", "mouth", "sing", "wings-up", "fluff", "crouch", "mk-wrapped", "preen-r", "preen-l"].forEach((c) => bird.classList.remove(c));
      bird.face(); bird.legs("dangle"); perch.getAnimations().forEach((a) => a.cancel()); perch.style.rotate = ""; place(perch, HOME[0], HOME[1]); bird.onSceneTap = null;
    };
    return { token, jump, wait, say, face, pose, prop, sky, anim, moveTo, seat, home, feathers, waitTap, hint, burstAt, burstPt, cleanup, made, get cur() { return cur; }, set legsNow(l) { legs = l; bird.legs(l); } };
  }

  /* ---------- Sammelstücke am Schloss ---------- */
  function addItem(name) { if (!st.items.includes(name)) { st.items.push(name); save(); renderItems(); } }
  function renderItems() {
    if (!pad) return;
    pad.querySelectorAll(".mk-item").forEach((d) => d.remove());
    const put = (html, x, y, w, extra = "", title = "") => { const d = document.createElement("div"); d.className = "mk-prop mk-item" + extra; d.innerHTML = html; place(d, x, y); d.style.width = (w / 200) * 100 + "%"; if (title) d.title = title; d.addEventListener("click", (e) => { e.stopPropagation(); d.classList.remove("wiggle"); void d.offsetWidth; d.classList.add("wiggle"); tone(900 + Math.random() * 300, 0.08, "sine", 0.06); }); pad.append(d); return d; };
    if (st.items.includes("brief")) put(ART.letter, 40, 236, 36, " lean", "Brief für Ute – erst am 28. öffnen!");
    if (st.items.includes("schneemann")) put(ART.snowman, 74, 106, 22, "", "Mini-Schneemann");
    if (st.items.includes("kerze")) put(ART.candle, 108, 106, 12, " lit candle", "Adventskerze");
    if (st.items.includes("laterne")) put(ART.lantern, 34, 106, 14, " lit lantern-item", "Laterne");
    if (st.items.includes("lichter")) {
      const d = document.createElement("div"); d.className = "mk-prop mk-item mk-lights"; d.style.left = "0"; d.style.top = "0"; d.style.width = "100%"; d.style.height = "100%"; d.style.transform = "none";
      const pts = []; for (let i = 0; i <= 12; i++) { const a = Math.PI - (i / 12) * Math.PI; pts.push([100 + Math.cos(a) * 48, 74 - Math.sin(a) * 48]); }
      [[52, 108], [52, 92]].reverse().forEach((p) => pts.unshift(p)); [[148, 92], [148, 108]].forEach((p) => pts.push(p));
      d.innerHTML = `<svg viewBox="0 0 200 240">${pts.map(([x, y], i) => `<circle class="bulb" style="animation-delay:-${(i * 0.23).toFixed(2)}s" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.3" fill="${["#ff5a7a", "#ffcf3f", "#4fd18b", "#58b6ff", "#c77dff"][i % 5]}"/>`).join("")}</svg>`;
      pad.append(d);
    }
    if (st.hat && bird) bird.setHat(HATS[st.hat]);
    if (st.items.includes("nest")) { const d = put(ART.nest, 148, 122, 66, " nest-item", "Munkels Nest"); d.style.zIndex = 3; }
    if (bird) bird.slim(!!st.slim);
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
    /* ---------------- 14.11. ---------------- */
    "14m": { title: "Aufwachen", async run(c) {
      c.face("sleep"); bird.classList.add("swaying");
      const z = c.prop(`<span>z</span><span>Z</span><span>z</span>`, 176, 52, 26, { cls: "mk-zzz" });
      c.hint("Tipp den Munkelvogel an, um ihn zu wecken!", 7000);
      const woke = await c.waitTap(bird, 7000);
      z.remove(); c.face("wow"); tone(700, 0.2, "triangle", 0.1, 1100); await c.wait(600);
      c.face("sleepy"); c.pose("mk-open"); bird.classList.add("wings-up"); tone(300, 0.6, "sine", 0.06, 200); await c.wait(1200);
      c.pose("mk-open", false); bird.classList.remove("wings-up");
      c.say(woke ? "Uaaah … guten Morgen, Ute!" : "Uaaah … schon so spät?", 2400); await c.wait(1400);
      bird.act("fluff", 900); c.burstAt(bird, ["·"], 10, 40); await c.wait(1100);
      c.face("normal"); await c.seat("top", 1300, { feathers: 2 });
      c.face("happy"); bird.classList.add("wings-up"); c.say("Hallo, Sonne!", 1800); tone(784, 0.3, "triangle", 0.07); tone(988, 0.3, "triangle", 0.07, null, 0.15); await c.wait(1500);
      bird.classList.remove("wings-up"); c.face(); await c.home(1300);
    } },
    "14e": { title: "Einnicken im Nest", async run(c) {
      c.face("sleepy"); await c.wait(900);
      c.pose("mk-open"); bird.classList.add("wings-up"); tone(320, 0.7, "sine", 0.05, 200); await c.wait(1100);
      c.pose("mk-open", false); bird.classList.remove("wings-up"); c.say("Uaaah … Zeit für ein gemütliches Bett.", 2600); await c.wait(2700);
      const nest = c.prop(NEST(0), 148, 122, 66, { cls: "mk-nest" });
      const trips = [[ART.mossBeak, 1, "Erst weiches Moos …"], [ART.twigBeak2, 2, "… ein paar Zweige …"], [ART.featherBeak, 3, "… und eine Daunenfeder!"]];
      for (const [beak, stage, txt] of trips) {
        await c.moveTo(250, 40, 900, { keepFlying: true, arc: 30 });
        await c.wait(500); bird.carry(beak);
        await c.moveTo(150, 96, 1000, { arc: -20, land: "stand" });
        bird.carry(""); nest.innerHTML = NEST(stage); nest.classList.remove("plop"); void nest.offsetWidth; nest.classList.add("plop");
        tone(500 + stage * 120, 0.1, "triangle", 0.06); c.say(txt, 1500); await c.wait(1300);
        if (stage === 2) c.hint("Tipp aufs Nest – dann klopft er es kuschelig!", 5200);
      }
      let fluffed = 0; nest.classList.add("tappable"); nest.onclick = (e) => { e.stopPropagation(); fluffed++; nest.classList.remove("plop"); void nest.offsetWidth; nest.classList.add("plop"); tone(700 + fluffed * 60, 0.08, "sine", 0.06); c.burstAt(nest, ["·"], 4, 20); };
      await c.moveTo(148, 114, 400, { fly: false, arc: 6 }); c.legsNow = "tuck"; bird.act("squash", 450); bird.act("mk-flutter", 900); await c.wait(1300);
      c.say(fluffed ? "So weich! Danke fürs Aufschütteln." : "Perfekt. Genau richtig weich.", 2400); await c.wait(2500);
      c.face("sleepy");
      for (let i = 0; i < 2; i++) {
        bird.classList.add("nod"); await c.wait(1300); bird.classList.remove("nod");
        c.face("wow"); tone(900, 0.06, "square", 0.04); await c.wait(450); c.face("sleepy"); await c.wait(700);
      }
      c.hint("Pssst … tipp ihn an, wenn du ihn wecken willst.", 6000);
      c.face("sleep"); const z = c.prop(`<span>z</span><span>Z</span><span>z</span>`, 176, 52, 26, { cls: "mk-zzz" });
      if (await c.waitTap(bird, 5500)) {
        z.remove(); c.face("wow"); tone(1200, 0.1, "triangle", 0.07); await c.wait(500);
        c.face("shy"); c.say("Ich hab gar nicht geschlafen! Ehrlich.", 2600); await c.wait(2700);
        c.face("sleepy"); await c.wait(900); c.face("sleep"); c.prop(`<span>z</span><span>Z</span><span>z</span>`, 176, 52, 26, { cls: "mk-zzz" });
      }
      await c.wait(3500); nest.remove(); addItem("nest");
    }, end: (c) => c.face() },
    "15m": { title: "Postflug", async run(c) {
      c.face("normal"); bird.act("mk-look", 2400); await c.wait(2400);
      c.face("wow"); await c.wait(500); c.face("happy"); await c.wait(500);
      await c.moveTo(260, -30, 1300, { keepFlying: true, arc: 40 });
      c.feathers(2, 160, 80); c.face(); await c.wait(1400);
      bird.carry(ART.letterBeak); c.jump(-70, 40);
      await c.moveTo(60, 0, 1100, { keepFlying: true, arc: -10 });
      await c.moveTo(150, 20, 900, { keepFlying: true, arc: 25 });
      await c.seat("top", 900);
      c.say("Post für Ute!", 1800); bird.act("mk-hop", 700); await c.wait(1900);
      c.face("focus"); await c.seat("keyhole", 1000);
      c.say("Passt der … ins Schlüsselloch?", 2000);
      for (let i = 0; i < 4; i++) { c.anim(perch, [{ translate: "0 0" }, { translate: "0 -6%" }, { translate: "0 0" }], 320); tone(1600 + i * 80, 0.03, "square", 0.03); await c.wait(380); }
      c.face("shy"); c.say("Nö. Viel zu groß.", 1800); await c.wait(1900);
      await c.seat("letter", 1000);
      bird.carry(""); addItem("brief"); tone(880, 0.12, "sine", 0.08); c.burstPt(40, 220, ["✨"], 8, 30);
      c.face("happy"); c.say("Ich leg ihn ordentlich hin.", 2000); await c.wait(1800);
      c.hint("Tipp den Brief an!");
      const b = pad.querySelector(".mk-item.lean");
      const tapped = b ? await c.waitTap(b, 5000) : false;
      c.face("wink"); c.say(tapped ? "Nicht aufmachen! Erst am 28.!" : "Für Ute. Erst am 28. öffnen!", 2600); await c.wait(2700);
      c.face(); await c.home(1300);
    } },
    "15e": { title: "Sterne anknipsen", async run(c) {
      await c.seat("top", 1300);
      c.face("dreamy"); c.say("So dunkel heute … ich mach mal Licht.", 2400); await c.wait(2500);
      const spots = [[18, 14], [32, 9], [70, 12], [84, 20], [58, 6], [12, 26], [90, 8]];
      c.face("focus");
      for (const [x, y] of spots) { bird.act("mk-flutter", 500); bird.classList.add("wings-up"); await c.wait(220); bird.classList.remove("wings-up"); c.sky(`<div class="mk-star"></div>`, x, y, 14, { cls: "pop" }); tone(1200 + Math.random() * 900, 0.15, "sine", 0.06); await c.wait(260); }
      c.face("happy"); c.hint("Tipp in den Himmel – mach selbst Sterne an!", 6000);
      let mine = 0;
      const tapSky = (e) => { if (e.target.closest(".lock-pad, .lock-clock, .mk-album-btn, .mk-album")) return; mine++; const x = (e.clientX / innerWidth) * 100, y = (e.clientY / innerHeight) * 100; c.sky(`<div class="mk-star"></div>`, x, y, 14, { cls: "pop" }); tone(1400 + Math.random() * 900, 0.12, "sine", 0.06); bird.act("mk-hop", 600); };
      lock.addEventListener("click", tapSky); await c.wait(6000).finally(() => lock.removeEventListener("click", tapSky));
      c.face("wow"); c.sky(ART.moon, 76, 3, 60, { cls: "pop slow" }); tone(660, 0.6, "sine", 0.06); await c.wait(900);
      c.face("dreamy"); c.say(mine ? `${mine} Sterne von dir – und dazu der Mond.` : "Und zum Schluss: der Mond.", 2600); await c.wait(2800);
      await c.home(1300);
    } },

    /* ---------------- 16.11. ---------------- */
    "16m": { title: "Frühstück", async run(c) {
      await c.seat("edgeL", 1300);
      const t = c.prop(ART.twig, 84, 106, 44);
      c.face("wow"); c.say("Frühstück! Beeren!", 1600); await c.wait(1600);
      c.face("happy");
      for (let i = 0; i < 3; i++) { bird.classList.add("preen-r"); c.pose("mk-open"); tone(1100, 0.05, "square", 0.04); await c.wait(320); bird.classList.remove("preen-r"); c.pose("mk-open", false); await c.wait(360); }
      const b = c.prop(ART.berry, 74, 104, 9);
      c.face("wow"); tone(600, 0.3, "sine", 0.05, 200);
      await c.anim(b, [{ left: "37%", top: "43%" }, { left: "24%", top: "60%" }, { left: "12%", top: "100%" }], 1300, { easing: "ease-in" }).finished;
      c.face("sad"); c.say("Oh nein … meine Lieblingsbeere!", 2400);
      c.hint("Wirf ihm die Beere zurück – tipp sie an!", 6000);
      if (await c.waitTap(b, 6000)) {
        await c.anim(b, [{ left: "12%", top: "100%" }, { left: "20%", top: "30%" }, { left: "29%", top: "36%" }], 900).finished; b.remove();
        c.face("happy"); c.pose("mk-open"); tone(1300, 0.1, "sine", 0.08, 1700); await c.wait(300); c.pose("mk-open", false);
        bird.act("mk-hop", 700); c.say("Gefangen! Danke, Ute!", 2200); c.burstAt(bird, ["💖"], 6, 40);
      } else { b.remove(); c.face("sad"); c.say("Na gut …", 1600); }
      await c.wait(2200); c.face("wow");
      for (let i = 0; i < 3; i++) { bird.act("mk-hop", 500); c.say("Hicks!", 600); tone(1500, 0.06, "sine", 0.08, 2200); await c.wait(850); }
      c.face("shy"); await c.wait(1000); t.remove(); c.face(); await c.home(1200);
    } },
    "16e": { title: "Gute-Nacht-Lied", async run(c) {
      await c.seat("groundR", 1400);
      c.face("dreamy"); c.say("Ein Lied für dich …", 2000); await c.wait(2100);
      c.face("happy"); bird.classList.add("sing");
      const melody = [523, 587, 659, 523, 659, 698, 784, 659, 587, 523];
      c.hint("Tipp die Noten an – dann klingen sie noch mal!", 6000);
      for (const f of melody) {
        tone(f, 0.45, "triangle", 0.07);
        const n = c.prop(`<span>${Math.random() < 0.5 ? "♪" : "♫"}</span>`, 168 + (Math.random() - 0.5) * 16, 186, 14, { cls: "mk-note", onTap: (d) => { tone(f * 2, 0.3, "sine", 0.08); d.classList.add("hit"); } });
        c.anim(n, [{ transform: "translate(-50%,-100%)", opacity: 0 }, { opacity: 1, offset: 0.15 }, { transform: `translate(-50%,-100%) translate(${(Math.random() - 0.5) * 70}px,-150px)`, opacity: 0 }], 3800, { easing: "ease-out" });
        bird.act("mk-tilt", 500); await c.wait(560);
      }
      bird.classList.remove("sing"); await c.wait(1300);
      c.face("sleepy"); c.say("Schlaf schön, Ute.", 2400); await c.wait(2600);
      c.face(); await c.home(1300);
    } },

    /* ---------------- 17.11. ---------------- */
    "17m": { title: "Durchs Schlüsselloch", async run(c) {
      c.face("focus"); bird.act("mk-look", 2400); await c.wait(1600);
      c.say("Was ist da wohl drin …?", 2000); await c.wait(2000);
      await c.seat("keyhole", 1300);
      bird.classList.add("peek"); c.face("focus"); await c.wait(1300);
      const eyes = c.prop(`<svg viewBox="0 0 30 14"><ellipse cx="8" cy="7" rx="5" ry="5.5" fill="#fff"/><ellipse cx="22" cy="7" rx="5" ry="5.5" fill="#fff"/><circle cx="9" cy="8" r="3" fill="#2b1a10"/><circle cx="23" cy="8" r="3" fill="#2b1a10"/></svg>`, 100, 150, 18, { cls: "mk-peek", anchor: "center" });
      bird.classList.remove("peek"); await c.wait(500);
      c.face("wow"); tone(1600, 0.15, "square", 0.05, 600);
      await c.moveTo(130, 186, 500, { fly: false, arc: 14 }); bird.act("squash", 450);
      c.say("AH! Da guckt jemand zurück!", 2200); await c.wait(1800);
      c.hint("Tipp aufs Schlüsselloch!", 5000);
      if (await c.waitTap(eyes, 5000)) { eyes.classList.add("blink"); tone(500, 0.3, "triangle", 0.08, 700); c.face("happy"); c.say("Ein Kapibara! Mit einer Orange auf dem Kopf!", 2800); await c.wait(2600); }
      eyes.remove(); c.face("shy"); c.say("Psst. Ich hab nichts gesehen.", 2200); await c.wait(2300);
      c.face(); await c.home(1400);
    } },
    "17e": { title: "Schneeflocken fangen", async run(c) {
      await c.seat("top", 1300);
      c.face("wow"); c.say("Es schneit!", 1500); await c.wait(1300);
      let caught = 0; c.face("happy");
      c.hint("Tipp die Schneeflocken an – er fängt sie!", 7000);
      const flake = () => {
        const x = 10 + Math.random() * 80;
        const f = c.sky(`<div class="mk-flake">❄</div>`, x, -4, 26, { onTap: (d) => { d.remove(); caught++; c.pose("mk-open"); tone(1500, 0.08, "sine", 0.08, 2000); bird.act("mk-hop", 600); setTimeout(() => c.pose("mk-open", false), 300); } });
        c.anim(f, [{ transform: "translate(0,0) rotate(0)" }, { transform: `translate(${(Math.random() - 0.5) * 80}px, ${innerHeight * 0.9}px) rotate(360deg)` }], 6500 + Math.random() * 2000, { easing: "linear" }).onfinish = () => f.remove();
      };
      for (let i = 0; i < 14; i++) { flake(); if (i % 3 === 0) { c.pose("mk-open"); setTimeout(() => c.pose("mk-open", false), 400); } await c.wait(450); }
      await c.wait(1000);
      const big = c.prop(`<div class="mk-flake big">❄</div>`, 100, -30, 14);
      await c.anim(big, [{ top: "-12%" }, { top: "-4%" }], 1500, { easing: "ease-in" }).finished;
      c.face("focus"); c.say("Eine … auf … meinem … Schnabel …", 2000); await c.wait(1900);
      big.remove(); c.face("happy"); bird.act("mk-hop", 600); tone(300, 0.15, "sawtooth", 0.06, 120); c.say("HATSCHI!", 1300); c.burstPt(100, -10, ["❄️", "·"], 14, 60);
      await c.wait(1500); c.face("shy"); c.say(caught ? `${caught} Flocken gefangen – danke!` : "Gesundheit, sagt man da!", 2200); await c.wait(2300);
      c.face(); await c.home(1300);
    } },

    "18m": { title: "Morgensport", async run(c) {
      c.say("Morgensport! Machst du mit?", 2200); await c.wait(2000);
      await c.seat("ground", 1300);
      c.hint("Feuere ihn an – tipp ihn an!", 6000);
      let cheers = 0; bird.onSceneTap = () => { cheers++; c.burstAt(bird, ["⭐", "✨"], 6, 40); tone(1000 + cheers * 60, 0.08, "triangle", 0.08); bird.act("mk-hop", 600); };
      c.face("focus");
      for (let i = 1; i <= 4; i++) { bird.classList.add("jj"); tone(500 + i * 50, 0.07, "triangle", 0.05); c.say(`Hampelmann ${i}!`, 700); await c.wait(450); bird.classList.remove("jj"); await c.wait(400); }
      bird.carry(ART.dumbbell); c.say("Beeren-Hanteln!", 1200); await c.wait(1100);
      for (let i = 1; i <= 3; i++) { bird.classList.add("lift"); tone(300 + i * 60, 0.12, "sawtooth", 0.03); await c.wait(600); bird.classList.remove("lift"); await c.wait(450); }
      bird.carry("");
      for (let i = 0; i < 3; i++) { bird.classList.add("pushup"); await c.wait(450); bird.classList.remove("pushup"); await c.wait(350); }
      c.face("happy"); c.prop(`<div class="mk-sweat">💧</div>`, 50, 170, 8); await c.wait(900);
      const sc = c.prop(ART.scale, 40, 236, 46, { cls: "mk-scaleprop" });
      c.face("normal"); c.say("Und jetzt … die Waage.", 1800); await c.wait(1300);
      await c.moveTo(40, 226, 600, { arc: 18, land: "stand" });
      const nd = sc.querySelector(".sc-needle"); nd.style.transformOrigin = "30px 13px"; nd.style.transformBox = "view-box";
      await c.anim(nd, [{ transform: "rotate(0)" }, { transform: "rotate(70deg)" }, { transform: "rotate(30deg)" }, { transform: "rotate(48deg)" }, { transform: "rotate(40deg)" }], 1500, { easing: "ease-out" }).finished;
      c.face("wow"); tone(1200, 0.2, "triangle", 0.08, 1600); await c.wait(500);
      bird.slim(true); st.slim = true; save(); c.burstAt(bird, ["✨", "⭐"], 12, 50);
      c.prop(`<div class="mk-tag">−1 Gramm!</div>`, 116, 212, 30);
      c.face("happy"); bird.act("mk-hop", 700); c.say(cheers ? `Danke fürs Anfeuern! Ich fühl mich so leicht!` : "Ein Gramm weniger! Ich fühl mich so leicht!", 2800); await c.wait(3000);
      c.face(); await c.home(1300); bird.act("mk-flutter", 900); await c.wait(900);
    } },
    "18e": { title: "Schal stricken", async run(c) {
      await c.seat("edgeL", 1300);
      bird.carry(ART.needles); c.face("focus"); c.say("Mein Schal ist zu kurz. Ich stricke weiter!", 2400); await c.wait(2400);
      const scarf = c.prop(`<div class="mk-knit"></div>`, 64, 112, 9, { anchor: "top" });
      c.hint("Tipp ihn an – dann strickt er schneller!", 6000);
      let len = 4, speed = 1; bird.onSceneTap = () => { speed = Math.min(4, speed + 1); tone(900, 0.05, "square", 0.04); };
      for (let i = 0; i < 28; i++) { len += 2.2 * speed; scarf.firstChild.style.height = len + "px"; tone(1800, 0.02, "square", 0.02); bird.act("mk-knit", 300); await c.wait(260); if (len > 110) break; }
      c.face("wow"); c.say("Oh … der ist ein bisschen lang geworden.", 2400); await c.wait(2400);
      scarf.remove(); bird.carry(""); c.pose("mk-wrapped"); c.face("happy"); c.say("Dafür sooo kuschelig!", 2000); await c.wait(2600); c.pose("mk-wrapped", false);
      c.face(); await c.home(1300);
    } },

    /* ---------------- 19.11. ---------------- */
    "19m": { title: "Schlüssel knacken", async run(c) {
      c.face("wink"); c.say("Ich krieg das Schloss schon auf …", 2200); await c.wait(2300);
      await c.seat("keyhole", 1300);
      bird.carry(`<g transform="translate(-8 4) rotate(195)">${ART.pin}</g>`); c.face("focus");
      c.hint("Pssst – tipp ihn an, wenn du ihn erwischst!", 6000);
      let caught = false; bird.onSceneTap = () => { caught = true; };
      for (let i = 0; i < 5 && !caught; i++) { bird.classList.add("peek"); tone(2400, 0.03, "square", 0.03); await c.wait(380); bird.classList.remove("peek"); await c.wait(260); }
      c.burstPt(100, 160, ["✦", "✨"], 10, 30); tone(2000, 0.1, "sawtooth", 0.05, 400); c.face("wow");
      await c.moveTo(70, 190, 500, { fly: false, arc: 14 }); bird.act("squash", 450); bird.carry("");
      await c.wait(600); c.face("shy");
      c.say(caught ? "Erwischt? Ich? Ich hab nur … poliert!" : "Ich? Gar nichts. Ich steh hier nur.", 2600); await c.wait(2700);
      c.face(); await c.home(1400);
    } },
    "19e": { title: "Laterne & Glühwürmchen", async run(c) {
      await c.seat("groundR", 1400);
      const l = c.prop(ART.lantern, 190, 228, 14, { cls: "lit" });
      c.face("happy"); c.say("Ich hab eine Laterne mitgebracht.", 2200); await c.wait(2200);
      for (let i = 0; i < 8; i++) { const f = c.prop(`<div class="mk-firefly"></div>`, 20 + Math.random() * 160, 20 + Math.random() * 180, 6, { cls: "drift", onTap: (d) => { d.classList.add("bright"); tone(1800 + Math.random() * 600, 0.12, "sine", 0.06); c.anim(d, [{ left: d.style.left, top: d.style.top }, { left: "95%", top: "88%" }], 1200); } }); f.style.animationDelay = -Math.random() * 6 + "s"; await c.wait(250); }
      c.face("dreamy"); c.hint("Tipp die Glühwürmchen an – sie fliegen zur Laterne!", 6500);
      for (let i = 0; i < 3; i++) { bird.act("mk-look", 2400); await c.wait(2300); }
      l.remove(); addItem("laterne");
      c.face("happy"); c.say("Die Laterne bleibt hier. Für gemütliche Abende.", 2600); await c.wait(2700);
      c.face(); await c.home(1300);
    } },

    /* ---------------- 20.11. ---------------- */
    "20m": { title: "Seifenblasen", async run(c) {
      c.face("happy"); c.say("Seifenblasen!", 1500); await c.wait(1400);
      c.hint("Lass die Seifenblasen platzen!", 6000);
      let popped = 0;
      for (let i = 0; i < 9; i++) {
        c.pose("mk-open"); tone(600 + i * 40, 0.15, "sine", 0.04, 900);
        const b = c.prop(ART.bubble, 158, 70, 12 + Math.random() * 10, { cls: "mk-bubble-prop", onTap: (d) => { popped++; d.classList.add("pop"); tone(1600, 0.05, "square", 0.05); c.burstAt(d, ["·"], 5, 20); setTimeout(() => d.remove(), 250); } });
        c.anim(b, [{ transform: "translate(-50%,-100%) translate(0,0)" }, { transform: `translate(-50%,-100%) translate(${(Math.random() - 0.4) * 160}px, ${-120 - Math.random() * 120}px)` }], 4200 + Math.random() * 1500, { easing: "ease-out" });
        await c.wait(250); c.pose("mk-open", false); await c.wait(350);
      }
      const big = c.prop(ART.bubble, 146, 112, 54, { cls: "mk-bubble-prop" });
      await c.wait(700); c.face("wow"); c.say("Huch – die trägt mich!", 1800);
      c.anim(big, [{ top: "46.6%" }, { top: "18%" }, { top: "46.6%" }], 2600);
      bird.legs("tuck"); await c.moveTo(146, 36, 1300, { fly: false, arc: 0 }); c.face("happy"); await c.moveTo(146, 104, 1300, { fly: false, arc: 0 }); bird.legs("dangle");
      big.classList.add("pop"); tone(1600, 0.08, "square", 0.06); bird.act("squash", 450); await c.wait(300); big.remove();
      c.say(popped ? `${popped} Blasen geplatzt – du bist schnell!` : "Plopp!", 2200); await c.wait(2300);
    } },
    "20e": { title: "Sternschnuppe", async run(c) {
      await c.seat("top", 1300);
      c.face("dreamy"); c.say("Psst … schau mal nach oben.", 2000); await c.wait(2000);
      c.hint("Tipp die Sternschnuppe an – wünsch dir was!", 7000);
      let wished = false;
      for (let i = 0; i < 3 && !wished; i++) {
        const st2 = c.sky(`<div class="mk-shoot"></div>`, 5 + i * 15, 8 + i * 5, 140, { onTap: () => { wished = true; } });
        c.face("wow");
        await c.anim(st2, [{ transform: "translate(0,0) rotate(18deg)", opacity: 0 }, { opacity: 1, offset: 0.2 }, { transform: `translate(${innerWidth * 0.55}px, ${innerHeight * 0.18}px) rotate(18deg)`, opacity: 0 }], 2200, { easing: "ease-in" }).finished;
        st2.remove(); c.face("dreamy"); await c.wait(500);
      }
      c.face("happy"); bird.classList.add("wings-up"); c.say(wished ? "Wir haben uns beide was gewünscht …" : "Ich wünsch mir was. Psst!", 2600);
      for (let i = 0; i < 14; i++) { c.burstPt(90 + Math.random() * 20, -30, ["✦", "✨"], 1, 30); await c.wait(150); }
      bird.classList.remove("wings-up"); await c.wait(800);
      c.face("wink"); c.say("Das geht bestimmt in Erfüllung.", 2200); await c.wait(2300);
      c.face(); await c.home(1300);
    } },

    /* ---------------- 21.11. ---------------- */
    "21m": { title: "Mützen-Anprobe", async run(c) {
      await c.seat("ground", 1400);
      c.face("wow"); c.say("Da regnet es … Mützen?!", 1800); await c.wait(900);
      const keys = ["zylinder", "weihnachten", "krone", "bommel"]; const icons = [];
      keys.forEach((k, i) => { const p = c.prop(`<svg viewBox="40 -14 60 40">${HATS[k]}</svg>`, 80 + i * 32, -40, 26, { cls: "mk-hatprop" }); c.anim(p, [{ top: "-17%" }, { top: `${(236 / 240) * 100}%` }], 900 + i * 220, { easing: "cubic-bezier(.3,1.4,.5,1)" }); icons.push(p); });
      await c.wait(1800);
      const poses = [["Wie ein Zauberer!", "wink"], ["Ho ho ho!", "happy"], ["Majestätisch.", "focus"], ["Kuschelig!", "happy"]];
      for (let i = 0; i < 4; i++) { bird.setHat(HATS[keys[i]]); bird.act(i % 2 ? "mk-tilt" : "mk-hop", 900); c.face(poses[i][1]); c.say(poses[i][0], 1300); tone(700 + i * 120, 0.15, "triangle", 0.08); await c.wait(1600); }
      c.face("normal"); c.hint("Welche soll er behalten? Tipp eine Mütze an!", 7000);
      let pick = null; icons.forEach((p, i) => { p.classList.add("tappable"); p.onclick = (e) => { e.stopPropagation(); pick = keys[i]; }; });
      for (let t = 0; t < 70 && !pick; t++) await c.wait(100);
      pick = pick || "bommel"; st.hat = pick; save(); bird.setHat(HATS[pick]); icons.forEach((p) => p.remove());
      c.burstAt(bird, ["✨", "⭐"], 10, 50); tone(1047, 0.2, "triangle", 0.1); bird.act("mk-hop", 700); c.face("happy");
      c.say(`Die ${HAT_NAMES[pick]} behalte ich!`, 2400); await c.wait(2500);
      c.face(); await c.home(1400);
    } },
    "21e": { title: "Besuch der Eule", async run(c) {
      await c.seat("edgeL", 1300);
      c.face("dreamy"); await c.wait(900);
      const o = c.prop(ART.owl, 280, 20, 34, { cls: "mk-owl" });
      tone(400, 0.3, "sine", 0.08, 350); tone(330, 0.4, "sine", 0.08, 300, 0.35);
      await c.anim(o, [{ left: "140%", top: "8%" }, { left: "90%", top: "18%" }, { left: "74%", top: "44%" }], 1800).finished;
      c.face("wow"); await c.wait(500); c.face("happy"); c.say("Oh, hallo Frau Eule!", 1800); await c.wait(2000);
      for (const b of ["?", "!", "?!", "…", "!!"]) { const q = c.prop(`<span>${b}</span>`, 110 + Math.random() * 30, 70, 12, { cls: "mk-whisper" }); c.anim(q, [{ opacity: 0, transform: "translate(-50%,-100%) scale(.5)" }, { opacity: 1, transform: "translate(-50%,-140%) scale(1)", offset: 0.3 }, { opacity: 0, transform: "translate(-50%,-220%) scale(.9)" }], 1600); bird.act("mk-tilt", 800); c.face(Math.random() < 0.5 ? "wow" : "focus"); tone(1200 + Math.random() * 600, 0.05, "sine", 0.05); await c.wait(750); }
      c.hint("Tipp die Eule an!", 5000);
      if (await c.waitTap(o, 4500)) { o.classList.add("hoot"); tone(380, 0.3, "sine", 0.1, 330); tone(330, 0.5, "sine", 0.1, 300, 0.35); c.face("happy"); c.say("Sie sagt: „Huhu, Ute!“", 2200); await c.wait(2200); }
      c.face("wink"); c.say("Sie hat gemunkelt … über einen Waschbären!", 2600); await c.wait(1900);
      await c.anim(o, [{ left: "74%", top: "44%" }, { left: "90%", top: "10%" }, { left: "140%", top: "-10%" }], 1800).finished;
      c.face(); await c.home(1300);
    } },

    /* ---------------- 22.11. ---------------- */
    "22m": { title: "Mini-Schneemann", async run(c) {
      for (let i = 0; i < 12; i++) { const f = c.sky(`<div class="mk-flake">❄</div>`, Math.random() * 100, -4, 18); c.anim(f, [{ transform: "translateY(0)" }, { transform: `translateY(${innerHeight}px)` }], 5000, { easing: "linear" }).onfinish = () => f.remove(); }
      c.face("wow"); c.say("Schnee! Ich bau was!", 1800); await c.wait(1600);
      await c.moveTo(100, 104, 1100, { land: "stand" });
      const ball = c.prop(`<div class="mk-snowball"></div>`, 76, 106, 4);
      c.face("focus");
      for (let i = 0; i < 8; i++) { ball.style.width = ((4 + i * 1.6) / 200) * 100 + "%"; await c.moveTo(i % 2 ? 100 : 94, 104, 300, { fly: false, arc: 0 }); tone(300 + i * 30, 0.05, "sine", 0.04); }
      ball.remove(); const sm = c.prop(ART.snowman, 74, 106, 22, { cls: "grow" });
      c.face("happy"); bird.act("mk-hop", 700); c.burstAt(sm, ["❄️", "✨"], 8, 30);
      c.hint("Tipp den Schneemann an!", 5000);
      if (await c.waitTap(sm, 4500)) { sm.classList.add("wiggle"); tone(900, 0.2, "triangle", 0.08); c.face("wow"); c.say("Er hat „Hallo Ute“ gesagt!", 2200); await c.wait(2000); }
      c.face("happy"); c.say("Er bleibt hier und passt mit auf.", 2200); sm.remove(); addItem("schneemann"); await c.wait(2300);
      c.face(); await c.home(1100);
    } },
    "22e": { title: "Kerze anzünden", async run(c) {
      c.face("dreamy"); c.say("Bald ist der erste Advent …", 2200); await c.wait(2300);
      const k = c.prop(ART.candle.replace('class="cd-flame"', 'class="cd-flame" style="opacity:0"').replace('class="cd-glow"', 'class="cd-glow" style="opacity:0"'), 108, 106, 12);
      await c.moveTo(124, 104, 1000, { land: "stand" });
      c.face("focus"); c.say("Ganz vorsichtig …", 1500); await c.wait(1000); c.pose("mk-open"); await c.wait(1100); c.pose("mk-open", false);
      k.remove(); addItem("kerze"); tone(523, 0.6, "sine", 0.08); tone(784, 0.6, "sine", 0.06, null, 0.1);
      lock.classList.add("candle-glow"); c.face("wow"); await c.wait(700); c.face("happy");
      c.hint("Tipp die Kerze an!", 5000);
      const kk = pad.querySelector(".mk-item.candle");
      if (kk && await c.waitTap(kk, 5000)) { kk.classList.add("flare"); tone(1047, 0.3, "sine", 0.08); setTimeout(() => kk.classList.remove("flare"), 1200); c.face("dreamy"); c.say("Wie schön sie flackert.", 2000); await c.wait(2000); }
      c.face("dreamy"); c.say("Jetzt ist es richtig gemütlich.", 2400); await c.wait(2500);
      c.face(); await c.home(1100);
    } },

    /* ---------------- 23.11. ---------------- */
    "23m": { title: "Wurm-Tauziehen", async run(c) {
      await c.seat("groundR", 1400);
      const w = c.prop(ART.worm, 186, 236, 12);
      c.anim(w, [{ clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0 0 0 0)" }], 800);
      c.face("wow"); c.say("Ein Wurm! Frühstück!", 1700); await c.wait(1500);
      c.face("focus"); await c.moveTo(178, 228, 400, { fly: false, arc: 6 });
      c.hint("Hilf ihm ziehen – tipp den Wurm an!", 5000);
      let help = 0; w.addEventListener("click", (e) => { e.stopPropagation(); help++; tone(500 + help * 40, 0.06, "triangle", 0.06); }); w.classList.add("tappable");
      for (let i = 0; i < 6; i++) { c.anim(perch, [{ rotate: "0deg" }, { rotate: "-14deg" }, { rotate: "0deg" }], 500); c.anim(w, [{ transform: "translate(-50%,-100%) scaleY(1)" }, { transform: "translate(-50%,-100%) scaleY(1.15)" }, { transform: "translate(-50%,-100%) scaleY(1)" }], 500); await c.wait(550); }
      c.face("wow"); tone(200, 0.3, "sawtooth", 0.06, 90);
      await c.moveTo(150, 232, 400, { fly: false, arc: 10 }); bird.act("squash", 450); c.say("Ups!", 1100);
      c.anim(w, [{ transform: "translate(-50%,-100%) rotate(0)" }, { transform: "translate(-50%,-100%) rotate(14deg)" }, { transform: "translate(-50%,-100%) rotate(-14deg)" }, { transform: "translate(-50%,-100%) rotate(0)" }], 900);
      await c.wait(900); c.anim(w, [{ clipPath: "inset(0 0 0 0)" }, { clipPath: "inset(100% 0 0 0)" }], 600); await c.wait(700);
      bird.act("fluff", 900); c.face("sad"); await c.wait(900);
      c.face("shy"); c.say(help ? "Danke fürs Helfen. Der Wurm war stärker." : "Hmpf. Dann eben Beeren.", 2400); await c.wait(2500);
      c.face(); await c.home(1400);
    } },
    "23e": { title: "Polarlicht", async run(c) {
      await c.seat("top", 1300);
      const a = c.sky(`<div class="mk-aurora"></div>`, 0, 0, innerWidth, { cls: "full" });
      c.face("wow"); c.pose("mk-open"); c.say("Ohhh …", 1800); tone(392, 1.2, "sine", 0.05); tone(587, 1.2, "sine", 0.04, null, 0.4);
      c.hint("Tipp in den Himmel – andere Farben!", 6000);
      let hue = 0; const tapSky = (e) => { if (e.target.closest(".lock-pad, .lock-clock, .mk-album-btn, .mk-album")) return; hue = (hue + 70) % 360; a.firstChild.style.filter = `hue-rotate(${hue}deg)`; tone(500 + hue, 0.4, "sine", 0.05); bird.act("mk-tilt", 900); };
      lock.addEventListener("click", tapSky);
      try {
        await c.wait(3500); c.pose("mk-open", false); c.face("dreamy");
        c.say("Das Schönste, was ich je gesehen hab.", 2600); await c.wait(5000);
      } finally { lock.removeEventListener("click", tapSky); }
      a.classList.add("fade"); await c.wait(1400);
      c.face(); await c.home(1300);
    } },

    /* ---------------- 24.11. ---------------- */
    "24m": { title: "Federputz-Show", async run(c) {
      await c.seat("edgeL", 1300);
      c.face("focus"); c.say("Kurz schick machen …", 1700); await c.wait(1500);
      for (let i = 0; i < 4; i++) { bird.classList.add(i % 2 ? "preen-l" : "preen-r"); tone(2400, 0.03, "sine", 0.03); await c.wait(650); bird.classList.remove("preen-l", "preen-r"); if (i === 1) c.feathers(2, 58, 70); await c.wait(250); }
      bird.act("fluff", 900); await c.wait(900);
      const m = c.prop(ART.mirror, 24, 112, 20);
      c.face("happy"); c.say("Spieglein, Spieglein …", 1800); await c.wait(1800);
      c.hint("Tipp den Spiegel an!", 5000);
      const t = await c.waitTap(m, 4500);
      c.burstAt(m, ["✨", "✦"], t ? 12 : 6, 30); tone(1568, 0.2, "sine", 0.08);
      c.face("wink"); c.say(t ? "… wer ist der Schönste? Ich. Und du, Ute!" : "*zwinker*", 2600); await c.wait(2700);
      c.face(); await c.home(1300);
    } },
    "24e": { title: "Mond-Schaukel", async run(c) {
      const moon = c.prop(ART.moon, 100, -60, 50, { cls: "mk-moonswing" });
      c.face("wow"); await c.anim(moon, [{ top: "-25%" }, { top: "30%" }], 1600, { easing: "cubic-bezier(.3,1.2,.5,1)" }).finished;
      c.face("happy"); await c.moveTo(102, 64, 1100, { land: "dangle" });
      c.face("dreamy"); c.hint("Tipp den Mond an – dann schwingt er höher!", 6000);
      let amp = 8; moon.classList.add("tappable"); moon.addEventListener("click", (e) => { e.stopPropagation(); amp = Math.min(26, amp + 6); tone(880, 0.2, "sine", 0.06); });
      const notes = [784, 659, 698, 587, 659, 523, 587, 494];
      for (let i = 0; i < 8; i++) {
        const deg = (i % 2 ? -1 : 1) * amp;
        [moon, perch].forEach((el) => el.animate([{ rotate: `${-deg}deg` }, { rotate: `${deg}deg` }], { duration: 900, easing: "ease-in-out", fill: "forwards" }));
        tone(notes[i], 0.5, "triangle", 0.05); await c.wait(900);
        if (i === 5) c.face("sleepy");
      }
      [moon, perch].forEach((el) => el.getAnimations().forEach((a) => a.cancel()));
      c.say("Gute Nacht, Ute …", 2000); await c.wait(1300); c.face(); await c.home(1200);
      await c.anim(moon, [{ top: "30%" }, { top: "-25%" }], 1400).finished;
    } },

    /* ---------------- 25.11. ---------------- */
    "25m": { title: "Looping-Ausflug", async run(c) {
      c.face("happy"); c.say("Ich dreh eine Runde!", 1700); await c.wait(1500);
      let extra = false; c.hint("Tipp ihn im Flug an – noch ein Looping!", 7000);
      bird.onSceneTap = () => { extra = true; };
      const trail = setInterval(() => { const r = perch.getBoundingClientRect(); try { H().burst(r.left + r.width / 2, r.top + r.height / 2, ["·"], 1, 6); } catch (e) {} }, 110);
      try {
        await c.moveTo(-50, 30, 1400, { keepFlying: true, arc: 30 });
        await c.moveTo(250, 0, 1800, { keepFlying: true, arc: -20 });
        const loop = async (cx, cy, r) => { for (let i = 0; i <= 14; i++) { const a = (i / 14) * Math.PI * 2; await c.moveTo(cx - Math.sin(a) * r, cy - (1 - Math.cos(a)) * r, 85, { arc: 0, keepFlying: true }); } };
        c.face("wow"); await loop(140, 60, 46); if (extra) { tone(1200, 0.3, "triangle", 0.08, 1800); await loop(140, 60, 56); }
        c.face("happy"); await c.moveTo(146, 104, 900, { arc: 20, land: "dangle" });
        c.anim(perch, [{ translate: "0 0" }, { translate: "12% 0", rotate: "8deg" }, { translate: "0 0", rotate: "0deg" }], 700); tone(250, 0.2, "sawtooth", 0.05, 120);
      } finally { clearInterval(trail); }
      await c.wait(800); perch.getAnimations().forEach((a) => a.cancel());
      c.face("shy"); c.say(extra ? "Zwei Loopings! Mir ist schwindelig." : "Gelandet! Fast elegant.", 2400); await c.wait(2500);
    } },
    "25e": { title: "Lichterkette", async run(c) {
      c.face("wow"); c.say("Ich hab eine Lichterkette gefunden!", 2000); bird.carry(ART.bulbBeak); await c.wait(2000);
      c.face("focus");
      const path = [[52, 108], [52, 74], [72, 34], [100, 26], [128, 34], [148, 74], [148, 108]];
      await c.moveTo(path[0][0], path[0][1], 900, { keepFlying: true });
      for (const [x, y] of path.slice(1)) await c.moveTo(x, y, 520, { arc: 8, keepFlying: true });
      bird.carry(""); addItem("lichter");
      const bulbs = [...pad.querySelectorAll(".mk-lights .bulb")];
      bulbs.forEach((b, i) => { b.style.opacity = 0; setTimeout(() => { b.style.opacity = 1; tone(900 + i * 70, 0.06, "sine", 0.05); }, 300 + i * 160); });
      await c.moveTo(146, 104, 700, { land: "dangle" });
      c.face("wow"); await c.wait(400 + bulbs.length * 160); c.face("happy");
      c.hint("Tipp die Lämpchen an – sie wechseln die Farbe!", 6000);
      const pal = ["#ff5a7a", "#ffcf3f", "#4fd18b", "#58b6ff", "#c77dff", "#fff3cf"];
      const lights = pad.querySelector(".mk-lights"); lights.style.pointerEvents = "auto";
      const onTap = (e) => { const b = e.target.closest(".bulb"); if (!b) return; e.stopPropagation(); b.setAttribute("fill", pal[(pal.indexOf(b.getAttribute("fill")) + 1) % pal.length]); tone(1200, 0.06, "sine", 0.06); bird.act("mk-hop", 600); };
      lights.addEventListener("click", onTap);
      try { c.say("Jetzt funkelt unser Schloss!", 2400); await c.wait(5600); }
      finally { lights.removeEventListener("click", onTap); lights.style.pointerEvents = ""; }
    } },

    /* ---------------- 26.11. ---------------- */
    "26m": { title: "Schloss polieren", async run(c) {
      c.face("focus"); c.say("Das Schloss muss glänzen!", 1800); bird.carry(`<g transform="translate(-10 -4) scale(.6)">${ART.cloth.replace(/<\/?svg[^>]*>/g, "")}</g>`); await c.wait(1800);
      c.hint("Hilf mit – tipp aufs Schloss zum Polieren!", 7000);
      const shine = (x, y) => { const s2 = c.prop(`<div class="mk-shine"></div>`, x, y, 24, { anchor: "center" }); setTimeout(() => s2.remove(), 900); tone(2000 + Math.random() * 800, 0.06, "sine", 0.04); };
      const tapPad = (e) => { if (e.target.closest(".munkel, .mk-item")) return; const r = pad.getBoundingClientRect(); shine(((e.clientX - r.left) / r.width) * 200, ((e.clientY - r.top) / r.height) * 240); };
      pad.addEventListener("click", tapPad, true);
      try {
        const route = [[44, 150], [86, 140], [140, 166], [160, 210], [100, 214], [52, 196]];
        for (const [x, y] of route) {
          await c.moveTo(x, y, 800, { arc: 10, keepFlying: true });
          for (let i = 0; i < 2; i++) { c.anim(perch, [{ translate: "0 0" }, { translate: "8% 0" }, { translate: "-8% 0" }, { translate: "0 0" }], 380); await c.wait(400); }
          shine(x, y - 30);
        }
      } finally { pad.removeEventListener("click", tapPad, true); }
      bird.carry(""); pad.classList.add("polished"); setTimeout(() => pad.classList.remove("polished"), 2500);
      await c.home(1100); c.face("wink"); c.say("Ich kann mich darin spiegeln!", 2400); await c.wait(2500);
    } },
    "26e": { title: "Schattenspiel", async run(c) {
      await c.seat("groundR", 1400);
      const l = c.prop(ART.lantern, 192, 228, 14, { cls: "lit" });
      c.face("wink"); c.say("Rate mal, was das ist …", 2000); await c.wait(1800);
      const SH = {
        Hase: `<svg viewBox="0 0 100 80"><path d="M30 70 C10 70 10 44 30 40 C30 20 34 4 40 6 C44 8 42 24 42 36 C46 22 54 6 60 8 C66 12 54 30 50 40 C70 40 86 52 82 66 C80 74 70 74 60 70Z"/></svg>`,
        Kapibara: `<svg viewBox="0 0 120 80"><ellipse cx="54" cy="46" rx="40" ry="24"/><rect x="70" y="24" width="40" height="32" rx="14"/><circle cx="82" cy="22" r="6"/><rect x="26" y="60" width="10" height="16" rx="4"/><rect x="70" y="60" width="10" height="16" rx="4"/><circle cx="88" cy="10" r="8"/></svg>`,
        Herz: `<svg viewBox="0 0 100 90"><path d="M50 84 C20 62 4 46 4 28 A22 22 0 0 1 50 18 A22 22 0 0 1 96 28 C96 46 80 62 50 84Z"/></svg>`,
      };
      const names = Object.keys(SH); let i = 0;
      const screen = c.prop(`<div class="mk-shadow"></div>`, 96, 226, 104, { cls: "mk-shadow-screen" });
      const show = () => { screen.firstChild.innerHTML = SH[names[i % names.length]]; screen.firstChild.classList.remove("in"); void screen.offsetWidth; screen.firstChild.classList.add("in"); bird.classList.add("wings-up"); setTimeout(() => bird.classList.remove("wings-up"), 500); tone(600 + (i % 3) * 120, 0.2, "triangle", 0.06); };
      c.hint("Tipp die Schattenfigur an – dann kommt die nächste!", 6000);
      screen.classList.add("tappable"); screen.addEventListener("click", (e) => { e.stopPropagation(); i++; show(); c.say(names[i % names.length] + "!", 1200); });
      c.face("focus"); show(); c.say(names[0] + "!", 1200);
      for (let k = 0; k < 3; k++) { await c.wait(2600); i++; show(); c.face(k % 2 ? "happy" : "wow"); c.say(names[i % names.length] + "!", 1200); }
      await c.wait(2300); c.face("wink"); c.say("Das Kapibara kennst du bald persönlich.", 2500); await c.wait(2600); l.remove();
      c.face(); await c.home(1400);
    } },

    /* ---------------- 27.11. ---------------- */
    "27m": { title: "Aufregung", async run(c) {
      c.face("wow"); c.say("MORGEN! Morgen ist es so weit!", 2000); await c.wait(1300);
      c.hint("Tipp ihn an – dann hüpft er noch höher!", 6000);
      let high = 0; bird.onSceneTap = () => { high++; bird.act("mk-hop", 700); tone(800 + high * 80, 0.1, "triangle", 0.08); c.burstAt(bird, ["⭐"], 5, 30); };
      await c.moveTo(100, 104, 700, { land: "stand" });
      for (const x of [70, 130, 80, 120, 100]) { c.face(x % 20 ? "happy" : "wow"); await c.moveTo(x, 104, 380, { fly: false, arc: 18 }); bird.act("squash", 400); tone(700 + x * 2, 0.06, "triangle", 0.05); }
      await c.seat("top", 900); bird.act("mk-flutter", 900); c.face("happy");
      for (let n = 1; n <= 3; n++) { bird.classList.add(n % 2 ? "preen-r" : "preen-l"); c.say(`Noch ${["drei", "zwei", "eine"][n - 1]} Feder${n === 3 ? "" : "n"} … äh, ein Tag!`, 1300); await c.wait(1300); bird.classList.remove("preen-r", "preen-l"); }
      c.face("wow"); c.say("Ich bin sooo aufgeregt!", 2200); await c.wait(2300);
      c.face(); await c.home(1200);
    } },
    "27e": { title: "Schäfchen zählen", async run(c) {
      const inNest = st.items.includes("nest");
      if (inNest) { await c.moveTo(148, 114, 1000, { land: "tuck" }); } else await c.home(800);
      c.face("sleepy"); c.say("Ich kann nicht schlafen … zu aufgeregt.", 2400); await c.wait(2500);
      c.face("normal"); c.say("Ich zähl Schäfchen.", 1600); await c.wait(1400);
      c.hint("Tipp ein Schäfchen an – es springt höher!", 6000);
      let n = 0;
      while (n < 12) {
        n++; const sh = c.prop(ART.sheep, -20, 232, 26, { onTap: (d) => { d.classList.add("high"); tone(1000, 0.1, "triangle", 0.06); } });
        const hi = () => (sh.classList.contains("high") ? -18 : 18);
        c.anim(sh, [{ left: "-12%", top: "96.6%" }, { left: "30%", top: "96.6%", offset: 0.35 }, { left: "50%", top: `${hi()}%`, offset: 0.55 }, { left: "70%", top: "96.6%", offset: 0.75 }, { left: "112%", top: "96.6%" }], 2400, { easing: "linear" }).onfinish = () => sh.remove();
        c.say(String(n), 800); tone(500 + n * 25, 0.08, "triangle", 0.05);
        c.face(n > 9 ? "sleep" : n > 6 ? "sleepy" : "normal");
        await c.wait(900);
      }
      c.face("sleep"); c.prop(`<span>z</span><span>Z</span><span>z</span>`, 176, 52, 26, { cls: "mk-zzz" }); c.say("Zwölf … zzz …", 1800); await c.wait(4200);
    }, end: (c) => c.face() },
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
    lock.append(albumBtn); requestAnimationFrame(() => lock.querySelector(".lock-clock")?.after(albumBtn)); updateAlbumBtn();
    // die Szene des aktuellen Tagesabschnitts einmal von selbst abspielen
    let last = currentSlot();
    if (!st.seen[last]) setTimeout(() => play(last, { auto: true }), 2600);
    setInterval(() => { const s = currentSlot(); if (s !== last) { last = s; if (!st.seen[s] && !stage) play(s, { auto: true }); } }, 30000);
  }
  return { attach, play, openAlbum, currentSlot, SCENES, HATS, ART, state: () => st };
})();
