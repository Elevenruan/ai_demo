// ── State ──
const state = {
  basePrice: 70568.25,
  indicator: 'MA',
  period: '1H',
  tab: 'orderbook',
  klineData: [],
  moreOpen: false
};

// ── Helpers ──
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const rand = (a, b) => Math.random() * (b - a) + a;
const fmt = (n, d=2) => n.toLocaleString('en-US', {minimumFractionDigits:d, maximumFractionDigits:d});

function showToast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._tid);
  t._tid = setTimeout(() => t.classList.remove('show'), 1800);
}

// ── Clock ──
function updateClock() {
  const d = new Date();
  $('#statusTime').textContent = d.getHours().toString().padStart(2,'0') + ':' + d.getMinutes().toString().padStart(2,'0');
}
updateClock();
setInterval(updateClock, 30000);

// ── Generate K-Line Data ──
function generateKline(count=80, base=null) {
  base = base || state.basePrice;
  const data = [];
  let price = base - rand(800, 1500);
  const now = Date.now();
  const periodMs = {
    '1m':60000,'3m':180000,'5m':300000,'15m':900000,'30m':1800000,
    '1H':3600000,'2H':7200000,'4H':14400000,'8H':28800000,
    '12H':43200000,'1D':86400000,'1W':604800000,'1M':2592000000
  };
  const interval = periodMs[state.period] || 3600000;
  for (let i = 0; i < count; i++) {
    const open = price + rand(-200, 200);
    const close = open + rand(-400, 400);
    const high = Math.max(open, close) + rand(50, 300);
    const low = Math.min(open, close) - rand(50, 300);
    const vol = rand(0.5, 5);
    data.push({ time: now - (count - i) * interval, open, high, low, close, vol });
    price = close;
  }
  const last = data[data.length - 1];
  last.close = state.basePrice;
  last.high = Math.max(last.high, state.basePrice);
  last.low = Math.min(last.low, state.basePrice);
  return data;
}

// ── Compute Indicators ──
function computeMA(data, period) {
  const result = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) { result.push(null); continue; }
    let sum = 0;
    for (let j = i - period + 1; j <= i; j++) sum += data[j].close;
    result.push(sum / period);
  }
  return result;
}

function computeEMA(data, period) {
  const result = [];
  const k = 2 / (period + 1);
  let ema = data[0].close;
  for (let i = 0; i < data.length; i++) {
    ema = data[i].close * k + ema * (1 - k);
    result.push(i >= period - 1 ? ema : null);
  }
  return result;
}

function computeBOLL(data, period=20) {
  const mid = computeMA(data, period);
  const upper = [], lower = [];
  for (let i = 0; i < data.length; i++) {
    if (mid[i] === null) { upper.push(null); lower.push(null); continue; }
    let sqSum = 0;
    for (let j = i - period + 1; j <= i; j++) sqSum += (data[j].close - mid[i]) ** 2;
    const std = Math.sqrt(sqSum / period);
    upper.push(mid[i] + 2 * std);
    lower.push(mid[i] - 2 * std);
  }
  return { mid, upper, lower };
}

function computeMACD(data) {
  const ema12 = computeEMA(data, 12);
  const ema26 = computeEMA(data, 26);
  const dif = ema12.map((v, i) => (v !== null && ema26[i] !== null) ? v - ema26[i] : null);
  const signal = [];
  let s = 0;
  const k = 2 / 10;
  for (let i = 0; i < dif.length; i++) {
    if (dif[i] === null) { signal.push(null); continue; }
    if (s === 0) s = dif[i];
    else s = dif[i] * k + s * (1 - k);
    signal.push(s);
  }
  const hist = dif.map((v, i) => (v !== null && signal[i] !== null) ? (v - signal[i]) * 2 : null);
  return { dif, signal, hist };
}

function computeRSI(data, period=14) {
  const result = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period) { result.push(null); continue; }
    let gains = 0, losses = 0;
    for (let j = i - period + 1; j <= i; j++) {
      const diff = data[j].close - data[j-1].close;
      if (diff > 0) gains += diff; else losses -= diff;
    }
    const rs = losses === 0 ? 100 : gains / losses;
    result.push(100 - 100 / (1 + rs));
  }
  return result;
}

// ── Draw Chart ──
function drawChart() {
  const canvas = $('#klineCanvas');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.parentElement.getBoundingClientRect();
  const W = rect.width;
  const H = 200;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width = W + 'px';
  canvas.style.height = H + 'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const data = state.klineData;
  if (!data.length) return;

  const ind = state.indicator;
  const isSubChart = (ind === 'VOL' || ind === 'MACD' || ind === 'RSI');
  const mainH = isSubChart ? H * 0.65 : H;
  const subH = isSubChart ? H * 0.3 : 0;
  const subTop = isSubChart ? H * 0.7 : H;
  const pad = { top: 8, bottom: 4, left: 2, right: 2 };

  const candleW = Math.max(2, (W - pad.left - pad.right) / data.length * 0.7);
  const gap = (W - pad.left - pad.right) / data.length;

  let minP = Infinity, maxP = -Infinity;
  data.forEach(d => { if (d.low < minP) minP = d.low; if (d.high > maxP) maxP = d.high; });

  if (ind === 'BOLL') {
    const boll = computeBOLL(data);
    boll.upper.forEach(v => { if (v !== null && v > maxP) maxP = v; });
    boll.lower.forEach(v => { if (v !== null && v < minP) minP = v; });
  }

  const priceRange = maxP - minP || 1;
  const yScale = (mainH - pad.top - pad.bottom) / priceRange;
  const toY = p => pad.top + (maxP - p) * yScale;

  // Grid
  ctx.strokeStyle = 'rgba(43,49,57,0.5)';
  ctx.lineWidth = 0.5;
  for (let i = 0; i < 4; i++) {
    const y = pad.top + (mainH - pad.top - pad.bottom) * i / 3;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    ctx.fillStyle = '#5E6673';
    ctx.font = '9px sans-serif';
    ctx.fillText(fmt(maxP - priceRange * i / 3, 0), 4, y - 2);
  }

  // Candles
  data.forEach((d, i) => {
    const x = pad.left + i * gap + gap / 2;
    const isUp = d.close >= d.open;
    ctx.strokeStyle = ctx.fillStyle = isUp ? '#16c784' : '#ea3943';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, toY(d.high));
    ctx.lineTo(x, toY(d.low));
    ctx.stroke();
    const top = toY(Math.max(d.open, d.close));
    const bot = toY(Math.min(d.open, d.close));
    const h = Math.max(1, bot - top);
    ctx.fillRect(x - candleW/2, top, candleW, h);
  });

  // Overlay indicators on main chart
  function drawLine(values, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    let started = false;
    values.forEach((v, i) => {
      if (v === null) return;
      const x = pad.left + i * gap + gap / 2;
      const y = toY(v);
      if (!started) { ctx.moveTo(x, y); started = true; }
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }

  if (ind === 'MA') {
    drawLine(computeMA(data, 7), '#f5c842');
    drawLine(computeMA(data, 25), '#7b61ff');
    drawLine(computeMA(data, 99), '#00d2d3');
  } else if (ind === 'EMA') {
    drawLine(computeEMA(data, 7), '#f5c842');
    drawLine(computeEMA(data, 25), '#7b61ff');
    drawLine(computeEMA(data, 99), '#00d2d3');
  } else if (ind === 'BOLL') {
    const boll = computeBOLL(data);
    drawLine(boll.mid, '#f5c842');
    drawLine(boll.upper, '#7b61ff');
    drawLine(boll.lower, '#00d2d3');
  }

  // Sub chart
  if (ind === 'VOL') {
    let maxVol = 0;
    data.forEach(d => { if (d.vol > maxVol) maxVol = d.vol; });
    ctx.strokeStyle = 'rgba(43,49,57,0.5)';
    ctx.beginPath(); ctx.moveTo(0, subTop); ctx.lineTo(W, subTop); ctx.stroke();
    data.forEach((d, i) => {
      const x = pad.left + i * gap + gap / 2;
      const h = (d.vol / maxVol) * subH * 0.9;
      ctx.fillStyle = d.close >= d.open ? 'rgba(22,199,132,0.6)' : 'rgba(234,57,67,0.6)';
      ctx.fillRect(x - candleW/2, subTop + subH - h, candleW, h);
    });
  } else if (ind === 'MACD') {
    const macd = computeMACD(data);
    let maxAbs = 0;
    macd.hist.forEach(v => { if (v !== null && Math.abs(v) > maxAbs) maxAbs = Math.abs(v); });
    if (maxAbs === 0) maxAbs = 1;
    const midY = subTop + subH / 2;
    ctx.strokeStyle = 'rgba(43,49,57,0.5)';
    ctx.beginPath(); ctx.moveTo(0, midY); ctx.lineTo(W, midY); ctx.stroke();
    macd.hist.forEach((v, i) => {
      if (v === null) return;
      const x = pad.left + i * gap + gap / 2;
      const h = (v / maxAbs) * subH * 0.4;
      ctx.fillStyle = v >= 0 ? 'rgba(22,199,132,0.7)' : 'rgba(234,57,67,0.7)';
      ctx.fillRect(x - candleW/2, midY - (v > 0 ? h : 0), candleW, Math.abs(h));
    });
    function drawSubLine(values, color) {
      ctx.strokeStyle = color; ctx.lineWidth = 1;
      ctx.beginPath(); let st = false;
      values.forEach((v, i) => {
        if (v === null) return;
        const x = pad.left + i * gap + gap / 2;
        const y = midY - (v / maxAbs) * subH * 0.4;
        if (!st) { ctx.moveTo(x, y); st = true; } else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }
    drawSubLine(macd.dif, '#f5c842');
    drawSubLine(macd.signal, '#7b61ff');
  } else if (ind === 'RSI') {
    const rsi = computeRSI(data);
    ctx.strokeStyle = 'rgba(43,49,57,0.5)';
    [subTop, subTop + subH].forEach(y => { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); });
    ctx.setLineDash([3, 3]);
    [30, 70].forEach(lv => {
      const y = subTop + subH - (lv / 100) * subH;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      ctx.fillStyle = '#5E6673'; ctx.font = '9px sans-serif'; ctx.fillText(lv, 4, y - 2);
    });
    ctx.setLineDash([]);
    ctx.strokeStyle = '#f5c842'; ctx.lineWidth = 1.2;
    ctx.beginPath(); let st = false;
    rsi.forEach((v, i) => {
      if (v === null) return;
      const x = pad.left + i * gap + gap / 2;
      const y = subTop + subH - (v / 100) * subH;
      if (!st) { ctx.moveTo(x, y); st = true; } else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }
}

// ── Update Indicator Values ──
function updateIndValues() {
  const data = state.klineData;
  if (!data.length) return;
  const el = $('#indValues');
  const ind = state.indicator;
  const last = data.length - 1;

  if (ind === 'MA') {
    const m7 = computeMA(data, 7), m25 = computeMA(data, 25), m99 = computeMA(data, 99);
    el.innerHTML = `<span class="v1">MA(7): ${fmt(m7[last]||0)}</span><span class="v2">MA(25): ${fmt(m25[last]||0)}</span><span class="v3">MA(99): ${fmt(m99[last]||0)}</span>`;
  } else if (ind === 'EMA') {
    const e7 = computeEMA(data, 7), e25 = computeEMA(data, 25), e99 = computeEMA(data, 99);
    el.innerHTML = `<span class="v1">EMA(7): ${fmt(e7[last]||0)}</span><span class="v2">EMA(25): ${fmt(e25[last]||0)}</span><span class="v3">EMA(99): ${fmt(e99[last]||0)}</span>`;
  } else if (ind === 'BOLL') {
    const b = computeBOLL(data);
    el.innerHTML = `<span class="v1">MID: ${fmt(b.mid[last]||0)}</span><span class="v2">UP: ${fmt(b.upper[last]||0)}</span><span class="v3">DN: ${fmt(b.lower[last]||0)}</span>`;
  } else if (ind === 'VOL') {
    const vol = data[last].vol;
    el.innerHTML = `<span class="v1">Vol: ${vol.toFixed(4)} BTC</span><span class="v2">MA(5): ${(data.slice(-5).reduce((s,d)=>s+d.vol,0)/5).toFixed(4)}</span>`;
  } else if (ind === 'MACD') {
    const m = computeMACD(data);
    el.innerHTML = `<span class="v1">DIF: ${fmt(m.dif[last]||0)}</span><span class="v2">DEA: ${fmt(m.signal[last]||0)}</span><span class="v3">MACD: ${fmt(m.hist[last]||0)}</span>`;
  } else if (ind === 'RSI') {
    const r = computeRSI(data);
    el.innerHTML = `<span class="v1">RSI(14): ${(r[last]||0).toFixed(2)}</span><span class="v2">RSI(6): ${(computeRSI(data,6)[last]||0).toFixed(2)}</span>`;
  }
}

// ── Order Book ──
function generateOrderBook() {
  const base = state.basePrice;
  const rows = 12;
  let sellHtml = '', buyHtml = '';
  const sellData = [], buyData = [];

  for (let i = rows; i >= 1; i--) {
    const price = base + rand(10, 80) * i;
    const qty = rand(0.001, 0.5);
    const pct = rand(15, 95);
    sellData.push({ price, qty, pct });
  }
  for (let i = 1; i <= rows; i++) {
    const price = base - rand(10, 80) * i;
    const qty = rand(0.001, 0.5);
    const pct = rand(15, 95);
    buyData.push({ price, qty, pct });
  }

  sellData.forEach(d => {
    sellHtml += `<div class="ob-row"><span class="ob-qty">${d.qty.toFixed(5)}</span><span class="ob-price">${fmt(d.price, 2)}</span><div class="ob-bar" style="width:${d.pct}%"></div></div>`;
  });
  buyData.forEach(d => {
    buyHtml += `<div class="ob-row"><span class="ob-price">${fmt(d.price, 2)}</span><span class="ob-qty">${d.qty.toFixed(5)}</span><div class="ob-bar" style="width:${d.pct}%"></div></div>`;
  });

  $('#obRows').innerHTML = `<div class="ob-col sell">${sellHtml}</div><div class="ob-col buy">${buyHtml}</div>`;

  const spreadPct = ((sellData[sellData.length-1].price - buyData[0].price) / base * 100).toFixed(3);
  $('#obSpread').innerHTML = `<div class="spread-price">${fmt(base)}</div><span>Spread: ${spreadPct}%</span>`;
}

// ── Trade History ──
function generateTradeHistory() {
  const container = $('#tradeHistory');
  const existing = container.querySelector('.th-header').outerHTML;
  let html = existing;
  const base = state.basePrice;
  const now = Date.now();

  for (let i = 0; i < 30; i++) {
    const isBuy = Math.random() > 0.5;
    const price = base + rand(-200, 200);
    const qty = rand(0.001, 0.8);
    const time = new Date(now - i * rand(2000, 30000));
    const ts = time.getHours().toString().padStart(2,'0') + ':' + time.getMinutes().toString().padStart(2,'0') + ':' + time.getSeconds().toString().padStart(2,'0');
    html += `<div class="th-row ${isBuy?'buy-trade':'sell-trade'}"><span class="th-price">${fmt(price)}</span><span>${qty.toFixed(5)}</span><span>${ts}</span></div>`;
  }
  container.innerHTML = html;
}

// ── Indicators Bar ──
$('#indBar').addEventListener('click', e => {
  const btn = e.target.closest('.ind-btn');
  if (!btn) return;
  $$('#indBar .ind-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  state.indicator = btn.dataset.ind;
  updateIndValues();
  drawChart();
});

// ── Periods Bar ──
const morePeriods = ['3m','30m','2H','8H','12H','1M'];
morePeriods.forEach(p => {
  const btn = document.createElement('button');
  btn.className = 'period-btn';
  btn.dataset.period = p;
  btn.textContent = p;
  btn.addEventListener('click', () => {
    $$('.period-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.period = p;
    state.klineData = generateKline();
    drawChart();
    updateIndValues();
    $('#moreDropdown').classList.remove('show');
    state.moreOpen = false;
    $('#moreBtn').textContent = 'More ▼';
  });
  $('#moreDropdown').appendChild(btn);
});

$('#periodsBar').addEventListener('click', e => {
  const btn = e.target.closest('.period-btn');
  if (!btn) return;
  if (btn.id === 'moreBtn') {
    state.moreOpen = !state.moreOpen;
    $('#moreDropdown').classList.toggle('show', state.moreOpen);
    btn.textContent = state.moreOpen ? 'More ▲' : 'More ▼';
    return;
  }
  $$('.period-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  state.period = btn.dataset.period;
  state.klineData = generateKline();
  drawChart();
  updateIndValues();
  if (state.moreOpen) {
    $('#moreDropdown').classList.remove('show');
    state.moreOpen = false;
    $('#moreBtn').textContent = 'More ▼';
  }
});

// ── Tabs ──
$('#tabsBar').addEventListener('click', e => {
  const btn = e.target.closest('.tab-btn');
  if (!btn) return;
  $$('#tabsBar .tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  $$('.tab-content').forEach(tc => tc.classList.remove('active'));
  $(`#tab-${btn.dataset.tab}`).classList.add('active');
  state.tab = btn.dataset.tab;
});

// ── Pull to Refresh ──
let pullStartY = 0, pulling = false, pullDist = 0;
const content = $('#contentArea');
const pullInd = $('#pullIndicator');

content.addEventListener('touchstart', e => {
  if (content.scrollTop <= 0) {
    pullStartY = e.touches[0].clientY;
    pulling = true;
    pullDist = 0;
  }
}, { passive: true });

content.addEventListener('touchmove', e => {
  if (!pulling) return;
  pullDist = e.touches[0].clientY - pullStartY;
  if (pullDist > 0 && content.scrollTop <= 0) {
    pullInd.classList.add('active');
    if (pullDist > 80) pullInd.classList.add('ready');
    else pullInd.classList.remove('ready');
  } else {
    pullInd.classList.remove('active', 'ready');
  }
}, { passive: true });

content.addEventListener('touchend', () => {
  if (pulling && pullDist > 80) {
    pullInd.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
    setTimeout(() => {
      refreshData();
      pullInd.classList.remove('active', 'ready');
      pullInd.innerHTML = '<i class="fas fa-arrow-down"></i> Pull to refresh';
      showToast('Data refreshed');
    }, 800);
  } else {
    pullInd.classList.remove('active', 'ready');
  }
  pulling = false;
  pullDist = 0;
});

function refreshData() {
  state.basePrice += rand(-500, 500);
  const change = rand(-3, 3);
  const isUp = change >= 0;

  $('#mainPrice').textContent = fmt(state.basePrice);
  $('#priceUsd').textContent = `≈ $${fmt(state.basePrice * 0.989)}`;
  const changeEl = $('#priceChange');
  changeEl.className = `change ${isUp ? 'up' : 'down'}`;
  changeEl.innerHTML = `<i class="fas fa-caret-${isUp?'up':'down'}"></i> ${isUp?'+':''}${change.toFixed(2)}%`;

  $('#statHigh').textContent = fmt(state.basePrice + rand(200, 900), 2);
  $('#statLow').textContent = fmt(state.basePrice - rand(200, 1600), 2);
  $('#statVolBtc').textContent = rand(10, 30).toFixed(2);
  $('#statVolUsdt').textContent = fmt(rand(1, 2), 2) + 'M';

  state.klineData = generateKline();
  drawChart();
  updateIndValues();
  generateOrderBook();
  generateTradeHistory();
}

// ── Init ──
function init() {
  state.klineData = generateKline();
  drawChart();
  updateIndValues();
  generateOrderBook();
  generateTradeHistory();
}

init();
window.addEventListener('resize', () => { drawChart(); });

document.addEventListener('click', e => {
  if (state.moreOpen && !e.target.closest('.periods-bar')) {
    $('#moreDropdown').classList.remove('show');
    state.moreOpen = false;
    $('#moreBtn').textContent = 'More ▼';
  }
});
