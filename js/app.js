// ══════════════════════════════════════════════════════════════════════════════
// SCENARIO STATE
// ══════════════════════════════════════════════════════════════════════════════

var scState = {
  A: { geo: 'RU', src: 'facebook', ftd: 100, model: 'rs' },
  B: { geo: 'EG', src: 'telegram', ftd: 100, model: 'rs' },
};

// ══════════════════════════════════════════════════════════════════════════════
// SCENARIO HELPERS
// ══════════════════════════════════════════════════════════════════════════════

function buildScGeoGrid(ab) {
  var sc = scState[ab];
  document.getElementById('sc' + ab + 'Geo').innerHTML =
    Object.entries(GEO_DATA).map(function(entry) {
      var k=entry[0], v=entry[1];
      return '<button class="sc-geo-btn ' + (k === sc.geo ? 'active' : '') + '" onclick="setScGeo(\'' + ab + '\',\'' + k + '\')">' + geoLabel(k) + '</button>';
    }).join('');
}

function setScGeo(ab, geo) {
  scState[ab].geo = geo;
  var g = GEO_DATA[geo];
  if (scState[ab].model === 'cpa' && !g.cpaAllowed) scState[ab].model = 'rs';
  buildScGeoGrid(ab);
  updateScModelBtns(ab);
  renderScenarios();
}

function setScModel(ab, model) {
  var g = GEO_DATA[scState[ab].geo];
  if (model === 'cpa' && !g.cpaAllowed) return;
  scState[ab].model = model;
  updateScModelBtns(ab);
  renderScenarios();
}

function updateScModelBtns(ab) {
  var sc = scState[ab];
  var g  = GEO_DATA[sc.geo];
  var map = { rs: 'RS', cpa: 'CPA', hybrid: 'Hybrid' };
  ['rs', 'cpa', 'hybrid'].forEach(function(m) {
    var btn = document.getElementById('sc' + ab + 'Btn' + map[m]);
    if (!btn) return;
    btn.className = 'sc-model-btn' + (m === sc.model ? ' active-' + m : '');
    btn.disabled  = (m === 'cpa' && !g.cpaAllowed);
  });
}

function onScSlider(ab) {
  var val = +document.getElementById('sc' + ab + 'Ftd').value;
  scState[ab].ftd = val;
  document.getElementById('sc' + ab + 'FtdLbl').textContent = val;
  renderScenarios();
}

function calcScenario(sc) {
  var geo = GEO_DATA[sc.geo];
  var src = SRC_DATA[sc.src] || SRC_DATA.facebook;
  var qual = src.qual;
  var ftd  = sc.ftd;
  var promoFactor = 1 - (state.promoLoad / 100);

  var aNgr1m  = geo.ngr1m  * qual * promoFactor;
  var aNgr3m  = geo.ngr3m  * qual * promoFactor;
  var aNgr6m  = geo.ngr6m  * qual * promoFactor;
  var aNgr12m = geo.ngr12m * qual * promoFactor;

  var rsRate = getTierRate(geo, ftd);
  var earn1m=0, earn3m=0, earn6m=0, earn12m=0, modelLabel='';

  if (sc.model === 'rs') {
    earn1m  = ftd * aNgr1m  * (rsRate/100);
    earn3m  = ftd * aNgr3m  * (rsRate/100);
    earn6m  = ftd * aNgr6m  * (rsRate/100);
    earn12m = ftd * aNgr12m * (rsRate/100);
    modelLabel = 'RS ' + rsRate + '%';
  } else if (sc.model === 'cpa') {
    var rate = geo.cpaRates ? geo.cpaRates[0].rate : 20;
    earn1m = earn3m = earn6m = earn12m = ftd * rate;
    modelLabel = 'CPA $' + rate;
  } else if (sc.model === 'hybrid') {
    var h = (geo.hybridAllowed && geo.hybridRate) ? geo.hybridRate : { cpa: state.hybridCpa, rs: state.hybridRs };
    var cpaP = ftd * h.cpa;
    earn1m  = cpaP + ftd * aNgr1m  * (h.rs/100);
    earn3m  = cpaP + ftd * aNgr3m  * (h.rs/100);
    earn6m  = cpaP + ftd * aNgr6m  * (h.rs/100);
    earn12m = cpaP + ftd * aNgr12m * (h.rs/100);
    modelLabel = 'Hybrid $' + h.cpa + '+' + h.rs + '%';
  }

  return { geo:geo, src:src, ftd:ftd, qual:qual, earn1m:earn1m, earn3m:earn3m, earn6m:earn6m, earn12m:earn12m, modelLabel:modelLabel };
}

// ══════════════════════════════════════════════════════════════════════════════
// ONBOARDING TOUR
// ══════════════════════════════════════════════════════════════════════════════

var TOUR_TARGETS = [null, 'geoGrid', 'srcSelect', 'btnRS', 'heroEarn'];

function startTour() {
  tourStep = 0;
  document.querySelectorAll('.panel').forEach(function(p) { p.classList.remove('active'); });
  document.getElementById('panel-calc').classList.add('active');
  document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
  document.getElementById('tab-calc').classList.add('active');
  // Show all tour elements
  document.getElementById('tourBackdrop').style.display = '';
  document.getElementById('tourSpotlight').style.display = '';
  document.getElementById('tourTooltip').style.display = '';
  showTourStep(0);
}

function showTourStep(step) {
  var L = LANG[currentLang] || LANG.en;
  var steps = L.tourSteps;
  if (!steps || step >= steps.length) { skipTour(); return; }
  tourStep = step;

  // Content
  document.getElementById('tourTitle').textContent = steps[step].title;
  document.getElementById('tourText').textContent  = steps[step].text;
  document.getElementById('tourSkipBtn').textContent = L.tourSkip || 'Пропустить';
  document.getElementById('tourNextBtn').textContent =
    step >= steps.length - 1 ? (L.tourFinish || 'Готово!') : (L.tourNext || 'Далее →');

  // Progress bar
  var pct = Math.round(((step + 1) / steps.length) * 100);
  document.getElementById('tourProgress').innerHTML =
    '<div class="tour-progress-track"><div class="tour-progress-fill" style="width:' + pct + '%"></div></div>' +
    '<span class="tour-progress-label">' + (step + 1) + ' / ' + steps.length + '</span>';

  // Remove old highlight
  document.querySelectorAll('.tour-hl').forEach(function(e) { e.classList.remove('tour-hl'); });

  var spotlight = document.getElementById('tourSpotlight');
  var targetId  = TOUR_TARGETS[step] || null;

  if (targetId) {
    var el = document.getElementById(targetId);
    if (el) {
      // Scroll target to center instantly then measure
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('tour-hl');

      setTimeout(function() {
        var r   = el.getBoundingClientRect();
        var pad = 10;
        // Clamp so spotlight doesn't go off-screen
        var sLeft   = Math.max(r.left - pad, 0);
        var sTop    = Math.max(r.top  - pad, 0);
        var sWidth  = Math.min(r.width  + pad * 2, window.innerWidth);
        var sHeight = r.height + pad * 2;

        spotlight.style.cssText =
          'display:block;position:fixed;' +
          'left:' + sLeft + 'px;top:' + sTop + 'px;' +
          'width:' + sWidth + 'px;height:' + sHeight + 'px;' +
          'border-radius:12px;' +
          'box-shadow:0 0 0 9999px rgba(0,0,0,.72),0 0 0 2.5px #00d4aa,0 0 20px rgba(0,212,170,.4);' +
          'transition:left .35s ease,top .35s ease,width .35s ease,height .35s ease;';
      }, 300);
      return;
    }
  }

  // No target — hide spotlight, show centered
  spotlight.style.cssText =
    'display:block;position:fixed;left:50%;top:50%;width:0;height:0;' +
    'box-shadow:0 0 0 9999px rgba(0,0,0,.72);border-radius:0;';
}

function tourNext() {
  var L = LANG[currentLang] || LANG.en;
  var steps = L.tourSteps || [];
  if (tourStep >= steps.length - 1) {
    skipTour();
  } else {
    showTourStep(tourStep + 1);
  }
}

function skipTour() {
  document.getElementById('tourBackdrop').style.display  = 'none';
  document.getElementById('tourSpotlight').style.display = 'none';
  document.getElementById('tourTooltip').style.display   = 'none';
  document.querySelectorAll('.tour-hl').forEach(function(e) { e.classList.remove('tour-hl'); });
  localStorage.setItem('calc_tour_done', '1');
}

// ══════════════════════════════════════════════════════════════════════════════
// GEO & MODEL CONTROLS
// ══════════════════════════════════════════════════════════════════════════════

function buildGeoGrid() {
  document.getElementById('geoGrid').innerHTML = Object.entries(GEO_DATA).map(function(entry) {
    var k=entry[0], v=entry[1];
    return '<button class="geo-btn ' + (k===state.geo?'active':'') + '" onclick="setGeo(\'' + k + '\')">' + geoLabel(k) + '</button>';
  }).join('');
}

function setGeo(k) {
  state.geo = k;
  var geo = GEO_DATA[k];
  if (state.model === 'cpa' && !geo.cpaAllowed) state.model = 'rs';
  buildGeoGrid();
  updateModelBtns();
  renderAll();
}

function setModel(m) {
  var geo = GEO_DATA[state.geo];
  if (m === 'cpa' && !geo.cpaAllowed) return;
  state.model = m;
  updateModelBtns();
  renderAll();
}

function updateModelBtns() {
  var geo = GEO_DATA[state.geo];
  var idMap = {rs:'btnRS', cpa:'btnCPA', hybrid:'btnHybrid'};
  ['rs','cpa','hybrid'].forEach(function(m) {
    var btn = document.getElementById(idMap[m]);
    if (!btn) return;
    btn.classList.toggle('active', m === state.model);
    if (m === 'cpa') btn.disabled = !geo.cpaAllowed;
    if (m === 'hybrid') btn.disabled = false;
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SOURCE CONTROLS
// ══════════════════════════════════════════════════════════════════════════════

function onSrcChange() {
  state.src = document.getElementById('srcSelect').value;
  state.srcCustom = { c2r: null, r2d: null, qual: null };
  state.cpc = null;
  var panel = document.getElementById('srcEditPanel');
  if (panel) panel.style.display = 'none';
  syncCpcSliders();
  renderAll();
}

function toggleSrcEdit() {
  var panel = document.getElementById('srcEditPanel');
  var isOpen = panel.style.display !== 'none';
  if (!isOpen) {
    var m = getSrcMetrics();
    document.getElementById('srcEditQual').value = m.qual;
    document.getElementById('srcEditC2R').value  = m.c2r;
    document.getElementById('srcEditR2D').value  = m.r2d;
    document.getElementById('srcEditQualLbl').textContent = m.qual.toFixed(2) + 'x';
    document.getElementById('srcEditC2RLbl').textContent  = fmtP(m.c2r);
    document.getElementById('srcEditR2DLbl').textContent  = fmtP(m.r2d);
    var note = document.getElementById('funnelModeNote');
    if (note) note.style.color = state.inputMode === 'clicks' ? 'var(--green)' : 'var(--muted)';
  }
  panel.style.display = isOpen ? 'none' : '';
}

function onSrcCustom() {
  var c2r  = +document.getElementById('srcEditC2R').value;
  var r2d  = +document.getElementById('srcEditR2D').value;
  var qual = +document.getElementById('srcEditQual').value;
  state.srcCustom = { c2r: c2r, r2d: r2d, qual: qual };
  document.getElementById('srcEditC2RLbl').textContent  = fmtP(c2r);
  document.getElementById('srcEditR2DLbl').textContent  = fmtP(r2d);
  document.getElementById('srcEditQualLbl').textContent = qual.toFixed(2) + 'x';
  renderAll();
}

function resetSrcCustom() {
  state.srcCustom = { c2r: null, r2d: null, qual: null };
  document.getElementById('srcEditPanel').style.display = 'none';
  renderAll();
}

// ══════════════════════════════════════════════════════════════════════════════
// INPUT MODE & SLIDERS
// ══════════════════════════════════════════════════════════════════════════════

function setInputMode(mode) {
  if (mode === 'clicks' && state.inputMode === 'ftd') {
    var src = getSrcMetrics();
    var regsEst = state.ftd / (src.r2d / 100);
    var clicksEst = Math.round(regsEst / (src.c2r / 100));
    state.clicks = Math.min(Math.max(clicksEst, 100), 200000);
    var sl = document.getElementById('clicksSlider');
    if (sl) sl.value = state.clicks;
  }
  state.inputMode = mode;
  document.getElementById('inputFtdBlock').style.display    = mode === 'ftd'    ? '' : 'none';
  document.getElementById('inputClicksBlock').style.display = mode === 'clicks' ? '' : 'none';
  document.getElementById('modeFtdBtn').classList.toggle('active', mode === 'ftd');
  document.getElementById('modeClicksBtn').classList.toggle('active', mode === 'clicks');
  syncCpcSliders();
  renderAll();
}

function onFtdSlider() {
  state.ftd = +document.getElementById('ftdSlider').value;
  document.getElementById('ftdLabel').textContent = state.ftd;
  renderAll();
}

function onRsSlider() {
  state.rsRate = +document.getElementById('rsSlider').value;
  renderAll();
}

function onPromoSlider() {
  state.promoLoad = +document.getElementById('promoSlider').value;
  document.getElementById('promoLoadLabel').textContent = state.promoLoad + '%';
  renderAll();
}

function onSubSlider() {
  state.subCount = +document.getElementById('subCountSlider').value;
  state.subFtd   = +document.getElementById('subFtdSlider').value;
  state.subPct   = +document.getElementById('subPctSlider').value;
  document.getElementById('subCountLabel').textContent = state.subCount;
  document.getElementById('subFtdLabel').textContent   = state.subFtd;
  document.getElementById('subPctLabel').textContent   = state.subPct + '%';
  renderSubAff(calc());
}

function onClicksSlider() {
  state.clicks = +document.getElementById('clicksSlider').value;
  document.getElementById('clicksLabel').textContent = fmt(state.clicks);
  renderAll();
}

function onBudgetSlider() {
  state.adBudget = +document.getElementById('budgetSlider').value;
  document.getElementById('budgetLabel').textContent = fmtU(state.adBudget);
  renderROI(calc());
}

function onCpcSlider() {
  state.cpc = +document.getElementById('cpcSlider').value;
  document.getElementById('cpcLabel').textContent = fmtU(state.cpc, 2);
  renderROI(calc());
}

function onCpcSliderAuto() {
  state.cpc = +document.getElementById('cpcSliderAuto').value;
  document.getElementById('cpcLabelAuto').textContent = fmtU(state.cpc, 2);
  renderROI(calc());
}

function toggleBudget() {
  state.showBudget = !state.showBudget;
  document.getElementById('budgetBlock').style.display = state.showBudget ? '' : 'none';
  document.getElementById('budgetToggleIcon').textContent = state.showBudget ? t('roiCollapse') : t('roiExpand');
  if (state.showBudget) { syncCpcSliders(); renderROI(calc()); }
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB SWITCHING
// ══════════════════════════════════════════════════════════════════════════════

function switchTab(tab) {
  document.querySelectorAll('.panel').forEach(function(p) { p.classList.remove('active'); });
  document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
  document.getElementById('panel-'+tab).classList.add('active');
  var tabBtn = document.getElementById('tab-'+tab);
  if (tabBtn) tabBtn.classList.add('active');
  renderAll();
  renderWhy();
  if (tab === 'scenarios') renderScenarios();
}

// ══════════════════════════════════════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════════════════════════════════════

(function init() {
  // Telegram Mini App init
  try {
    var tg = window.Telegram && window.Telegram.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      // Push content above Telegram's bottom bar
      var safeBottom = (tg.safeAreaInset && tg.safeAreaInset.bottom) || 0;
      if (safeBottom > 0) {
        document.body.style.paddingBottom = safeBottom + 'px';
      }
    }
  } catch(e) {}

  // Restore language preference
  var L = LANG[currentLang] || LANG.en;
  var headerSubEl = document.getElementById('headerSub');
  if (headerSubEl) headerSubEl.textContent = L.headerSub;
  document.querySelectorAll('.lang-btn').forEach(function(b) {
    b.classList.toggle('active', b.textContent.toLowerCase() === currentLang.toLowerCase());
  });

  // Apply data-i18n attributes (handles all spans including tab buttons)
  applyI18n();

  buildGeoGrid();
  updateModelBtns();
  state.src = document.getElementById('srcSelect').value;

  buildScGeoGrid('A');
  buildScGeoGrid('B');
  updateScModelBtns('A');
  updateScModelBtns('B');

  renderAll();
  renderWhy();
  renderScenarios();

  if (!localStorage.getItem('calc_tour_done')) {
    setTimeout(startTour, 1200);
  }

  // ── Live counter ──
  (function() {
    var count = Math.floor(Math.random() * 10) + 18; // 18–27
    var el = document.getElementById('liveCount');
    if (el) el.textContent = count;
    setInterval(function() {
      count = Math.max(11, Math.min(41, count + Math.floor(Math.random() * 5) - 2));
      var e = document.getElementById('liveCount');
      if (e) e.textContent = count;
    }, 15000);
  })();

  // ── Slot auto-popup after 5s (once per session) ──
  if (!sessionStorage.getItem('slot_shown')) {
    setTimeout(function() {
      sessionStorage.setItem('slot_shown', '1');
      openSlot();
    }, 5000);
  }
})();

// ══════════════════════════════════════════════════════════════════════════════
// SLOT MACHINE
// ══════════════════════════════════════════════════════════════════════════════

var _slotSpun = false;
var _SLOT_EMOJIS = ['🍋','🍊','🍇','⭐','🔔','7️⃣'];
var _SLOT_WIN_EMOJI = '💎';

function openSlot() {
  var w = document.getElementById('slotWidget');
  if (!w) return;
  w.style.display = 'flex';
  // Re-apply i18n for slot texts
  w.querySelectorAll('[data-i18n]').forEach(function(el) {
    var key = el.getAttribute('data-i18n');
    var val = t(key);
    if (val && val !== key) el.textContent = val;
  });
}

function closeSlot() {
  var w = document.getElementById('slotWidget');
  if (w) w.style.display = 'none';
}

function spinSlot() {
  if (_slotSpun) return;
  var btn = document.getElementById('slotSpinBtn');
  if (btn) btn.disabled = true;

  var reelIds = ['reel0','reel1','reel2'];
  var intervals = [];

  // Start spinning all reels
  reelIds.forEach(function(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('win');
    el.classList.add('spinning');
    var iv = setInterval(function() {
      el.textContent = _SLOT_EMOJIS[Math.floor(Math.random() * _SLOT_EMOJIS.length)];
    }, 80);
    intervals.push(iv);
  });

  // Stop reels one by one → all land on 💎
  var stopAt = [700, 1150, 1600];
  reelIds.forEach(function(id, i) {
    setTimeout(function() {
      clearInterval(intervals[i]);
      var el = document.getElementById(id);
      if (el) {
        el.textContent = _SLOT_WIN_EMOJI;
        el.classList.remove('spinning');
        setTimeout(function() { el.classList.add('win'); }, 50);
      }
      // After last reel stops — show win message
      if (i === reelIds.length - 1) {
        _slotSpun = true;
        setTimeout(function() {
          var res = document.getElementById('slotResult');
          if (res) res.textContent = t('slotWin');
          var footer = document.getElementById('slotFooter');
          if (footer) {
            footer.innerHTML = '<a href="https://t.me/ivan_lilbet" target="_blank">' + t('slotWinCta') + ' →</a>';
          }
        }, 350);
      }
    }, stopAt[i]);
  });
}
