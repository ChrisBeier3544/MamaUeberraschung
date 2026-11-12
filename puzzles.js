/* =========================================================
   Die 24 Rätsel
   ========================================================= */
(() => {
  const { el, shuffle, seeded, pick, sleep, norm, sfx, burstAt, confetti, rain, toast, shakeEl, textAnswer } = App.h;
  const R = App.register;
  const A = (sp, col = 0, acc = "", accColor = "#e85d75") => ({ sp, col, acc, accColor });
  const pic = (v, opts = {}) => Animals.svg(v, { fit: true, ...opts });
  const once = (fn) => { let done = false; return (...a) => { if (!done) { done = true; fn(...a); } }; };
  const small = () => innerWidth < 640;
  const info = (text = "") => el("div", { class: "p-info", text });
  const sameArt = (a, b) => a.sp === b.sp && a.col === b.col && a.acc === b.acc;

  /* ---------- 1: Memory der Doppelgänger ---------- */
  R(1, {
    art: A("katze", 1, "brille"), title: "Memory der Doppelgänger",
    intro: "Zwölf Tierpaare liegen verdeckt auf dem Tisch. Aber Vorsicht: Einige Tiere haben einen Doppelgänger, der fast genauso aussieht – nur mit einem anderen Accessoire. Finde alle zwölf exakt gleichen Paare.",
    outro: "Zwölf Paare – und kein einziger Doppelgänger hat dich hereingelegt.",
    render(root, { solve }) {
      solve = once(solve);
      const set = this.data || [A("katze", 1, "brille"), A("katze", 1, "schal", "#e85d75"), A("hund", 0, "muetze"), A("hund", 0, "schleife", "#4f7fe0"), A("capy", 0, "orange"), A("capy", 0, "krone"),
        A("waschbaer", 0, "blume", "#e85d75"), A("waschbaer", 0, "fliege", "#4f7fe0"), A("fuchs", 0, ""), A("fuchs", 0, "geweih"), A("pinguin", 0, "schal", "#3f9e6e"), A("pinguin", 0, "muetze")];
      const cols = small() ? 4 : 6;
      const grid = el("div", { class: "grid", style: `grid-template-columns:repeat(${cols},minmax(0,130px));gap:10px` });
      const stat = info(`0 Züge · 0 von ${set.length} Paaren`);
      let open = [], lock = false, found = 0, moves = 0;
      shuffle([...set.keys(), ...set.keys()]).forEach((k) => {
        const c = el("div", { class: "mem-card" }, el("div", { class: "mem-inner" }, el("div", { class: "mem-face mem-back", text: "?" }), el("div", { class: "mem-face mem-front", html: pic(set[k]) })));
        c.onclick = () => {
          if (lock || c.classList.contains("flipped")) return;
          c.classList.add("flipped"); sfx.tick(); open.push([c, k]);
          if (open.length < 2) return;
          const [[x, a], [y, b]] = open; open = []; moves++;
          if (a === b) {
            setTimeout(() => { x.classList.add("matched"); y.classList.add("matched"); sfx.good(); burstAt(y, ["✨", "💖"], 8, 60); }, 300);
            if (++found === set.length) setTimeout(solve, 1100);
          } else { lock = true; setTimeout(() => { x.classList.remove("flipped"); y.classList.remove("flipped"); lock = false; }, 1000); }
          stat.textContent = `${moves} Züge · ${found} von ${set.length} Paaren`;
        };
        grid.append(c);
      });
      root.append(stat, grid);
    },
  });

  /* ---------- 2: Wer bin ich? ---------- */
  R(2, {
    art: A("waschbaer", 0, "brille"), title: "Wer bin ich?",
    intro: "Vier Tiere beschreiben sich selbst – aber nicht ganz direkt. Errätst du alle vier?",
    outro: "Meerschweinchen, Koala, Seepferdchen, Pinguin: alle durchschaut.",
    render(root, { solve }) {
      solve = once(solve);
      const rs = this.data || [
        ["Mein Name verspricht zweimal, was ich nicht halten kann: Ich lebe nicht im Meer – und ein Schwein bin ich auch nicht.", ["Meerschweinchen"]],
        ["Man nennt mich gern Bär, doch ich bin keiner. Ich verschlafe fast den ganzen Tag – schuld ist mein Leibgericht, das kaum Energie liefert.", ["Koala", "Koalabär"]],
        ["Ich bin ein Pferd, das nie galoppiert. Und bei uns trägt der Vater die Kinder aus.", ["Seepferdchen", "Seepferd"]],
        ["Ich trage Frack und tanze nie. Ich habe Flügel und fliege nie. Ich lebe im Eis und friere nie.", ["Pinguin"]],
      ];
      const box = el("div");
      root.append(box);
      const play = (k) => {
        box.innerHTML = "";
        box.append(info(`Rätsel ${k + 1} von ${rs.length}`), el("blockquote", { class: "riddle", text: rs[k][0] }));
        textAnswer(box, { answers: rs[k][1], placeholder: "Ich bin …", onRight: () => { sfx.good(); burstAt(box, ["✨", "💖"], 10, 90); setTimeout(() => (k < rs.length - 1 ? play(k + 1) : solve()), 700); } });
      };
      play(0);
    },
  });

  /* ---------- 3: Nonogramm ---------- */
  R(3, {
    art: A("katze", 0, "schleife", "#4f7fe0"), title: "Das Pixel-Porträt",
    intro: "Ein Nonogramm: Die Zahlen an jeder Zeile und Spalte verraten, wie viele Kästchen dort nacheinander ausgemalt werden – mehrere Zahlen bedeuten mehrere Blöcke mit mindestens einer Lücke dazwischen. Male das Bild aus. Mit „Kreuz“ kannst du Felder markieren, die sicher leer bleiben.",
    outro: "Ein Katzengesicht – Pixel für Pixel selbst gemalt.",
    render(root, { solve }) {
      solve = once(solve);
      const PIC = [".#........#.", ".##......##.", ".###....###.", ".##########.", "############", "##..####..##", "##..####..##", "############", "#####..#####", ".####..####.", "..########..", "....####...."];
      const N = PIC.length;
      const sol = PIC.map((r) => [...r].map((c) => c === "#"));
      const runs = (arr) => { const o = []; let k = 0; for (const v of arr) { if (v) k++; else if (k) { o.push(k); k = 0; } } if (k) o.push(k); return o.length ? o : [0]; };
      const rowC = sol.map(runs), colC = sol[0].map((_, c) => runs(sol.map((r) => r[c])));
      const st = Array(N * N).fill(0);
      let mode = 1, done = false;
      const cs = small() ? Math.floor((innerWidth - 90) / (N + 2.2)) : 34;
      const g = el("div", { class: "nono", style: `grid-template-columns:auto repeat(${N},${cs}px)` });
      g.append(el("div"));
      const colEls = colC.map((c) => { const d = el("div", { class: "nono-cc" }, ...c.map((n) => el("span", { text: n }))); g.append(d); return d; });
      const rowEls = [], cells = [];
      for (let r = 0; r < N; r++) {
        const rc = el("div", { class: "nono-rc", text: rowC[r].join(" ") }); g.append(rc); rowEls.push(rc);
        for (let c = 0; c < N; c++) {
          const i = r * N + c;
          const b = el("button", { class: "nono-cell" + (c % 4 === 3 && c < N - 1 ? " br" : "") + (r % 4 === 3 && r < N - 1 ? " bb" : ""), style: `width:${cs}px;height:${cs}px`, "aria-label": `Zeile ${r + 1}, Spalte ${c + 1}` });
          b.onclick = () => { if (done) return; st[i] = st[i] === mode ? 0 : mode; sfx.tick(); draw(); };
          g.append(b); cells.push(b);
        }
      }
      const draw = () => {
        cells.forEach((b, i) => { b.classList.toggle("on", st[i] === 1); b.classList.toggle("x", st[i] === 2); });
        let all = true;
        for (let r = 0; r < N; r++) { const ok = runs(st.slice(r * N, r * N + N).map((v) => v === 1)).join() === rowC[r].join(); rowEls[r].classList.toggle("ok", ok); all = all && ok; }
        for (let c = 0; c < N; c++) { const ok = runs(Array.from({ length: N }, (_, r) => st[r * N + c] === 1)).join() === colC[c].join(); colEls[c].classList.toggle("ok", ok); all = all && ok; }
        if (all && !done) { done = true; g.classList.add("solved"); sfx.good(); burstAt(g, ["✨", "💖"], 16, 140); setTimeout(solve, 1300); }
      };
      const bFill = el("button", { class: "btn btn-soft seg on", text: "■ Ausmalen" }), bX = el("button", { class: "btn btn-soft seg", text: "✕ Kreuz" });
      bFill.onclick = () => { mode = 1; bFill.classList.add("on"); bX.classList.remove("on"); };
      bX.onclick = () => { mode = 2; bX.classList.add("on"); bFill.classList.remove("on"); };
      const reset = el("button", { class: "btn btn-soft", text: "Alles löschen", onclick: () => { if (!done) { st.fill(0); draw(); } } });
      root.append(el("div", { class: "row", style: "margin-bottom:12px" }, bFill, bX, reset), el("div", { class: "scroll-x" }, g));
    },
  });

  /* ---------- 4: Tier-Sudoku ---------- */
  R(4, {
    art: A("fuchs", 0, "brille"), title: "Tier-Sudoku",
    intro: "Ein Sudoku mit sechs Tieren statt Zahlen: In jeder Zeile, jeder Spalte und jedem der sechs dick umrandeten Blöcke (2 × 3 Felder) muss jedes Tier genau einmal vorkommen. Tippe ein leeres Feld an und wähle dann unten ein Tier aus.",
    outro: "Jedes Tier an seinem Platz. Sudoku-Profi!",
    render(root, { solve }) {
      solve = once(solve);
      const BASE = [[0, 1, 2, 3, 4, 5], [3, 4, 5, 0, 1, 2], [1, 2, 0, 4, 5, 3], [4, 5, 3, 1, 2, 0], [2, 0, 1, 5, 3, 4], [5, 3, 4, 2, 0, 1]];
      const MASK = ["100010", "001100", "100001", "010010", "001100", "010001"];
      const icons = [A("capy"), A("katze", 1), A("hund", 2), A("pinguin"), A("fuchs"), A("schwein")];
      const perm = shuffle([0, 1, 2, 3, 4, 5]);
      const val = BASE.map((row, r) => row.map((v, c) => (MASK[r][c] === "1" ? perm[v] : null))).flat();
      const given = val.map((v) => v !== null);
      let sel = null, done = false;
      const cs = small() ? Math.floor((innerWidth - 80) / 6) : 74;
      const g = el("div", { class: "sudoku", style: `grid-template-columns:repeat(6,${cs}px)` });
      const cells = val.map((_, i) => {
        const r = Math.floor(i / 6), c = i % 6;
        const b = el("button", { class: "sd-cell" + (given[i] ? " given" : "") + (c === 2 ? " br" : "") + (r % 2 === 1 && r < 5 ? " bb" : ""), style: `height:${cs}px` });
        b.onclick = () => { if (given[i] || done) return; sel = i; sfx.tick(); draw(); };
        g.append(b); return b;
      });
      const set = (v) => { if (sel === null || done) { toast("Tippe zuerst ein leeres Feld an."); return; } val[sel] = v; sfx.boop(300 + (v ?? 0) * 60); draw(); };
      const pal = el("div", { class: "row", style: "margin-top:14px;gap:8px" }, ...icons.map((ic, k) => el("button", { class: "tile pal", html: pic(ic), onclick: () => set(k) })), el("button", { class: "btn btn-soft", text: "Leeren", onclick: () => set(null) }));
      const bad = (i) => {
        if (val[i] === null) return false;
        const r = Math.floor(i / 6), c = i % 6, bx = Math.floor(r / 2), by = Math.floor(c / 3);
        return val.some((v, j) => j !== i && v === val[i] && (Math.floor(j / 6) === r || j % 6 === c || (Math.floor(Math.floor(j / 6) / 2) === bx && Math.floor((j % 6) / 3) === by)));
      };
      const draw = () => {
        cells.forEach((b, i) => { b.innerHTML = val[i] !== null ? pic(icons[val[i]]) : ""; b.classList.toggle("sel", sel === i); b.classList.toggle("bad", bad(i)); });
        if (!done && val.every((v) => v !== null) && !val.some((_, i) => bad(i))) { done = true; sel = null; cells.forEach((b) => b.classList.remove("sel")); g.classList.add("solved"); sfx.good(); burstAt(g, ["✨", "💖"], 16, 140); setTimeout(solve, 1200); }
      };
      draw();
      root.append(g, pal);
    },
  });

  /* ---------- 5: Das große Gewusel ---------- */
  R(5, {
    art: A("pinguin", 0, "muetze"), title: "Das große Gewusel",
    intro: "Auf der Winterwiese ist Hochbetrieb, und alle laufen kreuz und quer. Wie viele Tiere tragen eine rote Weihnachtsmütze?",
    outro: "Genau neun Mützen. Bei dir geht keiner verloren.",
    render(root, { solve }) {
      const rnd = seeded(505);
      const kinds = Object.keys(Animals.SPECIES).filter((k) => k !== "giraffe");
      const others = ["", "", "krone", "geweih", "schal", "schleife", "brille", "blume", "fliege"];
      const arts = [];
      for (let i = 0; i < 46; i++) {
        const sp = kinds[Math.floor(rnd() * kinds.length)];
        arts.push(A(sp, Math.floor(rnd() * Animals.SPECIES[sp].colors.length), i < 9 ? "muetze" : others[Math.floor(rnd() * others.length)], ["#e85d75", "#3f9e6e", "#4f7fe0", "#f39c32"][i % 4]));
      }
      const scene = el("div", { class: "scene meadow", style: `height:${small() ? 380 : 470}px` });
      const w = small() ? 52 : 74;
      const actors = shuffle(arts).map((a) => { const d = el("div", { class: "actor", html: Animals.svg(a, { width: w, walk: true }) }); scene.append(d); return d; });
      const place = () => actors.forEach((d) => { const nx = Math.random() * 90; d.classList.toggle("flip", nx < parseFloat(d.style.left || 50)); d.style.left = nx + "%"; d.style.top = 4 + Math.random() * 80 + "%"; });
      place();
      let frozen = false;
      const iv = setInterval(() => { if (!frozen) place(); }, 2600);
      root._cleanup = () => clearInterval(iv);
      const fz = el("button", { class: "btn btn-soft", text: "Alle anhalten" });
      fz.onclick = () => {
        frozen = !frozen; fz.textContent = frozen ? "Weiterlaufen lassen" : "Alle anhalten";
        const s = scene.getBoundingClientRect();
        actors.forEach((d) => {
          if (frozen) { const r = d.getBoundingClientRect(); d.style.transition = "none"; d.style.left = ((r.left - s.left) / s.width) * 100 + "%"; d.style.top = ((r.top - s.top) / s.height) * 100 + "%"; }
          else d.style.transition = "";
          d.querySelector("svg").classList.toggle("walking", !frozen);
        });
        sfx.boop();
      };
      root.append(scene, el("div", { class: "row", style: "margin-top:12px" }, fz));
      textAnswer(root, { answers: ["9", "neun"], placeholder: "Anzahl Mützen", onRight: () => { clearInterval(iv); solve(); } });
    },
  });

  /* ---------- 6: Buchstabensalat ---------- */
  R(6, {
    art: A("hund", 0, "muetze"), title: "Nikolaus' Buchstabensalat",
    intro: "Dem Nikolaus ist der Sack gerissen, und drei ziemlich ungewöhnliche Tiernamen sind dabei in ihre Buchstaben zerfallen. Setz sie wieder zusammen.",
    outro: "Schnabeltier, Erdmännchen, Gürteltier – der Nikolaus bedankt sich.",
    render(root, { solve }) {
      solve = once(solve);
      const words = this.data || ["SCHNABELTIER", "ERDMÄNNCHEN", "GÜRTELTIER"];
      const box = el("div");
      root.append(box);
      const play = (w) => {
        const word = words[w];
        box.innerHTML = "";
        let letters = shuffle(word.split(""));
        while (letters.join("") === word) letters = shuffle(word.split(""));
        let typed = [];
        const out = el("div", { class: "slot-word big", style: "justify-content:center;margin:16px 0;flex-wrap:wrap" });
        const pool = el("div", { class: "pool big" });
        letters.forEach((ch) => { const b = el("button", { text: ch }); b.onclick = () => { if (b.classList.contains("used")) return; b.classList.add("used"); typed.push(b); sfx.tick(); draw(); }; pool.append(b); });
        const draw = () => {
          out.innerHTML = "";
          for (let i = 0; i < word.length; i++) out.append(el("div", { class: "slot" + (typed[i] ? " filled" : ""), text: typed[i]?.textContent || "" }));
          if (typed.length === word.length) {
            if (typed.map((b) => b.textContent).join("") === word) {
              [...out.children].forEach((s) => s.classList.add("right")); sfx.good(); burstAt(out, ["✨", "💖"], 10, 100);
              setTimeout(() => (w < words.length - 1 ? play(w + 1) : solve()), 1100);
            } else { sfx.bad(); shakeEl(out); setTimeout(() => { typed.forEach((b) => b.classList.remove("used")); typed = []; draw(); }, 700); }
          }
        };
        box.append(info(`Tier ${w + 1} von ${words.length} · ${word.length} Buchstaben`), out, pool,
          el("div", { class: "row", style: "margin-top:14px" }, el("button", { class: "btn btn-soft", text: "⌫ Letzten zurück", onclick: () => { const b = typed.pop(); if (b) b.classList.remove("used"); draw(); } }), el("button", { class: "btn btn-soft", text: "Alle zurück", onclick: () => { typed.forEach((b) => b.classList.remove("used")); typed = []; draw(); } })));
        draw();
      };
      play(0);
    },
  });

  /* ---------- 7: Das Tier-Orchester ---------- */
  R(7, {
    art: A("ente", 0, "fliege", "#4f7fe0"), title: "Das Tier-Orchester",
    intro: "Sechs Musiker, eine Melodie. Hör genau zu und spiel sie nach. Jede Runde kommt ein Ton dazu – das Konzert ist geschafft, wenn du sieben Töne fehlerfrei nachspielst.",
    outro: "Sieben Töne, kein falscher. Standing Ovations vom ganzen Ensemble.",
    render(root, { solve }) {
      solve = once(solve);
      const inst = [[A("capy"), 262, "#ffd9cc"], [A("katze", 0), 294, "#fff1b5"], [A("hund", 0), 330, "#d6f2dd"], [A("pinguin"), 392, "#d7e8ff"], [A("ente"), 440, "#f3dcff"], [A("schaf"), 523, "#ffe0e8"]];
      const LEN = 7;
      const seq = Array.from({ length: LEN }, () => Math.floor(Math.random() * inst.length));
      let len = 1, pos = 0, listening = false, alive = true;
      const msg = info("Bereit?");
      const grid = el("div", { class: "grid", style: `grid-template-columns:repeat(3,minmax(0,${small() ? 100 : 150}px));gap:14px` });
      const btns = inst.map(([a, , bg], i) => { const b = el("button", { class: "tile orch", html: pic(a), style: `background:${bg}` }); b.onclick = () => press(i); grid.append(b); return b; });
      const flash = async (i) => {
        const b = btns[i]; b.classList.add("play"); b.querySelector("svg").classList.add("walking");
        sfx.tone(inst[i][1], 0.4, "triangle", 0.25); await sleep(420);
        b.classList.remove("play"); b.querySelector("svg").classList.remove("walking"); await sleep(140);
      };
      const playSeq = async () => {
        listening = false; msg.textContent = "Gut zuhören …"; await sleep(700);
        for (let k = 0; k < len && alive; k++) await flash(seq[k]);
        if (!alive) return;
        pos = 0; listening = true; msg.textContent = `Du bist dran: ${len} ${len === 1 ? "Ton" : "Töne"}`;
      };
      const press = async (i) => {
        if (!listening) return;
        flash(i);
        if (i !== seq[pos]) { listening = false; sfx.bad(); msg.textContent = "Schiefer Ton! Noch einmal von vorn anhören …"; await sleep(1300); playSeq(); return; }
        if (++pos === len) {
          listening = false;
          if (len === LEN) { msg.textContent = "Perfekt gespielt!"; burstAt(grid, ["🎵", "🎶", "✨"], 14, 140); setTimeout(solve, 900); return; }
          len++; msg.textContent = "Sehr gut – ein Ton mehr!"; await sleep(1000); playSeq();
        }
      };
      const start = el("button", { class: "btn btn-green", text: "Konzert starten", onclick: () => { start.remove(); playSeq(); } });
      root._cleanup = () => (alive = false);
      root.append(msg, grid, el("div", { class: "row", style: "margin-top:16px" }, start));
    },
  });

  /* ---------- 8: Der Code-Knacker ---------- */
  R(8, {
    art: A("waschbaer", 1, "krone"), title: "Der Code-Knacker",
    intro: "Der Waschbär hat seine Keksdose mit einem Code aus vier verschiedenen Tieren gesichert. Rate die Reihenfolge! Nach jedem Versuch erfährst du: grüner Punkt = richtiges Tier am richtigen Platz, gelber Punkt = richtiges Tier, aber falscher Platz. Du hast 10 Versuche pro Code.",
    outro: "Die Keksdose ist offen. Der Waschbär ist beeindruckt – und etwas beleidigt.",
    render(root, { solve }) {
      solve = once(solve);
      const syms = this.data || [A("capy"), A("katze", 1), A("hund", 0), A("waschbaer"), A("pinguin"), A("schwein")];
      let code = shuffle([0, 1, 2, 3, 4, 5]).slice(0, 4), guess = [], tries = 0;
      const board = el("div", { class: "mm-board" });
      const cur = el("div", { class: "mm-row current" });
      const msg = info("Versuch 1 von 10");
      const drawCur = () => {
        cur.innerHTML = "";
        for (let i = 0; i < 4; i++) { const s = el("button", { class: "mm-slot", html: guess[i] != null ? pic(syms[guess[i]]) : "" }); s.onclick = () => { guess.splice(i, 1); drawCur(); }; cur.append(s); }
      };
      const check = () => {
        if (guess.length < 4) { shakeEl(cur); toast("Wähle zuerst vier Tiere."); return; }
        tries++;
        const black = guess.filter((g, i) => g === code[i]).length;
        const common = [0, 1, 2, 3, 4, 5].reduce((n, s) => n + Math.min(guess.filter((g) => g === s).length, code.filter((c) => c === s).length), 0);
        const white = common - black;
        const row = el("div", { class: "mm-row" }, el("span", { class: "mm-n", text: tries }), ...guess.map((g) => el("div", { class: "mm-slot done", html: pic(syms[g]) })),
          el("div", { class: "mm-pegs" }, ...Array.from({ length: black }, () => el("i", { class: "pg b" })), ...Array.from({ length: white }, () => el("i", { class: "pg w" })), ...Array.from({ length: 4 - black - white }, () => el("i", { class: "pg" }))));
        board.append(row);
        guess = []; drawCur();
        if (black === 4) { sfx.good(); msg.textContent = "Geknackt!"; burstAt(row, ["✨", "🍪", "💖"], 14, 120); setTimeout(solve, 1000); return; }
        sfx.tick();
        if (tries >= 10) {
          sfx.bad(); msg.textContent = "Zehn Versuche vorbei – der Waschbär wählt gleich einen neuen Code.";
          board.append(el("div", { class: "row" }, el("span", { text: "Der alte Code war:" }), ...code.map((c) => el("div", { class: "mm-slot done", html: pic(syms[c]) }))));
          setTimeout(() => { code = shuffle([0, 1, 2, 3, 4, 5]).slice(0, 4); tries = 0; board.innerHTML = ""; msg.textContent = "Neuer Code! Versuch 1 von 10"; }, 3500);
        } else msg.textContent = `Versuch ${tries + 1} von 10`;
      };
      const pal = el("div", { class: "row", style: "gap:8px" }, ...syms.map((s, k) => el("button", { class: "tile pal", html: pic(s), onclick: () => { if (guess.length < 4) { guess.push(k); sfx.pop(); drawCur(); } } })));
      root.append(msg, board, cur, pal, el("div", { class: "row", style: "margin-top:14px" }, el("button", { class: "btn", text: "Prüfen", onclick: check })));
      drawCur();
    },
  });

  /* ---------- 9: Redewendungen ---------- */
  R(9, {
    art: A("schwein", 0, "brille"), title: "Tierische Redewendungen",
    intro: "Die deutsche Sprache ist voller Tiere. Ergänze die zehn Redewendungen.",
    outro: "Da steppt der Bär: zehn von zehn!",
    render(root, { solve }) {
      solve = once(solve);
      const qs = this.data || [
        ["Da steppt der ___.", "Bär", ["Hund", "Hase", "Elch"]],
        ["Da liegt der ___ begraben.", "Hund", ["Hase", "Fuchs", "Igel"]],
        ["Ich glaub, mein ___ pfeift!", "Schwein", ["Hamster", "Esel", "Dackel"]],
        ["Die ___ im Sack kaufen.", "Katze", ["Gans", "Maus", "Ziege"]],
        ["Mit jemandem ein ___ zu rupfen haben.", "Hühnchen", ["Gänschen", "Täubchen", "Entchen"]],
        ["Wie ein ___ im Porzellanladen.", "Elefant", ["Nashorn", "Nilpferd", "Walross"]],
        ["Da wird ja der ___ in der Pfanne verrückt!", "Hund", ["Fisch", "Frosch", "Hahn"]],
        ["Wo sich ___ und Hase gute Nacht sagen.", "Fuchs", ["Igel", "Dachs", "Bär"]],
        ["Nach der langen Feier hatte er am nächsten Morgen einen ___.", "Kater", ["Igel", "Hirsch", "Wurm"]],
        ["Ihm ist wohl eine ___ über die Leber gelaufen.", "Laus", ["Maus", "Spinne", "Ameise"]],
      ];
      const box = el("div");
      root.append(box);
      const play = (k) => {
        const [q, right, wrong] = qs[k];
        box.innerHTML = "";
        const sentence = el("div", { class: "quote", text: "„" + q + "“" });
        const row = el("div", { class: "row", style: "gap:10px" });
        shuffle([right, ...wrong]).forEach((opt) => {
          const b = el("button", { class: "btn btn-soft opt", text: opt });
          b.onclick = () => {
            if (opt === right) { b.classList.add("ok"); sentence.textContent = "„" + q.replace("___", right) + "“"; sfx.good(); setTimeout(() => (k < qs.length - 1 ? play(k + 1) : solve()), 900); }
            else { sfx.bad(); shakeEl(b); b.disabled = true; }
          };
          row.append(b);
        });
        box.append(info(`Redewendung ${k + 1} von ${qs.length}`), sentence, row);
      };
      play(0);
    },
  });

  /* ---------- 10: Das Waagen-Rätsel ---------- */
  R(10, {
    art: A("capy", 1, "krone"), title: "Das Waagen-Rätsel",
    intro: "Im Tierheim wird gewogen. Die drei oberen Waagen sind im Gleichgewicht. Wie viele Katzen wiegen genauso viel wie die Tiere auf der linken Seite der unteren Waage?",
    outro: "Ein Hund wiegt drei Katzen, ein Kapibara fünf, ein Waschbär zwei: 5 + 5 + 2 = 12.",
    render(root, { solve }) {
      const cat = A("katze", 0), dog = A("hund", 0), capy = A("capy"), coon = A("waschbaer");
      const side = (arr) => el("div", { class: "pan" }, ...arr.map((a) => el("div", { class: "pan-a", html: pic(a) })));
      const scale = (L, Rr) => el("div", { class: "scale" }, side(L), el("div", { class: "fulcrum", text: "=" }), side(Rr));
      root.append(
        scale([dog], [cat, cat, cat]),
        scale([capy], [dog, cat, cat]),
        scale([coon, cat], [dog]),
        el("div", { class: "p-info", style: "margin-top:18px", text: "Und jetzt:" }),
        el("div", { class: "scale q" }, side([capy, capy, coon]), el("div", { class: "fulcrum", text: "=" }), el("div", { class: "pan" }, el("div", { class: "pan-q", text: "? ×" }), el("div", { class: "pan-a", html: pic(cat) }))));
      textAnswer(root, { answers: ["12", "zwölf"], placeholder: "Anzahl Katzen", onRight: solve });
    },
  });

  /* ---------- 11: Quiz ---------- */
  R(11, {
    art: A("elefant", 0, "brille"), title: "Quiz für Tierkennerinnen",
    intro: "Acht Fragen, jeweils vier Antworten – und nur eine stimmt.",
    outro: "Acht von acht. Ab sofort bist du die Tier-Expertin der Familie.",
    render(root, { solve }) {
      solve = once(solve);
      const qs = this.data || [
        ["Wie viele Stunden schläft ein Koala am Tag?", "18 bis 22 Stunden", ["6 bis 8 Stunden", "10 bis 12 Stunden", "14 bis 16 Stunden"], "Eukalyptus liefert kaum Energie – also wird viel geschlafen."],
        ["Welches Tier hat drei Herzen?", "Der Oktopus", ["Der Regenwurm", "Der Blauwal", "Die Giraffe"], "Zwei Herzen pumpen Blut durch die Kiemen, eines durch den Körper."],
        ["Welche Farbe hat die Haut unter dem Fell eines Eisbären?", "Schwarz", ["Weiß", "Rosa", "Grau-blau"], "Die schwarze Haut nimmt Sonnenwärme besser auf."],
        ["Aus welcher Region stammen Kapibaras ursprünglich?", "Südamerika", ["Afrika", "Südostasien", "Australien"], "Sie leben an Flüssen und Seen, vom Amazonas bis nach Argentinien."],
        ["Wie viele Zähne hat eine erwachsene Hauskatze?", "30", ["18", "26", "42"], "42 Zähne hat übrigens ein erwachsener Hund."],
        ["Welches Säugetier kann wirklich aktiv fliegen?", "Die Fledermaus", ["Das Gleithörnchen", "Der Riesengleiter", "Der Kurzkopfgleitbeutler"], "Alle anderen gleiten nur."],
        ["Wessen Fingerabdrücke sind denen des Menschen zum Verwechseln ähnlich?", "Die des Koalas", ["Die des Schimpansen", "Die des Waschbären", "Die des Otters"], "Selbst unter dem Mikroskop kaum zu unterscheiden."],
        ["Wie lange dauert die Tragzeit eines Elefanten?", "Etwa 22 Monate", ["Etwa 9 Monate", "Etwa 14 Monate", "Etwa 30 Monate"], "Die längste Tragzeit aller Landsäugetiere."],
      ];
      const box = el("div");
      root.append(box);
      const play = (k) => {
        const [q, right, wrong, why] = qs[k];
        box.innerHTML = "";
        const fb = el("div", { class: "feedback" });
        const grid = el("div", { class: "opt-grid" });
        shuffle([right, ...wrong]).forEach((opt) => {
          const b = el("button", { class: "btn btn-soft opt", text: opt });
          b.onclick = () => {
            if (opt === right) {
              b.classList.add("ok"); sfx.good(); fb.textContent = "Richtig! " + why; grid.querySelectorAll("button").forEach((x) => (x.disabled = true));
              box.append(el("div", { class: "row", style: "margin-top:10px" }, el("button", { class: "btn", text: k < qs.length - 1 ? "Nächste Frage" : "Fertig", onclick: () => (k < qs.length - 1 ? play(k + 1) : solve()) })));
            } else { sfx.bad(); shakeEl(b); b.disabled = true; fb.textContent = "Leider nicht – versuch's nochmal."; }
          };
          grid.append(b);
        });
        box.append(info(`Frage ${k + 1} von ${qs.length}`), el("div", { class: "quote", text: q }), grid, fb);
      };
      play(0);
    },
  });

  /* ---------- 12: Logikrätsel ---------- */
  R(12, {
    art: A("hund", 3, "schal", "#4f7fe0"), title: "Die Nachbarinnen vom Lindenweg",
    intro: "Im Lindenweg stehen vier Häuser nebeneinander, nummeriert von links (1) nach rechts (4). In jedem wohnt eine Frau mit genau einem Haustier. Finde mit Hilfe der Hinweise heraus, wer wo mit welchem Tier wohnt.",
    outro: "Claudia mit Katze, Anna mit Kapibara, Doris mit Hund, Birgit mit Waschbär. Messerscharf kombiniert.",
    render(root, { solve }) {
      const clues = [
        "Birgit wohnt im letzten Haus ganz rechts.",
        "Doris wohnt direkt links neben Birgit.",
        "Im ersten Haus wohnt eine Katze.",
        "Anna ist allergisch gegen Katzen.",
        "Birgits Haustier wäscht sein Futter, bevor es frisst.",
        "Der Hund wohnt direkt neben dem Waschbären.",
      ];
      const people = ["Anna", "Birgit", "Claudia", "Doris"], pets = ["Hund", "Katze", "Kapibara", "Waschbär"];
      const SOL = [["Claudia", "Katze"], ["Anna", "Kapibara"], ["Doris", "Hund"], ["Birgit", "Waschbär"]];
      const list = el("ol", { class: "clues" }, ...clues.map((c) => el("li", { text: c })));
      const houses = el("div", { class: "houses" });
      const sels = SOL.map((_, i) => {
        const sp = el("select", { id: "h" + i + "p", "aria-label": `Haus ${i + 1} Bewohnerin` }, el("option", { value: "", text: "Bewohnerin …" }), ...people.map((p) => el("option", { value: p, text: p })));
        const st = el("select", { id: "h" + i + "t", "aria-label": `Haus ${i + 1} Haustier` }, el("option", { value: "", text: "Haustier …" }), ...pets.map((p) => el("option", { value: p, text: p })));
        houses.append(el("div", { class: "house" }, el("div", { class: "roof" }), el("div", { class: "house-body" }, el("b", { text: "Haus " + (i + 1) }), sp, st)));
        return [sp, st];
      });
      const fb = el("div", { class: "feedback" });
      const check = () => {
        const v = sels.map(([a, b]) => [a.value, b.value]);
        if (v.some(([a, b]) => !a || !b)) { fb.textContent = "Bitte jedes Haus vollständig ausfüllen."; sfx.bad(); return; }
        if (new Set(v.map((x) => x[0])).size < 4 || new Set(v.map((x) => x[1])).size < 4) { fb.textContent = "Jede Frau und jedes Tier gibt es nur einmal."; sfx.bad(); return; }
        const wrong = v.filter((x, i) => x[0] !== SOL[i][0] || x[1] !== SOL[i][1]).length;
        if (!wrong) solve();
        else { sfx.bad(); shakeEl(houses); fb.textContent = `${wrong} ${wrong === 1 ? "Haus stimmt" : "Häuser stimmen"} noch nicht. Geh die Hinweise nochmal der Reihe nach durch.`; }
      };
      root.append(el("div", { class: "two-col" }, el("div", {}, el("b", { text: "Hinweise" }), list), el("div", {}, houses, el("div", { class: "row", style: "margin-top:14px" }, el("button", { class: "btn", text: "Lösung prüfen", onclick: check })), fb)));
    },
  });

  /* ---------- 13: Labyrinth ---------- */
  R(13, {
    art: A("igel", 0, "muetze"), title: "Der Winterwald",
    intro: "Der Igel will vor dem ersten Frost noch zu seinem Apfel unten rechts – mitten durch einen ziemlich verwinkelten Winterwald. Steuere mit den Pfeiltasten, den Knöpfen oder durch Wischen über das Labyrinth.",
    outro: "Angekommen. Der Igel rollt sich zufrieden mit seinem Apfel zusammen.",
    render(root, { solve }) {
      solve = once(solve);
      const D = this.data || {};
      const cw = small() ? D.cwS || 9 : D.cw || 17, ch = small() ? D.chS || 12 : D.ch || 10;
      const W = cw * 2 + 1, Hh = ch * 2 + 1;
      const M = Array.from({ length: Hh }, () => Array(W).fill(1));
      const rnd = seeded(D.seed || 1313);
      const stack = [[0, 0]], seen = new Set(["0,0"]);
      M[1][1] = 0;
      while (stack.length) {
        const [x, y] = stack[stack.length - 1];
        const nb = [[1, 0], [-1, 0], [0, 1], [0, -1]].map(([dx, dy]) => [x + dx, y + dy, dx, dy]).filter(([nx, ny]) => nx >= 0 && ny >= 0 && nx < cw && ny < ch && !seen.has(nx + "," + ny));
        if (!nb.length) { stack.pop(); continue; }
        const [nx, ny, dx, dy] = nb[Math.floor(rnd() * nb.length)];
        M[y * 2 + 1 + dy][x * 2 + 1 + dx] = 0; M[ny * 2 + 1][nx * 2 + 1] = 0;
        seen.add(nx + "," + ny); stack.push([nx, ny]);
      }
      const gr = Hh - 2, gc = W - 2;
      const size = Math.max(10, Math.min(26, Math.floor((Math.min(innerWidth, 1060) - (small() ? 60 : 120)) / W)));
      const maze = el("div", { class: "maze", style: `grid-template-columns:repeat(${W},${size}px)` });
      const cells = [];
      M.forEach((row) => row.forEach((v) => { const d = el("div", { class: "cell " + (v ? "wall" : "path"), style: `width:${size}px;height:${size}px` }); cells.push(d); maze.append(d); }));
      const at = (r, c) => cells[r * W + c];
      const hog = Animals.svg(A("igel", 0, "muetze"), { fit: true });
      at(gr, gc).innerHTML = `<svg viewBox="0 0 20 20" style="width:100%;height:100%"><circle cx="10" cy="11" r="7" fill="#e5383b"/><path d="M10 4 q3 -4 6 -1 q-3 1 -6 1z" fill="#4caf50"/></svg>`;
      let pr = 1, pc = 1, won = false;
      const draw = () => { cells.forEach((d) => { if (d.dataset.h) { d.innerHTML = ""; delete d.dataset.h; } }); const d = at(pr, pc); d.classList.add("trail"); d.innerHTML = hog; d.dataset.h = "1"; };
      const move = (dr, dc) => {
        if (won) return;
        if (M[pr + dr][pc + dc]) { sfx.tick(); return; }
        pr += dr; pc += dc; sfx.tone(500 + Math.random() * 200, 0.05, "sine", 0.08); draw();
        if (pr === gr && pc === gc) { won = true; sfx.good(); burstAt(at(pr, pc), ["🍎", "✨", "💖"], 12, 90); setTimeout(solve, 900); }
      };
      draw();
      const key = (e) => { const m = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }[e.key]; if (m) { e.preventDefault(); move(...m); } };
      document.addEventListener("keydown", key);
      root._cleanup = () => document.removeEventListener("keydown", key);
      let sx, sy;
      maze.addEventListener("pointerdown", (e) => { sx = e.clientX; sy = e.clientY; });
      maze.addEventListener("pointerup", (e) => { const dx = e.clientX - sx, dy = e.clientY - sy; if (Math.max(Math.abs(dx), Math.abs(dy)) < 18) return; Math.abs(dx) > Math.abs(dy) ? move(0, Math.sign(dx)) : move(Math.sign(dy), 0); });
      const b = (t, f, area, lab) => el("button", { text: t, onclick: f, style: `grid-area:${area}`, "aria-label": lab });
      root.append(el("div", { class: "scroll-x" }, maze), el("div", { class: "dpad" }, b("▲", () => move(-1, 0), "1/2", "hoch"), b("◀", () => move(0, -1), "2/1", "links"), b("▼", () => move(1, 0), "2/2", "runter"), b("▶", () => move(0, 1), "2/3", "rechts")));
    },
  });

  /* ---------- 14: Schiebepuzzle 4×4 ---------- */
  R(14, {
    art: A("capy", 0, "orange"), title: "Kalles Porträt",
    intro: "Kalles schönstes Foto ist in 15 Teile zerfallen. Schiebe die Teile über das freie Feld zurück an ihren Platz. Die kleinen Zahlen zeigen die richtige Reihenfolge (1 oben links bis 15).",
    outro: "Das Porträt ist wieder heil. Kalle lässt sich das Bild einrahmen.",
    render(root, { solve }) {
      solve = once(solve);
      const capy = Animals.inner(A("capy", 0, "orange"));
      const PICT = `<rect width="120" height="120" fill="#d7ecfb"/><circle cx="22" cy="20" r="11" fill="#ffe28a"/><rect y="84" width="120" height="36" fill="#bfe0b2"/><ellipse cx="96" cy="104" rx="22" ry="6" fill="#a9d4ea"/><g fill="#fff" opacity=".9"><circle cx="70" cy="14" r="2"/><circle cx="100" cy="28" r="1.6"/><circle cx="48" cy="34" r="1.4"/><circle cx="10" cy="56" r="1.6"/></g><g transform="translate(6 24) scale(.9)">${capy.content}</g>`;
      const N = 4, goal = [...Array(N * N - 1).keys()].concat(null);
      let b = goal.slice(), prev = -1;
      const nb = (i) => { const r = Math.floor(i / N), c = i % N, o = []; if (r > 0) o.push(i - N); if (r < N - 1) o.push(i + N); if (c > 0) o.push(i - 1); if (c < N - 1) o.push(i + 1); return o; };
      const swap = (i, j) => ([b[i], b[j]] = [b[j], b[i]]);
      do { b = goal.slice(); prev = -1; for (let k = 0; k < 90; k++) { const e = b.indexOf(null); const m = pick(nb(e).filter((x) => x !== prev)); prev = e; swap(e, m); } } while (b.filter((x, i) => x === goal[i]).length > 5);
      const ts = small() ? Math.floor((innerWidth - 80) / N) : 112;
      const box = el("div", { class: "slider", style: `grid-template-columns:repeat(${N},${ts}px)` });
      const stat = info();
      let moves = 0, done = false;
      const draw = () => {
        box.innerHTML = "";
        b.forEach((x, i) => {
          const t = el("button", { class: x === null ? "empty" : "", style: `height:${ts}px` });
          if (x !== null) { const r = Math.floor(x / N), c = x % N; t.innerHTML = `<svg viewBox="${c * 30} ${r * 30} 30 30" style="width:100%;height:100%;display:block">${PICT}</svg><small>${x + 1}</small>`; t.onclick = () => move(i); }
          box.append(t);
        });
        stat.textContent = `${moves} Züge`;
      };
      const move = (i) => {
        if (done) return;
        const e = b.indexOf(null);
        if (!nb(e).includes(i)) { sfx.tick(); return; }
        swap(e, i); moves++; sfx.tone(380 + i * 25, 0.06, "sine", 0.12); draw();
        if (b.every((x, k) => x === goal[k])) {
          done = true; box.querySelector(".empty").innerHTML = `<svg viewBox="90 90 30 30" style="width:100%;height:100%;display:block">${PICT}</svg>`; box.classList.add("solved");
          sfx.good(); burstAt(box, ["✨", "💖"], 16, 140); setTimeout(solve, 1300);
        }
      };
      draw();
      root.append(stat, box, el("div", { class: "row", style: "margin-top:14px;align-items:center" }, el("span", { class: "p-info", text: "Vorlage:" }), el("div", { class: "preview-pic", html: `<svg viewBox="0 0 120 120" width="90" height="90">${PICT}</svg>` })));
    },
  });

  /* ---------- 15: Lebenserwartung ---------- */
  R(15, {
    art: A("schaf", 2, "blume", "#f39c32"), title: "Ein langes Leben",
    intro: "Wer lebt am längsten? Tippe die sechs Tiere nach ihrer typischen Lebenserwartung an – vom kürzesten zum längsten Leben.",
    outro: "Vom Hamster bis zur Riesenschildkröte – perfekt sortiert.",
    render(root, { solve }) {
      solve = once(solve);
      const order = [["Hamster", "2–3 Jahre"], ["Kaninchen", "8–12 Jahre"], ["Hauskatze", "12–18 Jahre"], ["Pferd", "25–30 Jahre"], ["Ara (Papagei)", "50–80 Jahre"], ["Riesenschildkröte", "über 100 Jahre"]];
      let next = 0;
      const line = el("ol", { class: "rank" });
      const grid = el("div", { class: "opt-grid" });
      shuffle(order).forEach(([n, y]) => {
        const t = el("button", { class: "btn btn-soft opt", text: n });
        t.onclick = () => {
          if (n === order[next][0]) {
            next++; t.disabled = true; t.classList.add("ok"); sfx.boop(300 + next * 70); line.append(el("li", {}, el("b", { text: n }), el("span", { text: " · " + y })));
            if (next === order.length) { sfx.good(); burstAt(line, ["✨", "💖"], 12, 120); setTimeout(solve, 1100); }
          } else { sfx.bad(); shakeEl(t); toast(next ? `Kommt ${n} wirklich direkt nach ${order[next - 1][0]}?` : `Hat ${n} wirklich das kürzeste Leben?`); }
        };
        grid.append(t);
      });
      root.append(grid, el("div", { class: "p-info", style: "margin-top:16px", text: "Deine Reihenfolge:" }), line);
    },
  });

  /* ---------- 16: Geheimschrift ---------- */
  R(16, {
    art: A("fuchs", 2, "brille"), title: "Die Geheimbotschaft",
    intro: "Ein Tier hat dir eine verschlüsselte Nachricht geschickt. Jeder Buchstabe wurde um dieselbe Anzahl Stellen im Alphabet verschoben (Caesar-Verschlüsselung). Finde mit der Entschlüsselungsscheibe die richtige Verschiebung – kleiner Anhaltspunkt: Die Nachricht beginnt mit einem Wort, mit dem man von sich selbst spricht. Welches Tier hat geschrieben?",
    outro: "„Ich schlafe kopfüber und sehe mit den Ohren“ – Grüße von der Fledermaus.",
    render(root, { solve }) {
      const plain = "ICH SCHLAFE KOPFUEBER UND SEHE MIT DEN OHREN", K = 7;
      const enc = plain.replace(/[A-Z]/g, (ch) => String.fromCharCode(((ch.charCodeAt(0) - 65 + K) % 26) + 65));
      const AB = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
      let s = 0;
      const top = el("div", { class: "wheel-row" }), bot = el("div", { class: "wheel-row cipher" }), lab = el("b");
      const draw = () => { top.innerHTML = ""; bot.innerHTML = ""; AB.forEach((c, i) => { top.append(el("span", { text: c })); bot.append(el("span", { text: AB[(i + s) % 26] })); }); lab.textContent = `Verschiebung: ${s}`; };
      draw();
      const shift = (d) => { s = (s + d + 26) % 26; sfx.tick(); draw(); };
      root.append(
        el("div", { class: "p-info", text: "Die Nachricht:" }), el("div", { class: "cipher-text", text: enc }),
        el("div", { class: "p-info", style: "margin-top:16px", text: "Entschlüsselungsscheibe – obere Reihe: Klartext, untere Reihe: Geheimtext" }),
        el("div", { class: "scroll-x" }, el("div", { class: "wheel" }, top, bot)),
        el("div", { class: "row", style: "margin-top:10px" }, el("button", { class: "btn btn-soft", text: "◀", onclick: () => shift(-1), "aria-label": "weniger" }), lab, el("button", { class: "btn btn-soft", text: "▶", onclick: () => shift(1), "aria-label": "mehr" })),
        el("div", { class: "p-info", style: "margin-top:16px", text: "Notizzettel:" }),
        el("textarea", { id: "cipher-notes", class: "notes", rows: "2", placeholder: "Hier kannst du mitschreiben …" }));
      textAnswer(root, { answers: ["Fledermaus", "Fledermäuse"], placeholder: "Welches Tier?", onRight: solve });
    },
  });

  /* ---------- 17: Tierkinder ---------- */
  R(17, {
    art: A("schaf", 0, "schleife", "#e85d75"), title: "Wie heißt das Kleine?",
    intro: "Acht Tiere, acht Namen für ihren Nachwuchs. Tippe links auf ein Tier und rechts auf den passenden Namen des Jungtiers.",
    outro: "Alle Tierkinder sind wieder bei ihren Müttern.",
    render(root, { solve }) {
      solve = once(solve);
      const pairs = [["Pferd", "Fohlen"], ["Schwein", "Ferkel"], ["Reh", "Kitz"], ["Gans", "Gössel"], ["Känguru", "Joey"], ["Ziege", "Zicklein"], ["Kuh", "Kalb"], ["Schaf", "Lamm"]];
      let sel = null, done = 0;
      const L = el("div", { class: "match-col" }), Rr = el("div", { class: "match-col" });
      shuffle(pairs).forEach(([a, baby]) => {
        const b = el("button", { class: "btn btn-soft opt", text: a }); b.dataset.k = baby;
        b.onclick = () => { if (b.disabled) return; sel?.classList.remove("picked"); sel = b; b.classList.add("picked"); sfx.pop(); };
        L.append(b);
      });
      shuffle(pairs).forEach(([, baby]) => {
        const b = el("button", { class: "btn btn-soft opt", text: baby });
        b.onclick = () => {
          if (b.disabled) return;
          if (!sel) { toast("Wähle zuerst links ein Tier."); return; }
          if (sel.dataset.k === baby) { [sel, b].forEach((x) => { x.disabled = true; x.classList.add("ok"); x.classList.remove("picked"); }); sfx.good(); sel = null; if (++done === pairs.length) setTimeout(solve, 800); }
          else { sfx.bad(); shakeEl(b); }
        };
        Rr.append(b);
      });
      root.append(el("div", { class: "match" }, L, Rr));
    },
  });

  /* ---------- 18: Silbenrätsel ---------- */
  R(18, {
    art: A("ente", 2, "brille"), title: "Das Silbenrätsel",
    intro: "Ein Klassiker: Aus den Silben unten lassen sich acht Tiernamen bilden. Jede Silbe wird genau einmal gebraucht. Trage zu jeder Beschreibung das passende Tier ein – verbrauchte Silben werden durchgestrichen.",
    outro: "Alle 18 Silben verbraucht – wie im Rätselheft, nur tierischer.",
    render(root, { solve }) {
      solve = once(solve);
      const items = [["Gestreiftes Pferd der Savanne", ["ZE", "BRA"]], ["Trägt sein Haus immer bei sich", ["SCHNE", "CKE"]], ["Rosa Vogel, der gern auf einem Bein steht", ["FLA", "MIN", "GO"]], ["Das Schiff der Wüste", ["KA", "MEL"]],
        ["Baumeister von Dämmen im Fluss", ["BI", "BER"]], ["Schwarz-weißer Bambusliebhaber", ["PAN", "DA"]], ["Hängt am liebsten reglos im Ast", ["FAUL", "TIER"]], ["Springt mit Beutel durch Australien", ["KÄN", "GU", "RU"]]];
      const chips = {};
      const pool = el("div", { class: "syll" }, ...shuffle(items.flatMap(([, s]) => s)).map((x) => { const c = el("span", { text: x }); (chips[x] = chips[x] || []).push(c); return c; }));
      let solvedN = 0;
      const list = el("div", { class: "syll-list" });
      items.forEach(([clue, syl], k) => {
        const word = syl.join("");
        const inp = el("input", { class: "text-in", id: "syl" + k, placeholder: syl.length + " Silben", autocomplete: "off", spellcheck: "false" });
        const row = el("div", { class: "syll-row" }, el("span", { class: "syll-n", text: k + 1 }), el("span", { class: "syll-clue", text: clue }), inp);
        const check = () => {
          if (inp.disabled) return;
          if (norm(inp.value) === norm(word)) {
            inp.disabled = true; inp.value = word.charAt(0) + word.slice(1).toLowerCase(); row.classList.add("ok"); sfx.good();
            syl.forEach((x) => chips[x].find((c) => !c.classList.contains("used"))?.classList.add("used"));
            if (++solvedN === items.length) setTimeout(solve, 900);
          } else if (inp.value.trim()) { sfx.bad(); shakeEl(inp); }
        };
        inp.addEventListener("keydown", (e) => { if (e.key === "Enter") check(); });
        inp.addEventListener("change", check);
        list.append(row);
      });
      root.append(pool, list, el("div", { class: "row", style: "margin-top:12px" }, el("button", { class: "btn", text: "Prüfen", onclick: () => list.querySelectorAll("input").forEach((i) => i.dispatchEvent(new Event("change"))) })));
    },
  });

  /* ---------- 19: Siebenschläfer 4×4 ---------- */
  R(19, {
    art: A("baer", 2, "muetze"), title: "Weck die Siebenschläfer!",
    intro: "Sechzehn Tiere, und einige halten noch Winterschlaf. Tippst du ein Tier an, wechseln es und seine direkten Nachbarn (oben, unten, links, rechts) zwischen wach und schlafend. Schaffst du es, alle sechzehn gleichzeitig wach zu bekommen?",
    outro: "Alle sechzehn hellwach. Die Adventsfeier kann beginnen.",
    render(root, { solve }) {
      solve = once(solve);
      const N = 4;
      const kinds = ["capy", "katze", "hund", "waschbaer", "fuchs", "pinguin", "igel", "hase", "schaf", "schwein", "otter", "ente", "baer", "panda_rot", "elefant", "giraffe"];
      const arts = kinds.map((k) => A(k));
      const tog = (s, i) => { const r = Math.floor(i / N), c = i % N; [[r, c], [r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]].forEach(([a, b]) => { if (a >= 0 && a < N && b >= 0 && b < N) s[a * N + b] = !s[a * N + b]; }); };
      const init = Array(N * N).fill(true); [0, 6, 9, 15].forEach((i) => tog(init, i));
      let awake = init.slice(), moves = 0, done = false;
      const ts = small() ? Math.floor((innerWidth - 90) / N) : 104;
      const grid = el("div", { class: "grid", style: `grid-template-columns:repeat(${N},${ts}px);gap:10px` });
      const stat = info();
      const tiles = arts.map((a, i) => { const t = el("button", { class: "tile sleeper", html: pic(a) + `<span class="zz">z z</span>` }); t.onclick = () => press(i); grid.append(t); return t; });
      const draw = () => { tiles.forEach((t, i) => t.classList.toggle("asleep", !awake[i])); stat.textContent = `${awake.filter(Boolean).length} von 16 wach · ${moves} Züge`; };
      const press = (i) => {
        if (done) return;
        tog(awake, i); moves++; sfx.boop(300 + i * 30); draw();
        if (awake.every(Boolean)) { done = true; sfx.good(); burstAt(grid, ["☀️", "✨", "💖"], 16, 140); setTimeout(solve, 1000); }
      };
      draw();
      root.append(stat, grid, el("div", { class: "row", style: "margin-top:14px" }, el("button", { class: "btn btn-soft", text: "Von vorne beginnen", onclick: () => { if (!done) { awake = init.slice(); moves = 0; draw(); } } })));
    },
  });

  /* ---------- 20: Fehlersuche ---------- */
  R(20, {
    art: A("katze", 3, "brille"), title: "Finde die 6 Unterschiede",
    intro: "Zwei Gruppenfotos derselben Tierfamilie – aber auf dem zweiten Bild haben sechs Tiere etwas verändert: ein anderes Accessoire oder eine andere Fellfarbe. Tippe die Unterschiede im zweiten Bild an.",
    outro: "Sechs von sechs gefunden. Dir entgeht wirklich nichts.",
    render(root, { solve }) {
      solve = once(solve);
      const rnd = seeded(2020);
      const kinds = ["capy", "katze", "hund", "waschbaer", "fuchs", "pinguin", "hase", "schaf", "schwein", "ente", "baer", "igel"];
      const accs = ["", "muetze", "schal", "schleife", "brille", "krone", "blume", "fliege"];
      const N = 6;
      const mk = () => { const sp = kinds[Math.floor(rnd() * kinds.length)]; return A(sp, Math.floor(rnd() * Animals.SPECIES[sp].colors.length), accs[Math.floor(rnd() * accs.length)], ["#e85d75", "#3f9e6e", "#4f7fe0", "#f39c32"][Math.floor(rnd() * 4)]); };
      const L = Array.from({ length: N * N }, mk);
      const Rt = L.map((a) => ({ ...a }));
      const diffs = shuffle([...L.keys()], rnd).slice(0, 6);
      diffs.forEach((i, k) => {
        const a = Rt[i], cols = Animals.SPECIES[a.sp].colors.length;
        if (k % 2 && cols > 1) a.col = (a.col + 1) % cols;
        else { let n; do n = accs[Math.floor(rnd() * accs.length)]; while (n === a.acc); a.acc = n; }
      });
      let found = 0;
      const stat = info("0 von 6 gefunden");
      const cs = small() ? Math.floor((innerWidth - 70) / N) : 64;
      const mkGrid = (arr, click) => {
        const g = el("div", { class: "diff-grid", style: `grid-template-columns:repeat(${N},${cs}px)` });
        arr.forEach((a, i) => {
          const c = el("div", { class: "diff-cell", html: pic(a), style: `height:${Math.round(cs * 0.8)}px` });
          if (click) c.onclick = () => {
            if (c.classList.contains("hit")) return;
            if (diffs.includes(i)) { c.classList.add("hit"); left.children[i].classList.add("hit"); sfx.good(); stat.textContent = `${++found} von 6 gefunden`; if (found === 6) setTimeout(solve, 900); }
            else { sfx.tick(); shakeEl(c); }
          };
          g.append(c);
        });
        return g;
      };
      const left = mkGrid(L, false), right = mkGrid(Rt, true);
      root.append(stat, el("div", { class: "row", style: "gap:22px;align-items:flex-start" },
        el("div", {}, el("div", { class: "p-info", text: "Foto 1" }), left),
        el("div", {}, el("div", { class: "p-info", text: "Foto 2 – hier antippen" }), right)));
    },
  });

  /* ---------- 21: Krimi ---------- */
  R(21, {
    art: A("waschbaer", 0, "muetze"), title: "Der Zimtstern-Krimi",
    intro: "Heute Nachmittag um 15 Uhr verschwand der allerletzte Zimtstern vom Teller in der Küche. Sechs Verdächtige, ihre Aussagen und die Spuren vom Tatort: Wer war's? Tippe auf den Täter – aber nur, wenn du dir sicher bist.",
    outro: "Rocky hat gestanden. Von wegen Speisekammer – er hat den Stern sogar noch gewaschen.",
    render(root, { solve }) {
      solve = once(solve);
      const sus = [
        [A("hund", 0), "Bello", "„Um drei war ich mit Mama im Park. Ehrenwort.“", "Mama bestätigt: Bello war im Park."],
        [A("katze", 1), "Mimi", "„Ich lag auf dem Sofa.“", "Mimis Schwanz ist lang, aber glatt und dünn."],
        [A("waschbaer"), "Rocky", "„Ich war in der Speisekammer. Ganz woanders!“", "Die Speisekammer liegt direkt neben der Küche."],
        [A("capy"), "Kalle", "„Ich lag in der Badewanne. Wie immer.“", "Kalle hat nur einen winzigen Stummelschwanz."],
        [A("fuchs"), "Frieda", "„Ich war im Flur.“", "Frieda hat eine ärztlich bescheinigte Zimtallergie."],
        [A("pinguin"), "Paul", "„Ich war draußen am Teich.“", "Nachbarn haben Paul um 15 Uhr am Teich gesehen."],
      ];
      const spuren = el("div", { class: "evidence" }, el("b", { text: "Spuren am Tatort" }),
        el("ul", {}, el("li", { text: "Neben dem Teller lag ein langes, buschiges Schwanzhaar." }), el("li", { text: "Die Krümel lagen in einer kleinen Pfütze – als wäre der Keks vor dem Essen gewaschen worden." }), el("li", { text: "Wer nachweislich draußen war, kommt nicht in Frage." })));
      const grid = el("div", { class: "suspects" });
      sus.forEach(([a, n, say, fact]) => {
        const b = el("button", { class: "suspect" }, el("div", { class: "s-pic", html: pic(a) }), el("b", { text: n }), el("q", { text: say }), el("small", { text: fact }));
        b.onclick = () => {
          if (n === "Rocky") { b.classList.add("ok"); sfx.good(); burstAt(b, ["✨", "🚨"], 14, 100); toast("Erwischt! Rocky hat noch Krümel im Fell."); setTimeout(solve, 1200); }
          else { b.classList.add("no"); sfx.bad(); shakeEl(b); toast(`${n} war es nicht – schau dir die Spuren nochmal an.`); }
        };
        grid.append(b);
      });
      root.append(spuren, grid);
    },
  });

  /* ---------- 22: Wortsuche ---------- */
  R(22, {
    art: A("otter", 0, "schal", "#3f9e6e"), title: "Das Buchstabengitter",
    intro: "Im Gitter verstecken sich zehn Tiere – waagerecht (→), senkrecht (↓) oder diagonal (↘). Umlaute sind ausgeschrieben (ä = AE). Tippe auf den ersten und dann auf den letzten Buchstaben eines Tiers.",
    outro: "Alle zehn gefunden – ganz ohne Lupe.",
    render(root, { solve }) {
      solve = once(solve);
      const words = ["WASCHBAER", "KAPIBARA", "FLAMINGO", "GIRAFFE", "PINGUIN", "ALPAKA", "OTTER", "FUCHS", "PANDA", "IGEL"];
      const N = 12;
      let grid, placed;
      for (let seed = 22; ; seed++) {
        const rnd = seeded(seed);
        grid = Array(N * N).fill(null); placed = [];
        let ok = true;
        for (const w of words) {
          let put = false;
          for (let t = 0; t < 400 && !put; t++) {
            const dir = [[0, 1], [1, 0], [1, 1]][Math.floor(rnd() * 3)];
            const r = Math.floor(rnd() * (N - dir[0] * (w.length - 1))), c = Math.floor(rnd() * (N - dir[1] * (w.length - 1)));
            const idx = [...w].map((_, k) => (r + dir[0] * k) * N + (c + dir[1] * k));
            if (idx.every((ix, k) => grid[ix] === null || grid[ix] === w[k])) { idx.forEach((ix, k) => (grid[ix] = w[k])); placed.push({ w, idx }); put = true; }
          }
          if (!put) { ok = false; break; }
        }
        if (ok) { const AL = "ABCDEFGHIKLMNOPRSTUW"; grid = grid.map((g) => g || AL[Math.floor(rnd() * AL.length)]); break; }
      }
      let first = null;
      const found = new Set();
      const tags = {};
      const listEl = el("div", { class: "word-list" }, ...words.map((w) => (tags[w] = el("span", { text: w }))));
      const cs = small() ? Math.floor((innerWidth - 70) / N) : 42;
      const ws = el("div", { class: "ws", style: `grid-template-columns:repeat(${N},${cs}px)` });
      const btns = grid.map((ch, i) => {
        const b = el("button", { text: ch, style: `width:${cs}px;height:${cs}px;font-size:${Math.round(cs * 0.5)}px` });
        b.onclick = () => {
          sfx.tick();
          if (first === null) { first = i; b.classList.add("sel"); return; }
          const a = first; first = null; btns[a].classList.remove("sel");
          const hit = placed.find((p) => !found.has(p.w) && ((p.idx[0] === a && p.idx[p.idx.length - 1] === i) || (p.idx[0] === i && p.idx[p.idx.length - 1] === a)));
          if (hit) { found.add(hit.w); hit.idx.forEach((ix) => btns[ix].classList.add("found")); tags[hit.w].classList.add("found"); sfx.good(); if (found.size === words.length) setTimeout(solve, 900); }
          else if (a !== i) shakeEl(ws);
        };
        ws.append(b); return b;
      });
      root.append(el("div", { class: "scroll-x" }, ws), listEl);
    },
  });

  /* ---------- 23: Suchbild ---------- */
  R(23, {
    art: A("giraffe", 0, "muetze"), title: "Das Weihnachts-Suchbild",
    intro: "Alle Tiere haben sich zum großen Weihnachtsfoto versammelt. Fünf ganz bestimmte Gäste werden gesucht – finde genau diese fünf in der Menge. Achte auf Farbe und Accessoire, es gibt Doppelgänger!",
    outro: "Alle fünf Gäste gefunden. Das Foto kann gemacht werden.",
    render(root, { solve }) {
      solve = once(solve);
      const D = this.data || {};
      const rnd = seeded(D.seed || 2323);
      const targets = D.targets || [A("katze", 4, "krone"), A("hund", 2, "schal", "#4f7fe0"), A("schaf", 1, "brille"), A("pinguin", 1, "blume", "#e85d75"), A("capy", 2, "geweih")];
      const kinds = ["capy", "katze", "hund", "waschbaer", "fuchs", "pinguin", "igel", "hase", "schaf", "schwein", "otter", "ente", "baer", "panda_rot"];
      const accs = ["", "muetze", "schal", "schleife", "brille", "krone", "geweih", "blume", "fliege"];
      const cols = small() ? 6 : 11, rows = small() ? 11 : 8, total = cols * rows;
      const crowd = [];
      while (crowd.length < total - targets.length) {
        const sp = kinds[Math.floor(rnd() * kinds.length)];
        const a = A(sp, Math.floor(rnd() * Animals.SPECIES[sp].colors.length), accs[Math.floor(rnd() * accs.length)], ["#e85d75", "#3f9e6e", "#4f7fe0", "#f39c32"][Math.floor(rnd() * 4)]);
        if (!targets.some((t) => sameArt(t, a))) crowd.push(a);
      }
      targets.forEach((t, k) => { crowd[k * 7] = { ...t, acc: t.acc === "muetze" ? "schleife" : "muetze" }; });
      const slots = shuffle([...Array(total).keys()], rnd);
      const all = Array(total);
      targets.forEach((t, k) => (all[slots[k]] = { a: t, target: k }));
      let ci = 0; for (let i = 0; i < total; i++) if (!all[i]) all[i] = { a: crowd[ci++], target: -1 };
      const cw = small() ? (innerWidth - 60) / cols : 88, chh = small() ? 54 : 66;
      const scene = el("div", { class: "scene meadow", style: `height:${rows * chh + 30}px;width:${cols * cw + 20}px;max-width:none` });
      const tagEls = [];
      const want = el("div", { class: "wanted" }, ...targets.map((t) => { const d = el("div", { class: "want", html: `<div class="w-pic">${pic(t)}</div><small>${Animals.desc(t)}</small>` }); tagEls.push(d); return d; }));
      let found = 0;
      all.forEach(({ a, target }, i) => {
        const r = Math.floor(i / cols), c = i % cols;
        const d = el("div", { class: "actor" + (rnd() < 0.5 ? " flip" : ""), html: Animals.svg(a, { width: cw * 0.86 }), style: `left:${10 + c * cw + (rnd() - 0.5) * cw * 0.25}px;top:${10 + r * chh + (rnd() - 0.5) * chh * 0.2}px;z-index:${r};transition:none` });
        d.onclick = () => {
          if (target >= 0 && !d.classList.contains("hit")) { d.classList.add("hit"); tagEls[target].classList.add("ok"); sfx.good(); burstAt(d, ["✨", "💖"], 8, 60); if (++found === targets.length) setTimeout(solve, 900); }
          else if (target < 0) { sfx.tick(); shakeEl(d); }
        };
        scene.append(d);
      });
      root.append(el("div", { class: "p-info", text: "Gesucht werden:" }), want, el("div", { class: "scroll-x", style: "margin-top:14px" }, scene));
    },
  });

  /* =========================================================
     Kapitel 24–31: neue Varianten bekannter Spiele
     ========================================================= */
  const like = (day, extra) => Object.assign({}, App.get(day), extra);

  R(24, like(2, {
    art: A("capy", 2, "muetze"), title: "Heiligabend-Rätsel",
    intro: "Unter dem Weihnachtsbaum liegen vier Zettel mit Rätseln. Wer sie alle löst, darf den Baum schmücken.",
    outro: "Rentier, Igel, Eisbär und Gans – frohe Weihnachten!",
    data: [
      ["Ich trage ein Geweih und ziehe in einer bestimmten Nacht einen Schlitten über den Himmel. Mein berühmtester Kollege hat eine rote Nase.", ["Rentier", "Rentiere"]],
      ["Ich bin klein und stachelig und verschlafe den Winter. Aber bitte nenn mich nicht Kaktus.", ["Igel"]],
      ["Ich bin weiß, lebe am Nordpol, und meine Haut ist schwarz. Pinguine habe ich noch nie getroffen.", ["Eisbär", "Eisbaer"]],
      ["Ich bin ein Vogel, der zu Weihnachten gern auf dem Tisch landet. Ich schnattere aus Protest.", ["Gans", "Weihnachtsgans"]],
    ],
  }));

  R(25, like(11, {
    art: A("pinguin", 1, "schal", "#e85d75"), title: "Winterwissen",
    intro: "Zum ersten Feiertag ein Quiz rund um Tiere im Winter. Sieben Fragen, jeweils nur eine richtige Antwort.",
    outro: "Sieben von sieben – du weißt, wie Tiere den Winter überstehen.",
    data: [
      ["Wie halten sich Kaiserpinguine im Schneesturm warm?", "Sie kuscheln sich eng zusammen und tauschen die Plätze", ["Sie graben Schneehöhlen", "Sie fliegen in den Süden", "Sie halten Winterschlaf"], "Jeder darf mal in die warme Mitte."],
      ["Welches Tier zieht in Lappland traditionell Schlitten?", "Das Rentier", ["Der Elch", "Der Rothirsch", "Der Moschusochse"], "Rentiere werden dort seit Jahrhunderten als Zugtiere gehalten."],
      ["Was fressen Eichhörnchen im Winter?", "Vorräte, die sie im Herbst versteckt haben", ["Vor allem Schnee", "Nur Baumrinde", "Gar nichts – sie schlafen durch"], "Viele Verstecke finden sie nie wieder – daraus wachsen neue Bäume."],
      ["Welche Farbe hat das Fell eines Schneehasen im Winter?", "Weiß", ["Braun", "Grau", "Gefleckt"], "Im Sommer ist es braun, im Winter wechselt es zu Weiß."],
      ["Wie lange dauert der Winterschlaf eines Igels ungefähr?", "3 bis 5 Monate", ["2 Wochen", "1 Monat", "Ein ganzes Jahr"], "Dabei sinkt seine Körpertemperatur auf etwa 5 Grad."],
      ["Welche Rentiere tragen im Winter noch ihr Geweih?", "Vor allem die Weibchen", ["Nur die Männchen", "Gar keine", "Nur die Kälber"], "Männchen werfen es im Spätherbst ab – die Schlittenzieher des Weihnachtsmanns wären also Damen."],
      ["In welchem Land baden Kapibaras im Winter in heißen Quellen?", "Japan", ["Island", "Norwegen", "Kanada"], "In japanischen Zoos ist das Kapibara-Bad eine beliebte Wintertradition."],
    ],
  }));

  R(26, like(6, {
    art: A("baer", 1, "schal", "#4f7fe0"), title: "Buchstabensturm",
    intro: "Ein Schneesturm hat drei Tiernamen durcheinandergewirbelt. Setz sie wieder zusammen.",
    outro: "Schneeeule, Walross, Eichhörnchen – der Sturm hat sich gelegt.",
    data: ["SCHNEEEULE", "WALROSS", "EICHHÖRNCHEN"],
  }));

  R(27, like(9, {
    art: A("katze", 2, "fliege", "#4f7fe0"), title: "Noch mehr Redewendungen",
    intro: "Zwischen den Jahren wird geplaudert. Ergänze zehn weitere tierische Redewendungen.",
    outro: "Zehn von zehn. Da beißt die Maus keinen Faden ab!",
    data: [
      ["Den Letzten beißen die ___.", "Hunde", ["Katzen", "Mäuse", "Gänse"]],
      ["Er stand da wie ein begossener ___.", "Pudel", ["Dackel", "Hase", "Kater"]],
      ["Zwei ___ mit einer Klappe schlagen.", "Fliegen", ["Mücken", "Vögel", "Mäuse"]],
      ["Den ___ zum Gärtner machen.", "Bock", ["Hasen", "Fuchs", "Hund"]],
      ["Stumm wie ein ___.", "Fisch", ["Frosch", "Hase", "Igel"]],
      ["Jemandem einen ___ aufbinden.", "Bären", ["Hasen", "Esel", "Ochsen"]],
      ["Diese Handschrift kann kein ___ lesen.", "Schwein", ["Hund", "Huhn", "Pferd"]],
      ["Mit den ___ ins Bett gehen.", "Hühnern", ["Gänsen", "Enten", "Lämmern"]],
      ["Da beißt sich die ___ in den Schwanz.", "Katze", ["Maus", "Schlange", "Ratte"]],
      ["Ist die Katze aus dem Haus, tanzen die ___ auf dem Tisch.", "Mäuse", ["Ratten", "Hamster", "Spatzen"]],
    ],
  }));

  R(28, like(13, {
    art: A("igel", 1, "schal", "#e85d75"), title: "Der Weg zum Lagerfeuer",
    intro: "Das Lagerfeuer ist angezündet, aber der Igel steckt im verschneiten Wald fest. Dieser Wald ist noch größer und verwinkelter als der letzte. Führe ihn zum Apfel unten rechts.",
    outro: "Geschafft – der Igel wärmt sich jetzt am Feuer die Pfoten.",
    data: { seed: 2828, cw: 21, ch: 12, cwS: 10, chS: 14 },
  }));

  R(29, like(1, {
    art: A("schaf", 0, "muetze"), title: "Memory der Doppelgänger II",
    intro: "Für das Teleskop braucht es ein scharfes Auge. Zwölf neue Paare – und wieder mit Doppelgängern, die sich nur im Accessoire unterscheiden.",
    outro: "Zwölf Paare, kein Fehlgriff. Damit findest du jeden Stern.",
    data: [A("schaf", 0, "muetze"), A("schaf", 0, "schal", "#4f7fe0"), A("hase", 0, "krone"), A("hase", 0, "schleife", "#e85d75"), A("ente", 0, "fliege", "#4f7fe0"), A("ente", 0, "blume", "#e85d75"),
      A("schwein", 0, "brille"), A("schwein", 0, "geweih"), A("baer", 0, ""), A("baer", 0, "muetze"), A("otter", 0, "schal", "#3f9e6e"), A("otter", 0, "krone")],
  }));

  R(30, like(8, {
    art: A("elefant", 0, "krone"), title: "Der Karussell-Code",
    intro: "Das Karussell startet nur mit dem richtigen Code aus vier verschiedenen Tieren. Grüner Punkt: richtiges Tier am richtigen Platz. Gelber Punkt: richtiges Tier, falscher Platz. 10 Versuche pro Code.",
    outro: "Das Karussell dreht sich, und der Elefant strahlt.",
    data: [A("fuchs"), A("igel"), A("hase", 1), A("elefant"), A("ente"), A("otter")],
  }));

  R(31, like(23, {
    art: A("capy", 0, "krone"), title: "Das Silvester-Suchbild",
    intro: "Alle warten auf Mitternacht. Fünf Gäste werden noch gesucht, damit das Feuerwerk beginnen kann. Finde genau diese fünf in der Menge – Achtung, es gibt Doppelgänger!",
    outro: "Alle fünf sind da. Zehn, neun, acht …",
    data: { seed: 3131, targets: [A("waschbaer", 1, "geweih"), A("ente", 2, "krone"), A("baer", 2, "schal", "#e85d75"), A("hase", 0, "brille"), A("fuchs", 1, "muetze")] },
  }));
})();
