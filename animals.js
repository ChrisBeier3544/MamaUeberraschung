/* =========================================================
   Animals – selbst gezeichnete, animierte SVG-Tiere,
   100 Varianten, Tierparade und das große Gehege
   ========================================================= */
const Animals = (() => {
  const f = (n) => Math.round(n * 10) / 10;
  const E = (cx, cy, rx, ry, fill, x = "") => `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}" ${x}/>`;
  const C = (cx, cy, r, fill, x = "") => `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${fill}" ${x}/>`;
  const RC = (x, y, w, h, r, fill, ex = "") => `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${f(r)}" fill="${fill}" ${ex}/>`;
  const P = (d, fill, ex = "") => `<path d="${d}" fill="${fill}" ${ex}/>`;
  const S = (d, stroke, w, ex = "") => `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${f(w)}" stroke-linecap="round" stroke-linejoin="round" ${ex}/>`;
  const eye = (x, y, r = 2.6) => C(x, y, r, "#2b1a10") + C(x + r * 0.35, y - r * 0.4, r * 0.4, "#fff");
  const blush = (x, y, rx = 4, ry = 2.5) => E(x, y, rx, ry, "#ff8fa3", 'opacity=".45"');
  const leg = (x, top, bot, w, fill, cls) => `<rect class="${cls}" x="${f(x - w / 2)}" y="${top}" width="${w}" height="${bot - top}" rx="${f(w / 2)}" fill="${fill}"/>`;

  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    const c = (v) => Math.max(0, Math.min(255, v + amt));
    return "#" + [c(n >> 16), c((n >> 8) & 255), c(n & 255)].map((v) => v.toString(16).padStart(2, "0")).join("");
  }
  // xs: [hinten-fern, hinten-nah, vorn-fern, vorn-nah] – diagonaler Gang
  const legs4 = (xs, top, bot, w, col) => {
    const far = shade(col, -22);
    return leg(xs[0], top, bot, w, far, "la") + leg(xs[2], top, bot, w, far, "lb") + leg(xs[1], top, bot, w, col, "lb") + leg(xs[3], top, bot, w, col, "la");
  };

  // Igel-Stacheln (einmal vorberechnet)
  const SPIKES = (() => {
    const pts = []; const N = 18, cx = 46, cy = 52, rx = 34, ry = 24;
    for (let k = 0; k <= N; k++) {
      const t = Math.PI * (0.97 - (k / N) * 0.94), s = k % 2 ? 1.3 : 1;
      pts.push(f(cx + rx * s * Math.cos(t)) + "," + f(cy - ry * s * Math.sin(t)));
    }
    pts.push(`${cx + rx},${cy + 8}`, `${cx - rx},${cy + 8}`);
    return pts.join(" ");
  })();
  const WOOL = (cx, cy, rx, ry, col) => {
    let s = E(cx, cy, rx, ry, col);
    for (let k = 0; k < 12; k++) { const a = (Math.PI * 2 * k) / 12; s += C(cx + Math.cos(a) * rx * 0.85, cy + Math.sin(a) * ry * 0.85, 9, col); }
    return s;
  };

  /* ---------- Die Tierarten ---------- */
  const SPECIES = {
    capy: {
      name: "Kapibara", plural: "Kapibaras", W: 120, H: 90, scale: 1.05, speed: 34,
      colors: [{ n: "braun", main: "#a8714a", dark: "#7d4f33", snout: "#6b4029" }, { n: "karamell", main: "#c99566", dark: "#9c6b45", snout: "#7d5236" }, { n: "gold", main: "#e2b04a", dark: "#b8862a", snout: "#94691b" }],
      draw: (c) => ({
        legs: legs4([30, 40, 76, 86], 62, 88, 9, c.dark),
        body: E(58, 58, 42, 25, c.main) + E(64, 46, 30, 9, "#fff", 'opacity=".09"') +
          RC(78, 32, 38, 36, 16, c.main) + E(86, 33, 6, 5, c.dark) + E(86, 34, 3, 2.5, "#d99b7a") +
          RC(102, 40, 15, 26, 10, c.snout) + E(112, 47, 1.6, 2.4, "#2b1a10") + eye(95, 46, 2.8) +
          S("M104 60 q4 3 9 0", "#2b1a10", 1.6) + blush(95, 58),
        a: { top: [94, 33], hr: 16, neck: [82, 64], ear: [86, 30], eye: [95, 46] },
      }),
    },
    waschbaer: {
      name: "Waschbär", plural: "Waschbären", W: 120, H: 90, scale: 0.95, speed: 46,
      colors: [{ n: "grau", main: "#8e8e96", belly: "#dcdce1", dark: "#3d3d45" }, { n: "silber", main: "#b4b4bc", belly: "#efeff3", dark: "#55555e" }],
      draw: (c) => ({
        legs: legs4([34, 44, 70, 80], 66, 88, 7, c.dark),
        body: `<g class="tl">` + S("M32 60 Q12 56 8 36", c.main, 12) + S("M32 60 Q12 56 8 36", c.dark, 12, 'stroke-dasharray="5 5" stroke-linecap="butt"') + `</g>` +
          E(57, 62, 30, 19, c.main) + E(60, 70, 20, 8, c.belly) +
          P("M80 44 L84 30 L92 40 Z", c.dark) + P("M83 41 L85 34 L89 40 Z", c.belly) +
          E(92, 52, 17, 15, c.main) + E(97, 58, 11, 7, c.belly) + E(96, 49, 13, 5.5, c.dark) +
          P("M104 51 Q120 56 104 62 Z", c.belly) + C(116, 56, 2.4, "#222") + C(98, 49, 2.6, "#fff") + eye(98, 49, 2) + blush(98, 60, 3.5, 2),
        a: { top: [90, 38], hr: 15, neck: [80, 64], ear: [86, 36], eye: [98, 49] },
      }),
    },
    katze: {
      name: "Katze", plural: "Katzen", W: 110, H: 85, scale: 0.9, speed: 44,
      colors: [
        { n: "rot getigert", main: "#e9a24f", belly: "#f6dcb7", dark: "#c46d24", tabby: 1 },
        { n: "schwarz", main: "#3b3638", belly: "#5a5355", dark: "#1f1b1c" },
        { n: "weiß", main: "#f5f1ec", belly: "#ffffff", dark: "#d4c9bd" },
        { n: "grau getigert", main: "#a2a5ad", belly: "#d6d8dc", dark: "#6d7078", tabby: 1 },
        { n: "dreifarbig", main: "#f5f1ec", belly: "#ffffff", dark: "#d4c9bd", calico: 1 },
      ],
      draw: (c) => ({
        legs: legs4([34, 41, 66, 73], 66, 83, 6, c.main),
        body: `<g class="tl">` + S("M30 62 Q8 58 12 34", c.main, 5) + `</g>` +
          E(52, 64, 25, 15, c.main) + E(55, 70, 16, 7, c.belly) +
          (c.tabby ? S("M44 51 l3 7 M52 50 l2 8 M60 51 l1 7", c.dark, 2.2) : "") +
          (c.calico ? E(46, 60, 10, 7, "#e9a24f") + E(62, 58, 7, 6, "#3b3638") : "") +
          P("M72 47 L74 30 L84 40 Z", c.main) + P("M75 43 L76 35 L81 40 Z", "#f4a6b5") +
          P("M84 40 L94 30 L96 47 Z", c.main) + P("M87 40 L93 34 L94 43 Z", "#f4a6b5") +
          E(84, 52, 15, 13, c.main) + (c.calico ? E(80, 46, 7, 6, "#e9a24f") : "") +
          E(92, 57, 6, 4, c.belly) + P("M95 53 l3 0 l-1.5 2 z", "#f07c95") +
          S("M96 57 l8 -1 M96 59 l8 2", c.dark === "#1f1b1c" ? "#8a8285" : "#8a6a55", 0.8) +
          E(88, 50, 2.4, 3, "#4a8a4a") + E(88.5, 50, 1, 2.4, "#1a1a1a") + C(89, 48.6, 0.7, "#fff") + blush(87, 58, 3, 2),
        a: { top: [84, 39], hr: 14, neck: [72, 63], ear: [92, 34], eye: [88, 50] },
      }),
    },
    hund: {
      name: "Hund", plural: "Hunde", W: 115, H: 88, scale: 0.95, speed: 52,
      colors: [
        { n: "golden", main: "#dca75e", belly: "#f2d6a6", snout: "#f2d6a6", ear: "#b9823d" },
        { n: "schoko", main: "#6b4029", belly: "#8a5a3b", snout: "#8a5a3b", ear: "#4e2d1b" },
        { n: "Dalmatiner", main: "#fafafa", belly: "#ffffff", snout: "#ffffff", ear: "#2b2b2b", spots: 1 },
        { n: "Mops-beige", main: "#e3c79d", belly: "#f0dcbc", snout: "#3a2c25", ear: "#3a2c25" },
      ],
      draw: (c) => ({
        legs: legs4([34, 42, 68, 76], 64, 86, 8, c.main),
        body: `<g class="tl">` + S("M30 56 Q20 48 22 36", c.main, 6) + `</g>` +
          E(54, 60, 28, 17, c.main) + E(56, 68, 18, 7, c.belly) +
          (c.spots ? C(42, 56, 3.5, "#2b2b2b") + C(56, 52, 2.6, "#2b2b2b") + C(64, 62, 3, "#2b2b2b") + C(48, 66, 2.2, "#2b2b2b") + C(70, 54, 2.2, "#2b2b2b") : "") +
          E(86, 46, 15, 14, c.main) + E(100, 52, 10, 7, c.snout) + C(109, 49, 3, "#2b1a10") +
          S("M100 57 q3 2 6 0", "#2b1a10", 1.2) + P("M78 36 Q68 42 72 60 Q81 60 83 40 Z", c.ear) +
          eye(89, 43, 2.6) + blush(92, 52, 3.5, 2),
        a: { top: [86, 32], hr: 15, neck: [74, 58], ear: [80, 36], eye: [89, 43] },
      }),
    },
    giraffe: {
      name: "Giraffe", plural: "Giraffen", W: 120, H: 150, scale: 1.05, speed: 40,
      colors: [{ n: "klassisch", main: "#f2c46b", dark: "#b8742a", snout: "#f7dfae" }, { n: "hell", main: "#f6dca4", dark: "#d29b55", snout: "#fbeed2" }],
      draw: (c) => ({
        legs: legs4([32, 40, 62, 70], 96, 148, 7, c.main),
        body: `<g class="tl">` + S("M22 84 Q15 98 18 112", c.main, 2.5) + C(18, 114, 3.4, c.dark) + `</g>` +
          E(48, 88, 28, 17, c.main) + P("M56 80 L70 86 L100 32 L88 24 Z", c.main) +
          E(38, 84, 6, 5, c.dark) + E(52, 82, 5, 4, c.dark) + E(46, 95, 5, 4, c.dark) + E(62, 92, 4, 4, c.dark) + E(28, 92, 4, 4, c.dark) +
          E(72, 70, 4, 3.5, c.dark) + E(80, 56, 3.6, 3, c.dark) + E(87, 42, 3, 2.6, c.dark) + S("M64 78 L92 28", c.dark, 3, 'opacity=".5"') +
          S("M93 18 L91 8", c.dark, 2.6) + S("M99 17 L99 7", c.dark, 2.6) + C(91, 7, 2.6, c.dark) + C(99, 6, 2.6, c.dark) +
          E(88, 20, 6, 2.6, c.main, 'transform="rotate(-20 88 20)"') +
          E(100, 25, 14, 9, c.main) + E(110, 29, 6.5, 5.5, c.snout) + C(113, 27, 1.2, "#2b1a10") + eye(100, 22, 2.3) + blush(101, 30, 3, 2),
        a: { top: [96, 16], hr: 11, neck: [80, 56], ear: [89, 19], eye: [100, 22] },
      }),
    },
    fuchs: {
      name: "Fuchs", plural: "Füchse", W: 120, H: 88, scale: 0.95, speed: 54,
      colors: [{ n: "rot", main: "#e9823a", belly: "#fff5ea", dark: "#4a2b1f" }, { n: "Polarfuchs", main: "#eef0f5", belly: "#ffffff", dark: "#8a8b96" }, { n: "silber", main: "#7d7f88", belly: "#e6e6ea", dark: "#2d2d33" }],
      draw: (c) => ({
        legs: legs4([36, 44, 68, 76], 64, 86, 6, c.dark),
        body: `<g class="tl">` + S("M34 58 Q12 62 6 42", c.main, 13) + C(6, 41, 6.4, "#fff") + `</g>` +
          E(56, 62, 28, 15, c.main) + E(60, 68, 18, 6, c.belly) +
          P("M77 45 L79 26 L88 38 Z", c.main) + P("M79 34 L79 27 L83 32 Z", c.dark) +
          P("M86 39 L96 27 L97 45 Z", c.main) + P("M92 31 L96 28 L96 34 Z", c.dark) +
          E(88, 50, 14, 12, c.main) + E(94, 56, 9, 6, c.belly) + P("M96 49 Q118 54 98 60 Z", c.belly) + C(113, 54, 2.4, "#2b1a10") +
          eye(92, 47, 2.3) + blush(92, 56, 3, 2),
        a: { top: [88, 37], hr: 13, neck: [76, 60], ear: [91, 33], eye: [92, 47] },
      }),
    },
    panda_rot: {
      name: "Roter Panda", plural: "Rote Pandas", W: 120, H: 88, scale: 0.9, speed: 42,
      colors: [{ n: "klassisch", main: "#c4512a", ring: "#e9915f", dark: "#3b1f17" }],
      draw: (c) => ({
        legs: legs4([34, 44, 70, 80], 66, 86, 7, c.dark),
        body: `<g class="tl">` + S("M32 60 Q12 56 8 36", c.main, 12) + S("M32 60 Q12 56 8 36", c.ring, 12, 'stroke-dasharray="5 6" stroke-linecap="butt"') + `</g>` +
          E(57, 62, 30, 18, c.main) + E(60, 72, 22, 7, c.dark) +
          P("M80 44 L83 30 L92 40 Z", "#fff") + P("M82 41 L84 34 L89 40 Z", c.dark) +
          E(92, 52, 17, 15, c.main) + E(100, 58, 9, 6, "#fff") + E(93, 56, 5, 4, "#fff") + E(96, 44, 4, 2.4, "#fff") +
          P("M104 53 Q116 57 104 62 Z", "#fff") + C(114, 57, 2.4, "#222") + eye(97, 49, 2.5) + S("M97 52 L95 62", c.dark, 2, 'opacity=".55"'),
        a: { top: [90, 38], hr: 15, neck: [80, 64], ear: [86, 36], eye: [97, 49] },
      }),
    },
    pinguin: {
      name: "Pinguin", plural: "Pinguine", W: 80, H: 100, scale: 0.85, speed: 30,
      colors: [{ n: "klassisch", main: "#2e3440", beak: "#f39c32" }, { n: "Kaiserpinguin", main: "#34404f", beak: "#f39c32", patch: 1 }],
      draw: (c) => ({
        legs: E(32, 96, 8, 3.5, c.beak, 'class="la"') + E(48, 96, 8, 3.5, c.beak, 'class="lb"'),
        body: E(40, 60, 24, 36, c.main) + E(45, 64, 16, 28, "#fff") + (c.patch ? E(53, 46, 5, 8, "#f6c544", 'opacity=".9"') : "") +
          `<g class="fl">` + E(25, 62, 6, 17, shade(c.main, -10), 'transform="rotate(12 25 62)"') + `</g>` +
          C(48, 36, 4.2, "#fff") + eye(49, 36, 2.4) + P("M58 38 L70 42 L58 46 Z", c.beak) + blush(52, 46, 3, 2),
        a: { top: [40, 25], hr: 17, neck: [44, 52], ear: [34, 30], eye: [49, 36] },
      }),
    },
    igel: {
      name: "Igel", plural: "Igel", W: 100, H: 72, scale: 0.85, speed: 26,
      colors: [{ n: "braun", spikes: "#7a5a3c", face: "#ecd0a6", nose: "#2b1a10" }, { n: "hell", spikes: "#cdb79c", face: "#fbeee0", nose: "#f08ea0" }],
      draw: (c) => ({
        legs: legs4([30, 38, 62, 70], 58, 70, 5, shade(c.face, -60)),
        body: `<polygon points="${SPIKES}" fill="${c.spikes}"/>` + E(46, 54, 32, 15, shade(c.spikes, 15)) +
          P("M66 42 Q96 50 92 58 Q80 66 64 60 Z", c.face) + C(92, 55, 2.6, c.nose) + C(72, 44, 3.2, shade(c.face, -30)) + eye(80, 50, 2.2) + blush(80, 57, 3, 2),
        a: { top: [72, 38], hr: 10, neck: [68, 60], ear: [72, 42], eye: [80, 50] },
      }),
    },
    hase: {
      name: "Hase", plural: "Hasen", W: 100, H: 90, scale: 0.85, speed: 48,
      colors: [{ n: "weiß", main: "#f7f4f0", belly: "#ffffff" }, { n: "braun", main: "#b08463", belly: "#e2c9b0" }, { n: "grau", main: "#9b9aa3", belly: "#d9d8de" }],
      draw: (c) => ({
        legs: E(38, 85, 12, 4, shade(c.main, -18), 'class="la"') + leg(68, 72, 88, 6, shade(c.main, -10), "lb"),
        body: `<g class="tl">` + C(26, 62, 7, "#fff") + `</g>` + E(50, 66, 24, 18, c.main) + E(56, 72, 13, 9, c.belly) +
          E(70, 26, 4.5, 15, c.main, 'transform="rotate(-12 70 26)"') + E(70, 26, 2, 11, "#f4a6b5", 'transform="rotate(-12 70 26)"') +
          E(80, 25, 4.5, 15, c.main, 'transform="rotate(10 80 25)"') + E(80, 25, 2, 11, "#f4a6b5", 'transform="rotate(10 80 25)"') +
          E(76, 50, 13, 12, c.main) + eye(80, 47, 2.4) + C(88, 52, 2, "#f07c95") + S("M86 55 q2 2 4 0", "#8a6a55", 1) + blush(80, 56, 3, 2),
        a: { top: [75, 39], hr: 12, neck: [66, 60], ear: [82, 14], eye: [80, 47] },
      }),
    },
    schaf: {
      name: "Schaf", plural: "Schafe", W: 115, H: 88, scale: 0.95, speed: 32,
      colors: [{ n: "weiß", wool: "#f6f4ef", face: "#3a3330" }, { n: "schwarz", wool: "#46403f", face: "#1f1b1c" }, { n: "creme", wool: "#efe1c6", face: "#6b5444" }],
      draw: (c) => ({
        legs: legs4([36, 44, 68, 76], 66, 86, 5, c.face),
        body: WOOL(54, 58, 28, 17, c.wool) + E(84, 50, 6, 3, c.face, 'transform="rotate(-25 84 50)"') +
          E(92, 56, 10, 13, c.face) + C(90, 44, 6.5, c.wool) + C(96, 45, 4.5, c.wool) + eye(95, 53, 2) + blush(96, 61, 2.5, 1.6),
        a: { top: [91, 40], hr: 11, neck: [82, 67], ear: [84, 47], eye: [95, 53] },
      }),
    },
    schwein: {
      name: "Schwein", plural: "Schweine", W: 110, H: 85, scale: 0.9, speed: 36,
      colors: [{ n: "rosa", main: "#f6b6c1", snout: "#f39aab", dark: "#e58598" }, { n: "gefleckt", main: "#f6c9cf", snout: "#f0a8b4", dark: "#e58598", spots: 1 }],
      draw: (c) => ({
        legs: legs4([34, 42, 64, 72], 66, 83, 7, c.main),
        body: `<g class="tl">` + S("M28 58 q-7 -3 -3 -8 q4 -3 3 3", c.dark, 2) + `</g>` +
          E(52, 62, 26, 19, c.main) + (c.spots ? E(44, 56, 7, 5, "#4a4244") + E(60, 66, 6, 4, "#4a4244") : "") +
          P("M76 46 L78 32 L88 42 Z", c.dark) + E(84, 56, 15, 14, c.main) + E(98, 60, 6, 7, c.snout) +
          E(97, 58, 1.2, 1.8, "#a5475d") + E(100, 62, 1.2, 1.8, "#a5475d") + eye(88, 51, 2.2) + blush(87, 61, 3.5, 2.2),
        a: { top: [84, 42], hr: 14, neck: [72, 66], ear: [81, 37], eye: [88, 51] },
      }),
    },
    elefant: {
      name: "Elefant", plural: "Elefanten", W: 130, H: 105, scale: 1.05, speed: 30,
      colors: [{ n: "grau", main: "#a7adba", ear: "#959bab" }, { n: "rosa", main: "#f3b8c8", ear: "#e89fb4" }],
      draw: (c) => ({
        legs: legs4([34, 48, 76, 90], 70, 103, 14, c.main),
        body: `<g class="tl">` + S("M24 54 Q18 62 20 72", shade(c.main, -40), 2) + `</g>` +
          E(58, 60, 36, 28, c.main) + C(98, 48, 20, c.main) + E(88, 52, 13, 18, c.ear) +
          S("M112 54 Q123 70 116 88", c.main, 9) + S("M106 62 Q112 70 118 66", "#fffaf0", 3) + eye(104, 42, 2.4) + blush(106, 52, 3.5, 2.2),
        a: { top: [98, 28], hr: 20, neck: [82, 70], ear: [88, 40], eye: [104, 42] },
      }),
    },
    otter: {
      name: "Otter", plural: "Otter", W: 120, H: 76, scale: 0.9, speed: 44,
      colors: [{ n: "braun", main: "#8b5e3c", belly: "#d9b48f" }, { n: "dunkel", main: "#5a3d2b", belly: "#b38d6a" }],
      draw: (c) => ({
        legs: legs4([34, 42, 74, 82], 64, 74, 6, shade(c.main, -10)),
        body: `<g class="tl">` + P("M30 62 Q10 64 2 70 Q14 72 32 70 Z", c.main) + `</g>` +
          E(56, 60, 32, 13, c.main) + E(62, 66, 22, 6, c.belly) + C(88, 43, 3, c.main) +
          E(94, 52, 12, 11, c.main) + E(102, 56, 7, 5, c.belly) + E(108, 53, 2.4, 1.8, "#2b1a10") +
          S("M104 57 l8 -1 M104 59 l8 2", "#6b4a35", 0.7) + eye(97, 50, 2.2) + blush(98, 58, 2.6, 1.6),
        a: { top: [93, 41], hr: 12, neck: [84, 60], ear: [88, 42], eye: [97, 50] },
      }),
    },
    ente: {
      name: "Ente", plural: "Enten", W: 90, H: 85, scale: 0.8, speed: 32,
      colors: [{ n: "gelb", main: "#ffd84d", wing: "#f3c22a", head: "#ffd84d" }, { n: "weiß", main: "#fafafa", wing: "#e9e9e9", head: "#fafafa" }, { n: "Stockente", main: "#b9a184", wing: "#8a7560", head: "#2f7d4f", ring: 1 }],
      draw: (c) => ({
        legs: `<g class="la">` + RC(39, 68, 3, 13, 1.5, "#f39c32") + E(43, 82, 6, 2.5, "#f39c32") + `</g><g class="lb">` + RC(48, 68, 3, 13, 1.5, "#e8892a") + E(52, 82, 6, 2.5, "#e8892a") + `</g>`,
        body: P("M18 56 L32 50 L32 66 Z", c.main) + E(44, 62, 26, 17, c.main) + E(40, 60, 14, 9, c.wing) +
          C(66, 38, 13, c.head) + (c.ring ? S("M58 49 Q66 53 74 48", "#fff", 2.4) : "") +
          E(80, 42, 8, 4, "#f39c32") + eye(70, 35, 2.2) + blush(70, 44, 3, 2),
        a: { top: [66, 26], hr: 13, neck: [62, 51], ear: [60, 30], eye: [70, 35] },
      }),
    },
    baer: {
      name: "Bär", plural: "Bären", W: 120, H: 92, scale: 1, speed: 38,
      colors: [
        { n: "braun", main: "#8b5a3c", snout: "#c49a74", legs: "#7a4d32", ear: "#c49a74" },
        { n: "Eisbär", main: "#f4f1ea", snout: "#ffffff", legs: "#e6e1d6", ear: "#e0d9cb" },
        { n: "Pandabär", main: "#f7f7f5", snout: "#ffffff", legs: "#2b2b2e", ear: "#2b2b2e", panda: 1 },
        { n: "Schwarzbär", main: "#2f2a2a", snout: "#a88b70", legs: "#241f1f", ear: "#4a4242" },
      ],
      draw: (c) => ({
        legs: legs4([34, 46, 70, 82], 64, 90, 11, c.legs),
        body: C(24, 54, 5, c.main) + E(56, 58, 34, 24, c.main) + (c.panda ? P("M64 36 Q80 40 82 60 L70 70 Q62 52 52 40 Z", "#2b2b2e") : "") +
          C(84, 30, 6.5, c.ear) + C(94, 44, 17, c.main) + C(84, 30, 3, c.panda ? "#555" : shade(c.snout, -20)) +
          E(106, 50, 9, 7, c.snout) + E(112, 46.5, 3, 2.4, "#2b1a10") + S("M106 55 q3 2 6 -0.5", "#2b1a10", 1.2) +
          (c.panda ? E(98, 41, 5, 4, "#2b2b2e", 'transform="rotate(-25 98 41)"') + C(98.6, 40.2, 1.7, "#fff") + C(99, 39.6, 0.7, "#2b1a10") : eye(98, 40, 2.4)) + blush(100, 52, 3.5, 2),
        a: { top: [94, 27], hr: 17, neck: [80, 60], ear: [84, 28], eye: [98, 40] },
      }),
    },
  };

  /* ---------- Accessoires ---------- */
  const ACC_NAME = { muetze: "mit Weihnachtsmütze", schal: "mit Schal", schleife: "mit Schleife", brille: "mit Brille", krone: "mit Krone", geweih: "mit Rentiergeweih", blume: "mit Blume", fliege: "mit Fliege", orange: "mit Mandarine auf dem Kopf" };
  const ACCS = ["", "muetze", "schal", "schleife", "brille", "krone", "geweih", "blume", "fliege"];
  const ACC_COLORS = ["#e85d75", "#3f9e6e", "#4f7fe0", "#f39c32", "#9b5fd0"];

  function acc(type, a, col = "#e85d75") {
    if (!type) return "";
    const s = a.hr / 15;
    const [tx, ty] = a.top, [ex, ey] = a.eye, [nx, ny] = a.neck, [kx, ky] = a.ear;
    const X = (d) => f(tx + d * s), Y = (d) => f(ty + d * s);
    switch (type) {
      case "muetze":
        return P(`M${X(-11)} ${Y(3)} L${X(11)} ${Y(3)} Q${X(2)} ${Y(-12)} ${X(-15)} ${Y(-19)} Z`, "#d93a4a") + RC(tx - 12 * s, ty - 1 * s, 24 * s, 6 * s, 3 * s, "#fff") + C(tx - 15 * s, ty - 19 * s, 3.6 * s, "#fff");
      case "krone":
        return `<polygon points="${X(-9)},${Y(2)} ${X(-9)},${Y(-7)} ${X(-4.5)},${Y(-2)} ${X(0)},${Y(-10)} ${X(4.5)},${Y(-2)} ${X(9)},${Y(-7)} ${X(9)},${Y(2)}" fill="#f6c544" stroke="#d49b16" stroke-width="${f(s)}" stroke-linejoin="round"/>` + C(tx, ty - 10 * s, 1.7 * s, "#e85d75") + C(tx - 9 * s, ty - 7 * s, 1.3 * s, "#4f7fe0") + C(tx + 9 * s, ty - 7 * s, 1.3 * s, "#4f7fe0");
      case "geweih":
        return S(`M${X(-3)} ${Y(2)} Q${X(-6)} ${Y(-8)} ${X(-12)} ${Y(-15)} M${X(-6)} ${Y(-6)} L${X(-13)} ${Y(-6)} M${X(-9)} ${Y(-11)} L${X(-8)} ${Y(-18)}`, "#8a5a3b", 2.4 * s) +
          S(`M${X(3)} ${Y(2)} Q${X(6)} ${Y(-8)} ${X(12)} ${Y(-15)} M${X(6)} ${Y(-6)} L${X(13)} ${Y(-6)} M${X(9)} ${Y(-11)} L${X(8)} ${Y(-18)}`, "#9c6b45", 2.4 * s);
      case "schleife":
        return P(`M${f(kx)} ${f(ky)} L${f(kx - 7 * s)} ${f(ky - 5 * s)} L${f(kx - 7 * s)} ${f(ky + 5 * s)} Z M${f(kx)} ${f(ky)} L${f(kx + 7 * s)} ${f(ky - 5 * s)} L${f(kx + 7 * s)} ${f(ky + 5 * s)} Z`, col) + C(kx, ky, 2.2 * s, shade(col, -40));
      case "blume": {
        let o = "";
        for (let k = 0; k < 5; k++) { const an = (Math.PI * 2 * k) / 5; o += C(kx + Math.cos(an) * 3.4 * s, ky + Math.sin(an) * 3.4 * s, 2.8 * s, col); }
        return o + C(kx, ky, 2.4 * s, "#ffd84d");
      }
      case "brille":
        return `<circle cx="${f(ex)}" cy="${f(ey)}" r="${f(4.8 * s)}" fill="rgba(255,255,255,.25)" stroke="#2b2b2b" stroke-width="${f(1.4 * s)}"/>` + S(`M${f(ex - 4.8 * s)} ${f(ey - 1 * s)} L${f(ex - 13 * s)} ${f(ey - 3 * s)}`, "#2b2b2b", 1.2 * s);
      case "schal":
        return RC(nx - 6 * s, ny - 1 * s, 6 * s, 16 * s, 3 * s, shade(col, -25)) + RC(nx - 11 * s, ny - 5 * s, 22 * s, 8 * s, 4 * s, col) + RC(nx - 9 * s, ny - 2.5 * s, 18 * s, 1.8 * s, 1, "#fff", 'opacity=".55"') + RC(nx - 6 * s, ny + 11 * s, 6 * s, 2 * s, 1, "#fff", 'opacity=".6"');
      case "fliege":
        return P(`M${f(nx)} ${f(ny)} L${f(nx - 6 * s)} ${f(ny - 4 * s)} L${f(nx - 6 * s)} ${f(ny + 4 * s)} Z M${f(nx)} ${f(ny)} L${f(nx + 6 * s)} ${f(ny - 4 * s)} L${f(nx + 6 * s)} ${f(ny + 4 * s)} Z`, col) + C(nx, ny, 1.8 * s, shade(col, -40));
      case "orange":
        return C(tx, ty - 6 * s, 7.5 * s, "#ff9f1c") + C(tx - 2.5 * s, ty - 8.5 * s, 2 * s, "#ffc46b") + P(`M${X(0)} ${Y(-13)} q${f(4 * s)} ${f(-5 * s)} ${f(8 * s)} ${f(-1 * s)} q${f(-4 * s)} ${f(2 * s)} ${f(-8 * s)} ${f(1 * s)}z`, "#4caf50");
    }
    return "";
  }

  /* ---------- 100 Varianten ---------- */
  const QUOTA = { capy: 9, waschbaer: 7, katze: 8, hund: 8, giraffe: 5, fuchs: 6, panda_rot: 5, pinguin: 6, igel: 5, hase: 6, schaf: 6, schwein: 5, elefant: 5, otter: 6, ente: 6, baer: 7 };
  const NAMES = ("Kalle Mimi Rocky Bello Frieda Paul Luna Oskar Emma Bruno Lotte Max Fritzi Hugo Nala Theo Paula Krümel Pünktchen Wilma Otto Ella Socke Flocke Balu Mia Henri Lilli Rudi Greta " +
    "Schnuffel Mocca Tilda Karl Pippa Bobby Hanni Nanni Zimt Keks Muffin Toffee Pepper Ida Anton Fiete Merle Smilla Jakob Lenny Berta Erna Gustav Rosi Hilde Elvis Dotty Tiger Puschel Bonnie " +
    "Clyde Wuschel Sternchen Dante Fanny Leo Lola Mats Nele Ole Pia Rosa Sam Tessa Uli Vicky Willi Xaver Yuki Zora Benno Carla Dora Egon Fussel Gisela Hector Ingo Juli Kiki Lumpi Moritz " +
    "Nugget Olga Pommes Quark Rübe Sissi Trudi Vroni Wanda").split(" ");
  const VARIANTS = [];
  Object.keys(QUOTA).forEach((key, si) => {
    const sp = SPECIES[key];
    const list = key === "capy" ? ["orange", ...ACCS] : ACCS;
    for (let i = 0; i < QUOTA[key]; i++) {
      const id = VARIANTS.length;
      VARIANTS.push({ id, sp: key, col: i % sp.colors.length, acc: list[(i + si) % list.length], accColor: ACC_COLORS[(i * 3 + si) % ACC_COLORS.length], name: NAMES[id] });
    }
  });
  const desc = (v) => {
    const sp = SPECIES[v.sp];
    return sp.name + (sp.colors.length > 1 ? ", " + sp.colors[v.col].n : "") + (v.acc ? " " + ACC_NAME[v.acc] : "");
  };

  /* ---------- Zeichnen ---------- */
  // v = {sp, col, acc, accColor}; opts: walk, width, fit, cls
  function svg(v, opts = {}) {
    const sp = SPECIES[v.sp];
    const d = sp.draw(sp.colors[v.col || 0]);
    const size = opts.fit ? 'style="width:100%;height:100%"' : `width="${f(opts.width || sp.W * sp.scale)}" height="${f(((opts.width || sp.W * sp.scale) * sp.H) / sp.W)}"`;
    return `<svg class="ani${opts.walk ? " walking" : ""} ${opts.cls || ""}" viewBox="0 0 ${sp.W} ${sp.H}" ${size} aria-hidden="true">${d.legs}<g class="up">${d.body}${acc(v.acc, d.a, v.accColor)}</g></svg>`;
  }
  function inner(v) {
    const sp = SPECIES[v.sp];
    const d = sp.draw(sp.colors[v.col || 0]);
    return { W: sp.W, H: sp.H, content: d.legs + d.body + acc(v.acc, d.a, v.accColor) };
  }

  /* ---------- Speicher ---------- */
  const KEY = "mama-gehege-" + (typeof CONFIG !== "undefined" ? CONFIG.year : "x");
  let found = new Set();
  const load = () => { try { found = new Set(JSON.parse(localStorage.getItem(KEY) || "[]")); } catch (e) {} };
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify([...found])); } catch (e) {} };

  /* ---------- Tierparade ---------- */
  let H, btn;
  const onScreen = new Set();

  function spawn() {
    const box = document.getElementById("parade");
    const max = innerWidth < 600 ? 4 : 7;
    if (document.hidden || box.childElementCount >= max || document.querySelector(".gehege-overlay")) return;
    const unfound = VARIANTS.filter((v) => !found.has(v.id) && !onScreen.has(v.id));
    const pool = unfound.length && Math.random() < 0.8 ? unfound : VARIANTS.filter((v) => !onScreen.has(v.id));
    if (!pool.length) return;
    const v = H.pick(pool);
    const sp = SPECIES[v.sp];
    const w = sp.W * sp.scale * (innerWidth < 600 ? 0.68 : 0.95);
    const ltr = Math.random() < 0.5;
    const speed = sp.speed * (0.8 + Math.random() * 0.4) * (innerWidth < 600 ? 0.8 : 1);
    const dur = (innerWidth + w + 40) / speed;
    const bottom = Math.floor(Math.random() * 34);
    const div = H.el("div", { class: "walker" + (ltr ? "" : " rtl"), style: `bottom:${bottom}px;z-index:${60 - bottom};--from:${ltr ? -w - 10 : innerWidth + 10}px;--to:${ltr ? innerWidth + 10 : -w - 10}px;animation-duration:${dur}s`, title: "Klick mich!" });
    div.innerHTML = `<div class="w-in">${svg(v, { walk: true, width: w })}</div>`;
    onScreen.add(v.id);
    div.addEventListener("animationend", (e) => { if (e.target === div) { div.remove(); onScreen.delete(v.id); } });
    div.addEventListener("click", (e) => { e.stopPropagation(); teleport(div, v); });
    box.append(div);
  }

  function teleport(div, v) {
    if (div.dataset.gone) return;
    div.dataset.gone = "1";
    const r = div.getBoundingClientRect();
    div.style.left = r.left + "px"; div.style.animation = "none";
    div.classList.add("beam");
    const s = H.sfx;
    s.tone(300, 0.5, "sine", 0.18, 1600); s.tone(600, 0.4, "triangle", 0.08, 2400, 0.1);
    H.burst(r.left + r.width / 2, r.top + r.height / 2, ["✨", "⭐", "💫"], 12, 80);
    const isNew = !found.has(v.id);
    found.add(v.id); save();
    setTimeout(() => {
      div.remove(); onScreen.delete(v.id);
      const b = btn.getBoundingClientRect();
      const orb = H.el("div", { class: "orb", style: `left:${r.left + r.width / 2}px;top:${r.top + r.height / 3}px` });
      document.getElementById("fx").append(orb);
      orb.animate([{ transform: "translate(-50%,-50%) scale(1)" }, { transform: `translate(calc(-50% + ${b.left + b.width / 2 - r.left - r.width / 2}px), calc(-50% + ${b.top + b.height / 2 - r.top - r.height / 3}px)) scale(.4)` }], { duration: 650, easing: "cubic-bezier(.5,0,.3,1)" }).onfinish = () => {
        orb.remove(); updateBtn(true);
        if (isNew) s.good();
      };
    }, 550);
    if (isNew) H.toast(`✨ Neu im Gehege: ${v.name} – ${desc(v)} · ${found.size}/100`, 3200);
    else H.toast(`${v.name} wohnt schon im Gehege – zurückgebeamt 👋`);
    if (isNew && found.size === VARIANTS.length) setTimeout(() => { H.confetti(); H.sfx.jingle(); H.toast("🏆 Alle 100 Tiere gefunden! Das Gehege ist komplett!", 6000); }, 1400);
  }

  function updateBtn(bump) {
    btn.querySelector(".g-count").textContent = `${found.size}/100`;
    if (bump) { btn.classList.remove("bump"); void btn.offsetWidth; btn.classList.add("bump"); }
  }

  /* ---------- Das Gehege ---------- */
  function openGehege() {
    let alive = true;
    const timers = new Set();
    const later = (fn, ms) => { const t = setTimeout(() => { timers.delete(t); if (alive) fn(); }, ms); timers.add(t); };
    const ov = H.el("div", { class: "gehege-overlay", role: "dialog", "aria-label": "Tiergehege" });
    const close = () => { alive = false; timers.forEach(clearTimeout); ov.remove(); document.body.style.overflow = ""; document.removeEventListener("keydown", esc); };
    const esc = (e) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", esc);
    const tabPen = H.el("button", { class: "g-tab active", text: "Gehege" });
    const tabAlbum = H.el("button", { class: "g-tab", text: "Sammelalbum" });
    const area = H.el("div", { class: "g-area" });
    ov.append(H.el("div", { class: "g-head" },
      H.el("div", {}, H.el("h2", { text: "Mamas Tiergehege" }), H.el("div", { class: "g-sub", text: `${found.size} von 100 Tieren gefunden` })),
      H.el("div", { class: "g-tabs" }, tabPen, tabAlbum),
      H.el("button", { class: "modal-close", "aria-label": "Schließen", text: "✖", onclick: close })), area);
    const show = (which) => {
      timers.forEach(clearTimeout); timers.clear();
      tabPen.classList.toggle("active", which === "pen"); tabAlbum.classList.toggle("active", which === "album");
      area.innerHTML = "";
      which === "pen" ? pen(area, later) : album(area);
    };
    tabPen.onclick = () => show("pen"); tabAlbum.onclick = () => show("album");
    document.body.append(ov); document.body.style.overflow = "hidden";
    show("pen");
  }

  const DECOR = `<svg class="pen-decor" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
    <ellipse cx="780" cy="420" rx="150" ry="55" fill="#9fd3f0"/><ellipse cx="780" cy="412" rx="120" ry="38" fill="#bfe4f7"/>
    <g fill="#5d9e6d"><circle cx="90" cy="120" r="55"/><circle cx="140" cy="95" r="45"/><circle cx="910" cy="110" r="60"/><circle cx="860" cy="140" r="40"/></g>
    <g fill="#7a5537"><rect x="105" y="150" width="16" height="50"/><rect x="900" y="150" width="16" height="55"/></g>
    <g fill="#79b884"><circle cx="300" cy="520" r="30"/><circle cx="330" cy="530" r="26"/><circle cx="560" cy="120" r="22"/><circle cx="585" cy="128" r="18"/></g>
    <g fill="#fff" opacity=".8"><circle cx="420" cy="300" r="4"/><circle cx="650" cy="230" r="4"/><circle cx="220" cy="380" r="4"/><circle cx="480" cy="470" r="4"/></g>
  </svg>`;

  function pen(area, later) {
    const field = H.el("div", { class: "pen" });
    field.innerHTML = DECOR;
    area.append(field);
    const mine = VARIANTS.filter((v) => found.has(v.id));
    if (!mine.length) {
      field.append(H.el("div", { class: "pen-empty" }, H.el("b", { text: "Noch ist das Gehege leer." }), H.el("div", { text: "Unten auf der Seite laufen ständig Tiere vorbei. Klick sie an, dann werden sie hierher gebeamt. Insgesamt gibt es 100 verschiedene." })));
      return;
    }
    const small = innerWidth < 600;
    mine.forEach((v) => {
      const sp = SPECIES[v.sp];
      const w = sp.W * sp.scale * (small ? 0.62 : 1);
      const a = H.el("div", { class: "pen-animal" });
      const wrap = H.el("div", { class: "pa-in" });
      wrap.innerHTML = svg(v, { width: w });
      a.append(wrap);
      let x = Math.random() * 88, y = 8 + Math.random() * 78;
      a.style.left = x + "%"; a.style.top = y + "%"; a.style.zIndex = Math.round(y);
      const move = () => {
        const nx = Math.max(0, Math.min(90, x + (Math.random() - 0.5) * 50)), ny = Math.max(6, Math.min(86, y + (Math.random() - 0.5) * 40));
        const fw = field.clientWidth, fh = field.clientHeight;
        const dist = Math.hypot(((nx - x) / 100) * fw, ((ny - y) / 100) * fh);
        const dur = Math.max(0.8, dist / (sp.speed * 0.7));
        a.classList.toggle("flip", nx < x);
        a.querySelector("svg").classList.add("walking");
        a.style.transition = `left ${dur}s linear, top ${dur}s linear`;
        a.style.left = nx + "%"; a.style.top = ny + "%"; a.style.zIndex = Math.round(ny);
        x = nx; y = ny;
        later(() => { a.querySelector("svg")?.classList.remove("walking"); later(move, 800 + Math.random() * 3500); }, dur * 1000);
      };
      later(move, Math.random() * 3000);
      a.addEventListener("click", (e) => {
        e.stopPropagation();
        a.querySelector(".pen-tag")?.remove();
        const tag = H.el("div", { class: "pen-tag" }, H.el("b", { text: v.name }), H.el("span", { text: desc(v) }));
        a.append(tag);
        wrap.animate([{ transform: "translateY(0)" }, { transform: "translateY(-18px)" }, { transform: "translateY(0)" }], { duration: 420, easing: "ease-out" });
        H.sfx.boop(300 + Math.random() * 400);
        setTimeout(() => tag.remove(), 2600);
      });
      field.append(a);
    });
  }

  function album(area) {
    const wrap = H.el("div", { class: "album" });
    Object.keys(QUOTA).forEach((key) => {
      const sp = SPECIES[key];
      const vs = VARIANTS.filter((v) => v.sp === key);
      const n = vs.filter((v) => found.has(v.id)).length;
      const grid = H.el("div", { class: "album-grid" });
      vs.forEach((v) => {
        const has = found.has(v.id);
        const card = H.el("div", { class: "album-card" + (has ? "" : " missing") });
        const pic = H.el("div", { class: "album-pic" }); pic.innerHTML = svg(v, { fit: true });
        card.append(pic, H.el("b", { text: has ? v.name : "???" }), H.el("small", { text: has ? desc(v).replace(sp.name, "").replace(/^, /, "") || sp.name : "noch nicht gefunden" }));
        grid.append(card);
      });
      wrap.append(H.el("h3", {}, sp.plural, H.el("span", { text: ` ${n}/${vs.length}` })), grid);
    });
    area.append(wrap);
  }

  function init() {
    H = App.h;
    load();
    btn = H.el("button", { id: "gehege-btn", "aria-label": "Tiergehege öffnen" });
    btn.innerHTML = `<svg viewBox="0 0 40 30" width="30" height="22" aria-hidden="true"><g fill="#8a5a3b"><rect x="3" y="6" width="5" height="22" rx="2"/><rect x="17" y="6" width="5" height="22" rx="2"/><rect x="31" y="6" width="5" height="22" rx="2"/><rect x="0" y="11" width="40" height="4" rx="2"/><rect x="0" y="20" width="40" height="4" rx="2"/></g></svg><span>Gehege</span><span class="g-count"></span>`;
    btn.addEventListener("click", (e) => { e.stopPropagation(); H.sfx.boop(500); openGehege(); });
    document.body.append(btn);
    updateBtn();
    setTimeout(spawn, 600); setTimeout(spawn, 2500);
    setInterval(spawn, 2600);
  }

  return { SPECIES, VARIANTS, svg, inner, desc, init, openGehege, foundCount: () => found.size };
})();
