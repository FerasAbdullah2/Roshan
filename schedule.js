/* =====================================================================
   مولّد الجدول — يبني 34 جولة من الفرق الـ18 (ذهاب وإياب).
   الجولة الأولى تُبنى من المواجهات المؤكدة رسمياً.
   باقي الجولات مولّدة تلقائياً (مبدئية) بطريقة الروبن-روبن الدائرية.
   ===================================================================== */
(function () {
  const R = window.ROSHN;
  const DAY = 86400000;

  const parseUTC = (s) => {
    const [y, m, d] = s.split("-").map(Number);
    return Date.UTC(y, m - 1, d);
  };

  // تواريخ بداية كل جولة (الخميس عادةً)، مع تخطّي التوقف الشتوي
  function roundStartDates() {
    const dates = [];
    let cursor = parseUTC(R.SEASON.startDate);
    const bStart = parseUTC(R.SEASON.winterBreakStart);
    const bResume = parseUTC(R.SEASON.winterBreakResume);
    for (let r = 0; r < R.SEASON.rounds; r++) {
      if (cursor >= bStart && cursor < bResume) cursor = bResume;
      dates.push(cursor);
      cursor += 7 * DAY;
    }
    return dates;
  }

  // طريقة الدائرة: تُرجع (n-1) جولة، كل جولة قائمة أزواج [homeId, awayId]
  function circleMethod(teamIds) {
    const n = teamIds.length;
    const idx = [...Array(n).keys()];
    const rounds = [];
    for (let r = 0; r < n - 1; r++) {
      const pairs = [];
      for (let i = 0; i < n / 2; i++) {
        let a = idx[i], b = idx[n - 1 - i];
        if (r % 2 === 1) [a, b] = [b, a]; // موازنة الأرض
        pairs.push([teamIds[a], teamIds[b]]);
      }
      rounds.push(pairs);
      idx.splice(1, 0, idx.pop()); // تدوير مع تثبيت الأول
    }
    return rounds;
  }

  // أوقات المباريات داخل الجولة (توقيت السعودية): [إزاحة اليوم، الوقت]
  const SLOTS = [
    [0, "18:00"], [0, "20:00"], [0, "21:15"],
    [1, "18:15"], [1, "20:00"], [1, "21:15"],
    [2, "18:00"], [2, "20:00"], [2, "21:15"],
  ];

  const fmtDate = (ms) => {
    const d = new Date(ms);
    const p = (x) => String(x).padStart(2, "0");
    return `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())}`;
  };

  function build() {
    const ids = R.TEAMS.map((t) => t.id);

    // مواجهات الجولة الأولى: المؤكدة رسمياً + تعبئة الباقي (مبدئية)
    const used = new Set();
    const round1Pairs = [];
    R.CONFIRMED_ROUND1.forEach((m) => {
      round1Pairs.push([m.home, m.away]);
      used.add(m.home); used.add(m.away);
    });
    const rest = ids.filter((id) => !used.has(id));
    for (let i = 0; i < rest.length; i += 2) {
      round1Pairs.push([rest[i], rest[i + 1]]);
    }

    // بذر ترتيب الفرق بحيث تُنتج طريقة الدائرة الجولةَ الأولى المطلوبة
    // مع الحفاظ على دوري ذهاب وإياب مثالي (كل زوج يلتقي مرتين بالضبط).
    const seed = new Array(ids.length);
    round1Pairs.forEach(([h, a], i) => {
      seed[i] = h;
      seed[ids.length - 1 - i] = a;
    });

    const firstLeg = circleMethod(seed);          // 17 جولة (الجولة 1 = المطلوبة)
    const secondLeg = firstLeg.map((pairs) =>     // 17 جولة (عكس الأرض)
      pairs.map(([h, a]) => [a, h])
    );
    const allRounds = [...firstLeg, ...secondLeg]; // 34 جولة

    const round1Confirmed = new Set(
      R.CONFIRMED_ROUND1.map((m) => m.home + ">" + m.away)
    );

    const starts = roundStartDates();
    const manual = new Map(
      (R.MANUAL_FIXTURES || []).map((m) => [m.round + ":" + m.home + ">" + m.away, m])
    );

    const fixtures = [];
    let gid = 0;
    allRounds.forEach((pairs, ri) => {
      const roundNo = ri + 1;
      pairs.forEach((pair, mi) => {
        const [home, away] = pair;
        const [dayOff, time] = SLOTS[mi % SLOTS.length];
        const dateStr = fmtDate(starts[ri] + dayOff * DAY);
        let confirmed = roundNo === 1 && round1Confirmed.has(home + ">" + away);
        let finalDate = dateStr, finalTime = time;

        const mkey = roundNo + ":" + home + ">" + away;
        const mkeyRev = roundNo + ":" + away + ">" + home;
        const override = manual.get(mkey) || manual.get(mkeyRev);
        if (override) {
          finalDate = override.date || finalDate;
          finalTime = override.time || finalTime;
          confirmed = override.confirmed !== false;
        }

        fixtures.push({
          id: "m" + gid++,
          round: roundNo,
          home, away,
          date: finalDate,
          time: finalTime,
          confirmed,
        });
      });
    });

    return fixtures;
  }

  R.FIXTURES = build();
  R.teamById = Object.fromEntries(R.TEAMS.map((t) => [t.id, t]));
})();
