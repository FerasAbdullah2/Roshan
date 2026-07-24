/* واجهة تقويم دوري روشن · Roshn League calendar UI (AR / EN) */
(function () {
  const R = window.ROSHN;
  const HOUR = 3600000;
  const MATCH_LEN = 2 * HOUR;
  const S = {
    teams: "roshn.selectedTeams",
    only: "roshn.myOnly",
    lang: "roshn.lang",
  };

  const $ = (s, el = document) => el.querySelector(s);
  const el = (tag, cls, txt) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (txt != null) n.textContent = txt;
    return n;
  };
  const load = (k, def) => {
    try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? def : v; }
    catch { return def; }
  };
  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

  // ---- الحالة · state ----
  let selected = new Set(load(S.teams, []));
  let myOnly = load(S.only, false);
  let lang = load(S.lang, "ar");

  // ================= الترجمة · i18n =================
  const T = {
    ar: {
      kicker: "تقويم الدوري", langBtn: "English",
      notice: "مواجهات <b>الجولة الأولى</b> مؤكدة رسمياً. باقي المواعيد <b>مبدئية</b> ومولّدة تلقائياً وتُستبدل بالجدول الرسمي فور صدوره — عدّل <code>data.js</code>.",
      stat_teams: "فرقك المختارة", stat_shown: "مباريات معروضة", stat_total: "فريق في الدوري",
      pick_h: "اختر فرقك", pick_sub: "اضغط على الفرق التي تتابعها — يُحفظ اختيارك تلقائياً.",
      selectAll: "تحديد الكل", clearAll: "مسح الكل",
      your_teams: "فرقك", none: "لا شيء", myOnly: "مباريات فرقي فقط",
      bulk_pick: "اختر فرقك أولاً", bulk: (n) => `⬇️ نزّل مباريات فرقي (${n})`,
      matches_h: "المباريات", matches_sub: "لكل مباراة: أضفها إلى Google تقويم أو نزّل ملف .ics.",
      next: "المباراة القادمة", next_yours: "المباراة القادمة لفرقك",
      live: "🔴 المباراة جارية الآن", empty_season: "انتهى الموسم.",
      empty_teams: "لا توجد مباريات قادمة لفرقك المختارة.",
      d: "يوم", h: "ساعة", m: "دقيقة", s: "ثانية",
      round: (n) => "الجولة " + n, confirmed: "موعد مؤكد", provisional: "موعد مبدئي",
      gcal: "Google تقويم", ics: "⬇️ ملف .ics",
      sub_h: "اشتراك يتحدّث تلقائياً", sub_sub: "اشترك برابط — إذا تغيّر أي موعد مباراة، يتحدّث تقويمك تلقائياً دون أي خطوة.",
      sub_all: "📅 اشترك بكل مباريات الموسم", sub_copy: "📋 انسخ رابط الاشتراك",
      sub_dl: "⬇️ نزّل كل الموسم (لمرة واحدة)",
      sub_teams_h: "اشترك بفرقك (تحديث تلقائي):",
      sub_pick_first: "اختر فرقك بالأعلى لتظهر روابط اشتراكها هنا.",
      sub_note: "«اشترك» = تحديث تلقائي (webcal). «نزّل» = نسخة ثابتة لمرة واحدة. الاشتراك يعمل بعد نشر الموقع.",
      toast_copied: "نُسخ رابط الاشتراك ✓", toast_deploy: "انشر الموقع أولاً ليعمل الاشتراك، أو استخدم زر التنزيل.",
      subscribe: "اشترك",
      foot1: "الأوقات بتوقيت السعودية (UTC+3). للاشتراك التلقائي استخدم روابط «اشترك» — التنزيل نسخة لمرة واحدة.",
      foot2: "تقويم غير رسمي للمتابعة الشخصية · البيانات في data.js",
      meta: (r, n, d) => `${r} جولة · ${n} مباراة · تبدأ ${d}`,
    },
    en: {
      kicker: "League Calendar", langBtn: "العربية",
      notice: "<b>Round 1</b> fixtures are official. The rest are <b>provisional</b>, auto-generated, and get replaced by the official schedule once released — edit <code>data.js</code>.",
      stat_teams: "Your teams", stat_shown: "Matches shown", stat_total: "Teams in league",
      pick_h: "Pick your teams", pick_sub: "Tap the teams you follow — your choice is saved automatically.",
      selectAll: "Select all", clearAll: "Clear",
      your_teams: "Your teams", none: "none", myOnly: "My teams only",
      bulk_pick: "Pick teams first", bulk: (n) => `⬇️ Download my matches (${n})`,
      matches_h: "Matches", matches_sub: "For each match: add to Google Calendar or download an .ics file.",
      next: "Next match", next_yours: "Your next match",
      live: "🔴 Match is live now", empty_season: "Season has ended.",
      empty_teams: "No upcoming matches for your selected teams.",
      d: "days", h: "hrs", m: "min", s: "sec",
      round: (n) => "Round " + n, confirmed: "Confirmed", provisional: "Provisional",
      gcal: "Google Calendar", ics: "⬇️ .ics file",
      sub_h: "Auto-updating subscription", sub_sub: "Subscribe by link — if any kickoff time changes, your calendar updates automatically with no extra step.",
      sub_all: "📅 Subscribe to all season matches", sub_copy: "📋 Copy subscription link",
      sub_dl: "⬇️ Download full season (one-time)",
      sub_teams_h: "Subscribe to your teams (auto-updating):",
      sub_pick_first: "Pick your teams above to get their subscription links here.",
      sub_note: "“Subscribe” = auto-updating (webcal). “Download” = one-time static copy. Subscriptions work once the site is deployed.",
      toast_copied: "Subscription link copied ✓", toast_deploy: "Deploy the site first for subscriptions, or use Download.",
      subscribe: "Subscribe",
      foot1: "Times in Saudi Arabia (UTC+3). For auto-updates use “Subscribe” — download is a one-time snapshot.",
      foot2: "Unofficial personal-tracking calendar · Data in data.js",
      meta: (r, n, d) => `${r} rounds · ${n} matches · starts ${d}`,
    },
  };
  const t = (k) => T[lang][k];
  const isAr = () => lang === "ar";

  // ---- التاريخ/الوقت · date-time ----
  let dowFmt, dateFmt, timeFmt;
  function buildFormatters() {
    const loc = isAr() ? "ar" : "en-GB";
    dowFmt = new Intl.DateTimeFormat(loc, { weekday: "long", timeZone: R.SEASON.timezone });
    dateFmt = new Intl.DateTimeFormat(loc, {
      day: "numeric", month: "long", year: "numeric",
      timeZone: R.SEASON.timezone, calendar: "gregory", numberingSystem: "latn",
    });
    timeFmt = new Intl.DateTimeFormat(loc, {
      hour: "numeric", minute: "2-digit", hour12: true,
      timeZone: R.SEASON.timezone, numberingSystem: "latn",
    });
  }
  const matchDate = (m) => new Date(`${m.date}T${m.time}:00+03:00`);
  const pad = (x) => String(x).padStart(2, "0");
  const icsUTC = (d) =>
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T` +
    `${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
  const ksaLocal = (d) => {
    const k = new Date(d.getTime() + 3 * HOUR);
    return `${k.getUTCFullYear()}${pad(k.getUTCMonth() + 1)}${pad(k.getUTCDate())}T` +
      `${pad(k.getUTCHours())}${pad(k.getUTCMinutes())}00`;
  };

  const team = (id) => R.teamById[id] || {};
  const teamName = (id) => (isAr() ? team(id).name : team(id).nameEn) || id;
  const teamCity = (id) => (isAr() ? team(id).city : team(id).cityEn) || "";
  const matchTitle = (m) => `${teamName(m.home)} × ${teamName(m.away)} — ${isAr() ? "دوري روشن" : "Roshn League"}`;
  const matchLocation = (m) => {
    const h = team(m.home);
    return isAr() ? [h.stadium, h.city].filter(Boolean).join("، ") : [h.stadium ? teamName(m.home) + " Stadium" : "", h.cityEn].filter(Boolean).join(", ");
  };

  // ================= iCalendar =================
  const esc = (s) => String(s).replace(/\\/g, "\\\\").replace(/;/g, "\\;")
    .replace(/,/g, "\\,").replace(/\n/g, "\\n");

  function vevent(m, now) {
    const start = matchDate(m);
    const end = new Date(start.getTime() + MATCH_LEN);
    const desc = (isAr()
      ? `الجولة ${m.round} من دوري روشن السعودي ${R.SEASON.seasonLabel}`
      : `Round ${m.round} — Roshn Saudi League ${R.SEASON.seasonLabel}`) +
      (m.confirmed ? "" : (isAr() ? " (موعد مبدئي)" : " (provisional time)"));
    return [
      "BEGIN:VEVENT",
      `UID:roshn-${m.id}@roshn-calendar`,
      `SEQUENCE:${R.SEASON.revision || 0}`,
      `DTSTAMP:${icsUTC(now)}`,
      `LAST-MODIFIED:${icsUTC(now)}`,
      `DTSTART:${icsUTC(start)}`,
      `DTEND:${icsUTC(end)}`,
      `SUMMARY:${esc(matchTitle(m))} (${isAr() ? "ج" : "R"}${m.round})`,
      `LOCATION:${esc(matchLocation(m))}`,
      `DESCRIPTION:${esc(desc)}`,
      "END:VEVENT",
    ].join("\r\n");
  }
  function buildICS(matches) {
    const now = new Date();
    return [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Roshn League Calendar//AR//",
      "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
      `X-WR-CALNAME:${isAr() ? "دوري روشن" : "Roshn League"} ${R.SEASON.seasonLabel}`,
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
      text: matchTitle(m) + ` (${isAr() ? "ج" : "R"}${m.round})`,
      dates: `${ksaLocal(start)}/${ksaLocal(end)}`,
      ctz: R.SEASON.timezone,
      location: matchLocation(m),
      details: (isAr() ? `الجولة ${m.round} — دوري روشن ${R.SEASON.seasonLabel}` : `Round ${m.round} — Roshn League ${R.SEASON.seasonLabel}`),
    });
    return "https://calendar.google.com/calendar/render?" + p.toString();
  }
  // رابط ملف الاشتراك (الموسم كامل أو فريق) · subscription feed url
  const feedUrl = (teamId) => {
    const dir = location.href.replace(/[#?].*$/, "").replace(/[^/]*$/, "");
    return dir + (teamId ? `feeds/${teamId}.ics` : "roshn-2026-2027.ics");
  };

  // ---- التصفية ----
  const involvesSelected = (m) => selected.has(m.home) || selected.has(m.away);
  const matchesFilter = (m) => !myOnly || involvesSelected(m);
  const currentMatches = () => R.FIXTURES.filter(matchesFilter);
  const selectedMatches = () => R.FIXTURES.filter(involvesSelected);

  // ================= الشعار · crest / logo =================
  function crestSVG(tm, size) {
    const c = tm.color || "#666", c2 = tm.color2 || c, ab = tm.abbr || "";
    const gid = "g_" + tm.id;
    return `<svg width="${size}" height="${size * 1.08}" viewBox="0 0 48 52" aria-hidden="true">` +
      `<defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">` +
      `<stop offset="0" stop-color="${c2}"/><stop offset="1" stop-color="${c}"/></linearGradient></defs>` +
      `<path d="M24 2 L44 8 V26 C44 40 34 48 24 50 C14 48 4 40 4 26 V8 Z" ` +
      `fill="url(#${gid})" stroke="rgba(255,255,255,.9)" stroke-width="1.6"/>` +
      `<path d="M24 6 L40 11 V26 C40 37.5 31.5 44.5 24 46.4 C16.5 44.5 8 37.5 8 26 V11 Z" ` +
      `fill="none" stroke="rgba(255,255,255,.22)" stroke-width="1"/>` +
      `<path d="M24 11.5 l1.5 3.4 3.7.3 -2.8 2.4 .9 3.6 -3.3-2 -3.3 2 .9-3.6 -2.8-2.4 3.7-.3 Z" fill="rgba(255,255,255,.92)"/>` +
      `<text x="24" y="34" text-anchor="middle" dominant-baseline="central" ` +
      `fill="#fff" font-weight="800" font-size="15">${ab}</text></svg>`;
  }
  function crest(id, size) {
    const tm = team(id);
    const s = el("span", "crest");
    if (tm.logoUrl) {
      const img = el("img", "crest-img");
      img.src = tm.logoUrl; img.alt = teamName(id); img.width = size; img.height = size;
      img.loading = "lazy";
      img.onerror = () => { s.innerHTML = crestSVG(tm, size); };
      s.append(img);
    } else {
      s.innerHTML = crestSVG(tm, size);
    }
    return s;
  }

  function teamBadge(id, big) {
    const b = el("span", "badge" + (big ? " badge-lg" : ""));
    b.append(crest(id, big ? 34 : 26), el("span", "bn", teamName(id)));
    return b;
  }

  // ================= العرض · rendering =================
  function renderChrome() {
    document.documentElement.lang = lang;
    document.documentElement.dir = isAr() ? "rtl" : "ltr";
    $("#kicker").textContent = "⚽ " + t("kicker");
    $("#langBtn").textContent = t("langBtn");
    $("#seasonTitle").textContent = `${isAr() ? R.SEASON.title : R.SEASON.titleEn} ${R.SEASON.seasonLabel}`;
    $("#seasonMeta").textContent = t("meta")(
      R.SEASON.rounds, R.FIXTURES.length,
      dateFmt.format(new Date(R.SEASON.startDate + "T12:00:00+03:00")));
    $("#notice").innerHTML = "<b>" + (isAr() ? "ملاحظة:" : "Note:") + "</b> " + t("notice");
    $("#stat_teams_l").textContent = t("stat_teams");
    $("#stat_shown_l").textContent = t("stat_shown");
    $("#stat_total_l").textContent = t("stat_total");
    $("#pick_h").textContent = "1 · " + t("pick_h");
    $("#pick_sub").textContent = t("pick_sub");
    $("#selectAll").textContent = t("selectAll");
    $("#clearAll").textContent = t("clearAll");
    $("#your_teams_l").textContent = t("your_teams");
    $("#onlyToggle").textContent = t("myOnly");
    $("#matches_h").textContent = "2 · " + t("matches_h");
    $("#matches_sub").textContent = t("matches_sub");
    $("#sub_h").textContent = "3 · " + t("sub_h");
    $("#sub_sub").textContent = t("sub_sub");
    $("#subAll").textContent = t("sub_all");
    $("#subCopy").textContent = t("sub_copy");
    $("#subDl").textContent = t("sub_dl");
    $("#sub_teams_h").textContent = t("sub_teams_h");
    $("#sub_note").textContent = t("sub_note");
    $("#foot1").textContent = t("foot1");
    $("#foot2").textContent = t("foot2");
  }

  function renderTeams() {
    const wrap = $("#teamGrid");
    wrap.innerHTML = "";
    R.TEAMS.forEach((tm) => {
      const chip = el("button", "team-chip");
      chip.type = "button";
      chip.style.setProperty("--c", tm.color);
      const on = selected.has(tm.id);
      chip.setAttribute("aria-pressed", on);
      if (on) chip.classList.add("on");
      chip.append(crest(tm.id, 34));
      const meta = el("span", "chip-meta");
      meta.append(el("span", "chip-name", teamName(tm.id)), el("span", "chip-city", teamCity(tm.id)));
      chip.append(meta, el("span", "chip-check", "✓"));
      chip.addEventListener("click", () => {
        if (selected.has(tm.id)) selected.delete(tm.id); else selected.add(tm.id);
        save(S.teams, [...selected]);
        chip.classList.toggle("on"); chip.setAttribute("aria-pressed", selected.has(tm.id));
        renderMatches(); renderNext(); renderSummary(); renderSubTeams();
      });
      wrap.append(chip);
    });
  }

  function renderSummary() {
    const n = selected.size;
    $("#selCount").textContent = n;
    $("#matchCount").textContent = currentMatches().length;
    $("#your_teams_v").textContent = n ? (n + (isAr() ? " فريق" : " teams")) : t("none");
    const b = $("#bulkBtn");
    b.disabled = n === 0;
    b.textContent = n === 0 ? t("bulk_pick") : t("bulk")(selectedMatches().length);
    $("#onlyToggle").classList.toggle("on", myOnly);
    $("#onlyToggle").setAttribute("aria-pressed", myOnly);
  }

  function matchActions(m) {
    const actions = el("div", "match-actions");
    const g = el("a", "btn btn-g", t("gcal"));
    g.href = googleUrl(m); g.target = "_blank"; g.rel = "noopener";
    const ics = el("button", "btn btn-ics", t("ics"));
    ics.type = "button";
    ics.addEventListener("click", () => downloadICS([m], `roshn-${m.home}-${m.away}.ics`));
    actions.append(g, ics);
    return actions;
  }

  function matchCard(m) {
    const card = el("div", "match" + (involvesSelected(m) && selected.size ? " mine" : ""));
    const d = matchDate(m);
    const teams = el("div", "match-teams");
    teams.append(teamBadge(m.home, true), el("span", "vs", "×"), teamBadge(m.away, true));
    const when = el("div", "match-when");
    when.append(
      el("span", "w-day", `${dowFmt.format(d)} · ${dateFmt.format(d)}`),
      el("span", "w-time", `🕒 ${timeFmt.format(d)}`));
    const venue = el("div", "match-venue", "📍 " + matchLocation(m));
    const tags = el("div", "match-tags");
    tags.append(el("span", "tag round", t("round")(m.round)));
    tags.append(el("span", "tag " + (m.confirmed ? "ok" : "prov"), m.confirmed ? t("confirmed") : t("provisional")));
    const info = el("div", "match-info");
    info.append(when, venue, tags);
    card.append(teams, info, matchActions(m));
    return card;
  }

  function renderMatches() {
    const host = $("#matches");
    host.innerHTML = "";
    const list = currentMatches();
    if (!list.length) {
      host.append(el("p", "empty", isAr() ? "لا مباريات مطابقة." : "No matching matches."));
      renderSummary(); return;
    }
    const byRound = new Map();
    list.forEach((m) => { (byRound.get(m.round) || byRound.set(m.round, []).get(m.round)).push(m); });
    [...byRound.keys()].sort((a, b) => a - b).forEach((r) => {
      const ms = byRound.get(r).slice().sort((a, b) => matchDate(a) - matchDate(b));
      const sec = el("section", "round");
      const head = el("div", "round-head");
      head.append(el("h3", null, t("round")(r)), el("span", "round-date", dateFmt.format(matchDate(ms[0]))));
      sec.append(head);
      const grid = el("div", "round-grid");
      ms.forEach((m) => grid.append(matchCard(m)));
      sec.append(grid);
      host.append(sec);
    });
    renderSummary();
  }

  // ---- العدّاد التنازلي ----
  const upcoming = () => {
    const now = Date.now();
    const pool = selected.size ? R.FIXTURES.filter(involvesSelected) : R.FIXTURES;
    return pool.filter((m) => matchDate(m).getTime() + MATCH_LEN >= now).sort((a, b) => matchDate(a) - matchDate(b));
  };
  let nextM = null, cdTimer = null;
  function tickCountdown() {
    const box = $("#cdTimer");
    if (!box || !nextM) return;
    const diff = matchDate(nextM).getTime() - Date.now();
    if (diff < -MATCH_LEN) { renderNext(); return; }
    const units = box.querySelector(".cd-units"), live = box.querySelector(".cd-live");
    if (diff <= 0) { units.hidden = true; live.hidden = false; return; }
    units.hidden = false; live.hidden = true;
    const set = (k, v) => { box.querySelector(`[data-${k}]`).textContent = pad(v); };
    set("d", Math.floor(diff / 86400000));
    set("h", Math.floor((diff % 86400000) / 3600000));
    set("m", Math.floor((diff % 3600000) / 60000));
    set("s", Math.floor((diff % 60000) / 1000));
  }
  function renderNext() {
    const host = $("#nextMatch");
    if (cdTimer) { clearInterval(cdTimer); cdTimer = null; }
    nextM = upcoming()[0] || null;
    host.innerHTML = "";
    const card = el("div", "cd-card");
    card.append(el("div", "cd-label", "⏱️ " + (selected.size ? t("next_yours") : t("next"))));
    if (!nextM) {
      card.append(el("div", "cd-empty", selected.size ? t("empty_teams") : t("empty_season")));
      host.append(card); return;
    }
    const d = matchDate(nextM);
    const teams = el("div", "cd-match");
    teams.append(teamBadge(nextM.home, true), el("span", "vs", "×"), teamBadge(nextM.away, true));
    const meta = el("div", "cd-meta");
    meta.append(
      el("span", "cd-round", t("round")(nextM.round)),
      el("span", null, `${dowFmt.format(d)} · ${dateFmt.format(d)}`),
      el("span", "cd-time", `🕒 ${timeFmt.format(d)}`));
    const timer = el("div", "cd-timer"); timer.id = "cdTimer";
    const units = el("div", "cd-units");
    ["d", "h", "m", "s"].forEach((k) => {
      const u = el("div", "cd-unit");
      const n = el("span", "cd-num", "00"); n.setAttribute("data-" + k, "");
      u.append(n, el("span", "cd-lbl", t(k)));
      units.append(u);
    });
    const live = el("div", "cd-live", t("live")); live.hidden = true;
    timer.append(units, live);
    card.append(teams, meta, timer, matchActions(nextM));
    host.append(card);
    tickCountdown();
    cdTimer = setInterval(tickCountdown, 1000);
  }

  // ---- اشتراك الفرق ----
  function subLink(teamId) {
    const a = el("a", "sub-team");
    a.href = feedUrl(teamId).replace(/^https?:/, "webcal:");
    a.append(crest(teamId, 22), el("span", null, teamName(teamId)), el("span", "sub-go", "＋ " + t("subscribe")));
    a.addEventListener("click", (e) => {
      if (!/^https?:$/.test(location.protocol)) { e.preventDefault(); toast(t("toast_deploy")); }
    });
    return a;
  }
  function renderSubTeams() {
    const host = $("#subTeams");
    host.innerHTML = "";
    if (!selected.size) { host.append(el("p", "sub-hint", t("sub_pick_first"))); return; }
    R.TEAMS.filter((tm) => selected.has(tm.id)).forEach((tm) => host.append(subLink(tm.id)));
  }

  // ---- إشعار ----
  let toastT = null;
  function toast(msg) {
    const el2 = $("#toast");
    el2.textContent = msg; el2.classList.add("show");
    if (toastT) clearTimeout(toastT);
    toastT = setTimeout(() => el2.classList.remove("show"), 3200);
  }

  // ---- ربط الأزرار ----
  function wire() {
    $("#langBtn").addEventListener("click", () => {
      lang = isAr() ? "en" : "ar"; save(S.lang, lang);
      buildFormatters(); renderAll();
    });
    $("#selectAll").addEventListener("click", () => {
      selected = new Set(R.TEAMS.map((tm) => tm.id)); save(S.teams, [...selected]);
      renderTeams(); renderMatches(); renderNext(); renderSummary(); renderSubTeams();
    });
    $("#clearAll").addEventListener("click", () => {
      selected = new Set(); save(S.teams, []);
      renderTeams(); renderMatches(); renderNext(); renderSummary(); renderSubTeams();
    });
    $("#onlyToggle").addEventListener("click", () => {
      myOnly = !myOnly; save(S.only, myOnly); renderMatches();
    });
    $("#bulkBtn").addEventListener("click", () => {
      const ms = selectedMatches(); if (ms.length) downloadICS(ms, "roshn-my-teams-2026-2027.ics");
    });
    $("#subAll").addEventListener("click", () => {
      if (!/^https?:$/.test(location.protocol)) { toast(t("toast_deploy")); return; }
      location.href = feedUrl().replace(/^https?:/, "webcal:");
    });
    $("#subCopy").addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(feedUrl()); toast(t("toast_copied")); }
      catch { toast(feedUrl()); }
    });
    $("#subDl").addEventListener("click", () => downloadICS(R.FIXTURES, "roshn-2026-2027-full.ics"));
  }

  function renderAll() {
    renderChrome(); renderTeams(); renderNext(); renderMatches(); renderSummary(); renderSubTeams();
  }

  function init() {
    buildFormatters();
    wire();
    renderAll();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
