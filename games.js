/* =========================================================
   Spielecke – zwei kleine Spiele.
   Geheim: Neue Rekorde und bestimmte Punktzahlen bringen Taler.
   (Davon steht im Spiel nichts – erst nach der Runde gibt's die Überraschung.)
   ========================================================= */
const Games = (() => {
  let H;
  const RULES = {
    turm: { min: 5, per: 2, ms: [15, 30, 50] },
    waschbaer: { min: 10, per: 3, ms: [40, 80, 150] },
    pinguin: { min: 100, per: 40, ms: [500, 1000, 2000] },
  };
  const ok = (img) => img.complete && img.naturalWidth > 0;
  const sprite = (v, w) => { const img = new Image(); img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(Animals.svg(v, { width: w })); return img; };

  function open() {
    const ov = H.el("div", { class: "gehege-overlay games-overlay", role: "dialog", "aria-label": "Spielecke" });
    let stop = () => {};
    const close = () => { stop(); ov.remove(); document.body.style.overflow = ""; document.removeEventListener("keydown", esc); };
    const esc = (e) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", esc);
    const area = H.el("div", { class: "g-area" });
    ov.append(H.el("div", { class: "g-head" }, H.el("div", {}, H.el("h2", { text: "Spielecke" }), H.el("div", { class: "g-sub", text: "Eine kleine Pause vom Gehege-Alltag." })),
      H.el("button", { class: "modal-close", "aria-label": "Schließen", text: "✖", onclick: close })), area);
    const menu = () => {
      stop(); area.innerHTML = "";
      const card = (id, title, text, art, play) => H.el("div", { class: "game-card" },
        H.el("div", { class: "game-art", html: Animals.svg(art, { fit: true, walk: true }) }),
        H.el("h3", { text: title }), H.el("p", { text }),
        H.el("div", { class: "game-high", text: `Rekord: ${Zoo.high(id)}` }),
        H.el("button", { class: "btn btn-green", text: "Spielen", onclick: play }));
      area.append(H.el("div", { class: "game-menu" },
        card("turm", "Heuballen-Turm", "Schaf Leo will ganz hoch hinaus. Tippe, um den schwingenden Heuballen fallen zu lassen. Was übersteht, fällt herunter – also genau zielen!", { sp: "schaf", col: 0, acc: "muetze" }, () => play(turm, "turm")),
        card("waschbaer", "Waschbär-Alarm", "Die Waschbären plündern die Keksdosen! Tippe sie an, bevor sie mit einem Keks entwischen. Aber Vorsicht: Manchmal schaut auch Kalle heraus.", { sp: "waschbaer", col: 0, acc: "krone" }, () => play(waschbaer, "waschbaer")),
        card("pinguin", "Pinguin-Rutsche", "Erna rutscht auf dem Bauch übers Eis. Tippe zum Springen, weich Eisblöcken und Schneemännern aus und schnapp dir die Fische.", { sp: "pinguin", col: 1, acc: "muetze" }, () => play(pinguin, "pinguin"))));
    };
    const play = (game, id) => {
      stop(); area.innerHTML = "";
      const wrap = H.el("div", { class: "game-wrap" });
      const cv = H.el("canvas", { class: "game-canvas" });
      const panel = H.el("div", { class: "game-panel" });
      wrap.append(cv, panel);
      area.append(H.el("div", { class: "row", style: "margin-bottom:10px" }, H.el("button", { class: "btn btn-soft", text: "← Zurück zur Spielecke", onclick: menu })), wrap);
      const W = Math.min(760, area.clientWidth - 40), Hh = Math.round(Math.max(300, Math.min(W * 0.62, innerHeight - 220)));
      const dpr = Math.min(2, devicePixelRatio || 1);
      cv.width = W * dpr; cv.height = Hh * dpr; cv.style.width = W + "px"; cv.style.height = Hh + "px";
      const ctx = cv.getContext("2d"); ctx.scale(dpr, dpr);
      const startPanel = () => {
        panel.innerHTML = ""; panel.classList.remove("hidden");
        panel.append(H.el("b", { text: "Bereit?" }), H.el("span", { text: { pinguin: "Tippen, Klicken oder Leertaste zum Springen.", turm: "Tippen, Klicken oder Leertaste lässt den Heuballen fallen.", waschbaer: "Tippe die Waschbären an – aber nicht Kalle!" }[id] }),
          H.el("button", { class: "btn btn-green", text: "Los geht's!", onclick: () => { panel.classList.add("hidden"); stop = game(cv, ctx, W, Hh, over); } }));
      };
      const over = (score) => {
        stop();
        const res = Zoo.gameResult(id, score, RULES[id]);
        panel.innerHTML = ""; panel.classList.remove("hidden");
        panel.append(H.el("b", { text: score > res.old ? "Neuer Rekord!" : "Vorbei!" }), H.el("span", { class: "game-score", text: `${score} ${score === 1 ? "Punkt" : "Punkte"}` }), H.el("span", { text: `Rekord: ${res.high}` }));
        if (res.coins) {
          panel.append(H.el("div", { class: "game-secret" }, H.el("b", { text: "Überraschung!" }), H.el("span", { text: `Kalle ist so beeindruckt, dass er dir ${res.coins} Taler schenkt.` })));
          const r = panel.getBoundingClientRect();
          setTimeout(() => { Zoo.addCoins(res.coins, { x: r.left + r.width / 2, y: r.top + r.height / 2 }); H.sfx.win(); H.confetti(["✨", "⭐", "💛"], 40); }, 400);
        }
        panel.append(H.el("div", { class: "row" }, H.el("button", { class: "btn btn-green", text: "Nochmal", onclick: () => { panel.classList.add("hidden"); stop = game(cv, ctx, W, Hh, over); } }), H.el("button", { class: "btn btn-soft", text: "Spielecke", onclick: menu })));
      };
      // Vorschau-Bild
      ctx.fillStyle = "#dff1fb"; ctx.fillRect(0, 0, W, Hh);
      startPanel();
    };
    document.body.append(ov); document.body.style.overflow = "hidden";
    menu();
  }

  /* ---------- Spiel 1: Heuballen-Turm ---------- */
  function turm(cv, ctx, W, Hh, over) {
    const sheep = sprite({ sp: "schaf", col: 0, acc: "muetze" }, 160);
    const bh = Math.round(Hh * 0.075), baseW = W * 0.42, groundY = Hh - 26;
    let stack = [{ x: (W - baseW) / 2, w: baseW }], cur, falling = [], score = 0, cam = 0, camT = 0, last = 0, raf, alive = true, done = false, perfectT = 0, combo = 0;
    const topY = (i) => groundY - (i + 1) * bh;
    const newBlock = () => { const top = stack[stack.length - 1]; const sp = W * (0.36 + Math.min(0.9, stack.length * 0.035)); const left = Math.random() < 0.5; cur = { x: left ? 0 : W - top.w, w: top.w, dir: left ? 1 : -1, speed: sp }; };
    newBlock();
    const drop = () => {
      if (done) return;
      const top = stack[stack.length - 1];
      let l = Math.max(cur.x, top.x), r = Math.min(cur.x + cur.w, top.x + top.w);
      if (r - l <= 2) { falling.push({ x: cur.x, w: cur.w, y: topY(stack.length), vy: 0 }); done = true; H.sfx.bad(); setTimeout(() => { alive = false; over(score); }, 900); return; }
      if (Math.abs(cur.x - top.x) < 5) { l = top.x; r = top.x + top.w; perfectT = 0.8; combo++; score += 1; H.sfx.tone(880 + combo * 60, 0.15, "triangle", 0.15); }
      else { combo = 0; H.sfx.tone(420, 0.08, "sine", 0.14, 300); if (cur.x < l) falling.push({ x: cur.x, w: l - cur.x, y: topY(stack.length), vy: 0 }); if (cur.x + cur.w > r) falling.push({ x: r, w: cur.x + cur.w - r, y: topY(stack.length), vy: 0 }); }
      stack.push({ x: l, w: r - l }); score++;
      camT = Math.max(0, (stack.length - 5) * bh);
      newBlock();
    };
    const pd = (e) => { e.preventDefault(); drop(); };
    const kd = (e) => { if (e.key === " " || e.key === "ArrowDown") { e.preventDefault(); drop(); } };
    cv.addEventListener("pointerdown", pd); document.addEventListener("keydown", kd);
    const bale = (x, y, w) => {
      ctx.fillStyle = "#e8c46b"; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x, y, w, bh - 2, 6) : ctx.rect(x, y, w, bh - 2); ctx.fill();
      ctx.strokeStyle = "#c9a03d"; ctx.lineWidth = 2; for (let k = 1; k < 3; k++) { ctx.beginPath(); ctx.moveTo(x + 4, y + (k * (bh - 2)) / 3); ctx.lineTo(x + w - 4, y + (k * (bh - 2)) / 3); ctx.stroke(); }
      ctx.fillStyle = "#d9534f"; if (w > 24) { ctx.fillRect(x + w * 0.25, y, 4, bh - 2); ctx.fillRect(x + w * 0.75 - 4, y, 4, bh - 2); }
    };
    const loop = (ts) => {
      if (!alive) return;
      const dt = Math.min(0.05, (ts - (last || ts)) / 1000); last = ts;
      if (!done) { cur.x += cur.dir * cur.speed * dt; if (cur.x > W - cur.w) cur.dir = -1; if (cur.x < 0) cur.dir = 1; }
      cam += (camT - cam) * Math.min(1, dt * 5);
      falling.forEach((f) => { f.vy += Hh * 2.4 * dt; f.y += f.vy * dt; });
      falling = falling.filter((f) => f.y < Hh + cam + 60);
      const g = ctx.createLinearGradient(0, 0, 0, Hh); g.addColorStop(0, "#9fd0ef"); g.addColorStop(1, "#e9f6ff"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, Hh);
      ctx.fillStyle = "rgba(255,255,255,.8)"; [[0.2, 0.18], [0.7, 0.12], [0.45, 0.3]].forEach(([cx, cy]) => { ctx.beginPath(); ctx.ellipse(cx * W, cy * Hh + cam * 0.3, 50, 16, 0, 0, 7); ctx.fill(); });
      ctx.save(); ctx.translate(0, cam);
      ctx.fillStyle = "#a8d78f"; ctx.fillRect(0, groundY, W, 400);
      stack.forEach((b, i) => bale(b.x, topY(i), b.w));
      falling.forEach((f) => bale(f.x, f.y, f.w));
      const top = stack[stack.length - 1];
      if (ok(sheep)) { const sw = Math.min(top.w * 0.9, W * 0.13), sh = sw * 0.76; ctx.drawImage(sheep, top.x + top.w / 2 - sw / 2, topY(stack.length - 1) - sh + 4, sw, sh); }
      if (!done) bale(cur.x, topY(stack.length) - (bh * 1.2), cur.w);
      ctx.restore();
      if (perfectT > 0) { perfectT -= dt; ctx.fillStyle = `rgba(232,93,117,${Math.min(1, perfectT * 2)})`; ctx.font = "700 26px Fredoka, Arial, sans-serif"; ctx.textAlign = "center"; ctx.fillText(combo > 1 ? `Perfekt! ×${combo}` : "Perfekt!", W / 2, Hh * 0.22); ctx.textAlign = "left"; }
      ctx.fillStyle = "#5a3b2e"; ctx.font = "700 20px Fredoka, Arial, sans-serif"; ctx.fillText(`${score}`, 14, 30);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { alive = false; cancelAnimationFrame(raf); cv.removeEventListener("pointerdown", pd); document.removeEventListener("keydown", kd); };
  }

  /* ---------- Spiel 3: Waschbär-Alarm ---------- */
  function waschbaer(cv, ctx, W, Hh, over) {
    const coon = sprite({ sp: "waschbaer", col: 0, acc: "" }, 160), kalle = sprite({ sp: "capy", col: 0, acc: "orange" }, 160);
    const cols = 3, rows = 2, cw = W / cols, rh = (Hh - 50) / rows;
    const bins = Array.from({ length: cols * rows }, (_, i) => ({ cx: cw * (i % cols) + cw / 2, by: 50 + rh * (Math.floor(i / cols) + 1) - 12, who: null, t: 0, up: 0, hit: 0 }));
    const binW = Math.min(cw * 0.62, 150), binH = binW * 0.72;
    let score = 0, cookies = 5, t = 0, spawn = 0.6, last = 0, raf, alive = true, msg = null;
    const pd = (e) => {
      e.preventDefault();
      const r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      bins.forEach((b) => {
        if (!b.who || b.hit) return;
        const top = b.by - binH - binW * 0.62 * b.up;
        if (Math.abs(x - b.cx) < binW * 0.5 && y > top && y < b.by) {
          b.hit = 0.35;
          if (b.who === "coon") { score++; H.sfx.pop(); msg = { text: H.pick(["Erwischt!", "Hab dich!", "Keks gerettet!", "Zack!", "Nix da!"]), x: b.cx, y: top, t: 0.7 }; }
          else { cookies--; H.sfx.bad(); msg = { text: "Aua! Das war Kalle!", x: b.cx, y: top, t: 1 }; if (cookies <= 0) end(); }
        }
      });
    };
    cv.addEventListener("pointerdown", pd);
    const end = () => { if (!alive) return; alive = false; setTimeout(() => over(score), 500); };
    const loop = (ts) => {
      if (!alive) return;
      const dt = Math.min(0.05, (ts - (last || ts)) / 1000); last = ts; t += dt;
      spawn -= dt;
      if (spawn <= 0) {
        spawn = Math.max(0.38, 1.0 - t * 0.012);
        const free = bins.filter((b) => !b.who);
        if (free.length) { const b = H.pick(free); b.who = Math.random() < 0.16 ? "kalle" : "coon"; b.t = Math.max(0.75, 1.6 - t * 0.012); b.up = 0; b.hit = 0; }
      }
      bins.forEach((b) => {
        if (!b.who) return;
        if (b.hit > 0) { b.hit -= dt; b.up = Math.max(0, b.up - dt * 5); if (b.hit <= 0) b.who = null; return; }
        b.t -= dt; b.up = Math.min(1, b.up + dt * 6);
        if (b.t <= 0) { if (b.who === "coon") { cookies--; H.sfx.tone(260, 0.2, "sawtooth", 0.06, 180); msg = { text: "Keks weg!", x: b.cx, y: b.by - binH - 40, t: 0.8 }; if (cookies <= 0) end(); } b.who = null; }
      });
      // Zeichnen
      const g = ctx.createLinearGradient(0, 0, 0, Hh); g.addColorStop(0, "#c98f74"); g.addColorStop(1, "#b47a60"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, Hh);
      ctx.strokeStyle = "rgba(0,0,0,.08)"; ctx.lineWidth = 2; for (let y = 20; y < Hh; y += 24) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      bins.forEach((b) => {
        if (b.who) { const img = b.who === "coon" ? coon : kalle; const sw = binW * 0.85, sh = sw * (b.who === "coon" ? 0.75 : 0.75); if (ok(img)) ctx.drawImage(img, b.cx - sw / 2, b.by - binH - sh * 0.75 * b.up + sh * 0.2, sw, sh); }
        ctx.fillStyle = "#8c96a3"; ctx.beginPath(); ctx.moveTo(b.cx - binW / 2, b.by - binH); ctx.lineTo(b.cx + binW / 2, b.by - binH); ctx.lineTo(b.cx + binW * 0.42, b.by); ctx.lineTo(b.cx - binW * 0.42, b.by); ctx.fill();
        ctx.strokeStyle = "#76808d"; ctx.lineWidth = 4; [-0.22, 0, 0.22].forEach((k) => { ctx.beginPath(); ctx.moveTo(b.cx + k * binW, b.by - binH + 8); ctx.lineTo(b.cx + k * binW * 0.85, b.by - 6); ctx.stroke(); });
        ctx.fillStyle = "#9aa4b1"; ctx.fillRect(b.cx - binW * 0.55, b.by - binH - 8, binW * 1.1, 10);
      });
      if (msg && msg.t > 0) { msg.t -= dt; ctx.fillStyle = `rgba(255,255,255,${Math.min(1, msg.t * 2)})`; ctx.font = "700 18px Fredoka, Arial, sans-serif"; ctx.textAlign = "center"; ctx.fillText(msg.text, msg.x, msg.y); ctx.textAlign = "left"; }
      ctx.fillStyle = "#fff"; ctx.font = "700 20px Fredoka, Arial, sans-serif"; ctx.fillText(`${score}`, 14, 30);
      for (let i = 0; i < 5; i++) { ctx.fillStyle = i < cookies ? "#d9a05c" : "rgba(255,255,255,.25)"; ctx.beginPath(); ctx.arc(W - 22 - i * 26, 24, 10, 0, 7); ctx.fill(); if (i < cookies) { ctx.fillStyle = "#8a5a33"; ctx.beginPath(); ctx.arc(W - 25 - i * 26, 21, 2, 0, 7); ctx.arc(W - 19 - i * 26, 27, 2, 0, 7); ctx.fill(); } }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { alive = false; cancelAnimationFrame(raf); cv.removeEventListener("pointerdown", pd); };
  }

  /* ---------- Spiel 2: Pinguin-Rutsche ---------- */
  function pinguin(cv, ctx, W, Hh, over) {
    const peng = sprite({ sp: "pinguin", col: 1, acc: "muetze" }, 160);
    const ground = Hh * 0.8, pw = W * 0.1, ph = pw * 1.25, px = W * 0.14;
    let y = ground - ph, vy = 0, onGround = true, speed = W * 0.42, dist = 0, fish = 0, obs = [], fishes = [], next = 1.2, nextFish = 2, last = 0, raf, alive = true, t = 0;
    const G = Hh * 2.6, JUMP = Hh * 1.32;
    const jump = () => { if (onGround) { vy = -JUMP; onGround = false; H.sfx.tone(520, 0.1, "triangle", 0.12, 820); } };
    const kd = (e) => { if (e.key === " " || e.key === "ArrowUp") { e.preventDefault(); jump(); } };
    const pd = (e) => { e.preventDefault(); jump(); };
    document.addEventListener("keydown", kd); cv.addEventListener("pointerdown", pd);
    const hit = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
    const loop = (ts) => {
      if (!alive) return;
      const dt = Math.min(0.05, (ts - (last || ts)) / 1000); last = ts; t += dt;
      speed = W * (0.42 + t * 0.012);
      dist += speed * dt;
      vy += G * dt; y += vy * dt;
      if (y >= ground - ph) { y = ground - ph; vy = 0; onGround = true; }
      next -= dt; nextFish -= dt;
      if (next <= 0) { const snow = Math.random() < 0.35; obs.push(snow ? { x: W + 20, w: W * 0.06, h: W * 0.1, kind: "snow" } : { x: W + 20, w: W * (0.05 + Math.random() * 0.04), h: W * (0.045 + Math.random() * 0.03), kind: "ice" }); next = Math.max(0.65, (1.5 - t * 0.012) * (0.7 + Math.random() * 0.8)); }
      if (nextFish <= 0) { fishes.push({ x: W + 20, y: ground - ph - Hh * (0.12 + Math.random() * 0.22) }); nextFish = 1.6 + Math.random() * 2.2; }
      obs.forEach((o) => (o.x -= speed * dt)); fishes.forEach((f) => (f.x -= speed * dt));
      obs = obs.filter((o) => o.x > -80);
      const me = { x: px + pw * 0.2, y: y + ph * 0.15, w: pw * 0.6, h: ph * 0.8 };
      if (obs.some((o) => hit(me, { x: o.x + 3, y: ground - o.h + 3, w: o.w - 6, h: o.h }))) { alive = false; H.sfx.bad(); setTimeout(() => over(Math.floor(dist / 10) + fish * 25), 400); }
      fishes = fishes.filter((f) => { if (hit(me, { x: f.x - 14, y: f.y - 8, w: 28, h: 16 })) { fish++; H.sfx.pop(); return false; } return f.x > -40; });
      // Zeichnen
      const g = ctx.createLinearGradient(0, 0, 0, Hh); g.addColorStop(0, "#c9e6f7"); g.addColorStop(1, "#f4fbff"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, Hh);
      ctx.fillStyle = "#e3f3fb"; for (let i = 0; i < 4; i++) { const hx = ((i * 260 - (dist * 0.2) % 260) + 1040) % 1040 - 100; ctx.beginPath(); ctx.ellipse(hx, ground, 140, 60, 0, Math.PI, 0); ctx.fill(); }
      ctx.fillStyle = "#fff"; ctx.fillRect(0, ground, W, Hh - ground);
      ctx.strokeStyle = "#cfe6f2"; ctx.lineWidth = 2; for (let i = 0; i < 12; i++) { const lx = W - ((dist * 1 + i * 90) % (W + 90)); ctx.beginPath(); ctx.moveTo(lx, ground + 14 + (i % 3) * 10); ctx.lineTo(lx + 30, ground + 14 + (i % 3) * 10); ctx.stroke(); }
      obs.forEach((o) => {
        if (o.kind === "ice") { ctx.fillStyle = "#a9dcf2"; ctx.fillRect(o.x, ground - o.h, o.w, o.h); ctx.fillStyle = "#d8f1fb"; ctx.fillRect(o.x + 4, ground - o.h + 4, o.w * 0.35, o.h * 0.4); }
        else { ctx.fillStyle = "#fff"; ctx.strokeStyle = "#cfe0ea"; ctx.beginPath(); ctx.arc(o.x + o.w / 2, ground - o.h * 0.3, o.w * 0.55, 0, 7); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.arc(o.x + o.w / 2, ground - o.h * 0.78, o.w * 0.38, 0, 7); ctx.fill(); ctx.stroke(); ctx.fillStyle = "#f39c32"; ctx.beginPath(); ctx.moveTo(o.x + o.w / 2, ground - o.h * 0.78); ctx.lineTo(o.x + o.w / 2 - 10, ground - o.h * 0.75); ctx.lineTo(o.x + o.w / 2, ground - o.h * 0.72); ctx.fill(); }
      });
      fishes.forEach((f) => { ctx.fillStyle = "#7d93b2"; ctx.beginPath(); ctx.ellipse(f.x, f.y, 14, 7, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.moveTo(f.x + 12, f.y); ctx.lineTo(f.x + 22, f.y - 7); ctx.lineTo(f.x + 22, f.y + 7); ctx.fill(); });
      if (ok(peng)) { ctx.save(); ctx.translate(px + pw / 2, y + ph / 2); ctx.rotate(onGround ? 0 : -0.2); ctx.drawImage(peng, -pw / 2, -ph / 2, pw, ph); ctx.restore(); }
      ctx.fillStyle = "#3b4f8a"; ctx.font = "700 20px Fredoka, Arial, sans-serif"; ctx.fillText(`${Math.floor(dist / 10) + fish * 25}`, 14, 30);
      if (alive) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { alive = false; cancelAnimationFrame(raf); document.removeEventListener("keydown", kd); cv.removeEventListener("pointerdown", pd); };
  }

  function init() {
    H = App.h;
    document.getElementById("games-btn")?.addEventListener("click", (e) => { e.stopPropagation(); H.sfx.boop(640); open(); });
    document.getElementById("hunger-pill")?.addEventListener("click", (e) => { e.stopPropagation(); Animals.openGehege(); });
  }
  return { init, open };
})();
