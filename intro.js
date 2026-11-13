/* ============================================================
   Begrüßung beim ersten Besuch: Kalle erklärt in zehn kurzen
   Karten alles, was es im Adventskalender gibt.
   Über das Fragezeichen in der Leiste jederzeit wieder aufrufbar.
   ============================================================ */
const Intro = (() => {
  const KEY = "mama-intro-" + (typeof CONFIG !== "undefined" ? CONFIG.year : "2026");
  let H;

  // kleine Bilder für die Karten
  const ani = (sp, acc, extra = {}) => (typeof Animals !== "undefined" ? Animals.svg({ sp, col: 0, acc, ...extra }, { fit: true }) : "");
  const item = (k) => (typeof Zoo !== "undefined" ? Zoo.preview(k, true) : "");
  const coin = `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#f6c544" stroke="#d49b16" stroke-width="2"/><circle cx="12" cy="12" r="7" fill="none" stroke="#d49b16" stroke-width="1.5"/><text x="12" y="16" text-anchor="middle" font-size="10" font-weight="700" font-family="DM Sans, Arial" fill="#a8740c">T</text></svg>`;
  const door = (n, c) => `<svg viewBox="0 0 80 80"><rect x="4" y="4" width="72" height="72" rx="12" fill="${c}"/><rect x="36" y="4" width="8" height="72" fill="#e9dcc0" opacity=".8"/><rect x="4" y="36" width="72" height="8" fill="#e9dcc0" opacity=".8"/><circle cx="40" cy="40" r="17" fill="#fffaf0"/><text x="40" y="47" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-size="19" font-weight="700" fill="#2b241f">${n}</text></svg>`;
  const check = `<svg viewBox="0 0 30 30"><circle cx="15" cy="15" r="13" fill="#c9a04a"/><path d="M9 15.5l4 4 8-9" fill="none" stroke="#fffaf0" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const icon = (d) => `<span class="ii-icon"><svg viewBox="0 0 24 24">${d}</svg></span>`;
  const I_SHIELD = icon(`<path d="M12 3 5 6v5c0 4.4 3 8.3 7 9.5 4-1.2 7-5.1 7-9.5V6z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="m8.8 12.2 2.3 2.3 4.3-4.6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`);
  const I_NOTE = icon(`<path d="M9 18V5l11-2v13" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="6" cy="18" r="3" fill="currentColor"/><circle cx="17" cy="16" r="3" fill="currentColor"/>`);
  const I_SOUND = icon(`<path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`);
  const I_HELP = icon(`<circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9.5 9.5a2.6 2.6 0 1 1 3.6 2.4c-.8.4-1.1.9-1.1 1.8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="17" r="1.2" fill="currentColor"/>`);
  const I_MEDAL = icon(`<circle cx="12" cy="9" r="6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8.5 13.5 7 21l5-2.5 5 2.5-1.5-7.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`);

  const beforeDec = () => { const n = new Date(); return n.getMonth() === 10; };

  const STEPS = () => [
    { letter: true },
    {
      art: `<div class="ia-one">${ani("capy", "orange")}</div>`,
      title: "Willkommen, Frau Direktorin!",
      lines: [
        "Hallo Ute, ich bin Kalle! Ab heute leitest du unser Tiergehege.",
        "Ehrlich gesagt ist es gerade ziemlich trostlos: kaputter Zaun, Matsch und keine einzige Pfütze zum Baden. Bis Silvester machst du daraus Schritt für Schritt ein Winterparadies.",
        "Ich zeig dir kurz, wie alles funktioniert.",
      ],
    },
    {
      art: `<div class="ia-row">${door(1, "#2a5a46")}${door(7, "#8e2d3b")}${door(15, "#b8913f")}</div>`,
      title: "Jeden Tag ein Kapitel",
      lines: [
        "Ab dem 1. Dezember öffnet sich jeden Morgen ein Türchen. Darin steckt ein Stück unserer Geschichte und ein Rätsel.",
        "Die Türchen sind bunt gemischt – das von heute ist golden umrandet.",
        "Einen Tag verpasst? Kein Problem, alte Türchen kannst du jederzeit nachholen. Ein goldener Punkt zeigt, was noch offen ist, ein goldenes Häkchen, was geschafft ist.",
        "Und am 18. Dezember wartet eine besondere Überraschung.",
      ],
    },
    {
      art: `<div class="ia-row"><span class="ia-coin">${coin}</span><span class="ia-item">${item("stand")}</span><span class="ia-coin small">${coin}</span></div>`,
      title: "Taler und der Shop",
      lines: [
        "Für jedes gelöste Rätsel bekommst du Taler. Weitere gibt es für die Aufgabe des Tages, aus der Spendenbox im Gehege (Besucher werfen jeden Tag etwas ein), für Abzeichen und bei kleinen Überraschungen zwischendurch.",
        "Im Shop findest du unter „Neu“, was die Geschichte gerade braucht – dazu günstige Kleinigkeiten, besondere Extras und Futter.",
        "Alles, was du kaufst, steht sofort im Gehege, und die Tiere schauen es sich gleich an.",
      ],
    },
    {
      art: `<div class="ia-row"><span class="ia-item">${item("tanne")}</span><span class="ia-item">${item("teich")}</span><span class="ia-item">${item("iglu")}</span></div>`,
      title: "Dein Gehege",
      lines: [
        "Das Gehege hat fünf Bereiche: Ruheecke, Marktplatz, Weihnachtsplatz, Wasserwelt und Winterwald. Wisch einfach zur Seite oder tipp oben auf einen Bereich.",
        "Tipp ruhig alles an: Laternen gehen an und aus, der Ball fliegt, das Teleskop zeigt Sternbilder … Die Tiere benutzen die Sachen auch ganz von selbst.",
        "Mit „Gehege“ oben in der Leiste öffnest du es groß – zum Zoomen und zum Umräumen.",
        "Ab 17 Uhr wird es Nacht im Gehege, und das Wetter wechselt jeden Tag.",
      ],
    },
    {
      art: `<div class="ia-hide">${ani("waschbaer", "muetze")}<span class="ia-door">${door(12, "#2a4f42")}</span></div>`,
      title: "100 Tiere suchen",
      lines: [
        "Überall auf der Seite verstecken sich Tiere: hinter Türchen, am Adventskranz, an den Rändern, in den Karten … Entdeckst du eins, tipp es an – dann zieht es bei dir ein, und du bekommst ein Polaroid-Foto.",
        "Manche Tiere sind selten, ganz wenige sind legendär – die glänzen golden.",
        "An einigen Tagen im Dezember ziehen neue Tiere ein.",
        "Im Sammelalbum (im großen Gehege) siehst du, wer schon da ist, und kannst alle Fotos ansehen.",
      ],
    },
    {
      art: `<div class="ia-row"><span class="ia-ani">${ani("capy", "")}</span><span class="ia-food">${typeof Zoo !== "undefined" ? Zoo.foodIcon("capy") : ""}</span><span class="ia-ani">${ani("pinguin", "muetze")}</span></div>`,
      title: "Füttern, Namen und der Stall",
      lines: [
        "Jede Tierart hat ihr Lieblingsfutter – das kaufst du im Shop unter „Futter“.",
        "Bekommt ein Tier einen Tag lang nichts, wird es traurig. Oben in der Leiste siehst du, wie viele gerade Hunger haben.",
        "Tipp ein Tier an, um es zu füttern oder ihm einen neuen Namen zu geben.",
        "Höchstens 25 Tiere sind gleichzeitig draußen, jede Stunde wechselt die Besetzung. Die anderen ruhen im Stall – dort kannst du sie füttern oder ins Gehege holen.",
      ],
    },
    {
      art: `<div class="ia-checks">${["Rätsel", "Füttern", "Spendenbox", "Aufgabe"].map((t, i) => `<span class="${i < 2 ? "ok" : ""}">${i < 2 ? check : "<i></i>"}${t}</span>`).join("")}</div>`,
      title: "Jeden Tag neu: „Heute“",
      lines: [
        "Unter dem Gehege findest du jeden Tag ein Tier des Tages mit einem Tierfakt, Kalles Tagebuch über deinen Tag, eine Aufgabe des Tages mit Taler-Belohnung und eine Erinnerung des Tages – ein schönes Foto aus deinem Jahr. Tipp es an, dann wird es groß.",
        "Die kleinen Häkchen neben „Heute“ zeigen dir, was du heute schon erledigt hast.",
      ],
    },
    {
      art: `<div class="ia-row"><span class="ia-ani">${ani("pinguin", "muetze")}</span><span class="ia-medal">★</span><span class="ia-ani">${ani("waschbaer", "brille")}</span></div>`,
      title: "Spiele und Abzeichen",
      lines: [
        "In der Spielecke („Spiele“ oben) warten drei Spiele: Heuballen-Turm, Waschbär-Alarm und Pinguin-Rutsche. Dein Rekord wird gespeichert – und wer gut spielt, entdeckt geheime Belohnungen.",
        "Für vieles, was du schaffst, bekommst du Abzeichen (Medaille oben). Tipp ein neues an, um die Taler abzuholen.",
      ],
    },
    {
      art: `<div class="ia-icons">${I_SHIELD}${I_MEDAL}${I_NOTE}${I_SOUND}${I_HELP}</div>`,
      title: "Oben in der Leiste",
      list: [
        [I_SHIELD, "Spielstand sichern – dein Fortschritt ist nur auf diesem Gerät gespeichert. Schick dir ab und zu eine Sicherung, dann geht nie etwas verloren."],
        [I_MEDAL, "Deine Abzeichen."],
        [I_NOTE, "Eine Spieluhr mit Weihnachtsliedern."],
        [I_SOUND, "Töne an und aus."],
        [I_HELP, "Diese Erklärung noch einmal ansehen."],
      ],
      after: "Und unten links wohne ich. Streichel mich ruhig mal – und fang ein paar Schneeflocken. Es gibt noch einige kleine Geheimnisse zu entdecken.",
    },
    {
      art: `<div class="ia-row">${["katze", "capy", "hund"].map((sp, i) => `<span class="ia-ani">${ani(sp, ["schleife", "orange", "muetze"][i], { accColor: ["#e85d75", null, null][i] })}</span>`).join("")}</div>`,
      title: "Los geht’s!",
      lines: [
        beforeDec() ? "Das erste Türchen öffnet sich am 1. Dezember. Bis dahin kannst du dich schon umschauen und die ersten Tiere suchen." : "Dein Türchen von heute wartet schon auf dich.",
        "An besonderen Tagen – Nikolaus, Heiligabend und Silvester – passiert noch mehr. Lass dich überraschen!",
        "Viel Freude, Frau Direktorin!",
      ],
      last: true,
    },
  ];

  function open() {
    H = H || App.h;
    if (document.querySelector(".intro-wrap")) return;
    const steps = STEPS();
    let i = 0;
    const wrap = H.el("div", { class: "intro-wrap", role: "dialog", "aria-modal": "true", "aria-label": "So funktioniert dein Adventskalender" });
    const card = H.el("div", { class: "intro-card" });
    const dots = H.el("div", { class: "intro-dots" }, ...steps.map((_, k) => H.el("button", { "aria-label": `Seite ${k + 1}`, onclick: () => go(k) })));
    const back = H.el("button", { class: "btn btn-soft intro-back", text: "Zurück", onclick: () => go(i - 1) });
    const next = H.el("button", { class: "btn btn-green intro-next", onclick: () => (i === steps.length - 1 ? close() : go(i + 1)) });
    const skip = H.el("button", { class: "intro-skip", text: "Überspringen", onclick: () => close() });
    const body = H.el("div", { class: "intro-body" });
    card.append(skip, body, H.el("div", { class: "intro-foot" }, back, dots, next));
    wrap.append(card);
    const render = (dir) => {
      const s = steps[i];
      body.innerHTML = "";
      card.classList.toggle("is-letter", !!s.letter);
      if (s.letter) {
        const C = typeof CONFIG !== "undefined" ? CONFIG : {};
        body.append(H.el("div", { class: "intro-page intro-letter" + (dir ? (dir > 0 ? " from-right" : " from-left") : "") },
          C.welcomePhoto ? H.el("figure", { class: "il-photo" },
            H.el("img", { src: C.welcomePhoto, alt: "Chris und Mama", onerror: (e) => e.target.closest("figure")?.remove() }),
            H.el("span", { class: "il-tape", "aria-hidden": "true" })) : null,
          H.el("h2", { class: "il-title", text: C.welcomeTitle || "Liebe Mama," }),
          ...String(C.welcomeMessage || "").split(/\n\n+/).map((t) => H.el("p", { class: "il-text", text: t })),
          H.el("p", { class: "il-sign", text: C.welcomeSignature || C.signature || "" })));
        body.scrollTop = 0;
        back.style.visibility = "hidden";
        next.textContent = "Weiter zu Kalle";
        skip.style.visibility = "hidden";
        [...dots.children].forEach((d, k) => d.classList.toggle("on", k === i));
        return;
      }
      const content = H.el("div", { class: "intro-page" + (dir ? (dir > 0 ? " from-right" : " from-left") : "") },
        H.el("div", { class: "intro-art", html: s.art }),
        H.el("small", { class: "intro-step", text: `${i} von ${steps.length - 1}` }),
        H.el("h2", { text: s.title }),
        s.lines ? H.el("div", { class: "intro-text" }, ...s.lines.map((t) => H.el("p", { text: t }))) : null,
        s.list ? H.el("ul", { class: "intro-list" }, ...s.list.map(([ic, t]) => H.el("li", { html: ic }, H.el("span", { text: t })))) : null,
        s.after ? H.el("p", { class: "intro-after", text: s.after }) : null);
      body.append(content);
      body.scrollTop = 0;
      back.style.visibility = i ? "visible" : "hidden";
      next.textContent = s.last ? "Los geht’s" : "Weiter";
      skip.style.visibility = s.last ? "hidden" : "visible";
      [...dots.children].forEach((d, k) => d.classList.toggle("on", k === i));
    };
    const go = (k) => { if (k < 0 || k >= steps.length || k === i) return; const dir = k > i ? 1 : -1; i = k; render(dir); H.sfx.tick(); };
    const key = (e) => { if (e.key === "ArrowRight") go(i + 1); else if (e.key === "ArrowLeft") go(i - 1); else if (e.key === "Escape") close(); };
    let x0 = null, y0 = 0;
    card.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    card.addEventListener("touchend", (e) => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.3) go(i + (dx < 0 ? 1 : -1)); x0 = null; });
    function close() {
      try { localStorage.setItem(KEY, "1"); } catch (e) {}
      document.removeEventListener("keydown", key);
      wrap.classList.add("closing"); setTimeout(() => wrap.remove(), 300);
      document.body.style.overflow = "";
    }
    document.addEventListener("keydown", key);
    document.body.append(wrap); document.body.style.overflow = "hidden";
    render(0);
  }

  function maybeShow() {
    H = App.h;
    // Fragezeichen in der Leiste
    const icons = document.getElementById("nav-icons");
    if (icons && !icons.querySelector(".help-btn")) {
      const b = H.el("button", { class: "nav-icon help-btn", title: "So funktioniert's", "aria-label": "So funktioniert's", html: I_HELP.replace('<span class="ii-icon">', "").replace("</span>", "") });
      b.addEventListener("click", (e) => { e.stopPropagation(); open(); });
      icons.append(b);
    }
    let seen = false; try { seen = !!localStorage.getItem(KEY); } catch (e) {}
    if (!seen) open();
  }
  return { open, maybeShow };
})();
