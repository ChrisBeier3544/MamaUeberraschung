/* ============================================================
   Der Munkelvogel – ein kleines, rundes Rotkehlchen, das gern
   Geheimnisse „munkelt“. Eigene Figur, als SVG gezeichnet.

   Munkel.svg(opts)         → SVG-Text
   Munkel.mount(host, opts) → lebendige Figur mit:
     el.face(name)   Gesichtsausdruck: normal, dreamy, wow, happy, sleepy,
                     sleep, shy, wink, sad, focus
     el.legs(name)   Beinhaltung: dangle (sitzt auf einer Kante), stand,
                     tuck (im Flug/Nest), hang (kopfüber festgekrallt)
     el.fly(on)      Flugpose mit ausgebreiteten Flügeln; el.glide(on)
     el.slim(on)     etwas schlanker (nach dem Morgensport)
     el.say(text)    Sprechblase – schwebt immer gerade über ihm
     el.carry(svg)   etwas im Schnabel; el.setHat(svg); el.act(cls, ms)
   ============================================================ */
const Munkel = (() => {
  let uid = 0;
  const BROWN = "#8e6142";
  function svg(o = {}) {
    const id = "mk" + ++uid;
    const scarf = o.scarf !== false;
    const eye = (cx, side) => `
        <g class="mk-eye mk-eye-${side}">
          <ellipse cx="${cx}" cy="44" rx="9" ry="10.5" fill="#fff"/>
          <g clip-path="url(#${id}c${side})">
            <g class="mk-pupil"><ellipse cx="${cx + 1}" cy="45" rx="6.4" ry="7.6" fill="url(#${id}e)"/><circle cx="${cx + 3.4}" cy="41.6" r="2.6" fill="#fff"/><circle cx="${cx - 1.2}" cy="48.4" r="1.2" fill="#fff" opacity=".8"/></g>
            <rect class="mk-lid" x="${cx - 11}" y="12" width="22" height="22" fill="${BROWN}"/>
            <path class="mk-lid-low" d="M${cx - 11} 58 h22 v-4 q-11 -6 -22 0z" fill="#f07f52"/>
          </g>
          <ellipse cx="${cx}" cy="44" rx="9" ry="10.5" fill="none" stroke="#6e4630" stroke-width=".8" opacity=".5"/>
          <path class="mk-arc" d="M${cx - 8} 46 Q${cx} 37 ${cx + 8} 46" stroke="#2b1a10" stroke-width="2.8" stroke-linecap="round" fill="none"/>
          <path class="mk-arc-low" d="M${cx - 8} 42 Q${cx} 50 ${cx + 8} 42" stroke="#2b1a10" stroke-width="2.6" stroke-linecap="round" fill="none"/>
        </g>`;
    return `<svg class="munkel-svg" viewBox="0 0 140 140" aria-hidden="true">
  <defs>
    <radialGradient id="${id}b" cx=".38" cy=".3" r=".8"><stop offset="0" stop-color="#b98a62"/><stop offset=".6" stop-color="${BROWN}"/><stop offset="1" stop-color="#6e4630"/></radialGradient>
    <radialGradient id="${id}r" cx=".45" cy=".35" r=".75"><stop offset="0" stop-color="#ffb07a"/><stop offset=".7" stop-color="#f07f52"/><stop offset="1" stop-color="#e06a45"/></radialGradient>
    <radialGradient id="${id}w" cx=".5" cy=".35" r=".7"><stop offset="0" stop-color="#fffaf2"/><stop offset="1" stop-color="#f1e3cf"/></radialGradient>
    <radialGradient id="${id}e" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#4a3428"/><stop offset=".7" stop-color="#1e140f"/></radialGradient>
    <linearGradient id="${id}f" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6e4630"/><stop offset="1" stop-color="#9c6f4d"/></linearGradient>
    <clipPath id="${id}cl"><ellipse cx="58" cy="44" rx="9" ry="10.5"/></clipPath>
    <clipPath id="${id}cr"><ellipse cx="84" cy="44" rx="9" ry="10.5"/></clipPath>
  </defs>
  <ellipse class="mk-shadow" cx="70" cy="128" rx="30" ry="5" fill="rgba(40,25,15,.18)"/>
  <!-- Schwanzfedern -->
  <g class="mk-tail"><path d="M28 92 C14 90 8 98 6 106 C16 104 22 106 30 102Z" fill="#6e4630"/><path d="M30 96 C20 98 16 104 15 110 C23 106 28 106 33 103Z" fill="#7d5338"/></g>
  <!-- Beine: je nach Haltung ist eine Variante sichtbar -->
  <g class="mk-legs" stroke="#e59a3c" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <g class="lg-stand" stroke-width="3.4"><path d="M60 114 v11 M60 125 l-6 3 M60 125 l0 5 M60 125 l6 3"/><path d="M80 114 v11 M80 125 l-6 3 M80 125 l0 5 M80 125 l6 3"/></g>
    <g class="lg-dangle" stroke-width="4"><g class="mk-leg mk-leg-l"><path d="M60 110 L58 136 M58 136 l-7 3 M58 136 l0 7 M58 136 l7 3"/></g><g class="mk-leg mk-leg-r"><path d="M80 110 L82 136 M82 136 l-7 3 M82 136 l0 7 M82 136 l7 3"/></g></g>
    <g class="lg-tuck" stroke-width="3.4"><path d="M62 114 q-2 6 -8 7 M62 118 l-5 3"/><path d="M78 114 q2 6 8 7 M78 118 l5 3"/></g>
  </g>
  <!-- ausgebreitete Flugflügel (hinter dem Körper) -->
  <g class="mk-fwing mk-fwing-l"><path d="M44 72 C26 56 6 54 -10 62 C0 64 4 68 -4 74 C6 74 10 78 2 84 C14 82 20 86 16 92 C30 88 40 84 46 82Z" fill="url(#${id}f)"/><path d="M40 74 C28 66 14 64 2 68 M38 80 C26 76 16 78 8 82" stroke="#5e3b27" stroke-width="1.4" fill="none" opacity=".55"/></g>
  <g class="mk-fwing mk-fwing-r"><path d="M96 72 C114 56 134 54 150 62 C140 64 136 68 144 74 C134 74 130 78 138 84 C126 82 120 86 124 92 C110 88 100 84 94 82Z" fill="url(#${id}f)"/><path d="M100 74 C112 66 126 64 138 68 M102 80 C114 76 124 78 132 82" stroke="#5e3b27" stroke-width="1.4" fill="none" opacity=".55"/></g>
  <g class="mk-body">
    <g class="mk-torso">
      <ellipse cx="70" cy="80" rx="46" ry="42" fill="url(#${id}b)"/>
      <ellipse cx="72" cy="94" rx="31" ry="26" fill="url(#${id}w)"/>
      <path d="M38 70 C40 52 56 46 72 47 C90 48 104 56 105 72 C103 88 90 96 72 96 C54 96 40 88 38 70Z" fill="url(#${id}r)"/>
      <path d="M50 60 q8 -6 16 -4" stroke="#ffd2b0" stroke-width="3" stroke-linecap="round" fill="none" opacity=".7"/>
    </g>
    <!-- angelegte Flügelchen -->
    <g class="mk-wing mk-wing-r"><path d="M100 72 C116 74 122 92 112 106 C106 112 96 108 96 98 C96 88 96 78 100 72Z" fill="#7d5338"/><path d="M104 84 q6 6 4 16 M100 88 q5 6 3 14" stroke="#5e3b27" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".6"/><g class="mk-hold" transform="translate(110 104)"></g></g>
    <g class="mk-wing mk-wing-l"><path d="M40 72 C26 76 22 92 30 104 C36 110 44 106 44 96 C44 86 44 78 40 72Z" fill="#7d5338"/><path d="M36 84 q-6 6 -4 16" stroke="#5e3b27" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".6"/></g>
    ${scarf ? `<g class="mk-scarf"><path d="M42 88 C54 98 88 98 100 88 L102 96 C88 106 54 106 40 96Z" fill="#8e2d3b"/>
      <path d="M48 92 v6 M56 95 v6 M64 96 v6 M72 96 v6 M80 96 v6 M88 95 v6 M95 92 v6" stroke="#b5485a" stroke-width="1.6"/>
      <path class="mk-scarf-end" d="M88 98 L94 120 L84 122 L80 100Z" fill="#8e2d3b"/><path d="M84 120 v5 M88 120 v5 M92 119 v5" stroke="#c9a04a" stroke-width="2" stroke-linecap="round"/></g>` : ""}
    <!-- Köpfchen -->
    <g class="mk-head">
      <path class="mk-tuft" d="M66 18 C62 8 70 4 72 12 C74 4 82 6 78 16 C76 20 70 22 66 18Z" fill="${BROWN}"/>
      <circle cx="70" cy="44" r="30" fill="url(#${id}b)"/>
      <path d="M44 52 C46 66 58 74 72 74 C86 74 98 66 100 52 C96 60 86 64 72 64 C58 64 48 60 44 52Z" fill="url(#${id}r)"/>
      <g class="mk-blush"><ellipse cx="50" cy="56" rx="7" ry="4.5" fill="#ff8fa3"/><ellipse cx="92" cy="56" rx="7" ry="4.5" fill="#ff8fa3"/></g>
      ${eye(58, "l")}${eye(84, "r")}
      <g class="mk-brows" stroke="#5e3b27" stroke-width="2.4" stroke-linecap="round" fill="none"><path class="br-l" d="M50 29 Q57 26 64 29"/><path class="br-r" d="M78 29 Q85 26 92 29"/></g>
      <!-- Stirnband (nach dem Morgensport) -->
      <g class="mk-band"><path d="M42 30 Q70 16 98 30 L97 36 Q70 23 43 36Z" fill="#fff6e8" stroke="#e8c46b" stroke-width="1"/><path d="M60 24 v7 M80 24 v7" stroke="#d93a4a" stroke-width="2"/></g>
      <path class="mk-beak-low" d="M67 57 Q71 64 75 57Z" fill="#d48a22"/>
      <path class="mk-beak" d="M66 55 Q71 53 76 55 L71 61Z" fill="#f2b13c" stroke="#d48a22" stroke-width="1" stroke-linejoin="round"/>
      <g class="mk-hat"></g>
      <g class="mk-carry" transform="translate(71 60)"></g>
    </g>
    <!-- Beeren-Hantel (Morgensport) -->
    <g class="mk-barbell"><g class="bb-move"><path d="M16 0 H124" stroke="#7a5537" stroke-width="5" stroke-linecap="round"/><path d="M28 -4 v8 M112 -4 v8" stroke="#5e3b27" stroke-width="3" stroke-linecap="round"/>
      <circle cx="14" cy="0" r="11" fill="#d93a4a"/><circle cx="10" cy="-4" r="3.4" fill="#fff" opacity=".55"/><path d="M14 -11 q3 -5 8 -4" stroke="#4f9e5c" stroke-width="2.4" fill="none"/>
      <circle cx="126" cy="0" r="11" fill="#d93a4a"/><circle cx="122" cy="-4" r="3.4" fill="#fff" opacity=".55"/><path d="M126 -11 q3 -5 8 -4" stroke="#4f9e5c" stroke-width="2.4" fill="none"/></g></g>
  </g>
</svg>`;
  }

  /* ---------- Sprechblasen: schweben frei über dem Vogel ---------- */
  function bubble(el, text, ms) {
    el._bubble?.remove();
    const b = document.createElement("div");
    b.className = "mk-bubble";
    b.textContent = text;
    (el.closest(".site-lock") || document.body).append(b);
    el._bubble = b;
    let alive = true;
    const place = () => {
      if (!alive) return;
      if (!el.isConnected) { b.remove(); return; }
      const r = el.querySelector(".mk-head")?.getBoundingClientRect() || el.getBoundingClientRect();
      const bw = b.offsetWidth, bh = b.offsetHeight, m = 10;
      let x = r.left + r.width / 2, y = r.top - 6 - bh;
      let below = false;
      if (y < 44) { y = r.bottom + 10; below = true; } // oben ist kein Platz (Hinweisleiste) → darunter
      const cx = Math.max(m + bw / 2, Math.min(innerWidth - m - bw / 2, x));
      b.style.left = cx - bw / 2 + "px";
      b.style.top = y + "px";
      b.classList.toggle("below", below);
      b.style.setProperty("--tail", Math.max(14, Math.min(bw - 14, x - (cx - bw / 2))) + "px");
      requestAnimationFrame(place);
    };
    requestAnimationFrame(place);
    setTimeout(() => { alive = false; b.classList.add("out"); setTimeout(() => b.remove(), 250); if (el._bubble === b) el._bubble = null; }, ms);
  }

  const FACES = ["normal", "dreamy", "wow", "happy", "sleepy", "sleep", "shy", "wink", "sad", "focus"];
  function mount(host, o = {}) {
    const el = document.createElement("div");
    el.className = "munkel" + (o.cls ? " " + o.cls : "");
    el.setAttribute("role", "img");
    el.setAttribute("aria-label", "Der Munkelvogel");
    el.innerHTML = svg(o);
    host.append(el);
    let baseFace = o.dreamy ? "dreamy" : "normal";
    el.face = (f = baseFace) => { FACES.forEach((x) => el.classList.toggle("f-" + x, x === f)); el.dataset.face = f; };
    el.legs = (l) => { ["dangle", "stand", "tuck", "hang"].forEach((x) => el.classList.toggle("l-" + x, x === l)); };
    el.fly = (on = true) => { el.classList.toggle("flying", on); if (on) el.legs("tuck"); };
    el.glide = (on = true) => el.classList.toggle("gliding", on);
    el.slim = (on = true) => el.classList.toggle("slim", on);
    el.setBase = (f) => { baseFace = f; el.face(f); };
    el.face(baseFace);
    el.legs(o.sit ? "dangle" : "stand");
    if (o.sway !== false && o.sit) el.classList.add("swaying");
    let alive = true;
    const act = (cls, ms) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); setTimeout(() => el.classList.remove(cls), ms); };
    const blink = () => { if (["sleep", "happy", "wink"].includes(el.dataset.face)) return; act("mk-blink", 220); };
    const loop = () => {
      if (!alive || !el.isConnected) return;
      if (!document.hidden && !el.busy) {
        const r = Math.random();
        if (r < 0.4) blink();
        else if (r < 0.55) { el.face("happy"); setTimeout(() => !el.busy && el.face(), 2200); }
        else if (r < 0.75) act("mk-tilt", 1400);
        else if (r < 0.88) act("mk-flutter", 900);
        else act("mk-look", 2400);
      } else if (!document.hidden && el.busy && Math.random() < 0.5) blink();
      setTimeout(loop, 1800 + Math.random() * 2400);
    };
    setTimeout(loop, 900);
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      if (el.busy) { if (typeof el.onSceneTap === "function") el.onSceneTap(e); return; }
      act("mk-hop", 700); setTimeout(() => act("mk-flutter", 900), 150);
      if (typeof o.onTap === "function") o.onTap(el);
    });
    el.act = act;
    el.blink = blink;
    el.setHat = (inner) => { el.querySelector(".mk-hat").innerHTML = inner || ""; };
    el.hold = (inner) => { el.querySelector(".mk-hold").innerHTML = inner || ""; el.classList.toggle("holding", !!inner); };
    el.carry = (inner) => { el.querySelector(".mk-carry").innerHTML = inner || ""; };
    el.say = (text, ms = 3200) => bubble(el, text, ms);
    el.stop = () => { alive = false; };
    return el;
  }
  return { svg, mount };
})();
