/* =========================================================
   Photos – für jedes gefundene Tier ein eigenes Polaroid
   ========================================================= */
const Photos = (() => {
  const W = 200, Hh = 170;

  /* ---------- Kulissen: bg hinter dem Tier, fg davor ---------- */
  const flakes = (n, seed, col = "#fff", rmax = 2.2) => { let s = seed, o = ""; const r = () => (s = (s * 16807) % 2147483647) / 2147483647; for (let i = 0; i < n; i++) o += `<circle cx="${(r() * 200) | 0}" cy="${(r() * 165) | 0}" r="${(0.8 + r() * rmax).toFixed(1)}" fill="${col}"/>`; return o; };
  const SCENES = {
    bad: { gy: 136, size: 0.84,
      bg: `<rect width="200" height="170" fill="#dff1f7"/><path d="M0 25H200M0 50H200M0 75H200M0 100H200M25 0V150M50 0V150M75 0V150M100 0V150M125 0V150M150 0V150M175 0V150" stroke="#c6e2ec" stroke-width="1.5"/><rect y="150" width="200" height="20" fill="#bcdbe6"/>`,
      fg: `<rect x="26" y="114" width="148" height="40" rx="16" fill="#fff" stroke="#cfe0e8" stroke-width="2"/><circle cx="44" cy="158" r="5" fill="#d8b46a"/><circle cx="156" cy="158" r="5" fill="#d8b46a"/>` +
        [34, 48, 62, 76, 90, 104, 118, 132, 146, 160].map((x, i) => `<circle cx="${x}" cy="${113 - (i % 2) * 3}" r="${8 + (i % 3)}" fill="#fff" stroke="#e3f1f6"/>`).join("") +
        `<circle cx="172" cy="100" r="7" fill="#ffd84d"/><circle cx="176" cy="93" r="5" fill="#ffd84d"/><path d="M180 93 l5 1 l-5 2z" fill="#f39c32"/>` },
    schnee: { gy: 150,
      bg: `<rect width="200" height="170" fill="#cfe6f7"/><path d="M0 128 Q60 112 120 126 T200 120 V170 H0Z" fill="#fff"/><circle cx="26" cy="124" r="16" fill="#fff" stroke="#dbe9f3"/><circle cx="26" cy="99" r="11" fill="#fff" stroke="#dbe9f3"/><circle cx="23" cy="97" r="1.4" fill="#333"/><circle cx="29" cy="97" r="1.4" fill="#333"/><path d="M26 100 l7 2 l-7 1z" fill="#f39c32"/>`,
      fg: flakes(26, 11) },
    kekse: { gy: 140,
      bg: `<rect width="200" height="170" fill="#fbe3c8"/><rect x="18" y="18" width="50" height="40" rx="4" fill="#cfe9fb" stroke="#fff" stroke-width="4"/><rect y="138" width="200" height="32" fill="#b9824f"/><rect y="138" width="200" height="5" fill="#a06d3f"/><rect x="148" y="96" width="34" height="42" rx="8" fill="#e3f4fb" opacity=".8" stroke="#bcd8e6"/><circle cx="158" cy="126" r="6" fill="#c98b4a"/><circle cx="171" cy="121" r="6" fill="#d9a05c"/><circle cx="164" cy="112" r="6" fill="#c98b4a"/><rect x="146" y="90" width="38" height="8" rx="3" fill="#b9824f"/>`,
      fg: `<ellipse cx="46" cy="152" rx="32" ry="8" fill="#fff"/><circle cx="36" cy="147" r="8" fill="#d9a05c"/><circle cx="52" cy="146" r="8" fill="#c98b4a"/><circle cx="44" cy="141" r="7" fill="#e2b06b"/><circle cx="34" cy="146" r="1.2" fill="#5a3b2e"/><circle cx="54" cy="145" r="1.2" fill="#5a3b2e"/>` },
    sofa: { gy: 140,
      bg: `<rect width="200" height="170" fill="#f3dbe3"/><rect x="74" y="16" width="52" height="38" rx="3" fill="#fff" stroke="#d9b98f" stroke-width="3"/><path d="M84 46 l12 -16 l10 10 l8 -6 l8 12z" fill="#9fd3a6"/><rect x="12" y="78" width="176" height="62" rx="18" fill="#8fb3d9"/><rect x="0" y="100" width="28" height="56" rx="12" fill="#7ea2c8"/><rect x="172" y="100" width="28" height="56" rx="12" fill="#7ea2c8"/><rect y="156" width="200" height="14" fill="#c9a07a"/>`,
      fg: `<rect x="20" y="136" width="160" height="20" rx="8" fill="#7ea2c8"/><path d="M150 132 q8 -10 16 0 q8 -10 16 0 l-16 16z" fill="#e85d75"/>` },
    baum: { gy: 150, ax: 128,
      bg: `<rect width="200" height="170" fill="#2f4a6b"/><rect y="148" width="200" height="22" fill="#6b4a35"/><polygon points="48,26 82,90 14,90" fill="#2f8a52"/><polygon points="48,52 90,132 6,132" fill="#2f8a52"/><rect x="42" y="132" width="12" height="14" fill="#7a5537"/><polygon points="48,14 51,22 59,22 53,27 55,35 48,30 41,35 43,27 37,22 45,22" fill="#ffd84d"/>` +
        [[36, 70, "#ff5a7a"], [58, 64, "#ffd84d"], [30, 104, "#58b6ff"], [64, 100, "#ff5a7a"], [46, 118, "#ffd84d"], [20, 124, "#c77dff"], [76, 122, "#4fd18b"], [48, 82, "#58b6ff"]].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="3.4" fill="${c}"/>`).join("") +
        `<rect x="160" y="128" width="30" height="22" fill="#e85d75"/><rect x="172" y="128" width="6" height="22" fill="#ffd84d"/>`,
      fg: "" },
    geschenke: { gy: 122, size: 0.84,
      bg: `<rect width="200" height="170" fill="#fff1e3"/>${flakes(30, 5, "#f6cfae", 2)}<rect y="158" width="200" height="12" fill="#e9cfb5"/>`,
      fg: `<rect x="44" y="108" width="112" height="56" rx="4" fill="#e85d75"/><rect x="94" y="108" width="12" height="56" fill="#ffd84d"/><rect x="44" y="126" width="112" height="10" fill="#ffd84d"/><rect x="6" y="132" width="34" height="30" fill="#4fae7f"/><rect x="20" y="132" width="6" height="30" fill="#fff"/><rect x="162" y="128" width="32" height="34" fill="#58b6ff"/><rect x="175" y="128" width="6" height="34" fill="#fff"/>` },
    party: { gy: 152,
      bg: `<rect width="200" height="170" fill="#ffe8f0"/><path d="M0 12 Q100 34 200 12" stroke="#c98b8b" fill="none"/>` +
        [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => { const x = 8 + i * 23, y = 14 + Math.sin((i / 8) * Math.PI) * 9; return `<polygon points="${x},${y} ${x + 16},${y} ${x + 8},${y + 16}" fill="${["#e85d75", "#ffd84d", "#58b6ff", "#4fd18b"][i % 4]}"/>`; }).join("") +
        `<ellipse cx="22" cy="62" rx="12" ry="15" fill="#c77dff"/><path d="M22 77 q4 20 -2 40" stroke="#999" fill="none"/><ellipse cx="180" cy="56" rx="12" ry="15" fill="#58b6ff"/><path d="M180 71 q-4 20 2 40" stroke="#999" fill="none"/><rect y="152" width="200" height="18" fill="#f0c9d6"/>`,
      fg: flakes(18, 7, "#e85d75", 1.6) + flakes(18, 13, "#58b6ff", 1.6) + flakes(14, 23, "#ffd84d", 1.6) },
    teich: { gy: 152,
      bg: `<rect width="200" height="170" fill="#cfe8f7"/><rect y="92" width="200" height="20" fill="#9fd08f"/><rect y="110" width="200" height="60" fill="#8fcbe8"/><ellipse cx="34" cy="120" rx="14" ry="5" fill="#5aa86a"/>`,
      fg: `<path d="M0 134 Q12 130 25 134 T50 134 T75 134 T100 134 T125 134 T150 134 T175 134 T200 134 V170 H0Z" fill="#7fc0e2" opacity=".88"/><path d="M60 146 q10 -4 20 0 M120 154 q10 -4 20 0 M30 160 q8 -3 16 0" stroke="#fff" stroke-width="1.6" fill="none" opacity=".8"/>` },
    nacht: { gy: 150,
      bg: `<rect width="200" height="170" fill="#1d2b52"/>${flakes(30, 3, "#fff6c9", 1.2)}<circle cx="160" cy="34" r="16" fill="#fff3c4"/><circle cx="168" cy="29" r="14" fill="#1d2b52"/><path d="M0 140 Q100 125 200 140 V170 H0Z" fill="#2c3d6b"/>`,
      fg: "" },
    karton: { gy: 126, size: 0.84,
      bg: `<rect width="200" height="170" fill="#efe6dc"/><rect y="150" width="200" height="20" fill="#d9c7b4"/>`,
      fg: `<polygon points="40,110 160,110 160,166 40,166" fill="#c9925a"/><polygon points="40,110 22,96 58,96 70,110" fill="#b37e49"/><polygon points="160,110 178,94 144,96 130,110" fill="#b37e49"/><text x="100" y="146" text-anchor="middle" font-size="9" font-family="Arial, sans-serif" font-weight="700" fill="#8a5a33">VORSICHT: KUSCHELIG</text>` },
    blumen: { gy: 150,
      bg: `<rect width="200" height="170" fill="#d6efff"/><circle cx="30" cy="28" r="14" fill="#ffe28a"/><rect y="108" width="200" height="62" fill="#a8d99a"/>` +
        [[20, 116, "#ff8fa3"], [60, 112, "#ffd84d"], [150, 114, "#c77dff"], [185, 118, "#ff8fa3"]].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="4" fill="${c}"/>`).join(""),
      fg: [[18, "#e85d75"], [44, "#ffd84d"], [150, "#c77dff"], [176, "#ff8fa3"], [196, "#ffd84d"]].map(([x, c]) => `<path d="M${x} 170 V150" stroke="#4f9e5c" stroke-width="2"/><circle cx="${x}" cy="148" r="6" fill="${c}"/><circle cx="${x}" cy="148" r="2.2" fill="#fff6c9"/>`).join("") +
        `<ellipse cx="158" cy="56" rx="6" ry="4" fill="#ffb347" transform="rotate(-30 158 56)"/><ellipse cx="166" cy="56" rx="6" ry="4" fill="#ffb347" transform="rotate(30 166 56)"/>` },
    regen: { gy: 150,
      bg: `<rect width="200" height="170" fill="#b9c4d0"/><ellipse cx="40" cy="18" rx="40" ry="16" fill="#98a5b4"/><ellipse cx="150" cy="14" rx="55" ry="18" fill="#98a5b4"/>` +
        Array.from({ length: 34 }, (_, i) => `<path d="M${(i * 37) % 200} ${(i * 53) % 150} l-4 10" stroke="#e6edf4" stroke-width="1.4"/>`).join("") +
        `<rect y="146" width="200" height="24" fill="#8d99a6"/><ellipse cx="100" cy="156" rx="60" ry="7" fill="#a9c6dd"/>`,
      fg: `<path d="M45 46 A55 40 0 0 1 155 46 Z" fill="#e85d75"/><path d="M45 46 q14 -8 27 0 q14 -8 28 0 q14 -8 28 0 q14 -8 27 0" fill="#c94060"/><path d="M100 46 V70" stroke="#5a3b2e" stroke-width="2.4"/>` },
    schlitten: { gy: 124, tilt: 14,
      bg: `<rect width="200" height="170" fill="#d8ecf9"/><polygon points="160,40 176,72 144,72" fill="#3f8a5a"/><polygon points="184,52 196,78 172,78" fill="#3f8a5a"/><path d="M0 92 L200 150 V170 H0Z" fill="#fff"/>${flakes(14, 9)}`,
      fg: `<g transform="rotate(14 100 126)"><rect x="56" y="122" width="88" height="8" rx="3" fill="#b9824f"/><path d="M52 136 H146 q10 0 8 -10" stroke="#c94060" stroke-width="3" fill="none"/><path d="M64 130 V136 M134 130 V136" stroke="#c94060" stroke-width="3"/></g><path d="M8 80 h26 M14 90 h22 M4 100 h20" stroke="#fff" stroke-width="3" stroke-linecap="round"/>` },
    kamin: { gy: 152, ax: 72,
      bg: `<rect width="200" height="170" fill="#e8c4a2"/><rect x="120" y="56" width="76" height="98" fill="#b5543f"/><path d="M120 76H196M120 96H196M120 116H196M120 136H196M140 56V76M170 76V96M140 96V116M170 116V136M140 136V154" stroke="#9c4434" stroke-width="1.5"/><rect x="114" y="50" width="86" height="10" fill="#8a5a3b"/><rect x="136" y="98" width="44" height="56" rx="20" fill="#3a2219"/><path d="M146 154 q4 -26 12 -34 q2 14 8 10 q6 10 -2 24z" fill="#f39c32"/><path d="M152 154 q2 -14 8 -18 q4 10 2 18z" fill="#ffd84d"/><path d="M130 60 v14 h-6 q-6 0 -6 6 q0 6 8 6 h8 v-26z" fill="#d93a4a"/><rect x="0" y="154" width="200" height="16" fill="#9c6b45"/><ellipse cx="72" cy="156" rx="56" ry="8" fill="#d36b6b"/>`,
      fg: "" },
    fotobox: { gy: 152,
      bg: Array.from({ length: 10 }, (_, i) => `<rect x="${i * 20}" width="20" height="170" fill="${i % 2 ? "#b33845" : "#c8434f"}"/>`).join("") +
        `<rect x="56" y="10" width="88" height="26" rx="8" fill="#fff"/><text x="100" y="29" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" font-size="15" fill="#c8434f">CHEESE!</text><rect y="152" width="200" height="18" fill="#7a2a33"/>`,
      fg: `<path d="M24 60 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 l8 -3z M176 80 l2 6 l6 2 l-6 2 l-2 6 l-2 -6 l-6 -2 l6 -2z" fill="#fff6c9"/>` },
    yoga: { gy: 148,
      bg: `<rect width="200" height="170" fill="#e5f2e7"/><rect x="20" y="16" width="56" height="50" rx="4" fill="#d6efff" stroke="#fff" stroke-width="4"/><rect x="162" y="114" width="26" height="34" rx="4" fill="#d9a05c"/><path d="M175 114 q-14 -30 -4 -44 q6 20 4 44 q4 -34 16 -40 q0 24 -16 40" fill="#4f9e5c"/><rect y="148" width="200" height="22" fill="#d9c7b4"/><rect x="34" y="144" width="132" height="10" rx="4" fill="#a78bd9"/>`,
      fg: "" },
    lesen: { gy: 150, ax: 88,
      bg: `<rect width="200" height="170" fill="#f2e3cf"/><rect y="40" width="200" height="5" fill="#8a5a3b"/><rect y="88" width="200" height="5" fill="#8a5a3b"/>` +
        Array.from({ length: 22 }, (_, i) => { const x = 4 + (i % 11) * 18, y = i < 11 ? 14 : 62, h = 20 + ((i * 7) % 8); return `<rect x="${x}" y="${y + 26 - h}" width="14" height="${h}" fill="${["#e85d75", "#4fae7f", "#58b6ff", "#ffb84d", "#a78bd9"][i % 5]}"/>`; }).join("") +
        `<rect y="150" width="200" height="20" fill="#c9a07a"/><path d="M182 150 V104 M170 104 h24 l-6 -14 h-12z" stroke="#5a3b2e" stroke-width="2" fill="#ffe28a"/>`,
      fg: `<path d="M120 160 q16 -8 32 0 q16 -8 32 0 v-22 q-16 -8 -32 0 q-16 -8 -32 0z" fill="#fff" stroke="#d9c7b4"/><path d="M152 138 v22" stroke="#d9c7b4"/><path d="M128 144 h18 M128 149 h18 M158 144 h18 M158 149 h18" stroke="#c6b4a4"/>` },
    eis: { gy: 150, tilt: -8,
      bg: `<rect width="200" height="170" fill="#dff3fb"/><polygon points="20,60 36,100 4,100" fill="#3f8a5a"/><polygon points="20,52 30,74 10,74" fill="#fff"/><polygon points="184,64 198,100 170,100" fill="#3f8a5a"/><ellipse cx="100" cy="140" rx="112" ry="40" fill="#eaf8ff"/><path d="M40 136 l30 -8 M120 150 l36 -10 M70 156 l20 -6" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`,
      fg: `<path d="M60 160 q20 -6 40 -2 M110 164 q20 -6 40 -2" stroke="#b9e1f2" stroke-width="2" fill="none"/>` },
    torte: { gy: 142, ax: 70,
      bg: `<rect width="200" height="170" fill="#fde4ec"/>${flakes(20, 17, "#f8c6d6", 2.5)}<rect y="140" width="200" height="30" fill="#e9b7c6"/><rect y="140" width="200" height="4" fill="#d79bb0"/>`,
      fg: `<rect x="122" y="112" width="62" height="30" rx="6" fill="#fff"/><rect x="122" y="112" width="62" height="10" rx="5" fill="#ff8fa3"/><rect x="130" y="94" width="46" height="20" rx="6" fill="#fff"/><rect x="130" y="94" width="46" height="7" rx="3" fill="#ff8fa3"/>` +
        [140, 153, 166].map((x) => `<rect x="${x}" y="80" width="4" height="14" fill="#58b6ff"/><path d="M${x + 2} 72 q4 5 0 8 q-4 -3 0 -8z" fill="#ffb347"/>`).join("") + `<ellipse cx="153" cy="143" rx="40" ry="5" fill="#fff" opacity=".7"/>` },
    kakao: { gy: 116, size: 0.74,
      bg: `<rect width="200" height="170" fill="#f4dcc6"/><path d="M80 40 q-8 -10 0 -20 M100 36 q-8 -10 0 -20 M120 40 q-8 -10 0 -20" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/><rect y="160" width="200" height="10" fill="#d9b48f"/><ellipse cx="100" cy="104" rx="56" ry="10" fill="#7b4a2c"/>`,
      fg: `<path d="M44 104 h112 v44 q0 18 -18 18 h-76 q-18 0 -18 -18z" fill="#e85d75"/><path d="M156 116 q26 0 26 18 q0 18 -26 18" stroke="#e85d75" stroke-width="9" fill="none"/>` +
        [[60, 126], [84, 140], [110, 124], [132, 146], [70, 154], [120, 158]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#fff"/>`).join("") +
        `<rect x="56" y="98" width="12" height="10" rx="3" fill="#fff"/><rect x="132" y="96" width="12" height="10" rx="3" fill="#fff"/>` },
    kino: { gy: 152, ax: 84,
      bg: `<rect width="200" height="170" fill="#2a2238"/><rect x="20" y="8" width="160" height="56" rx="4" fill="#fff6d5" opacity=".3"/><path d="M20 64 L0 150 H200 L180 64z" fill="#fff6d5" opacity=".07"/>` +
        Array.from({ length: 7 }, (_, i) => `<rect x="${i * 30 - 4}" y="140" width="26" height="30" rx="6" fill="#b33845"/>`).join(""),
      fg: `<polygon points="140,116 178,116 172,166 146,166" fill="#fff"/><path d="M146 116 l4 50 M156 116 l1 50 M166 116 l-2 50 M176 116 l-5 50" stroke="#e85d75" stroke-width="5"/>` +
        [[146, 112], [155, 108], [164, 111], [172, 108], [150, 104], [161, 102], [168, 104]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#fff8e1"/>`).join("") },
    tonne: { gy: 124, size: 0.84,
      bg: `<rect width="200" height="170" fill="#c98f74"/><path d="M0 20H200M0 40H200M0 60H200M0 80H200M0 100H200M0 120H200M20 0V20M60 20V40M100 0V20M140 20V40M180 0V20M40 40V60M80 60V80M120 40V60M160 60V80M20 80V100M100 80V100M60 100V120M140 100V120" stroke="#b47a60" stroke-width="2"/><rect y="146" width="200" height="24" fill="#8a8f99"/>`,
      fg: `<path d="M54 108 h92 l-6 58 h-80z" fill="#8c96a3"/><path d="M70 112 l3 50 M100 112 v50 M130 112 l-3 50" stroke="#76808d" stroke-width="3"/><rect x="132" y="80" width="62" height="10" rx="4" fill="#9aa4b1" transform="rotate(28 132 80)"/><path d="M30 160 q8 -12 16 0 q-8 -4 -16 0z" fill="#ffd84d"/>` },
  };

  /* ---------- Die 100 Fotos (Reihenfolge = Tier-Nummer) ---------- */
  // [Kulisse, Bildunterschrift, Extras]  Extras: f = gespiegelt, m = Stimmung
  const DATA = [
    ["bad", "Wellness-Urlaub. Die Mandarine bleibt trocken.", { m: "dampf" }],
    ["sofa", "Hat das Sofa zum Kapibara-Gebiet erklärt.", { m: "zzz" }],
    ["baum", "Hält sich für die Christbaumspitze.", {}],
    ["schnee", "Ein Kapibara namens Bello. Er hat nie gefragt, warum.", {}],
    ["geschenke", "Hat sich selbst eingepackt. Für dich.", { m: "herz" }],
    ["lesen", "Liest „Gelassenheit für Fortgeschrittene“. Kapitel 1: Liegen.", {}],
    ["teich", "Königin des Planschbeckens.", { f: 1 }],
    ["schlitten", "Hat sich als Rentier beworben. Probefahrt läuft.", {}],
    ["fotobox", "Golden. Gekrönt. Gelassen. Ein Foto für die Geschichtsbücher.", { m: "sterne" }],
    ["kekse", "Auf frischer Tat ertappt. Er streitet alles ab.", { m: "kruemel" }],
    ["regen", "Wäscht heute nichts. Das erledigt der Regen.", {}],
    ["karton", "Hat ein neues Zuhause gefunden: diesen Karton.", {}],
    ["kino", "Schaut „Ocean's Eleven“. Rein zu Recherchezwecken.", {}],
    ["tonne", "Selbsternannter König der Mülltonnen.", { f: 1 }],
    ["schnee", "Wollte nur kurz Rentier spielen. Jetzt ist sie im Dienst.", { m: "schweiss" }],
    ["blumen", "Hat Blumen mitgebracht. Woher? Besser nicht fragen.", { m: "herz" }],
    ["kamin", "Hat den besten Platz am Kamin. Wie jeden Abend.", { m: "zzz" }],
    ["geschenke", "Hat das Geschenkpapier getestet. Ergebnis: knistert prima.", {}],
    ["lesen", "Liest. Also: liegt auf dem Buch.", { f: 1 }],
    ["sofa", "Regiert vom Sofa aus. Audienzen nur gegen Leckerli.", {}],
    ["baum", "Findet, der Baum braucht dringend eine Katze.", { m: "sterne" }],
    ["blumen", "Riecht an Blumen. Und frisst sie dann. Leider.", {}],
    ["fotobox", "Bereit für den Opernball.", {}],
    ["schnee", "Finde Flocke. (Kleiner Tipp: Sie ist weiß.)", {}],
    ["party", "Hat Geburtstag. Jeden Tag. Sagt er.", { m: "herz" }],
    ["kino", "Weint bei jedem Hundefilm mit Happy End.", { f: 1 }],
    ["party", "Der 102. Dalmatiner. Und der einzige mit Krone.", {}],
    ["schlitten", "Zieht den Schlitten. Theoretisch.", { m: "schweiss" }],
    ["blumen", "Hat das Beet umgegraben. Für dich. Gern geschehen.", {}],
    ["torte", "Hat die Torte nur bewacht. Ehrlich.", { m: "kruemel" }],
    ["schnee", "50 Flecken, 1000 Flocken.", { f: 1 }],
    ["kakao", "Mops in Kakao. Mit Sahne, bitte.", {}],
    ["nacht", "Sieht den Weihnachtsmann schon von Weitem.", {}],
    ["baum", "Hat den Stern aufgesetzt. Ganz ohne Leiter.", { f: 1 }],
    ["schnee", "Das größte Rentier aller Zeiten.", {}],
    ["blumen", "Riecht an Blumen – mit etwas längerer Anreise.", {}],
    ["party", "Ehrengast. Passt leider durch keine Tür.", {}],
    ["schnee", "Königin des Winterwaldes. Schlau und schick.", { f: 1 }],
    ["eis", "Pirouette in Weiß. Die Jury ist sprachlos.", { m: "sterne" }],
    ["kekse", "Ein Fuchs namens Keks vor einem Keks. Verwechslungsgefahr!", {}],
    ["kamin", "Schlauer Fuchs im Smoking. Wartet auf den Weihnachtsmann.", {}],
    ["nacht", "Im Mondschein fast unsichtbar. Und ganz bezaubernd.", { m: "sterne" }],
    ["geschenke", "Hat die Geschenke schon mal sortiert. Und geöffnet.", { f: 1 }],
    ["schlitten", "Probefahrt für Heiligabend. Bremsen? Optional.", {}],
    ["yoga", "Macht Yoga. Die Position heißt: Roter Panda.", {}],
    ["kakao", "Serviert Kakao. Den er gerade selbst trinkt.", {}],
    ["karton", "Wohnt jetzt hier. Die Miete zahlt sie in Kuscheleinheiten.", { f: 1 }],
    ["baum", "Schmückt den Baum. Vor allem mit sich selbst.", {}],
    ["blumen", "Sieht zum ersten Mal Blumen. Ist hin und weg.", { m: "herz" }],
    ["fotobox", "Trägt immer Frack. Heute mit Fliege, weil's festlich ist.", {}],
    ["eis", "Fällt nie hin. Sagt sie.", {}],
    ["schlitten", "Rutscht lieber auf dem Bauch. Der Schlitten ist Deko.", {}],
    ["regen", "Friert nie. Der Schal ist eine reine Stilfrage.", {}],
    ["party", "Erste Party, und watschelt souverän über die Tanzfläche.", { f: 1 }],
    ["torte", "Stargast der Teeparty. Bitte nicht umarmen.", {}],
    ["fotobox", "Die Frisur sitzt.", {}],
    ["nacht", "Sollte eigentlich Winterschlaf machen. Aber es ist Advent!", { m: "zzz" }],
    ["kakao", "Heißt Tiger. Hat nie verstanden, warum alle lachen.", { y: -6 }],
    ["geschenke", "Das stacheligste Geschenk der Welt.", { m: "herz" }],
    ["schnee", "Wo hört der Hase auf, wo fängt der Winter an?", {}],
    ["kamin", "Wartet auf Bonnie. Seit Stunden. Sehr romantisch.", { f: 1 }],
    ["yoga", "Hat Yoga ausprobiert. Lieblingsübung: Hoppeln.", {}],
    ["torte", "Hat die Möhrentorte gebacken. Und auch gegessen.", { m: "kruemel" }],
    ["lesen", "Liest die Möhrenzeitung. Kurse: steigend.", {}],
    ["fotobox", "Frisch gekrönte Miss Hoppelhausen.", { m: "sterne" }],
    ["schnee", "Tarnung perfekt. Nur die Mütze verrät ihn.", {}],
    ["nacht", "Das schwarze Schaf der Familie. Und stolz darauf.", {}],
    ["sofa", "Ist kein Schaf, sondern ein Kissen mit Beinen.", { m: "zzz" }],
    ["lesen", "Zählt keine Schafe. Liest lieber.", { f: 1 }],
    ["party", "Einstimmig zum König der Herde gewählt. Er war der Einzige.", {}],
    ["schlitten", "Hat jetzt ein Geweih. Bleibt aber ein Wollknäuel.", {}],
    ["teich", "Im Spa. Schlamm war aus, Wasser tut's auch.", {}],
    ["torte", "Hat sich extra für die Torte schick gemacht.", { f: 1 }],
    ["kino", "Schaut „Ein Schweinchen namens Babe“. Zum zwölften Mal.", {}],
    ["kekse", "Schweinchen-König. Steuern zahlt man hier in Plätzchen.", {}],
    ["schnee", "Das erste Rentier mit Ringelschwanz.", { f: 1 }],
    ["bad", "Duscht. Die Brause ist eingebaut.", { y: -10 }],
    ["lesen", "Vergisst nie etwas. Liest trotzdem gern nach.", {}],
    ["party", "Der Elefant im Raum. Alle haben ihn gesehen.", {}],
    ["baum", "Hat den Baum geschmückt. Ganz vorsichtig. Fast.", {}],
    ["fotobox", "Rosa. Gekrönt. Wer ihn sieht, darf sich etwas wünschen.", { m: "sterne" }],
    ["teich", "Plant das Weihnachtsessen. Muscheln stehen fest.", {}],
    ["eis", "Eiskunstlauf-Königin. Pflicht und Kür.", { f: 1 }],
    ["bad", "Hat den Badeschaum überdosiert. Bereut nichts.", { y: -16 }],
    ["teich", "Hält gern Händchen. Mit wem, verrät sie nicht.", { m: "herz" }],
    ["party", "Ehrengast beim Weihnachtsschwimmen.", {}],
    ["karton", "Hat den Karton zum Boot erklärt.", { y: -14 }],
    ["bad", "Badewannen-Kapitän und Quietsche-König.", { f: 1 }],
    ["regen", "Findet das Wetter herrlich.", {}],
    ["teich", "Hat den schönsten Teich der Stadt gefunden.", {}],
    ["party", "Tanzt. Watschelnd, aber mit voller Hingabe.", {}],
    ["yoga", "Meditiert. Ommm … quak.", { m: "zzz" }],
    ["kamin", "Heißt Nugget. Bitte nicht weiter darüber nachdenken.", {}],
    ["nacht", "Sollte Winterschlaf halten. Macht stattdessen Rentier-Training.", { m: "schweiss" }],
    ["eis", "Ein Eisbär namens Pommes. Ja, wirklich.", {}],
    ["kino", "Schaut Kung-Fu-Filme. Für die Technik.", {}],
    ["kekse", "Hat keinen Honig gefunden. Kekse gehen auch.", { m: "kruemel", f: 1 }],
    ["sofa", "Macht es sich gemütlich. Bis Februar.", { m: "zzz" }],
    ["kakao", "Friert nie, trinkt trotzdem Kakao. Wegen der Sahne.", {}],
    ["baum", "Schwarz, weiß, legendär. Das schönste Foto der Sammlung.", { m: "sterne" }],
  ];

  const MOOD = {
    zzz: (x, y) => `<text x="${x + 10}" y="${y + 4}" font-family="Arial, sans-serif" font-weight="700" fill="#6b7bb8" font-size="11">z</text><text x="${x + 18}" y="${y - 6}" font-family="Arial, sans-serif" font-weight="700" fill="#6b7bb8" font-size="15">Z</text>`,
    herz: (x, y) => `<text x="${x + 8}" y="${y}" fill="#e85d75" font-size="16">♥</text><text x="${x - 12}" y="${y - 10}" fill="#ff8fa3" font-size="11">♥</text>`,
    sterne: (x, y) => [[x + 12, y - 4, 8], [x - 16, y - 12, 6], [x + 26, y + 16, 5]].map(([a, b, r]) => `<path d="M${a} ${b - r} L${a + r * 0.3} ${b - r * 0.3} L${a + r} ${b} L${a + r * 0.3} ${b + r * 0.3} L${a} ${b + r} L${a - r * 0.3} ${b + r * 0.3} L${a - r} ${b} L${a - r * 0.3} ${b - r * 0.3}Z" fill="#ffd84d"/>`).join(""),
    kruemel: (x, y) => [[0, 28], [8, 34], [-6, 38], [14, 40], [4, 44]].map(([a, b]) => `<circle cx="${x + a}" cy="${y + b}" r="1.8" fill="#b9824f"/>`).join(""),
    dampf: (x, y) => `<path d="M${x - 10} ${y - 4} q-5 -7 0 -13 M${x} ${y - 6} q-5 -7 0 -13 M${x + 10} ${y - 4} q-5 -7 0 -13" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round"/>`,
    schweiss: (x, y) => `<path d="M${x + 14} ${y + 4} q4 6 0 9 q-4 -3 0 -9z" fill="#7fc0e2"/>`,
  };

  function scene(v) {
    const d = DATA[v.id] || ["fotobox", "", {}];
    const sc = SCENES[d[0]], o = d[2] || {};
    const a = Animals.inner(v);
    const s = Math.min(130 / a.W, 112 / a.H) * (sc.size || 1);
    const ax = sc.ax || 100, gy = sc.gy + (o.y || 0);
    const w = a.W * s, h = a.H * s;
    const tf = o.f ? `translate(${ax + w / 2} ${gy - h}) scale(${-s} ${s})` : `translate(${ax - w / 2} ${gy - h}) scale(${s})`;
    const headX = ax + (o.f ? -1 : 1) * w * 0.32, headY = gy - h + 8;
    const tilt = sc.tilt ? `rotate(${sc.tilt} ${ax} ${gy})` : "";
    return `<svg viewBox="0 0 ${W} ${Hh}" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block">${sc.bg}<g transform="${tilt}"><g transform="${tf}">${a.content}</g></g>${sc.fg}${o.m ? MOOD[o.m](headX, headY) : ""}</svg>`;
  }
  const caption = (v) => (DATA[v.id] ? DATA[v.id][1] : "");

  /* ---------- Das Polaroid ---------- */
  const queue = [];
  let busy = false;
  const today = () => new Date().toLocaleDateString("de-DE", { day: "numeric", month: "long" });

  function show(v, opts = {}) {
    queue.push([v, opts]);
    if (!busy) next();
  }
  function next() {
    const item = queue.shift();
    if (!item) { busy = false; return; }
    busy = true;
    const [v, opts] = item;
    const H = App.h;
    const flash = H.el("div", { class: "cam-flash" });
    document.body.append(flash);
    flash.addEventListener("animationend", () => flash.remove());
    H.sfx.tone(2200, 0.03, "square", 0.08); H.sfx.tone(700, 0.06, "square", 0.07, null, 0.04); H.sfx.tone(1400, 0.25, "sine", 0.05, 300, 0.1);
    const rarity = Animals.RARITY[v.rarity];
    const photo = H.el("div", { class: "pola-photo" + (opts.replay ? " done" : ""), html: scene(v) });
    const card = H.el("div", { class: "polaroid r-" + v.rarity, style: `--rot:${(Math.random() * 6 - 3).toFixed(1)}deg` },
      photo,
      H.el("div", { class: "pola-cap" }, H.el("b", { text: v.name + ": " }), caption(v)),
      H.el("div", { class: "pola-meta" }, H.el("span", { text: Animals.desc(v) }), H.el("span", { text: opts.replay ? "" : today() })),
      v.rarity !== "haeufig" ? H.el("div", { class: "pola-sticker r-" + v.rarity, text: rarity.label }) : null);
    const btn = H.el("button", { class: "btn btn-green", text: opts.replay ? "Zurück zum Album" : "Ins Album kleben" });
    const wrap = H.el("div", { class: "pola-wrap", role: "dialog", "aria-label": "Foto von " + v.name }, card, btn);
    document.body.append(wrap);
    let gone = false, timer;
    const close = () => {
      if (gone) return; gone = true; clearTimeout(timer);
      const g = document.getElementById("gehege-btn");
      const r = card.getBoundingClientRect(), b = g ? g.getBoundingClientRect() : { left: innerWidth - 60, top: innerHeight - 60, width: 0, height: 0 };
      btn.remove();
      const anim = opts.replay
        ? card.animate([{ opacity: 1 }, { opacity: 0, transform: "scale(.9) rotate(var(--rot))" }], { duration: 250 })
        : card.animate([{ transform: "rotate(var(--rot))" }, { transform: `translate(${b.left + b.width / 2 - r.left - r.width / 2}px, ${b.top + b.height / 2 - r.top - r.height / 2}px) scale(.08) rotate(30deg)`, opacity: 0.4 }], { duration: 600, easing: "cubic-bezier(.5,0,.3,1)" });
      wrap.classList.add("closing");
      anim.onfinish = () => { wrap.remove(); setTimeout(next, 200); };
    };
    btn.onclick = (e) => { e.stopPropagation(); H.sfx.pop(); close(); };
    wrap.onclick = (e) => { if (e.target === wrap) close(); };
    card.onclick = (e) => { e.stopPropagation(); H.burstAt(card, ["💖", "✨"], 6, 60); H.sfx.boop(500); };
    if (!opts.replay) timer = setTimeout(close, 14000);
  }

  return { show, scene, caption, count: DATA.length };
})();
