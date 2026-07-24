/* =====================================================================
   بيانات دوري روشن السعودي 2026 / 2027  ·  Roshn Saudi League data
   ---------------------------------------------------------------------
   عدّل هنا: الفرق، الموسم، المواجهات المؤكدة، والمباريات المثبّتة يدوياً.
   Edit here: teams, season, confirmed fixtures, and manual overrides.

   ★ عند أي تعديل على المواعيد: زِد رقم SEASON.revision بواحد ثم شغّل
     `node build-ics.mjs` — هذا يجعل تقويمات المشتركين تتحدّث تلقائياً.
   ★ When you change any time: bump SEASON.revision, then run
     `node build-ics.mjs` so subscribers' calendars auto-update.
   ===================================================================== */

window.ROSHN = window.ROSHN || {};

window.ROSHN.SEASON = {
  title: "دوري روشن السعودي",
  titleEn: "Roshn Saudi League",
  seasonLabel: "2026 / 2027",
  startDate: "2026-08-13",
  endDate: "2027-05-29",
  rounds: 34,
  winterBreakStart: "2026-12-24",
  winterBreakResume: "2027-02-12",
  timezone: "Asia/Riyadh",
  revision: 1, // ★ زِده عند تحديث المواعيد / bump when times change
};

/* الفرق الـ18 · abbr = اختصار الكرِست · logoUrl = ضع مسار شعار رسمي إن رغبت
   (مثال: "logos/hilal.png") وإلا يُستخدم الكرِست المرسوم بألوان النادي. */
window.ROSHN.TEAMS = [
  { id: "hilal",   name: "الهلال",   nameEn: "Al-Hilal",   abbr: "هل", city: "الرياض",  cityEn: "Riyadh",     stadium: "ملعب الأول بارك",                 color: "#0b5fc1", color2: "#083f80", logoUrl: "" },
  { id: "nassr",   name: "النصر",    nameEn: "Al-Nassr",   abbr: "نص", city: "الرياض",  cityEn: "Riyadh",     stadium: "ملعب الأول بارك",                 color: "#f5b800", color2: "#1a3f8f", logoUrl: "" },
  { id: "ittihad", name: "الاتحاد",  nameEn: "Al-Ittihad", abbr: "اح", city: "جدة",     cityEn: "Jeddah",     stadium: "ملعب مدينة الملك عبدالله",         color: "#111111", color2: "#f5b800", logoUrl: "" },
  { id: "ahli",    name: "الأهلي",   nameEn: "Al-Ahli",    abbr: "أه", city: "جدة",     cityEn: "Jeddah",     stadium: "ملعب مدينة الملك عبدالله",         color: "#0a8f3c", color2: "#065f27", logoUrl: "" },
  { id: "shabab",  name: "الشباب",   nameEn: "Al-Shabab",  abbr: "شب", city: "الرياض",  cityEn: "Riyadh",     stadium: "ملعب الشباب",                     color: "#c8102e", color2: "#7a0a1c", logoUrl: "" },
  { id: "qadsiah", name: "القادسية", nameEn: "Al-Qadsiah", abbr: "قا", city: "الخبر",   cityEn: "Khobar",     stadium: "ملعب الأمير سعود بن جلوي",         color: "#14377d", color2: "#c9a24b", logoUrl: "" },
  { id: "ettifaq", name: "الاتفاق",  nameEn: "Al-Ettifaq", abbr: "اف", city: "الدمام",  cityEn: "Dammam",     stadium: "ملعب الأمير محمد بن فهد",          color: "#0a7a3c", color2: "#054d24", logoUrl: "" },
  { id: "taawoun", name: "التعاون",  nameEn: "Al-Taawoun", abbr: "تع", city: "بريدة",   cityEn: "Buraidah",   stadium: "ملعب مدينة الملك عبدالله الرياضية", color: "#e11b22", color2: "#8a0f16", logoUrl: "" },
  { id: "fateh",   name: "الفتح",    nameEn: "Al-Fateh",   abbr: "فت", city: "الأحساء", cityEn: "Al-Hasa",    stadium: "ملعب الأمير عبدالله بن جلوي",      color: "#12284b", color2: "#0a1730", logoUrl: "" },
  { id: "khaleej", name: "الخليج",   nameEn: "Al-Khaleej", abbr: "خل", city: "سيهات",   cityEn: "Saihat",     stadium: "ملعب الأمير محمد بن فهد",          color: "#e4002b", color2: "#900019", logoUrl: "" },
  { id: "riyadh",  name: "الرياض",   nameEn: "Al-Riyadh",  abbr: "ري", city: "الرياض",  cityEn: "Riyadh",     stadium: "ملعب مدينة الملك فهد الدولي",      color: "#0f8a4d", color2: "#0a5c34", logoUrl: "" },
  { id: "fayha",   name: "الفيحاء",  nameEn: "Al-Fayha",   abbr: "فح", city: "المجمعة", cityEn: "Al-Majmaah", stadium: "ملعب الأمير سلطان بن عبدالعزيز",   color: "#1b4fa0", color2: "#0e3068", logoUrl: "" },
  { id: "kholood", name: "الخلود",   nameEn: "Al-Kholood", abbr: "خد", city: "الرس",    cityEn: "Ar Rass",    stadium: "ملعب الخلود",                     color: "#1f7a8c", color2: "#124b57", logoUrl: "" },
  { id: "orobah",  name: "العروبة",  nameEn: "Al-Orobah",  abbr: "عر", city: "سكاكا",   cityEn: "Sakaka",     stadium: "ملعب العروبة",                    color: "#e8622a", color2: "#9c3d13", logoUrl: "" },
  { id: "neom",    name: "نيوم",     nameEn: "NEOM SC",    abbr: "نم", city: "نيوم",    cityEn: "NEOM",       stadium: "ملعب نيوم",                       color: "#b48a4a", color2: "#1c1c28", logoUrl: "" },
  { id: "abha",    name: "أبها",     nameEn: "Abha",       abbr: "أب", city: "أبها",    cityEn: "Abha",       stadium: "ملعب الأمير سلطان بن عبدالعزيز",   color: "#5e2b8a", color2: "#3a1758", logoUrl: "" },
  { id: "faisaly", name: "الفيصلي",  nameEn: "Al-Faisaly", abbr: "في", city: "حرمة",    cityEn: "Harmah",     stadium: "ملعب الأمير سلطان بن عبدالعزيز",   color: "#7a1f2b", color2: "#4a1119", logoUrl: "" },
  { id: "diriyah", name: "الدرعية",  nameEn: "Al-Diriyah", abbr: "در", city: "الدرعية", cityEn: "Diriyah",    stadium: "ملعب الدرعية",                    color: "#b8863b", color2: "#7a5824", logoUrl: "" },
];

/* الجولة الأولى المؤكدة رسمياً · Officially confirmed Round 1 */
window.ROSHN.CONFIRMED_ROUND1 = [
  { home: "hilal",   away: "faisaly" },
  { home: "diriyah", away: "ahli"    },
  { home: "nassr",   away: "fateh"   },
  { home: "ittihad", away: "kholood" },
  { home: "shabab",  away: "qadsiah" },
];

/* مباريات مثبّتة يدوياً · Manual overrides
   { round, home, away, date:"YYYY-MM-DD", time:"HH:mm", confirmed:true } */
window.ROSHN.MANUAL_FIXTURES = [
  // { round: 3, home: "hilal", away: "nassr", date: "2026-08-27", time: "21:00", confirmed: true },
];
