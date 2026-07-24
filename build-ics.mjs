/* يبني ملفات الاشتراك من data.js + schedule.js:
   - roshn-2026-2027.ics        (كل الموسم)
   - feeds/<teamId>.ics          (مباريات كل فريق — للاشتراك بفريق واحد)
   يستخدم SEQUENCE = SEASON.revision ليجعل تقويمات المشتركين تتحدّث تلقائياً.
   للتشغيل:  node build-ics.mjs
   Build subscription feeds (full season + one per team). Run after editing data.js. */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import vm from "node:vm";

const ctx = { window: {} };
vm.createContext(ctx);
for (const f of ["data.js", "schedule.js"]) {
  vm.runInContext(readFileSync(new URL(f, import.meta.url), "utf8"), ctx);
}
const R = ctx.window.ROSHN;
const HOUR = 3600000, MATCH_LEN = 2 * HOUR, REV = R.SEASON.revision || 0;
const pad = (x) => String(x).padStart(2, "0");
const matchDate = (m) => new Date(`${m.date}T${m.time}:00+03:00`);
const icsUTC = (d) =>
  `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T` +
  `${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
const esc = (s) => String(s).replace(/\\/g, "\\\\").replace(/;/g, "\\;")
  .replace(/,/g, "\\,").replace(/\n/g, "\\n");
const name = (id) => (R.teamById[id] || {}).name || id;
const loc = (m) => { const t = R.teamById[m.home] || {}; return [t.stadium, t.city].filter(Boolean).join("، "); };
const now = new Date("2026-07-24T00:00:00Z"); // ثابت لإنتاج مُعاد إنتاجه

function calendar(matches, calName) {
  const lines = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Roshn League Calendar//AR//",
    "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
    `X-WR-CALNAME:${calName}`, `X-WR-TIMEZONE:${R.SEASON.timezone}`,
  ];
  for (const m of matches) {
    const s = matchDate(m), e = new Date(s.getTime() + MATCH_LEN);
    const desc = `الجولة ${m.round} من دوري روشن السعودي ${R.SEASON.seasonLabel}` +
      (m.confirmed ? "" : " (موعد مبدئي — راجع الجدول الرسمي)");
    lines.push("BEGIN:VEVENT", `UID:roshn-${m.id}@roshn-calendar`,
      `SEQUENCE:${REV}`, `DTSTAMP:${icsUTC(now)}`, `LAST-MODIFIED:${icsUTC(now)}`,
      `DTSTART:${icsUTC(s)}`, `DTEND:${icsUTC(e)}`,
      `SUMMARY:${esc(name(m.home) + " × " + name(m.away) + " — دوري روشن")} (ج${m.round})`,
      `LOCATION:${esc(loc(m))}`, `DESCRIPTION:${esc(desc)}`, "END:VEVENT");
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n") + "\r\n";
}

// الموسم كامل
writeFileSync(new URL("roshn-2026-2027.ics", import.meta.url),
  calendar(R.FIXTURES, `دوري روشن ${R.SEASON.seasonLabel}`));

// ملف لكل فريق
mkdirSync(new URL("feeds/", import.meta.url), { recursive: true });
for (const tm of R.TEAMS) {
  const ms = R.FIXTURES.filter((m) => m.home === tm.id || m.away === tm.id);
  writeFileSync(new URL(`feeds/${tm.id}.ics`, import.meta.url),
    calendar(ms, `${tm.name} — دوري روشن ${R.SEASON.seasonLabel}`));
}
console.log(`wrote roshn-2026-2027.ics (${R.FIXTURES.length}) + ${R.TEAMS.length} team feeds · rev ${REV}`);
