/* =====================================================================
   Design Spec Website — Main Script
   ===================================================================== */

'use strict';

/* ---- Toast helper ---- */
const toast = document.getElementById('toast');
let toastTimer;

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 1600);
}

/* ---- Copy to clipboard ---- */
function copyText(text, el) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`已复制：${text}`);
    if (el) {
      el.classList.add('copied');
      setTimeout(() => el.classList.remove('copied'), 1200);
    }
  }).catch(() => {
    /* fallback */
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast(`已复制：${text}`);
  });
}

/* ---- Resolve CSS variable to computed hex value ---- */
function resolveVar(name) {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(name).trim();
  return raw || null;
}

/* ---- Build color swatch scales ---- */
function buildSwatchScale(containerId, tokens) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = '';

  const scale = document.createElement('div');
  scale.className = 'swatch-scale';

  tokens.forEach(({ name, value }) => {
    const item = document.createElement('div');
    item.className = 'swatch-scale__item';
    item.style.background = value;
    item.title = `${name}: ${value}`;

    const label = document.createElement('span');
    label.className = 'swatch-scale__label';
    // show number suffix
    const num = name.match(/\d+$/);
    label.textContent = num ? num[0] : name;
    // dark or light label
    label.style.color = isLight(value) ? '#1e2533' : '#fff';

    item.appendChild(label);
    item.addEventListener('click', () => copyText(name, item));
    scale.appendChild(item);
  });

  el.appendChild(scale);

  // labels row
  const row = document.createElement('div');
  row.style.cssText = 'display:flex;justify-content:space-between;padding:0 2px;';
  const first = tokens[0];
  const last  = tokens[tokens.length - 1];
  [first, last].forEach((t, i) => {
    const span = document.createElement('span');
    span.style.cssText = 'font-size:11px;font-family:monospace;color:var(--text-caption)';
    span.textContent = t ? t.name : '';
    if (i === 1) span.style.textAlign = 'right';
    row.appendChild(span);
  });
  el.appendChild(row);
}

/* ---- Build swatch card grid ---- */
function buildSwatchGrid(containerId, tokens) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = '';

  const grid = document.createElement('div');
  grid.className = 'swatch-grid';

  tokens.forEach(({ name, value, desc }) => {
    const card = document.createElement('div');
    card.className = 'swatch-card';
    card.innerHTML = `
      <div class="swatch-card__preview" style="background:${value}">
        <div class="swatch-card__copied">已复制</div>
      </div>
      <div class="swatch-card__info">
        <div class="swatch-card__name">${name}</div>
        <div class="swatch-card__value">${desc || value}</div>
      </div>`;
    card.addEventListener('click', () => copyText(name, card));
    grid.appendChild(card);
  });

  el.appendChild(grid);
}

/* ---- Build semantic chips ---- */
function buildSemanticGroup(containerId, groups) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = '';

  groups.forEach(({ category, states }) => {
    const title = document.createElement('div');
    title.className = 'subsection-title';
    title.textContent = category;
    el.appendChild(title);

    const row = document.createElement('div');
    row.className = 'semantic-group';

    states.forEach(({ name, state }) => {
      const value = resolveVar(name) || '#ccc';
      const chip = document.createElement('div');
      chip.className = 'semantic-chip';
      chip.innerHTML = `
        <div class="semantic-chip__dot" style="background:${value}"></div>
        <div class="semantic-chip__body">
          <div class="semantic-chip__name">${name}</div>
          <div class="semantic-chip__state">${state}</div>
        </div>`;
      chip.addEventListener('click', () => copyText(name, chip));
      row.appendChild(chip);
    });

    el.appendChild(row);
  });
}

/* ---- Build token table ---- */
function buildTokenTable(containerId, tokens, showSwatch = false) {
  const el = document.getElementById(containerId);
  if (!el) return;

  let html = `<table class="token-table">
    <thead><tr>
      ${showSwatch ? '<th></th>' : ''}
      <th>Token</th>
      <th>Value</th>
      <th>Description</th>
    </tr></thead>
    <tbody>`;

  tokens.forEach(({ name, value, desc }) => {
    html += `<tr>
      ${showSwatch ? `<td class="cell-swatch"><span class="swatch-dot" style="background:${value}"></span></td>` : ''}
      <td class="cell-name" data-copy="${name}">${name}</td>
      <td class="cell-value">${value}</td>
      <td style="font-size:12px;color:var(--text-h3)">${desc || ''}</td>
    </tr>`;
  });

  html += '</tbody></table>';
  el.innerHTML = html;

  el.querySelectorAll('.cell-name[data-copy]').forEach(cell => {
    cell.addEventListener('click', () => copyText(cell.dataset.copy));
  });
}

/* ---- isLight: determine if color is light ---- */
function isLight(color) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return (r * 299 + g * 587 + b * 114) / 1000 > 128;
}

/* ---- Scrollspy ---- */
function initScrollspy() {
  const links = document.querySelectorAll('.nav-link[href^="#"]');
  const sections = [...links].map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });

  sections.forEach(s => observer.observe(s));
}

/* ---- Utility class copy chips ---- */
function initUtilChips() {
  document.querySelectorAll('.util-chip[data-copy]').forEach(chip => {
    chip.addEventListener('click', () => copyText(chip.dataset.copy, chip));
  });
}

/* ---- Init all swatches from pre-defined data ---- */
function initColorData() {
  /* Compute actual values */
  const cv = name => resolveVar(name) || '';

  /* Scale: Primary Blue */
  buildSwatchScale('swatch-blue', [
    {name:'--base-primary-blue1',  value:'#f5f8ff'},
    {name:'--base-primary-blue2',  value:'#f2f6ff'},
    {name:'--base-primary-blue3',  value:'#e5edff'},
    {name:'--base-primary-blue4',  value:'#ccdbff'},
    {name:'--base-primary-blue5',  value:'#b2caff'},
    {name:'--base-primary-blue6',  value:'#99b8ff'},
    {name:'--base-primary-blue7',  value:'#80a6ff'},
    {name:'--base-primary-blue8',  value:'#6694ff'},
    {name:'--base-primary-blue9',  value:'#4d83ff'},
    {name:'--base-primary-blue10', value:'#3371ff'},
  ]);

  buildSwatchScale('swatch-pink', [
    {name:'--base-marking-pink1',  value:'#fff6f9'},
    {name:'--base-marking-pink2',  value:'#fff2f6'},
    {name:'--base-marking-pink3',  value:'#ffe5ed'},
    {name:'--base-marking-pink4',  value:'#ffccdb'},
    {name:'--base-marking-pink5',  value:'#ffb2c9'},
    {name:'--base-marking-pink6',  value:'#ff99b7'},
    {name:'--base-marking-pink7',  value:'#ff80a6'},
    {name:'--base-marking-pink8',  value:'#ff6694'},
    {name:'--base-marking-pink9',  value:'#ff4d82'},
    {name:'--base-marking-pink10', value:'#ff3371'},
  ]);

  buildSwatchScale('swatch-red', [
    {name:'--base-error-red1',  value:'#ffeced'},
    {name:'--base-error-red2',  value:'#ffd9dc'},
    {name:'--base-error-red3',  value:'#ffccd0'},
    {name:'--base-error-red4',  value:'#ffb2b9'},
    {name:'--base-error-red5',  value:'#ffa6ad'},
    {name:'--base-error-red6',  value:'#ff99a2'},
    {name:'--base-error-red7',  value:'#f27984'},
    {name:'--base-error-red8',  value:'#e55c68'},
    {name:'--base-error-red9',  value:'#e53948'},
    {name:'--base-error-red10', value:'#d92c3a'},
  ]);

  buildSwatchScale('swatch-green', [
    {name:'--base-success-green1',  value:'#ddf6e9'},
    {name:'--base-success-green2',  value:'#cef2e0'},
    {name:'--base-success-green3',  value:'#c2f2d9'},
    {name:'--base-success-green4',  value:'#ace5c8'},
    {name:'--base-success-green5',  value:'#8dd9b2'},
    {name:'--base-success-green6',  value:'#82d9ac'},
    {name:'--base-success-green7',  value:'#52cc8d'},
    {name:'--base-success-green8',  value:'#3fc27f'},
    {name:'--base-success-green9',  value:'#26bf71'},
    {name:'--base-success-green10', value:'#0cba60'},
  ]);

  buildSwatchScale('swatch-orange', [
    {name:'--base-warning-orange1',  value:'#fff1e3'},
    {name:'--base-warning-orange2',  value:'#ffecd9'},
    {name:'--base-warning-orange3',  value:'#ffe1bf'},
    {name:'--base-warning-orange5',  value:'#ffc78c'},
    {name:'--base-warning-orange6',  value:'#ffc180'},
    {name:'--base-warning-orange7',  value:'#ffb566'},
    {name:'--base-warning-orange8',  value:'#ffa94d'},
    {name:'--base-warning-orange9',  value:'#ff9d33'},
    {name:'--base-warning-orange10', value:'#ff8a0e'},
  ]);

  buildSwatchScale('swatch-gray', [
    {name:'--base-neutral-gray1', value:'#f5f7fa'},
    {name:'--base-neutral-gray2', value:'#ededee'},
    {name:'--base-neutral-gray3', value:'#e6e7e8'},
    {name:'--base-neutral-gray4', value:'#d2d3d6'},
    {name:'--base-neutral-gray5', value:'#b4b6bc'},
    {name:'--base-neutral-gray6', value:'#9c9ea4'},
    {name:'--base-neutral-gray7', value:'#81858d'},
    {name:'--base-neutral-gray8', value:'#1e2533'},
    {name:'--base-neutral-gray9', value:'#050c1c'},
  ]);

  /* White + Black grids */
  buildSwatchGrid('swatch-white', [
    {name:'--base-neutral-white1', value:'rgba(255,255,255,0.2)', desc:'20% opacity'},
    {name:'--base-neutral-white2', value:'rgba(255,255,255,0.3)', desc:'30% opacity'},
    {name:'--base-neutral-white3', value:'rgba(255,255,255,0.4)', desc:'40% opacity'},
    {name:'--base-neutral-white4', value:'rgba(255,255,255,0.6)', desc:'60% opacity'},
    {name:'--base-neutral-white5', value:'rgba(255,255,255,0.8)', desc:'80% opacity'},
    {name:'--base-neutral-white6', value:'#ffffff',               desc:'100% white'},
  ]);

  buildSwatchGrid('swatch-black', [
    {name:'--base-neutral-black3',  value:'rgba(0,0,0,0.3)',  desc:'30% opacity'},
    {name:'--base-neutral-black4',  value:'rgba(0,0,0,0.4)',  desc:'40% opacity'},
    {name:'--base-neutral-black5',  value:'rgba(0,0,0,0.5)',  desc:'50% opacity'},
    {name:'--base-neutral-black6',  value:'rgba(0,0,0,0.6)',  desc:'60% opacity'},
    {name:'--base-neutral-black7',  value:'rgba(0,0,0,0.7)',  desc:'70% opacity'},
    {name:'--base-neutral-black8',  value:'rgba(0,0,0,0.8)',  desc:'80% opacity'},
    {name:'--base-neutral-black9',  value:'rgba(0,0,0,0.9)',  desc:'90% opacity'},
    {name:'--base-neutral-black10', value:'#000000',           desc:'100% black'},
  ]);

  /* Semantic */
  buildSemanticGroup('swatch-semantic', [
    { category: 'Primary（主色）', states: [
      { name: '--sys-primary-default',  state: 'Default' },
      { name: '--sys-primary-hover',    state: 'Hover' },
      { name: '--sys-primary-active',   state: 'Active' },
      { name: '--sys-primary-disabled', state: 'Disabled' },
      { name: '--sys-primary-inactive', state: 'Inactive' },
    ]},
    { category: 'Marking（营销粉）', states: [
      { name: '--sys-marking-default',  state: 'Default' },
      { name: '--sys-marking-hover',    state: 'Hover' },
      { name: '--sys-marking-active',   state: 'Active' },
      { name: '--sys-marking-disabled', state: 'Disabled' },
    ]},
    { category: 'Error（错误）', states: [
      { name: '--sys-error-default',  state: 'Default' },
      { name: '--sys-error-hover',    state: 'Hover' },
      { name: '--sys-error-active',   state: 'Active' },
      { name: '--sys-error-disabled', state: 'Disabled' },
    ]},
    { category: 'Success（成功）', states: [
      { name: '--sys-success-default',  state: 'Default' },
      { name: '--sys-success-hover',    state: 'Hover' },
      { name: '--sys-success-active',   state: 'Active' },
      { name: '--sys-success-disabled', state: 'Disabled' },
    ]},
    { category: 'Warning（警告）', states: [
      { name: '--sys-warning-default',  state: 'Default' },
      { name: '--sys-warning-hover',    state: 'Hover' },
      { name: '--sys-warning-active',   state: 'Active' },
      { name: '--sys-warning-disabled', state: 'Disabled' },
    ]},
  ]);

  /* Background + Text + Border token tables */
  buildTokenTable('table-bg', [
    { name: '--bg-page-primary',   value: '#ffffff',  desc: '页面主背景' },
    { name: '--bg-page-secondary', value: '#f5f7fa',  desc: '页面次级背景' },
  ], true);

  buildTokenTable('table-text', [
    { name: '--text-h1',          value: '#1e2533', desc: '主标题文字' },
    { name: '--text-h2',          value: '#81858d', desc: '副标题文字' },
    { name: '--text-h3',          value: '#9c9ea4', desc: '三级标题文字' },
    { name: '--text-caption',     value: '#b4b6bc', desc: '说明文字' },
    { name: '--text-placeholder', value: '#d2d3d6', desc: '占位符' },
    { name: '--text-disabled',    value: '#d2d3d6', desc: '禁用文字' },
    { name: '--text-body',        value: '#1e2533', desc: '正文默认' },
  ], true);

  buildTokenTable('table-border', [
    { name: '--border-stroke',  value: '#e6e7e8', desc: '描边边框' },
    { name: '--border-divider', value: '#ededee', desc: '分割线' },
  ], true);

  buildTokenTable('table-functional', [
    { name: '--functional-raise-amount',       value: '#d92c3a', desc: '提额金额（error）' },
    { name: '--functional-overdue',            value: '#d92c3a', desc: '逾期（error）' },
    { name: '--functional-rate-reduction',     value: '#0cba60', desc: '降费率（success）' },
    { name: '--functional-interest-free',      value: '#0cba60', desc: '免息（success）' },
    { name: '--functional-interest-reduction', value: '#ff8a0e', desc: '减息（warning）' },
  ], true);
}

/* ---- DOMContentLoaded ---- */
document.addEventListener('DOMContentLoaded', () => {
  initColorData();
  initScrollspy();
  initUtilChips();
});
