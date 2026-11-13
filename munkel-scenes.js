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
  // Szenen gibt es erst ab dem 14.11. – was davor versehentlich lief, zählt nicht
  const START = new Date(+(typeof CONFIG !== "undefined" ? CONFIG.year : 2026), 10, 14).getTime();
  (() => {
    const early = Object.keys(st.seen).filter((k) => st.seen[k] < START);
    if (!early.length) return;
    early.forEach((k) => delete st.seen[k]);
    if (early.includes("14e")) st.items = st.items.filter((x) => x !== "nest");
    try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {}
  })();
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} };
  const H = () => App.h;
  const tone = (...a) => { try { H().sfx.tone(...a); } catch (e) {} };
  const HOME = [146, 104];

  /* ---------- Zeit: welcher Tag, morgens oder abends ---------- */
  const isEvening = (d = new Date()) => d.getHours() >= 17 || d.getHours() < 6;
  function currentSlot(d = new Date()) {
    // zwischen 0 und 6 Uhr gehört die Zeit noch zum Abend davor
    if (d.getHours() < 6) { d = new Date(d); d.setDate(d.getDate() - 1); d.setHours(22); }
    if (d.getTime() < START) return null; // vor dem 14.11. noch keine Szene
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
    lantern: S("0 0 30 38", `<path d="M15 0 v6" stroke="#3f3f46" stroke-width="2"/><path d="M8 8 h14 l-2 -3 h-10z" fill="#3f3f46"/><rect x="7" y="8" width="16" height="26" rx="3" fill="#ffe7a3" stroke="#3f3f46" stroke-width="2.4"/><path d="M15 16 q-3 5 0 10 q3 -5 0 -10z" fill="#f39c32"/><rect x="6" y="33" width="18" height="4" rx="1.5" fill="#3f3f46"/>`),
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
  /* ---------- Mond in der echten Mondphase ---------- */
  function moonPhase(d = new Date()) { const syn = 29.530588853, ref = Date.UTC(2000, 0, 6, 18, 14); return ((((d.getTime() - ref) / 86400000) % syn) + syn) % syn / syn; }
  function moonSVG(p = moonPhase(), size = 60) {
    const r = 26, c = 30, k = Math.cos(2 * Math.PI * p), waxing = p < 0.5;
    const rx = Math.abs(k) * r;
    // beleuchteter Teil: Halbkreis + Terminator-Ellipse
    const outer = waxing ? 1 : 0, crescent = k > 0;
    const inner = waxing ? (crescent ? 0 : 1) : (crescent ? 1 : 0);
    const lit = p < 0.02 || p > 0.98 ? "" : `<path d="M${c} ${c - r} A${r} ${r} 0 0 ${outer} ${c} ${c + r} A${rx.toFixed(2)} ${r} 0 0 ${inner} ${c} ${c - r}Z" fill="url(#mnL)"/>`;
    return `<svg viewBox="0 0 60 60" width="${size}" height="${size}" aria-hidden="true"><defs><radialGradient id="mnL" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#fffbe6"/><stop offset=".7" stop-color="#fbeec0"/><stop offset="1" stop-color="#e8d79e"/></radialGradient></defs>
      <circle cx="${c}" cy="${c}" r="${r}" fill="#34463f" stroke="#cdbf8f" stroke-opacity=".45" stroke-width="1.2"/>${lit}
      <g opacity="${p < 0.06 || p > 0.94 ? 0.15 : 0.35}" fill="#c9b67a"><circle cx="22" cy="24" r="3.4"/><circle cx="36" cy="38" r="4.2"/><circle cx="38" cy="20" r="2.2"/><circle cx="24" cy="40" r="2"/></g></svg>`;
  }
  const moonName = (p = moonPhase()) => p < 0.03 || p > 0.97 ? "Neumond" : p < 0.22 ? "zunehmende Mondsichel" : p < 0.28 ? "Halbmond" : p < 0.47 ? "zunehmender Mond" : p < 0.53 ? "Vollmond" : p < 0.72 ? "abnehmender Mond" : p < 0.78 ? "Halbmond" : "abnehmende Mondsichel";

  /* ---------- gemütliches Nest (Rückseite hinter, Vorderseite vor dem Vogel) ---------- */
  const NEST_BACK = S("0 0 120 60", `<ellipse cx="60" cy="24" rx="52" ry="13" fill="#5a3b26"/><ellipse cx="60" cy="25" rx="44" ry="9" fill="#3d281a"/><path d="M14 22 C20 12 34 10 40 14 M80 12 C92 10 104 14 108 22" stroke="#7a5537" stroke-width="3" fill="none" stroke-linecap="round"/>`);
  const NEST_FRONT = (stage = 3) => S("0 0 120 60",
    `<path d="M6 24 C6 52 114 52 114 24 C98 34 22 34 6 24Z" fill="#8a5a3b"/>` +
    `<path d="M6 24 C26 36 94 36 114 24" stroke="#a8784f" stroke-width="5" fill="none" stroke-linecap="round"/>` +
    (stage >= 2 ? [[10, 30, 110, 30], [12, 37, 108, 37], [20, 44, 100, 44], [4, 26, 60, 46], [116, 26, 60, 46], [30, 48, 112, 28], [90, 48, 8, 28]].map(([a, b, c2, d]) => `<path d="M${a} ${b} Q60 ${Math.max(b, d) + 8} ${c2} ${d}" stroke="${["#7a5537", "#9c6b45", "#6b4a35"][(a + b) % 3]}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`).join("") +
      `<path d="M0 20 l16 8 M120 20 l-16 8 M2 32 l12 -2 M118 32 l-12 -2 M36 50 l-6 8 M84 50 l6 8 M58 52 l-2 7" stroke="#6b4a35" stroke-width="2.6" stroke-linecap="round"/>` : "") +
    `<path d="M8 24 C20 18 36 28 48 22 C60 30 74 20 86 26 C96 20 108 26 112 24" stroke="#6f9a52" stroke-width="6" fill="none" stroke-linecap="round"/>` +
    `<path d="M14 26 q4 -6 9 -1 M46 25 q5 -6 10 0 M84 27 q5 -6 10 0" stroke="#86b366" stroke-width="3" fill="none" stroke-linecap="round"/>` +
    (stage >= 2 ? `<path d="M100 30 q8 -8 14 -2 q-6 6 -14 2z" fill="#4f9e5c"/><path d="M12 34 q-8 -6 -10 2 q6 4 10 -2z" fill="#4f9e5c"/><circle cx="104" cy="38" r="3.4" fill="#d93a4a"/><circle cx="110" cy="40" r="2.6" fill="#d93a4a"/>` : "") +
    (stage >= 3 ? `<g transform="translate(22 6) rotate(-35)"><path d="M6 1 C12 8 12 18 6 26 C0 18 0 8 6 1Z" fill="#fff6e8" stroke="#e6d6b4"/><path d="M6 3 V25" stroke="#d9c7a3"/></g><g transform="translate(86 4) rotate(30)"><path d="M6 1 C12 8 12 18 6 26 C0 18 0 8 6 1Z" fill="#f3e3c4" stroke="#e0caa0"/><path d="M6 3 V25" stroke="#cdb48a"/></g><ellipse cx="62" cy="27" rx="7" ry="3" fill="#fff6e8" opacity=".9"/>` : ""));
  ART.nestFront = NEST_FRONT(3);

  /* ---------- richtige Lämpchen ---------- */
  const LAMP = (x, y, col, ang, i) => `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${ang.toFixed(0)})" class="lamp" style="animation-delay:-${(i * 0.37).toFixed(2)}s">
    <circle cy="8" r="8" fill="${col}" class="halo" opacity=".35"/><rect x="-1.8" y="-1" width="3.6" height="3.6" rx="1" fill="#2f4a3a"/>
    <path class="bulb" d="M0 2 C3.6 4 4.2 8 3.2 11 C2.4 13.6 -2.4 13.6 -3.2 11 C-4.2 8 -3.6 4 0 2Z" fill="${col}" stroke="rgba(0,0,0,.18)" stroke-width=".5"/>
    <path d="M-1.4 5 q-1.2 2 -.6 5" stroke="#fff" stroke-width=".9" fill="none" opacity=".7" stroke-linecap="round"/></g>`;

  /* ---------- Glühwürmchen ---------- */
  const FIREFLY = `<svg viewBox="0 0 30 30" aria-hidden="true"><circle cx="15" cy="19" r="11" fill="#fff3a0" opacity=".28" class="ff-glow"/>
    <g class="ff-wings"><ellipse cx="10" cy="11" rx="6" ry="3.4" fill="#e9f4ff" opacity=".7" transform="rotate(-30 10 11)"/><ellipse cx="20" cy="11" rx="6" ry="3.4" fill="#e9f4ff" opacity=".7" transform="rotate(30 20 11)"/></g>
    <ellipse cx="15" cy="13" rx="3" ry="3.6" fill="#3a3140"/><circle cx="15" cy="9" r="2.4" fill="#2b2433"/><path d="M14 7 q-2 -4 -4 -4 M16 7 q2 -4 4 -4" stroke="#2b2433" stroke-width=".8" fill="none"/>
    <ellipse cx="15" cy="19" rx="3.6" ry="4.6" fill="#ffe86a" class="ff-tail"/><ellipse cx="15" cy="19" rx="2" ry="2.8" fill="#fffbe0"/></svg>`;

  /* ---------- großer Wurm mit Erdloch ---------- */
  ART.hole = S("0 0 40 12", `<ellipse cx="20" cy="7" rx="18" ry="5" fill="#4a3424"/><ellipse cx="20" cy="6" rx="12" ry="3" fill="#2b1d14"/><circle cx="6" cy="4" r="2" fill="#6b4a35"/><circle cx="33" cy="5" r="2.4" fill="#6b4a35"/>`);
  ART.bigworm = S("0 0 24 64", `<path d="M12 64 C12 50 7 44 10 34 C13 24 16 18 12 8" stroke="#f0a0a8" stroke-width="11" fill="none" stroke-linecap="round"/>${[56, 48, 40, 32, 24, 16].map((y, i) => `<path d="M${6 + (i % 2) * 2} ${y} h12" stroke="#d9808a" stroke-width="1.4" opacity=".6"/>`).join("")}<circle cx="9.5" cy="7" r="1.6" fill="#2b1a10"/><circle cx="14.5" cy="7" r="1.6" fill="#2b1a10"/><path d="M10 11 q2 1.6 4 0" stroke="#2b1a10" stroke-width="1" fill="none"/><ellipse cx="8" cy="9.5" rx="1.6" ry="1" fill="#ff8fa3" opacity=".7"/><ellipse cx="16" cy="9.5" rx="1.6" ry="1" fill="#ff8fa3" opacity=".7"/>`);

  /* ---------- 20 verschiedene Schafe ---------- */
  const SHEEP_ACC = {
    muetze: `<path d="M32 4 Q40 -10 50 2 Q46 2 48 8Z" fill="#c9302c"/><rect x="30" y="4" width="20" height="4" rx="2" fill="#fff"/><circle cx="50" cy="0" r="3" fill="#fff"/>`,
    schal: `<path d="M30 18 Q38 24 46 18 L46 22 Q38 28 30 22Z" fill="#58b6ff"/><path d="M42 21 l3 10 l-4 1 l-2 -10z" fill="#58b6ff"/>`,
    bart: `<path d="M38 20 q2 10 6 0 q-2 6 -6 0z" fill="#f4efe6" stroke="#ddd3c2" stroke-width=".6"/>`,
    brille: `<circle cx="38" cy="12" r="3.2" fill="none" stroke="#2b241f" stroke-width="1.2"/><circle cx="45" cy="12" r="3.2" fill="none" stroke="#2b241f" stroke-width="1.2"/><path d="M41.2 12 h.6" stroke="#2b241f" stroke-width="1.2"/>`,
    sonnenbrille: `<rect x="34" y="9.5" width="6.4" height="4.6" rx="2" fill="#1d1d24"/><rect x="41.6" y="9.5" width="6.4" height="4.6" rx="2" fill="#1d1d24"/><path d="M40 11 h2" stroke="#1d1d24" stroke-width="1.2"/>`,
    fliege: `<path d="M36 22 l-4 -3 v6z M40 22 l4 -3 v6z" fill="#8e2d3b"/><circle cx="38" cy="22" r="1.4" fill="#6f2230"/>`,
    krone: `<path d="M34 4 l1 -6 l3 3 l3 -5 l3 5 l3 -3 l1 6z" fill="#f2c84b" stroke="#c9961f" stroke-width=".6"/>`,
    schleife: `<path d="M36 2 l-6 -4 v8z M40 2 l6 -4 v8z" fill="#ff8fa3"/><circle cx="38" cy="2" r="1.8" fill="#e85d75"/>`,
    ohren: `<path d="M33 6 Q41 -4 49 6" stroke="#8e2d3b" stroke-width="1.6" fill="none"/><circle cx="33" cy="9" r="3.4" fill="#fff6e8" stroke="#e8c46b"/><circle cx="49" cy="9" r="3.4" fill="#fff6e8" stroke="#e8c46b"/>`,
    pudel: `<path d="M32 6 Q40 -4 48 6Z" fill="#4f9e5c"/><path d="M34 2 h12 M33 5 h14" stroke="#fff" stroke-width="1"/><circle cx="40" cy="-3" r="3" fill="#fff"/>`,
    kopfhoerer: `<path d="M33 10 Q40 -2 48 10" stroke="#2b241f" stroke-width="1.8" fill="none"/><rect x="31" y="9" width="4" height="6" rx="2" fill="#d93a4a"/><rect x="46" y="9" width="4" height="6" rx="2" fill="#d93a4a"/>`,
    glocke: `<path d="M36 22 h4 v2 q2 1 2 4 h-8 q0 -3 2 -4z" fill="#f2c84b" stroke="#c9961f" stroke-width=".6"/><path d="M33 20 Q38 24 43 20" stroke="#8e2d3b" stroke-width="1.4" fill="none"/>`,
    zylinder: `<rect x="33" y="-6" width="10" height="9" rx="1" fill="#2b241f"/><rect x="30" y="3" width="16" height="2.4" rx="1.2" fill="#2b241f"/><rect x="33" y="0" width="10" height="2" fill="#8e2d3b"/>`,
    monokel: `<circle cx="45" cy="12" r="3.4" fill="#dff3fb" fill-opacity=".4" stroke="#c9a04a" stroke-width="1"/><path d="M48 14 q2 6 -2 10" stroke="#c9a04a" stroke-width=".6" fill="none"/>`,
    blume: `<circle cx="35" cy="3" r="2" fill="#ffd84d"/>${[0, 72, 144, 216, 288].map((a) => `<circle cx="${35 + Math.cos((a * Math.PI) / 180) * 2.6}" cy="${3 + Math.sin((a * Math.PI) / 180) * 2.6}" r="1.6" fill="#ff8fa3"/>`).join("")}`,
    stirnband: `<path d="M32 7 Q40 3 48 7" stroke="#58b6ff" stroke-width="2.4" fill="none"/>`,
  };
  const SHEEP_LIST = [
    ["#fffaf0", "#3a3a40", ""], ["#fffaf0", "#3a3a40", "muetze"], ["#fffaf0", "#3a3a40", "schal"], ["#fffaf0", "#3a3a40", "brille"], ["#fffaf0", "#3a3a40", "bart"],
    ["#1f1f24", "#141418", ""], ["#fffaf0", "#3a3a40", "sonnenbrille"], ["#fffaf0", "#3a3a40", "fliege"], ["#ffffff", "#fbfbfb", ""], ["#fffaf0", "#3a3a40", "krone"],
    ["#fffaf0", "#3a3a40", "schleife"], ["#ffb3cf", "#e8789e", ""], ["#fffaf0", "#3a3a40", "ohren"], ["#fffaf0", "#3a3a40", "pudel"], ["#fffaf0", "#3a3a40", "kopfhoerer"],
    ["#fffaf0", "#3a3a40", "glocke"], ["#fffaf0", "#3a3a40", "zylinder"], ["#fffaf0", "#3a3a40", "monokel"], ["#fffaf0", "#3a3a40", "blume"], ["#fffaf0", "#3a3a40", "stirnband"],
  ];
  const SHEEP = (i) => { const [wool, face, acc] = SHEEP_LIST[i % SHEEP_LIST.length]; const st2 = wool === "#1f1f24" ? "#000" : "#e6dccb";
    return S("-2 -12 56 54", `<g fill="${wool}" stroke="${st2}" stroke-width="1.2">${[[14, 16], [22, 12], [30, 14], [36, 20], [28, 24], [18, 24], [12, 20]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7"/>`).join("")}</g>${(() => { const light = face === "#fbfbfb", hs = light ? 'stroke="#9a9286" stroke-width="1.1"' : ""; return `<ellipse cx="40" cy="14" rx="6" ry="7.4" fill="${face}" ${hs}/><ellipse cx="34.6" cy="9" rx="3" ry="1.6" fill="${face}" ${hs} transform="rotate(-20 34.6 9)"/><circle cx="38.6" cy="12" r="1.2" fill="${light ? "#2b241f" : "#fff"}"/><circle cx="43" cy="12" r="1.2" fill="${light ? "#2b241f" : "#fff"}"/>${light ? `<ellipse cx="41" cy="18.6" rx="2" ry="1.2" fill="#e8a0ab"/>` : ""}`; })()}<path d="M16 28 v8 M22 28 v8 M30 28 v8 M34 26 v8" stroke="${face === "#fbfbfb" ? "#9a9286" : "#3a3a40"}" stroke-width="2.6" stroke-linecap="round"/>${acc ? SHEEP_ACC[acc] : ""}`); };

  ART.needles = `<g class="kn"><path d="M-12 -2 L14 10 M-10 8 L16 -4" stroke="#c9a04a" stroke-width="2.2" stroke-linecap="round"/><circle cx="-12" cy="-2" r="2" fill="#8e2d3b"/><circle cx="-10" cy="8" r="2" fill="#8e2d3b"/></g>`;
  ART.scale2 = S("0 0 70 34", `<rect x="2" y="1" width="66" height="6" rx="3" fill="#eef4f6" stroke="#9fb0b6" stroke-width="1"/><rect x="4" y="6" width="62" height="27" rx="6" fill="#d9e4e8" stroke="#9fb0b6" stroke-width="1.2"/><rect x="15" y="10" width="40" height="18" rx="3" fill="#1d3a2f" stroke="#0f2219" stroke-width="1"/><text class="sc-num" x="35" y="24" text-anchor="middle" font-family="Menlo, Consolas, monospace" font-size="12" font-weight="700" fill="#9df0b8">0 g</text><circle cx="10" cy="20" r="2" fill="#9fb0b6"/><circle cx="60" cy="20" r="2" fill="#9fb0b6"/>`);
  const SNOWMAN = (stage = 6) => S("0 0 50 76", `<defs><radialGradient id="snG${stage}" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#dbe8f2"/></radialGradient></defs>
    ${stage >= 5 ? `<path d="M15 38 L3 28 M7 32 l-4 -1 M36 36 L47 26 M43 30 l4 -1" stroke="#6b4a35" stroke-width="2" stroke-linecap="round"/>` : ""}
    <circle cx="25" cy="60" r="15" fill="url(#snG${stage})"/>
    ${stage >= 2 ? `<circle cx="25" cy="38" r="11" fill="url(#snG${stage})"/><circle cx="25" cy="35" r="1.4" fill="#2b241f"/><circle cx="25" cy="41" r="1.4" fill="#2b241f"/>` : ""}
    ${stage >= 3 ? `<circle cx="25" cy="20" r="8.5" fill="url(#snG${stage})"/>` : ""}
    ${stage >= 4 ? `<circle cx="22" cy="18" r="1.3" fill="#2b241f"/><circle cx="28" cy="18" r="1.3" fill="#2b241f"/><path d="M25 21 L34 23 L25 23.4Z" fill="#f39c32"/><path d="M21.5 25 q3.5 2 7 0" stroke="#2b241f" stroke-width="1" fill="none" stroke-linecap="round"/>` : ""}
    ${stage >= 6 ? `<path d="M16 27 Q25 32 34 27 L34 30 Q25 35 16 30Z" fill="#d93a4a"/><path d="M29 30 l3 9 l-4 1 l-2 -9z" fill="#d93a4a"/>` : ""}`);
  ART.snowman = SNOWMAN(6);
  ART.carrot = `<path d="M-6 0 L10 -2 L10 2Z" fill="#f39c32"/><path d="M-8 -1 l-3 -3 M-8 1 l-3 3" stroke="#4f9e5c" stroke-width="1.6" stroke-linecap="round"/>`;

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
    keyhole: [100, 178, "stand"], nest: [148, 92, "tuck"], letter: [42, 214, "stand"], lampL: [62, 104, "dangle"],
  };
  // Zuhause: ab dem Nestbau im Nest, vorher auf der Schlosskante
  function restHome() { if (st.items.includes("nest")) { place(perch, SEATS.nest[0], SEATS.nest[1]); bird.legs("tuck"); } else { place(perch, HOME[0], HOME[1]); bird.legs("dangle"); } }
  const FACE_MAP = { "mk-wow": "wow", "mk-sleep": "sleep", "mk-sad": "sad" };
  function makeCtx() {
    const token = { dead: false };
    const made = [];
    let cur = st.items.includes("nest") ? SEATS.nest.slice(0, 2) : HOME.slice(), legs = st.items.includes("nest") ? "tuck" : "dangle";
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
    // Bildschirmrand in Schloss-Koordinaten (ganz raus inkl. Vogelbreite)
    const offX = (side) => { const r = pad.getBoundingClientRect(), bw = perch.getBoundingClientRect().width || r.width * 0.42; return (((side > 0 ? innerWidth + bw : -bw) - r.left) / r.width) * 200; };
    const offY = () => { const r = pad.getBoundingClientRect(), bh = perch.getBoundingClientRect().height || r.width * 0.42; return ((-bh * 1.1 - r.top) / r.height) * 240; };
    // etwas holen: ganz aus dem Bild fliegen, kurz weg sein, mit dem Ding zurückkommen
    const fetch = async (thing, o = {}) => {
      const side = o.side || (cur[0] < 100 ? -1 : 1), y = o.y ?? Math.max(-40, cur[1] - 80);
      await moveTo(offX(side), y, o.out || 1400, { keepFlying: true, arc: 30 });
      perch.style.visibility = "hidden"; await wait(o.away || 1100); perch.style.visibility = "";
      if (o.hold) bird.hold(thing); else bird.carry(thing);
      const back = o.from || side;
      jump(offX(back), o.backY ?? y); bird.classList.toggle("flip", back > 0);
    };
    // flüssige Flugbahn: gleichmäßiges Tempo nach Weglänge, Kurvenlage und Wenden; orient = Vogel dreht sich mit der Bahn (Looping)
    const path = async (pts, ms, o = {}) => {
      check(); bird.fly(true); bird.classList.remove("flip");
      const P = [cur.slice(), ...pts];
      const cr = (a, b, c2, d, t) => { const t2 = t * t, t3 = t2 * t; return 0.5 * (2 * b + (-a + c2) * t + (2 * a - 5 * b + 4 * c2 - d) * t2 + (-a + 3 * b - 3 * c2 + d) * t3); };
      const dense = [];
      for (let k = 0; k < P.length - 1; k++) { const p0 = P[Math.max(0, k - 1)], p1 = P[k], p2 = P[k + 1], p3 = P[Math.min(P.length - 1, k + 2)]; for (let q = 0; q < 24; q++) { const t = q / 24; dense.push([cr(p0[0], p1[0], p2[0], p3[0], t), cr(p0[1], p1[1], p2[1], p3[1], t)]); } }
      dense.push(P[P.length - 1].slice());
      const L = [0]; for (let k = 1; k < dense.length; k++) L.push(L[k - 1] + Math.hypot(dense[k][0] - dense[k - 1][0], dense[k][1] - dense[k - 1][1]));
      const total = L[L.length - 1] || 1;
      const at = (d) => { let k = 1; while (k < L.length - 1 && L[k] < d) k++; const f = Math.max(0, Math.min(1, (d - L[k - 1]) / Math.max(1e-6, L[k] - L[k - 1]))); return [dense[k - 1][0] + (dense[k][0] - dense[k - 1][0]) * f, dense[k - 1][1] + (dense[k][1] - dense[k - 1][1]) * f]; };
      const ease = o.linear ? (t) => t : (t) => 0.8 * t + 0.2 * (0.5 - Math.cos(Math.PI * t) / 2);
      const N = Math.max(60, Math.round(ms / 16)), frames = [];
      let prevAng = null, unwrap = 0, dirNow = o.dir || 1;
      for (let i2 = 0; i2 <= N; i2++) {
        const d = ease(i2 / N) * total, [x, y] = at(d);
        const [ax, ay] = at(Math.max(0, d - 2)), [bx, by] = at(Math.min(total, d + 2));
        const dx = bx - ax, dy = by - ay;
        const [l, t] = pct(x, y), fr = { left: l + "%", top: t + "%" };
        if (o.orient) {
          const a = (Math.atan2(dy, dx) * 180) / Math.PI;
          if (prevAng !== null) { while (a + unwrap - prevAng > 180) unwrap -= 360; while (a + unwrap - prevAng < -180) unwrap += 360; }
          prevAng = a + unwrap; fr.rotate = prevAng + "deg"; fr.scale = "1 1";
        } else {
          if (Math.abs(dx) > 0.4) dirNow = dx > 0 ? 1 : -1;
          const tilt = Math.max(-22, Math.min(22, (dy / Math.max(0.5, Math.hypot(dx, dy))) * 28)) * dirNow;
          fr.rotate = tilt + "deg"; fr.scale = `${dirNow} 1`;
        }
        frames.push(fr);
      }
      perch.style.transformOrigin = "50% 50%";
      const a = perch.animate(frames, { duration: ms, easing: "linear", fill: "forwards" });
      await new Promise((r) => (a.onfinish = r));
      const last = pts[pts.length - 1]; place(perch, last[0], last[1]); cur = last.slice();
      if (!o.keep) { a.cancel(); perch.style.transformOrigin = ""; }
      if (o.land) { a.cancel(); perch.style.transformOrigin = ""; bird.fly(false); legs = o.land; bird.legs(o.land); bird.act("squash", 450); }
      check();
      return a;
    };
    // Schnabelspitze in Schloss-Koordinaten
    const beakAt = () => { const r = bird.querySelector(".mk-beak").getBoundingClientRect(), pr = pad.getBoundingClientRect(); return [((r.left + r.width / 2 - pr.left) / pr.width) * 200, ((r.top - pr.top) / pr.height) * 240]; };
    // Schneefall mit unterschiedlich großen, schaukelnden Flocken
    const snowfall = (n = 40, ms = 14000) => {
      for (let k = 0; k < n; k++) setTimeout(() => {
        if (token.dead) return;
        const size = 4 + Math.random() * 10, x = Math.random() * 100;
        const f = sky(`<div class="mk-flake2"></div>`, x, -4, size);
        const drift = (Math.random() - 0.5) * 120, dur = Math.min(12000, 5000 + 4000 * (14 / size));
        f.animate([{ transform: "translate(0,0) rotate(0)" }, { transform: `translate(${drift * 0.5 + 20}px, ${innerHeight * 0.5}px) rotate(180deg)` }, { transform: `translate(${drift}px, ${innerHeight + 20}px) rotate(360deg)` }], { duration: dur, easing: "linear" }).onfinish = () => f.remove();
      }, (k / n) * ms);
    };
    const seat = (name, ms = 1100, o = {}) => { const [x, y, l] = SEATS[name]; return moveTo(x, y, ms, { ...o, land: l }); };
    const home = (ms = 1200) => seat(st.items.includes("nest") ? "nest" : "home", ms);
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
      token.dead = true; made.forEach((d) => d.remove()); bird.carry(""); bird.hold(""); bird._bubble?.remove(); perch.style.visibility = ""; perch.classList.remove("behind"); pad.classList.remove("bird-behind");
      ["flying", "gliding", "flare", "flip", "mouth", "sing", "wings-up", "fluff", "crouch", "mk-wrapped", "preen-r", "preen-l", "lifting", "peek", "knitting"].forEach((c) => bird.classList.remove(c));
      bird.face(); perch.getAnimations().forEach((a) => a.cancel()); perch.style.rotate = ""; perch.style.transformOrigin = ""; bird.classList.remove("knitting2", "newscarf"); restHome(); bird.onSceneTap = null;
    };
    return { token, beakAt, snowfall, jump, fetch, path, offX, offY, wait, say, face, pose, prop, sky, anim, moveTo, seat, home, feathers, waitTap, hint, burstAt, burstPt, cleanup, made, get cur() { return cur; }, set legsNow(l) { legs = l; bird.legs(l); } };
  }

  /* ---------- Sammelstücke am Schloss ---------- */
  function addItem(name) { if (!st.items.includes(name)) { st.items.push(name); save(); renderItems(); } }
  function renderItems() {
    if (!pad) return;
    pad.querySelectorAll(".mk-item, .mk-sheen").forEach((d) => d.remove());
    const put = (html, x, y, w, extra = "", title = "") => { const d = document.createElement("div"); d.className = "mk-prop mk-item" + extra; d.innerHTML = html; place(d, x, y); d.style.width = (w / 200) * 100 + "%"; if (title) d.title = title; d.addEventListener("click", (e) => { e.stopPropagation(); d.classList.remove("wiggle"); void d.offsetWidth; d.classList.add("wiggle"); tone(900 + Math.random() * 300, 0.08, "sine", 0.06); }); pad.append(d); return d; };
    if (st.items.includes("brief")) put(ART.letter, 40, 236, 36, " lean", "Brief für Ute – erst am 28. öffnen!");
    if (st.items.includes("schneemann")) put(ART.snowman, 70, 106, 46, "", "Mini-Schneemann");
    if (st.items.includes("kerze")) put(ART.candle, 112, 106, 16, " lit candle", "Adventskerze");
    if (st.items.includes("laterne")) put(ART.lantern, 36, 108, 13, " lit lantern-item", "Laterne");
    if (st.items.includes("nest")) { put(NEST_BACK, 148, 110, 84, " nest-back", "Munkels Nest"); put(ART.nestFront, 148, 110, 84, " nest-front", "Munkels Nest"); }
    if (st.items.includes("glanz")) { const g = document.createElement("div"); g.className = "mk-sheen"; pad.append(g); }
    if (st.items.includes("lichter")) {
      const d = document.createElement("div"); d.className = "mk-prop mk-item mk-lights"; d.style.left = "0"; d.style.top = "0"; d.style.width = "100%"; d.style.height = "100%"; d.style.transform = "none";
      const pts = []; for (let i = 0; i <= 14; i++) { const a = Math.PI - (i / 14) * Math.PI; pts.push([100 + Math.cos(a) * 52, 76 - Math.sin(a) * 52 + 3, (a * 180) / Math.PI - 90]); }
      const wire = `M44 106 L44 78 ` + pts.map(([x, y]) => `L${x.toFixed(1)} ${(y - 2).toFixed(1)}`).join(" ") + ` L156 78 L156 106`;
      const cols = ["#ffcf6a", "#ff7a6a", "#7fd6a0", "#7fbfff", "#ffd98a", "#e7a1ff"];
      d.innerHTML = `<svg viewBox="0 0 200 240"><path d="${wire}" stroke="#2f4a3a" stroke-width="1.4" fill="none"/>${[[44, 96, 180], [44, 84, 180], ...pts, [156, 84, 180], [156, 96, 180]].map(([x, y, a], i) => LAMP(x, y - 2, cols[i % cols.length], 0, i)).join("")}</svg>`;
      pad.append(d);
    }
    if (st.hat && bird) bird.setHat(HATS[st.hat]);
    if (bird) { bird.slim(!!st.slim); bird.classList.toggle("scarf2", !!st.scarf); if (st.scarf) bird.style.setProperty("--scarf", st.scarf); }
    // Glühwürmchen bleiben die ganze Nacht, in der sie gekommen sind
    pad.querySelectorAll(".mk-ff-keep").forEach((d) => d.remove());
    const hh = new Date().getHours();
    if (st.fireflies === nightKey() && (hh >= 17 || hh < 6)) for (let k = 0; k < 7; k++) {
      const f = document.createElement("div"); f.className = "mk-prop mk-firefly2 mk-ff-keep"; f.innerHTML = FIREFLY;
      place(f, 15 + ((k * 53) % 170), 30 + ((k * 71) % 190)); f.style.width = "4.5%"; f.style.transform = "translate(-50%, -50%)"; pad.append(f);
      const dx = 20 + (k % 3) * 14, dy = 16 + (k % 2) * 18;
      f.animate([{ translate: "0 0" }, { translate: `${dx}px ${-dy}px` }, { translate: `${-dy}px ${dx * 0.6}px` }, { translate: "0 0" }], { duration: 6000 + k * 900, iterations: Infinity, easing: "ease-in-out" });
    }
  }

  /* ---------- Himmel nach Uhrzeit ---------- */
  const nightKey = (d = new Date()) => { const x = new Date(d); if (x.getHours() < 6) x.setDate(x.getDate() - 1); return `${x.getFullYear()}-${x.getMonth() + 1}-${x.getDate()}`; };
  function sky() {
    if (!lock) return;
    const h = new Date().getHours();
    const mode = h >= 6 && h < 11 ? "morning" : h >= 11 && h < 16 ? "day" : h >= 16 && h < 19 ? "evening" : "night";
    lock.dataset.sky = mode;
    let orb = lock.querySelector(".sky-orb");
    if (!orb) { orb = Object.assign(document.createElement("div"), { className: "sky-orb" }); lock.prepend(orb, Object.assign(document.createElement("div"), { className: "sky-stars" })); }
    const dark = mode === "evening" || mode === "night";
    orb.classList.toggle("moon", dark);
    orb.innerHTML = dark ? moonSVG(moonPhase(), 52) : "";
    orb.title = dark ? `Heute: ${moonName()}` : "";
    // selbst angeknipste Sterne bleiben die ganze Nacht
    lock.querySelectorAll(".mk-star-keep").forEach((d) => d.remove());
    if (dark && st.sky && st.sky.key === nightKey()) st.sky.stars.forEach(([x, y]) => keepStar(x, y, false));
  }
  function keepStar(x, y, store = true) {
    const d = document.createElement("div"); d.className = "mk-sky mk-star-keep"; d.innerHTML = `<div class="mk-star bright"></div>`;
    d.style.left = x + "%"; d.style.top = y + "%"; d.style.width = "18px"; lock.append(d);
    if (store) { if (!st.sky || st.sky.key !== nightKey()) st.sky = { key: nightKey(), stars: [] }; st.sky.stars.push([+x.toFixed(1), +y.toFixed(1)]); save(); }
    return d;
  }

  /* ---------- Die Szenen ---------- */
  const SCENES = {
    /* ---------------- 14.11. ---------------- */
    /* ---------------- 14.11. ---------------- */
    "14m": { title: "Aufwachen", async run(c) {
      const nest = st.items.includes("nest");
      if (nest) { c.jump(SEATS.nest[0], SEATS.nest[1]); c.legsNow = "tuck"; }
      c.face("sleep"); bird.classList.remove("swaying");
      const z = c.prop(`<span>z</span><span>Z</span><span>z</span>`, 176, 50, 26, { cls: "mk-zzz" });
      c.hint("Tipp den Munkelvogel an, um ihn zu wecken!", 7000);
      const woke = await c.waitTap(bird, 7000);
      z.remove(); c.face("wow"); tone(700, 0.2, "triangle", 0.1, 1100); await c.wait(600);
      c.face("sleepy"); c.pose("mk-open"); bird.classList.add("wings-up"); tone(300, 0.6, "sine", 0.06, 200); await c.wait(1200);
      c.pose("mk-open", false); bird.classList.remove("wings-up");
      c.say(woke ? "Uaaah … guten Morgen, Ute!" : "Uaaah … schon so spät?", 2400); await c.wait(1400);
      bird.act("fluff", 900); c.burstAt(bird, ["·"], 10, 40); await c.wait(1100);
      c.face("normal"); await c.seat("top", 1300, { feathers: 2 });
      c.face("happy"); bird.classList.add("wings-up"); c.say("Hallo, Sonne!", 1800); tone(784, 0.3, "triangle", 0.07); tone(988, 0.3, "triangle", 0.07, null, 0.15); await c.wait(1500);
      bird.classList.remove("wings-up"); c.face(); await c.home(1300); bird.classList.add("swaying");
    } },
    "14e": { title: "Einnicken im Nest", async run(c) {
      c.face("sleepy"); await c.wait(900);
      c.pose("mk-open"); bird.classList.add("wings-up"); tone(320, 0.7, "sine", 0.05, 200); await c.wait(1100);
      c.pose("mk-open", false); bird.classList.remove("wings-up"); c.say("Uaaah … Zeit für ein gemütliches Bett.", 2600); await c.wait(2700);
      c.face("normal"); c.say("Dafür brauch ich ein Nest. Moment!", 1800); await c.wait(1400);
      let back = null, front = null;
      const trips = [[ART.mossBeak, 1, "Erst weiches Moos …"], [ART.twigBeak2, 2, "… ganz viele Zweige …"], [ART.featherBeak, 3, "… und weiche Daunenfedern!"]];
      for (const [beak, stage, txt] of trips) {
        await c.fetch(beak, { y: 30 });
        await c.moveTo(148, 88, 1400, { arc: -20, land: "stand" });
        // erst jetzt, wo er es mitgebracht hat, wird es abgelegt
        c.pose("mk-open"); bird.carry(""); await c.wait(150); c.pose("mk-open", false);
        if (!front) { back = c.prop(NEST_BACK, 148, 110, 84, { cls: "mk-nest-back" }); front = c.prop(NEST_FRONT(1), 148, 110, 84, { cls: "mk-nest" }); back.style.opacity = 0; }
        front.innerHTML = NEST_FRONT(stage); if (stage >= 2) back.style.opacity = 1;
        front.classList.remove("plop"); void front.offsetWidth; front.classList.add("plop");
        tone(500 + stage * 120, 0.1, "triangle", 0.06); c.say(txt, 1700); await c.wait(1700);
        if (stage === 2) c.hint("Tipp aufs Nest – dann klopft er es kuschelig!", 5200);
      }
      let fluffed = 0; front.classList.add("tappable"); front.onclick = (e) => { e.stopPropagation(); fluffed++; front.classList.remove("plop"); void front.offsetWidth; front.classList.add("plop"); tone(700 + fluffed * 60, 0.08, "sine", 0.06); c.burstAt(front, ["·"], 4, 20); };
      await c.moveTo(SEATS.nest[0], SEATS.nest[1], 500, { fly: false, arc: 6 }); c.legsNow = "tuck"; bird.act("squash", 450); bird.act("mk-flutter", 900); await c.wait(1300);
      c.face("happy"); c.say(fluffed ? "So weich! Danke fürs Aufschütteln." : "Perfekt. Genau richtig weich.", 2400); await c.wait(2500);
      c.face("sleepy");
      for (let i = 0; i < 2; i++) { bird.classList.add("nod"); await c.wait(1300); bird.classList.remove("nod"); c.face("wow"); tone(900, 0.06, "square", 0.04); await c.wait(450); c.face("sleepy"); await c.wait(700); }
      c.face("sleep"); c.prop(`<span>z</span><span>Z</span><span>z</span>`, 176, 50, 26, { cls: "mk-zzz" });
      await c.wait(3200); back.remove(); front.remove(); addItem("nest");
    }, end: (c) => c.face() },
    "15m": { title: "Postflug", async run(c) {
      c.face("normal"); bird.act("mk-look", 2400); await c.wait(2400);
      c.face("wow"); await c.wait(500); c.face("happy"); c.say("Moment – ich hol was!", 1500); await c.wait(900);
      await c.fetch(ART.letterBeak, { side: 1, y: -10, from: -1, backY: 30 });
      await c.path([[40, 10], [110, -10], [100, 5]], 2400, { land: "stand" });
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
      const spots = [[18, 14], [32, 9], [70, 12], [62, 22], [48, 6], [12, 26], [88, 26]];
      c.face("focus");
      for (const [x, y] of spots) { bird.classList.add("wings-up"); await c.wait(220); bird.classList.remove("wings-up"); keepStar(x, y).classList.add("pop"); tone(1200 + Math.random() * 900, 0.15, "sine", 0.06); await c.wait(300); }
      c.face("happy"); c.hint("Tipp in den Himmel – mach selbst Sterne an!", 7000);
      let mine = 0;
      const tapSky = (e) => { if (e.target.closest(".lock-pad svg *, .munkel, .lock-clock, .mk-album-btn, .mk-album, .lock-copy, .sky-orb")) return; mine++; keepStar((e.clientX / innerWidth) * 100, (e.clientY / innerHeight) * 100).classList.add("pop"); tone(1400 + Math.random() * 900, 0.12, "sine", 0.06); bird.act("mk-hop", 600); };
      lock.addEventListener("click", tapSky);
      try { await c.wait(7000); } finally { lock.removeEventListener("click", tapSky); }
      const orb = lock.querySelector(".sky-orb");
      c.face("focus"); bird.classList.add("wings-up"); await c.wait(300); bird.classList.remove("wings-up");
      orb?.classList.add("lit"); tone(660, 0.6, "sine", 0.06); c.face("wow"); await c.wait(900);
      c.face("dreamy"); c.say(mine ? `${mine} Sterne von dir! Und der Mond leuchtet auch.` : "Und jetzt leuchtet auch der Mond.", 2600); await c.wait(2800);
      await c.home(1300);
    } },
    /* ---------------- 16.11. ---------------- */
    "16m": { title: "Frühstück", async run(c) {
      c.face("happy"); c.say("Frühstück! Ich hol mir Beeren.", 1700); await c.wait(1300);
      await c.fetch(ART.twigBeak, { side: -1, y: 20 });
      await c.moveTo(SEATS.edgeL[0], SEATS.edgeL[1], 1500, { land: "dangle" });
      bird.carry(""); const t = c.prop(ART.twig, 84, 106, 44);
      c.face("wow"); c.say("Mmmh!", 1200); await c.wait(1200);
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
      c.face("shy"); await c.wait(900); t.remove(); c.face(); await c.home(1200);
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
        const f = c.sky(`<div class="mk-flake">❄</div>`, x, -4, 30, { onTap: (d) => { d.remove(); caught++; c.pose("mk-open"); tone(1500, 0.08, "sine", 0.08, 2000); bird.act("mk-hop", 600); setTimeout(() => c.pose("mk-open", false), 300); } });
        c.anim(f, [{ transform: "translate(0,0) rotate(0)" }, { transform: `translate(${(Math.random() - 0.5) * 80}px, ${innerHeight * 0.9}px) rotate(360deg)` }], 7000 + Math.random() * 2000, { easing: "linear" }).onfinish = () => f.remove();
      };
      for (let i = 0; i < 14; i++) { flake(); if (i % 3 === 0) { c.pose("mk-open"); setTimeout(() => c.pose("mk-open", false), 400); } await c.wait(450); }
      await c.wait(1000);
      // eine große Flocke landet genau auf seinem Schnabel
      c.face("focus"); await c.wait(300);
      // die Flocke folgt genau seinem Schnabel (in Bildschirm-Koordinaten)
      const big = document.createElement("div"); big.className = "mk-bigflake";
      big.innerHTML = `<svg viewBox="0 0 24 24"><g stroke="#ffffff" stroke-width="2.4" stroke-linecap="round">${[0, 60, 120].map((r) => `<g transform="rotate(${r} 12 12)"><path d="M12 1.5V22.5M12 5.5l-2.8-2.6M12 5.5l2.8-2.6M12 18.5l-2.8 2.6M12 18.5l2.8 2.6"/></g>`).join("")}</g><circle cx="12" cy="12" r="2" fill="#fff"/></svg>`;
      lock.append(big); c.made.push(big);
      const t0 = performance.now(), fallMs = 2200, startY = -40;
      let onBeak = true;
      const follow = (now) => {
        if (!big.isConnected || !onBeak) return;
        const bk = bird.querySelector(".mk-beak").getBoundingClientRect(), sz = big.offsetWidth;
        const t = Math.min(1, (now - t0) / fallMs), e = 1 - Math.pow(1 - t, 3);
        const tx = bk.left + bk.width / 2 - sz / 2, ty = bk.top - sz * 0.38;
        big.style.left = tx + Math.sin(t * 9) * 18 * (1 - t) + "px"; big.style.top = startY + (ty - startY) * e + "px"; big.style.rotate = t * 200 + "deg";
        requestAnimationFrame(follow);
      };
      requestAnimationFrame(follow);
      await c.wait(fallMs);
      const [bx, by] = c.beakAt();
      big.classList.add("onbeak"); c.say("Eine … auf … meinem … Schnabel …", 2200); await c.wait(2300);
      onBeak = false; big.remove(); c.face("happy"); bird.act("mk-hop", 600); tone(300, 0.15, "sawtooth", 0.06, 120); c.say("HATSCHI!", 1300); c.burstPt(bx, by, ["❄️", "·"], 14, 60);
      await c.wait(1500); c.face("shy"); c.say(caught ? `${caught} Flocken gefangen – danke!` : "Gesundheit, sagt man da!", 2200); await c.wait(2300);
      c.face(); await c.home(1300);
    } },
    "18m": { title: "Morgensport", async run(c) {
      const SX = 160, SY = 238, standY = 220;
      const sc = c.prop(ART.scale2, SX, SY, 56, { cls: "mk-scaleprop", z: 6 });
      const num = sc.querySelector(".sc-num");
      const weigh = async (target, warn) => {
        num.setAttribute("fill", "#9df0b8");
        for (let v = 0; v <= target; v += 2) { num.textContent = `${v} g`; tone(1400 + v * 10, 0.02, "square", 0.02); await c.wait(55); }
        num.textContent = `${target} g`; num.setAttribute("fill", warn ? "#ffb3a0" : "#9df0b8");
        sc.classList.add("blink"); await c.wait(1200); sc.classList.remove("blink");
      };
      c.face("normal"); c.say("Erst mal wiegen …", 1600); await c.wait(1200);
      await c.moveTo(SX, standY, 1300, { land: "stand" }); bird.act("squash", 450);
      await weigh(28, true);
      c.face("shy"); c.say("Oh … 28 Gramm. Zeit für Sport!", 2400); await c.wait(2500);
      num.textContent = "0 g";
      await c.seat("ground", 1100);
      c.hint("Feuere ihn an – tipp ihn an!", 6000);
      let cheers = 0; bird.onSceneTap = () => { cheers++; c.burstAt(bird, ["⭐", "✨"], 6, 40); tone(1000 + cheers * 60, 0.08, "triangle", 0.08); };
      c.face("focus");
      for (let i = 1; i <= 4; i++) { bird.classList.add("jj"); tone(500 + i * 50, 0.07, "triangle", 0.05); c.say(`Hampelmann ${i}!`, 700); await c.wait(450); bird.classList.remove("jj"); await c.wait(400); }
      c.say("Jetzt die Beeren-Hantel!", 1500); await c.wait(1200);
      bird.classList.add("lifting");
      for (let i = 1; i <= 3; i++) { await c.wait(1450); c.face("focus"); c.say(`${i}…`, 600); await c.wait(330); tone(300 + i * 80, 0.15, "sawtooth", 0.03, 500 + i * 80); c.face("happy"); await c.wait(420); }
      bird.classList.remove("lifting"); c.face("happy");
      for (let i = 0; i < 3; i++) { bird.classList.add("pushup"); await c.wait(450); bird.classList.remove("pushup"); await c.wait(350); }
      c.prop(`<div class="mk-sweat">💧</div>`, 50, 170, 8); await c.wait(900);
      c.face("normal"); c.say("Und jetzt … nochmal auf die Waage.", 1800); await c.wait(1300);
      await c.moveTo(SX, standY, 1300, { land: "stand" }); bird.act("squash", 450);
      bird.slim(true); st.slim = true; save();
      await weigh(26, false);
      c.face("wow"); tone(1200, 0.2, "triangle", 0.08, 1600); c.burstAt(sc, ["✨", "⭐"], 12, 40);
      c.prop(`<div class="mk-tag">−2 Gramm!</div>`, SX, 196, 30, { z: 7 });
      await c.wait(600); c.face("happy"); bird.act("mk-hop", 700);
      c.say(cheers ? "Danke fürs Anfeuern! Ich bin richtig schlank geworden!" : "Zwei Gramm weniger – ich bin richtig schlank geworden!", 3000); await c.wait(3200);
      c.face(); await c.home(1300); bird.act("mk-flutter", 900); await c.wait(900);
    } },
    "18e": { title: "Schal stricken", async run(c) {
      c.face("focus"); c.say("Ich möchte einen neuen Schal …", 1800); await c.wait(1400);
      await c.fetch(ART.needles, { side: -1, y: 30 });
      await c.moveTo(SEATS.edgeL[0], SEATS.edgeL[1], 1400, { land: "dangle" });
      const COLS = [["#8e2d3b", "Weinrot"], ["#2f8a52", "Tannengrün"], ["#3f6fb8", "Blau"], ["#e0a92e", "Gold"], ["#f2ece0", "Wollweiß"], ["#c45a8f", "Beere"]];
      c.say("Welche Farbe soll er haben?", 2200);
      c.hint("Tipp ein Wollknäuel an – such die Farbe aus!", 8000);
      let pick = null;
      const balls = COLS.map(([col, name], k) => c.prop(`<svg viewBox="0 0 30 30"><circle cx="15" cy="15" r="13" fill="${col}" stroke="rgba(0,0,0,.25)"/><path d="M5 11 Q15 4 25 11 M4 17 Q15 9 26 17 M6 22 Q15 15 24 22" stroke="rgba(255,255,255,.45)" stroke-width="1.6" fill="none"/><path d="M26 18 q8 6 4 12" stroke="${col}" stroke-width="1.6" fill="none"/></svg>`, 32 + k * 27, 168, 20, { z: 7, cls: "mk-yarn", onTap: () => { pick = [col, name]; } }));
      for (let t = 0; t < 80 && !pick; t++) await c.wait(100);
      pick = pick || COLS[Math.floor(Math.random() * COLS.length)];
      balls.forEach((b) => { if (!b.innerHTML.includes(pick[0])) b.remove(); else b.classList.add("chosen"); });
      tone(880, 0.15, "triangle", 0.08); c.face("happy"); c.say(`${pick[1]}! Schöne Wahl.`, 1800); await c.wait(1800);
      balls.forEach((b) => b.remove());
      const scarf = c.prop(`<div class="mk-knit" style="--yarn:${pick[0]}"></div>`, 64, 112, 9, { anchor: "top" });
      c.hint("Tipp ihn an – dann strickt er schneller!", 6000);
      c.face("focus"); bird.classList.add("knitting2");
      let len = 4, speed = 1; bird.onSceneTap = () => { speed = Math.min(4, speed + 1); tone(900, 0.05, "square", 0.04); };
      for (let i = 0; i < 40; i++) { len += 2.2 * speed; scarf.firstChild.style.height = len + "px"; if (i % 2 === 0) tone(1800, 0.02, "square", 0.02); await c.wait(260); if (len > 90) break; }
      bird.classList.remove("knitting2");
      c.face("happy"); c.say("Fertig! Jetzt anziehen …", 1800); await c.wait(1400);
      scarf.remove(); bird.carry("");
      st.scarf = pick[0]; save(); bird.style.setProperty("--scarf", pick[0]); bird.classList.add("scarf2", "newscarf");
      tone(523, 0.2, "triangle", 0.08); tone(784, 0.3, "triangle", 0.08, null, 0.15); c.burstAt(bird, ["✨"], 10, 40);
      await c.wait(700); bird.act("fluff", 900); c.say("Passt perfekt – schön warm um den Hals!", 2600); await c.wait(2700);
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
      c.face("dreamy"); c.say("Es ist so dunkel … ich hol eine Laterne.", 2200); await c.wait(1800);
      await c.fetch(`<g transform="translate(-8 -4) scale(.55)">${ART.lantern.replace(/<\/?svg[^>]*>/g, "")}</g>`, { side: -1, y: 30 });
      await c.moveTo(48, 100, 1500, { arc: 20, keepFlying: true });
      bird.carry(""); addItem("laterne"); tone(700, 0.1, "triangle", 0.06); c.burstPt(36, 96, ["✨"], 8, 24);
      await c.seat("lampL", 600);
      c.face("happy"); c.say("Da steht sie gut.", 1600); await c.wait(1700);
      for (let i = 0; i < 9; i++) {
        const x0 = 10 + Math.random() * 180, y0 = 20 + Math.random() * 200;
        const f = c.prop(FIREFLY, x0, y0, 9, { cls: "mk-firefly2", anchor: "center", onTap: (d) => { d.classList.add("bright"); tone(1800 + Math.random() * 600, 0.12, "sine", 0.06); c.anim(d, [{ left: d.style.left, top: d.style.top }, { left: "18%", top: "38%" }], 1300, { easing: "ease-in-out" }); } });
        const dx = (Math.random() - 0.5) * 40, dy = (Math.random() - 0.5) * 40;
        f.animate([{ translate: "0 0" }, { translate: `${dx}px ${dy}px` }, { translate: `${-dy}px ${dx}px` }, { translate: "0 0" }], { duration: 5000 + Math.random() * 3000, iterations: Infinity, easing: "ease-in-out" });
        await c.wait(220);
      }
      c.face("wow"); c.hint("Tipp die Glühwürmchen an – sie fliegen zur Laterne!", 6500); await c.wait(1200);
      c.face("dreamy");
      for (let i = 0; i < 3; i++) { bird.act("mk-look", 2400); await c.wait(2300); }
      st.fireflies = nightKey(); save();
      c.face("happy"); c.say("Die Glühwürmchen bleiben heute Nacht bei uns.", 2600); await c.wait(2700);
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
      const big = c.prop(ART.bubble, c.cur[0], c.cur[1] + 8, 54, { cls: "mk-bubble-prop" });
      await c.wait(700); c.face("wow"); c.say("Huch – die trägt mich!", 1800);
      c.anim(big, [{ top: "46.6%" }, { top: "18%" }, { top: "46.6%" }], 2600);
      const [hx, hy] = c.cur; bird.legs("tuck"); await c.moveTo(hx, 36, 1300, { fly: false, arc: 0 }); c.face("happy"); await c.moveTo(hx, hy, 1300, { fly: false, arc: 0 }); c.legsNow = st.items.includes("nest") ? "tuck" : "dangle";
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
      await c.anim(o, [{ left: "140%", top: "8%" }, { left: "90%", top: "18%" }, { left: "76%", top: "38%" }], 1800).finished;
      c.face("wow"); await c.wait(500); c.face("happy"); c.say("Oh, hallo Frau Eule!", 1800); await c.wait(2000);
      for (const b of ["?", "!", "?!", "…", "!!"]) { const q = c.prop(`<span>${b}</span>`, 110 + Math.random() * 30, 70, 12, { cls: "mk-whisper" }); c.anim(q, [{ opacity: 0, transform: "translate(-50%,-100%) scale(.5)" }, { opacity: 1, transform: "translate(-50%,-140%) scale(1)", offset: 0.3 }, { opacity: 0, transform: "translate(-50%,-220%) scale(.9)" }], 1600); bird.act("mk-tilt", 800); c.face(Math.random() < 0.5 ? "wow" : "focus"); tone(1200 + Math.random() * 600, 0.05, "sine", 0.05); await c.wait(750); }
      c.hint("Tipp die Eule an!", 5000);
      if (await c.waitTap(o, 4500)) { o.classList.add("hoot"); tone(380, 0.3, "sine", 0.1, 330); tone(330, 0.5, "sine", 0.1, 300, 0.35); c.face("happy"); c.say("Sie sagt: „Huhu, Ute!“", 2200); await c.wait(2200); }
      c.face("wink"); c.say("Sie hat gemunkelt … über einen Waschbären!", 2600); await c.wait(1900);
      await c.anim(o, [{ left: "76%", top: "38%" }, { left: "90%", top: "10%" }, { left: "140%", top: "-10%" }], 1800).finished;
      c.face(); await c.home(1300);
    } },

    /* ---------------- 22.11. ---------------- */
    "22m": { title: "Mini-Schneemann", async run(c) {
      c.snowfall(70, 30000);
      const cap = c.prop(`<svg viewBox="0 0 160 14" preserveAspectRatio="none"><path d="M0 14 Q4 2 20 3 Q40 0 60 4 Q80 0 100 3 Q120 0 140 4 Q156 2 160 14Z" fill="#fff"/><path d="M6 12 Q20 6 40 9 Q70 5 100 9 Q130 5 154 12" stroke="#dbe8f2" stroke-width="1.6" fill="none"/></svg>`, 100, 108, 150, { cls: "mk-snowcap" });
      c.face("wow"); c.say("Schnee! Ich bau einen Schneemann!", 2000); await c.wait(2000);
      await c.moveTo(150, 104, 1100, { land: "stand" });
      // Kugeln rollen: der Vogel schiebt sie über das Schloss, sie werden größer
      const roll = async (r0, r1, x0, x1) => {
        const ball = c.prop(`<div class="mk-snowball2"><i></i><i></i><i></i></div>`, x0, 106, r0 * 2, { z: 6 });
        c.face("focus");
        const steps = 10;
        for (let k = 1; k <= steps; k++) {
          const t = k / steps, x = x0 + (x1 - x0) * t, r = r0 + (r1 - r0) * t;
          ball.style.width = ((r * 2) / 200) * 100 + "%"; place(ball, x, 106);
          ball.firstChild.style.rotate = `${-t * 540}deg`;
          await c.moveTo(Math.min(180, x + r + 28), 104, 260, { fly: false, arc: 3 }); tone(220 + k * 12, 0.04, "sine", 0.03);
        }
        return ball;
      };
      const sm = c.prop(SNOWMAN(0), 70, 106, 46, { z: 5 });
      let b = await roll(4, 13.8, 140, 70); b.remove(); sm.innerHTML = SNOWMAN(1); bird.act("mk-hop", 600); c.say("Der Bauch!", 1200); await c.wait(900);
      await c.moveTo(150, 104, 900, { land: "stand" });
      b = await roll(3, 10.1, 140, 100);
      c.face("happy"); c.say("Hepp!", 900);
      await c.anim(b, [{ left: "49%", top: "44.2%" }, { left: "42%", top: "26%" }, { left: "35%", top: "33.8%" }], 750, { easing: "ease-out" }).finished;
      b.remove(); sm.innerHTML = SNOWMAN(2); bird.act("squash", 450); await c.wait(600);
      await c.moveTo(150, 104, 900, { land: "stand" });
      b = await roll(2.5, 7.8, 140, 100);
      await c.anim(b, [{ left: "49%", top: "44.2%" }, { left: "41%", top: "18%" }, { left: "35%", top: "26%" }], 750, { easing: "ease-out" }).finished;
      b.remove(); sm.innerHTML = SNOWMAN(3); c.say("Und der Kopf!", 1300); await c.wait(1300);
      // Karotte holen
      await c.fetch(ART.carrot, { side: 1, y: 20, away: 800 });
      await c.moveTo(108, 48, 1500, { keepFlying: true, arc: 20 });
      bird.carry(""); sm.innerHTML = SNOWMAN(4); tone(1200, 0.08, "triangle", 0.07); c.burstPt(78, 70, ["✨"], 6, 20);
      c.say("Karottennase und Kohleaugen!", 1800); await c.wait(1500);
      await c.fetch(ART.twigBeak2, { side: 1, y: 30, away: 700 });
      await c.moveTo(114, 70, 1500, { keepFlying: true, arc: 20 });
      bird.carry(""); sm.innerHTML = SNOWMAN(5); tone(900, 0.08, "triangle", 0.07); c.say("Zweig-Arme!", 1300); await c.wait(1100);
      sm.innerHTML = SNOWMAN(6); tone(1400, 0.1, "triangle", 0.07); c.burstAt(sm, ["❄️", "✨"], 10, 30);
      await c.moveTo(120, 104, 600, { land: "stand" });
      c.face("happy"); c.say("Und ein Schal, damit er nicht friert!", 2000); await c.wait(2000);
      c.hint("Tipp den Schneemann an!", 5000);
      if (await c.waitTap(sm, 4500)) { sm.classList.add("wiggle"); tone(900, 0.2, "triangle", 0.08); c.face("wow"); c.say("Er sagt, er hat kalte Füße – aber ein warmes Herz!", 2600); await c.wait(2500); }
      c.say("Er bleibt hier und passt mit auf.", 2200); await c.wait(2300);
      sm.remove(); cap.remove(); addItem("schneemann");
      c.face(); await c.home(1100);
    } },
    "22e": { title: "Kerze anzünden", async run(c) {
      c.face("dreamy"); c.say("Bald ist der erste Advent … ich hol eine Kerze.", 2400); await c.wait(1900);
      const unlit = ART.candle.replace('class="cd-flame"', 'class="cd-flame" style="opacity:0"').replace('class="cd-glow"', 'class="cd-glow" style="opacity:0"');
      await c.fetch(`<g transform="translate(-5 -6) scale(.5)">${unlit.replace(/<\/?svg[^>]*>/g, "")}</g>`, { side: 1, y: 20 });
      await c.moveTo(118, 64, 1500, { keepFlying: true, arc: 20 });
      bird.carry(""); const k = c.prop(unlit, 112, 106, 16, { z: 7 }); tone(600, 0.08, "triangle", 0.06);
      await c.moveTo(134, 58, 500, { keepFlying: true, arc: 4 }); bird.glide(true);
      c.face("focus"); c.say("Ganz vorsichtig …", 1500); await c.wait(1000); c.pose("mk-open"); await c.wait(1100); c.pose("mk-open", false); bird.glide(false);
      k.innerHTML = ART.candle.replace(/^<svg/, "<svg"); k.classList.add("lit", "candle-lit"); tone(523, 0.6, "sine", 0.08); tone(784, 0.6, "sine", 0.06, null, 0.1);
      lock.classList.add("candle-glow"); c.face("wow"); await c.wait(700); c.face("happy");
      c.hint("Tipp die Kerze an!", 5000);
      if (await c.waitTap(k, 5000)) { k.classList.add("flare"); tone(1047, 0.3, "sine", 0.08); setTimeout(() => k.classList.remove("flare"), 1200); c.face("dreamy"); c.say("Wie schön sie flackert.", 2000); await c.wait(2000); }
      c.face("dreamy"); c.say("Jetzt ist es richtig gemütlich.", 2400); await c.wait(2500);
      k.remove(); addItem("kerze");
      c.face(); await c.home(1100);
    } },
    /* ---------------- 23.11. ---------------- */
    "23m": { title: "Wurm-Tauziehen", async run(c) {
      await c.seat("groundR", 1400);
      await c.moveTo(160, 226, 500, { fly: false, arc: 6 });
      const hole = c.prop(ART.hole, 192, 241, 28, { z: 6 });
      const box = c.prop(`<div class="mk-wormbox"><div class="mk-wormin">${ART.bigworm}</div></div>`, 192, 238, 16, { z: 7 });
      const inner = box.querySelector(".mk-wormin");
      const pos = (pctDown, ms, ease = "ease-out") => inner.animate([{}, { transform: `translateY(${pctDown}%)` }], { duration: ms, easing: ease, fill: "forwards" }).finished;
      inner.style.transform = "translateY(100%)";
      await pos(0, 1100);
      inner.animate([{ rotate: "-6deg" }, { rotate: "6deg" }, { rotate: "-6deg" }], { duration: 900, iterations: 2 });
      c.face("wow"); c.say("Ein Wurm! Frühstück!", 1700); await c.wait(1800);
      c.face("focus"); bird.classList.add("peek"); await c.wait(450);
      c.pose("mk-open"); await c.wait(250); c.pose("mk-open", false); tone(1500, 0.05, "square", 0.05);
      c.say("Hab ihn!", 1000); await c.wait(700);
      c.hint("Hilf ihm ziehen – tipp den Wurm an!", 6000);
      let help = 0; box.addEventListener("click", (e) => { e.stopPropagation(); help++; tone(500 + help * 40, 0.06, "triangle", 0.06); }); box.classList.add("tappable");
      for (let i = 0; i < 5; i++) {
        c.anim(perch, [{ rotate: "0deg", translate: "0 0" }, { rotate: "-12deg", translate: "-5% 2%" }, { rotate: "-4deg", translate: "-2% 0" }], 650);
        inner.animate([{ transform: "translateY(0) scaleY(1)" }, { transform: `translateY(0) scaleY(${1.12 + i * 0.05 + help * 0.02})` }, { transform: "translateY(0) scaleY(1.03)" }], { duration: 650, fill: "forwards" });
        tone(260 + i * 30, 0.12, "sawtooth", 0.03); await c.wait(720);
      }
      // er flutscht zurück ins Loch, der Vogel fällt auf den Po
      bird.classList.remove("peek"); c.face("wow"); tone(900, 0.3, "sine", 0.06, 200);
      inner.animate([{ transform: "translateY(0) scaleY(1.2)" }, { transform: "translateY(8%) scaleY(.9)" }, { transform: "translateY(100%) scaleY(1)" }], { duration: 420, easing: "cubic-bezier(.6,0,.9,.6)", fill: "forwards" });
      c.burstPt(192, 236, ["·"], 8, 18);
      await c.moveTo(134, 230, 420, { fly: false, arc: 22 }); c.anim(perch, [{ rotate: "-24deg" }, { rotate: "0deg" }], 600); bird.act("squash", 450); tone(180, 0.15, "triangle", 0.06); c.feathers(3);
      c.say("Uff!", 1000); await c.wait(1300);
      // nur der Kopf schaut noch einmal heraus und wackelt frech
      inner.style.transform = "translateY(100%)";
      await pos(62, 600);
      inner.animate([{ rotate: "-14deg" }, { rotate: "14deg" }, { rotate: "-14deg" }], { duration: 480, iterations: 3 });
      c.face("sad"); await c.wait(1600);
      await pos(100, 350, "ease-in");
      hole.remove(); box.remove(); bird.act("fluff", 900);
      c.face("shy"); c.say(help ? "Danke fürs Helfen. Der Wurm war stärker." : "Hmpf. Dann eben Beeren.", 2400); await c.wait(2500);
      c.face(); await c.home(1400);
    } },
    "23e": { title: "Polarlicht", async run(c) {
      await c.seat("top", 1300);
      const band = (col1, col2, y, amp, id) => { const pts = []; for (let x = 0; x <= 800; x += 40) pts.push(`${x},${(y + Math.sin((x / 800) * Math.PI * 4) * amp).toFixed(1)}`); const d = `M${pts.join(" L")}`;
        return `<svg viewBox="0 0 800 300" preserveAspectRatio="none"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${col1}" stop-opacity="0"/><stop offset=".55" stop-color="${col1}" stop-opacity=".55"/><stop offset=".8" stop-color="${col2}" stop-opacity=".85"/><stop offset="1" stop-color="${col2}" stop-opacity="0"/></linearGradient></defs><path d="${d} L800 ${y - 140} L0 ${y - 140}Z" fill="url(#${id})"/></svg>`; };
      const au = c.sky(`<div class="mk-aurora2"><div class="ab ab1">${band("#3dffa0", "#8bffcf", 150, 22, "au1")}${band("#3dffa0", "#8bffcf", 150, 22, "au1b")}</div><div class="ab ab2">${band("#ff7ad9", "#c9a0ff", 110, 18, "au2")}${band("#ff7ad9", "#c9a0ff", 110, 18, "au2b")}</div></div>`, 0, 0, innerWidth, { cls: "full" });
      c.face("wow"); c.pose("mk-open"); c.say("Ohhh …", 1800); tone(392, 1.2, "sine", 0.05); tone(587, 1.2, "sine", 0.04, null, 0.4);
      c.hint("Tipp in den Himmel – andere Farben!", 6000);
      let hue = 0; const tapSky = (e) => { if (e.target.closest(".lock-pad svg *, .munkel, .lock-clock, .mk-album-btn, .mk-album, .lock-copy")) return; hue = (hue + 70) % 360; au.firstChild.style.filter = `hue-rotate(${hue}deg) blur(3px)`; tone(500 + hue, 0.4, "sine", 0.05); bird.act("mk-tilt", 900); };
      lock.addEventListener("click", tapSky);
      try { await c.wait(3500); c.pose("mk-open", false); c.face("dreamy"); c.say("Das Schönste, was ich je gesehen hab.", 2600); await c.wait(5500); }
      finally { lock.removeEventListener("click", tapSky); }
      au.classList.add("fade"); await c.wait(1400);
      c.face(); await c.home(1300);
    } },
    /* ---------------- 24.11. ---------------- */
    "24m": { title: "Federputz-Show", async run(c) {
      await c.seat("edgeL", 1300);
      c.face("focus"); c.say("Kurz schick machen …", 1700); await c.wait(1500);
      for (let i = 0; i < 4; i++) { bird.classList.add(i % 2 ? "preen-l" : "preen-r"); tone(2400, 0.03, "sine", 0.03); await c.wait(650); bird.classList.remove("preen-l", "preen-r"); if (i === 1) c.feathers(2, 58, 70); await c.wait(250); }
      bird.act("fluff", 900); await c.wait(900);
      c.face("happy"); c.say("Wo ist mein Spiegel …?", 1600); await c.wait(1200);
      // Spiegel hinter dem Schloss hervorholen
      await c.moveTo(70, 60, 700, { keepFlying: true, arc: 16 });
      perch.classList.add("behind"); pad.classList.add("bird-behind");
      await c.moveTo(70, 150, 600, { keepFlying: true, arc: 0 }); await c.wait(700);
      bird.hold(`<g transform="translate(-6 -30) scale(.6)">${ART.mirror.replace(/<\/?svg[^>]*>/g, "")}</g>`);
      await c.moveTo(70, 60, 600, { keepFlying: true, arc: 0 });
      perch.classList.remove("behind"); pad.classList.remove("bird-behind");
      await c.moveTo(SEATS.edgeL[0], SEATS.edgeL[1], 600, { land: "dangle" });
      c.face("happy"); c.say("Spieglein, Spieglein …", 1800); await c.wait(1800);
      c.hint("Tipp den Spiegel an!", 5000);
      const t = await c.waitTap(bird, 4500);
      c.burstAt(bird, ["✨", "✦"], t ? 12 : 6, 30); tone(1568, 0.2, "sine", 0.08);
      c.face("wink"); c.say(t ? "… wer ist der Schönste? Ich. Und du, Ute!" : "*zwinker*", 2600); await c.wait(2700);
      // Spiegel wieder hinter das Schloss legen
      c.face("normal"); await c.moveTo(70, 60, 700, { keepFlying: true, arc: 16 });
      perch.classList.add("behind"); pad.classList.add("bird-behind");
      await c.moveTo(70, 150, 600, { keepFlying: true, arc: 0 }); await c.wait(500); bird.hold("");
      await c.moveTo(70, 60, 600, { keepFlying: true, arc: 0 });
      perch.classList.remove("behind"); pad.classList.remove("bird-behind");
      c.face(); await c.home(1100);
    } },
    "24e": { title: "Mond-Schaukel", async run(c) {
      const orb = lock.querySelector(".sky-orb"); const ob = orb.getBoundingClientRect(), lr = lock.getBoundingClientRect(), pr = pad.getBoundingClientRect();
      const p = moonPhase(), rot = p < 0.5 ? 90 : -90;
      // Schaukel: Seile von oben, Mond als Sitz
      const sw = document.createElement("div"); sw.className = "mk-moon-swing";
      const seatX = pr.left - lr.left + pr.width * 0.5, seatY = pr.top - lr.top + pr.height * 0.12;
      sw.style.left = seatX + "px"; sw.style.height = seatY + "px";
      sw.innerHTML = `<div class="mms-ropes"></div><div class="mms-moon">${moonSVG(p, 88)}</div>`;
      lock.append(sw); c.made.push(sw);
      const moonEl = sw.querySelector(".mms-moon");
      orb.classList.add("away");
      const dx = ob.left + ob.width / 2 - (lr.left + seatX), dy = ob.top + ob.height / 2 - (lr.top + seatY);
      c.face("wow");
      await moonEl.animate([{ translate: `${dx}px ${dy}px`, rotate: "0deg", scale: ".8" }, { translate: "0 0", rotate: `${rot}deg`, scale: "1" }], { duration: 2000, easing: "cubic-bezier(.4,0,.2,1)", fill: "forwards" }).finished;
      sw.classList.add("ropes"); tone(523, 0.4, "sine", 0.05, 784); await c.wait(900);
      c.face("happy"); c.say("Eine Mondschaukel!", 1600);
      // in die Schaukel fliegen
      const sx = ((seatX - (pr.left - lr.left)) / pr.width) * 200, sy = ((seatY - (pr.top - lr.top)) / pr.height) * 240 - 2;
      await c.moveTo(sx, sy, 1200, { land: "tuck" });
      const bw = perch.getBoundingClientRect().width;
      const seat = document.createElement("div"); seat.className = "mms-bird"; seat.style.width = bw + "px"; seat.style.height = bw + "px"; seat.style.left = -bw / 2 + "px"; seat.style.top = seatY - bw * 0.79 + 16 + "px"; moonEl.after(seat); seat.append(bird);
      perch.style.visibility = "hidden";
      c.face("dreamy"); c.hint("Tipp den Mond an – dann schwingt er höher!", 6000);
      let amp = 8; moonEl.classList.add("tappable"); moonEl.addEventListener("click", (e) => { e.stopPropagation(); amp = Math.min(22, amp + 5); tone(880, 0.2, "sine", 0.06); });
      const notes = [784, 659, 698, 587, 659, 523, 587, 494];
      try {
        for (let i = 0; i < 8; i++) { const d = (i % 2 ? -1 : 1) * amp; sw.animate([{ rotate: `${-d}deg` }, { rotate: `${d}deg` }], { duration: 1000, easing: "ease-in-out", fill: "forwards" }); tone(notes[i], 0.5, "triangle", 0.05); await c.wait(1000); if (i === 5) c.face("sleepy"); }
        sw.animate([{ rotate: `${amp}deg` }, { rotate: "0deg" }], { duration: 900, easing: "ease-out", fill: "forwards" }); await c.wait(900);
        c.say("Gute Nacht, Ute …", 2000); await c.wait(1400);
      } finally { perch.append(bird); perch.style.visibility = ""; }
      c.face(); await c.home(1100);
      sw.classList.remove("ropes"); await c.wait(500);
      await moonEl.animate([{ translate: "0 0", rotate: `${rot}deg` }, { translate: `${dx}px ${dy}px`, rotate: "0deg", scale: ".8" }], { duration: 1600, easing: "ease-in-out", fill: "forwards" }).finished;
      orb.classList.remove("away"); sw.remove();
    }, end: () => document.querySelector(".sky-orb")?.classList.remove("away") },
    /* ---------------- 25.11. ---------------- */
    "25m": { title: "Looping-Ausflug", async run(c) {
      c.face("happy"); c.say("Ich dreh eine Runde!", 1700); await c.wait(1500);
      let extra = false; c.hint("Tipp ihn beim Fliegen an – dann macht er zwei Loopings!", 7000);
      bird.onSceneTap = () => { if (!extra) { extra = true; tone(1200, 0.2, "triangle", 0.08, 1800); } };
      const trail = setInterval(() => { const r = perch.getBoundingClientRect(); try { H().burst(r.left + r.width / 2, r.top + r.height / 2, ["·"], 1, 6); } catch (e) {} }, 90);
      try {
        // Abflug nach links, Wende und Anflug von links
        await c.path([[110, 40], [40, 0], [5, 40], [40, 80]], 2600, { linear: false });
        // Looping (Vogel dreht sich mit der Bahn)
        const cx = 120, cyB = 80, R = 46;
        const loopPts = (n) => { const out = []; for (let k = 0; k < n; k++) for (let q = 1; q <= 24; q++) { const a = (q / 24) * Math.PI * 2; out.push([cx + Math.sin(a) * R, cyB - (1 - Math.cos(a)) * R]); } return out; };
        c.face("wow");
        await c.path([[80, 80], ...loopPts(extra ? 2 : 1), [170, 80], [215, 60]], extra ? 4300 : 3000, { orient: true, linear: true });
        c.face("happy");
        await c.path([[200, 40], [170, 60]], 900, {});
        await c.home(800);
        c.anim(perch, [{ translate: "0 0" }, { translate: "10% 0", rotate: "8deg" }, { translate: "0 0", rotate: "0deg" }], 700); tone(250, 0.2, "sawtooth", 0.05, 120);
      } finally { clearInterval(trail); }
      await c.wait(800); perch.getAnimations().forEach((a) => a.cancel());
      c.face("shy"); c.say(extra ? "Zwei Loopings! Mir ist schwindelig." : "Gelandet! Fast elegant.", 2400); await c.wait(2500);
    } },
    "25e": { title: "Lichterkette", async run(c) {
      c.face("wow"); c.say("Ich hab eine Idee – Moment!", 1700); await c.wait(1300);
      await c.fetch(ART.bulbBeak, { side: 1, y: 20 });
      c.face("focus");
      await c.path([[180, 40], [156, 100], [156, 74], [130, 30], [100, 20], [70, 30], [44, 74], [44, 100]], 4200, { easing: "ease-in-out" });
      bird.carry(""); addItem("lichter");
      const lamps = [...pad.querySelectorAll(".mk-lights .lamp")];
      lamps.forEach((b, i) => { b.style.opacity = 0; setTimeout(() => { b.style.opacity = 1; tone(900 + i * 50, 0.06, "sine", 0.05); }, 300 + i * 140); });
      await c.home(1100);
      c.face("wow"); await c.wait(400 + lamps.length * 140); c.face("happy");
      c.hint("Tipp die Lämpchen an – sie wechseln die Farbe!", 6000);
      const pal = ["#ffcf6a", "#ff7a6a", "#7fd6a0", "#7fbfff", "#ffd98a", "#e7a1ff"];
      const lights = pad.querySelector(".mk-lights"); lights.style.pointerEvents = "auto";
      const onTap = (e) => { const g = e.target.closest(".lamp"); if (!g) return; e.stopPropagation(); const b = g.querySelector(".bulb"), h = g.querySelector(".halo"); const n = pal[(pal.indexOf(b.getAttribute("fill")) + 1) % pal.length]; b.setAttribute("fill", n); h.setAttribute("fill", n); tone(1200, 0.06, "sine", 0.06); bird.act("mk-hop", 600); };
      lights.addEventListener("click", onTap);
      try { c.say("Jetzt funkelt unser Schloss!", 2400); await c.wait(5600); }
      finally { lights.removeEventListener("click", onTap); lights.style.pointerEvents = ""; }
    } },
    /* ---------------- 26.11. ---------------- */
    "26m": { title: "Schloss polieren", async run(c) {
      c.face("focus"); c.say("Das Schloss muss glänzen! Ich hol ein Tuch.", 2200); await c.wait(1700);
      await c.fetch(`<g transform="translate(-10 -4) scale(.6)">${ART.cloth.replace(/<\/?svg[^>]*>/g, "")}</g>`, { side: 1, y: 30 });
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
      pad.classList.add("polished"); addItem("glanz");
      await c.fetch("", { side: 1, y: 40, away: 600 }); await c.home(1500);
      c.face("wink"); c.say("Glänzt! So bleibt es jetzt.", 2400); await c.wait(2500); pad.classList.remove("polished");
    } },
    "26e": { title: "Schattenspiel", async run(c) {
      const hasL = st.items.includes("laterne");
      const li = pad.querySelector(".mk-item.lantern-item");
      c.face("wink"); c.say("Rate mal, was das ist …", 1800); await c.wait(1400);
      const lanternBeak = `<g transform="translate(-8 -4) scale(.55)">${ART.lantern.replace(/<\/?svg[^>]*>/g, "")}</g>`;
      if (hasL && li) { await c.moveTo(48, 100, 1100, { keepFlying: true }); li.style.visibility = "hidden"; bird.carry(lanternBeak); }
      else await c.fetch(lanternBeak, { side: 1, y: 60 });
      await c.moveTo(176, 228, 1300, { land: "stand" });
      bird.carry(""); const l = c.prop(ART.lantern, 194, 230, 13, { cls: "lit" });
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
      await c.wait(2300); c.face("wink"); c.say("Das Kapibara kennst du bald persönlich.", 2500); await c.wait(2600);
      // Laterne zurückbringen
      l.remove(); bird.carry(lanternBeak);
      if (hasL && li) { await c.moveTo(48, 100, 1300, { keepFlying: true }); bird.carry(""); li.style.visibility = ""; }
      else { await c.fetch("", { side: 1, y: 60, away: 500 }); }
      c.face(); await c.home(1200);
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
      if (inNest) await c.moveTo(SEATS.nest[0], SEATS.nest[1], 1000, { land: "tuck" }); else await c.home(800);
      c.face("sleepy"); c.say("Ich kann nicht schlafen … zu aufgeregt.", 2400); await c.wait(2500);
      c.face("normal"); c.say("Ich zähl Schäfchen.", 1600); await c.wait(1400);
      c.hint("Tipp ein Schäfchen an – es springt höher!", 6000);
      for (let n = 1; n <= 20; n++) {
        const sh = c.prop(SHEEP(n - 1), -20, 232, 28, { onTap: (d) => { d.classList.add("high"); tone(1000, 0.1, "triangle", 0.06); } });
        const hi = () => (sh.classList.contains("high") ? -18 : 18);
        c.anim(sh, [{ left: "-14%", top: "96.6%" }, { left: "30%", top: "96.6%", offset: 0.35 }, { left: "50%", top: `${hi()}%`, offset: 0.55 }, { left: "70%", top: "96.6%", offset: 0.75 }, { left: "114%", top: "96.6%" }], 2600, { easing: "linear" }).onfinish = () => sh.remove();
        c.say(String(n), 700); tone(500 + n * 18, 0.08, "triangle", 0.05);
        c.face(n > 16 ? "sleep" : n > 10 ? "sleepy" : "normal");
        await c.wait(820);
      }
      c.face("sleep"); c.say("Zwanzig … zzz …", 1800); await c.wait(3000);
    }, end: (c) => c.face() },
  };

  /* ---------- Abspielen ---------- */
  const sleepTime = (d = new Date()) => d.getHours() >= 21 || d.getHours() < 6;
  let sleeping = false, zzz = null;
  function goSleep() {
    if (!bird || stage) return;
    sleeping = true; bird.busy = true;
    if (st.items.includes("nest")) { place(perch, SEATS.nest[0], SEATS.nest[1]); bird.legs("tuck"); } else { place(perch, HOME[0], HOME[1]); bird.legs("dangle"); }
    bird.classList.remove("swaying"); bird.face("sleep");
    zzz?.remove(); zzz = document.createElement("div"); zzz.className = "mk-prop mk-zzz"; zzz.innerHTML = "<span>z</span><span>Z</span><span>z</span>"; place(zzz, 176, 50); zzz.style.width = "13%"; pad.append(zzz);
    bird.onSceneTap = () => { bird.face("sleepy"); bird.say("Zzz … psst, ich schlafe. Morgen früh geht's weiter!", 2200); setTimeout(() => sleeping && bird.face("sleep"), 1600); };
  }
  function wakeQuiet() { sleeping = false; zzz?.remove(); zzz = null; bird.onSceneTap = null; bird.busy = false; bird.classList.add("swaying"); bird.face(); restHome(); }
  async function play(id, { auto } = {}) {
    if (!SCENES[id] || !bird) return;
    if (stage) stage.cleanup();
    const wasAsleep = sleeping; if (sleeping) { sleeping = false; zzz?.remove(); zzz = null; }
    const c = makeCtx(); stage = c; bird.busy = true; lock.classList.add("scene-on");
    try {
      await c.wait(auto ? 1200 : 200);
      // morgens: aus dem Schlaf aufwachen, bevor die Szene beginnt
      if (id.endsWith("m") && id !== "14m" && (wasAsleep || (auto && new Date().getHours() < 11))) {
        if (st.items.includes("nest")) { c.jump(SEATS.nest[0], SEATS.nest[1]); c.legsNow = "tuck"; }
        c.face("sleep"); await c.wait(1300); c.face("wow"); tone(900, 0.1, "triangle", 0.06); await c.wait(500);
        c.face("sleepy"); bird.classList.add("wings-up"); c.pose("mk-open"); await c.wait(900); bird.classList.remove("wings-up"); c.pose("mk-open", false);
        c.face(); if (st.items.includes("nest")) await c.home(900); else { c.legsNow = "dangle"; }
      }
      await SCENES[id].run(c);
    }
    catch (e) { if (e && e.message !== "abgebrochen") console.error("Munkel-Szene " + id + ":", e); }
    finally {
      if (stage === c) {
        if (SCENES[id].end) SCENES[id].end(c);
        c.cleanup(); stage = null; bird.busy = false; lock.classList.remove("scene-on");
        if (!st.seen[id]) { st.seen[id] = Date.now(); save(); }
        renderItems(); updateAlbumBtn();
        if (id.endsWith("e")) {
          if (sleepTime()) setTimeout(goSleep, 300);
          else setTimeout(() => { if (!stage) { bird.face("sleepy"); bird.say("Boah, bin ich müde … ich geh gleich ins Bett.", 3000); setTimeout(() => !stage && !sleeping && bird.face(), 3200); } }, 500);
        }
      }
    }
  }

  /* ---------- Szenen-Album ---------- */
  let albumBtn;
  function updateAlbumBtn() { if (albumBtn) albumBtn.querySelector("b").textContent = `${Object.keys(st.seen).length} / 28`; }
  function openAlbum() {
    if (document.querySelector(".mk-album")) return;
    const now = currentSlot(), nowOrder = now ? slotOrder(now) : -1;
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
    restHome();
    sky(); setInterval(sky, 60000);
    renderItems();
    albumBtn = document.createElement("button"); albumBtn.className = "mk-album-btn";
    albumBtn.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5C4 4.7 4.7 4 5.5 4H11v15H5.5A1.5 1.5 0 0 1 4 17.5z M20 5.5c0-.8-.7-1.5-1.5-1.5H13v15h5.5c.8 0 1.5-.7 1.5-1.5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg><span>Munkels Szenen</span><b></b>`;
    albumBtn.addEventListener("click", (e) => { e.stopPropagation(); openAlbum(); });
    lock.append(albumBtn); requestAnimationFrame(() => lock.querySelector(".lock-clock")?.after(albumBtn)); updateAlbumBtn();
    // die Szene des aktuellen Tagesabschnitts einmal von selbst abspielen
    let last = currentSlot();
    if (last && !st.seen[last]) { if (sleepTime() && last.endsWith("m")) goSleep(); setTimeout(() => play(last, { auto: true }), 2600); }
    else if (sleepTime()) goSleep();
    setInterval(() => {
      const s = currentSlot();
      if (s !== last) { last = s; if (s && !st.seen[s] && !stage) { play(s, { auto: true }); return; } }
      if (!stage && sleepTime() && !sleeping) goSleep();
      if (!stage && !sleepTime() && sleeping) wakeQuiet();
    }, 30000);
  }
  return { attach, play, openAlbum, currentSlot, SCENES, HATS, ART, moonPhase, moonSVG, state: () => st, goSleep };
})();
