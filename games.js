/* =========================================================
   Spielecke – drei kleine Spiele im Vollbild.
   Geheim: Bestimmte Punktzahlen bringen einmalig Taler.
   (Davon steht im Spiel nichts – erst nach der Runde gibt's die Überraschung.)
   ========================================================= */
const Games = (() => {
  let H;
  // [Punkte, Taler] – jede Stufe gibt es nur ein einziges Mal
  const RULES = {
    turm: { ms: [[10, 15], [20, 20], [35, 30], [50, 40]] },
    waschbaer: { ms: [[30, 15], [60, 20], [100, 30], [150, 40]] },
    pinguin: { ms: [[400, 15], [800, 20], [1500, 30], [2500, 40]] },
  };

  /* ---------- Leistung: Figuren einmal vorzeichnen, nicht in jedem Bild neu ---------- */
  const cache = {};
  function sprite(v, w) {
    const key = JSON.stringify(v) + w;
    if (cache[key]) return cache[key];
    const sp = Animals.SPECIES[v.sp], h = Math.round((w * sp.H) / sp.W);
    const out = { c: null, w, h };
    const img = new Image();
    img.onload = () => { const c = document.createElement("canvas"); c.width = w; c.height = h; c.getContext("2d").drawImage(img, 0, 0, w, h); out.c = c; };
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(Animals.svg(v, { width: w }));
    return (cache[key] = out);
  }
  const draw = (ctx, s, x, y, w, h) => { if (s.c) ctx.drawImage(s.c, x, y, w, h); };
  // statischer Hintergrund als eigenes Bild
  function layer(W, Hh, dpr, paint) {
    const c = document.createElement("canvas"); c.width = Math.max(1, Math.round(W * dpr)); c.height = Math.max(1, Math.round(Hh * dpr));
    const x = c.getContext("2d"); x.scale(dpr, dpr); paint(x); return c;
  }

  function open() {
    const ov = H.el("div", { class: "gehege-overlay games-overlay", role: "dialog", "aria-label": "Spielecke" });
    let stop = () => {};
    const close = () => { stop(); ov.remove(); document.body.style.overflow = ""; document.body.classList.remove("game-open"); document.removeEventListener("keydown", esc); };
    const esc = (e) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", esc);
    const area = H.el("div", { class: "g-area" });
    const head = H.el("div", { class: "g-head" }, H.el("div", {}, H.el("h2", { text: "Spielecke" }), H.el("div", { class: "g-sub", text: "Eine kleine Pause vom Gehege-Alltag." })),
      H.el("button", { class: "modal-close", "aria-label": "Schließen", text: "✖", onclick: close }));
    ov.append(head, area);
    const menu = () => {
      stop(); stop = () => {}; ov.classList.remove("playing"); area.innerHTML = "";
      const card = (id, title, text, art, game, theme, unit) => {
        const hs = Zoo.high(id);
        return H.el("div", { class: "game-card gc-" + theme },
          H.el("div", { class: "gc-banner" }, H.el("div", { class: "game-art", html: Animals.svg(art, { fit: true, walk: true }) })),
          H.el("div", { class: "gc-body" },
            H.el("h3", { text: title }), H.el("p", { text }),
            H.el("div", { class: "gc-foot" },
              H.el("div", { class: "gc-record" + (hs ? "" : " none") }, H.el("small", { text: "Dein Rekord" }), H.el("b", { text: hs ? `${hs}` : "–" }), H.el("span", { text: hs ? unit : "noch nicht gespielt" })),
              H.el("button", { class: "btn btn-green", text: "Spielen", onclick: () => play(game, id, title) }))));
      };
      area.append(H.el("div", { class: "game-menu" },
        card("turm", "Heuballen-Turm", "Schaf Leo will ganz hoch hinaus. Tippe, um den schwingenden Heuballen fallen zu lassen – was übersteht, fällt herunter. Je höher, desto weiter geht's hinauf in den Himmel.", { sp: "schaf", col: 0, acc: "muetze" }, turm, "turm", "Ballen"),
        card("waschbaer", "Waschbär-Alarm", "Die Waschbären plündern die Mülltonnen! Tippe sie an, bevor sie mit einem Keks entwischen. Aber Vorsicht: Manchmal schaut auch Kalle heraus.", { sp: "waschbaer", col: 0, acc: "krone" }, waschbaer, "coon", "Punkte"),
        card("pinguin", "Pinguin-Rutsche", "Erna rutscht durch Schneewälder, Dörfer und Polarnächte. Springen (auch doppelt!), Fische schnappen, Möwen ausweichen.", { sp: "pinguin", col: 1, acc: "muetze" }, pinguin, "peng", "Punkte")));
    };
    const play = (game, id, title) => {
      stop(); stop = () => {}; area.innerHTML = ""; ov.classList.add("playing");
      const bar = H.el("div", { class: "game-bar" }, H.el("button", { class: "btn btn-soft", text: "← Spielecke", onclick: menu }), H.el("b", { text: title }), H.el("span", { class: "game-rec", text: `Rekord: ${Zoo.high(id)}` }));
      const wrap = H.el("div", { class: "game-wrap" });
      const cv = H.el("canvas", { class: "game-canvas" });
      const panel = H.el("div", { class: "game-panel" });
      wrap.append(cv, panel);
      area.append(bar, wrap);
      // ganzer freier Bildschirm
      const W = Math.max(280, Math.floor(wrap.clientWidth));
      const Hh = Math.max(300, Math.floor(innerHeight - wrap.getBoundingClientRect().top - 12));
      let dpr = Math.min(1.5, devicePixelRatio || 1);
      if (W * Hh * dpr * dpr > 2200000) dpr = 1;
      cv.width = Math.round(W * dpr); cv.height = Math.round(Hh * dpr); cv.style.width = W + "px"; cv.style.height = Hh + "px";
      const ctx = cv.getContext("2d", { alpha: false }); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const env = { cv, ctx, W, Hh, dpr };
      const run = () => { stop(); panel.classList.add("hidden"); stop = game(env, over); };
      panel.append(H.el("b", { text: "Bereit?" }), H.el("span", { text: { pinguin: "Tippen oder Leertaste zum Springen – in der Luft nochmal tippen für einen Doppelsprung!", turm: "Tippen, Klicken oder Leertaste lässt den Heuballen fallen.", waschbaer: "Tippe die Waschbären an – aber nicht Kalle!" }[id] }),
        H.el("button", { class: "btn btn-green", text: "Los geht's!", onclick: run }));
      function over(score) {
        stop(); stop = () => {};
        const res = Zoo.gameResult(id, score, RULES[id]);
        if (typeof Extras !== "undefined") Extras.track("games");
        bar.querySelector(".game-rec").textContent = `Rekord: ${res.high}`;
        panel.innerHTML = ""; panel.classList.remove("hidden");
        panel.append(H.el("b", { text: score > res.old ? "Neuer Rekord!" : "Vorbei!" }), H.el("span", { class: "game-score", text: `${score} ${score === 1 ? "Punkt" : "Punkte"}` }), H.el("span", { text: `Rekord: ${res.high}` }));
        if (res.coins) {
          panel.append(H.el("div", { class: "game-secret" }, H.el("b", { text: "Überraschung!" }), H.el("span", { text: `Kalle ist so beeindruckt, dass er dir ${res.coins} Taler schenkt.` })));
          const r = panel.getBoundingClientRect();
          setTimeout(() => { Zoo.addCoins(res.coins, { x: r.left + r.width / 2, y: r.top + r.height / 2 }); H.sfx.win(); H.confetti(["✨", "⭐", "💛"], 40); }, 400);
        }
        panel.append(H.el("div", { class: "row" }, H.el("button", { class: "btn btn-green", text: "Nochmal", onclick: run }), H.el("button", { class: "btn btn-soft", text: "Spielecke", onclick: menu })));
      }
      ctx.fillStyle = "#dff1fb"; ctx.fillRect(0, 0, W, Hh);
    };
    document.body.append(ov); document.body.style.overflow = "hidden"; document.body.classList.add("game-open");
    menu();
  }

  // gemeinsamer Takt
  function loop(step) {
    let raf, last = 0, alive = true;
    const f = (ts) => { if (!alive) return; const dt = Math.min(0.05, (ts - (last || ts)) / 1000); last = ts; if (step(dt) === false) alive = false; else raf = requestAnimationFrame(f); };
    raf = requestAnimationFrame(f);
    return () => { alive = false; cancelAnimationFrame(raf); };
  }

  /* ---------- Spiel 1: Heuballen-Turm ---------- */
  function turm({ cv, ctx, W, Hh, dpr }, over) {
    const U = Math.min(W, Hh * 1.4);
    const sheepW = Math.round(U * 0.12), sheep = sprite({ sp: "schaf", col: 0, acc: "muetze" }, sheepW * 2);
    const bh = Math.round(Math.max(26, Hh * 0.065)), baseW = Math.min(W * 0.5, U * 0.55), groundY = Hh - 30;
    // Himmel nach Turmhöhe: Tag → Sonnenuntergang → Abend → Sternennacht → Weltall
    const SKY = [[0, "#9fd0ef", "#e9f6ff"], [10, "#ff9e7a", "#ffe2b0"], [20, "#6b4fa8", "#f2a2a8"], [30, "#14204a", "#3b4f8a"], [42, "#04050f", "#1c1440"]];
    const STAGES = [[10, "Sonnenuntergang!"], [20, "Der Abend bricht an"], [30, "Sternennacht"], [42, "Ab ins Weltall!"]];
    const hex = (h) => [1, 3, 5].map((k) => parseInt(h.slice(k, k + 2), 16));
    const mixC = (a, b, t) => { const x = hex(a), y = hex(b); return `rgb(${x.map((v, k) => Math.round(v + (y[k] - v) * t)).join(",")})`; };
    const skyAt = (lv) => { let k = 0; while (k < SKY.length - 2 && lv >= SKY[k + 1][0]) k++; const [a0, t0, b0] = SKY[k], [a1, t1, b1] = SKY[k + 1]; const t = Math.max(0, Math.min(1, (lv - a0) / (a1 - a0))); return [mixC(t0, t1, t), mixC(b0, b1, t)]; };
    const clamp01 = (v) => Math.max(0, Math.min(1, v));
    const stars = Array.from({ length: 80 }, () => [Math.random() * W, Math.random() * Hh * 0.85, 0.5 + Math.random() * 1.6, Math.random() * 6]);
    const clouds = [[0.2, 0.16, 1], [0.75, 0.1, 0.8], [0.5, 0.3, 1.2], [0.88, 0.42, 0.9], [0.05, 0.5, 1]].map(([x, y, sc]) => ({ x: x * W, y: y * Hh, sc }));
    const birds = Array.from({ length: 3 }, (_, k) => ({ x: Math.random() * W, y: Hh * (0.15 + k * 0.1), v: 30 + k * 12 }));
    let lv = 0, tt = 0, banner = null;
    const sky = (dt) => {
      tt += dt; lv += (stack.length - 1 - lv) * Math.min(1, dt * 1.2);
      const [a, b] = skyAt(lv); const g = ctx.createLinearGradient(0, 0, 0, Hh); g.addColorStop(0, a); g.addColorStop(1, b); ctx.fillStyle = g; ctx.fillRect(0, 0, W, Hh);
      const sa = clamp01((lv - 16) / 10);
      if (sa) { ctx.fillStyle = "#fff6d0"; for (const [x, y, r, ph] of stars) { ctx.globalAlpha = sa * (0.55 + 0.45 * Math.sin(tt * 2 + ph)); ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); } ctx.globalAlpha = 1; }
      const ma = clamp01((lv - 22) / 6);
      if (ma) { ctx.globalAlpha = ma; ctx.fillStyle = "#fff3c4"; ctx.beginPath(); ctx.arc(W * 0.82, Hh * 0.17, U * 0.05, 0, 7); ctx.fill(); ctx.fillStyle = skyAt(lv)[0]; ctx.beginPath(); ctx.arc(W * 0.82 + U * 0.022, Hh * 0.17 - U * 0.012, U * 0.045, 0, 7); ctx.fill(); ctx.globalAlpha = 1; }
      const pa = clamp01((lv - 38) / 6);
      if (pa) { ctx.globalAlpha = pa; const px = W * 0.18, py = Hh * 0.24, pr = U * 0.06; ctx.fillStyle = "#c77dff"; ctx.beginPath(); ctx.arc(px, py, pr, 0, 7); ctx.fill(); ctx.strokeStyle = "#ffd84d"; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(px, py, pr * 1.7, pr * 0.45, -0.3, 0, 7); ctx.stroke(); ctx.fillStyle = "#58b6ff"; ctx.beginPath(); ctx.arc(W * 0.7, Hh * 0.4, U * 0.02, 0, 7); ctx.fill(); ctx.globalAlpha = 1; }
      const ca = clamp01(1 - (lv - 12) / 8);
      if (ca) { ctx.fillStyle = `rgba(255,255,255,${0.8 * ca})`; for (const c of clouds) { c.x += dt * 8 * c.sc; if (c.x > W + 100) c.x = -100; ctx.beginPath(); ctx.ellipse(c.x, c.y, U * 0.08 * c.sc, U * 0.025 * c.sc, 0, 0, 7); ctx.fill(); } }
      const ba = clamp01(1 - Math.abs(lv - 13) / 7);
      if (ba) { ctx.strokeStyle = `rgba(60,40,50,${0.7 * ba})`; ctx.lineWidth = 2; for (const bd of birds) { bd.x += bd.v * dt; if (bd.x > W + 30) bd.x = -30; const f = Math.sin(tt * 8 + bd.y) * 4; ctx.beginPath(); ctx.moveTo(bd.x - 9, bd.y - f); ctx.quadraticCurveTo(bd.x - 4, bd.y - 6, bd.x, bd.y); ctx.quadraticCurveTo(bd.x + 4, bd.y - 6, bd.x + 9, bd.y - f); ctx.stroke(); } }
      const st = STAGES.find(([n]) => stack.length - 1 === n && (!banner || banner.n !== n));
      if (st) { banner = { n: st[0], text: st[1], t: 2.2 }; H.sfx.tone(988, 0.3, "sine", 0.12); }
      if (banner && banner.t > 0) { banner.t -= dt; ctx.globalAlpha = clamp01(banner.t); ctx.fillStyle = lv > 18 ? "#fff6d0" : "#5a3b2e"; ctx.font = "700 30px Fredoka, Arial, sans-serif"; ctx.textAlign = "center"; ctx.fillText(banner.text, W / 2, Hh * 0.32); ctx.textAlign = "left"; ctx.globalAlpha = 1; }
    };
    const BW = 600;
    const baleImg = layer(BW, bh, dpr, (x) => {
      x.fillStyle = "#e8c46b"; x.beginPath(); if (x.roundRect) x.roundRect(0, 0, BW, bh - 2, 6); else x.rect(0, 0, BW, bh - 2); x.fill();
      x.strokeStyle = "#c9a03d"; x.lineWidth = 2; for (let k = 1; k < 3; k++) { x.beginPath(); x.moveTo(4, (k * (bh - 2)) / 3); x.lineTo(BW - 4, (k * (bh - 2)) / 3); x.stroke(); }
    });
    const bale = (x, y, w) => { const sw = Math.min(BW, w); ctx.drawImage(baleImg, 0, 0, sw * dpr, bh * dpr, x, y, w, bh); if (w > 24) { ctx.fillStyle = "#d9534f"; ctx.fillRect(x + w * 0.25, y, 4, bh - 2); ctx.fillRect(x + w * 0.75 - 4, y, 4, bh - 2); } };
    let stack = [{ x: (W - baseW) / 2, w: baseW }].concat(Array.from({ length: window.__TURM_START || 0 }, () => ({ x: (W - baseW) / 2, w: baseW }))), cur, falling = [], score = 0, cam = 0, camT = 0, done = false, perfectT = 0, combo = 0;
    const topY = (i) => groundY - (i + 1) * bh;
    const newBlock = () => { const top = stack[stack.length - 1]; const left = Math.random() < 0.5; cur = { x: left ? 0 : W - top.w, w: top.w, dir: left ? 1 : -1, speed: Math.min(W * 1.4, U * (0.45 + stack.length * 0.03)) }; };
    newBlock();
    const drop = () => {
      if (done) return;
      const top = stack[stack.length - 1];
      let l = Math.max(cur.x, top.x), r = Math.min(cur.x + cur.w, top.x + top.w);
      if (r - l <= 2) { falling.push({ x: cur.x, w: cur.w, y: topY(stack.length) - bh * 1.2, vy: 0 }); done = true; H.sfx.bad(); setTimeout(() => over(score), 900); return; }
      if (Math.abs(cur.x - top.x) < 5) { l = top.x; r = top.x + top.w; perfectT = 0.8; combo++; score += 1; H.sfx.tone(880 + combo * 60, 0.15, "triangle", 0.15); }
      else { combo = 0; H.sfx.tone(420, 0.08, "sine", 0.14, 300); if (cur.x < l) falling.push({ x: cur.x, w: l - cur.x, y: topY(stack.length), vy: 0 }); if (cur.x + cur.w > r) falling.push({ x: r, w: cur.x + cur.w - r, y: topY(stack.length), vy: 0 }); }
      stack.push({ x: l, w: r - l }); score++;
      camT = Math.max(0, (stack.length - Math.floor((Hh * 0.55) / bh)) * bh);
      newBlock();
    };
    const pd = (e) => { e.preventDefault(); drop(); };
    const kd = (e) => { if (e.key === " " || e.key === "ArrowDown") { e.preventDefault(); drop(); } };
    cv.addEventListener("pointerdown", pd); document.addEventListener("keydown", kd);
    const stopLoop = loop((dt) => {
      if (!done) { cur.x += cur.dir * cur.speed * dt; if (cur.x > W - cur.w) cur.dir = -1; if (cur.x < 0) cur.dir = 1; }
      cam += (camT - cam) * Math.min(1, dt * 5);
      for (const f of falling) { f.vy += Hh * 2.4 * dt; f.y += f.vy * dt; }
      falling = falling.filter((f) => f.y < Hh + cam + 60);
      sky(dt);
      ctx.save(); ctx.translate(0, cam);
      ctx.fillStyle = "#a8d78f"; ctx.fillRect(0, groundY, W, 30 + cam);
      const first = Math.max(0, Math.floor((groundY + cam - Hh) / bh) - 1);
      for (let i = first; i < stack.length; i++) bale(stack[i].x, topY(i), stack[i].w);
      for (const f of falling) bale(f.x, f.y, f.w);
      const top = stack[stack.length - 1], sw = Math.min(top.w * 0.9, sheepW), sh = sw * 0.76;
      draw(ctx, sheep, top.x + top.w / 2 - sw / 2, topY(stack.length - 1) - sh + 4, sw, sh);
      if (!done) bale(cur.x, topY(stack.length) - bh * 1.2, cur.w);
      ctx.restore();
      if (perfectT > 0) { perfectT -= dt; ctx.globalAlpha = Math.max(0, Math.min(1, perfectT * 2)); ctx.fillStyle = "#e85d75"; ctx.font = "700 28px Fredoka, Arial, sans-serif"; ctx.textAlign = "center"; ctx.fillText(combo > 1 ? `Perfekt! ×${combo}` : "Perfekt!", W / 2, Hh * 0.2); ctx.textAlign = "left"; ctx.globalAlpha = 1; }
      ctx.fillStyle = lv > 18 ? "#fff6d0" : "#5a3b2e"; ctx.font = "700 24px Fredoka, Arial, sans-serif"; ctx.fillText(`${score}`, 16, 34);
    });
    return () => { stopLoop(); cv.removeEventListener("pointerdown", pd); document.removeEventListener("keydown", kd); };
  }

  /* ---------- Spiel 2: Waschbär-Alarm ---------- */
  function waschbaer({ cv, ctx, W, Hh, dpr }, over) {
    const portrait = W < Hh, cols = portrait ? 2 : 3, rows = portrait ? 3 : 2, top0 = 60, cw = W / cols, rh = (Hh - top0) / rows;
    const binW = Math.min(cw * 0.72, (rh - 16) / 1.45, 260), binH = binW * 0.72, sw = binW * 1.05, sh = sw * 0.75;
    const coon = sprite({ sp: "waschbaer", col: 0, acc: "" }, Math.round(sw * 1.5)), kalle = sprite({ sp: "capy", col: 0, acc: "orange" }, Math.round(sw * 1.5));
    const bins = Array.from({ length: cols * rows }, (_, i) => ({ cx: cw * (i % cols) + cw / 2, by: top0 + rh * (Math.floor(i / cols) + 1) - 16, who: null, t: 0, up: 0, hit: 0 }));
    const bg = layer(W, Hh, dpr, (x) => {
      const g = x.createLinearGradient(0, 0, 0, Hh); g.addColorStop(0, "#c98f74"); g.addColorStop(1, "#b47a60"); x.fillStyle = g; x.fillRect(0, 0, W, Hh);
      x.strokeStyle = "rgba(0,0,0,.08)"; x.lineWidth = 2; for (let y = 20; y < Hh; y += 24) { x.beginPath(); x.moveTo(0, y); x.lineTo(W, y); x.stroke(); }
    });
    const can = layer(binW * 1.2, binH + 12, dpr, (x) => {
      const ox = binW * 0.1, y0 = 10;
      x.fillStyle = "#8c96a3"; x.beginPath(); x.moveTo(ox, y0); x.lineTo(ox + binW, y0); x.lineTo(ox + binW * 0.92, y0 + binH); x.lineTo(ox + binW * 0.08, y0 + binH); x.fill();
      x.strokeStyle = "#76808d"; x.lineWidth = 4; [0.28, 0.5, 0.72].forEach((k) => { x.beginPath(); x.moveTo(ox + k * binW, y0 + 8); x.lineTo(ox + binW / 2 + (k - 0.5) * binW * 0.85, y0 + binH - 6); x.stroke(); });
      x.fillStyle = "#9aa4b1"; x.fillRect(ox - binW * 0.05, 0, binW * 1.1, 10);
    });
    let score = 0, cookies = 5, t = 0, spawn = 0.6, msg = null, ended = false;
    const end = () => { if (ended) return; ended = true; setTimeout(() => over(score), 500); };
    const pd = (e) => {
      e.preventDefault(); if (ended) return;
      const r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      for (const b of bins) {
        if (!b.who || b.hit) continue;
        const top = b.by - binH - sh * 0.85 * b.up;
        if (Math.abs(x - b.cx) < binW * 0.5 && y > top && y < b.by) {
          b.hit = 0.35;
          if (b.who === "coon") { score++; H.sfx.pop(); msg = { text: H.pick(["Erwischt!", "Hab dich!", "Keks gerettet!", "Zack!", "Nix da!"]), x: b.cx, y: top, t: 0.7 }; }
          else { cookies--; H.sfx.bad(); msg = { text: "Aua! Das war Kalle!", x: b.cx, y: top, t: 1 }; if (cookies <= 0) end(); }
        }
      }
    };
    cv.addEventListener("pointerdown", pd);
    const stopLoop = loop((dt) => {
      t += dt;
      if (!ended) {
        spawn -= dt;
        if (spawn <= 0) {
          spawn = Math.max(0.38, 1.0 - t * 0.012);
          const free = bins.filter((b) => !b.who);
          if (free.length) { const b = H.pick(free); b.who = Math.random() < 0.16 ? "kalle" : "coon"; b.t = Math.max(0.75, 1.6 - t * 0.012); b.up = 0; b.hit = 0; }
        }
        for (const b of bins) {
          if (!b.who) continue;
          if (b.hit > 0) { b.hit -= dt; b.up = Math.max(0, b.up - dt * 5); if (b.hit <= 0) b.who = null; continue; }
          b.t -= dt; b.up = Math.min(1, b.up + dt * 6);
          if (b.t <= 0) { if (b.who === "coon") { cookies--; H.sfx.tone(260, 0.2, "sawtooth", 0.06, 180); msg = { text: "Keks weg!", x: b.cx, y: b.by - binH - 40, t: 0.8 }; if (cookies <= 0) end(); } b.who = null; }
        }
      }
      ctx.drawImage(bg, 0, 0, W, Hh);
      for (const b of bins) {
        if (b.who) draw(ctx, b.who === "coon" ? coon : kalle, b.cx - sw / 2, b.by - binH - sh * 1.0 * b.up + sh * 0.12, sw, sh);
        ctx.drawImage(can, b.cx - binW * 0.6, b.by - binH - 10, binW * 1.2, binH + 12);
      }
      if (msg && msg.t > 0) { msg.t -= dt; ctx.globalAlpha = Math.max(0, Math.min(1, msg.t * 2)); ctx.fillStyle = "#fff"; ctx.font = "700 20px Fredoka, Arial, sans-serif"; ctx.textAlign = "center"; ctx.fillText(msg.text, msg.x, msg.y); ctx.textAlign = "left"; ctx.globalAlpha = 1; }
      ctx.fillStyle = "#fff"; ctx.font = "700 24px Fredoka, Arial, sans-serif"; ctx.fillText(`${score}`, 16, 36);
      for (let i = 0; i < 5; i++) { ctx.fillStyle = i < cookies ? "#d9a05c" : "rgba(255,255,255,.25)"; ctx.beginPath(); ctx.arc(W - 24 - i * 28, 28, 11, 0, 7); ctx.fill(); }
    });
    return () => { stopLoop(); cv.removeEventListener("pointerdown", pd); };
  }

  /* ---------- Spiel 3: Pinguin-Rutsche ---------- */
  function pinguin({ cv, ctx, W, Hh, dpr }, over) {
    const U = Math.min(Math.max(W, Hh * 0.9), Hh * 1.6);   // Tempo-Maßstab (wie bisher)
    const K = U * 0.85;                                      // Größen-Maßstab: etwas weiter rausgezoomt
    const ground = Hh * 0.82, pw = K * 0.075, ph = pw * 1.25, px = W * 0.16;
    const peng = sprite({ sp: "pinguin", col: 1, acc: "muetze" }, Math.round(pw * 2));
    const shieldP = sprite({ sp: "pinguin", col: 1, acc: "krone" }, Math.round(pw * 2));
    const clamp01 = (v) => Math.max(0, Math.min(1, v));
    const hex = (h) => [1, 3, 5].map((k) => parseInt(h.slice(k, k + 2), 16));
    const mixC = (a, b, t) => { const x = hex(a), y = hex(b); return `rgb(${x.map((v, k) => Math.round(v + (y[k] - v) * t)).join(",")})`; };
    const rnd = (seed) => { let x = seed; return () => (x = (x * 16807) % 2147483647) / 2147483647; };

    // Landschaften – gedämpfte Farben, damit nichts vom Spiel ablenkt
    const tileW = Math.round(K * 1.8), farH = Math.round(Hh * 0.42);
    const BIOMES = [
      { name: "Eisberge", top: "#bfe2f6", bot: "#f2faff", paint(x, r) { x.fillStyle = "#dbeef8"; for (let k = 0; k < 4; k++) { const cx = (k + r() * 0.4) * tileW / 4, w = tileW * (0.18 + r() * 0.1), h = farH * (0.5 + r() * 0.4); x.beginPath(); x.moveTo(cx - w, farH); x.lineTo(cx, farH - h); x.lineTo(cx + w, farH); x.fill(); x.fillStyle = "#fff"; x.beginPath(); x.moveTo(cx - w * 0.28, farH - h * 0.72); x.lineTo(cx, farH - h); x.lineTo(cx + w * 0.28, farH - h * 0.72); x.fill(); x.fillStyle = "#dbeef8"; } } },
      { name: "Tannenwald", top: "#cfe8e4", bot: "#f3fbf6", paint(x, r) { for (let k = 0; k < 16; k++) { const cx = r() * tileW, h = farH * (0.3 + r() * 0.4), w = h * 0.38; x.fillStyle = k % 2 ? "#8fbfa4" : "#a7cdb6"; x.beginPath(); x.moveTo(cx - w, farH); x.lineTo(cx, farH - h); x.lineTo(cx + w, farH); x.fill(); x.fillStyle = "#fff"; x.beginPath(); x.moveTo(cx - w * 0.3, farH - h * 0.7); x.lineTo(cx, farH - h); x.lineTo(cx + w * 0.3, farH - h * 0.7); x.fill(); } } },
      { name: "Winterdorf", top: "#f6d2d6", bot: "#fff3ea", paint(x, r) { for (let k = 0; k < 6; k++) { const cx = (k + 0.2 + r() * 0.5) * tileW / 6, w = farH * (0.22 + r() * 0.1), h = w * (0.8 + r() * 0.4), base = farH; x.fillStyle = ["#e9c9b8", "#d9b9c9", "#cfd8e6"][k % 3]; x.fillRect(cx - w / 2, base - h, w, h); x.fillStyle = "#fff"; x.beginPath(); x.moveTo(cx - w * 0.62, base - h); x.lineTo(cx, base - h - w * 0.5); x.lineTo(cx + w * 0.62, base - h); x.fill(); x.fillStyle = "#ffe08a"; x.fillRect(cx - w * 0.25, base - h * 0.6, w * 0.18, w * 0.18); x.fillRect(cx + w * 0.07, base - h * 0.6, w * 0.18, w * 0.18); } } },
      { name: "Polarnacht", top: "#1d2b52", bot: "#46598e", night: true, paint(x, r) { x.fillStyle = "#33447a"; x.beginPath(); x.moveTo(0, farH); for (let k = 0; k <= 8; k++) x.lineTo((k * tileW) / 8, farH - farH * (0.15 + r() * 0.25)); x.lineTo(tileW, farH); x.fill(); } },
    ];
    BIOMES.forEach((b, k) => { const r = rnd(97 + k * 31); b.tile = layer(tileW, farH, dpr, (x) => b.paint(x, r)); });
    const stars = Array.from({ length: 60 }, () => [Math.random() * W, Math.random() * ground * 0.7, 0.5 + Math.random() * 1.4]);
    const SEG = U * 9, BLEND = U * 1.4;
    const hillW = K * 0.6, hillH = Hh * 0.16;
    const hills = layer(hillW * 4, hillH, dpr, (x) => { x.fillStyle = "#eef7fc"; for (let i = 0; i < 4; i++) { x.beginPath(); x.ellipse(i * hillW + hillW / 2, hillH, hillW * 0.55, hillH * 0.6, 0, Math.PI, 0); x.fill(); } });

    let y = ground - ph, vy = 0, onGround = true, jumps = 0, speed = 0, dist = window.__PENG_DIST || 0, bonus = 0, obs = [], items = [], birds = [], pops = [], next = 1.2, nextItem = 1.8, nextBird = 6, t = 0, ended = false, shield = false, shieldT = 0, banner = null, lastBiome = 0;
    const G = Hh * 2.7, JUMP = Hh * 1.25;
    const jump = () => { if (ended) return; if (onGround) { vy = -JUMP; onGround = false; jumps = 1; H.sfx.tone(520, 0.1, "triangle", 0.12, 820); } else if (jumps === 1) { vy = -JUMP * 0.82; jumps = 2; H.sfx.tone(700, 0.1, "triangle", 0.12, 1100); } };
    const kd = (e) => { if (e.key === " " || e.key === "ArrowUp") { e.preventDefault(); jump(); } };
    const pd = (e) => { e.preventDefault(); jump(); };
    document.addEventListener("keydown", kd); cv.addEventListener("pointerdown", pd);
    const hit = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
    const pop = (x, y, text, col = "#3b4f8a") => pops.push({ x, y, text, col, t: 1 });
    const score = () => Math.floor(dist / 10) + bonus;
    const crash = () => {
      if (ended) return true;
      if (shield) { shield = false; shieldT = 1; H.sfx.tone(300, 0.2, "sine", 0.15, 600); pop(px + pw, y, "Schutzschild!", "#58b6ff"); return false; }
      ended = true; H.sfx.bad(); setTimeout(() => over(score()), 500); return true;
    };
    const stopLoop = loop((dt) => {
      if (!ended) {
        t += dt; speed = U * (0.5 + t * 0.014); dist += speed * dt;
        vy += G * dt; y += vy * dt;
        if (y >= ground - ph) { y = ground - ph; vy = 0; onGround = true; jumps = 0; }
        if (shieldT > 0) shieldT -= dt;
        next -= dt; nextItem -= dt; nextBird -= dt;
        if (next <= 0) {
          const r = Math.random();
          obs.push(r < 0.3 ? { x: W + 20, w: K * 0.06, h: K * 0.1, kind: "snow" } : r < 0.55 ? { x: W + 20, w: K * 0.16, h: K * 0.045, kind: "long" } : { x: W + 20, w: K * (0.05 + Math.random() * 0.04), h: K * (0.05 + Math.random() * 0.035), kind: "ice" });
          next = Math.max(0.65, (1.55 - t * 0.012) * (0.7 + Math.random() * 0.8));
        }
        if (nextItem <= 0) {
          const r = Math.random(), iy = ground - ph - Hh * (0.08 + Math.random() * 0.3);
          if (r < 0.12) items.push({ x: W + 20, y: iy, kind: "gold" });
          else if (r < 0.2 && !shield) items.push({ x: W + 20, y: iy, kind: "shield" });
          else { const n = 2 + Math.floor(Math.random() * 3); for (let k = 0; k < n; k++) items.push({ x: W + 20 + k * K * 0.07, y: iy - Math.sin((k / (n - 1 || 1)) * Math.PI) * Hh * 0.05, kind: "fish" }); }
          nextItem = 1.4 + Math.random() * 2;
        }
        if (nextBird <= 0 && t > 8) { birds.push({ x: W + 30, y: ground - ph - Hh * (0.22 + Math.random() * 0.14), ph: Math.random() * 6 }); nextBird = 4 + Math.random() * 5; }
        for (const o of obs) o.x -= speed * dt;
        for (const f of items) f.x -= speed * dt;
        for (const b of birds) b.x -= speed * 1.25 * dt;
        obs = obs.filter((o) => o.x > -K * 0.3); birds = birds.filter((b) => b.x > -60);
        const me = { x: px + pw * 0.2, y: y + ph * 0.15, w: pw * 0.6, h: ph * 0.8 };
        if (shieldT <= 0) {
          for (const o of obs) if (!o.hit && hit(me, { x: o.x + 3, y: ground - o.h + 3, w: o.w - 6, h: o.h })) { o.hit = true; if (crash()) break; }
          for (const b of birds) if (!b.hit && hit(me, { x: b.x - 14, y: b.y - 8, w: 28, h: 16 })) { b.hit = true; if (crash()) break; }
        }
        items = items.filter((f) => {
          if (hit(me, { x: f.x - 14, y: f.y - 10, w: 28, h: 20 })) {
            if (f.kind === "fish") { bonus += 25; H.sfx.pop(); pop(f.x, f.y, "+25"); }
            else if (f.kind === "gold") { bonus += 100; H.sfx.good(); pop(f.x, f.y, "+100 Goldfisch!", "#c98a00"); }
            else { shield = true; H.sfx.win(); pop(f.x, f.y, "Schutzschild!", "#58b6ff"); }
            return false;
          }
          return f.x > -40;
        });
      }
      // Landschaft wählen und weich überblenden
      const seg = dist / SEG, bi = Math.floor(seg) % BIOMES.length, nb = (bi + 1) % BIOMES.length;
      const into = (seg - Math.floor(seg)) * SEG, blend = clamp01((into - (SEG - BLEND)) / BLEND);
      const A = BIOMES[bi], B = BIOMES[nb];
      if (bi !== lastBiome && into < BLEND) { lastBiome = bi; banner = { text: A.name, t: 2 }; }
      const g = ctx.createLinearGradient(0, 0, 0, ground); g.addColorStop(0, mixC(A.top, B.top, blend)); g.addColorStop(1, mixC(A.bot, B.bot, blend)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, ground);
      const nightA = (A.night ? 1 - blend : 0) + (B.night ? blend : 0);
      if (nightA > 0.02) {
        ctx.fillStyle = "#fff6d0"; ctx.globalAlpha = nightA * 0.85; for (const [sx, sy, sr] of stars) { ctx.beginPath(); ctx.arc(sx, sy, sr, 0, 7); ctx.fill(); }
        ctx.globalAlpha = nightA * 0.35; for (let k = 0; k < 3; k++) { const ag = ctx.createLinearGradient(0, Hh * (0.08 + k * 0.06), 0, Hh * (0.3 + k * 0.06)); ag.addColorStop(0, "rgba(120,255,190,0)"); ag.addColorStop(0.5, k === 1 ? "rgba(150,120,255,.9)" : "rgba(120,255,190,.9)"); ag.addColorStop(1, "rgba(120,255,190,0)"); ctx.fillStyle = ag; ctx.beginPath(); ctx.moveTo(0, Hh * (0.18 + k * 0.05)); for (let xx = 0; xx <= W; xx += W / 8) ctx.lineTo(xx, Hh * (0.18 + k * 0.05) + Math.sin(xx / W * 6 + t * 0.4 + k) * Hh * 0.04); ctx.lineTo(W, Hh * (0.3 + k * 0.06)); ctx.lineTo(0, Hh * (0.3 + k * 0.06)); ctx.fill(); }
        ctx.globalAlpha = 1;
      }
      const farOff = (dist * 0.12) % tileW;
      const drawFar = (tile, a) => { if (a <= 0) return; ctx.globalAlpha = a; for (let xx = -farOff; xx < W; xx += tileW) ctx.drawImage(tile, xx, ground - farH, tileW, farH); ctx.globalAlpha = 1; };
      drawFar(A.tile, 1 - blend); drawFar(B.tile, blend);
      const off = (dist * 0.28) % (hillW * 4);
      ctx.globalAlpha = 1 - nightA * 0.5; ctx.drawImage(hills, -off, ground - hillH, hillW * 4, hillH); ctx.drawImage(hills, hillW * 4 - off, ground - hillH, hillW * 4, hillH); ctx.globalAlpha = 1;
      ctx.fillStyle = mixC("#ffffff", "#c9d6ea", nightA); ctx.fillRect(0, ground, W, Hh - ground);
      ctx.strokeStyle = "rgba(160,200,225,.7)"; ctx.lineWidth = 2; ctx.beginPath(); for (let i = 0; i < 14; i++) { const lx = W - ((dist + i * 90) % (W + 90)), ly = ground + 12 + (i % 3) * 9; ctx.moveTo(lx, ly); ctx.lineTo(lx + 30, ly); } ctx.stroke();
      for (const o of obs) {
        if (o.kind === "ice" || o.kind === "long") { ctx.fillStyle = "#a9dcf2"; ctx.fillRect(o.x, ground - o.h, o.w, o.h); ctx.fillStyle = "#d8f1fb"; ctx.fillRect(o.x + 4, ground - o.h + 4, o.w * 0.3, o.h * 0.4); ctx.strokeStyle = "#7fbfe0"; ctx.lineWidth = 2; ctx.strokeRect(o.x, ground - o.h, o.w, o.h); }
        else { ctx.fillStyle = "#fff"; ctx.strokeStyle = "#cfe0ea"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(o.x + o.w / 2, ground - o.h * 0.3, o.w * 0.55, 0, 7); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.arc(o.x + o.w / 2, ground - o.h * 0.78, o.w * 0.38, 0, 7); ctx.fill(); ctx.stroke(); ctx.fillStyle = "#f39c32"; ctx.beginPath(); ctx.moveTo(o.x + o.w / 2, ground - o.h * 0.78); ctx.lineTo(o.x + o.w / 2 - 10, ground - o.h * 0.75); ctx.lineTo(o.x + o.w / 2, ground - o.h * 0.72); ctx.fill(); ctx.fillStyle = "#e85d75"; ctx.fillRect(o.x + o.w * 0.15, ground - o.h * 0.58, o.w * 0.7, o.h * 0.08); }
      }
      for (const b of birds) { const f = Math.sin(t * 12 + b.ph) * 7; ctx.fillStyle = "#f5f5f5"; ctx.beginPath(); ctx.ellipse(b.x, b.y, 13, 7, 0, 0, 7); ctx.fill(); ctx.strokeStyle = "#8a8f99"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(b.x - 16, b.y - f); ctx.quadraticCurveTo(b.x - 6, b.y - 10, b.x, b.y - 2); ctx.quadraticCurveTo(b.x + 6, b.y - 10, b.x + 16, b.y - f); ctx.stroke(); ctx.fillStyle = "#f39c32"; ctx.beginPath(); ctx.moveTo(b.x - 13, b.y); ctx.lineTo(b.x - 20, b.y + 2); ctx.lineTo(b.x - 13, b.y + 3); ctx.fill(); }
      for (const f of items) {
        if (f.kind === "shield") { ctx.fillStyle = "rgba(120,190,255,.35)"; ctx.beginPath(); ctx.arc(f.x, f.y, 16, 0, 7); ctx.fill(); ctx.fillStyle = "#58b6ff"; ctx.font = "700 20px Arial"; ctx.textAlign = "center"; ctx.fillText("❄", f.x, f.y + 7); ctx.textAlign = "left"; continue; }
        ctx.fillStyle = f.kind === "gold" ? "#f6c531" : "#7d93b2"; ctx.beginPath(); ctx.ellipse(f.x, f.y, f.kind === "gold" ? 17 : 14, f.kind === "gold" ? 9 : 7, 0, 0, 7); ctx.moveTo(f.x + 12, f.y); ctx.lineTo(f.x + 22, f.y - 7); ctx.lineTo(f.x + 22, f.y + 7); ctx.fill();
        if (f.kind === "gold") { ctx.strokeStyle = "rgba(255,240,170,.9)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(f.x, f.y, 22 + Math.sin(t * 6) * 3, 0, 7); ctx.stroke(); }
      }
      ctx.save(); ctx.translate(px + pw / 2, y + ph / 2); ctx.rotate(onGround ? 0 : jumps === 2 ? (t * 12) % (Math.PI * 2) : -0.2);
      if (shield || shieldT > 0) { ctx.fillStyle = `rgba(120,190,255,${shieldT > 0 ? 0.25 + Math.sin(t * 30) * 0.2 : 0.3})`; ctx.beginPath(); ctx.arc(0, 0, ph * 0.75, 0, 7); ctx.fill(); }
      draw(ctx, shield ? shieldP : peng, -pw / 2, -ph / 2, pw, ph); ctx.restore();
      pops = pops.filter((q) => { q.t -= dt; q.y -= 40 * dt; ctx.globalAlpha = clamp01(q.t * 1.5); ctx.fillStyle = q.col; ctx.font = "700 18px Fredoka, Arial, sans-serif"; ctx.fillText(q.text, q.x, q.y); ctx.globalAlpha = 1; return q.t > 0; });
      if (banner && banner.t > 0) { banner.t -= dt; ctx.globalAlpha = clamp01(banner.t); ctx.fillStyle = nightA > 0.5 ? "#fff6d0" : "#3b4f8a"; ctx.font = "700 26px Fredoka, Arial, sans-serif"; ctx.textAlign = "center"; ctx.fillText(banner.text, W / 2, Hh * 0.16); ctx.textAlign = "left"; ctx.globalAlpha = 1; }
      ctx.fillStyle = nightA > 0.5 ? "#fff6d0" : "#3b4f8a"; ctx.font = "700 24px Fredoka, Arial, sans-serif"; ctx.fillText(`${score()}`, 16, 34);
    });
    return () => { stopLoop(); document.removeEventListener("keydown", kd); cv.removeEventListener("pointerdown", pd); };
  }

  function init() {
    H = App.h;
    document.getElementById("games-btn")?.addEventListener("click", (e) => { e.stopPropagation(); H.sfx.boop(640); open(); });
    document.getElementById("hunger-pill")?.addEventListener("click", (e) => { e.stopPropagation(); Animals.openGehege(); });
  }
  return { init, open };
})();
