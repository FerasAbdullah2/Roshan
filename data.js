/* =====================================================================
   بيانات دوري روشن السعودي 2026 / 2027
   ---------------------------------------------------------------------
   هذا الملف هو "مصدر الحقيقة" الوحيد للبيانات. عدّل عليه بحرية:
   1) TEAMS: قائمة الفرق الـ18 (الاسم، المدينة، الملعب، اللون).
   2) SEASON: معلومات الموسم (تاريخ البداية/النهاية، التوقف الشتوي).
   3) CONFIRMED_ROUND1: مواجهات الجولة الأولى المؤكدة رسمياً.
   4) MANUAL_FIXTURES: أي مباراة رسمية تبي تثبّتها بنفسك (تطغى على المولّدة).

   ملاحظة مهمة: أعلنت الرابطة (حتى تاريخه) مواعيد أول 6 جولات فقط
   ومواجهات الجولة الأولى. باقي المواجهات في هذا التقويم "مبدئية/تجريبية"
   ومولّدة تلقائياً لغرض العرض — استبدلها بالجدول الرسمي فور صدوره.
   ===================================================================== */

// كل الأوقات بتوقيت السعودية (UTC+3)
window.ROSHN = window.ROSHN || {};

window.ROSHN.SEASON = {
  title: "دوري روشن السعودي",
  seasonLabel: "2026 / 2027",
  startDate: "2026-08-13", // انطلاق الموسم (مؤكد)
  endDate: "2027-05-29",   // ختام الموسم (مؤكد)
  rounds: 34,
  // التوقف الشتوي بسبب استضافة كأس آسيا 2027
  winterBreakStart: "2026-12-24",
  winterBreakResume: "2027-02-12",
  timezone: "Asia/Riyadh",
};

/* الفرق الـ18 (الصاعدون: أبها، الفيصلي، الدرعية — بدل الهابطين: النجمة، الأخدود، ضمك)
   abbr  = اختصار يظهر داخل الكرِست (شعار مرسوم)
   color = اللون الأساسي · color2 = اللون الثانوي للكرِست */
window.ROSHN.TEAMS = [
  { id: "hilal",   name: "الهلال",   abbr: "هل", city: "الرياض",   stadium: "ملعب الأول بارك",                 color: "#0b5fc1", color2: "#083f80" },
  { id: "nassr",   name: "النصر",    abbr: "نص", city: "الرياض",   stadium: "ملعب الأول بارك",                 color: "#f5b800", color2: "#1a3f8f" },
  { id: "ittihad", name: "الاتحاد",  abbr: "اح", city: "جدة",      stadium: "ملعب مدينة الملك عبدالله",         color: "#111111", color2: "#f5b800" },
  { id: "ahli",    name: "الأهلي",   abbr: "أه", city: "جدة",      stadium: "ملعب مدينة الملك عبدالله",         color: "#0a8f3c", color2: "#065f27" },
  { id: "shabab",  name: "الشباب",   abbr: "شب", city: "الرياض",   stadium: "ملعب الشباب",                     color: "#c8102e", color2: "#7a0a1c" },
  { id: "qadsiah", name: "القادسية", abbr: "قا", city: "الخبر",    stadium: "ملعب الأمير سعود بن جلوي",         color: "#14377d", color2: "#c9a24b" },
  { id: "ettifaq", name: "الاتفاق",  abbr: "اف", city: "الدمام",   stadium: "ملعب الأمير محمد بن فهد",          color: "#0a7a3c", color2: "#054d24" },
  { id: "taawoun", name: "التعاون",  abbr: "تع", city: "بريدة",    stadium: "ملعب مدينة الملك عبدالله الرياضية", color: "#e11b22", color2: "#8a0f16" },
  { id: "fateh",   name: "الفتح",    abbr: "فت", city: "الأحساء",  stadium: "ملعب الأمير عبدالله بن جلوي",      color: "#12284b", color2: "#0a1730" },
  { id: "khaleej", name: "الخليج",   abbr: "خل", city: "سيهات",    stadium: "ملعب الأمير محمد بن فهد",          color: "#e4002b", color2: "#900019" },
  { id: "riyadh",  name: "الرياض",   abbr: "ري", city: "الرياض",   stadium: "ملعب مدينة الملك فهد الدولي",      color: "#0f8a4d", color2: "#0a5c34" },
  { id: "fayha",   name: "الفيحاء",  abbr: "فح", city: "المجمعة",  stadium: "ملعب الأمير سلطان بن عبدالعزيز",   color: "#1b4fa0", color2: "#0e3068" },
  { id: "kholood", name: "الخلود",   abbr: "خد", city: "الرس",     stadium: "ملعب الخلود",                     color: "#1f7a8c", color2: "#124b57" },
  { id: "orobah",  name: "العروبة",  abbr: "عر", city: "سكاكا",    stadium: "ملعب العروبة",                    color: "#e8622a", color2: "#9c3d13" },
  { id: "neom",    name: "نيوم",     abbr: "نم", city: "نيوم",     stadium: "ملعب نيوم",                       color: "#b48a4a", color2: "#1c1c28" },
  { id: "abha",    name: "أبها",     abbr: "أب", city: "أبها",     stadium: "ملعب الأمير سلطان بن عبدالعزيز",   color: "#5e2b8a", color2: "#3a1758" },
  { id: "faisaly", name: "الفيصلي",  abbr: "في", city: "حرمة",     stadium: "ملعب الأمير سلطان بن عبدالعزيز",   color: "#7a1f2b", color2: "#4a1119" },
  { id: "diriyah", name: "الدرعية",  abbr: "در", city: "الدرعية",  stadium: "ملعب الدرعية",                    color: "#b8863b", color2: "#7a5824" },
];

/* مواجهات الجولة الأولى المؤكدة رسمياً (من إعلان الرابطة) */
window.ROSHN.CONFIRMED_ROUND1 = [
  { home: "hilal",   away: "faisaly" },
  { home: "diriyah", away: "ahli"    },
  { home: "nassr",   away: "fateh"   },
  { home: "ittihad", away: "kholood" },
  { home: "shabab",  away: "qadsiah" },
];

/* مباريات مثبّتة يدوياً (اختياري). كل عنصر:
   { round, home, away, date:"YYYY-MM-DD", time:"HH:mm", confirmed:true }
   أي مباراة هنا تحل محل المباراة المولّدة تلقائياً لنفس الفريقين. */
window.ROSHN.MANUAL_FIXTURES = [
  // مثال:
  // { round: 3, home: "hilal", away: "nassr", date: "2026-08-27", time: "21:00", confirmed: true },
];
