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
      const card = (id, title, text, art, game) => H.el("div", { class: "game-card" },
        H.el("div", { class: "game-art", html: Animals.svg(art, { fit: true, walk: true }) }),
        H.el("h3", { text: title }), H.el("p", { text }),
        H.el("div", { class: "game-high", text: `Rekord: ${Zoo.high(id)}` }),
        H.el("button", { class: "btn btn-green", text: "Spielen", onclick: () => play(game, id, title) }));
      area.append(H.el("div", { class: "game-menu" },
        card("turm", "Heuballen-Turm", "Schaf Leo will ganz hoch hinaus. Tippe, um den schwingenden Heuballen fallen zu lassen. Was übersteht, fällt herunter – also genau zielen!", { sp: "schaf", col: 0, acc: "muetze" }, turm),
        card("waschbaer", "Waschbär-Alarm", "Die Waschbären plündern die Keksdosen! Tippe sie an, bevor sie mit einem Keks entwischen. Aber Vorsicht: Manchmal schaut auch Kalle heraus.", { sp: "waschbaer", col: 0, acc: "krone" }, waschbaer),
        card("pinguin", "Pinguin-Rutsche", "Erna rutscht auf dem Bauch übers Eis. Tippe zum Springen, weich Eisblöcken und Schneemännern aus und schnapp dir die Fische.", { sp: "pinguin", col: 1, acc: "muetze" }, pinguin)));
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
      panel.append(H.el("b", { text: "Bereit?" }), H.el("span", { text: { pinguin: "Tippen, Klicken oder Leertaste zum Springen.", turm: "Tippen, Klicken oder Leertaste lässt den Heuballen fallen.", waschbaer: "Tippe die Waschbären an – aber nicht Kalle!" }[id] }),
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
    const bg = layer(W, Hh, dpr, (x) => {
      const g = x.createLinearGradient(0, 0, 0, Hh); g.addColorStop(0, "#9fd0ef"); g.addColorStop(1, "#e9f6ff"); x.fillStyle = g; x.fillRect(0, 0, W, Hh);
      x.fillStyle = "rgba(255,255,255,.8)"; [[0.2, 0.16], [0.75, 0.1], [0.5, 0.3], [0.88, 0.42]].forEach(([cx, cy]) => { x.beginPath(); x.ellipse(cx * W, cy * Hh, U * 0.08, U * 0.025, 0, 0, 7); x.fill(); });
    });
    const BW = 600;
    const baleImg = layer(BW, bh, dpr, (x) => {
      x.fillStyle = "#e8c46b"; x.beginPath(); if (x.roundRect) x.roundRect(0, 0, BW, bh - 2, 6); else x.rect(0, 0, BW, bh - 2); x.fill();
      x.strokeStyle = "#c9a03d"; x.lineWidth = 2; for (let k = 1; k < 3; k++) { x.beginPath(); x.moveTo(4, (k * (bh - 2)) / 3); x.lineTo(BW - 4, (k * (bh - 2)) / 3); x.stroke(); }
    });
    const bale = (x, y, w) => { const sw = Math.min(BW, w); ctx.drawImage(baleImg, 0, 0, sw * dpr, bh * dpr, x, y, w, bh); if (w > 24) { ctx.fillStyle = "#d9534f"; ctx.fillRect(x + w * 0.25, y, 4, bh - 2); ctx.fillRect(x + w * 0.75 - 4, y, 4, bh - 2); } };
    let stack = [{ x: (W - baseW) / 2, w: baseW }], cur, falling = [], score = 0, cam = 0, camT = 0, done = false, perfectT = 0, combo = 0;
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
      ctx.drawImage(bg, 0, 0, W, Hh);
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
      ctx.fillStyle = "#5a3b2e"; ctx.font = "700 24px Fredoka, Arial, sans-serif"; ctx.fillText(`${score}`, 16, 34);
    });
    return () => { stopLoop(); cv.removeEventListener("pointerdown", pd); document.removeEventListener("keydown", kd); };
  }

  /* ---------- Spiel 2: Waschbär-Alarm ---------- */
  function waschbaer({ cv, ctx, W, Hh, dpr }, over) {
    const portrait = W < Hh, cols = portrait ? 2 : 3, rows = portrait ? 3 : 2, top0 = 60, cw = W / cols, rh = (Hh - top0) / rows;
    const binW = Math.min(cw * 0.62, rh * 0.75, 220), binH = binW * 0.72, sw = binW * 0.85, sh = sw * 0.75;
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
        const top = b.by - binH - sh * 0.75 * b.up;
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
        if (b.who) draw(ctx, b.who === "coon" ? coon : kalle, b.cx - sw / 2, b.by - binH - sh * 0.75 * b.up + sh * 0.2, sw, sh);
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
    const U = Math.min(Math.max(W, Hh * 0.9), Hh * 1.6);
    const ground = Hh * 0.8, pw = U * 0.085, ph = pw * 1.25, px = W * 0.14;
    const peng = sprite({ sp: "pinguin", col: 1, acc: "muetze" }, Math.round(pw * 2));
    const bg = layer(W, Hh, dpr, (x) => {
      const g = x.createLinearGradient(0, 0, 0, Hh); g.addColorStop(0, "#c9e6f7"); g.addColorStop(1, "#f4fbff"); x.fillStyle = g; x.fillRect(0, 0, W, Hh);
      x.fillStyle = "#fff"; x.fillRect(0, ground, W, Hh - ground);
    });
    const hillW = U * 0.5, hillH = Hh * 0.2;
    const hills = layer(hillW * 4, hillH, dpr, (x) => { x.fillStyle = "#e3f3fb"; for (let i = 0; i < 4; i++) { x.beginPath(); x.ellipse(i * hillW + hillW / 2, hillH, hillW * 0.55, hillH * 0.6, 0, Math.PI, 0); x.fill(); } });
    let y = ground - ph, vy = 0, onGround = true, speed = 0, dist = 0, fish = 0, obs = [], fishes = [], next = 1.2, nextFish = 2, t = 0, ended = false;
    const G = Hh * 2.6, JUMP = Hh * 1.32;
    const jump = () => { if (onGround && !ended) { vy = -JUMP; onGround = false; H.sfx.tone(520, 0.1, "triangle", 0.12, 820); } };
    const kd = (e) => { if (e.key === " " || e.key === "ArrowUp") { e.preventDefault(); jump(); } };
    const pd = (e) => { e.preventDefault(); jump(); };
    document.addEventListener("keydown", kd); cv.addEventListener("pointerdown", pd);
    const hit = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
    const stopLoop = loop((dt) => {
      if (!ended) {
        t += dt; speed = U * (0.5 + t * 0.014); dist += speed * dt;
        vy += G * dt; y += vy * dt;
        if (y >= ground - ph) { y = ground - ph; vy = 0; onGround = true; }
        next -= dt; nextFish -= dt;
        if (next <= 0) { const snow = Math.random() < 0.35; obs.push(snow ? { x: W + 20, w: U * 0.06, h: U * 0.1, kind: "snow" } : { x: W + 20, w: U * (0.05 + Math.random() * 0.04), h: U * (0.045 + Math.random() * 0.03), kind: "ice" }); next = Math.max(0.6, (1.5 - t * 0.012) * (0.7 + Math.random() * 0.8)); }
        if (nextFish <= 0) { fishes.push({ x: W + 20, y: ground - ph - Hh * (0.12 + Math.random() * 0.22) }); nextFish = 1.6 + Math.random() * 2.2; }
        for (const o of obs) o.x -= speed * dt;
        for (const f of fishes) f.x -= speed * dt;
        obs = obs.filter((o) => o.x > -80);
        const me = { x: px + pw * 0.2, y: y + ph * 0.15, w: pw * 0.6, h: ph * 0.8 };
        if (obs.some((o) => hit(me, { x: o.x + 3, y: ground - o.h + 3, w: o.w - 6, h: o.h }))) { ended = true; H.sfx.bad(); setTimeout(() => over(Math.floor(dist / 10) + fish * 25), 400); }
        fishes = fishes.filter((f) => { if (hit(me, { x: f.x - 14, y: f.y - 8, w: 28, h: 16 })) { fish++; H.sfx.pop(); return false; } return f.x > -40; });
      }
      ctx.drawImage(bg, 0, 0, W, Hh);
      const off = (dist * 0.2) % (hillW * 4);
      ctx.drawImage(hills, -off, ground - hillH, hillW * 4, hillH); ctx.drawImage(hills, hillW * 4 - off, ground - hillH, hillW * 4, hillH);
      ctx.strokeStyle = "#cfe6f2"; ctx.lineWidth = 2; ctx.beginPath(); for (let i = 0; i < 14; i++) { const lx = W - ((dist + i * 90) % (W + 90)), ly = ground + 14 + (i % 3) * 10; ctx.moveTo(lx, ly); ctx.lineTo(lx + 30, ly); } ctx.stroke();
      for (const o of obs) {
        if (o.kind === "ice") { ctx.fillStyle = "#a9dcf2"; ctx.fillRect(o.x, ground - o.h, o.w, o.h); ctx.fillStyle = "#d8f1fb"; ctx.fillRect(o.x + 4, ground - o.h + 4, o.w * 0.35, o.h * 0.4); }
        else { ctx.fillStyle = "#fff"; ctx.strokeStyle = "#cfe0ea"; ctx.beginPath(); ctx.arc(o.x + o.w / 2, ground - o.h * 0.3, o.w * 0.55, 0, 7); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.arc(o.x + o.w / 2, ground - o.h * 0.78, o.w * 0.38, 0, 7); ctx.fill(); ctx.stroke(); ctx.fillStyle = "#f39c32"; ctx.beginPath(); ctx.moveTo(o.x + o.w / 2, ground - o.h * 0.78); ctx.lineTo(o.x + o.w / 2 - 10, ground - o.h * 0.75); ctx.lineTo(o.x + o.w / 2, ground - o.h * 0.72); ctx.fill(); }
      }
      ctx.fillStyle = "#7d93b2";
      for (const f of fishes) { ctx.beginPath(); ctx.ellipse(f.x, f.y, 14, 7, 0, 0, 7); ctx.moveTo(f.x + 12, f.y); ctx.lineTo(f.x + 22, f.y - 7); ctx.lineTo(f.x + 22, f.y + 7); ctx.fill(); }
      ctx.save(); ctx.translate(px + pw / 2, y + ph / 2); ctx.rotate(onGround ? 0 : -0.2); draw(ctx, peng, -pw / 2, -ph / 2, pw, ph); ctx.restore();
      ctx.fillStyle = "#3b4f8a"; ctx.font = "700 24px Fredoka, Arial, sans-serif"; ctx.fillText(`${Math.floor(dist / 10) + fish * 25}`, 16, 34);
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
