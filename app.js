/* واجهة تقويم دوري روشن */
(function () {
  const R = window.ROSHN;
  const HOUR = 3600000;
  const MATCH_LEN = 2 * HOUR;
  const STORE_TEAMS = "roshn.selectedTeams";
  const STORE_ONLY = "roshn.myOnly";

  const $ = (s, el = document) => el.querySelector(s);
  const el = (tag, cls, txt) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (txt != null) n.textContent = txt;
    return n;
  };

  // ---- الحالة ----
  const load = (k, def) => {
    try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? def : v; }
    catch { return def; }
  };
  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

  let selected = new Set(load(STORE_TEAMS, []));
  let myOnly = load(STORE_ONLY, false);

  // ---- التاريخ/الوقت ----
  const matchDate = (m) => new Date(`${m.date}T${m.time}:00+03:00`);

  const dowFmt = new Intl.DateTimeFormat("ar", {
    weekday: "long", timeZone: R.SEASON.timezone,
  });
  const dateFmt = new Intl.DateTimeFormat("ar", {
    day: "numeric", month: "long", year: "numeric",
    timeZone: R.SEASON.timezone, calendar: "gregory", numberingSystem: "latn",
  });
  const timeFmt = new Intl.DateTimeFormat("ar", {
    hour: "numeric", minute: "2-digit", hour12: true,
    timeZone: R.SEASON.timezone, numberingSystem: "latn",
  });

  const pad = (x) => String(x).padStart(2, "0");
  const icsUTC = (d) =>
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T` +
    `${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
  const ksaLocal = (d) => {
    const k = new Date(d.getTime() + 3 * HOUR); // UTC+3 ثابت
    return `${k.getUTCFullYear()}${pad(k.getUTCMonth() + 1)}${pad(k.getUTCDate())}T` +
      `${pad(k.getUTCHours())}${pad(k.getUTCMinutes())}00`;
  };

  const teamName = (id) => (R.teamById[id] || {}).name || id;
  const matchTitle = (m) =>
    `${teamName(m.home)} × ${teamName(m.away)} — دوري روشن`;
  const matchLocation = (m) => {
    const t = R.teamById[m.home] || {};
    return [t.stadium, t.city].filter(Boolean).join("، ");
  };

  // ---- iCalendar ----
  const esc = (s) => String(s).replace(/\\/g, "\\\\").replace(/;/g, "\\;")
    .replace(/,/g, "\\,").replace(/\n/g, "\\n");

  function vevent(m, now) {
    const start = matchDate(m);
    const end = new Date(start.getTime() + MATCH_LEN);
    const desc = `الجولة ${m.round} من دوري روشن السعودي ${R.SEASON.seasonLabel}` +
      (m.confirmed ? "" : " (موعد مبدئي — راجع الجدول الرسمي)");
    return [
      "BEGIN:VEVENT",
      `UID:roshn-${m.id}@roshn-calendar`,
      `DTSTAMP:${icsUTC(now)}`,
      `DTSTART:${icsUTC(start)}`,
      `DTEND:${icsUTC(end)}`,
      `SUMMARY:${esc(matchTitle(m))} (ج${m.round})`,
      `LOCATION:${esc(matchLocation(m))}`,
      `DESCRIPTION:${esc(desc)}`,
      "END:VEVENT",
    ].join("\r\n");
  }

  function buildICS(matches) {
    const now = new Date();
    return [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Roshn League Calendar//AR//",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      `X-WR-CALNAME:دوري روشن ${R.SEASON.seasonLabel}`,
      `X-WR-TIMEZONE:${R.SEASON.timezone}`,
      ...matches.map((m) => vevent(m, now)),
      "END:VCALENDAR",
    ].join("\r\n");
  }

  function downloadICS(matches, filename) {
    const blob = new Blob([buildICS(matches)], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = el("a");
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function googleUrl(m) {
    const start = matchDate(m);
    const end = new Date(start.getTime() + MATCH_LEN);
    const p = new URLSearchParams({
      action: "TEMPLATE",
      text: matchTitle(m) + ` (ج${m.round})`,
      dates: `${ksaLocal(start)}/${ksaLocal(end)}`,
      ctz: R.SEASON.timezone,
      location: matchLocation(m),
      details: `الجولة ${m.round} — دوري روشن السعودي ${R.SEASON.seasonLabel}` +
        (m.confirmed ? "" : " (موعد مبدئي)"),
    });
    return "https://calendar.google.com/calendar/render?" + p.toString();
  }

  // ---- التصفية ----
  const matchesFilter = (m) =>
    !myOnly || selected.has(m.home) || selected.has(m.away);
  const involvesSelected = (m) => selected.has(m.home) || selected.has(m.away);
  const currentMatches = () => R.FIXTURES.filter(matchesFilter);
  const selectedMatches = () => R.FIXTURES.filter(involvesSelected);

  // ================= العرض =================
  // كرِست (شعار مرسوم) لكل نادٍ بألوانه — نتجنّب الشعارات الرسمية لحقوقها
  function crestSVG(t, size) {
    const c = t.color || "#666", c2 = t.color2 || c, ab = t.abbr || "";
    return `<svg width="${size}" height="${size}" viewBox="0 0 44 44" aria-hidden="true">` +
      `<circle cx="22" cy="22" r="21" fill="${c}" stroke="rgba(255,255,255,.92)" stroke-width="2"/>` +
      `<circle cx="22" cy="22" r="15.5" fill="none" stroke="${c2}" stroke-width="3"/>` +
      `<text x="22" y="23" text-anchor="middle" dominant-baseline="central" ` +
      `fill="#fff" font-weight="800" font-size="15">${ab}</text></svg>`;
  }
  function crest(t, size) {
    const s = el("span", "crest");
    s.innerHTML = crestSVG(t, size);
    return s;
  }

  function teamBadge(id, big) {
    const t = R.teamById[id] || {};
    const b = el("span", "badge" + (big ? " badge-lg" : ""));
    b.append(crest(t, big ? 34 : 24), el("span", "bn", t.name || id));
    return b;
  }

  function renderTeams() {
    const wrap = $("#teamGrid");
    wrap.innerHTML = "";
    R.TEAMS.forEach((t) => {
      const chip = el("button", "team-chip");
      chip.type = "button";
      chip.style.setProperty("--c", t.color);
      chip.setAttribute("aria-pressed", selected.has(t.id));
      if (selected.has(t.id)) chip.classList.add("on");
      chip.append(crest(t, 30));
      const meta = el("span", "chip-meta");
      meta.append(el("span", "chip-name", t.name), el("span", "chip-city", t.city));
      chip.append(meta, el("span", "chip-check", "✓"));
      chip.addEventListener("click", () => {
        if (selected.has(t.id)) selected.delete(t.id); else selected.add(t.id);
        save(STORE_TEAMS, [...selected]);
        renderTeams(); renderMatches(); renderSummary(); renderNext();
      });
      wrap.append(chip);
    });
  }

  function renderSummary() {
    const n = selected.size;
    $("#selCount").textContent = n;
    $("#a-sel").textContent = n ? n + " فريق" : "لا شيء";
    const list = currentMatches().length;
    $("#matchCount").textContent = list;
    $("#bulkBtn").disabled = n === 0;
    $("#bulkBtn").textContent = n === 0
      ? "اختر فرقك أولاً"
      : `⬇️ نزّل مباريات فرقي (${selectedMatches().length}) للتقويم`;
    $("#onlyToggle").setAttribute("aria-pressed", myOnly);
    $("#onlyToggle").classList.toggle("on", myOnly);
  }

  function matchCard(m) {
    const card = el("div", "match" + (involvesSelected(m) && selected.size ? " mine" : ""));
    const d = matchDate(m);

    const teams = el("div", "match-teams");
    teams.append(teamBadge(m.home, true), el("span", "vs", "×"), teamBadge(m.away, true));

    const when = el("div", "match-when");
    when.append(
      el("span", "w-day", `${dowFmt.format(d)} ${dateFmt.format(d)}`),
      el("span", "w-time", `🕒 ${timeFmt.format(d)}`),
    );
    const venue = el("div", "match-venue", "📍 " + matchLocation(m));

    const tags = el("div", "match-tags");
    tags.append(el("span", "tag round", "الجولة " + m.round));
    tags.append(el("span", "tag " + (m.confirmed ? "ok" : "prov"),
      m.confirmed ? "موعد مؤكد" : "موعد مبدئي"));

    const actions = el("div", "match-actions");
    const g = el("a", "btn btn-g", "Google تقويم");
    g.href = googleUrl(m); g.target = "_blank"; g.rel = "noopener";
    const ics = el("button", "btn btn-ics", "⬇️ ملف .ics");
    ics.type = "button";
    ics.addEventListener("click", () =>
      downloadICS([m], `roshn-${m.home}-${m.away}.ics`));
    actions.append(g, ics);

    const info = el("div", "match-info");
    info.append(when, venue, tags);
    card.append(teams, info, actions);
    return card;
  }

  function renderMatches() {
    const host = $("#matches");
    host.innerHTML = "";
    const list = currentMatches();
    if (!list.length) {
      host.append(el("p", "empty", "لا توجد مباريات مطابقة. جرّب اختيار فرق أو إلغاء «فرقي فقط»."));
      renderSummary();
      return;
    }
    const byRound = new Map();
    list.forEach((m) => {
      if (!byRound.has(m.round)) byRound.set(m.round, []);
      byRound.get(m.round).push(m);
    });
    [...byRound.keys()].sort((a, b) => a - b).forEach((r) => {
      const ms = byRound.get(r).slice().sort((a, b) => matchDate(a) - matchDate(b));
      const sec = el("section", "round");
      const head = el("div", "round-head");
      head.append(el("h3", null, "الجولة " + r));
      const d0 = matchDate(ms[0]);
      head.append(el("span", "round-date", dateFmt.format(d0)));
      sec.append(head);
      const grid = el("div", "round-grid");
      ms.forEach((m) => grid.append(matchCard(m)));
      sec.append(grid);
      host.append(sec);
    });
    renderSummary();
  }

  // ---- الأزرار العامة ----
  function wire() {
    $("#selectAll").addEventListener("click", () => {
      selected = new Set(R.TEAMS.map((t) => t.id));
      save(STORE_TEAMS, [...selected]);
      renderTeams(); renderMatches(); renderNext();
    });
    $("#clearAll").addEventListener("click", () => {
      selected = new Set();
      save(STORE_TEAMS, []);
      renderTeams(); renderMatches(); renderNext();
    });
    $("#onlyToggle").addEventListener("click", () => {
      myOnly = !myOnly;
      save(STORE_ONLY, myOnly);
      renderMatches();
    });
    $("#bulkBtn").addEventListener("click", () => {
      const ms = selectedMatches();
      if (!ms.length) return;
      downloadICS(ms, "roshn-my-teams-2026-2027.ics");
    });

    // ---- الاشتراك التلقائي ----
    $("#subBtn").addEventListener("click", () => {
      if (!/^https?:$/.test(location.protocol)) {
        toast("انشر الموقع أولاً ليعمل الاشتراك التلقائي — أو استخدم زر التنزيل.");
        return;
      }
      location.href = feedUrl().replace(/^https?:/, "webcal:");
    });
    $("#subCopy").addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(feedUrl()); toast("نُسخ رابط الاشتراك ✓"); }
      catch { toast(feedUrl()); }
    });
    $("#subAll").addEventListener("click", () => {
      downloadICS(R.FIXTURES, "roshn-2026-2027-full.ics");
    });
  }

  // رابط ملف الموسم الكامل (موضوع بجانب الصفحة عند النشر)
  function feedUrl() {
    return location.href.replace(/[#?].*$/, "").replace(/[^/]*$/, "") +
      "roshn-2026-2027.ics";
  }

  // ---- إشعار مؤقت ----
  let toastT = null;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    if (toastT) clearTimeout(toastT);
    toastT = setTimeout(() => t.classList.remove("show"), 3200);
  }

  // ================= العدّاد التنازلي =================
  function upcoming() {
    const now = Date.now();
    let pool = selected.size ? R.FIXTURES.filter(involvesSelected) : R.FIXTURES;
    return pool
      .filter((m) => matchDate(m).getTime() + MATCH_LEN >= now)
      .sort((a, b) => matchDate(a) - matchDate(b));
  }

  let nextM = null, cdTimer = null;

  function tickCountdown() {
    const box = $("#cdTimer");
    if (!box || !nextM) return;
    let diff = matchDate(nextM).getTime() - Date.now();
    if (diff < -MATCH_LEN) { renderNext(); return; }
    box.classList.toggle("live", diff <= 0);
    if (diff <= 0) {
      box.querySelector(".cd-live").hidden = false;
      box.querySelector(".cd-units").hidden = true;
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const set = (k, v) => { box.querySelector(`[data-${k}]`).textContent = String(v).padStart(2, "0"); };
    set("d", d); set("h", h); set("m", m); set("s", s);
  }

  function renderNext() {
    const host = $("#nextMatch");
    if (cdTimer) { clearInterval(cdTimer); cdTimer = null; }
    nextM = upcoming()[0] || null;
    host.innerHTML = "";

    const card = el("div", "cd-card");
    const label = el("div", "cd-label",
      "⏱️ المباراة القادمة" + (selected.size ? " لفرقك" : ""));
    card.append(label);

    if (!nextM) {
      card.append(el("div", "cd-empty",
        selected.size ? "لا توجد مباريات قادمة لفرقك المختارة." : "انتهى الموسم."));
      host.append(card);
      return;
    }

    const d = matchDate(nextM);
    const teams = el("div", "cd-match");
    teams.append(teamBadge(nextM.home, true), el("span", "vs", "×"), teamBadge(nextM.away, true));

    const meta = el("div", "cd-meta");
    meta.append(
      el("span", "cd-round", "الجولة " + nextM.round),
      el("span", null, `${dowFmt.format(d)} ${dateFmt.format(d)}`),
      el("span", "cd-time", `🕒 ${timeFmt.format(d)}`),
    );

    const timer = el("div", "cd-timer");
    timer.id = "cdTimer";
    const units = el("div", "cd-units");
    [["d", "يوم"], ["h", "ساعة"], ["m", "دقيقة"], ["s", "ثانية"]].forEach(([k, lbl]) => {
      const u = el("div", "cd-unit");
      const n = el("span", "cd-num", "00");
      n.setAttribute("data-" + k, "");
      u.append(n, el("span", "cd-lbl", lbl));
      units.append(u);
    });
    const live = el("div", "cd-live", "🔴 المباراة جارية الآن");
    live.hidden = true;
    timer.append(units, live);

    const actions = el("div", "cd-actions");
    const g = el("a", "btn btn-g", "Google تقويم");
    g.href = googleUrl(nextM); g.target = "_blank"; g.rel = "noopener";
    const ics = el("button", "btn btn-ics", "⬇️ ملف .ics");
    ics.addEventListener("click", () => downloadICS([nextM], `roshn-${nextM.home}-${nextM.away}.ics`));
    actions.append(g, ics);

    card.append(teams, meta, timer, actions);
    host.append(card);

    tickCountdown();
    cdTimer = setInterval(tickCountdown, 1000);
  }

  // ---- تهيئة ----
  document.addEventListener("DOMContentLoaded", () => {
    $("#seasonTitle").textContent =
      `${R.SEASON.title} ${R.SEASON.seasonLabel}`;
    $("#seasonMeta").textContent =
      `${R.SEASON.rounds} جولة · ${R.FIXTURES.length} مباراة · تبدأ ` +
      `${dateFmt.format(new Date(R.SEASON.startDate + "T12:00:00+03:00"))}`;
    wire();
    renderTeams();
    renderNext();
    renderMatches();
    renderSummary();
  });
})();
