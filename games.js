/* =========================================================
   Spielecke – zwei kleine Spiele.
   Geheim: Neue Rekorde und bestimmte Punktzahlen bringen Taler.
   (Davon steht im Spiel nichts – erst nach der Runde gibt's die Überraschung.)
   ========================================================= */
const Games = (() => {
  let H;
  const RULES = {
    mandarinen: { min: 5, per: 3, ms: [30, 60, 100] },
    pinguin: { min: 100, per: 40, ms: [500, 1000, 2000] },
  };
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
        card("mandarinen", "Mandarinen-Regen", "Kalle liebt Mandarinen! Fang so viele wie möglich – aber Vorsicht vor den Schneebällen. Goldene Mandarinen zählen fünffach.", { sp: "capy", col: 0, acc: "orange" }, () => play(mandarinen, "mandarinen")),
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
        panel.append(H.el("b", { text: "Bereit?" }), H.el("span", { text: id === "pinguin" ? "Tippen, Klicken oder Leertaste zum Springen." : "Bewege Kalle mit dem Finger, der Maus oder den Pfeiltasten." }),
          H.el("button", { class: "btn btn-green", text: "Los geht's!", onclick: () => { panel.classList.add("hidden"); stop = game(cv, ctx, W, Hh, over); } }));
      };
      const over = (score) => {
        stop();
        const res = Zoo.gameResult(id, score, RULES[id]);
        panel.innerHTML = ""; panel.classList.remove("hidden");
        panel.append(H.el("b", { text: score > res.old ? "Neuer Rekord!" : "Vorbei!" }), H.el("span", { class: "game-score", text: `${score} Punkte` }), H.el("span", { text: `Rekord: ${res.high}` }));
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

  /* ---------- Spiel 1: Mandarinen-Regen ---------- */
  function mandarinen(cv, ctx, W, Hh, over) {
    const capy = sprite({ sp: "capy", col: 0, acc: "" }, 200);
    const pw = W * 0.17, ph = pw * 0.75, py = Hh - ph - 14;
    let px = W / 2, keys = 0, items = [], score = 0, lives = 3, t = 0, spawn = 0, last = 0, raf, alive = true, flash = 0;
    const move = (e) => { const r = cv.getBoundingClientRect(); px = Math.max(pw / 2, Math.min(W - pw / 2, e.clientX - r.left)); };
    cv.addEventListener("pointermove", move); cv.addEventListener("pointerdown", move);
    const kd = (e) => { if (e.key === "ArrowLeft") keys = -1; if (e.key === "ArrowRight") keys = 1; };
    const ku = (e) => { if (e.key === "ArrowLeft" || e.key === "ArrowRight") keys = 0; };
    document.addEventListener("keydown", kd); document.addEventListener("keyup", ku);
    const orange = (x, y, r, gold) => {
      ctx.fillStyle = gold ? "#ffd84d" : "#ff9f1c"; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
      ctx.fillStyle = gold ? "#fff6c9" : "#ffc46b"; ctx.beginPath(); ctx.arc(x - r * 0.35, y - r * 0.35, r * 0.28, 0, 7); ctx.fill();
      ctx.fillStyle = "#4caf50"; ctx.beginPath(); ctx.ellipse(x + r * 0.3, y - r * 0.95, r * 0.45, r * 0.2, -0.5, 0, 7); ctx.fill();
      if (gold) { ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + r + 4, y - r); ctx.lineTo(x + r + 10, y - r - 6); ctx.stroke(); }
    };
    const loop = (ts) => {
      if (!alive) return;
      const dt = Math.min(0.05, (ts - (last || ts)) / 1000); last = ts; t += dt;
      px = Math.max(pw / 2, Math.min(W - pw / 2, px + keys * W * 0.9 * dt));
      spawn -= dt;
      if (spawn <= 0) {
        spawn = Math.max(0.32, 0.9 - t * 0.012);
        const rnd = Math.random(), snowP = Math.min(0.32, 0.14 + t * 0.003);
        items.push({ x: 20 + Math.random() * (W - 40), y: -20, vy: Hh * (0.36 + t * 0.006) * (0.85 + Math.random() * 0.3), type: rnd < snowP ? "snow" : rnd < snowP + 0.05 ? "gold" : "orange", r: W * 0.026 });
      }
      items = items.filter((it) => {
        it.y += it.vy * dt;
        if (it.y > py + ph * 0.15 && it.y < py + ph * 0.7 && Math.abs(it.x - px) < pw * 0.48) {
          if (it.type === "snow") { lives--; flash = 0.3; H.sfx.bad(); if (lives <= 0) { alive = false; setTimeout(() => over(score), 300); } }
          else { score += it.type === "gold" ? 5 : 1; H.sfx.pop(); }
          return false;
        }
        return it.y < Hh + 30;
      });
      // Zeichnen
      const g = ctx.createLinearGradient(0, 0, 0, Hh); g.addColorStop(0, "#bfe3f7"); g.addColorStop(1, "#eef8ff"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, Hh);
      ctx.fillStyle = "#fff"; ctx.fillRect(0, Hh - 20, W, 20);
      items.forEach((it) => { if (it.type === "snow") { ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(it.x, it.y, it.r * 1.1, 0, 7); ctx.fill(); ctx.strokeStyle = "#b9d4e6"; ctx.lineWidth = 2; ctx.stroke(); } else orange(it.x, it.y, it.r, it.type === "gold"); });
      if (capy.complete) ctx.drawImage(capy, px - pw / 2, py, pw, ph);
      if (flash > 0) { flash -= dt; ctx.fillStyle = `rgba(255,255,255,${flash * 2})`; ctx.fillRect(0, 0, W, Hh); }
      ctx.fillStyle = "#5a3b2e"; ctx.font = "700 20px Fredoka, Arial, sans-serif"; ctx.fillText(`${score}`, 14, 30);
      for (let i = 0; i < 3; i++) { ctx.fillStyle = i < lives ? "#e85d75" : "#e7d5cc"; ctx.font = "22px Arial"; ctx.fillText("♥", W - 32 - i * 26, 30); }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { alive = false; cancelAnimationFrame(raf); document.removeEventListener("keydown", kd); document.removeEventListener("keyup", ku); cv.removeEventListener("pointermove", move); cv.removeEventListener("pointerdown", move); };
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
      if (peng.complete) { ctx.save(); ctx.translate(px + pw / 2, y + ph / 2); ctx.rotate(onGround ? 0 : -0.2); ctx.drawImage(peng, -pw / 2, -ph / 2, pw, ph); ctx.restore(); }
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
