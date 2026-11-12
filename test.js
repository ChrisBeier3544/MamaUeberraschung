/* =========================================================
   Testmodus: index.html?testdatum=2026-12-08&zeit=20:00
   - tut so, als wäre wirklich dieser Tag und diese Uhrzeit
   - speichert getrennt vom echten Spielstand (Präfix "test:")
   - zeigt oben eine Testleiste
   Muss VOR allen anderen Skripten geladen werden.
   ========================================================= */
(() => {
  // Auch per Adresse-Anker: #test-2026-12-08-1830 (optional mit -leer)
  const q = new URLSearchParams(location.search);
  const hm = /^#test-(\d{4}-\d{2}-\d{2})(?:-(\d{2})(\d{2}))?(-leer)?$/.exec(location.hash);
  const datum = hm ? hm[1] : q.get("testdatum");
  if (!datum || !/^\d{4}-\d{2}-\d{2}$/.test(datum)) return;
  const zq = hm && hm[2] ? `${hm[2]}:${hm[3]}` : q.get("zeit") || "";
  const zeit = /^\d{2}:\d{2}$/.test(zq) ? zq : "10:00";
  const leer = (hm && hm[4]) || q.has("leer");
  const RealDate = Date;
  const off = new RealDate(`${datum}T${zeit}:00`).getTime() - RealDate.now();
  class TestDate extends RealDate {
    constructor(...a) { super(...(a.length ? a : [RealDate.now() + off])); }
    static now() { return RealDate.now() + off; }
  }
  window.Date = TestDate;

  // eigener Speicher für Tests
  const P = "test:", S = Storage.prototype, g = S.getItem, s = S.setItem, r = S.removeItem;
  S.getItem = function (k) { return g.call(this, P + k); };
  S.setItem = function (k, v) { return s.call(this, P + k, v); };
  S.removeItem = function (k) { return r.call(this, P + k); };
  const clearTest = () => { for (let i = localStorage.length - 1; i >= 0; i--) { const k = localStorage.key(i); if (k && k.startsWith(P)) r.call(localStorage, k); } };

  window.TEST = { datum, zeit };
  const go = (d, z = zeit) => { location.hash = `test-${d}-${z.replace(":", "")}`; location.reload(); };
  const shift = (days) => { const d = new RealDate(`${datum}T12:00:00`); d.setDate(d.getDate() + days); go(d.toISOString().slice(0, 10)); };

  if (leer) { clearTest(); location.hash = `test-${datum}-${zeit.replace(":", "")}`; }

  addEventListener("DOMContentLoaded", () => {
    const st = document.createElement("style");
    st.textContent = `
      #testbar { position: fixed; left: 0; right: 0; top: 0; z-index: 1000; background: #2b2140; color: #fff; font: 600 14px Fredoka, Arial, sans-serif;
        display: flex; flex-wrap: wrap; align-items: center; gap: 6px 10px; padding: 6px max(10px, env(safe-area-inset-right, 0px)) 6px max(10px, env(safe-area-inset-left, 0px)); box-shadow: 0 2px 10px rgba(0,0,0,.3); }
      #testbar b { color: #ffd84d; }
      #testbar button, #testbar input { font: inherit; border: none; border-radius: 8px; padding: 5px 9px; cursor: pointer; }
      #testbar button { background: #4a3d6b; color: #fff; }
      #testbar button.warn { background: #c94060; }
      #testbar input { background: #fff; color: #2b2140; padding: 3px 6px; }
      #testbar .grow { flex: 1; }
`;
    document.head.append(st);
    const bar = document.createElement("div");
    bar.id = "testbar";
    const tag = new RealDate(`${datum}T12:00:00`).toLocaleDateString("de-DE", { weekday: "short", day: "numeric", month: "long", year: "numeric" });
    bar.innerHTML = `<span>TESTMODUS: <b>${tag}, ${zeit} Uhr</b></span>
      <button data-a="prev" title="Einen Tag zurück">◀ Tag</button><button data-a="next" title="Einen Tag weiter">Tag ▶</button>
      <input type="date" value="${datum}" aria-label="Datum"><input type="time" value="${zeit}" aria-label="Uhrzeit"><button data-a="go">Springen</button>
      <span class="grow"></span>
      <button data-a="coins">+100 Taler</button><button data-a="solve">Rätsel bis gestern lösen</button>
      <button data-a="reset" class="warn">Testspielstand löschen</button><button data-a="out">Übersicht</button>`;
    document.body.prepend(bar);
    const pad = () => (document.body.style.paddingTop = bar.offsetHeight + "px");
    pad(); addEventListener("resize", pad);
    const [di, ti] = bar.querySelectorAll("input");
    bar.addEventListener("click", (e) => {
      e.stopPropagation();
      const a = e.target.dataset && e.target.dataset.a; if (!a) return;
      if (a === "prev") shift(-1);
      if (a === "next") shift(1);
      if (a === "go") go(di.value || datum, ti.value || zeit);
      if (a === "coins" && (typeof Zoo !== "undefined")) Zoo.addCoins(100);
      if (a === "solve" && (typeof App !== "undefined")) {
        const today = new Date(); let n = 0;
        for (let d = 1; d <= 31; d++) { if (new Date(CONFIG.year, 11, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate()) && !App.isSolved(d)) { App.markSolved(d); if ((typeof Zoo !== "undefined")) Zoo.addCoins(Zoo.earn(d)); n++; } }
        App.h.toast(`${n} Rätsel als gelöst markiert – Taler gutgeschrieben.`);
        setTimeout(() => location.reload(), 1200);
      }
      if (a === "reset") { clearTest(); location.reload(); }
      if (a === "out") location.href = "test.html";
    });
    bar.addEventListener("pointerdown", (e) => e.stopPropagation());
  });
})();
