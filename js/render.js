// ══════════════════════════════════════════════════════════════════════════════
// RENDER FUNCTIONS
// ══════════════════════════════════════════════════════════════════════════════

function renderAll() {
  var c = calc();
  renderCalc(c);
  renderCompare(c);
  renderSubAff(c);
  renderROI(c);
}

function renderCalc(c) {
  var geo=c.geo, src=c.src, ftd=c.ftd, monthNgr=c.monthNgr,
      earn1m=c.earn1m, earn3m=c.earn3m, earn6m=c.earn6m, earn12m=c.earn12m, formula=c.formula,
      regs=c.regs, clicks=c.clicks, effectiveRS=c.effectiveRS,
      aNgr1m=c.aNgr1m, aNgr3m=c.aNgr3m, aNgr6m=c.aNgr6m, aNgr12m=c.aNgr12m;

  // Source stats
  document.getElementById('statC2R').textContent = fmtP(src.c2r);
  document.getElementById('statR2D').textContent = fmtP(src.r2d);
  document.getElementById('statQual').textContent = src.qual.toFixed(2) + 'x';
  document.getElementById('srcNote').textContent = src.note + (src.isCustom ? ' · ✎ метрики изменены' : '');
  var editBtn = document.getElementById('srcEditBtn');
  if (editBtn) editBtn.style.borderColor = src.isCustom ? 'var(--green)' : 'var(--border)';
  if (editBtn) editBtn.style.color = src.isCustom ? 'var(--green)' : 'var(--muted)';

  // Promo note
  var promoEl = document.getElementById('promoNote');
  if (promoEl) {
    var bonus = c.monthGgr - monthNgr;
    promoEl.innerHTML = state.promoLoad === 0
      ? 'Бонусов нет. GGR = NGR = <strong>' + fmtU(c.monthGgr) + '</strong>'
      : 'GGR ' + fmtU(c.monthGgr) + ' − бонусы <strong style="color:var(--red)">' + fmtU(bonus) + '</strong> (' + state.promoLoad + '%) = NGR <strong style="color:var(--green)">' + fmtU(monthNgr) + '</strong>. RS считается от NGR.';
  }

  // Hero
  document.getElementById('heroNgr').textContent = fmtU(monthNgr);
  document.getElementById('heroSub').textContent = geo.label + ' · ' + src.label + ' · промо ' + state.promoLoad + '%';
  document.getElementById('heroEarn').textContent = fmtU(earn1m);
  document.getElementById('heroFormula').textContent = formula;

  // Seasonality notice
  var snEl = document.getElementById('seasonNote');
  if (snEl) { snEl.textContent = t('seasonNote'); }

  // Weekly payout
  var weekly = earn1m / 4.3;
  document.getElementById('weeklyPay').textContent = weekly >= 30 ? fmtU(weekly)+' / нед.' : '⚠ Ниже порога $30';

  // Clicks mode
  if (state.inputMode === 'clicks') {
    var el = document.getElementById('calcFtdDisplay');
    if (el) el.textContent = fmt(ftd) + ' FTD';
    var lbl = document.getElementById('clicksLabel');
    if (lbl) lbl.textContent = fmt(state.clicks);
  }

  // Funnel
  document.getElementById('fClicks').textContent = fmt(Math.round(clicks));
  document.getElementById('fRegs').textContent = fmt(Math.round(regs));
  document.getElementById('fRegPct').textContent = fmtP(src.c2r)+' CR';
  document.getElementById('fFtd').textContent = fmt(ftd);
  document.getElementById('fFtdPct').textContent = fmtP(src.r2d)+' CR';

  // Timeline label
  var tlLabel = document.getElementById('timelineLabel');
  if (tlLabel) {
    if (state.model === 'rs') tlLabel.textContent = 'RS растёт по мере возврата игроков';
    else if (state.model === 'cpa') tlLabel.textContent = 'CPA — разовая выплата, не растёт';
    else tlLabel.textContent = 'Hybrid: CPA разово + RS за возвраты';
  }

  // Timeline
  var periods = [
    ['1 мес', earn1m, monthNgr],
    ['3 мес', earn3m, ftd * c.aNgr3m],
    ['6 мес', earn6m, ftd * c.aNgr6m],
    ['12 мес', earn12m, ftd * c.aNgr12m],
  ];
  document.getElementById('timeline').innerHTML = periods.map(function(p) {
    var per=p[0],e=p[1],n=p[2];
    return '<div class="card-sm" style="text-align:center">' +
      '<div style="font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.07em;margin-bottom:4px">' + per + '</div>' +
      '<div style="font-size:11px;color:var(--muted);margin-bottom:2px">NGR бренда</div>' +
      '<div style="font-size:14px;font-weight:700;color:var(--green)">' + fmtU(n) + '</div>' +
      '<div style="height:1px;background:var(--border);margin:6px 0"></div>' +
      '<div style="font-size:11px;color:var(--muted);margin-bottom:2px">Партнёру</div>' +
      '<div style="font-size:14px;font-weight:700;color:#fff">' + fmtU(e) + '</div>' +
      '</div>';
  }).join('');

  // Player metrics
  document.getElementById('geoNameLabel').textContent = geo.label;
  document.getElementById('playerMetrics').innerHTML =
    '<div class="card-sm" style="text-align:center">' +
      '<div style="font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.07em">Avg FTD</div>' +
      '<div style="font-size:16px;font-weight:700;color:var(--blue);margin-top:4px">' + fmtU(geo.avgFtd) + '</div>' +
      '<div style="font-size:9px;color:var(--muted);margin-top:2px">первый депозит</div>' +
    '</div>' +
    '<div class="card-sm" style="text-align:center">' +
      '<div style="font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.07em">NGR / 1мес</div>' +
      '<div style="font-size:16px;font-weight:700;color:var(--green);margin-top:4px">' + fmtU(c.aNgr1m,0) + '</div>' +
      '<div style="font-size:9px;color:var(--muted);margin-top:2px">на игрока</div>' +
    '</div>' +
    '<div class="card-sm" style="text-align:center">' +
      '<div style="font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.07em">NGR / 6мес</div>' +
      '<div style="font-size:16px;font-weight:700;color:var(--green);margin-top:4px">' + fmtU(c.aNgr6m,0) + '</div>' +
      '<div style="font-size:9px;color:var(--muted);margin-top:2px">когортный</div>' +
    '</div>' +
    '<div class="card-sm" style="text-align:center">' +
      '<div style="font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.07em">LTV / 12мес</div>' +
      '<div style="font-size:16px;font-weight:700;color:var(--yellow);margin-top:4px">' + fmtU(c.aNgr12m,0) + '</div>' +
      '<div style="font-size:9px;color:var(--muted);margin-top:2px">на игрока</div>' +
    '</div>';

  renderModelBlock(c);
  renderTierBlock(c);
  renderGeoAlerts();
}

function renderModelBlock(c) {
  var geo = GEO_DATA[state.geo];
  var realFtd = c.ftd;
  var html = '';

  if (state.model === 'rs') {
    var tierRate = getTierRate(geo, realFtd);
    var applied  = Math.max(tierRate, state.rsRate);
    var hasLadder = geo.rsTable.length > 1;

    var tierNote = '';
    if (hasLadder) {
      if (tierRate > state.rsRate) {
        tierNote = '<div style="font-size:11px;color:var(--green);margin-top:6px">' +
          '📈 Тир по объёму: <strong>' + tierRate + '%</strong> — применяется автоматически (выше согласованного)' +
          '</div>';
      } else if (tierRate < state.rsRate) {
        tierNote = '<div style="font-size:11px;color:var(--muted);margin-top:6px">' +
          'Тир по объёму: ' + tierRate + '%. Применяется согласованная ставка <strong style="color:var(--green)">' + state.rsRate + '%</strong>' +
          '</div>';
      } else {
        tierNote = '<div style="font-size:11px;color:var(--muted);margin-top:6px">Тир совпадает со ставкой: ' + applied + '%</div>';
      }
      tierNote += '<div style="font-size:10px;color:var(--muted);margin-top:6px;padding:8px;background:var(--bg3);border-radius:6px;line-height:1.6">' +
        '<strong>Как работает лесенка:</strong> ставка определяется по количеству FTD <em>в текущем месяце</em>' +
        ' и применяется <em>ко всем FTD</em> этого месяца целиком — не к части.<br>' +
        'Приведи ' + realFtd + ' FTD → ставка <strong>' + applied + '%</strong>.' +
        ' В следующем месяце считается заново.' +
        '</div>';
    }

    html = '<label class="lbl">RevShare % (согласованный): <strong style="color:var(--green)">' + state.rsRate + '%</strong></label>' +
      '<input type="range" id="rsSlider" min="15" max="65" value="' + state.rsRate + '" oninput="onRsSlider()">' +
      '<div class="slider-labels"><span>15% старт</span><span style="color:var(--green)">25–40% основная</span><span>65% топы</span></div>' +
      tierNote;

  } else if (state.model === 'cpa') {
    if (!geo.cpaAllowed) {
      html = '<div class="alert alert-red">⛔ CPA недоступна для этого ГЕО</div>';
    } else if (geo.cpaRates) {
      html = geo.cpaRates.map(function(r,i) {
        return '<label onclick="state.cpaRateIdx=' + i + ';renderAll()" style="display:flex;align-items:center;gap:10px;padding:9px 12px;background:' + (i===state.cpaRateIdx?'rgba(239,68,68,.1)':'var(--bg3)') + ';border:1px solid ' + (i===state.cpaRateIdx?'var(--red)':'var(--border)') + ';border-radius:7px;cursor:pointer;margin-bottom:6px">' +
          '<input type="radio" ' + (i===state.cpaRateIdx?'checked':'') + ' style="accent-color:var(--red)">' +
          '<span style="flex:1;font-size:13px;color:var(--label)">' + r.label + '</span>' +
          '<span style="font-size:17px;font-weight:700;color:var(--red)">$' + r.rate + '</span>' +
          '</label>';
      }).join('');
    } else {
      html = '<div class="alert alert-warn">Ставка CPA для ' + geo.label + ' уточняйте у менеджера</div>' +
        '<label class="lbl">Ставка CPA, $</label>' +
        '<input type="number" value="' + state.cpaCustom + '" min="0" oninput="state.cpaCustom=+this.value;renderAll()">';
    }

  } else if (state.model === 'hybrid') {
    if (geo.hybridAllowed && geo.hybridRate) {
      var h = geo.hybridRate;
      html = '<div class="alert alert-info" style="margin-bottom:10px">' +
        'Официальная гибридная модель: <strong>$' + h.cpa + '/FTD</strong> разово + <strong>' + h.rs + '% RS</strong> от NGR' +
        '</div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:13px">' +
          '<div class="card-sm" style="text-align:center">' +
            '<div style="font-size:10px;color:var(--muted);margin-bottom:3px">CPA часть</div>' +
            '<div style="font-size:18px;font-weight:700;color:var(--red)">$' + h.cpa + '</div>' +
            '<div style="font-size:9px;color:var(--muted)">за каждый FTD (разово)</div>' +
          '</div>' +
          '<div class="card-sm" style="text-align:center">' +
            '<div style="font-size:10px;color:var(--muted);margin-bottom:3px">RS часть</div>' +
            '<div style="font-size:18px;font-weight:700;color:var(--green)">' + h.rs + '%</div>' +
            '<div style="font-size:9px;color:var(--muted)">от NGR игрока ежемесячно</div>' +
          '</div>' +
        '</div>';
    } else {
      html = '<div class="alert alert-info" style="margin-bottom:10px">' +
        'Ручной гибрид: CPA-выплата разово за FTD + RS от NGR каждый месяц' +
        '</div>' +
        '<div class="field">' +
          '<label class="lbl">CPA за каждый FTD: <strong style="color:var(--red)">$' + state.hybridCpa + '</strong></label>' +
          '<input type="range" id="hybridCpaSlider" min="5" max="100" step="1" value="' + state.hybridCpa + '"' +
            ' oninput="state.hybridCpa=+this.value;document.getElementById(\'hybridCpaLbl\').textContent=\'$\'+this.value;renderAll()">' +
          '<div class="slider-labels"><span>$5</span><span>$50</span><span>$100</span></div>' +
        '</div>' +
        '<div class="field">' +
          '<label class="lbl">RS от NGR: <strong style="color:var(--green)" id="hybridRsLbl">' + state.hybridRs + '%</strong></label>' +
          '<input type="range" id="hybridRsSlider" min="5" max="40" step="1" value="' + state.hybridRs + '"' +
            ' oninput="state.hybridRs=+this.value;document.getElementById(\'hybridRsLbl\').textContent=this.value+\'%\';renderAll()">' +
          '<div class="slider-labels"><span>5%</span><span>20%</span><span>40%</span></div>' +
        '</div>' +
        '<div style="font-size:10px;color:var(--muted);margin-top:4px;line-height:1.5">' +
          'CPA выплачивается <strong>один раз</strong> при привлечении FTD.' +
          ' RS начисляется <strong>ежемесячно</strong> пока игрок активен.' +
        '</div>';
    }
  }

  document.getElementById('modelBlock').innerHTML = html;
}

function renderTierBlock(c) {
  var geo = GEO_DATA[state.geo];
  var ftd  = c.ftd;
  var show = state.model === 'rs' || state.model === 'hybrid';

  document.getElementById('tierCard').style.display = show ? '' : 'none';
  document.getElementById('cpaCard').style.display = state.model === 'cpa' ? '' : 'none';

  if (show) {
    document.getElementById('tierGeoLabel').textContent = geo.label;
    var currentTier = null;
    for (var i=0;i<geo.rsTable.length;i++) {
      if (ftd >= geo.rsTable[i].min && ftd <= geo.rsTable[i].max) { currentTier = geo.rsTable[i]; break; }
    }
    if (!currentTier) currentTier = geo.rsTable[geo.rsTable.length-1];
    var curIdx = geo.rsTable.indexOf(currentTier);
    var nextTier = curIdx < geo.rsTable.length-1 ? geo.rsTable[curIdx+1] : null;

    var hasTiers = geo.rsTable.length > 1;
    document.getElementById('tierCard').style.display = (show && hasTiers) ? '' : 'none';

    if (hasTiers) {
      document.getElementById('tierBody').innerHTML = geo.rsTable.map(function(tRow) {
        var isCur = tRow === currentTier;
        return '<tr class="' + (isCur?'cur':'') + '">' +
          '<td>' + tRow.min + ' – ' + (tRow.max===Infinity?'∞':tRow.max) + ' FTD</td>' +
          '<td>' + tRow.rate + '%</td>' +
          '<td style="font-size:11px">' + (isCur ? '← текущий (' + ftd + ' FTD этот месяц)' : '') + '</td>' +
          '</tr>';
      }).join('');

      var toNext = nextTier ? nextTier.min - ftd : 0;
      document.getElementById('tierNote').innerHTML = nextTier
        ? 'Ещё <strong>' + toNext + ' FTD</strong> в этом месяце — и ставка вырастет до <strong style="color:var(--green)">' + nextTier.rate + '%</strong> на весь месяц'
        : '<span style="color:var(--green)">✓ Максимальный тир достигнут</span>';
    }
  }

  if (state.model === 'cpa') {
    var geo2 = GEO_DATA[state.geo];
    document.getElementById('cpaCard').innerHTML = '<div class="sec">CPA условия</div>' +
      (geo2.cpaRates
        ? geo2.cpaRates.map(function(r) {
            return '<div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--border);font-size:13px"><span style="color:var(--muted)">' + r.label + '</span><strong style="color:var(--red)">$' + r.rate + '</strong></div>';
          }).join('') + '<div style="font-size:11px;color:var(--muted);margin-top:8px">Hold: 14 дней</div>'
        : '<div style="font-size:12px;color:var(--muted)">Ставка уточняется у менеджера. Hold: 14 дней.</div>');
  }
}

function renderGeoAlerts() {
  var geo = GEO_DATA[state.geo];
  var src = getSrcMetrics();
  var html = '';
  if (geo.warn) html += '<div class="alert alert-warn">' + geo.warn + '</div>';
  if (geo.brandTrafficSources && geo.brandTrafficSources.indexOf(state.src) !== -1) {
    html += '<div class="alert alert-red">⚠️ Бренд-трафик (' + src.label + ') для Египта: RS применяется как 10% — ограничение программы. Используйте небрендовые ключи или другой источник.</div>';
  }
  document.getElementById('geoAlerts').innerHTML = html;
}

// ── Compare tab ──────────────────────────────────────────────────────────────

function renderCompare(c) {
  var geo = GEO_DATA[state.geo];
  var ftd = c.ftd;
  var rsRate = c.effectiveRS;
  var cpaRate = getCpaRate();
  var qual = c.qual;

  var rsC1  = ftd * geo.ngr1m  * qual * (rsRate/100);
  var rsC3  = ftd * geo.ngr3m  * qual * (rsRate/100);
  var rsC6  = ftd * geo.ngr6m  * qual * (rsRate/100);
  var rsC12 = ftd * geo.ngr12m * qual * (rsRate/100);

  var cpaPaid = ftd * cpaRate;

  var rsM = [0,1,3,6,12].map(function(m) {
    var sum = 0;
    for (var i=1;i<=m;i++) sum += rsIncomeMonth({ngr1m:geo.ngr1m*qual, ngr3m:geo.ngr3m*qual, ngr6m:geo.ngr6m*qual, ngr12m:geo.ngr12m*qual}, ftd, rsRate, i);
    return sum;
  });
  var cpaM = [0,1,3,6,12].map(function(m) { return m * ftd * cpaRate; });

  var beMonth = null;
  for (var m=1;m<=12;m++) {
    var rsV = ftd * cohortNgr(geo, m) * qual * (rsRate/100);
    if (rsV >= cpaPaid) { beMonth = m; break; }
  }

  // Hero
  document.getElementById('cmpHero').innerHTML = [
    {label:'RS партнёру / год', val:fmtU(rsC12), color:'var(--green)', sub:rsRate+'% × LTV когорты'},
    {label:'CPA партнёру разово', val:fmtU(cpaPaid), color:'var(--red)', sub:'$'+cpaRate+' × '+ftd+' FTD'},
    {label:'Разница за год', val:fmtU(rsC12-cpaPaid), color:rsC12>cpaPaid?'var(--green)':'var(--yellow)', sub:rsC12>cpaPaid?'RS выгоднее за год':'CPA даёт больше — игроки не задерживаются долго'},
  ].map(function(m) {
    return '<div class="card" style="border-color:' + m.color + '33;text-align:center">' +
      '<div style="font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px">' + m.label + '</div>' +
      '<div style="font-size:24px;font-weight:800;color:' + m.color + '">' + m.val + '</div>' +
      '<div style="font-size:11px;color:var(--muted);margin-top:4px">' + m.sub + '</div>' +
      '</div>';
  }).join('');

  // Legend
  document.getElementById('cmpLegend').innerHTML =
    '<div style="display:flex;align-items:center;gap:6px"><div style="width:12px;height:3px;background:var(--green);border-radius:2px"></div><span style="font-size:11px;color:var(--muted)">RS ' + rsRate + '% (накопленно с когорты)</span></div>' +
    '<div style="display:flex;align-items:center;gap:6px"><div style="width:12px;height:3px;background:var(--red);border-radius:2px"></div><span style="font-size:11px;color:var(--muted)">CPA $' + cpaRate + ' (одноразово)</span></div>';

  // Chart bars
  var months = [1,2,3,4,5,6,7,8,9,10,11,12];
  var rsVals = months.map(function(m) { return ftd * cohortNgr(geo, m) * qual * (rsRate/100); });
  var cpaVals = months.map(function() { return cpaPaid; });
  var maxVal = Math.max.apply(null, rsVals.concat(cpaVals).concat([1]));

  var gridLines = [0,25,50,75,100];
  document.getElementById('chartGrid').innerHTML = gridLines.map(function(p) {
    return '<div class="chart-gridline" style="bottom:' + p + '%"><span>' + fmtU(maxVal*p/100) + '</span></div>';
  }).join('');

  document.getElementById('chartBars').innerHTML = months.map(function(m,i) {
    return '<div class="chart-col">' +
      '<div class="chart-bar" style="height:' + (rsVals[i]/maxVal*100) + '%;background:rgba(0,212,170,.3);border:1px solid rgba(0,212,170,.5)">' +
        (m===12?'<span class="tip" style="color:var(--green)">' + fmtU(rsVals[i]) + '</span>':'') +
      '</div>' +
      '<div class="chart-bar" style="height:' + (cpaVals[i]/maxVal*100) + '%;background:rgba(239,68,68,.25);border:1px solid rgba(239,68,68,.4)">' +
        (m===12?'<span class="tip" style="color:var(--red)">' + fmtU(cpaVals[i]) + '</span>':'') +
      '</div>' +
    '</div>';
  }).join('');

  document.getElementById('chartX').innerHTML = months.map(function(m) { return '<span>' + m + 'м</span>'; }).join('');

  // Breakeven box
  document.getElementById('beBox').innerHTML = beMonth
    ? '<div class="be-box">💡 RS окупает CPA на <strong>' + beMonth + '-м месяце</strong> — после этого каждый месяц приносит дополнительный доход. Игрок возвращается и проигрывает снова — партнёр получает % каждый раз.</div>'
    : '<div style="margin-top:12px;padding:10px 14px;background:rgba(245,158,11,.08);border:1px solid rgba(245,158,11,.25);border-radius:8px;font-size:12px;color:#fbbf24">' +
       '⚠️ При текущих параметрах CPA даёт больше за 12 месяцев. RS становится выгоднее при повышении ставки до ' + Math.ceil(cpaRate/geo.ngr12m/qual*100) + '%+ или при объёме FTD от ' + (Math.ceil(cpaRate/geo.ngr12m/qual*100) > 35 ? '—' : '300+') + '.' +
     '</div>';

  // Table
  document.getElementById('cmpTable').innerHTML =
    '<thead><tr>' +
      '<th style="text-align:left">Период</th>' +
      '<th style="color:var(--green)">RS (накопленно)</th>' +
      '<th style="color:var(--red)">CPA (разово)</th>' +
      '<th>Разница</th>' +
      '<th>NGR бренда</th>' +
    '</tr></thead>' +
    '<tbody>' + [[1,'1 мес'],[3,'3 мес'],[6,'6 мес'],[12,'12 мес']].map(function(pair) {
      var m=pair[0], lbl=pair[1];
      var rs = ftd * cohortNgr(geo, m) * qual * (rsRate/100);
      var diff = rs - cpaPaid;
      var ngrV = ftd * cohortNgr(geo, m) * qual;
      return '<tr>' +
        '<td>' + lbl + '</td>' +
        '<td class="' + (rs>cpaPaid?'win':'') + '" style="color:var(--green)">' + fmtU(rs) + '</td>' +
        '<td style="color:var(--red)">' + fmtU(cpaPaid) + '</td>' +
        '<td style="color:' + (diff>0?'var(--green)':'var(--yellow)') + '">' + (diff>0?'+':'') + fmtU(diff) + '</td>' +
        '<td style="color:var(--muted)">' + fmtU(ngrV) + '</td>' +
        '</tr>';
    }).join('') +
    '<tr style="border-top:2px solid var(--border)">' +
      '<td colspan="5" style="padding-top:10px;font-size:11px;color:var(--muted);text-align:left">' +
        '* RS считается от накопленного NGR когорты (игроки возвращаются, продолжают играть). CPA выплачивается один раз за FTD.' +
      '</td>' +
    '</tr>' +
    '</tbody>';

  renderRolling(c);

  // RS args
  var rsPct = (rsRate/100);
  document.getElementById('rsArgsList').innerHTML = [
    ['♾️','Пассивный доход с каждого возврата', 'Игрок вернулся через 3 недели и проиграл снова — по CPA партнёр не получит ничего, по RS получит ещё ' + fmtP(rsRate) + ' от его проигрыша.'],
    ['📈','Whale-эффект', 'Крупный игрок с NGR $500/мес даст RS ' + fmtU(500*rsPct) + '/мес. По CPA он стоил бы столько же, сколько игрок с минимальным депозитом.'],
    ['🔒','Нет риска шейва', 'RS считается от реального NGR — всё видно в статистике. CPA легче занижать.'],
    ['📊','Накопительный эффект', 'При стабильном трафике база игроков растёт. К 12-му месяцу ' + ftd + ' FTD ежемесячно дают накопленный пул ~' + fmt(Math.round(ftd * geo.ltMonths * 0.4)) + ' активных игроков.'],
    ['⚡','CPA лучше при коротком горизонте', 'Если партнёр планирует работать 1–3 месяца — CPA выгоднее. RS раскрывается на 6–12+ месяцах.'],
  ].map(function(item) {
    return '<div class="usp-item">' +
      '<div class="usp-icon">' + item[0] + '</div>' +
      '<div><div class="usp-title">' + item[1] + '</div><div class="usp-desc">' + item[2] + '</div></div>' +
      '</div>';
  }).join('');
}

// ── Sub-aff tab ──────────────────────────────────────────────────────────────

function renderSubAff(c) {
  var geo = GEO_DATA[state.geo];
  var subCount=state.subCount, subFtd=state.subFtd, subPct=state.subPct;
  var ngrPerPlayer = c.aNgr1m;
  var totalFtd = subCount * subFtd;
  var totalNgr = totalFtd * ngrPerPlayer;
  var myMonth = totalNgr * (subPct/100);
  var myYear = myMonth * 12;

  document.getElementById('subGeoLabel').textContent = geo.label;
  document.getElementById('subNgrLabel').textContent = fmtU(ngrPerPlayer, 0);

  document.getElementById('subHero').innerHTML = [
    {label:'FTD всей сети / мес', val:fmt(totalFtd), color:'var(--purple)'},
    {label:'Ваш доход / мес', val:fmtU(myMonth), color:'var(--purple)'},
    {label:'Ваш доход / год', val:fmtU(myYear), color:'var(--purple)'},
  ].map(function(m) {
    return '<div class="card-sm" style="text-align:center">' +
      '<div style="font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.07em;margin-bottom:4px">' + m.label + '</div>' +
      '<div style="font-size:20px;font-weight:700;color:' + m.color + '">' + m.val + '</div>' +
      '</div>';
  }).join('');

  document.getElementById('subTable').innerHTML =
    '<thead><tr>' +
      '<th style="text-align:right">Партнёров</th>' +
      '<th style="text-align:right">FTD total</th>' +
      '<th style="text-align:right">NGR сети / мес</th>' +
      '<th style="text-align:right">Ваш ' + subPct + '% / мес</th>' +
      '<th style="text-align:right">Ваш / год</th>' +
    '</tr></thead>' +
    '<tbody>' + [2,5,10,20,50].map(function(n) {
      var f=n*subFtd, ng=f*ngrPerPlayer, mm=ng*(subPct/100);
      var active = Math.abs(n-subCount) <= 2;
      return '<tr style="background:' + (active?'rgba(139,92,246,.08)':'transparent') + '">' +
        '<td style="color:' + (active?'var(--purple)':'var(--muted)') + ';font-weight:' + (active?700:400) + '">' + n + '</td>' +
        '<td>' + fmt(f) + '</td>' +
        '<td>' + fmtU(ng) + '</td>' +
        '<td style="color:var(--purple);font-weight:600">' + fmtU(mm) + '</td>' +
        '<td style="color:var(--purple);font-weight:600">' + fmtU(mm*12) + '</td>' +
        '</tr>';
    }).join('') + '</tbody>';

  document.getElementById('subTips').innerHTML = [
    ['🎯','Качество > количество', 'Один партнёр с 200 FTD выгоднее десяти с 20. Фокусируйся на командах и медиабайерах.'],
    ['📊','Показывай этот калькулятор', 'Партнёр видит реальные цифры — не проценты, а деньги. Это ускоряет принятие решения.'],
    ['🔗','Суб-аффилейт как якорь', 'Партнёр, строящий свою сеть через тебя, не уйдёт — у него двойная мотивация оставаться.'],
    ['📈','Рост ставки как стимул', 'Предлагай повышение RS при масштабировании: 25% → 30% → 35%. Стимул лить больше.'],
  ].map(function(item) {
    return '<div class="usp-item"><div class="usp-icon">' + item[0] + '</div><div><div class="usp-title">' + item[1] + '</div><div class="usp-desc">' + item[2] + '</div></div></div>';
  }).join('');
}

// ── ROI block ────────────────────────────────────────────────────────────────

function getEffectiveCpc() {
  if (state.cpc !== null) return state.cpc;
  return SRC_DATA[state.src].cpc || 0.10;
}

function getEffectiveBudget(c) {
  if (state.inputMode === 'clicks') {
    return c.clicks * getEffectiveCpc();
  }
  return state.adBudget;
}

function syncCpcSliders() {
  var cpc = getEffectiveCpc();
  var sl  = document.getElementById('cpcSlider');
  var sl2 = document.getElementById('cpcSliderAuto');
  var lbl  = document.getElementById('cpcLabel');
  var lbl2 = document.getElementById('cpcLabelAuto');
  if (sl)  sl.value  = cpc;
  if (sl2) sl2.value = cpc;
  if (lbl)  lbl.textContent  = fmtU(cpc, 2);
  if (lbl2) lbl2.textContent = fmtU(cpc, 2);
}

function renderROI(c) {
  if (!state.showBudget) return;

  var isClicksMode = state.inputMode === 'clicks';

  var manualEl = document.getElementById('roiBudgetManual');
  var autoEl   = document.getElementById('roiBudgetAuto');
  if (manualEl) manualEl.style.display = isClicksMode ? 'none' : '';
  if (autoEl)   autoEl.style.display   = isClicksMode ? '' : 'none';

  var cpc    = getEffectiveCpc();
  var budget = getEffectiveBudget(c);
  var earn   = c.earn1m;
  var net    = earn - budget;
  var roi    = budget > 0 ? ((net / budget) * 100) : 0;
  var costPerFtd = budget > 0 ? (budget / Math.max(c.ftd, 1)) : 0;

  if (isClicksMode) {
    var el1 = document.getElementById('autoBudgetClicks');
    var el2 = document.getElementById('autoBudgetCpc');
    var el3 = document.getElementById('autoBudgetTotal');
    if (el1) el1.textContent = fmt(c.clicks);
    if (el2) el2.textContent = fmtU(cpc, 2);
    if (el3) el3.textContent = fmtU(budget);
  }

  var beMonth = null;
  for (var m = 1; m <= 24; m++) {
    var interp = m <= 1 ? c.earn1m : m <= 3 ? c.earn3m*(m/3) : m <= 6 ? c.earn6m*(m/6) : c.earn12m*(m/12);
    if (interp >= budget) { beMonth = m; break; }
  }

  var netClass = net >= 0 ? 'roi-positive' : 'roi-negative';
  var roiClass = roi >= 0 ? 'roi-positive' : 'roi-negative';

  document.getElementById('roiCards').innerHTML =
    '<div class="roi-grid">' +
      '<div class="roi-cell">' +
        '<div class="rc-label">Рекламный бюджет</div>' +
        '<div class="rc-val" style="color:var(--yellow)">' + fmtU(budget) + '</div>' +
      '</div>' +
      '<div class="roi-cell">' +
        '<div class="rc-label">Доход партнёра / мес</div>' +
        '<div class="rc-val" style="color:var(--green)">' + fmtU(earn) + '</div>' +
      '</div>' +
      '<div class="roi-cell highlight">' +
        '<div class="rc-label">Чистая прибыль</div>' +
        '<div class="rc-val ' + netClass + '">' + (net >= 0 ? '+' : '') + fmtU(net) + '</div>' +
      '</div>' +
      '<div class="roi-cell highlight">' +
        '<div class="rc-label">ROI</div>' +
        '<div class="rc-val ' + roiClass + '">' + (roi >= 0 ? '+' : '') + fmt(roi, 0) + '%</div>' +
      '</div>' +
    '</div>' +
    '<div class="roi-grid" style="margin-top:8px">' +
      '<div class="roi-cell">' +
        '<div class="rc-label">Стоимость 1 FTD</div>' +
        '<div class="rc-val" style="color:var(--muted);font-size:14px">' + fmtU(costPerFtd, 1) + '</div>' +
      '</div>' +
      '<div class="roi-cell">' +
        '<div class="rc-label">Окупаемость бюджета</div>' +
        '<div class="rc-val" style="color:var(--blue);font-size:14px">' + (beMonth ? beMonth + ' мес' : '> 24 мес') + '</div>' +
      '</div>' +
    '</div>' +
    '<div style="font-size:10px;color:var(--muted);margin-top:8px;line-height:1.5">' +
      (net >= 0
        ? '✅ Кампания прибыльная. На каждый $1 расходов — $' + (earn/budget).toFixed(2) + ' дохода.'
        : '⚠️ Убыток при текущих параметрах. Попробуй снизить CPC, повысить конверсию или объём.') +
    '</div>';
}

// ── Rolling 12-month forecast ─────────────────────────────────────────────────

function renderRolling(c) {
  var geo = GEO_DATA[state.geo];
  var ftd = c.ftd;
  var rsRate = c.effectiveRS;
  var qual = c.qual;
  var cpaRate = getCpaRate();

  var months = 12;
  var rsMonthly = [];
  var cpaMonthly = [];

  for (var M = 1; M <= months; M++) {
    var rsSum = 0;
    var adjGeo = {ngr1m: geo.ngr1m * qual, ngr3m: geo.ngr3m * qual,
                  ngr6m: geo.ngr6m * qual, ngr12m: geo.ngr12m * qual};
    for (var cohort = 1; cohort <= M; cohort++) {
      var age = M - cohort + 1;
      rsSum += ftd * incrNgr(adjGeo, age) * (rsRate / 100);
    }
    rsMonthly.push(rsSum);
    cpaMonthly.push(ftd * cpaRate);
  }

  var rsCumul = rsMonthly.reduce(function(acc, v) { acc.push((acc[acc.length-1]||0) + v); return acc; }, []);
  var cpaCumul = cpaMonthly.reduce(function(acc, v) { acc.push((acc[acc.length-1]||0) + v); return acc; }, []);

  var maxVal = Math.max.apply(null, rsMonthly.concat(cpaMonthly).concat([1]));

  document.getElementById('rollingDesc').innerHTML =
    'Вы стабильно приводите <strong style="color:var(--green)">' + fmt(ftd) + ' FTD каждый месяц</strong>. ' +
    'Игроки предыдущих месяцев возвращаются и продолжают играть — ' +
    'RS-доход <strong>растёт каждый месяц</strong>, даже если объём трафика не меняется. ' +
    'CPA — фиксирован: сколько новых FTD, столько и заплатят.';

  document.getElementById('rollingLegend').innerHTML =
    '<div style="display:flex;align-items:center;gap:6px">' +
      '<div style="width:12px;height:3px;background:rgba(0,212,170,.7);border-radius:2px"></div>' +
      '<span style="font-size:11px;color:var(--muted)">RS ' + rsRate + '% / мес (доход за месяц)</span>' +
    '</div>' +
    '<div style="display:flex;align-items:center;gap:6px">' +
      '<div style="width:12px;height:3px;background:rgba(239,68,68,.6);border-radius:2px"></div>' +
      '<span style="font-size:11px;color:var(--muted)">CPA $' + cpaRate + ' / мес (новые FTD × ставка)</span>' +
    '</div>';

  var gridPcts = [0, 25, 50, 75, 100];
  document.getElementById('rollGrid').innerHTML = gridPcts.map(function(p) {
    return '<div class="roll-gridline" style="bottom:' + p + '%">' +
      '<span>' + fmtU(maxVal * p / 100) + '</span>' +
      '</div>';
  }).join('');

  document.getElementById('rollBars').innerHTML = Array.from({length: months}, function(_, i) {
    return '<div class="roll-col">' +
      '<div class="roll-bar" style="height:' + (rsMonthly[i]/maxVal*100) + '%;background:rgba(0,212,170,.35);border:1px solid rgba(0,212,170,.6)"' +
           ' title="RS мес ' + (i+1) + ': ' + fmtU(rsMonthly[i]) + '"></div>' +
      '<div class="roll-bar" style="height:' + (cpaMonthly[i]/maxVal*100) + '%;background:rgba(239,68,68,.25);border:1px solid rgba(239,68,68,.5)"' +
           ' title="CPA мес ' + (i+1) + ': ' + fmtU(cpaMonthly[i]) + '"></div>' +
    '</div>';
  }).join('');

  document.getElementById('rollX').innerHTML = Array.from({length: months}, function(_, i) {
    return '<span>' + (i+1) + 'м</span>';
  }).join('');

  var rsM12 = rsMonthly[11];
  var rsGrowth = rsMonthly[11] / Math.max(rsMonthly[0], 1);
  var crossMonth = rsMonthly.findIndex(function(v, i) { return v > cpaMonthly[i]; }) + 1;

  document.getElementById('rollingStats').innerHTML = [
    {label: 'RS в мес. 1',  val: fmtU(rsMonthly[0]),  color: 'var(--green)', sub: 'только новые игроки'},
    {label: 'RS в мес. 6',  val: fmtU(rsMonthly[5]),  color: 'var(--green)', sub: '6 когорт работают'},
    {label: 'RS в мес. 12', val: fmtU(rsMonthly[11]), color: 'var(--green)', sub: '12 когорт работают'},
    {label: 'Рост ×',       val: rsGrowth.toFixed(1)+'×', color: 'var(--purple)', sub: 'мес 1 → мес 12'},
  ].map(function(s) {
    return '<div class="card-sm" style="text-align:center">' +
      '<div style="font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.07em;margin-bottom:4px">' + s.label + '</div>' +
      '<div style="font-size:16px;font-weight:700;color:' + s.color + '">' + s.val + '</div>' +
      '<div style="font-size:9px;color:var(--muted);margin-top:2px">' + s.sub + '</div>' +
      '</div>';
  }).join('');

  var cumulRs12 = rsCumul[11];
  var cumulCpa12 = cpaCumul[11];
  document.getElementById('rollingInsight').innerHTML =
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">' +
      '<div class="card-sm" style="text-align:center;border-color:rgba(0,212,170,.3)">' +
        '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">RS за 12 мес (суммарно)</div>' +
        '<div style="font-size:18px;font-weight:700;color:var(--green)">' + fmtU(cumulRs12) + '</div>' +
      '</div>' +
      '<div class="card-sm" style="text-align:center;border-color:rgba(239,68,68,.3)">' +
        '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">CPA за 12 мес (суммарно)</div>' +
        '<div style="font-size:18px;font-weight:700;color:var(--red)">' + fmtU(cumulCpa12) + '</div>' +
      '</div>' +
    '</div>' +
    '<div class="be-box">' +
      (crossMonth > 0
        ? '📈 С <strong>' + crossMonth + '-го месяца</strong> ежемесячный RS-доход превышает CPA-выплату. К 12-му месяцу RS приносит <strong>' + fmtU(rsM12) + '/мес</strong> — в ' + (rsM12 / Math.max(ftd * cpaRate, 1)).toFixed(1) + '× больше, чем CPA за тот же месяц.'
        : 'RS растёт, но при текущих параметрах CPA остаётся выгоднее помесячно. Попробуйте повысить RS ставку или выбрать ГЕО с высоким LTV.') +
    '</div>';
}

// ── Why lil.bet tab ──────────────────────────────────────────────────────────

function renderWhy() {
  var uspItems = t('uspItems') || [];
  document.getElementById('uspList').innerHTML = uspItems.map(function(item) {
    var i=item[0], title=item[1], d=item[2], badge=item[3];
    return '<div class="usp-item">' +
      '<div class="usp-icon">' + i + '</div>' +
      '<div>' +
        '<div class="usp-title">' + title + (badge?'<span class="usp-badge">'+badge+'</span>':'') + '</div>' +
        '<div class="usp-desc">' + d + '</div>' +
      '</div>' +
      '</div>';
  }).join('');

  document.getElementById('acceptSources').innerHTML = [
    '✅ SEO / Контент','✅ Telegram (каналы, боты, mini-apps)','✅ Facebook / Instagram (PWA, APK)',
    '✅ Google UAC / ASO','✅ TikTok / Reels','✅ Инфлюенсеры / Стримеры',
    '✅ Push / Native','✅ Email / SMS','✅ Арбитраж любого типа',
    '✅ Любой источник, который приводит реальных игроков',
  ].map(function(s) {
    return '<div style="font-size:12px;padding:4px 0;border-bottom:1px solid var(--border);color:var(--label)">' + s + '</div>';
  }).join('') +
  '<div style="font-size:11px;color:var(--green);margin-top:8px;padding:6px 8px;background:rgba(0,212,170,.06);border-radius:5px;border:1px solid rgba(0,212,170,.2)">' +
    '💬 Работаешь с нестандартным источником? Напиши менеджеру — найдём решение.' +
  '</div>';

  document.getElementById('restrictList').innerHTML = [
    '⛔ Брендовый PPC (контекст по ключу lil.bet)',
    '⛔ Cookie stuffing',
    '⛔ Спам-рассылки',
    '⛔ Клоакинг / маскировка трафика',
    '⛔ Сайты-имитаторы бренда',
    '⛔ Египет: SEO/ASO/Google по бренду → RS 10%',
    '⛔ USA, UK, France, Spain, Ukraine — блок',
  ].map(function(s) {
    return '<div style="font-size:12px;padding:4px 0;border-bottom:1px solid var(--border);color:var(--label)">' + s + '</div>';
  }).join('');

  var competitors = [
    {name:'lil.bet ✦', rs:'25–65%', adminFee:'0%', nnco:'Нет ✓', subaff:'7%', minPay:'$30/нед', cookie:'30 дн ✓', us:true},
    {name:'Vavada',     rs:'25–50%', adminFee:'14%', nnco:'Есть',   subaff:'5%', minPay:'$50',    cookie:'Сессия'},
    {name:'1WIN',       rs:'25–60%', adminFee:'0%',  nnco:'Есть',   subaff:'5%', minPay:'$30/нед',cookie:'30 дн'},
    {name:'Mostbet',    rs:'25–50%', adminFee:'0%',  nnco:'Есть',   subaff:'2%', minPay:'$50',    cookie:'Сессия'},
    {name:'Pin-Up',     rs:'25–50%', adminFee:'20%', nnco:'Есть',   subaff:'3%', minPay:'$50',    cookie:'30 дн'},
    {name:'1xPartners', rs:'25–40%', adminFee:'0%',  nnco:'Есть',   subaff:'5%', minPay:'$30/нед',cookie:'30 дн'},
    {name:'Parimatch',  rs:'25–50%', adminFee:'н/д', nnco:'Есть',   subaff:'3%', minPay:'$100',   cookie:'30 дн'},
    {name:'888Starz',   rs:'20–45%', adminFee:'н/д', nnco:'Нет ✓',  subaff:'10%',minPay:'$50',    cookie:'30 дн'},
  ];

  var headers = ['Партнёрка','RS диапазон','Admin fee','Отриц. баланс','Sub-aff','Мин. выплата','Cookie'];
  var fields  = ['rs','adminFee','nnco','subaff','minPay','cookie'];
  var winVal = {adminFee:['0%'], nnco:['Нет ✓'], minPay:['$30/нед'], cookie:['30 дн','30 дн ✓']};
  var loseVal = {adminFee:['14%','20%'], nnco:['Есть'], minPay:['$100','$50'], cookie:['Сессия']};

  document.getElementById('competitorTable').innerHTML =
    '<thead><tr>' + headers.map(function(h) { return '<th>' + h + '</th>'; }).join('') + '</tr></thead>' +
    '<tbody>' + competitors.map(function(comp) {
      return '<tr class="' + (comp.us?'us':'') + '">' +
        '<td>' + comp.name + '</td>' +
        fields.map(function(f) {
          var v = comp[f];
          var cls = '';
          if (comp.us) cls = 'win';
          else if (winVal[f] && winVal[f].indexOf(v) !== -1) cls = 'win';
          else if (loseVal[f] && loseVal[f].indexOf(v) !== -1) cls = 'lose';
          else cls = 'neutral';
          return '<td class="' + cls + '">' + v + '</td>';
        }).join('') +
        '</tr>';
    }).join('') + '</tbody>';

  document.getElementById('competitorNote').textContent =
    'Данные — публичные условия партнёрских программ на май 2026. Admin fee снимается с NGR до расчёта RS: при fee 20% и RS 25% реальная ставка = 25% × 0.8 = 20% эффективно.';
}

// ── Scenario comparison ───────────────────────────────────────────────────────

function renderScenarios() {
  var L = LANG[currentLang] || LANG.en;

  ['A', 'B'].forEach(function(ab) {
    var sc    = scState[ab];
    var srcEl = document.getElementById('sc' + ab + 'Src');
    if (srcEl) scState[ab].src = srcEl.value;
    var rr    = calcScenario(sc);
    var color = ab === 'A' ? 'var(--green)' : 'var(--purple)';
    var bg    = ab === 'A' ? 'rgba(0,212,170,.08)' : 'rgba(139,92,246,.08)';
    var bdr   = ab === 'A' ? 'rgba(0,212,170,.2)' : 'rgba(139,92,246,.2)';

    buildScGeoGrid(ab);
    updateScModelBtns(ab);

    document.getElementById('sc' + ab + 'Results').innerHTML =
      '<div class="sc-result-hero" style="background:' + bg + ';border:1px solid ' + bdr + '">' +
        '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">' + rr.geo.label + ' · ' + rr.src.label + '</div>' +
        '<div style="font-size:26px;font-weight:800;color:' + color + '">' + fmtU(rr.earn1m) + '</div>' +
        '<div style="font-size:10px;color:var(--muted);margin-top:2px">' + rr.modelLabel + ' · 1 мес</div>' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:8px">' +
        [['1 мес', rr.earn1m],['3 мес', rr.earn3m],['6 мес', rr.earn6m],['12 мес', rr.earn12m]].map(function(pair) {
          return '<div class="card-sm" style="text-align:center;padding:8px">' +
            '<div style="font-size:9px;color:var(--muted);text-transform:uppercase;margin-bottom:3px">' + pair[0] + '</div>' +
            '<div style="font-size:14px;font-weight:700;color:' + color + '">' + fmtU(pair[1]) + '</div>' +
            '</div>';
        }).join('') +
      '</div>';
  });

  var rA = calcScenario(scState['A']);
  var rB = calcScenario(scState['B']);

  var rows = [
    [L.earn1m  || '1 мес',  rA.earn1m,  rB.earn1m],
    [L.earn3m  || '3 мес',  rA.earn3m,  rB.earn3m],
    [L.earn6m  || '6 мес',  rA.earn6m,  rB.earn6m],
    [L.earn12m || '12 мес', rA.earn12m, rB.earn12m],
  ];

  document.getElementById('scDiffTable').innerHTML =
    '<thead><tr>' +
      '<th style="text-align:left">Период</th>' +
      '<th style="color:var(--green)">' + (L.scAHeader||'Сценарий A') + '</th>' +
      '<th style="color:var(--purple)">' + (L.scBHeader||'Сценарий B') + '</th>' +
      '<th>Разница</th>' +
    '</tr></thead>' +
    '<tbody>' + rows.map(function(row) {
      var lbl=row[0], a=row[1], b=row[2];
      var diff = a - b;
      var wA   = diff > 100;
      var wB   = diff < -100;
      return '<tr>' +
        '<td>' + lbl + '</td>' +
        '<td class="' + (wA?'winner':'') + '" style="color:var(--green)">' + fmtU(a) + '</td>' +
        '<td class="' + (wB?'winner':'') + '" style="color:var(--purple)">' + fmtU(b) + '</td>' +
        '<td style="color:' + (wA?'var(--green)':wB?'var(--purple)':'var(--muted)') + '">' +
          (Math.abs(diff) < 1 ? '≈ равно' : (wA ? '▲ A +' : wB ? '▲ B +' : '') + fmtU(Math.abs(diff))) +
        '</td>' +
        '</tr>';
    }).join('') + '</tbody>';

  var diff12 = rA.earn12m - rB.earn12m;
  var winner = diff12 > 100 ? 'A' : diff12 < -100 ? 'B' : null;
  var winRes = winner === 'A' ? rA : rB;
  document.getElementById('scDiffInsight').innerHTML = winner
    ? '<div class="be-box">💡 Сценарий <strong>' + winner + '</strong> выгоднее за 12 мес на <strong>' + fmtU(Math.abs(diff12)) + '</strong> — ' + winRes.geo.label + ' + ' + winRes.modelLabel + ' показывает лучший LTV при данных параметрах.</div>'
    : '<div class="be-box">⚖️ Сценарии примерно равны по доходности за 12 месяцев. Попробуй изменить ГЕО или модель.</div>';
}
