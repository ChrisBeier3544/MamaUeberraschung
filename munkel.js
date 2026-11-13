/* ============================================================
   Der Munkelvogel – ein kleines, rundes Rotkehlchen, das gern
   Geheimnisse „munkelt“. Eigene Figur, als SVG gezeichnet.
   Munkel.svg(opts)   → SVG-Text (opts: scarf, hat, size)
   Munkel.mount(host, opts) → setzt ihn lebendig (blinzeln, atmen,
                               Köpfchen neigen, hüpfen) in ein Element
   ============================================================ */
const Munkel = (() => {
  let uid = 0;
  function svg(o = {}) {
    const id = "mk" + ++uid;
    const scarf = o.scarf !== false;
    return `<svg class="munkel-svg" viewBox="0 0 140 140" aria-hidden="true">
  <defs>
    <radialGradient id="${id}b" cx=".38" cy=".3" r=".8"><stop offset="0" stop-color="#b98a62"/><stop offset=".6" stop-color="#8e6142"/><stop offset="1" stop-color="#6e4630"/></radialGradient>
    <radialGradient id="${id}r" cx=".45" cy=".35" r=".75"><stop offset="0" stop-color="#ffb07a"/><stop offset=".7" stop-color="#f07f52"/><stop offset="1" stop-color="#e06a45"/></radialGradient>
    <radialGradient id="${id}w" cx=".5" cy=".35" r=".7"><stop offset="0" stop-color="#fffaf2"/><stop offset="1" stop-color="#f1e3cf"/></radialGradient>
    <radialGradient id="${id}e" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#4a3428"/><stop offset=".7" stop-color="#1e140f"/></radialGradient>
  </defs>
  ${o.sit ? "" : `<ellipse cx="70" cy="128" rx="30" ry="5" fill="rgba(40,25,15,.18)"/>`}
  <!-- Schwänzchen -->
  <g class="mk-tail"><path d="M28 92 C14 90 8 98 6 106 C16 104 22 106 30 102Z" fill="#6e4630"/><path d="M30 96 C20 98 16 104 15 110 C23 106 28 106 33 103Z" fill="#7d5338"/></g>
  ${o.sit ? `<!-- baumelnde Beinchen (sitzend) -->
  <g class="mk-leg mk-leg-l" stroke="#e59a3c" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="M60 110 L58 136 M58 136 l-7 3 M58 136 l0 7 M58 136 l7 3"/></g>
  <g class="mk-leg mk-leg-r" stroke="#e59a3c" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="M80 110 L82 136 M82 136 l-7 3 M82 136 l0 7 M82 136 l7 3"/></g>` : `<!-- Füßchen -->
  <g class="mk-feet" stroke="#e59a3c" stroke-width="3" stroke-linecap="round" fill="none"><path d="M60 116 v9 M60 125 l-5 3 M60 125 l5 3"/><path d="M80 116 v9 M80 125 l-5 3 M80 125 l5 3"/></g>`}
  <g class="mk-body">
    <!-- Kugelkörper -->
    <ellipse cx="70" cy="80" rx="46" ry="42" fill="url(#${id}b)"/>
    <!-- Bauch und rote Brust -->
    <ellipse cx="72" cy="94" rx="31" ry="26" fill="url(#${id}w)"/>
    <path d="M38 70 C40 52 56 46 72 47 C90 48 104 56 105 72 C103 88 90 96 72 96 C54 96 40 88 38 70Z" fill="url(#${id}r)"/>
    <path d="M50 60 q8 -6 16 -4" stroke="#ffd2b0" stroke-width="3" stroke-linecap="round" fill="none" opacity=".7"/>
    <!-- Flügelchen -->
    <g class="mk-wing"><path d="M100 72 C116 74 122 92 112 106 C106 112 96 108 96 98 C96 88 96 78 100 72Z" fill="#7d5338"/><path d="M104 84 q6 6 4 16 M100 88 q5 6 3 14" stroke="#5e3b27" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".6"/></g>
    <g class="mk-wing mk-wing-l"><path d="M40 72 C26 76 22 92 30 104 C36 110 44 106 44 96 C44 86 44 78 40 72Z" fill="#7d5338"/></g>
    ${scarf ? `<!-- Strickschal -->
    <g class="mk-scarf"><path d="M42 88 C54 98 88 98 100 88 L102 96 C88 106 54 106 40 96Z" fill="#8e2d3b"/>
      <path d="M48 92 v6 M56 95 v6 M64 96 v6 M72 96 v6 M80 96 v6 M88 95 v6 M95 92 v6" stroke="#b5485a" stroke-width="1.6"/>
      <path class="mk-scarf-end" d="M88 98 L94 120 L84 122 L80 100Z" fill="#8e2d3b"/><path d="M84 120 v5 M88 120 v5 M92 119 v5" stroke="#c9a04a" stroke-width="2" stroke-linecap="round"/></g>` : ""}
    <!-- Köpfchen -->
    <g class="mk-head">
      <path class="mk-tuft" d="M66 18 C62 8 70 4 72 12 C74 4 82 6 78 16 C76 20 70 22 66 18Z" fill="#8e6142"/>
      <circle cx="70" cy="44" r="30" fill="url(#${id}b)"/>
      <path d="M44 52 C46 66 58 74 72 74 C86 74 98 66 100 52 C96 60 86 64 72 64 C58 64 48 60 44 52Z" fill="url(#${id}r)"/>
      <!-- Bäckchen -->
      <ellipse cx="50" cy="56" rx="7" ry="4.5" fill="#ff8fa3" opacity=".75"/><ellipse cx="92" cy="56" rx="7" ry="4.5" fill="#ff8fa3" opacity=".75"/>
      <!-- große Glanzaugen -->
      <g class="mk-eyes">
        <ellipse cx="58" cy="44" rx="9" ry="10.5" fill="#fff"/><ellipse cx="84" cy="44" rx="9" ry="10.5" fill="#fff"/>
        <ellipse cx="59" cy="45" rx="6.8" ry="8" fill="url(#${id}e)"/><ellipse cx="83" cy="45" rx="6.8" ry="8" fill="url(#${id}e)"/>
        <circle cx="61.5" cy="41.5" r="2.8" fill="#fff"/><circle cx="85.5" cy="41.5" r="2.8" fill="#fff"/>
        <circle cx="57" cy="48.5" r="1.3" fill="#fff" opacity=".8"/><circle cx="81" cy="48.5" r="1.3" fill="#fff" opacity=".8"/>
      </g>
      <!-- glücklich geschlossene Augen (für verträumte Momente) -->
      <g class="mk-happy" stroke="#2b1a10" stroke-width="2.8" stroke-linecap="round" fill="none"><path d="M50 46 Q58 37 66 46"/><path d="M76 46 Q84 37 92 46"/></g>
      <g class="mk-lids" fill="#8e6142"><ellipse cx="58" cy="44" rx="9.6" ry="11"/><ellipse cx="84" cy="44" rx="9.6" ry="11"/></g>
      <!-- Schnäbelchen -->
      <path class="mk-beak" d="M66 55 Q71 53 76 55 L71 61Z" fill="#f2b13c" stroke="#d48a22" stroke-width="1" stroke-linejoin="round"/>
    </g>
  </g>
</svg>`;
  }

  // lebendig machen: blinzeln, ab und zu Köpfchen neigen oder hüpfen
  function mount(host, o = {}) {
    const el = document.createElement("div");
    el.className = "munkel" + (o.sit ? " mk-sit" : "") + (o.dreamy ? " mk-dreamy" : "") + (o.cls ? " " + o.cls : "");
    el.setAttribute("role", "img");
    el.setAttribute("aria-label", "Der Munkelvogel");
    el.innerHTML = svg(o);
    host.append(el);
    let alive = true;
    const act = (cls, ms) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); setTimeout(() => el.classList.remove(cls), ms); };
    const loop = () => {
      if (!alive || !el.isConnected) return;
      if (!document.hidden) {
        const r = Math.random();
        if (o.dreamy) { if (r < 0.35) act("mk-blink", 300); else if (r < 0.6) act("mk-sigh", 2600); else if (r < 0.82) act("mk-tilt", 1400); else act("mk-flutter", 900); }
        else if (r < 0.45) act("mk-blink", 260);
        else if (r < 0.7) act("mk-tilt", 1400);
        else if (r < 0.85) act("mk-hop", 700);
        else act("mk-flutter", 900);
      }
      setTimeout(loop, 1800 + Math.random() * 2600);
    };
    setTimeout(loop, 900);
    if (o.dreamy) setTimeout(() => act("mk-sigh", 2600), 3200);
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      act("mk-hop", 700); setTimeout(() => act("mk-flutter", 900), 150);
      if (typeof o.onTap === "function") o.onTap(el);
    });
    el.say = (text, ms = 3600) => {
      el.querySelector(".mk-bubble")?.remove();
      const b = document.createElement("div"); b.className = "mk-bubble"; b.textContent = text;
      el.append(b); setTimeout(() => b.remove(), ms);
    };
    el.stop = () => { alive = false; };
    return el;
  }
  return { svg, mount };
})();
