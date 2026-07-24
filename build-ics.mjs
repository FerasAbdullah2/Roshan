/* يبني ملف الموسم الكامل roshn-2026-2027.ics من data.js + schedule.js
   للتشغيل:  node build-ics.mjs   (يُستخدم لملف الاشتراك التلقائي) */
import { readFileSync, writeFileSync } from "node:fs";
import vm from "node:vm";

const ctx = { window: {} };
vm.createContext(ctx);
for (const f of ["data.js", "schedule.js"]) {
  vm.runInContext(readFileSync(new URL(f, import.meta.url), "utf8"), ctx);
}
const R = ctx.window.ROSHN;
const HOUR = 3600000, MATCH_LEN = 2 * HOUR;
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
const lines = [
  "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Roshn League Calendar//AR//",
  "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
  `X-WR-CALNAME:دوري روشن ${R.SEASON.seasonLabel}`,
  `X-WR-TIMEZONE:${R.SEASON.timezone}`,
];
for (const m of R.FIXTURES) {
  const s = matchDate(m), e = new Date(s.getTime() + MATCH_LEN);
  const desc = `الجولة ${m.round} من دوري روشن السعودي ${R.SEASON.seasonLabel}` +
    (m.confirmed ? "" : " (موعد مبدئي — راجع الجدول الرسمي)");
  lines.push("BEGIN:VEVENT", `UID:roshn-${m.id}@roshn-calendar`,
    `DTSTAMP:${icsUTC(now)}`, `DTSTART:${icsUTC(s)}`, `DTEND:${icsUTC(e)}`,
    `SUMMARY:${esc(name(m.home) + " × " + name(m.away) + " — دوري روشن")} (ج${m.round})`,
    `LOCATION:${esc(loc(m))}`, `DESCRIPTION:${esc(desc)}`, "END:VEVENT");
}
lines.push("END:VCALENDAR");
writeFileSync(new URL("roshn-2026-2027.ics", import.meta.url), lines.join("\r\n") + "\r\n");
console.log("wrote roshn-2026-2027.ics with", R.FIXTURES.length, "events");
