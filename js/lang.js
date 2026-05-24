// ══════════════════════════════════════════════════════════════════════════════
// TRANSLATIONS
// ══════════════════════════════════════════════════════════════════════════════

let currentLang = localStorage.getItem('calc_lang') || 'ru';
let tourStep = 0;

const LANG = {
  ru:{
    headerSub:'/ калькулятор партнёра',
    tabCalc:'⚡ Калькулятор', tabCompare:'📊 RS vs CPA', tabScenarios:'⚖️ Сценарии',
    tabSubaff:'🔗 Суб-аффилейт', tabWhy:'✅ Почему lil.bet',
    scAHeader:'Сценарий A', scBHeader:'Сценарий B', scDiffHeader:'Сравнение сценариев',
    earn1m:'1 мес', earn3m:'3 мес', earn6m:'6 мес', earn12m:'12 мес',
    partnerEarn:'Партнёру', brandNgr:'NGR бренда',
    seasonNote:'⚠️ Сезонность не учтена — реальные значения могут отличаться на ±20–30% в праздники и Рамадан',
    tourSkip:'Пропустить', tourNext:'Далее →', tourFinish:'Готово!',
    tourSteps:[
      {title:'👋 Добро пожаловать!', text:'Этот калькулятор покажет реальный доход с партнёрской программы lil.bet. Займёт 30 секунд. Начнём с выбора ГЕО.'},
      {title:'🌍 Шаг 1 — Выбери ГЕО', text:'Выбери страну, в которую льёшь трафик. Каждое ГЕО имеет свои NGR-бенчмарки и лесенку RS.'},
      {title:'📡 Шаг 2 — Источник трафика', text:'Выбери откуда приходят игроки. Качество трафика влияет на NGR и итоговый доход.'},
      {title:'📊 Шаг 3 — Модель выплат', text:'RS = процент от NGR каждый месяц пока игроки активны. CPA = разово за каждый FTD. Hybrid = оба варианта.'},
      {title:'💰 Шаг 4 — Твой доход', text:'Всё посчитано! Видишь NGR бренда и выплату партнёру. Меняй ГЕО, FTD, RS — результаты обновляются в реальном времени.'},
    ],
    uspItems:[
      ['0️⃣','0% Admin fee — получаешь полный RS','Admin fee — это скрытый вычет из NGR ДО расчёта RS. Пример: Pin-Up берёт 20% → при RS 25% реально ты получаешь 25% × 0.80 = 20% NGR. У нас fee 0%: наши 25% RS — это честные 25% NGR без вычетов. Это эквивалентно 31%+ у Pin-Up.','#1'],
      ['🚫','Нет переноса отрицательного баланса (NNCO)','Плохой месяц (минусовой NGR) не вычитается из следующего. Mostbet, 1xPartners, Melbet переносят минус — у нас он сгорает в конце месяца. Начинаешь каждый месяц с нуля.','USP'],
      ['🪙','$30 с еженедельной выплатой по вторникам','Минимальный порог ниже Mostbet ($50), Pin-Up ($50), Parimatch ($100). Крипто-выплата без задержек.','🔥'],
      ['🔗','Sub-affiliate 7% — выше рынка','Рыночный диапазон: 3–10%. Mostbet даёт 2%, Pin-Up 3%. Наши 7% — одна из лучших ставок на рынке.'],
      ['🍪','Cookie 30 дней Last Win','Vavada — только сессия, Mostbet — только сессия. У нас cookie работает 30 дней.'],
      ['⚡','Прямой менеджер, живое общение','Никаких тикетов. Условия, промо, выплаты — решается в чате напрямую.'],
      ['📱','Telegram без ограничений','Каналы, боты, mini-apps, APK, PWA — всё принимаем.'],
      ['🚀','Нет FTD кэпа при тесте','Работаем на любой объём сразу — без пробных 50 FTD.'],
    ],
    // Static section labels
    geoSec:'ГЕО',
    trafficSec:'Объём трафика',
    ftdLabel:'FTD в месяц',
    clicksLabel:'Кликов в месяц',
    modeFtd:'Знаю FTD',
    modeClicks:'Знаю клики',
    roiToggle:'💰 ROI-расчёт (учесть расходы)',
    srcSec:'Источник трафика',
    modelSec:'Модель выплат',
    ngrLabel:'NGR бренда / мес',
    earnLabel:'Выплата партнёру / мес',
    timelineSec:'Доход с когорты',
    metricsSecLabel:'Метрики игрока',
    tierSec:'Лестница RevShare',
    payoutSec:'Условия выплат',
    compareSec:'Доход с одной когорты по месяцам (накопленно)',
    compareIntro:'Как работает сравнение: за каждый FTD по CPA партнёр получает фиксированную выплату один раз. По RS — процент от каждого проигрыша игрока: через неделю, через месяц, через год.',
    rollingSec:'📈 12-месячный прогноз — постоянный поток трафика',
    whyUspSec:'Ключевые преимущества',
    whyPaySec:'Условия выплат — кратко',
    whyAcceptSec:'Что принимаем',
    whyRestrictSec:'Ограничения',
    whyCompetitorSec:'lil.bet vs конкуренты — ключевые метрики',
    managerSec:'Твой менеджер в lil.bet',
    subSec:'Ваша суб-сеть',
  },
  en:{
    headerSub:'/ partner calculator',
    tabCalc:'⚡ Calculator', tabCompare:'📊 RS vs CPA', tabScenarios:'⚖️ Scenarios',
    tabSubaff:'🔗 Sub-affiliate', tabWhy:'✅ Why lil.bet',
    scAHeader:'Scenario A', scBHeader:'Scenario B', scDiffHeader:'Scenario comparison',
    earn1m:'1 mo', earn3m:'3 mo', earn6m:'6 mo', earn12m:'12 mo',
    partnerEarn:'Partner', brandNgr:'Brand NGR',
    seasonNote:'⚠️ Seasonality not included — real values may vary ±20–30% during holidays and Ramadan',
    tourSkip:'Skip', tourNext:'Next →', tourFinish:'Done!',
    tourSteps:[
      {title:'👋 Welcome!', text:'This calculator shows real earnings from the lil.bet affiliate program. Takes 30 seconds. Let\'s start with GEO selection.'},
      {title:'🌍 Step 1 — Choose GEO', text:'Pick the country you send traffic to. Each GEO has its own NGR benchmarks and RS ladder.'},
      {title:'📡 Step 2 — Traffic source', text:'Choose where players come from. Traffic quality affects NGR and total earnings.'},
      {title:'📊 Step 3 — Payout model', text:'RS = % of NGR monthly while players are active. CPA = one-time per FTD. Hybrid = both.'},
      {title:'💰 Step 4 — Your earnings', text:'All calculated! See brand NGR and partner payout. Change GEO, FTD, RS — results update in real time.'},
    ],
    uspItems:[
      ['0️⃣','0% Admin Fee — you keep the full RS','Admin fee is a hidden deduction from NGR BEFORE RS is calculated. Example: Pin-Up takes 20% → at RS 25% you actually get 25% × 0.80 = 20% of NGR. Our fee is 0%: our 25% RS is an honest 25% of NGR. Equivalent to 31%+ at Pin-Up.','#1'],
      ['🚫','No Negative Carryover (NNCO)','A losing month doesn\'t roll into the next. Mostbet, 1xPartners, Melbet carry the negative forward — ours resets to zero every month.','USP'],
      ['🪙','$30 weekly payouts every Tuesday','Lower threshold than Mostbet ($50), Pin-Up ($50), Parimatch ($100). Crypto payout, no delays.','🔥'],
      ['🔗','Sub-affiliate 7% — above market','Market range: 3–10%. Mostbet pays 2%, Pin-Up 3%. Our 7% is one of the best rates on the market.'],
      ['🍪','30-day Last Win cookie','Vavada is session-only, Mostbet is session-only. Our cookie runs 30 days.'],
      ['⚡','Direct manager, live chat','No tickets. Conditions, promos, payouts — resolved in chat directly.'],
      ['📱','Telegram-friendly','Channels, bots, mini-apps, APK, PWA — all accepted.'],
      ['🚀','No FTD cap on test','Work at any volume immediately — no trial 50 FTD period.'],
    ],
    geoSec:'GEO',
    trafficSec:'Traffic volume',
    ftdLabel:'FTD per month',
    clicksLabel:'Clicks per month',
    modeFtd:'I know FTD',
    modeClicks:'I know clicks',
    roiToggle:'💰 ROI Calculator (include costs)',
    srcSec:'Traffic source',
    modelSec:'Payout model',
    ngrLabel:'Brand NGR / mo',
    earnLabel:'Partner payout / mo',
    timelineSec:'Cohort income',
    metricsSecLabel:'Player metrics',
    tierSec:'RevShare ladder',
    payoutSec:'Payout terms',
    compareSec:'Cohort income by month (cumulative)',
    compareIntro:'How comparison works: for each FTD via CPA the partner receives a fixed one-time payout. Via RS — a percentage of every player loss: weekly, monthly, yearly.',
    rollingSec:'📈 12-month forecast — steady traffic flow',
    whyUspSec:'Key advantages',
    whyPaySec:'Payout terms — brief',
    whyAcceptSec:'What we accept',
    whyRestrictSec:'Restrictions',
    whyCompetitorSec:'lil.bet vs competitors — key metrics',
    managerSec:'Your lil.bet manager',
    subSec:'Your sub-network',
  },
  uk:{
    headerSub:'/ калькулятор партнера',
    tabCalc:'⚡ Калькулятор', tabCompare:'📊 RS vs CPA', tabScenarios:'⚖️ Сценарії',
    tabSubaff:'🔗 Суб-афіліат', tabWhy:'✅ Чому lil.bet',
    scAHeader:'Сценарій A', scBHeader:'Сценарій B', scDiffHeader:'Порівняння сценаріїв',
    earn1m:'1 міс', earn3m:'3 міс', earn6m:'6 міс', earn12m:'12 міс',
    partnerEarn:'Партнеру', brandNgr:'NGR бренду',
    seasonNote:'⚠️ Сезонність не врахована — реальні значення можуть відрізнятися на ±20–30%',
    tourSkip:'Пропустити', tourNext:'Далі →', tourFinish:'Готово!',
    tourSteps:[
      {title:'👋 Ласкаво просимо!', text:'Цей калькулятор покаже реальний дохід з партнерської програми lil.bet.'},
      {title:'🌍 Крок 1 — Вибери ГЕО', text:'Вибери країну, на яку льєш трафік.'},
      {title:'📡 Крок 2 — Джерело трафіку', text:'Вибери звідки приходять гравці.'},
      {title:'📊 Крок 3 — Модель виплат', text:'RS, CPA або Hybrid — обери свою модель.'},
      {title:'💰 Крок 4 — Твій дохід', text:'Все пораховано! Змінюй параметри — результати оновлюються.'},
    ],
    uspItems:[
      ['0️⃣','0% Admin fee','Pin-Up бере 20%, Vavada 14%. Наш admin fee 0%.','#1'],
      ['🚫','Без перенесення від\'ємного балансу','Поганий місяць не переноситься.','USP'],
      ['🪙','$30 щотижня по вівторках','Крипто-виплата без затримок.','🔥'],
      ['🔗','Sub-affiliate 7%','Ринковий діапазон: 3–10%.'],
      ['🍪','Cookie 30 днів Last Win','Vavada та Mostbet — лише сесія.'],
      ['⚡','Прямий менеджер','Без тікетів.'],
      ['📱','Telegram без обмежень','Канали, боти, APK, PWA.'],
      ['🚀','Без кепу FTD','Будь-який обсяг одразу.'],
    ],
    geoSec:'ГЕО',
    trafficSec:'Обсяг трафіку',
    ftdLabel:'FTD на місяць',
    clicksLabel:'Кліків на місяць',
    modeFtd:'Знаю FTD',
    modeClicks:'Знаю кліки',
    roiToggle:'💰 ROI-розрахунок (врахувати витрати)',
    srcSec:'Джерело трафіку',
    modelSec:'Модель виплат',
    ngrLabel:'NGR бренду / міс',
    earnLabel:'Виплата партнеру / міс',
    timelineSec:'Дохід з когорти',
    metricsSecLabel:'Метрики гравця',
    tierSec:'Сходинки RevShare',
    payoutSec:'Умови виплат',
    compareSec:'Дохід з однієї когорти по місяцях (накопичено)',
    compareIntro:'Як працює порівняння: за кожен FTD по CPA партнер отримує фіксовану виплату один раз. По RS — відсоток від кожного програшу гравця.',
    rollingSec:'📈 12-місячний прогноз — постійний потік трафіку',
    whyUspSec:'Ключові переваги',
    whyPaySec:'Умови виплат — коротко',
    whyAcceptSec:'Що приймаємо',
    whyRestrictSec:'Обмеження',
    whyCompetitorSec:'lil.bet vs конкуренти — ключові метрики',
    managerSec:'Твій менеджер у lil.bet',
    subSec:'Ваша суб-мережа',
  },
  de:{
    headerSub:'/ Partner-Rechner',
    tabCalc:'⚡ Rechner', tabCompare:'📊 RS vs CPA', tabScenarios:'⚖️ Szenarien',
    tabSubaff:'🔗 Sub-Affiliate', tabWhy:'✅ Warum lil.bet',
    scAHeader:'Szenario A', scBHeader:'Szenario B', scDiffHeader:'Szenariovergleich',
    earn1m:'1 Mo', earn3m:'3 Mo', earn6m:'6 Mo', earn12m:'12 Mo',
    partnerEarn:'Partner', brandNgr:'Brand NGR',
    seasonNote:'⚠️ Saisonalität nicht berücksichtigt — reale Werte können ±20–30% abweichen',
    tourSkip:'Überspringen', tourNext:'Weiter →', tourFinish:'Fertig!',
    tourSteps:[
      {title:'👋 Willkommen!', text:'Dieser Rechner zeigt echte Einnahmen aus dem lil.bet Partnerprogramm.'},
      {title:'🌍 Schritt 1 — GEO wählen', text:'Wähle das Land, in das du Traffic sendest.'},
      {title:'📡 Schritt 2 — Traffic-Quelle', text:'Wähle, woher die Spieler kommen.'},
      {title:'📊 Schritt 3 — Auszahlungsmodell', text:'RS, CPA oder Hybrid.'},
      {title:'💰 Schritt 4 — Deine Einnahmen', text:'Alles berechnet! Ändere Parameter — Ergebnisse aktualisieren sich.'},
    ],
    uspItems:[
      ['0️⃣','0% Admin Fee','Pin-Up 20%, Vavada 14%. Unsere Admin Fee: 0%.','#1'],
      ['🚫','Kein negativer Übertrag','Schlechter Monat wird nicht übertragen.','USP'],
      ['🪙','$30 wöchentlich jeden Dienstag','Niedriger als Mostbet ($50), Parimatch ($100).','🔥'],
      ['🔗','Sub-Affiliate 7%','Marktbereich: 3–10%.'],
      ['🍪','Cookie 30 Tage Last Win','Vavada und Mostbet nur Session.'],
      ['⚡','Direkter Manager','Keine Tickets.'],
      ['📱','Telegram-freundlich','Alle Quellen akzeptiert.'],
      ['🚀','Kein FTD-Cap','Sofort auf jedem Volumen.'],
    ],
    geoSec:'GEO',
    trafficSec:'Traffic-Volumen',
    ftdLabel:'FTD pro Monat',
    clicksLabel:'Klicks pro Monat',
    modeFtd:'Ich kenne FTD',
    modeClicks:'Ich kenne Klicks',
    roiToggle:'💰 ROI-Rechner (Kosten einbeziehen)',
    srcSec:'Traffic-Quelle',
    modelSec:'Auszahlungsmodell',
    ngrLabel:'Brand NGR / Mo',
    earnLabel:'Partner-Auszahlung / Mo',
    timelineSec:'Kohorten-Einkommen',
    metricsSecLabel:'Spieler-Metriken',
    tierSec:'RevShare-Leiter',
    payoutSec:'Auszahlungsbedingungen',
    compareSec:'Kohorteneinkommen nach Monat (kumulativ)',
    compareIntro:'So funktioniert der Vergleich: Für jedes FTD über CPA erhält der Partner eine einmalige Zahlung. Über RS — einen Prozentsatz jedes Spielerverlusts.',
    rollingSec:'📈 12-Monats-Prognose — stetiger Traffic-Fluss',
    whyUspSec:'Wichtigste Vorteile',
    whyPaySec:'Auszahlungsbedingungen — kurz',
    whyAcceptSec:'Was wir akzeptieren',
    whyRestrictSec:'Einschränkungen',
    whyCompetitorSec:'lil.bet vs Konkurrenten — Schlüsselmetriken',
    managerSec:'Dein lil.bet Manager',
    subSec:'Dein Sub-Netzwerk',
  },
  es:{
    headerSub:'/ calculadora de afiliados',
    tabCalc:'⚡ Calculadora', tabCompare:'📊 RS vs CPA', tabScenarios:'⚖️ Escenarios',
    tabSubaff:'🔗 Sub-afiliado', tabWhy:'✅ Por qué lil.bet',
    scAHeader:'Escenario A', scBHeader:'Escenario B', scDiffHeader:'Comparación de escenarios',
    earn1m:'1 mes', earn3m:'3 mes', earn6m:'6 mes', earn12m:'12 mes',
    partnerEarn:'Afiliado', brandNgr:'NGR marca',
    seasonNote:'⚠️ Estacionalidad no incluida — los valores reales pueden variar ±20–30%',
    tourSkip:'Saltar', tourNext:'Siguiente →', tourFinish:'¡Listo!',
    tourSteps:[
      {title:'👋 ¡Bienvenido!', text:'Esta calculadora muestra ganancias reales del programa de afiliados lil.bet.'},
      {title:'🌍 Paso 1 — Elige GEO', text:'Elige el país al que envías tráfico.'},
      {title:'📡 Paso 2 — Fuente de tráfico', text:'Elige de dónde vienen los jugadores.'},
      {title:'📊 Paso 3 — Modelo de pago', text:'RS, CPA o Hybrid.'},
      {title:'💰 Paso 4 — Tus ganancias', text:'¡Todo calculado! Cambia parámetros — resultados en tiempo real.'},
    ],
    uspItems:[
      ['0️⃣','0% Admin Fee','Pin-Up 20%, Vavada 14%. Nuestra tarifa: 0%.','#1'],
      ['🚫','Sin arrastre negativo','El mes malo no se arrastra.','USP'],
      ['🪙','$30 semanal cada martes','Umbral inferior a Mostbet ($50).','🔥'],
      ['🔗','Sub-afiliado 7%','Rango de mercado: 3–10%.'],
      ['🍪','Cookie 30 días Last Win','Vavada y Mostbet solo sesión.'],
      ['⚡','Manager directo','Sin tickets.'],
      ['📱','Telegram sin restricciones','Canales, bots, APK, PWA.'],
      ['🚀','Sin cap de FTD','Cualquier volumen de inmediato.'],
    ],
    geoSec:'GEO',
    trafficSec:'Volumen de tráfico',
    ftdLabel:'FTD por mes',
    clicksLabel:'Clics por mes',
    modeFtd:'Sé el FTD',
    modeClicks:'Sé los clics',
    roiToggle:'💰 Calculadora ROI (incluir costos)',
    srcSec:'Fuente de tráfico',
    modelSec:'Modelo de pago',
    ngrLabel:'NGR marca / mes',
    earnLabel:'Pago al afiliado / mes',
    timelineSec:'Ingresos de la cohorte',
    metricsSecLabel:'Métricas del jugador',
    tierSec:'Escalera RevShare',
    payoutSec:'Condiciones de pago',
    compareSec:'Ingresos de la cohorte por mes (acumulado)',
    compareIntro:'Cómo funciona la comparación: por cada FTD vía CPA el afiliado recibe un pago fijo de una vez. Vía RS — un porcentaje de cada pérdida del jugador.',
    rollingSec:'📈 Pronóstico de 12 meses — flujo constante de tráfico',
    whyUspSec:'Ventajas clave',
    whyPaySec:'Condiciones de pago — breve',
    whyAcceptSec:'Qué aceptamos',
    whyRestrictSec:'Restricciones',
    whyCompetitorSec:'lil.bet vs competidores — métricas clave',
    managerSec:'Tu manager en lil.bet',
    subSec:'Tu sub-red',
  },
};

function t(key){ return (LANG[currentLang]||LANG.en)[key] || (LANG.en)[key] || key; }

function applyI18n() {
  document.querySelectorAll('[data-i18n]').forEach(function(el) {
    var key = el.getAttribute('data-i18n');
    var val = t(key);
    if (val && val !== key) el.textContent = val;
  });
}

function switchLang(lang){
  currentLang = lang;
  localStorage.setItem('calc_lang', lang);
  // Update lang buttons
  document.querySelectorAll('.lang-btn').forEach(function(b) { b.classList.remove('active'); });
  document.querySelectorAll('.lang-btn').forEach(function(b) {
    if(b.textContent.toLowerCase()===lang||b.textContent.toUpperCase()===lang.toUpperCase()) b.classList.add('active');
  });
  // Apply data-i18n translations
  applyI18n();
  // Update static elements (keep for backward compat)
  var L = LANG[lang] || LANG.en;
  document.getElementById('headerSub').textContent = L.headerSub;
  ['calc','compare','scenarios','subaff','why'].forEach(function(id) {
    var el = document.getElementById('tab-'+id);
    if(el) el.textContent = L['tab'+id.charAt(0).toUpperCase()+id.slice(1)] || el.textContent;
  });
  // Update tour buttons if tour open
  var skipBtn = document.getElementById('tourSkipBtn');
  var nextBtn = document.getElementById('tourNextBtn');
  if(skipBtn) skipBtn.textContent = L.tourSkip;
  if(nextBtn) nextBtn.textContent = tourStep >= (L.tourSteps.length-1) ? L.tourFinish : L.tourNext;
  // Update scenario headers
  var sh = {scAHeader:'scAHeader', scBHeader:'scBHeader', scDiffHeader:'scDiffHeader'};
  Object.entries(sh).forEach(function(entry) { var k=entry[0],id=entry[1]; var e=document.getElementById(id); if(e) e.textContent=L[k]; });
  renderAll();
  renderWhy();
  renderScenarios();
}
