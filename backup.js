/* ============================================================
   Spielstand sichern & wiederherstellen
   - alles, was der Kalender speichert (Schlüssel "mama-…"), wird
     zu einem kurzen Code gepackt
   - als Link zum Weiterschicken (z. B. an sich selbst per WhatsApp/Mail)
     oder als Datei
   - Öffnen des Links stellt den Spielstand wieder her
   ============================================================ */
const Backup = (() => {
  const RAW = Storage.prototype; // im Testmodus ist get/set gepatcht, key()/length nicht
  const PFX = window.TEST ? "test:" : "";
  const LAST = "mama-sicherung-" + (typeof CONFIG !== "undefined" ? CONFIG.year : "2026");
  let H;

  // ---- Daten einsammeln / zurückschreiben ----
  function collect() {
    const d = {};
    for (let i = 0; i < localStorage.length; i++) {
      const raw = RAW.key.call(localStorage, i);
      if (!raw || !raw.startsWith(PFX + "mama-")) continue;
      const k = raw.slice(PFX.length);
      if (k === LAST) continue;
      d[k] = localStorage.getItem(k);
    }
    return d;
  }
  function apply(d) {
    // alten Stand entfernen, damit nichts Fremdes übrig bleibt
    const old = [];
    for (let i = 0; i < localStorage.length; i++) { const raw = RAW.key.call(localStorage, i); if (raw && raw.startsWith(PFX + "mama-")) old.push(raw.slice(PFX.length)); }
    old.forEach((k) => localStorage.removeItem(k));
    Object.entries(d).forEach(([k, v]) => { if (k.startsWith("mama-") && typeof v === "string") localStorage.setItem(k, v); });
  }

  // ---- Kodieren: JSON → (gepackt) → base64url ----
  const b64 = (bytes) => { let s = ""; bytes.forEach((b) => (s += String.fromCharCode(b))); return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); };
  const unb64 = (str) => { const s = atob(str.replace(/-/g, "+").replace(/_/g, "/")); return Uint8Array.from(s, (c) => c.charCodeAt(0)); };
  const pipe = async (bytes, Stream, fmt) => new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(new Stream(fmt))).arrayBuffer());
  async function encode(obj) {
    const bytes = new TextEncoder().encode(JSON.stringify(obj));
    if (typeof CompressionStream !== "undefined") { try { return "z" + b64(await pipe(bytes, CompressionStream, "deflate-raw")); } catch (e) {} }
    return "p" + b64(bytes);
  }
  async function decode(code) {
    code = (code || "").trim();
    const m = code.match(/sicherung=([A-Za-z0-9_-]+)/); if (m) code = m[1];
    if (code.startsWith("{")) return JSON.parse(code); // Datei mit reinem JSON
    const kind = code[0], bytes = unb64(code.slice(1));
    const raw = kind === "z" ? await pipe(bytes, DecompressionStream, "deflate-raw") : bytes;
    return JSON.parse(new TextDecoder().decode(raw));
  }
  const pack = () => ({ v: 1, t: Date.now(), d: collect() });
  const baseUrl = () => location.href.split("#")[0].split("?")[0];
  const summary = (p) => {
    let coins = 0, animals = 0, solved = 0;
    try { coins = JSON.parse(p.d["mama-zoo-2026"] || "{}").coins || 0; } catch (e) {}
    try { animals = JSON.parse(p.d["mama-gehege-2026"] || "[]").length; } catch (e) {}
    try { const a = JSON.parse(p.d["mama-advent-2026"] || "{}"); solved = Object.keys(a.solved || {}).length; } catch (e) {}
    return `${solved} gelöste Türchen · ${animals} Tiere · ${coins} Taler`;
  };
  const fmtDate = (t) => new Date(t).toLocaleString("de-DE", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
  const lastBackup = () => +(localStorage.getItem(LAST) || 0);
  const markSaved = () => { try { localStorage.setItem(LAST, String(Date.now())); } catch (e) {} updateIcon(); };

  // ---- Fenster ----
  function card(...children) {
    const wrap = H.el("div", { class: "pola-wrap backup-wrap", role: "dialog", "aria-label": "Spielstand sichern" });
    const box = H.el("div", { class: "backup-card" }, ...children);
    wrap.append(box, H.el("button", { class: "btn btn-green", text: "Schließen", onclick: () => wrap.remove() }));
    wrap.onclick = (e) => { if (e.target === wrap) wrap.remove(); };
    document.body.append(wrap);
    return wrap;
  }
  async function open() {
    const p = pack();
    const code = await encode(p);
    const link = `${baseUrl()}#sicherung=${code}`;
    const last = lastBackup();
    const status = H.el("p", { class: "bk-status", text: last ? `Letzte Sicherung: ${fmtDate(last)}` : "Du hast noch keine Sicherung gemacht." });
    const done = (msg) => { markSaved(); status.textContent = `Gesichert am ${fmtDate(Date.now())} – ${msg}`; status.classList.add("ok"); H.sfx.good(); };
    const share = navigator.share ? H.el("button", { class: "btn btn-green", text: "Sicherung an mich schicken", onclick: async () => {
      try { await navigator.share({ title: "Mamas Gehege – Sicherung", text: `Meine Sicherung vom ${fmtDate(Date.now())}. Zum Wiederherstellen einfach öffnen:`, url: link }); done("verschickt."); } catch (e) {}
    } }) : null;
    const copy = H.el("button", { class: "btn" + (share ? " btn-soft" : " btn-green"), text: "Sicherungslink kopieren", onclick: async () => {
      try { await navigator.clipboard.writeText(link); done("der Link ist kopiert. Schick ihn dir am besten selbst, z. B. per WhatsApp oder Mail."); }
      catch (e) { ta.value = link; ta.select(); H.toast("Bitte den markierten Link kopieren."); }
    } });
    const file = H.el("button", { class: "btn btn-soft", text: "Als Datei speichern", onclick: () => {
      const a = H.el("a", { href: URL.createObjectURL(new Blob([JSON.stringify(p)], { type: "application/json" })), download: `mamas-gehege-sicherung-${new Date().toISOString().slice(0, 10)}.json` });
      document.body.append(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000); done("die Datei ist gespeichert.");
    } });
    const ta = H.el("textarea", { class: "notes bk-in", rows: "3", placeholder: "Sicherungslink hier einfügen …", "aria-label": "Sicherungslink" });
    const pickFile = H.el("input", { type: "file", accept: ".json,application/json,text/plain", class: "bk-file" });
    pickFile.onchange = async () => { const f = pickFile.files[0]; if (f) tryRestore(await f.text()); };
    const restore = H.el("button", { class: "btn btn-soft", text: "Wiederherstellen", onclick: () => tryRestore(ta.value) });
    card(
      H.el("b", { class: "bk-title", text: "Spielstand sichern" }),
      H.el("p", { text: "Dein Fortschritt – Türchen, Taler, Tiere und Gehege – ist nur in diesem Browser gespeichert. Mit einer Sicherung kannst du alles jederzeit wiederherstellen, auch auf einem anderen Gerät." }),
      H.el("div", { class: "bk-now", text: summary(p) }),
      H.el("div", { class: "bk-btns" }, share, copy, file),
      status,
      H.el("details", { class: "bk-restore" }, H.el("summary", { text: "Spielstand wiederherstellen" }),
        H.el("p", { text: "Öffne einfach deinen Sicherungslink – oder füge ihn hier ein bzw. wähle die gespeicherte Datei." }),
        ta, H.el("div", { class: "bk-btns" }, restore, H.el("label", { class: "btn btn-soft bk-filebtn" }, "Datei wählen", pickFile))),
    );
  }

  async function tryRestore(text) {
    let p;
    try { p = await decode(text); } catch (e) { H.toast("Das sieht nicht nach einer gültigen Sicherung aus."); H.sfx.bad(); return; }
    if (!p || !p.d) { H.toast("Das sieht nicht nach einer gültigen Sicherung aus."); return; }
    confirmRestore(p);
  }
  function confirmRestore(p) {
    document.querySelectorAll(".backup-wrap").forEach((w) => w.remove());
    const w = card(
      H.el("b", { class: "bk-title", text: "Spielstand wiederherstellen?" }),
      H.el("p", { text: `Sicherung vom ${fmtDate(p.t)}:` }),
      H.el("div", { class: "bk-now", text: summary(p) }),
      H.el("p", { class: "bk-warn", text: "Der Spielstand in diesem Browser wird dadurch ersetzt." }),
      H.el("div", { class: "bk-btns" }, H.el("button", { class: "btn btn-green", text: "Ja, wiederherstellen", onclick: () => {
        apply(p.d); markSaved();
        history.replaceState(null, "", location.href.split("#")[0] + (window.TEST ? location.hash.replace(/#?sicherung=[^&]*/, "") : ""));
        H.toast("Dein Spielstand ist wieder da!"); setTimeout(() => location.reload(), 900);
      } })),
    );
    w.lastElementChild.replaceWith(H.el("button", { class: "btn btn-soft", text: "Abbrechen", onclick: () => { w.remove(); history.replaceState(null, "", location.href.split("#sicherung=")[0]); } }));
  }

  // ---- Knopf in der Navigation; dezenter Hinweis, wenn lange nicht gesichert ----
  let icon;
  const solvedCount = () => { let n = 0; for (let d = 1; d <= 31; d++) if (App.isSolved(d)) n++; return n; };
  const due = () => solvedCount() >= 3 && Date.now() - lastBackup() > 7 * 24 * 3600 * 1000;
  function updateIcon() { if (icon) icon.classList.toggle("has-dot", due()); }
  function init() {
    H = App.h;
    icon = H.el("button", { class: "nav-icon backup-btn", title: "Spielstand sichern", "aria-label": "Spielstand sichern", html: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 5 6v5c0 4.4 3 8.3 7 9.5 4-1.2 7-5.1 7-9.5V6z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="m8.8 12.2 2.3 2.3 4.3-4.6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>` });
    icon.addEventListener("click", (e) => { e.stopPropagation(); open(); });
    const icons = document.getElementById("nav-icons");
    if (icons) icons.prepend(icon);
    updateIcon();
    if (due() && !sessionStorage.getItem("bk-hint")) { try { sessionStorage.setItem("bk-hint", "1"); } catch (e) {} setTimeout(() => H.notify("Tipp: Sichere ab und zu deinen Spielstand – mit dem Schild-Symbol oben in der Leiste.", 6500), 15000); }
    setInterval(updateIcon, 60000);
    // Sicherungslink geöffnet?
    const m = location.hash.match(/sicherung=([A-Za-z0-9_-]+)/);
    if (m) setTimeout(() => tryRestore(m[1]), 800);
  }
  setTimeout(init, 0);
  return { open, collect, encode, decode };
})();
