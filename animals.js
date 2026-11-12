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
  const S = (d, stroke, w, ex = "") => `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${f(w)}"${ex.includes("stroke-linecap") ? "" : ' stroke-linecap="round"'} stroke-linejoin="round" ${ex}/>`;
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
  /* ---------- Seltenheit ---------- */
  // w = Gewicht beim Auftauchen. Noch nicht gefundene Tiere zählen UNFOUND_BOOST-fach,
  // damit auch die legendären bis Weihnachten erreichbar bleiben.
  const RARITY = {
    haeufig: { label: "Häufig", w: 10 },
    selten: { label: "Selten", w: 3.5 },
    sehrselten: { label: "Sehr selten", w: 1.2 },
    legendaer: { label: "Legendär", w: 0.5 },
  };
  const UNFOUND_BOOST = 4;
  const nth = (sp, i) => VARIANTS.filter((v) => v.sp === sp)[i];
  [[nth("capy", 8), 2], [nth("elefant", 4), 1], [nth("baer", 6), 2]].forEach(([v, col]) => { v.col = col; v.acc = "krone"; v.rarity = "legendaer"; });
  // besondere Fellfarben landen bevorzugt in "sehr selten"
  const SPECIAL = { capy: [2], elefant: [1], fuchs: [1], pinguin: [1], igel: [1], baer: [1, 2], schaf: [1], ente: [2], katze: [4], hund: [2] };
  let rs = 77;
  const rr = () => (rs = (rs * 16807) % 2147483647) / 2147483647;
  VARIANTS.filter((v) => !v.rarity)
    .map((v) => ({ v, k: (SPECIAL[v.sp] && SPECIAL[v.sp].includes(v.col) ? 0 : 1) + rr() }))
    .sort((a, b) => a.k - b.k)
    .forEach(({ v }, i) => (v.rarity = i < 12 ? "sehrselten" : i < 37 ? "selten" : "haeufig"));
  /* ---------- Einzugs-Wellen: manche Tiere erst ab einem Tag im Dezember ---------- */
  // day 0 = von Anfang an. Die Tiere einer Welle erkennt man an ihrem Accessoire.
  const WAVES = [
    { day: 0 },
    { day: 6, acc: "muetze", msg: "Zum Nikolaus sind neue Tiere eingezogen – alle mit Weihnachtsmütze! Halt die Augen offen." },
    { day: 13, acc: "geweih", msg: "Neue Tiere sind eingezogen: alle mit Rentiergeweih! Sie laufen ab jetzt über die Seite." },
    { day: 20, acc: "krone", msg: "Kurz vor Weihnachten kommen die Majestäten: Neue Tiere mit Krone sind eingezogen!" },
  ];
  VARIANTS.forEach((v) => { const w = WAVES.find((x) => x.acc === v.acc); v.from = w ? w.day : 0; });
  // die drei legendären verteilen sich über den Monat
  nth("capy", 8).from = 6; nth("elefant", 4).from = 13; nth("baer", 6).from = 20;
  const available = (v) => v.from === 0 || App.isUnlocked(v.from);

  const rarityChip = (v) => `<span class="rar r-${v.rarity}">${RARITY[v.rarity].label}</span>`;

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
    return `<svg xmlns="http://www.w3.org/2000/svg" class="ani${opts.walk ? " walking" : ""} ${opts.cls || ""}" viewBox="0 0 ${sp.W} ${sp.H}" ${size} aria-hidden="true">${d.legs}<g class="up">${d.body}${acc(v.acc, d.a, v.accColor)}</g></svg>`;
  }
  function inner(v) {
    const sp = SPECIES[v.sp];
    const d = sp.draw(sp.colors[v.col || 0]);
    return { W: sp.W, H: sp.H, content: d.legs + d.body + acc(v.acc, d.a, v.accColor) };
  }

  /* ---------- Speicher ---------- */
  const KEY = "mama-gehege-" + (typeof CONFIG !== "undefined" ? CONFIG.year : "x");
  let found = new Set();
  let since = {};
  const load = () => {
    try { found = new Set(JSON.parse(localStorage.getItem(KEY) || "[]")); since = JSON.parse(localStorage.getItem(KEY + "-zeit") || "{}"); } catch (e) {}
    let changed = false; found.forEach((id) => { if (!since[id]) { since[id] = Date.now(); changed = true; } }); if (changed) save();
  };
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify([...found])); localStorage.setItem(KEY + "-zeit", JSON.stringify(since)); } catch (e) {} };
  /* ---------- Hunger: 24 Stunden ohne Futter = traurig ---------- */
  const DAY = 24 * 3600 * 1000;
  const hungry = (v) => typeof Zoo !== "undefined" && found.has(v.id) && Date.now() - Math.max(Zoo.fedAt(v.id), since[v.id] || Date.now()) > DAY;
  const hungryCount = () => VARIANTS.filter(hungry).length;
  const ownedOf = (sp) => VARIANTS.filter((v) => v.sp === sp && found.has(v.id)).length;
  function updateHunger() {
    const pill = document.getElementById("hunger-pill"); if (!pill) return;
    const n = hungryCount();
    pill.classList.toggle("hidden", !n);
    pill.textContent = n === 1 ? "1 Tier hat Hunger" : `${n} Tiere haben Hunger`;
  }

  /* ---------- Tierparade ---------- */
  let H, btn;
  const onScreen = new Set();

  function pickVariant() {
    const pool = VARIANTS.filter((v) => !onScreen.has(v.id) && available(v));
    if (!pool.length) return null;
    const wt = (v) => RARITY[v.rarity].w * (found.has(v.id) ? 1 : UNFOUND_BOOST);
    let t = Math.random() * pool.reduce((n, v) => n + wt(v), 0), v = pool[pool.length - 1];
    for (const c of pool) { t -= wt(c); if (t <= 0) { v = c; break; } }
    return v;
  }

  // Unten laufen nur noch ab und zu Tiere vorbei – die meisten verstecken sich.
  function spawn() {
    const box = document.getElementById("parade");
    const max = innerWidth < 600 ? 1 : 2;
    if (document.hidden || box.childElementCount >= max || Math.random() < 0.6 || document.querySelector(".gehege-overlay")) return;
    const v = pickVariant();
    if (!v) return;
    const sp = SPECIES[v.sp];
    const w = sp.W * sp.scale * (innerWidth < 600 ? 0.68 : 0.95);
    const ltr = Math.random() < 0.5;
    const speed = sp.speed * (0.8 + Math.random() * 0.4) * (innerWidth < 600 ? 0.8 : 1);
    const dur = (innerWidth + w + 40) / speed;
    const bottom = Math.floor(Math.random() * 34);
    const div = H.el("div", { class: "walker r-" + v.rarity + (ltr ? "" : " rtl"), style: `bottom:${bottom}px;z-index:${60 - bottom};--from:${ltr ? -w - 10 : innerWidth + 10}px;--to:${ltr ? innerWidth + 10 : -w - 10}px;animation-duration:${dur}s`, title: "Klick mich!" });
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
    if (div.classList.contains("walker")) { div.style.left = r.left + "px"; div.style.animation = "none"; }
    hiders.delete(div);
    div.classList.add("beam");
    const s = H.sfx;
    s.tone(300, 0.5, "sine", 0.18, 1600); s.tone(600, 0.4, "triangle", 0.08, 2400, 0.1);
    H.burst(r.left + r.width / 2, r.top + r.height / 2, ["✨", "⭐", "💫"], 12, 80);
    const isNew = !found.has(v.id);
    found.add(v.id); if (!since[v.id]) since[v.id] = Date.now(); save();
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
    const pre = { haeufig: "✨ Neu im Gehege", selten: "💙 Seltenes Tier", sehrselten: "💜 Sehr seltenes Tier", legendaer: "👑 LEGENDÄRES TIER" }[v.rarity];
    if (isNew && typeof Photos !== "undefined") setTimeout(() => Photos.show(v), 650);
    if (isNew && typeof Zoo !== "undefined") setTimeout(() => Zoo.addCoins({ haeufig: 5, selten: 10, sehrselten: 25, legendaer: 75 }[v.rarity], { x: r.left + r.width / 2, y: r.top }), 400);
    if (isNew) setTimeout(refreshPens, 1300);
    else if (isNew) H.toast(`${pre}: ${v.name} – ${desc(v)} · ${found.size}/100`, 3200);
    if (isNew && v.rarity === "sehrselten") { H.burst(r.left + r.width / 2, r.top, ["💜", "✨", "⭐"], 18, 140); [784, 988, 1175].forEach((f, i) => s.tone(f, 0.2, "triangle", 0.15, null, 0.5 + i * 0.1)); }
    if (isNew && v.rarity === "legendaer") { setTimeout(() => { H.confetti(["👑", "✨", "⭐", "💛", "🎉"], 80); s.jingle(); }, 700); }
    if (!isNew) H.toast(`${v.name} wohnt schon im Gehege – zurückgebeamt 👋`);
    if (isNew && found.size === VARIANTS.length) setTimeout(() => { H.confetti(); H.sfx.jingle(); H.toast("🏆 Alle 100 Tiere gefunden! Das Gehege ist komplett!", 6000); }, 1400);
  }

  /* ---------- Verstecke: Tiere sitzen HINTER Türchen, Karten & Knöpfen ---------- */
  // Das Tier steckt hinter einem echten Element (Türchen, Gehege-Karte, Kalle …) und
  // schaut regelmäßig darüber hervor. Sichtbar ist genau der Teil, der herausragt.
  const hiders = new Set();
  function makeHider(v, parent, css, o = {}) {
    const sp = SPECIES[v.sp];
    const w = Math.round(o.w || 64), svgH = (w * sp.H) / sp.W;
    const h = H.el("div", { class: "hider r-" + v.rarity + (o.edge ? " edge" : ""), style: `width:${w}px;height:${Math.round(o.edge ? svgH * 0.55 : svgH)}px;${css}` });
    const px = o.px || 0, py = o.py != null ? o.py : -Math.round(svgH * 0.58);
    h.innerHTML = `<div class="w-in" style="--px:${px}px;--py:${py}px;animation-delay:-${(Math.random() * 8).toFixed(1)}s;animation-duration:${(8 + Math.random() * 4).toFixed(1)}s"><div class="${(o.flip ?? Math.random() < 0.5) ? "flipx" : ""}">${svg(v, { width: w })}</div></div>`;
    h.addEventListener("click", (e) => { e.stopPropagation(); teleport(h, v); });
    if (o.modal) h.dataset.modal = "1";
    h._v = v;
    onScreen.add(v.id); hiders.add(h);
    parent.append(h);
    if (o.life) setTimeout(() => dropHider(h, v), o.life);
    return h;
  }
  function dropHider(h, v) {
    if (!h.isConnected || h.dataset.gone) { hiders.delete(h); onScreen.delete(v.id); return; }
    hiders.delete(h); onScreen.delete(v.id);
    h.classList.add("leaving"); setTimeout(() => h.remove(), 700);
  }
  const rnd01 = (a, b) => a + Math.random() * (b - a);
  // hinter einem Element: Tier wird als Geschwister dahinter (z-index 1) unter dessen Oberkante gesetzt
  function behind(target, o = {}) {
    const parent = target.offsetParent; if (!parent) return null;
    const w = o.w || 64;
    const x = target.offsetLeft + rnd01(0.12, 0.88) * target.offsetWidth - w / 2;
    return [parent, `left:${Math.round(x)}px;top:${target.offsetTop + (o.dy || 10)}px;z-index:${o.z || 1}`, { w }];
  }
  const small = () => innerWidth < 600;
  const SPOTS = [
    () => { const ds = [...document.querySelectorAll("#calendar .door:not(.open), #bonus:not(.hidden) .door:not(.open)")].filter((d) => !d.parentElement.querySelector(".hider")); if (!ds.length) return null; const d = H.pick(ds), wr = d.parentElement, w = Math.min(70, wr.offsetWidth * 0.5); return [wr, `left:${Math.round(rnd01(0.08, 0.92 - w / wr.offsetWidth) * wr.offsetWidth)}px;top:8px;z-index:1`, { w }]; },
    () => { const ds = [...document.querySelectorAll("#calendar .door:not(.open)")].filter((d) => !d.parentElement.querySelector(".hider")); if (!ds.length) return null; const d = H.pick(ds), wr = d.parentElement, w = Math.min(70, wr.offsetWidth * 0.5); return [wr, `left:${Math.round(rnd01(0.08, 0.92 - w / wr.offsetWidth) * wr.offsetWidth)}px;top:8px;z-index:1`, { w }]; },
    () => behind(document.getElementById("zoo"), { w: small() ? 56 : 78 }),
    () => behind(document.getElementById("calendar"), { w: small() ? 56 : 76 }),
    () => [document.body, `position:fixed;left:${small() ? 30 : 46}px;bottom:${small() ? 34 : 44}px;z-index:5`, { w: small() ? 44 : 60 }],
    () => { const b = document.getElementById("gehege-btn"); if (!b) return null; const r = b.getBoundingClientRect(); return [document.body, `position:fixed;left:${Math.round(r.left + r.width * rnd01(0.15, 0.6))}px;top:${Math.round(r.top + 4)}px;z-index:6`, { w: 32 }]; },
    () => [document.body, `position:fixed;left:0;top:${Math.round(innerHeight * rnd01(0.25, 0.65))}px;transform-origin:0 0;z-index:6`, { edge: "left", w: small() ? 50 : 66 }],
    () => [document.body, `position:fixed;top:${Math.round(innerHeight * rnd01(0.2, 0.6))}px;transform-origin:0 0;z-index:6`, { edge: "right", w: small() ? 50 : 66 }],
  ];
  function placeEdge(h, o) {
    const bh = h.offsetHeight, w = o.w;
    if (o.edge === "left") h.style.transform = `translateX(${bh}px) rotate(90deg)`;
    else { h.style.left = innerWidth - bh + "px"; h.style.transform = `translateY(${w}px) rotate(-90deg)`; }
  }
  function hideLoop() {
    if (document.hidden || document.querySelector(".gehege-overlay")) return;
    const onPage = [...hiders].filter((h) => h.isConnected && !h.dataset.modal).length;
    if (onPage >= (small() ? 2 : 3)) return;
    const v = pickVariant(); if (!v) return;
    const spot = H.pick(SPOTS)(); if (!spot || !spot[0]) return;
    const o = { ...spot[2], life: 45000 + Math.random() * 45000 };
    if (o.edge) o.py = 0;
    const h = makeHider(v, spot[0], spot[1], o);
    if (o.edge) placeEdge(h, o);
  }
  // Verstecke im Rätselfenster (hinter Kalles Brief), im Shop (hinter einer Karte) und im Album (hinter den Reitern)
  function hideIn(kind, container) {
    if (!container || Math.random() > ({ modal: 0.65, shop: 0.5, album: 0.45 }[kind] || 0.5)) return;
    const v = pickVariant(); if (!v) return;
    let target = null, w = 60;
    if (kind === "modal") { target = container.querySelector(".modal-story:not(.hidden)"); w = small() ? 52 : 66; }
    else if (kind === "shop") { const cs = [...container.querySelectorAll(".shop-card")]; target = cs.length ? H.pick(cs) : null; w = 54; }
    else target = container.querySelector(".g-tabs");
    if (!target) return;
    const spot = behind(target, { w }); if (!spot) return;
    makeHider(v, spot[0], spot[1], { ...spot[2], modal: true });
  }
  function clearIn(container) {
    container?.querySelectorAll(".hider").forEach((h) => { if (!h.dataset.gone) { hiders.delete(h); onScreen.delete(h._v.id); } h.remove(); });
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
    const close = () => { alive = false; timers.forEach(clearTimeout); clearIn(ov); ov.remove(); document.body.style.overflow = ""; document.removeEventListener("keydown", esc); };
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
    hideIn("album", ov.querySelector(".g-head"));
  }

  const DECOR = `<svg class="pen-decor" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
    <ellipse cx="780" cy="420" rx="150" ry="55" fill="#9fd3f0"/><ellipse cx="780" cy="412" rx="120" ry="38" fill="#bfe4f7"/>
    <g fill="#5d9e6d"><circle cx="90" cy="120" r="55"/><circle cx="140" cy="95" r="45"/><circle cx="910" cy="110" r="60"/><circle cx="860" cy="140" r="40"/></g>
    <g fill="#7a5537"><rect x="105" y="150" width="16" height="50"/><rect x="900" y="150" width="16" height="55"/></g>
    <g fill="#79b884"><circle cx="300" cy="520" r="30"/><circle cx="330" cy="530" r="26"/><circle cx="560" cy="120" r="22"/><circle cx="585" cy="128" r="18"/></g>
    <g fill="#fff" opacity=".8"><circle cx="420" cy="300" r="4"/><circle cx="650" cy="230" r="4"/><circle cx="220" cy="380" r="4"/><circle cx="480" cy="470" r="4"/></g>
  </svg>`;

  function pen(area, later) {
    const vp = H.el("div", { class: "pen-viewport" });
    const n = VARIANTS.filter((v) => found.has(v.id)).length;
    const baseW = Math.round(Math.max(1500, 1100 + n * 16)), baseH = Math.round(baseW * 0.6);
    const world = H.el("div", { class: "pen pen-world", style: `width:${baseW}px;height:${baseH}px` });
    const ctrl = H.el("div", { class: "zoom-ctrl" });
    vp.append(world, ctrl);
    area.append(vp);
    mountPen(world, later);
    let z = 1, tx = 0, ty = 0, zMin = 0.2;
    const apply = () => { world.style.transform = `translate(${tx}px, ${ty}px) scale(${z})`; world.style.setProperty("--inv", (1 / z).toFixed(3)); };
    const clampPan = () => {
      const W = vp.clientWidth, Hh = vp.clientHeight, w = baseW * z, h = baseH * z;
      tx = w <= W ? (W - w) / 2 : Math.min(0, Math.max(W - w, tx));
      ty = h <= Hh ? (Hh - h) / 2 : Math.min(0, Math.max(Hh - h, ty));
    };
    const fit = () => { zMin = Math.min(vp.clientWidth / baseW, vp.clientHeight / baseH); z = zMin; clampPan(); apply(); };
    const zoomAt = (nz, cx, cy) => { nz = Math.max(zMin, Math.min(2.6, nz)); tx = cx - ((cx - tx) * nz) / z; ty = cy - ((cy - ty) * nz) / z; z = nz; clampPan(); apply(); };
    const mid = () => [vp.clientWidth / 2, vp.clientHeight / 2];
    const btn = (t, lab, f) => { const b = H.el("button", { text: t, "aria-label": lab }); b.onclick = (e) => { e.stopPropagation(); f(); H.sfx.tick(); }; ctrl.append(b); };
    btn("+", "Hineinzoomen", () => zoomAt(z * 1.35, ...mid()));
    btn("−", "Herauszoomen", () => zoomAt(z / 1.35, ...mid()));
    btn("Alles zeigen", "Ganzes Gehege zeigen", fit);
    vp.addEventListener("wheel", (e) => { e.preventDefault(); const r = vp.getBoundingClientRect(); zoomAt(z * (e.deltaY < 0 ? 1.12 : 1 / 1.12), e.clientX - r.left, e.clientY - r.top); }, { passive: false });
    const pts = new Map();
    let last = null, dist0 = 0, z0 = 1, moved = 0;
    vp.addEventListener("pointerdown", (e) => { if (e.target.closest(".zoom-ctrl, .feed-btn")) return; pts.set(e.pointerId, [e.clientX, e.clientY]); last = [e.clientX, e.clientY]; moved = 0; if (pts.size === 2) { const [a, b] = [...pts.values()]; dist0 = Math.hypot(a[0] - b[0], a[1] - b[1]); z0 = z; } });
    vp.addEventListener("pointermove", (e) => {
      if (!pts.has(e.pointerId)) return;
      pts.set(e.pointerId, [e.clientX, e.clientY]);
      if (pts.size === 2) { const [a, b] = [...pts.values()]; const r = vp.getBoundingClientRect(); zoomAt(z0 * (Math.hypot(a[0] - b[0], a[1] - b[1]) / dist0), (a[0] + b[0]) / 2 - r.left, (a[1] + b[1]) / 2 - r.top); moved = 99; return; }
      const dx = e.clientX - last[0], dy = e.clientY - last[1]; last = [e.clientX, e.clientY]; moved += Math.abs(dx) + Math.abs(dy);
      if (moved > 6) { vp.classList.add("dragging"); tx += dx; ty += dy; clampPan(); apply(); }
    });
    const up = (e) => { pts.delete(e.pointerId); if (!pts.size) setTimeout(() => vp.classList.remove("dragging"), 0); };
    vp.addEventListener("pointerup", up); vp.addEventListener("pointercancel", up);
    vp.addEventListener("click", (e) => { if (moved > 6) { e.stopPropagation(); e.preventDefault(); moved = 0; } }, true);
    requestAnimationFrame(fit);
  }

  let inlineCtrls = [];
  function mountPen(field, later) {
    field.innerHTML = "";
    field.append(H.el("div", { class: "zoo-scene", html: typeof Zoo !== "undefined" ? Zoo.scene() : DECOR }));
    const ctrls = [];
    if (field.id === "zoo-pen") inlineCtrls = ctrls;
    const mine = VARIANTS.filter((v) => found.has(v.id));
    if (!mine.length) {
      if (field.id === "zoo-pen") mountProps(field);
      field.append(H.el("div", { class: "pen-empty" }, H.el("b", { text: "Noch wohnt hier niemand." }), H.el("div", { text: "Überall auf der Seite verstecken sich Tiere. Klick sie an, dann ziehen sie hier ein!" })));
      return;
    }
    mine.forEach((v) => ctrls.push(penAnimal(field, v, later)));
    if (field.id === "zoo-pen") mountProps(field);
  }

  function penAnimal(field, v, later, o = {}) {
    const sp = SPECIES[v.sp];
    const small = innerWidth < 600;
    const k = field.classList.contains("inline") ? (small ? 0.42 : 0.7) : small ? 0.62 : 1;
    const w = sp.W * sp.scale * k;
    const a = H.el("div", { class: "pen-animal" + (o.guest ? " guest" : "") });
    const wrap = H.el("div", { class: "pa-in" });
    wrap.innerHTML = svg(v, { width: w });
    a.append(wrap);
    const c = { v, a, busy: false, guest: !!o.guest, x: o.x ?? Math.random() * 88, y: o.y ?? 48 + Math.random() * 46 };
    c.setSad = (on) => { a.classList.toggle("sad", on); if (on && !a.querySelector(".tear")) a.append(H.el("div", { class: "tear" })); if (!on) a.querySelector(".tear")?.remove(); };
    if (!o.guest) c.setSad(hungry(v));
    a.style.left = c.x + "%"; a.style.top = c.y + "%"; a.style.zIndex = Math.round(c.y);
    c.walkTo = (nx, ny, done, fast) => {
      const fw = field.clientWidth, fh = field.clientHeight;
      const dist = Math.hypot(((nx - c.x) / 100) * fw, ((ny - c.y) / 100) * fh);
      const dur = (fast ? Math.min(5, Math.max(1.6, dist / 90)) : Math.max(0.6, dist / (sp.speed * 0.8))) * (a.classList.contains("sad") ? 1.8 : 1);
      a.classList.toggle("flip", nx < c.x);
      a.querySelector("svg").classList.add("walking");
      a.style.transition = `left ${dur}s linear, top ${dur}s linear`;
      a.style.left = nx + "%"; a.style.top = ny + "%"; a.style.zIndex = Math.round(ny);
      c.x = nx; c.y = ny;
      later(() => { a.querySelector("svg")?.classList.remove("walking"); done && done(); }, dur * 1000);
    };
    const move = () => {
      if (!a.isConnected) return;
      if (c.busy) { later(move, 1500); return; }
      const nx = Math.max(0, Math.min(90, c.x + (Math.random() - 0.5) * 50)), ny = Math.max(46, Math.min(96, c.y + (Math.random() - 0.5) * 30));
      c.walkTo(nx, ny, () => later(move, (a.classList.contains("sad") ? 3000 : 800) + Math.random() * 3500));
    };
    c.goTo = (nx, ny, done) => { c.busy = true; c.walkTo(nx, ny, done, true); };
    c.name = v.name;
    c.say = (text, ms = 4600) => {
      a.querySelector(".pen-say")?.remove();
      const b = H.el("div", { class: "pen-say" }, H.el("b", { text: v.name }), text);
      a.append(b);
      // Sprechblase im Gehege halten
      const fr = field.getBoundingClientRect(), br = b.getBoundingClientRect();
      const shift = Math.max(0, fr.left + 6 - br.left) - Math.max(0, br.right - (fr.right - 6));
      if (shift) b.style.marginLeft = shift + "px";
      setTimeout(() => b.remove(), ms);
    };
    if (!o.guest) later(move, Math.random() * 3000);
    a.addEventListener("click", (e) => {
      e.stopPropagation();
      a.querySelector(".pen-tag")?.remove();
      let feedBtn = null;
      if (!o.guest && typeof Zoo !== "undefined") {
        const [fname] = Zoo.FOOD[v.sp], n = Zoo.foodCount(v.sp);
        feedBtn = H.el("button", { class: "feed-btn" + (n ? "" : " empty") }, H.el("span", { class: "feed-ic", html: Zoo.foodIcon(v.sp) }), n ? `Füttern (${fname} ×${n})` : `Kein Futter – ${fname} im Shop`);
        feedBtn.addEventListener("click", (ev) => { ev.stopPropagation(); tag.remove(); if (n) feed(c, field); else { document.querySelector(".gehege-overlay .modal-close")?.click(); Zoo.openShop("@futter"); } });
      }
      const tag = H.el("div", { class: "pen-tag" }, H.el("b", { text: v.name }), H.el("span", { text: o.guest ? "zu Besuch" : desc(v) }), o.guest ? null : H.el("span", { html: rarityChip(v) }), o.guest || !hungry(v) ? null : H.el("span", { class: "hungry-note", text: "hat Hunger!" }), feedBtn);
      a.append(tag);
      wrap.animate([{ transform: "translateY(0)" }, { transform: "translateY(-18px)" }, { transform: "translateY(0)" }], { duration: 420, easing: "ease-out" });
      H.sfx.boop(300 + Math.random() * 400);
      setTimeout(() => tag.remove(), feedBtn ? 5000 : 2600);
    });
    field.append(a);
    return c;
  }

  /* ---------- Füttern ---------- */
  const YUM = ["Danke, Mama!", "Du bist die Beste!", "Mein Lieblingsessen!", "Mehr davon, bitte!", "Jetzt geht's mir wieder gut!", "Lecker, lecker!"];
  function feed(c, field) {
    const v = c.v;
    if (!Zoo.useFood(v.sp, v.id)) return;
    const [fname] = Zoo.FOOD[v.sp];
    const food = H.el("div", { class: "food-pop", html: Zoo.foodIcon(v.sp) });
    c.a.append(food); setTimeout(() => food.remove(), 1400);
    const was = c.a.classList.contains("sad");
    c.setSad(false);
    const wrap = c.a.querySelector(".pa-in");
    setTimeout(() => {
      wrap.animate([{ transform: "translateY(0)" }, { transform: "translateY(-26px) rotate(-6deg)" }, { transform: "translateY(0)" }, { transform: "translateY(-16px) rotate(6deg)" }, { transform: "translateY(0)" }], { duration: 900, easing: "ease-out" });
      H.burstAt(c.a, ["💖", "💕", "✨"], 12, 70);
      H.sfx.good();
      c.say(`${Texts.say("futterAn", { food: fname })} ${Texts.say("futterNach")}`, 3600);
    }, 700);
    updateHunger();
  }

  /* ---------- Nach einem Kauf: drei Tiere schauen sich das Neue an – nacheinander ---------- */
  const PRAISE = [
    "Hier fühle ich mich gleich viel wohler.", "Genau das hat uns gefehlt!", "Danke, Mama – das ist wunderbar!", "Jetzt ist es richtig gemütlich hier.",
    "Wie hübsch! Das muss ich sofort Kalle zeigen.", "Ich glaube, das wird mein neuer Lieblingsplatz.", "So ein schönes Zuhause hatte ich noch nie.",
    "Ich bin ganz gerührt.", "Unser Gehege wird immer schöner!", "Mama hat wirklich Geschmack.",
  ];
  const GUESTS = [{ sp: "capy", col: 0, acc: "orange", name: "Kalle" }, { sp: "katze", col: 1, acc: "schleife", accColor: "#e85d75", name: "Mimi" }, { sp: "hund", col: 0, acc: "schal", accColor: "#4f7fe0", name: "Bello" }];
  let celebrating = false;
  const sceneMap = (field) => {
    const W = field.clientWidth, Hh = field.clientHeight, sc = Math.max(W / 1000, Hh / 600);
    const ox = (W - 1000 * sc) / 2, oy = (Hh - 600 * sc) / 2;
    return { W, Hh, sc, ox, oy, pct: (x, y) => [((ox + x * sc) / W) * 100, ((oy + y * sc) / Hh) * 100] };
  };
  const clampN = (v, a, b) => Math.max(a, Math.min(b, v));
  function celebrate(sx, sy, itemName) {
    const field = document.getElementById("zoo-pen");
    if (!field || !field.clientWidth) return;
    celebrating = true;
    const M = sceneMap(field);
    const empty = field.querySelector(".pen-empty");
    if (empty) empty.classList.add("hidden");
    const actors = H.shuffle(inlineCtrls.filter((c) => c.a.isConnected && !c.busy)).slice(0, 3);
    while (actors.length < 3) {
      const g = GUESTS[actors.length];
      actors.push(penAnimal(field, g, inlineLater, { guest: true, x: actors.length % 2 ? 98 : -6, y: 80 }));
    }
    const lines = [Texts.say("neuesTeil", { item: itemName }), Texts.say("freude"), Texts.say("freude")];
    const offs = [[-130, 30], [0, 52], [130, 30]];
    const [ix] = M.pct(sx, sy);
    // jedes Tier geht los, sobald das vorige zu sprechen beginnt; gesprochen wird streng nacheinander
    const step = (i) => {
      if (i >= actors.length) return;
      const c = actors[i];
      const [px, py] = M.pct(sx + offs[i][0], sy + offs[i][1]);
      const aw = (c.a.offsetWidth / M.W) * 100;
      const tx = clampN(px - aw / 2, 0, 94), ty = clampN(py, 46, 98);
      c.goTo(tx, ty, () => {
        c.a.classList.toggle("flip", tx + aw / 2 > ix);
        c.say(lines[i], 3600);
        H.sfx.tone(520 + i * 110, 0.12, "triangle", 0.12);
        setTimeout(() => step(i + 1), 3900);
        setTimeout(() => {
          c.busy = false;
          if (c.guest) { c.a.style.opacity = "0"; setTimeout(() => c.a.remove(), 700); }
          if (i === actors.length - 1) { celebrating = false; if (empty) setTimeout(() => empty.classList.remove("hidden"), 600); }
        }, 3900 + (actors.length - 1 - i) * 3900 + 600);
      });
    };
    setTimeout(() => step(0), 600);
  }

  /* ---------- Tiere benutzen gekaufte Sachen ---------- */
  const ACT = {
    wasserschale: "*schlürf*", teich: "*platsch*", vogelbad: "*schlürf*", futter: "*mampf mampf*", stand: "Ein Plätzchen, bitte!", kakao: "Mit extra Sahne!",
    kissen: "Zzz …", strohballen: "Zzz …", hoehle: "So kuschelig hier …", bank: "Kurz ausruhen.", onsen: "Ahhh … herrlich.", feuer: "Schön warm!",
    teleskop: "Ein Stern mit Maske?!", buehne: "♪ La-la-la ♪", fotowand: "Cheese!", spielplatz: "Juhu!", rodel: "Huiii!", eisbahn: "Pirouette!",
    karussell: "Noch eine Runde!", kletter: "Ich bin ganz oben!", schaukel: "Höher!", blumen: "Die duften so gut!", tanne: "Wie schön geschmückt!",
    schneemann: "Hallo, Herr Schneemann!", iglu: "Schön kühl hier drin.", teddy: "Mein Kuschelfreund!", briefkasten: "Wunschzettel ist eingeworfen!",
    giesskanne: "Blumen gießen!", holz: "Holz für kalte Abende.", windrad: "Es dreht sich!", zwerg: "Guten Tag, Herr Zwerg!", statue: "Kalle in Gold!",
  };
  // jede Sache gehört zu einer Spruch-Gruppe mit 20 Varianten (texts.js)
  const ACT_GROUP = {
    wasserschale: "trinken", teich: "trinken", vogelbad: "trinken", futter: "essen", stand: "essen", kakao: "essen",
    kissen: "schlafen", strohballen: "schlafen", hoehle: "schlafen", bank: "schlafen", iglu: "schlafen", teddy: "schlafen",
    onsen: "waermen", feuer: "waermen", spielplatz: "spielen", rodel: "spielen", eisbahn: "spielen", karussell: "spielen", kletter: "spielen", schaukel: "spielen",
  };
  const LIVE = ["ball", "vogel"];
  let props = {};
  function mountProps(field) {
    props = {};
    if (typeof Zoo === "undefined") return;
    const M = sceneMap(field);
    LIVE.forEach((k) => {
      if (!Zoo.owns(k)) return;
      const [x, y, w, h] = Zoo.info(k)[4];
      const [lx, ty] = M.pct(x, y);
      const el = H.el("div", { class: "prop prop-" + k, style: `left:${lx}%;top:${ty}%;width:${((w * M.sc) / M.W) * 100}%;height:${((h * M.sc) / M.Hh) * 100}%;z-index:${Math.round(ty)}`, html: Zoo.preview(k, true) });
      field.append(el);
      props[k] = { el, x: lx, y: ty, home: [lx, ty] };
    });
  }
  function kickBall(c) {
    const b = props.ball; if (!b) return;
    const nx = clampN(b.x + (Math.random() - 0.5) * 40, 2, 92), ny = clampN(b.y + (Math.random() - 0.5) * 20, 50, 92);
    b.el.style.transition = "left 1.1s cubic-bezier(.2,.8,.3,1), top 1.1s cubic-bezier(.2,.8,.3,1)";
    b.el.animate([{ transform: "rotate(0)" }, { transform: `rotate(${nx > b.x ? 540 : -540}deg)` }], { duration: 1100, easing: "cubic-bezier(.2,.8,.3,1)" });
    b.el.style.left = nx + "%"; b.el.style.top = ny + "%"; b.el.style.zIndex = Math.round(ny);
    b.x = nx; b.y = ny;
    H.sfx.tone(300, 0.08, "sine", 0.12, 600);
  }
  function birdVisit() {
    const b = props.vogel; if (!b || !Zoo.owns("meisen") || b.busy) return;
    const field = b.el.parentElement; const M = sceneMap(field);
    const [mx, my] = M.pct(472, 268);
    b.busy = true;
    const fly = (x, y, dur, done) => { b.el.classList.add("flying"); b.el.style.transition = `left ${dur}s ease-in-out, top ${dur}s ease-in-out`; b.el.style.left = x + "%"; b.el.style.top = y + "%"; setTimeout(() => { b.el.classList.remove("flying"); done(); }, dur * 1000); };
    b.el.classList.toggle("flipx", mx < b.x);
    fly(mx, my, 1.6, () => {
      b.el.classList.add("pecking");
      setTimeout(() => { b.el.classList.remove("pecking"); b.el.classList.toggle("flipx", false); fly(b.home[0], b.home[1], 1.6, () => (b.busy = false)); }, 3500);
    });
  }
  function activityLoop() {
    if (document.hidden || celebrating || typeof Zoo === "undefined") return;
    const field = document.getElementById("zoo-pen");
    if (!field || !field.clientWidth) return;
    if (props.vogel && Math.random() < 0.35) birdVisit();
    const sadOnes = inlineCtrls.filter((c) => c.a.isConnected && !c.busy && c.a.classList.contains("sad"));
    if (sadOnes.length && Math.random() < 0.5) { H.pick(sadOnes).say(Texts.say("traurig"), 3200); return; }
    const keys = Object.keys(ACT).filter((k) => Zoo.owns(k)).concat(props.ball ? ["ball", "ball"] : []);
    const free = inlineCtrls.filter((c) => c.a.isConnected && !c.busy && !c.guest && !c.a.classList.contains("sad"));
    if (!keys.length || !free.length) return;
    const key = H.pick(keys), c = H.pick(free);
    const M = sceneMap(field);
    let tx, ty;
    if (key === "ball") { tx = props.ball.x + (Math.random() < 0.5 ? -6 : 6); ty = props.ball.y + 4; }
    else { const [ax, ay] = Zoo.anchorOf(key); [tx, ty] = M.pct(ax + (Math.random() - 0.5) * 60, ay + Math.random() * 20); }
    const aw = (c.a.offsetWidth / M.W) * 100;
    c.goTo(clampN(tx - aw / 2, 0, 94), clampN(ty, 46, 98), () => {
      if (key === "ball") { kickBall(c); c.say(Texts.say("ball"), 1800); }
      else c.say(Math.random() < 0.35 ? ACT[key] : Texts.say(ACT_GROUP[key] || "staunen"), 2800);
      setTimeout(() => (c.busy = false), 3200);
    }, true);
  }

  function album(area) {
    const wrap = H.el("div", { class: "album" });
    const sum = H.el("div", { class: "rar-sum" });
    Object.entries(RARITY).forEach(([k, r]) => {
      const all = VARIANTS.filter((v) => v.rarity === k);
      sum.append(H.el("div", { class: "rar-box", html: `<span class="rar r-${k}">${r.label}</span><b>${all.filter((v) => found.has(v.id)).length} / ${all.length}</b>` }));
    });
    const waiting = VARIANTS.filter((v) => !available(v)).length;
    wrap.append(sum, H.el("p", { class: "rar-hint", text: "Tippe auf ein gefundenes Tier, um sein Foto anzusehen. Die Tiere verstecken sich überall auf der Seite, seltene leuchten ein wenig. Die legendären kommen nur ganz selten vorbei – Augen offen halten!" + (waiting ? ` ${waiting} Tiere ziehen erst im Laufe des Dezembers ein.` : "") }));
    Object.keys(QUOTA).forEach((key) => {
      const sp = SPECIES[key];
      const vs = VARIANTS.filter((v) => v.sp === key);
      const n = vs.filter((v) => found.has(v.id)).length;
      const grid = H.el("div", { class: "album-grid" });
      vs.forEach((v) => {
        const has = found.has(v.id);
        const locked = !has && !available(v);
        const card = H.el("div", { class: "album-card r-" + v.rarity + (has ? "" : " missing") + (locked ? " locked" : "") });
        const pic = H.el("div", { class: "album-pic" }); pic.innerHTML = svg(v, { fit: true });
        if (has && typeof Photos !== "undefined") { card.classList.add("has-photo"); card.title = "Foto ansehen"; card.onclick = () => Photos.show(v, { replay: true }); }
        card.append(pic, H.el("b", { text: has ? v.name : "???" }), H.el("small", { text: has ? desc(v).replace(sp.name, "").replace(/^, /, "") || sp.name : locked ? `zieht am ${v.from}. Dezember ein` : "noch nicht gefunden" }), H.el("div", { html: rarityChip(v) }));
        grid.append(card);
      });
      wrap.append(H.el("h3", {}, sp.plural, H.el("span", { text: ` ${n}/${vs.length}` })), grid);
    });
    area.append(wrap);
  }

  // Meldung, wenn seit dem letzten Besuch eine neue Welle eingezogen ist
  function announceWaves() {
    if (App.preview) return;
    let seen = [];
    try { seen = JSON.parse(localStorage.getItem(KEY + "-wellen") || "[]"); } catch (e) {}
    const fresh = WAVES.filter((w) => w.day && App.isUnlocked(w.day) && !seen.includes(w.day));
    if (!fresh.length) return;
    try { localStorage.setItem(KEY + "-wellen", JSON.stringify([...seen, ...fresh.map((w) => w.day)])); } catch (e) {}
    setTimeout(() => { H.toast("🏡 " + fresh[fresh.length - 1].msg, 7000); H.sfx.jingle(); btn.classList.add("bump"); }, 2500);
  }

  /* ---------- Gehege auf der Startseite ---------- */
  const inlineTimers = new Set();
  const inlineLater = (fn, ms) => { const t = setTimeout(() => { inlineTimers.delete(t); fn(); }, ms); inlineTimers.add(t); };
  function refreshPens() {
    const f = document.getElementById("zoo-pen");
    if (!f) return;
    inlineTimers.forEach(clearTimeout); inlineTimers.clear();
    mountPen(f, inlineLater);
  }

  function init() {
    H = App.h;
    load();
    btn = H.el("button", { id: "gehege-btn", "aria-label": "Tiergehege öffnen" });
    btn.innerHTML = `<svg viewBox="0 0 40 30" width="30" height="22" aria-hidden="true"><g fill="#8a5a3b"><rect x="3" y="6" width="5" height="22" rx="2"/><rect x="17" y="6" width="5" height="22" rx="2"/><rect x="31" y="6" width="5" height="22" rx="2"/><rect x="0" y="11" width="40" height="4" rx="2"/><rect x="0" y="20" width="40" height="4" rx="2"/></g></svg><span>Gehege</span><span class="g-count"></span>`;
    btn.addEventListener("click", (e) => { e.stopPropagation(); H.sfx.boop(500); openGehege(); });
    setTimeout(hideLoop, 2500); setTimeout(hideLoop, 6000); setInterval(hideLoop, 8000);
    setInterval(activityLoop, 7500);
    document.body.append(btn);
    updateBtn();
    announceWaves();
    refreshPens();
    updateHunger(); setInterval(() => { updateHunger(); inlineCtrls.forEach((c) => !c.guest && c.setSad(hungry(c.v))); }, 60000);
    setTimeout(spawn, 600); setTimeout(spawn, 2500);
    setInterval(spawn, 2600);
  }

  return { SPECIES, VARIANTS, RARITY, refreshPens, hungryCount, updateHunger, ownedOf, celebrate, hideIn, clearIn, svg, inner, desc, init, openGehege, foundCount: () => found.size };
})();
