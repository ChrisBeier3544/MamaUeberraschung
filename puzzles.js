/* =========================================================
   Die 24 Rätsel 🐾
   ========================================================= */
(() => {
  const { el, shuffle, seeded, pick, sleep, sfx, burstAt, confetti, rain, toast, shakeEl, textAnswer } = App.h;
  const R = App.register;
  const once = (fn) => { let done = false; return (...a) => { if (!done) { done = true; fn(...a); } }; };

  /* ---------- 1: Memory ---------- */
  R(1, {
    emoji: "🐶", title: "Tier-Memory",
    intro: "Finde alle Tierpaare! Dreh immer zwei Kärtchen um – passen sie zusammen, freuen sich die beiden riesig.",
    hint: "Fang in einer Ecke an und arbeite dich Reihe für Reihe durch. Und merk dir die Waschbären – die sind frech! 🦝",
    outro: "Gedächtnis wie ein Elefant 🐘 – nur viel süßer!",
    render(root, { solve }) {
      solve = once(solve);
      const animals = ["🐶", "🐱", "🦝", "🐰", "🐼", "🦊"];
      const grid = el("div", { class: "grid", style: "grid-template-columns:repeat(4,minmax(0,82px))" });
      let open = [], lock = false, found = 0;
      shuffle([...animals, ...animals]).forEach((a) => {
        const c = el("div", { class: "mem-card" }, el("div", { class: "mem-inner" }, el("div", { class: "mem-face mem-back", text: "🐾" }), el("div", { class: "mem-face mem-front", text: a })));
        c.dataset.a = a;
        c.onclick = () => {
          if (lock || c.classList.contains("flipped")) return;
          c.classList.add("flipped"); sfx.tick(); open.push(c);
          if (open.length < 2) return;
          const [x, y] = open; open = [];
          if (x.dataset.a === y.dataset.a) {
            setTimeout(() => { x.classList.add("matched"); y.classList.add("matched"); sfx.good(); burstAt(y, ["💖", "✨", x.dataset.a], 8, 60); }, 300);
            if (++found === animals.length) setTimeout(solve, 1100);
          } else {
            lock = true;
            setTimeout(() => { x.classList.remove("flipped"); y.classList.remove("flipped"); lock = false; }, 900);
          }
        };
        grid.append(c);
      });
      root.append(grid);
    },
  });

  /* ---------- 2: Reim-Rätsel ---------- */
  R(2, {
    emoji: "🦝", title: "Wer bin ich?",
    intro: "Ein kleines Reim-Rätsel zum Aufwärmen:",
    hint: "Ich bin ein „Bär“, aber eigentlich gar keiner. Und ich bin sehr reinlich… 🧼",
    outro: "Richtig! Rocky der Waschbär lässt schön grüßen 🦝👋",
    render(root, { solve }) {
      root.append(
        el("div", { class: "center", style: "font-size:19px;line-height:1.6;background:#fff;border-radius:18px;padding:14px;box-shadow:0 3px 0 #ead6c8" },
          el("div", { class: "big-emoji", text: "❓" }),
          el("div", { html: "Ich trag 'ne Maske, schwarz wie die Nacht,<br>hab schon so manche Mülltonne aufgemacht.<br>Mein Futter wasch ich gern im Bach –<br><b>wer bin ich?</b> Denk mal scharf nach! 🤔" }))
      );
      textAnswer(root, { answers: ["Waschbär", "Waschbaer", "Waschbar", "Waschbären"], placeholder: "Ich bin ein…", onRight: solve });
    },
  });

  /* ---------- 3: Finde den Eindringling ---------- */
  R(3, {
    emoji: "🐹", title: "Wer gehört hier nicht hin?",
    intro: "Irgendwer hat sich zwischen die anderen geschmuggelt! Finde den Eindringling – drei Runden lang, jede ein bisschen kniffliger.",
    hint: "Geh Reihe für Reihe von links nach rechts mit dem Finger durch. Achte auf die Ohren und die Farbe! 👀",
    outro: "Adleraugen! 🦅 Dir entgeht nichts.",
    render(root, { solve }) {
      solve = once(solve);
      const rounds = [{ bg: "🐱", odd: "🦝", n: 5 }, { bg: "🐭", odd: "🐹", n: 6 }, { bg: "🦁", odd: "🐯", n: 7 }];
      const info = el("div", { class: "center", style: "font-weight:600;margin-bottom:8px" });
      const box = el("div");
      root.append(info, box);
      const play = (r) => {
        const { bg, odd, n } = rounds[r];
        info.textContent = `Runde ${r + 1} von 3 – finde: ${odd}`;
        box.innerHTML = "";
        const size = Math.min(54, Math.floor((Math.min(innerWidth, 600) - 80) / n));
        const grid = el("div", { class: "grid", style: `grid-template-columns:repeat(${n},${size}px);gap:4px` });
        const pos = Math.floor(Math.random() * n * n);
        for (let i = 0; i < n * n; i++) {
          const t = el("button", { class: "tile", text: i === pos ? odd : bg, style: `font-size:${size * 0.62}px;border-radius:10px` });
          t.onclick = () => {
            if (i === pos) { t.classList.add("good"); sfx.good(); burstAt(t, ["✨", "💖", odd], 10, 70); setTimeout(() => (r < 2 ? play(r + 1) : solve()), 800); }
            else { sfx.bad(); shakeEl(t); toast(pick([`Das ist doch ein ganz normales ${bg} 😹`, "Nope, der gehört dazu! 🙈", "Schau nochmal genau hin 👀"])); }
          };
          grid.append(t);
        }
        box.append(grid);
      };
      play(0);
    },
  });

  /* ---------- 4: Fütterung ---------- */
  R(4, {
    emoji: "🐰", title: "Fütterungszeit!",
    intro: "Alle haben Hunger! Tippe zuerst auf ein Futter und dann auf das Tier, das es am liebsten mag.",
    hint: "Der Affe mag's gelb und krumm, der Panda knabbert am liebsten Bambus 🎋, und das Eichhörnchen hortet Nüsse.",
    outro: "Alle satt und glücklich! 😋 Du wärst die beste Tierpflegerin.",
    render(root, { solve }) {
      solve = once(solve);
      const pairs = [["🐶", "🦴"], ["🐱", "🐟"], ["🐰", "🥕"], ["🐿️", "🌰"], ["🐼", "🎋"], ["🐵", "🍌"]];
      let food = null, done = 0;
      const animals = el("div", { class: "grid", style: "grid-template-columns:repeat(3,minmax(0,90px))" });
      const foods = el("div", { class: "grid", style: "grid-template-columns:repeat(6,minmax(0,52px));margin-top:22px" });
      shuffle(pairs).forEach(([a, f]) => {
        const t = el("button", { class: "tile", text: a, style: "font-size:46px" });
        t.dataset.f = f;
        t.onclick = () => {
          if (!food) { toast("Wähle zuerst ein Futter aus 🍽️"); shakeEl(t); return; }
          if (food.textContent === f) {
            food.classList.remove("sel"); food.classList.add("done"); food = null;
            t.classList.add("good"); t.textContent = a + "😋"; t.style.fontSize = "30px"; t.disabled = true;
            sfx.good(); burstAt(t, ["💖", "😋", "✨"], 10, 70);
            if (++done === pairs.length) setTimeout(solve, 900);
          } else { sfx.bad(); shakeEl(t); toast(pick(["Bäh! Das mag ich nicht 🤢", "Hmm… nö! 🙅", "Hast du was anderes? 🥺"])); }
        };
        animals.append(t);
      });
      shuffle(pairs).forEach(([, f]) => {
        const t = el("button", { class: "tile", text: f, style: "font-size:30px" });
        t.onclick = () => { food?.classList.remove("sel"); food = t; t.classList.add("sel"); sfx.pop(); };
        foods.append(t);
      });
      root.append(animals, el("div", { class: "center", style: "margin-top:16px;color:var(--ink-soft)", text: "🍽️ Futterkiste:" }), foods);
    },
  });

  /* ---------- 5: Pinguine zählen ---------- */
  R(5, {
    emoji: "🐧", title: "Pinguin-Party auf dem Eis",
    intro: "Auf der Eisscholle ist ganz schön was los! Wie viele Pinguine 🐧 watscheln hier herum?",
    hint: "Drück auf „Einfrieren“, damit alle stillstehen. Zähl dann von links nach rechts. Robben 🦭 und Schneemänner ⛄ zählen nicht!",
    outro: "Richtig, es waren 9 Pinguine! 🐧 Die feiern jetzt eine Eisparty.",
    render(root, { solve }) {
      const scene = el("div", { class: "scene" });
      const actors = [];
      const add = (e, n) => { for (let i = 0; i < n; i++) actors.push(el("div", { class: "actor", text: e })); };
      add("🐧", 9); add("🦭", 6); add("⛄", 4);
      const place = () => actors.forEach((a) => { a.style.left = 4 + Math.random() * 84 + "%"; a.style.top = 6 + Math.random() * 76 + "%"; });
      shuffle(actors).forEach((a) => {
        a.onclick = () => { sfx.squeak(); a.animate([{ transform: "translateY(0)" }, { transform: "translateY(-20px) rotate(15deg)" }, { transform: "translateY(0)" }], { duration: 400 }); };
        scene.append(a);
      });
      place();
      let frozen = false;
      const iv = setInterval(() => { if (!frozen) place(); }, 2600);
      root._cleanup = () => clearInterval(iv);
      const fz = el("button", { class: "btn btn-soft", text: "🧊 Einfrieren" });
      fz.onclick = () => { frozen = !frozen; fz.textContent = frozen ? "🔥 Auftauen" : "🧊 Einfrieren"; actors.forEach((a) => (a.style.transition = frozen ? "none" : "")); if (frozen) actors.forEach((a) => { const r = a.getBoundingClientRect(), s = scene.getBoundingClientRect(); a.style.left = ((r.left - s.left) / s.width) * 100 + "%"; a.style.top = ((r.top - s.top) / s.height) * 100 + "%"; }); sfx.boop(); };
      root.append(scene, el("div", { class: "row", style: "margin-top:10px" }, fz));
      textAnswer(root, { answers: ["9", "neun"], placeholder: "Anzahl Pinguine", type: "text", onRight: () => { clearInterval(iv); solve(); } });
    },
  });

  /* ---------- 6: Nikolaus-Buchstabensalat ---------- */
  R(6, {
    emoji: "🎅", title: "Nikolaus' Buchstabensalat",
    intro: "Oh nein! Der Nikolaus ist mit seinem Sack gestolpert und alle Tiernamen sind durcheinandergepurzelt. Bring sie wieder in Ordnung!",
    hint: "Wort 1 ist stachelig 🦔, Wort 2 hat lange Wimpern und sieht aus wie ein flauschiges Lama 🦙, Wort 3 hängt gemütlich am Ast und hat es nie eilig 🦥.",
    outro: "Danke! Der Nikolaus hat dir zum Dank ein bisschen Schokolade in den Stiefel gelegt 🍫👢",
    render(root, { solve }) {
      solve = once(solve);
      const words = [["IGEL", "🦔"], ["ALPAKA", "🦙"], ["FAULTIER", "🦥"]];
      const box = el("div");
      root.append(box);
      const play = (w) => {
        const [word, emo] = words[w];
        box.innerHTML = "";
        let letters = shuffle(word.split(""));
        while (letters.join("") === word) letters = shuffle(word.split(""));
        let typed = [];
        const out = el("div", { class: "slot-word", style: "justify-content:center;margin:12px 0" });
        const pool = el("div", { class: "pool" });
        const btns = letters.map((ch) => {
          const b = el("button", { text: ch });
          b.onclick = () => { if (b.classList.contains("used")) return; b.classList.add("used"); typed.push(b); sfx.tick(); draw(); };
          pool.append(b); return b;
        });
        const draw = () => {
          out.innerHTML = "";
          for (let i = 0; i < word.length; i++) out.append(el("div", { class: "slot" + (typed[i] ? " filled" : ""), text: typed[i]?.textContent || "" }));
          if (typed.length === word.length) {
            if (typed.map((b) => b.textContent).join("") === word) {
              [...out.children].forEach((s) => s.classList.add("right"));
              sfx.good(); out.append(el("div", { style: "font-size:34px;margin-left:8px", text: emo })); burstAt(out, ["✨", emo, "💖"], 10, 80);
              setTimeout(() => (w < words.length - 1 ? play(w + 1) : solve()), 1100);
            } else {
              sfx.bad(); shakeEl(out);
              setTimeout(() => { typed.forEach((b) => b.classList.remove("used")); typed = []; draw(); }, 600);
            }
          }
        };
        const back = el("button", { class: "btn btn-soft", text: "⌫ Zurück", onclick: () => { const b = typed.pop(); if (b) b.classList.remove("used"); draw(); } });
        box.append(el("div", { class: "center", style: "font-weight:600", text: `Tier ${w + 1} von ${words.length}` }), out, pool, el("div", { class: "row", style: "margin-top:12px" }, back));
        draw();
      };
      play(0);
    },
  });

  /* ---------- 7: Tier-Orchester (Simon) ---------- */
  R(7, {
    emoji: "🐸", title: "Das Tier-Orchester",
    intro: "Das Orchester probt für das Weihnachtskonzert! Hör gut zu und spiel die Melodie nach. Jede Runde kommt ein Ton dazu – schaffst du 5 Töne?",
    hint: "Sag dir die Tiere leise vor: „Hund, Frosch, Katze…“ – so kann man sie sich viel leichter merken! 🎶",
    outro: "Bravo! Standing Ovations vom ganzen Orchester 👏🐸🐮🐶🐱",
    render(root, { solve }) {
      solve = once(solve);
      const inst = [{ e: "🐶", f: 262, c: "#ffd0d0" }, { e: "🐱", f: 330, c: "#fff1b5" }, { e: "🐸", f: 392, c: "#c9f2d7" }, { e: "🐮", f: 523, c: "#cfe6ff" }];
      const seq = Array.from({ length: 5 }, () => Math.floor(Math.random() * 4));
      let len = 1, pos = 0, listening = false, alive = true;
      const info = el("div", { class: "center", style: "font-weight:600;font-size:18px;min-height:28px" });
      const grid = el("div", { class: "grid", style: "grid-template-columns:repeat(2,minmax(0,120px));gap:14px" });
      const btns = inst.map((it, i) => {
        const b = el("button", { class: "tile", text: it.e, style: `font-size:56px;background:${it.c}` });
        b.onclick = () => press(i);
        grid.append(b); return b;
      });
      const flash = async (i) => { btns[i].style.transform = "scale(1.15)"; btns[i].style.filter = "brightness(1.15) drop-shadow(0 0 10px gold)"; sfx.tone(inst[i].f, 0.35, "triangle", 0.25); await sleep(380); btns[i].style.transform = ""; btns[i].style.filter = ""; await sleep(150); };
      const playSeq = async () => {
        listening = false; info.textContent = "🎵 Gut zuhören…"; await sleep(600);
        for (let k = 0; k < len && alive; k++) await flash(seq[k]);
        if (!alive) return;
        pos = 0; listening = true; info.textContent = `Du bist dran! (${len} ${len === 1 ? "Ton" : "Töne"})`;
      };
      const press = async (i) => {
        if (!listening) return;
        flash(i);
        if (i !== seq[pos]) { listening = false; sfx.bad(); info.textContent = "Ups, schiefer Ton! 🙉 Nochmal anhören…"; await sleep(1200); playSeq(); return; }
        pos++;
        if (pos === len) {
          listening = false; burstAt(grid, ["🎵", "🎶", "✨"], 8, 100);
          if (len === seq.length) { info.textContent = "Perfekt! 🎉"; setTimeout(solve, 700); return; }
          len++; info.textContent = "Super! Weiter geht's 🎶"; await sleep(900); playSeq();
        }
      };
      const start = el("button", { class: "btn btn-green", text: "▶️ Konzert starten", onclick: () => { start.remove(); playSeq(); } });
      root._cleanup = () => (alive = false);
      root.append(info, grid, el("div", { class: "row", style: "margin-top:14px" }, start));
      info.textContent = "Bereit? 🎻";
    },
  });

  /* ---------- 8: Kätzchen-Streichelparty ---------- */
  R(8, {
    emoji: "🐱", title: "Streichel-Party",
    intro: "Aus den Körbchen schauen Kätzchen heraus und wollen gestreichelt werden! Tippe schnell auf sie – 12 Streicheleinheiten brauchst du. Aber Vorsicht vor dem Igel 🦔, der pikst!",
    hint: "Ganz in Ruhe – es gibt kein Zeitlimit. Wenn du den Igel erwischst, ist das auch nicht schlimm 🦔💕",
    outro: "12 schnurrende Kätzchen! 😻 Du hast magische Streichelhände.",
    render(root, { solve }) {
      solve = once(solve);
      const GOAL = 12;
      let score = 0, iv = null;
      const meter = el("div", { class: "meter" }, el("div"));
      const info = el("div", { class: "center", style: "font-weight:600", text: `0 / ${GOAL} gestreichelt` });
      const holes = el("div", { class: "holes" });
      const hs = Array.from({ length: 9 }, () => {
        const crit = el("div", { class: "critter" });
        const h = el("button", { class: "hole", "aria-label": "Körbchen" }, crit);
        h.onclick = () => {
          if (!h.classList.contains("up")) return;
          h.classList.remove("up");
          if (crit.textContent === "🦔") { score = Math.max(0, score - 1); sfx.bad(); toast("Autsch! Der Igel pikst 🦔"); }
          else { score++; sfx.meow(); burstAt(h, ["💖", "😻", "✨"], 6, 50); }
          info.textContent = `${score} / ${GOAL} gestreichelt`;
          meter.firstChild.style.width = (score / GOAL) * 100 + "%";
          if (score >= GOAL) { clearInterval(iv); info.textContent = "Alle Kätzchen glücklich! 😻"; setTimeout(solve, 600); }
        };
        holes.append(h); return { h, crit };
      });
      const tick = () => {
        const free = hs.filter((x) => !x.h.classList.contains("up"));
        if (!free.length) return;
        const x = pick(free);
        x.crit.textContent = Math.random() < 0.18 ? "🦔" : pick(["🐱", "😺", "😸", "🐈", "😻"]);
        x.h.classList.add("up");
        setTimeout(() => x.h.classList.remove("up"), 1300);
      };
      const start = el("button", { class: "btn btn-green", text: "▶️ Los geht's!", onclick: () => { start.remove(); iv = setInterval(tick, 750); } });
      root._cleanup = () => clearInterval(iv);
      root.append(info, meter, holes, el("div", { class: "row", style: "margin-top:12px" }, start));
    },
  });

  /* ---------- 9: Emoji-Rebus ---------- */
  R(9, {
    emoji: "🦉", title: "Emoji-Bilderrätsel",
    intro: "Zwei Bildchen ergeben zusammen ein Tier! Welches ist gemeint?",
    hint: "Lies die Bildchen einfach nacheinander als Wörter vor und häng sie zusammen: „Haus“ + „Katze“ = …",
    outro: "Du sprichst fließend Emoji! 🤓",
    render(root, { solve }) {
      solve = once(solve);
      const qs = [
        ["🏠 + 🐱", "Hauskatze", ["Hausmaus", "Dachkatze"]],
        ["❄️ + 🐆", "Schneeleopard", ["Eisbär", "Schneehase"]],
        ["🌊 + 🐴", "Seepferdchen", ["Seehund", "Seestern"]],
        ["🍯 + 🐝", "Honigbiene", ["Wespe", "Hummel"]],
        ["🦔 + 🐟", "Igelfisch", ["Kugelfisch", "Stachelschwein"]],
      ];
      const box = el("div");
      root.append(box);
      const play = (k) => {
        const [q, right, wrong] = qs[k];
        box.innerHTML = "";
        box.append(el("div", { class: "center", style: "font-weight:600", text: `Bild ${k + 1} von ${qs.length}` }),
          el("div", { class: "center", style: "font-size:58px;margin:10px 0", text: q }));
        const row = el("div", { class: "row" });
        shuffle([right, ...wrong]).forEach((opt) => {
          const b = el("button", { class: "btn btn-soft", text: opt, style: "font-size:18px;padding:12px 18px" });
          b.onclick = () => {
            if (opt === right) { b.style.background = "#c9f2d7"; sfx.good(); burstAt(b, ["✨", "💖"], 8, 60); setTimeout(() => (k < qs.length - 1 ? play(k + 1) : solve()), 800); }
            else { sfx.bad(); shakeEl(b); b.disabled = true; }
          };
          row.append(b);
        });
        box.append(row);
      };
      play(0);
    },
  });

  /* ---------- 10: Tier-Mathe ---------- */
  R(10, {
    emoji: "🧮", title: "Tierische Mathematik",
    intro: "Jedes Tier steht für eine Zahl. Findest du heraus, welche – und was unten rauskommt?",
    hint: "Fang oben an: Drei Hunde sind 12, also ist ein Hund 🐶 = 4. Damit kannst du die Katze ausrechnen, und mit der Katze das Häschen…",
    outro: "🐶 = 4, 🐱 = 5, 🐰 = 2 – und 5 × 2 + 4 = 14. Mathe-Genie! 🎓",
    render(root, { solve }) {
      const lines = [["🐶 + 🐶 + 🐶", "12"], ["🐶 + 🐱 + 🐱", "14"], ["🐱 + 🐰 + 🐰", "9"], ["🐱 × 🐰 + 🐶", "❓"]];
      const box = el("div", { style: "background:#fff;border-radius:18px;padding:12px;box-shadow:0 3px 0 #ead6c8;max-width:380px;margin:0 auto" });
      lines.forEach(([l, r], i) => box.append(el("div", { style: `display:flex;justify-content:space-between;font-size:30px;padding:6px 10px;${i === 3 ? "border-top:3px dashed #f3c8a8;margin-top:6px;padding-top:12px" : ""}` }, el("span", { text: l }), el("span", { text: "= " + r, style: "font-weight:700" }))));
      root.append(box);
      textAnswer(root, { answers: ["14", "vierzehn"], placeholder: "Ergebnis", onRight: solve });
    },
  });

  /* ---------- 11: Schattenrätsel ---------- */
  R(11, {
    emoji: "🦒", title: "Schatten-Raten",
    intro: "Im Dunkeln sehen alle Tiere gleich aus… oder? Welches Tier versteckt sich hinter dem Schatten?",
    hint: "Achte auf die Umrisse: lange Hälse, Rüssel, Schneckenhäuser und Kängurubeutel verraten viel! 🔦",
    outro: "Licht an! 💡 Du erkennst jedes Tier im Dunkeln.",
    render(root, { solve }) {
      solve = once(solve);
      const pool = ["🦒", "🐘", "🦩", "🐿️", "🦔", "🐇", "🦘", "🐢", "🦉", "🐌", "🐓", "🦕", "🐊", "🐈"];
      const rounds = ["🦒", "🦩", "🐘", "🦘", "🐌"];
      const box = el("div");
      root.append(box);
      const play = (k) => {
        const ans = rounds[k];
        box.innerHTML = "";
        const shadow = el("div", { class: "center", text: ans, style: "font-size:110px;filter:brightness(0) opacity(.85);transition:filter .8s;margin:4px 0" });
        box.append(el("div", { class: "center", style: "font-weight:600", text: `Schatten ${k + 1} von ${rounds.length}` }), shadow);
        const opts = shuffle([ans, ...shuffle(pool.filter((p) => p !== ans)).slice(0, 3)]);
        const grid = el("div", { class: "grid", style: "grid-template-columns:repeat(4,minmax(0,72px))" });
        opts.forEach((o) => {
          const b = el("button", { class: "tile", text: o, style: "font-size:38px" });
          b.onclick = () => {
            if (o === ans) { shadow.style.filter = "none"; b.classList.add("good"); sfx.good(); burstAt(shadow, ["✨", "💡", "💖"], 10, 90); setTimeout(() => (k < rounds.length - 1 ? play(k + 1) : solve()), 1100); }
            else { b.classList.add("bad"); sfx.bad(); shakeEl(b); }
          };
          grid.append(b);
        });
        box.append(grid);
      };
      play(0);
    },
  });

  /* ---------- 12: Wahr oder Falsch ---------- */
  R(12, {
    emoji: "🦦", title: "Tierisch wahr oder falsch?",
    intro: "Sieben verrückte Tier-Fakten. Welche stimmen – und welche sind geflunkert?",
    hint: "Bei Tieren ist die Wahrheit oft verrückter als jede Erfindung! Mehr als die Hälfte ist wahr 😉",
    outro: "Jetzt bist du offiziell Tier-Expertin! 🎓🐾",
    render(root, { solve }) {
      solve = once(solve);
      const facts = [
        ["🦦", "Seeotter halten sich beim Schlafen an den Pfoten, damit sie nicht voneinander wegtreiben.", true, "Stimmt! Sie halten Händchen – zum Dahinschmelzen 🥹"],
        ["🐱", "Katzen können Süßes schmecken.", false, "Falsch! Katzen fehlt der Geschmackssinn für Süßes. Der Kuchen gehört also ganz dir 🍰"],
        ["🍊", "Kapibaras sind die größten Nagetiere der Welt.", true, "Stimmt! Bis zu 65 kg pure Gemütlichkeit 🤎"],
        ["🦝", "Waschbären gehören zur Familie der Bären.", false, "Falsch! Sie gehören zu den Kleinbären – eng verwandt mit dem Nasenbären."],
        ["🎲", "Wombats machen würfelförmige Häufchen.", true, "Stimmt wirklich! 💩🎲 Die Natur ist verrückt."],
        ["🐠", "Goldfische haben nur ein 3-Sekunden-Gedächtnis.", false, "Falsch! Goldfische können sich Dinge monatelang merken 🧠"],
        ["🐮", "Kühe haben beste Freundinnen und sind entspannter, wenn die dabei sind.", true, "Stimmt! Genau wie wir 💕"],
      ];
      const box = el("div");
      root.append(box);
      const play = (k) => {
        const [emo, text, truth, expl] = facts[k];
        box.innerHTML = "";
        const card = el("div", { class: "center", style: "background:#fff;border-radius:18px;padding:14px;box-shadow:0 3px 0 #ead6c8" },
          el("div", { style: "font-size:13px;color:var(--ink-soft)", text: `Fakt ${k + 1} von ${facts.length}` }),
          el("div", { class: "big-emoji", text: emo }),
          el("div", { style: "font-size:19px;line-height:1.4", text: text }));
        const fb = el("div", { class: "feedback" });
        const row = el("div", { class: "row", style: "margin-top:14px" });
        [["Wahr ✅", true], ["Geflunkert ❌", false]].forEach(([lab, val]) => {
          const b = el("button", { class: "btn" + (val ? " btn-green" : ""), text: lab });
          b.onclick = () => {
            if (val === truth) {
              sfx.good(); burstAt(card, ["✨", "💖", emo], 8, 80); row.innerHTML = ""; fb.textContent = expl;
              row.append(el("button", { class: "btn btn-soft", text: k < facts.length - 1 ? "Weiter ➡️" : "Fertig! 🎉", onclick: () => (k < facts.length - 1 ? play(k + 1) : solve()) }));
            } else { sfx.bad(); shakeEl(card); fb.textContent = "Hmm, bist du sicher? 🤔 Probier's nochmal!"; }
          };
          row.append(b);
        });
        box.append(card, row, fb);
      };
      play(0);
    },
  });

  /* ---------- 13: Igel-Labyrinth ---------- */
  R(13, {
    emoji: "🦔", title: "Igelchens Weg zum Apfel",
    intro: "Der kleine Igel hat Hunger und will zu seinem Apfel 🍎. Hilf ihm durch den Winterwald! (Pfeiltasten, Knöpfe oder wischen)",
    hint: "Geh zuerst nach rechts, dann nach unten, in der Mitte nach rechts und schließlich am rechten Rand ganz nach unten. 🌲",
    outro: "Mampf mampf! 🍎🦔 Der Igel sagt danke und rollt sich zufrieden zusammen.",
    render(root, { solve }) {
      solve = once(solve);
      const M = [
        "###########",
        "#H....#...#",
        "#.###.#.#.#",
        "#.#...#.#.#",
        "#.#.###.#.#",
        "#.#.....#.#",
        "#.#####.#.#",
        "#.....#.#.#",
        "#####.#.#.#",
        "#.......#A#",
        "###########",
      ];
      let pr = 1, pc = 1, won = false;
      const W = M[0].length;
      const maze = el("div", { class: "maze", style: `grid-template-columns:repeat(${W},auto)` });
      const cells = [];
      M.forEach((row, r) => [...row].forEach((ch, c) => { const d = el("div", { class: "cell " + (ch === "#" ? "wall" : "path") }); if (ch === "A") d.textContent = "🍎"; cells.push(d); maze.append(d); }));
      const at = (r, c) => cells[r * W + c];
      const draw = () => { cells.forEach((d) => { if (d.textContent === "🦔") d.textContent = ""; }); at(pr, pc).textContent = "🦔"; at(pr, pc).classList.add("trail"); };
      const move = (dr, dc) => {
        if (won) return;
        const nr = pr + dr, nc = pc + dc;
        if (M[nr][nc] === "#") { sfx.tick(); shakeEl(maze); return; }
        pr = nr; pc = nc; sfx.tone(500 + Math.random() * 200, 0.06, "sine", 0.1); draw();
        if (M[pr][pc] === "A") { won = true; sfx.good(); burstAt(at(pr, pc), ["🍎", "💖", "✨"], 12, 80); setTimeout(solve, 900); }
      };
      draw();
      const key = (e) => { const m = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }[e.key]; if (m) { e.preventDefault(); move(...m); } };
      document.addEventListener("keydown", key);
      root._cleanup = () => document.removeEventListener("keydown", key);
      let sx, sy;
      maze.addEventListener("pointerdown", (e) => { sx = e.clientX; sy = e.clientY; });
      maze.addEventListener("pointerup", (e) => { const dx = e.clientX - sx, dy = e.clientY - sy; if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return; Math.abs(dx) > Math.abs(dy) ? move(0, Math.sign(dx)) : move(Math.sign(dy), 0); });
      const b = (t, f, area) => el("button", { text: t, onclick: f, style: `grid-area:${area}` });
      const pad = el("div", { class: "dpad" }, b("⬆️", () => move(-1, 0), "1/2"), b("⬅️", () => move(0, -1), "2/1"), b("⬇️", () => move(1, 0), "2/2"), b("➡️", () => move(0, 1), "2/3"));
      root.append(maze, pad);
    },
  });

  /* ---------- 14: Kapibara-Wellness ---------- */
  R(14, {
    emoji: "🛁", title: "Kalles Wellness-Tag",
    intro: "Kalle das Kapibara hat heute frei und möchte einen Wellness-Tag! Streichle ihn, bis er vor Glück ganz entspannt ist. 🧖",
    hint: "Einfach ganz oft auf Kalle tippen. Kapibaras können nie genug Streicheleinheiten bekommen 🤎",
    outro: "Kalle ist jetzt das entspannteste Kapibara der Welt. 🍊🐤🧘",
    render(root, { solve }) {
      solve = once(solve);
      const src = document.getElementById("capy").cloneNode(true);
      const orange = src.querySelector("#capy-orange");
      src.removeAttribute("id"); src.querySelectorAll("[id]").forEach((n) => n.removeAttribute("id"));
      orange.removeAttribute("class"); orange.style.opacity = 0; orange.style.transition = "opacity .5s";
      src.style.cssText = "width:min(260px,70vw);display:block;margin:0 auto;cursor:pointer;overflow:visible";
      const stage = el("div", { style: "position:relative;width:fit-content;margin:10px auto 0" }, src);
      const bird = el("div", { text: "🐤", style: "position:absolute;right:28%;top:12%;font-size:34px;opacity:0;transition:all .6s;transform:translateY(-40px)" });
      const notes = el("div", { text: "🎶", style: "position:absolute;left:-6%;top:0;font-size:30px;opacity:0;transition:all .6s" });
      const water = el("div", { style: "position:absolute;left:-6%;right:-6%;bottom:-6px;height:0;background:rgba(120,190,255,.55);border-radius:0 0 40px 40px;transition:height .8s" });
      stage.append(water, bird, notes);
      const meter = el("div", { class: "meter" }, el("div"));
      const info = el("div", { class: "center", style: "font-weight:600;min-height:26px", text: "Kalle wartet… 🥺" });
      let happy = 0;
      const msgs = [[20, "Ooooh, das ist schön… 😌"], [35, "Eine Orange für den Kopf! 🍊"], [55, "Ein Vögelchen setzt sich dazu 🐤"], [75, "Zeit für ein warmes Bad ♨️"], [90, "Kalle summt vor Glück 🎶"]];
      src.addEventListener("click", () => {
        if (happy >= 100) return;
        happy = Math.min(100, happy + 5);
        meter.firstChild.style.width = happy + "%";
        src.animate([{ transform: "scale(1)" }, { transform: "scale(1.06,.94)" }, { transform: "scale(1)" }], { duration: 300 });
        sfx.tone(200 + happy * 3, 0.15, "sine", 0.2);
        burstAt(src, ["🤎", "💖", "✨"], 4, 70);
        for (const [t, m] of msgs) if (happy === t) info.textContent = m;
        if (happy >= 35) orange.style.opacity = 1;
        if (happy >= 55) { bird.style.opacity = 1; bird.style.transform = "none"; }
        if (happy >= 75) water.style.height = "38%";
        if (happy >= 90) notes.style.opacity = 1;
        if (happy >= 100) { info.textContent = "100 % entspannt! 🧘🤎"; sfx.good(); setTimeout(solve, 900); }
      });
      root.append(info, stage, meter);
    },
  });

  /* ---------- 15: Der Größe nach ---------- */
  R(15, {
    emoji: "🐘", title: "Klein, groß, riesig!",
    intro: "Hier sind alle Tiere gleich groß – das stimmt aber nicht! Tippe sie der Reihe nach an: vom kleinsten bis zum größten.",
    hint: "Das Kleinste krabbelt im Gras 🐜, das Größte schwimmt im Meer 🐋.",
    outro: "Perfekt sortiert – von der Ameise bis zum Wal! 🐜➡️🐋",
    render(root, { solve }) {
      solve = once(solve);
      const order = [["🐜", "Ameise"], ["🐭", "Maus"], ["🐈", "Katze"], ["🐎", "Pferd"], ["🐘", "Elefant"], ["🐋", "Blauwal"]];
      let next = 0;
      const line = el("div", { class: "row", style: "min-height:60px;background:#fff;border-radius:16px;padding:6px;margin-bottom:14px;box-shadow:inset 0 2px 6px rgba(0,0,0,.08)" });
      const grid = el("div", { class: "grid", style: "grid-template-columns:repeat(3,minmax(0,100px))" });
      const tiles = shuffle(order).map(([e, n]) => {
        const t = el("button", { class: "tile", style: "font-size:40px;flex-direction:column;display:flex;aspect-ratio:auto;padding:8px" }, el("span", { text: e }), el("span", { text: n, style: "font-size:14px" }));
        t.onclick = () => {
          if (e === order[next][0]) {
            next++; t.classList.add("done"); sfx.boop(300 + next * 80);
            const placed = el("span", { text: e, style: `font-size:${18 + next * 6}px;transition:.3s` }); line.append(placed);
            if (next === order.length) { sfx.good(); burstAt(line, ["✨", "💖"], 12, 120); setTimeout(solve, 900); }
          } else {
            sfx.bad(); shakeEl(t); toast(next ? `Hmm… kommt ${e} wirklich direkt nach ${order[next - 1][0]}? 🤔` : `Ist ${e} wirklich das allerkleinste Tier? 🤔`);
          }
        };
        grid.append(t); return t;
      });
      root.append(el("div", { class: "center", style: "font-size:14px;color:var(--ink-soft)", text: "Deine Reihe:" }), line, grid);
    },
  });

  /* ---------- 16: Pfoten-Geheimschrift ---------- */
  R(16, {
    emoji: "🐼", title: "Die Pfoten-Geheimschrift",
    intro: "Die Tiere haben dir eine geheime Botschaft geschrieben! Jedes Tier steht für einen Buchstaben. Entschlüssle das Wort.",
    hint: "Geh Tier für Tier durch und schau im Schlüssel nach. Das Wort ist etwas, das man gern im Arm hält… 🧸",
    outro: "KUSCHELTIER! 🧸 Genau das bist du für uns alle.",
    render(root, { solve }) {
      const key = [["🐶", "K"], ["🐱", "U"], ["🐰", "S"], ["🦊", "C"], ["🐼", "H"], ["🐨", "E"], ["🐯", "L"], ["🦁", "T"], ["🐮", "I"], ["🐷", "R"], ["🐸", "A"], ["🐵", "M"], ["🐔", "N"], ["🐧", "O"]];
      const msg = "🐶🐱🐰🦊🐼🐨🐯🦁🐮🐨🐷";
      const table = el("div", { class: "grid", style: "grid-template-columns:repeat(7,minmax(0,52px));gap:6px" });
      shuffle(key, seeded(16)).forEach(([e, l]) => {
        const t = el("button", { class: "tile", style: "font-size:22px;display:flex;flex-direction:column;aspect-ratio:auto;padding:4px 0" }, el("span", { text: e }), el("b", { text: l, style: "font-size:16px" }));
        t.onclick = () => { sfx.boop(300 + l.charCodeAt(0) * 4); t.classList.toggle("sel"); };
        table.append(t);
      });
      root.append(
        el("div", { class: "center", style: "font-size:14px;color:var(--ink-soft)", text: "🔑 Der Schlüssel (antippen zum Markieren):" }), table,
        el("div", { class: "center", style: "font-size:14px;color:var(--ink-soft);margin-top:14px", text: "✉️ Die geheime Botschaft:" }),
        el("div", { class: "center", style: "font-size:min(36px,7.5vw);letter-spacing:2px;background:#fff;border-radius:16px;padding:8px;margin-top:4px", text: msg })
      );
      textAnswer(root, { answers: ["Kuscheltier"], placeholder: "Geheimes Wort", onRight: solve });
    },
  });

  /* ---------- 17: Tierbabys ---------- */
  R(17, {
    emoji: "🐑", title: "Wie heißen die Babys?",
    intro: "Jedes Tierbaby hat einen eigenen Namen! Tippe links auf ein Tier und rechts auf den passenden Baby-Namen.",
    hint: "Das Reh-Baby heißt wie ein Kitz-ligeres Wort… 😉 und das kleine Pferd galoppiert als „F…“ über die Wiese.",
    outro: "Alle Tierbabys sind bei ihren Mamas! 🥹 So wie es sich gehört.",
    render(root, { solve }) {
      solve = once(solve);
      const pairs = [["🐴", "Pferd", "Fohlen"], ["🐷", "Schwein", "Ferkel"], ["🦌", "Reh", "Kitz"], ["🐄", "Kuh", "Kalb"], ["🐑", "Schaf", "Lamm"], ["🐕", "Hund", "Welpe"]];
      let sel = null, done = 0;
      const L = el("div", { style: "display:flex;flex-direction:column;gap:8px" }), Rr = el("div", { style: "display:flex;flex-direction:column;gap:8px" });
      const mk = (text) => el("button", { class: "btn btn-soft", text, style: "font-size:17px;padding:10px 8px;width:100%" });
      shuffle(pairs).forEach(([e, a, baby]) => {
        const b = mk(`${e} ${a}`); b.dataset.k = baby;
        b.onclick = () => { if (b.disabled) return; sel?.style.removeProperty("outline"); sel = b; b.style.outline = "3px solid var(--red)"; sfx.pop(); };
        L.append(b);
      });
      shuffle(pairs).forEach(([, , baby]) => {
        const b = mk(baby);
        b.onclick = () => {
          if (b.disabled) return;
          if (!sel) { toast("Wähle zuerst links ein Tier 👈"); return; }
          if (sel.dataset.k === baby) {
            [sel, b].forEach((x) => { x.disabled = true; x.style.background = "#c9f2d7"; x.style.outline = ""; });
            sfx.good(); burstAt(b, ["💖", "🍼", "✨"], 8, 60); sel = null;
            if (++done === pairs.length) setTimeout(solve, 800);
          } else { sfx.bad(); shakeEl(b); }
        };
        Rr.append(b);
      });
      root.append(el("div", { style: "display:grid;grid-template-columns:1fr 1fr;gap:14px;max-width:420px;margin:0 auto" }, L, Rr));
    },
  });

  /* ---------- 18: Pinguin fängt Fische ---------- */
  R(18, {
    emoji: "🐟", title: "Pingus Fischfang",
    intro: "Es regnet Fische! 🐟 Hilf Pingu, 10 Stück zu fangen. Bewege ihn mit dem Finger (oder der Maus/den Pfeiltasten) hin und her.",
    hint: "Lass den Finger einfach auf dem Spielfeld und zieh Pingu immer unter den nächsten Fisch. Verpasste Fische sind nicht schlimm!",
    outro: "Pingu ist pappsatt! 🐧🐟 Danke, Mama!",
    render(root, { solve }) {
      solve = once(solve);
      const GOAL = 10;
      const area = el("div", { class: "catch-area" }, el("div", { class: "moon", text: "🌙" }));
      const pingu = el("div", { class: "catcher", text: "🐧" });
      area.append(pingu);
      const info = el("div", { class: "center", style: "font-weight:600;margin-bottom:8px", text: `🐟 0 / ${GOAL}` });
      let px = 0.5, score = 0, fish = [], last = 0, spawnT = 0, raf, running = false;
      const setX = (clientX) => { const r = area.getBoundingClientRect(); px = Math.min(0.95, Math.max(0.05, (clientX - r.left) / r.width)); };
      area.addEventListener("pointermove", (e) => setX(e.clientX));
      area.addEventListener("pointerdown", (e) => { setX(e.clientX); if (!running) begin(); });
      const key = (e) => { if (e.key === "ArrowLeft") px = Math.max(0.05, px - 0.07); if (e.key === "ArrowRight") px = Math.min(0.95, px + 0.07); };
      document.addEventListener("keydown", key);
      const loop = (t) => {
        const dt = Math.min(50, t - (last || t)); last = t;
        const H = area.clientHeight, Wd = area.clientWidth;
        pingu.style.left = px * 100 + "%";
        spawnT -= dt;
        if (spawnT <= 0) { spawnT = 1000; const f = el("div", { class: "fall", text: pick(["🐟", "🐠", "🐟", "🦐"]) }); f._x = 0.06 + Math.random() * 0.88; f._y = -30; f.style.left = `calc(${f._x * 100}% - 15px)`; area.append(f); fish.push(f); }
        fish = fish.filter((f) => {
          f._y += dt * 0.13; f.style.top = f._y + "px";
          if (f._y > H - 80 && f._y < H - 30 && Math.abs((f._x - px) * Wd) < 42) {
            score++; info.textContent = `🐟 ${score} / ${GOAL}`; sfx.pop(); burstAt(pingu, ["💖", "✨"], 5, 40); f.remove();
            if (score >= GOAL) { running = false; info.textContent = "Pingu ist satt! 🐧💖"; setTimeout(solve, 700); }
            return false;
          }
          if (f._y > H) { f.remove(); return false; }
          return true;
        });
        if (running) raf = requestAnimationFrame(loop);
      };
      const begin = () => { running = true; startBtn.remove(); last = 0; raf = requestAnimationFrame(loop); };
      const startBtn = el("button", { class: "btn btn-green", text: "▶️ Los geht's!", onclick: begin });
      root._cleanup = () => { running = false; cancelAnimationFrame(raf); document.removeEventListener("keydown", key); };
      root.append(info, area, el("div", { class: "row", style: "margin-top:10px" }, startBtn));
    },
  });

  /* ---------- 19: Siebenschläfer wecken ---------- */
  R(19, {
    emoji: "😴", title: "Weck die Siebenschläfer!",
    intro: "Ein paar Tiere halten noch Winterschlaf – dabei ist doch Advent! Tippst du ein Tier an, wechseln es UND seine direkten Nachbarn (oben, unten, links, rechts) zwischen wach und schlafend. Weck alle auf!",
    hint: "Psst: Tippe genau einmal oben in der Mitte, einmal rechts in der Mitte und einmal unten links. ⏰",
    outro: "Guten Morgen, alle zusammen! ☀️ Jetzt kann die Adventsfeier beginnen.",
    render(root, { solve }) {
      solve = once(solve);
      const animals = ["🐶", "🐱", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🐹"];
      const scramble = [1, 5, 6];
      const toggleSet = (s, i) => { const r = Math.floor(i / 3), c = i % 3; [[r, c], [r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]].forEach(([a, b]) => { if (a >= 0 && a < 3 && b >= 0 && b < 3) s[a * 3 + b] = !s[a * 3 + b]; }); };
      const init = Array(9).fill(true); scramble.forEach((i) => toggleSet(init, i));
      let awake = init.slice(), moves = 0, done = false;
      const grid = el("div", { class: "grid", style: "grid-template-columns:repeat(3,minmax(0,88px));gap:10px" });
      const info = el("div", { class: "center", style: "font-weight:600;margin-bottom:8px" });
      const tiles = animals.map((a, i) => { const t = el("button", { class: "tile", style: "font-size:44px;position:relative" }); t.onclick = () => press(i); grid.append(t); return t; });
      const draw = () => {
        tiles.forEach((t, i) => { t.innerHTML = ""; t.append(el("span", { text: animals[i], style: awake[i] ? "" : "filter:grayscale(1) opacity(.45)" })); if (!awake[i]) t.append(el("span", { text: "💤", style: "position:absolute;top:2px;right:4px;font-size:20px" })); t.style.background = awake[i] ? "#fff6c9" : "#d9d6e8"; });
        info.textContent = `${awake.filter(Boolean).length} von 9 wach · ${moves} Züge`;
      };
      const press = (i) => {
        if (done) return;
        toggleSet(awake, i); moves++; sfx.boop(300 + i * 50); draw();
        if (awake.every(Boolean)) { done = true; sfx.good(); burstAt(grid, ["☀️", "✨", "💖"], 14, 120); setTimeout(solve, 1000); }
      };
      draw();
      root.append(info, grid, el("div", { class: "row", style: "margin-top:12px" }, el("button", { class: "btn btn-soft", text: "🔄 Von vorne", onclick: () => { awake = init.slice(); moves = 0; draw(); } })));
    },
  });

  /* ---------- 20: Fehlersuche ---------- */
  R(20, {
    emoji: "🔍", title: "Finde die 4 Unterschiede",
    intro: "Die Tierfamilie hat zwei Fotos gemacht – aber auf dem rechten haben ein paar Tiere die Plätze getauscht! Tippe die 4 Unterschiede im rechten Bild an.",
    hint: "Vergleiche Reihe für Reihe: erst die oberste Reihe links mit der obersten Reihe rechts, dann die nächste… 🔎",
    outro: "Alle gefunden! 🕵️‍♀️ Sherlock Holmes wäre neidisch.",
    render(root, { solve }) {
      solve = once(solve);
      const rnd = seeded(2020);
      const set = ["🐶", "🐱", "🐰", "🦊", "🐻", "🐼", "🐨", "🐸", "🐷", "🐮", "🐵", "🐔"];
      const N = 5;
      const A = Array.from({ length: N * N }, () => set[Math.floor(rnd() * set.length)]);
      const B = A.slice();
      const diffs = shuffle(A.map((_, i) => i), rnd).slice(0, 4);
      diffs.forEach((i) => { let n; do n = set[Math.floor(rnd() * set.length)]; while (n === A[i]); B[i] = n; });
      let found = 0;
      const mkGrid = (arr, clickable) => {
        const g = el("div", { class: "grid", style: `grid-template-columns:repeat(${N},min(30px,7vw));gap:3px;background:#fff;padding:8px;border-radius:14px;box-shadow:0 3px 0 #ead6c8` });
        arr.forEach((e, i) => {
          const c = el("div", { text: e, style: "font-size:min(22px,5.2vw);text-align:center;border-radius:8px;cursor:pointer;transition:background .3s" });
          if (clickable) c.onclick = () => {
            if (c._f) return;
            if (diffs.includes(i)) { c._f = true; c.style.background = "#c9f2d7"; left.children[i].style.background = "#c9f2d7"; sfx.good(); burstAt(c, ["✨", "💖"], 6, 40); info.textContent = `${++found} / 4 gefunden`; if (found === 4) setTimeout(solve, 800); }
            else { sfx.tick(); c.animate([{ transform: "scale(1)" }, { transform: "scale(.7)" }, { transform: "scale(1)" }], { duration: 250 }); }
          };
          g.append(c);
        });
        return g;
      };
      const left = mkGrid(A, false), right = mkGrid(B, true);
      const info = el("div", { class: "center", style: "font-weight:600;margin-bottom:8px", text: "0 / 4 gefunden" });
      root.append(info, el("div", { class: "row", style: "gap:14px;align-items:flex-start" },
        el("div", { class: "center" }, el("div", { text: "📷 Foto 1", style: "font-size:14px" }), left),
        el("div", { class: "center" }, el("div", { text: "📷 Foto 2 – hier tippen!", style: "font-size:14px" }), right)));
    },
  });

  /* ---------- 21: Keks-Krimi ---------- */
  R(21, {
    emoji: "🍪", title: "Der große Keks-Krimi",
    intro: "Skandal in der Weihnachtsbäckerei! Der allerletzte Zimtstern ist verschwunden. Lies die Hinweise und tippe auf den Dieb!",
    hint: "Streiche nacheinander alle durch, die es laut den Hinweisen NICHT gewesen sein können. Wer bleibt übrig? 🕵️",
    outro: "Rocky hat gestanden: „Okay, okay… er war einfach soooo lecker!“ 🦝🍪 Zur Strafe muss er heute abspülen.",
    render(root, { solve }) {
      solve = once(solve);
      const clues = [
        "🧶 Am Tatort lag ein Haar von einem langen, buschigen Schwanz.",
        "🦮 Bello war zur Tatzeit mit Mama Gassi – das hat sie selbst gesehen.",
        "😴 Mimi hat die ganze Zeit auf dem Sofa geschnarcht. Ganz laut.",
        "🧼 Der Dieb hat den Keks vor dem Essen ordentlich gewaschen. Ganz krümelig nass!",
      ];
      const sus = [["🐶", "Bello", "Wuff?! Ich war doch Gassi! 🦮"], ["🐱", "Mimi", "Ich? Ich hab geschlafen! 😾"], ["🦝", "Rocky", null], ["🐰", "Hoppel", "Mein Schwänzchen ist doch winzig! 🐰"], ["🐹", "Pummel", "Ich hab nur Backen voller Körner, ehrlich! 🌻"]];
      const list = el("div", { style: "background:#fff8d9;border-radius:16px;padding:10px 14px;border:2px dashed #f2d27a;font-size:16px;line-height:1.6" }, el("b", { text: "🔎 Hinweise:" }), ...clues.map((c) => el("div", { text: c })));
      const grid = el("div", { class: "grid", style: "grid-template-columns:repeat(5,minmax(0,78px));gap:8px;margin-top:14px" });
      sus.forEach(([e, n, excuse]) => {
        const b = el("button", { class: "tile", style: "display:flex;flex-direction:column;aspect-ratio:auto;padding:8px 0;font-size:36px" }, el("span", { text: e }), el("span", { text: n, style: "font-size:13px" }));
        b.onclick = () => {
          if (!excuse) { b.classList.add("good"); sfx.good(); burstAt(b, ["🍪", "🚨", "✨"], 12, 80); toast("🚨 Erwischt! Rocky hat noch Krümel im Gesicht!"); setTimeout(solve, 1200); }
          else { b.classList.add("bad"); sfx.bad(); shakeEl(b); toast(`${e} ${excuse}`); }
        };
        grid.append(b);
      });
      root.append(list, el("div", { class: "center", style: "margin-top:12px;font-weight:600", text: "Die Verdächtigen:" }), grid);
    },
  });

  /* ---------- 22: Wortsuche ---------- */
  R(22, {
    emoji: "🔤", title: "Tierischer Buchstabensalat",
    intro: "In dem Buchstaben-Gitter verstecken sich 6 Tiere – waagerecht (→) oder senkrecht (↓). Tippe auf den ersten und dann auf den letzten Buchstaben eines Tiers!",
    hint: "Such zuerst nach seltenen Buchstaben wie Z, K oder P. Alle Wörter laufen von links nach rechts oder von oben nach unten.",
    outro: "Alle 6 Tiere gefunden! 🐶🐱🦔🦦🐼 – und ein Esel, der ganz stolz ist, dabei zu sein.",
    render(root, { solve }) {
      solve = once(solve);
      const words = ["KATZE", "OTTER", "PANDA", "HUND", "IGEL", "ESEL"];
      const N = 8;
      let grid, placed;
      for (let seed = 22; ; seed++) {
        const rnd = seeded(seed);
        grid = Array(N * N).fill(null); placed = [];
        let ok = true;
        for (const w of words) {
          let put = false;
          for (let tries = 0; tries < 200 && !put; tries++) {
            const dir = rnd() < 0.5 ? [0, 1] : [1, 0];
            const r = Math.floor(rnd() * (N - (dir[0] ? w.length - 1 : 0))), c = Math.floor(rnd() * (N - (dir[1] ? w.length - 1 : 0)));
            const idx = [...w].map((_, k) => (r + dir[0] * k) * N + (c + dir[1] * k));
            if (idx.every((ix, k) => grid[ix] === null || grid[ix] === w[k])) { idx.forEach((ix, k) => (grid[ix] = w[k])); placed.push({ w, idx }); put = true; }
          }
          if (!put) { ok = false; break; }
        }
        if (ok) { const AL = "ABDEFGHIKLMNOPRSTUW"; grid = grid.map((g) => g || AL[Math.floor(rnd() * AL.length)]); break; }
      }
      let first = null, found = new Set();
      const listEl = el("div", { class: "word-list" });
      const tags = words.map((w) => { const s = el("span", { text: w }); listEl.append(s); return s; });
      const ws = el("div", { class: "ws", style: `grid-template-columns:repeat(${N},auto)` });
      const btns = grid.map((ch, i) => {
        const b = el("button", { text: ch });
        b.onclick = () => {
          sfx.tick();
          if (first === null) { first = i; b.classList.add("sel"); return; }
          const a = first; first = null; btns[a].classList.remove("sel");
          const hit = placed.find((p) => !found.has(p.w) && ((p.idx[0] === a && p.idx[p.idx.length - 1] === i) || (p.idx[0] === i && p.idx[p.idx.length - 1] === a)));
          if (hit) {
            found.add(hit.w); hit.idx.forEach((ix) => btns[ix].classList.add("found")); tags[words.indexOf(hit.w)].classList.add("found");
            sfx.good(); burstAt(b, ["✨", "💖"], 8, 60);
            if (found.size === words.length) setTimeout(solve, 900);
          } else if (a !== i) { shakeEl(ws); }
        };
        ws.append(b); return b;
      });
      root.append(ws, listEl);
    },
  });

  /* ---------- 23: Schiebepuzzle ---------- */
  R(23, {
    emoji: "🧩", title: "Das Familienfoto",
    intro: "Alle Tiere wollen aufs Weihnachts-Familienfoto – aber sie stehen völlig durcheinander! Schiebe sie in die richtige Reihenfolge (1 bis 8, das freie Feld unten rechts).",
    hint: "Bring zuerst die obere Reihe (1, 2, 3) in Ordnung und rühr sie dann nicht mehr an. Danach links die 4 und die 7… und den Rest schiebst du im Kreis herum. 🔄",
    outro: "Klick! 📸 Das schönste Familienfoto aller Zeiten.",
    render(root, { solve }) {
      solve = once(solve);
      const goal = ["🐶", "🐱", "🐰", "🦊", "🐻", "🐼", "🐨", "🐹", null];
      let b = goal.slice(), prev = -1;
      const nb = (i) => { const r = Math.floor(i / 3), c = i % 3, o = []; if (r > 0) o.push(i - 3); if (r < 2) o.push(i + 3); if (c > 0) o.push(i - 1); if (c < 2) o.push(i + 1); return o; };
      const swap = (i, j) => ([b[i], b[j]] = [b[j], b[i]]);
      do {
        b = goal.slice(); prev = -1;
        for (let k = 0; k < 22; k++) { const e = b.indexOf(null); const opts = nb(e).filter((x) => x !== prev); const m = pick(opts); prev = e; swap(e, m); }
      } while (b.every((x, i) => x === goal[i]));
      let moves = 0, done = false;
      const info = el("div", { class: "center", style: "font-weight:600;margin-bottom:8px" });
      const box = el("div", { class: "slider" });
      const preview = el("div", { class: "center", style: "font-size:14px;color:var(--ink-soft);margin-top:10px", text: "So soll's aussehen: " + goal.slice(0, 8).map((g, i) => `${i + 1}${g}`).join(" ") });
      const draw = () => {
        box.innerHTML = "";
        b.forEach((x, i) => {
          const t = el("button", { class: x ? "" : "empty" });
          if (x) { t.append(el("small", { text: goal.indexOf(x) + 1 }), x); t.onclick = () => move(i); }
          box.append(t);
        });
        info.textContent = `${moves} Züge`;
      };
      const move = (i) => {
        if (done) return;
        const e = b.indexOf(null);
        if (!nb(e).includes(i)) { sfx.tick(); return; }
        swap(e, i); moves++; sfx.tone(400 + i * 40, 0.08, "sine", 0.12); draw();
        if (b.every((x, k) => x === goal[k])) { done = true; sfx.good(); burstAt(box, ["📸", "✨", "💖"], 14, 120); setTimeout(solve, 1000); }
      };
      draw();
      root.append(info, box, preview);
    },
  });

  /* ---------- 24: Das große Finale ---------- */
  R(24, {
    emoji: "🎄", title: "Das Weihnachtsgeheimnis",
    intro: "Heute ist Heiligabend! 🎄 Bring alle 23 Buchstaben aus deinem Körbchen in die richtige Reihenfolge und lüfte das Geheimnis. Tippe einen Buchstaben an, um ihn in die nächste freie Lücke zu legen – tippe auf eine Lücke, um ihn zurückzunehmen.",
    hint: App.config.finalClue,
    render(root, { solve }) {
      const words = App.words, target = App.letters.join("");
      const missing = [];
      for (let d = 1; d <= 23; d++) if (!App.isSolved(d)) missing.push(d);

      if (App.isSolved(24)) {
        root.append(el("div", { class: "center" },
          el("div", { class: "big-emoji", text: "💝" }),
          el("p", { style: "font-size:22px;font-weight:700;color:var(--red)", text: words.join(" ") }),
          el("button", { class: "btn btn-green", text: "🎁 Überraschung nochmal ansehen", onclick: () => finale() })));
        return;
      }
      if (missing.length) {
        root.append(el("div", { class: "center" },
          el("div", { class: "big-emoji", text: "🐶👃" }),
          el("p", { style: "font-size:17px", text: `Oh! In deinem Körbchen fehlen noch ${missing.length} Buchstaben (Türchen ${missing.join(", ")}). Du kannst die Türchen noch lösen – oder Bello erschnüffelt sie für dich.` }),
          el("div", { class: "row" },
            el("button", { class: "btn btn-soft", text: "🏠 Erst die Türchen lösen", onclick: () => App.closeModal() }),
            el("button", { class: "btn btn-green", text: "🐶 Bello, such!", onclick: () => { root.innerHTML = ""; sfx.boop(); build(); } }))));
        return;
      }
      build();

      function build() {
        const pool = [];
        for (let d = 1; d <= 23; d++) pool.push({ ch: App.letterFor(d), day: d, used: false });
        const slots = Array(target.length).fill(null); // -> pool index
        const locked = new Set();
        const wordStarts = []; let p = 0; words.forEach((w) => { wordStarts.push(p); p += w.length; });
        const slotWrap = el("div", { class: "slots" });
        const poolWrap = el("div", { class: "pool" });
        const fb = el("div", { class: "feedback" });
        let slotEls = [];
        words.forEach((w, wi) => {
          const sw = el("div", { class: "slot-word" });
          for (let k = 0; k < w.length; k++) {
            const idx = wordStarts[wi] + k;
            const s = el("button", { class: "slot" });
            s.onclick = () => { if (slots[idx] == null || locked.has(idx)) return; pool[slots[idx]].used = false; slots[idx] = null; sfx.tick(); draw(); };
            sw.append(s); slotEls[idx] = s;
          }
          slotWrap.append(sw);
        });
        const poolBtns = pool.map((pp, i) => {
          const b = el("button", { text: pp.ch, title: "Türchen " + pp.day });
          b.onclick = () => {
            const free = slots.findIndex((s, k) => s == null && !locked.has(k));
            if (free < 0 || pp.used) return;
            pp.used = true; slots[free] = i; sfx.boop(300 + free * 20); draw(); check();
          };
          poolWrap.append(b); return b;
        });
        const draw = () => {
          slotEls.forEach((s, k) => { s.textContent = slots[k] != null ? pool[slots[k]].ch : ""; s.className = "slot" + (slots[k] != null ? " filled" : "") + (locked.has(k) ? " right" : ""); });
          poolBtns.forEach((b, i) => b.classList.toggle("used", pool[i].used));
        };
        const check = () => {
          if (slots.some((s) => s == null)) { fb.textContent = ""; return; }
          const guess = slots.map((s) => pool[s].ch).join("");
          if (guess === target) {
            slotEls.forEach((s) => s.classList.add("right"));
            fb.textContent = "💖💖💖";
            solve(); setTimeout(finale, 1200);
          } else {
            const right = [...guess].filter((c, k) => c === target[k]).length;
            sfx.bad(); shakeEl(slotWrap);
            fb.textContent = `Noch nicht ganz! ${right} von ${target.length} Buchstaben stehen schon richtig 🐾`;
          }
        };
        const clearAll = () => { slots.forEach((s, k) => { if (s != null && !locked.has(k)) { pool[s].used = false; slots[k] = null; } }); fb.textContent = ""; draw(); };
        let revealed = 0;
        const reveal = () => {
          if (revealed >= words.length - 1) { toast("Das letzte Wort schaffst du alleine! 💪"); return; }
          clearAll();
          const wi = revealed++;
          for (let k = 0; k < words[wi].length; k++) {
            const idx = wordStarts[wi] + k;
            const pi = pool.findIndex((pp) => !pp.used && pp.ch === target[idx]);
            pool[pi].used = true; slots[idx] = pi; locked.add(idx);
          }
          sfx.squeak(); draw(); check();
          toast(`🐶 Bello hat das ${wi + 1}. Wort erschnüffelt!`);
        };
        root.append(slotWrap, poolWrap, fb,
          el("div", { class: "row", style: "margin-top:14px" },
            el("button", { class: "btn btn-soft", text: "🔄 Alles zurück", onclick: () => { clearAll(); sfx.tick(); } }),
            el("button", { class: "btn btn-soft", text: "🐶 Ein Wort verraten", onclick: reveal })));
        draw();
      }

      function finale() {
        App.closeModal();
        App.refreshDoor(24);
        const C = App.config;
        const animals = ["🐶", "🐱", "🦝", "🐰", "🦊", "🐼", "🐧", "🦔", "🐹", "🦦"];
        const ov = el("div", { class: "finale-overlay" });
        const animRow = el("div", { class: "finale-animals" }, ...animals.map((a, i) => el("span", { text: a, style: `animation-delay:${i * 0.08}s` })));
        const sentence = el("div", { style: "font-size:clamp(26px,6vw,44px);font-weight:700;color:var(--green);margin:14px 0" }, App.words.join(" ") + " 💖");
        ov.append(el("div", { class: "finale-card" },
          animRow,
          el("h2", { text: C.finalTitle }),
          sentence,
          el("div", { class: "msg", text: C.finalMessage }),
          el("p", { style: "font-size:20px;font-weight:600;margin-top:16px", text: C.signature }),
          el("div", { class: "row", style: "margin-top:16px" },
            el("button", { class: "btn", text: "🎉 Nochmal Konfetti!", onclick: () => { confetti(); sfx.jingle(); } }),
            el("button", { class: "btn btn-soft", text: "Schließen", onclick: () => ov.remove() }))));
        animRow.addEventListener("click", (e) => { if (e.target.tagName === "SPAN") { sfx.boop(300 + Math.random() * 500); burstAt(e.target, ["💖", "✨"], 8, 60); } });
        document.body.append(ov);
        sfx.jingle();
        confetti(); setTimeout(() => rain(["💖", "💗", "🎄", "⭐", "🎁", "🐾"], 70), 1500); setTimeout(() => confetti(), 3500);
      }
    },
  });
})();
