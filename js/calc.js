// ══════════════════════════════════════════════════════════════════════════════
// STATE
// ══════════════════════════════════════════════════════════════════════════════

var state = {
  geo: 'RU',
  src: 'facebook',
  ftd: 100,
  model: 'rs',
  rsRate: 30,
  cpaRateIdx: 0,
  cpaCustom: 30,
  subCount: 3,
  subFtd: 80,
  subPct: 7,
  srcCustom: { c2r: null, r2d: null, qual: null },
  inputMode: 'ftd',
  clicks: 5000,
  adBudget: 500,
  cpc: null,
  showBudget: false,
  hybridCpa: 15,
  hybridRs: 20,
  promoLoad: 20,
};

// ══════════════════════════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════════════════════════

function getSrcMetrics() {
  var s = SRC_DATA[state.src];
  var sc = state.srcCustom;
  return {
    label: s.label,
    note: s.note,
    c2r:  sc.c2r  !== null ? sc.c2r  : s.c2r,
    r2d:  sc.r2d  !== null ? sc.r2d  : s.r2d,
    qual: sc.qual !== null ? sc.qual : s.qual,
    isCustom: sc.c2r !== null || sc.r2d !== null || sc.qual !== null,
  };
}

var fmt = function(n,d){ d=d||0; return n==null||isNaN(n)?'—':n.toLocaleString('ru-RU',{minimumFractionDigits:d,maximumFractionDigits:d}); };
var fmtU = function(n,d){ d=d||0; return isNaN(n)||n==null?'—':'$'+fmt(n,d); };
var fmtP = function(n,d){ d=(d===undefined?1:d); return isNaN(n)||n==null?'—':fmt(n,d)+'%'; };

function getTierRate(geo, ftd) {
  for (var i=0;i<geo.rsTable.length;i++) {
    var t = geo.rsTable[i];
    if (ftd >= t.min && ftd <= t.max) return t.rate;
  }
  return geo.rsTable[geo.rsTable.length-1].rate;
}

function getEffectiveRS(geo, ftd, manualRS) {
  var tierRS = getTierRate(geo, ftd);
  return Math.max(tierRS, manualRS);
}

// NGR interpolation: get incremental per-player NGR for a given lifetime month
function incrNgr(geo, age) {
  var ngr1m=geo.ngr1m, ngr3m=geo.ngr3m, ngr6m=geo.ngr6m, ngr12m=geo.ngr12m;
  if (age === 1) return ngr1m;
  if (age <= 3)  return (ngr3m - ngr1m) / 2;
  if (age <= 6)  return (ngr6m - ngr3m) / 3;
  if (age <= 12) return (ngr12m - ngr6m) / 6;
  return (ngr12m - ngr6m) / 6 * 0.7;
}

// Cumulative NGR from a cohort at given months
function cohortNgr(geo, months) {
  if (months <= 1) return geo.ngr1m;
  if (months <= 3) return geo.ngr3m;
  if (months <= 6) return geo.ngr6m;
  if (months <= 12) return geo.ngr12m;
  return geo.ngr12m;
}

// Monthly RS income in month M, summing all cohorts acquired months 1..M
function rsIncomeMonth(geo, ftd, rsRate, M) {
  var sum = 0;
  for (var k = 1; k <= M; k++) {
    var age = M - k + 1;
    sum += ftd * incrNgr(geo, age) * (rsRate/100);
  }
  return sum;
}

function cpaIncome(geo, ftd, cpaRate) { return ftd * cpaRate; }

// ══════════════════════════════════════════════════════════════════════════════
// CALCULATE
// ══════════════════════════════════════════════════════════════════════════════

function calc() {
  var geo = GEO_DATA[state.geo];
  var src = getSrcMetrics();
  var qual = src.qual;

  var ftd, regs, clicks;
  if (state.inputMode === 'clicks') {
    clicks = state.clicks;
    regs   = Math.round(clicks * (src.c2r / 100));
    ftd    = Math.max(1, Math.round(regs * (src.r2d / 100)));
  } else {
    ftd    = state.ftd;
    regs   = ftd / (src.r2d / 100);
    clicks = Math.round(regs / (src.c2r / 100));
  }

  var promoFactor = 1 - (state.promoLoad / 100);

  var aNgr1m  = geo.ngr1m  * qual * promoFactor;
  var aNgr3m  = geo.ngr3m  * qual * promoFactor;
  var aNgr6m  = geo.ngr6m  * qual * promoFactor;
  var aNgr12m = geo.ngr12m * qual * promoFactor;

  var ggrPerPlayer = geo.ngr1m * qual;

  var effectiveRS = getEffectiveRS(geo, ftd, state.rsRate);
  var brandPenalty = geo.brandTrafficSources && geo.brandTrafficSources.indexOf(state.src) !== -1;
  if (brandPenalty) effectiveRS = Math.min(effectiveRS, 10);

  var monthNgr = ftd * aNgr1m;
  var monthGgr = ftd * ggrPerPlayer;

  var earn1m=0, earn3m=0, earn6m=0, earn12m=0, formula='';

  if (state.model === 'rs') {
    earn1m  = ftd * aNgr1m  * (effectiveRS/100);
    earn3m  = ftd * aNgr3m  * (effectiveRS/100);
    earn6m  = ftd * aNgr6m  * (effectiveRS/100);
    earn12m = ftd * aNgr12m * (effectiveRS/100);
    formula = ftd + ' FTD × NGR/' + t('playerShort') + ' × ' + effectiveRS + '% RS';
  } else if (state.model === 'cpa') {
    var rate = getCpaRate();
    earn1m  = ftd * rate;
    earn3m  = earn1m;
    earn6m  = earn1m;
    earn12m = earn1m;
    formula = ftd + ' FTD × $' + rate + ' — ' + t('formulaCpaSuffix');
  } else if (state.model === 'hybrid') {
    var h = (geo.hybridAllowed && geo.hybridRate)
      ? geo.hybridRate
      : { cpa: state.hybridCpa, rs: state.hybridRs };
    var cpaP = ftd * h.cpa;
    earn1m  = cpaP + ftd * aNgr1m  * (h.rs/100);
    earn3m  = cpaP + ftd * aNgr3m  * (h.rs/100);
    earn6m  = cpaP + ftd * aNgr6m  * (h.rs/100);
    earn12m = cpaP + ftd * aNgr12m * (h.rs/100);
    formula = '$' + h.cpa + '/FTD ' + t('formulaHybridOnce') + ' + ' + h.rs + '% RS';
  }

  return {geo:geo, src:src, ftd:ftd, qual:qual, aNgr1m:aNgr1m, aNgr3m:aNgr3m, aNgr6m:aNgr6m, aNgr12m:aNgr12m,
    monthNgr:monthNgr, monthGgr:monthGgr, ggrPerPlayer:ggrPerPlayer, regs:regs, clicks:clicks,
    effectiveRS:effectiveRS, brandPenalty:brandPenalty,
    earn1m:earn1m, earn3m:earn3m, earn6m:earn6m, earn12m:earn12m, formula:formula};
}

function getCpaRate() {
  var geo = GEO_DATA[state.geo];
  if (geo.cpaRates && geo.cpaRates[state.cpaRateIdx])
    return geo.cpaRates[state.cpaRateIdx].rate;
  return state.cpaCustom;
}
