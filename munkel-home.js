/* ============================================================
   Munkel & Lotte nach dem Öffnen des Schlosses
   - wohnen mit ihrem Nest oben neben dem Adventskranz
   - antippbar, schlafen nachts (an Silvester bleiben sie wach)
   - kleiner Knopf zum Szenen-Album (Szenen laufen im "Kino")
   - an besonderen Tagen einmal am Tag ein kleines Special
   ============================================================ */
const MunkelHome = (() => {
  const KEY = "mama-munkel-home-" + (typeof CONFIG !== "undefined" ? CONFIG.year : "2026");
  let st = { done: {} };
  try { st = Object.assign(st, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} };
  let H, box, munkel, lotte, zzz, sleeping = false, busy = false, li = 0, special = null;

  const PARTY = `<path d="M56 19 L70 -16 L84 19Z" fill="#58b6ff"/><path d="M59.5 11 H80.5 M63.5 1 H76.5 M66.5 -7 H73.5" stroke="#ffd84d" stroke-width="3" stroke-linecap="round"/><circle cx="70" cy="-17" r="5" fill="#ff5a7a"/><rect x="54" y="15" width="32" height="6" rx="3" fill="#ff5a7a"/>`;
  const dkey = (d = new Date()) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

  /* ---------- Besondere Tage ---------- */
  function specialOf(d = new Date()) {
    const y = typeof CONFIG !== "undefined" ? CONFIG.year : 2026;
    const m = d.getMonth(), day = d.getDate(), yr = d.getFullYear();
    const advent = (n) => ({ key: `advent${n}`, lines: [["m", `Heute ist der ${n}. Advent, Ute! ${["Die erste", "Die zweite", "Die dritte", "Die vierte"][n - 1]} Kerze brennt.`], ["l", n === 4 ? "Alle vier Kerzen! Bald ist Weihnachten!" : "Wie gemütlich es hier ist."]], fx: "candle" });
    if (yr === y && m === 10 && day === 29) return advent(1);
    if (yr === y && m === 11) {
      if (day === 1) return { key: "tuer1", lines: [["m", "Das erste Türchen ist offen! Viel Spaß beim Rätseln, Ute!"], ["l", "Wir drücken dir alle Daumen – äh, Flügel!"]], fx: "confetti" };
      if (day === 6) return { key: "nikolaus", hat: "weihnachten", mateHat: "weihnachten", lines: [["m", "Ho ho ho! Frohen Nikolaus, Ute!"], ["l", "Und heute ist auch noch der 2. Advent!"]], fx: "gift" };
      if (day === 13) return advent(3);
      if (day === 18) return { key: "paket", lines: [["m", "Psst … wir haben was gemunkelt gehört: Heute kommt ein riesiges Paket!"], ["l", "Ich bin so gespannt, was drin ist!"]], fx: "sparkle" };
      if (day === 20) return advent(4);
      if (day === 24) return { key: "heiligabend", hat: "weihnachten", mateHat: "weihnachten", lines: [["m", "Frohe Weihnachten, Ute! ♪ Stille Nacht, heilige Nacht … ♪"], ["l", "Danke, dass wir bei dir wohnen dürfen. Wir haben dich lieb!"]], fx: "xmas" };
      if (day === 25 || day === 26) return { key: "weihnachten" + day, hat: "weihnachten", mateHat: "weihnachten", lines: [["m", `Frohe Weihnachten! Heute ist der ${day === 25 ? "erste" : "zweite"} Weihnachtstag.`], ["l", day === 25 ? "Ich hab noch ein Plätzchen übrig – willst du?" : "Noch mehr Weihnachten – herrlich!"]], fx: "snow" };
      if (day === 31) return { key: "silvester", hat: "party", mateHat: "party", lines: [["m", "Guten Rutsch, Ute! Heute bleiben wir bis Mitternacht wach!"], ["l", "Ich hab mich schon ganz schick gemacht!"]], fx: "fireworks" };
    }
    if (yr === y + 1 && m === 0 && day === 1) return { key: "neujahr", hat: "party", mateHat: "party", lines: [["m", "Frohes neues Jahr, Ute!"], ["l", "Auf ein wunderschönes Jahr mit dir!"]], fx: "confetti" };
    return null;
  }

  /* ---------- Schlafen: 21–6 Uhr, an Silvester erst ab 1 Uhr ---------- */
  function sleepTime(d = new Date()) {
    const h = d.getHours(), silvester = d.getMonth() === 11 && d.getDate() === 31, neujahr = d.getMonth() === 0 && d.getDate() === 1;
    if (silvester) return h < 6;
    if (neujahr) return h >= 1 && h < 6 || h >= 21;
    return h >= 21 || h < 6;
  }
  function setSleep(on) {
    sleeping = on;
    [munkel, lotte].forEach((b) => { if (!b) return; b.busy = on || busy; b.classList.toggle("swaying", !on); b.face(on ? "sleep" : undefined); });
    zzz?.remove(); zzz = null;
    if (on) { zzz = H.el("div", { class: "mk-zzz mh-zzz", html: "<span>z</span><span>Z</span><span>z</span>" }); box.append(zzz); }
  }

  /* ---------- Antippen ---------- */
  const LINES_M = ["Hallo Ute! Schön, dass du da bist.", "Hast du das Türchen von heute schon geöffnet?", "Wir wohnen jetzt hier oben – mit Blick auf den Adventskranz!", "Psst … ich hab gemunkelt gehört, Kalle mag Mandarinen.", "Lotte und ich passen gut auf dich auf.", "Tirili! ♪", "Unten im Gehege ist ganz schön was los!"];
  const LINES_L = ["Hallo Ute!", "Der Munkelvogel singt mir jeden Abend etwas vor.", "Unser neues Nest ist wunderschön.", "Schau mal nach unten – die Tiere freuen sich auf dich!", "Tschirp! ♥", "Ich trag die Rose immer noch im Herzen."];
  function sleepyTap(b) { b.face("sleepy"); b.say("Zzz … psst, wir schlafen schon. Gute Nacht, Ute!", 2200); setTimeout(() => sleeping && b.face("sleep"), 1600); }
  function talk(b, who) {
    if (busy) return;
    if (sleeping) { sleepyTap(b); return; }
    const sp = special && specialOf();
    const pool = sp && li % 3 === 0 ? sp.lines.filter(([w]) => w === who).map(([, t]) => t) : who === "m" ? LINES_M : LINES_L;
    b.face("happy"); b.say(pool[li++ % pool.length], 2800); setTimeout(() => !sleeping && !busy && b.face(), 2600);
  }

  /* ---------- Specials ---------- */
  function hatFor(b, key) { b.setHat(key === "party" ? PARTY : MunkelShow.HATS[key] || ""); }
  function applyLook() {
    MunkelShow.dress(munkel);
    if (lotte) MunkelShow.dressMate(lotte);
    const sp = specialOf();
    if (sp && sp.hat) hatFor(munkel, sp.hat);
    if (sp && sp.mateHat && lotte) hatFor(lotte, sp.mateHat);
    special = sp;
  }
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  function fx(kind) {
    const r = box.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height * 0.4;
    const wr = document.getElementById("wreath")?.getBoundingClientRect();
    if (kind === "candle" && wr) { H.burst(wr.left + wr.width / 2, wr.top + wr.height * 0.25, ["✨", "⭐"], 16, 70); H.sfx.tone(784, 0.4, "sine", 0.08); H.sfx.tone(1175, 0.5, "sine", 0.06, null, 0.2); }
    else if (kind === "confetti") { H.confetti(["✨", "⭐", "💛", "🎉"], 50); H.sfx.win(); }
    else if (kind === "gift") { H.burst(cx, cy, ["🎁", "✨", "⭐"], 14, 80); H.sfx.jingle(); }
    else if (kind === "sparkle") { H.burst(cx, cy, ["✨", "📦", "⭐"], 12, 70); H.sfx.good(); }
    else if (kind === "xmas") { H.rain(["❄", "⭐", "💖", "🎄"], 40); H.sfx.jingle(); }
    else if (kind === "snow") { H.rain(["❄", "❅", "✨"], 40); H.sfx.good(); }
    else if (kind === "fireworks") { H.rain(["🎆", "🎇", "✨", "⭐"], 50); H.sfx.win(); }
  }
  async function perform(sp) {
    busy = true; [munkel, lotte].forEach((b) => b && (b.busy = true));
    const wasAsleep = sleeping;
    if (wasAsleep) { setSleep(false); busy = true; [munkel, lotte].forEach((b) => b && (b.busy = true, b.face("sleepy"))); await wait(1200); }
    for (const [who, text] of sp.lines) {
      const b = who === "m" ? munkel : lotte; if (!b) continue;
      b.face("happy"); b.act("mk-hop", 700); b.say(text, 3400); await wait(3600); b.face();
    }
    fx(sp.fx); [munkel, lotte].forEach((b) => b && (b.act("mk-flutter", 900), b.face("happy")));
    await wait(1800);
    busy = false;
    [munkel, lotte].forEach((b) => b && (b.busy = false, b.face()));
    if (wasAsleep || sleepTime()) setSleep(true);
  }
  // Specials laufen einmal am Tag, sobald nichts anderes offen ist und das Nest zu sehen ist
  function queue() {
    const todo = [];
    if (!st.done.umzug) todo.push({ key: "umzug", lines: [["m", "Überraschung! Wir sind umgezogen – ab jetzt wohnen wir hier oben bei dir."], [lotte ? "l" : "m", "Mit dem Knopf „Szenen“ unter unserem Nest kannst du dir unsere Szenen nochmal ansehen."]], fx: "sparkle", once: true });
    const sp = specialOf(); if (sp && !st.done[dkey() + sp.key]) todo.push(sp);
    if (!todo.length) return;
    const tryRun = async () => {
      const r = box.getBoundingClientRect();
      if (document.hidden || H.busy() || busy || r.bottom < 40 || r.top > innerHeight - 40) { setTimeout(tryRun, 1500); return; }
      const next = todo.shift();
      st.done[next.once ? next.key : dkey() + next.key] = Date.now(); save();
      await perform(next);
      if (todo.length) setTimeout(tryRun, 1500);
    };
    setTimeout(tryRun, 3000);
  }

  /* ---------- Aufbau ---------- */
  function init() {
    if (typeof Munkel === "undefined" || typeof MunkelShow === "undefined" || App.locked()) return;
    H = App.h;
    const host = document.getElementById("hero-art"); if (!host) return;
    const mate = MunkelShow.hasMate();
    box = H.el("div", { class: "mk-home" + (mate ? " two" : "") });
    const stage = H.el("div", { class: "mh-stage" });
    const nb = H.el("div", { class: "mh-nest mh-nest-back", html: MunkelShow.NEST_BACK }), nf = H.el("div", { class: "mh-nest mh-nest-front", html: MunkelShow.ART.nestFront });
    const pm = H.el("div", { class: "mh-perch mh-munkel" });
    stage.append(nb, pm);
    let pl = null;
    if (mate) { pl = H.el("div", { class: "mh-perch mh-lotte facing-left" }); stage.append(pl); }
    stage.append(nf);
    munkel = Munkel.mount(pm, { sit: true, onTap: () => talk(munkel, "m") }); munkel.legs("tuck");
    munkel.onSceneTap = () => sleeping && sleepyTap(munkel);
    if (pl) { lotte = Munkel.mount(pl, { sit: true, onTap: () => talk(lotte, "l") }); lotte.legs("tuck"); lotte.onSceneTap = () => sleeping && sleepyTap(lotte); }
    const album = H.el("button", { class: "mh-album", title: "Munkels Szenen nochmal ansehen", "aria-label": "Munkels Szenen nochmal ansehen", html: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5C4 4.7 4.7 4 5.5 4H11v15H5.5A1.5 1.5 0 0 1 4 17.5z M20 5.5c0-.8-.7-1.5-1.5-1.5H13v15h5.5c.8 0 1.5-.7 1.5-1.5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg><span>Szenen</span>` });
    album.addEventListener("click", (e) => { e.stopPropagation(); MunkelShow.openAlbum(); });
    if (!MunkelShow.seenCount()) album.hidden = true;
    box.append(stage, album);
    host.append(box);
    applyLook();
    if (sleepTime()) setSleep(true);
    setInterval(() => { if (busy) return; if ((specialOf() || {}).key !== (special || {}).key) applyLook(); if (sleepTime() !== sleeping) setSleep(sleepTime()); }, 60000);
    queue();
  }
  return { init, specialOf, sleepTime };
})();
