/* ============================================================
   Mock Data
   後端接口替換說明：
   - 將 ORDERS_DATA 替換為實際 API 返回的訂單列表
   - 每個字段含義見各字段注释
   - 接口建议返回字段同名，前端直接绑定即可
   ============================================================ */

/**
 * 产品图标配置表
 * 按业务类型 (productType) 动态加载不同图标
 * TODO: 如需新增业务类型，在此处添加对应图标路径
 */
const PRODUCT_ICON_MAP = {
  'jieqian':  './assets/icons/product-icon-jieqian.png',  /* 借钱-灵活借 */
  'jianya':   './assets/icons/product-icon-jianya.png',   /* 还款减压服务 */
  'default':  './assets/icons/product-icon-jieqian.png',  /* 默认兜底 */
};

/* 需要显示说明弹窗的产品类型：点击标题右侧问号图标触发
   TODO: 若后续有更多产品说明，在此数组中追加对应 progressType */
const SERVICE_INFO_TYPES = ['service_failed', 'service_processing', 'service_effective'];

/**
 * 银行 Logo 配置表（1倍 16×16）
 * TODO: 替换为各银行真实 logo 图片路径
 * key 对应 ORDERS_DATA 中 bank.icon 字段
 */
const BANK_ICON_MAP = {
  'cmb':   './assets/icons/bank-cmb.png',    /* 招商银行 */
  'icbc':  './assets/icons/bank-icbc.png',   /* 工商银行 */
  'abc':   './assets/icons/bank-abc.png',    /* 农业银行 */
  'boc':   './assets/icons/bank-boc.png',    /* 中国银行 */
  'ccb':   './assets/icons/bank-ccb.png',    /* 建设银行 */
};

/**
 * 订单模拟数据（首屏分页见 ALL_ORDERS + PAGE_SIZE）
 * TODO: 替换为真实接口，例：
 *   const res = await fetch('/api/orders?tab=jieqian&page=1&pageSize=10');
 *   const ORDERS_DATA = await res.json();
 */
const ORDERS_DATA = [
  {
    id: 'order_001',
    productType: 'jieqian',          /* [接口字段] 业务类型，决定左侧图标 */
    productName: '借款',              /* [接口字段] 产品名称 */
    amount: 1400,                     /* [接口字段] 借款金额（元）*/
    totalPeriods: 24,                 /* [接口字段] 共几期 */
    tag: '随借随还',                  /* [接口字段] 标签文字 */
    progressType: 'repaying',        /* [接口字段] 订单状态枚举 */
    progressLabel: '还款进度',        /* [接口字段] 进度字段名称 */
    progressValue: '0/24期',          /* [接口字段] 还款进度 */
    bank: { name: '招商银行(4523)', icon: 'cmb' }, /* [接口字段] 收款银行卡 */
    orderTime: '2025-12-18 20:20:10', /* [接口字段] 下单时间 */
  },
  {
    id: 'order_002',
    productType: 'jieqian',
    productName: '借款',
    amount: 1400,
    totalPeriods: 24,
    tag: '先用后付',
    progressType: 'repaying',
    progressLabel: '还款进度',
    progressValue: '12/24期',
    bank: { name: '招商银行(4523)', icon: 'cmb' },
    orderTime: '2025-12-18 20:20:10',
  },
  {
    id: 'order_003',
    productType: 'jieqian',
    productName: '借款',
    amount: 1400,
    totalPeriods: 24,
    tag: '随借随还',
    progressType: 'paid_off',        /* 已还清 */
    progressLabel: '还款进度',
    progressValue: '已还清',
    bank: { name: '招商银行(4523)', icon: 'cmb' },
    orderTime: '2025-12-18 20:20:10',
  },
  {
    id: 'order_004',
    productType: 'jieqian',
    productName: '借款',
    amount: 1400,
    totalPeriods: 24,
    tag: '随借随还',
    progressType: 'repay_failed',   /* 还款失败 */
    progressLabel: '还款进度',
    progressPeriod: '12/24期',       /* [接口字段] 当前还款期数 */
    progressStatus: '还款失败',      /* [接口字段] 附加状态文字 */
    progressStatusColor: 'error',
    bank: { name: '招商银行(4523)', icon: 'cmb' },
    orderTime: '2025-12-18 20:20:10',
  },
  {
    id: 'order_005',
    productType: 'jieqian',
    productName: '借款',
    amount: 1400,
    totalPeriods: 24,
    tag: '随借随还',
    progressType: 'overdue',        /* 已逾期 */
    progressLabel: '还款进度',
    progressPeriod: '12/24期',
    progressStatus: '已逾期3期',
    progressStatusColor: 'error',
    bank: { name: '招商银行(4523)', icon: 'cmb' },
    orderTime: '2025-12-18 20:20:10',
  },
  {
    id: 'order_006',
    productType: 'jieqian',
    productName: '借款',
    amount: 1400,
    totalPeriods: 24,
    tag: '随借随还',
    progressType: 'pending_confirm', /* 待确认（含倒计时）*/
    progressLabel: '借款进度',
    countdown: 84813,                /* [接口字段] 剩余秒数，由服务端下发 */
    bank: { name: '招商银行(4523)', icon: 'cmb' },
    orderTime: '2025-12-18 20:20:10',
    actions: ['cancel', 'confirm'], /* [接口字段] 可用操作按钮 */
  },
  {
    id: 'order_007',
    productType: 'jieqian',
    productName: '借款',
    amount: 1400,
    totalPeriods: 24,
    tag: '随借随还',
    progressType: 'closed',         /* 已关闭 */
    progressLabel: '借款进度',
    progressValue: '已关闭',
    orderTime: '2025-12-18 20:20:10',
  },
  {
    id: 'order_008',
    productType: 'jieqian',
    productName: '借款',
    amount: 1400,
    totalPeriods: 24,
    tag: '随借随还',
    progressType: 'reviewing',      /* 审核中 */
    progressLabel: '借款进度',
    progressValue: '审核中',
    bank: { name: '招商银行(4523)', icon: 'cmb' },
    orderTime: '2025-12-18 20:20:10',
  },

  /* ────────────────────────────────────────────────────────────
     还款减压服务三种状态
     产品名称改为"减压金额"，标签改为"还款减压服务"
     无收款银行卡；进度字段名="办理进度"，时间字段名="办理时间"
     TODO: 替换为真实接口，例：
       const res = await fetch('/api/service-orders?tab=jieqian');
       const serviceOrders = await res.json();
     ──────────────────────────────────────────────────────────── */
  {
    id: 'order_009',
    productType: 'jianya',
    productName: '减压金额',          /* [接口字段] 产品名称（还款减压服务类型） */
    amount: 1400,                     /* [接口字段] 减压金额（元）*/
    totalPeriods: 9,                  /* [接口字段] 共几期 */
    tag: '还款减压服务',              /* [接口字段] 标签文字 */
    progressType: 'service_failed',  /* [接口字段] 订单状态：生效失败 */
    progressLabel: '办理进度',        /* [接口字段] 进度字段名 */
    progressValue: '生效失败',        /* [接口字段] 进度值 */
    progressValueColor: 'error',     /* [接口字段] 进度值颜色标记 */
    timeLabel: '办理时间',            /* [接口字段] 时间字段名 */
    orderTime: '2025-12-18 20:20:10',/* [接口字段] 办理时间 */
    /* bank: 无收款银行卡，不传此字段 */
    footerNote: {
      text: '还款减压服务生效失败，请您按时还款', /* [接口字段] 底部提示文案 */
      color: 'error',                             /* [接口字段] 文案颜色：error=红色 */
    },
  },
  {
    id: 'order_010',
    productType: 'jianya',
    productName: '减压金额',          /* [接口字段] 产品名称 */
    amount: 1400,                     /* [接口字段] 减压金额（元）*/
    totalPeriods: 9,                  /* [接口字段] 共几期 */
    tag: '还款减压服务',              /* [接口字段] 标签文字 */
    progressType: 'service_processing', /* [接口字段] 订单状态：办理成功（待生效）*/
    progressLabel: '办理进度',        /* [接口字段] 进度字段名 */
    progressValue: '办理成功',        /* [接口字段] 进度值 */
    progressValueColor: 'primary',   /* [接口字段] 进度值颜色标记 */
    timeLabel: '办理时间',            /* [接口字段] 时间字段名 */
    orderTime: '2025-12-18 20:20:10',/* [接口字段] 办理时间 */
    /* bank: 无收款银行卡，不传此字段 */
    footerNote: {
      text: '预计2026年03月08日通知生效结果', /* [接口字段] 预计生效时间文案，由接口动态返回 */
      color: 'muted',                         /* [接口字段] 文案颜色：muted=灰色 */
    },
    actions: ['cancel-service'],              /* [接口字段] 可用操作按钮 */
  },
  {
    id: 'order_011',
    productType: 'jianya',
    productName: '减压金额',          /* [接口字段] 产品名称 */
    amount: 1400,                     /* [接口字段] 减压金额（元）*/
    totalPeriods: 9,                  /* [接口字段] 共几期 */
    tag: '还款减压服务',              /* [接口字段] 标签文字 */
    progressType: 'service_effective', /* [接口字段] 订单状态：生效成功 */
    progressLabel: '办理进度',        /* [接口字段] 进度字段名 */
    progressValue: '生效成功',        /* [接口字段] 进度值 */
    progressValueColor: 'muted',     /* [接口字段] 进度值颜色标记 */
    timeLabel: '办理时间',            /* [接口字段] 时间字段名 */
    orderTime: '2025-12-18 20:20:10',/* [接口字段] 办理时间 */
    /* bank: 无收款银行卡，不传此字段 */
    serviceUser: '张三',              /* [接口字段] 生效用户姓名（X无需再还款中的X）*/
    footerNote: {
      /* text 由 JS 拼接：serviceUser + "无需再还款" */
      color: 'muted',                 /* [接口字段] 文案颜色 */
    },
  },
];

/** 每页条数；接接口时与后端 pageSize 对齐 */
const PAGE_SIZE = 10;

/** 滑动触底自动加载时防重入 */
let ordersAppendInFlight = false;

/** 由 initOrdersInfiniteScroll 赋值：用于刷新后触发「不足一屏则补页」 */
let checkJieqianInfiniteScroll = () => {};

/**
 * 全量订单（mock：原表 + 追加数据便于分页演示）
 * TODO: 接接口后改为接口分页返回，刷新时重新请求第一页
 */
const ALL_ORDERS = (() => {
  const list = [...ORDERS_DATA];
  for (let i = 0; i < 17; i++) {
    const tpl = ORDERS_DATA[i % ORDERS_DATA.length];
    list.push({
      ...tpl,
      id: `order_mock_${String(i).padStart(3, '0')}`,
      amount: 800 + (i % 40) * 50,
    });
  }
  return list;
})();

/* ============================================================
   Helpers
   ============================================================ */
function formatCountdown(secs) {
  const h = String(Math.floor(secs / 3600)).padStart(2, '0');
  const m = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
  const s = String(secs % 60).padStart(2, '0');
  return `剩余 ${h}:${m}:${s} 待确认`;
}

function getProductIcon(productType) {
  return PRODUCT_ICON_MAP[productType] || PRODUCT_ICON_MAP['default'];
}

/* ============================================================
   Render — build card DOM from data
   ============================================================ */
/* 颜色标记 → CSS class 映射 */
const COLOR_CLASS_MAP = {
  'error':   'text-error',
  'success': 'text-success',
  'primary': 'text-primary',
  'muted':   'text-muted',
};

function renderProgressValue(order) {
  const { progressType, progressValue, progressPeriod, progressStatus,
          progressStatusColor, progressValueColor } = order;

  /* 还款减压服务三种状态：直接显示文字，颜色由 progressValueColor 控制 */
  /* service_closed：取消服务后的「已关闭」态，由前端在「我知道了」后写入，接口应对齐该枚举 */
  if (['service_failed', 'service_processing', 'service_effective', 'service_closed'].includes(progressType)) {
    const cls = COLOR_CLASS_MAP[progressValueColor] || 'text-muted';
    return `<span class="info-row__value ${cls}">${progressValue}</span>`;
  }

  /* 普通单值状态 */
  if (['repaying', 'paid_off', 'closed', 'reviewing'].includes(progressType)) {
    const color = progressType === 'paid_off' ? 'text-success' : 'text-muted';
    return `<span class="info-row__value ${color}">${progressValue}</span>`;
  }

  /* 复合状态：期数 + 分隔线 + 状态标记 */
  if (['repay_failed', 'overdue'].includes(progressType)) {
    const statusClass = progressStatusColor === 'error' ? 'text-error' : 'text-primary';
    return `
      <div class="order-card__compound-progress">
        <span class="order-card__compound-text text-muted">${progressPeriod}</span>
        <span class="status-separator"></span>
        <span class="order-card__compound-text ${statusClass}">${progressStatus}</span>
      </div>`;
  }

  /* 待确认倒计时 */
  if (progressType === 'pending_confirm') {
    return `<span class="info-row__value text-primary countdown-timer" data-seconds="${order.countdown}">${formatCountdown(order.countdown)}</span>`;
  }

  return '';
}

function renderBankRow(bank) {
  if (!bank) return '';

  /* 优先使用配置表中的 logo 图片（1倍 16×16）
     TODO: 将各银行 logo 图片放入 assets/icons/，
           文件名与 BANK_ICON_MAP 中的 key 对应即可自动加载 */
  const logoPath = BANK_ICON_MAP[bank.icon];

  const bankIconHtml = logoPath
    ? `<span class="bank-icon"><img src="${logoPath}" alt="${bank.name}" /></span>`
    : `<span class="bank-icon">
         <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
           <rect width="16" height="16" rx="8" fill="#E53948"/>
           <text x="8" y="11.5" text-anchor="middle" font-size="8"
                 fill="white" font-weight="bold" font-family="PingFang SC,sans-serif">招</text>
         </svg>
       </span>`;

  return `
    <div class="info-row">
      <span class="info-row__label">收款银行卡</span>
      <span class="info-row__bank">
        ${bankIconHtml}
        <span class="info-row__value text-muted">${bank.name}</span>
      </span>
    </div>`;
}

function renderFooterNote(order) {
  if (!order.footerNote) return '';
  /* 生效成功：拼接 serviceUser + 固定文案 */
  let text = order.footerNote.text;
  if (order.progressType === 'service_effective') {
    /* [接口字段] serviceUser 为动态数据，X无需再还款 */
    text = `${order.serviceUser || 'X'}无需再还款`;
  }
  const cls = COLOR_CLASS_MAP[order.footerNote.color] || 'text-muted';
  return `<p class="order-card__note ${cls}">${text}</p>`;
}

function renderActionButtons(actions, orderId) {
  if (!actions || actions.length === 0) return '';
  const btns = actions.map(action => {
    if (action === 'cancel') {
      return `<button class="btn btn--sm-ghost" data-action="cancel-order" data-order-id="${orderId}">取消订单</button>`;
    }
    if (action === 'confirm') {
      return `<button class="btn btn--sm-primary" data-action="confirm-order" data-order-id="${orderId}">去确认</button>`;
    }
    if (action === 'cancel-service') {
      return `<button class="btn btn--sm-ghost" data-action="cancel-service" data-order-id="${orderId}">取消服务</button>`;
    }
    return '';
  }).join('');
  return `<div class="order-card__actions">${btns}</div>`;
}

function renderCard(order) {
  const iconSrc = getProductIcon(order.productType);

  const card = document.createElement('article');
  card.className = 'order-card';
  card.dataset.orderId = order.id;

  card.innerHTML = `
    <!-- Header:
         [产品模块: 图标 —2px— 文字] —8px— [badge标签]
         每个小模块之间间距 8px，模块内图标与文字间距 2px -->
    <div class="order-card__header">
      <div class="order-product-module">
        <div class="product-icon">
          <img src="${iconSrc}" alt="${order.productType}" />
        </div>
        <!-- 标题行：各文字片段间距 2px（1倍图规范），自动布局不硬编码宽度 -->
        <div class="order-title-group">
          <span class="order-title-piece">${order.productName}</span>
          <span class="order-title-piece order-title-amount">${order.amount}</span>
          <span class="order-title-piece">元共</span>
          <span class="order-title-piece order-title-periods">${order.totalPeriods}</span>
          <span class="order-title-piece">期</span>
          <!-- [接口字段] 仅还款减压服务类型显示说明图标，点击弹出服务说明弹窗 -->
          <!-- [接口字段] 仅还款减压服务类型显示说明图标，点击弹出服务说明弹窗；纯SVG代码，无图片依赖 -->
          ${SERVICE_INFO_TYPES.includes(order.progressType)
            ? `<button class="order-info-btn" data-action="open-service-info" aria-label="查看服务说明">
                 <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                   <circle cx="7" cy="7" r="6.5" stroke="#A4A8AC" stroke-width="1"/>
                   <text x="7" y="10.5" text-anchor="middle" font-size="8" font-weight="600"
                         fill="#A4A8AC" font-family="PingFang SC,sans-serif">?</text>
                 </svg>
               </button>`
            : ''}
        </div>
      </div>
      <span class="badge-tag"><span class="badge-tag__text">${order.tag}</span></span>
    </div>

    <!-- Body: info rows -->
    <div class="order-card__body">
      <!-- [API] progressLabel + progressValue / countdown -->
      <div class="info-row">
        <span class="info-row__label">${order.progressLabel}</span>
        ${renderProgressValue(order)}
      </div>

      <!-- [API] bank (optional, 还款减压服务类无此字段) -->
      ${renderBankRow(order.bank)}

      <!-- [API] orderTime；timeLabel 字段控制标签名："下单时间" 或 "办理时间" -->
      <div class="info-row">
        <span class="info-row__label">${order.timeLabel || '下单时间'}</span>
        <span class="info-row__value text-muted">${order.orderTime}</span>
      </div>
    </div>

    <!-- [API] footerNote + actions：
         - 若同时存在则并排显示（如"办理成功"：左文案 + 右按钮）
         - 若仅有 footerNote 则独占一行（如生效失败/生效成功） -->
    ${(order.footerNote && order.actions && order.actions.length)
      ? `<div class="order-card__footer-row">
           ${renderFooterNote(order)}
           ${renderActionButtons(order.actions, order.id)}
         </div>`
      : renderFooterNote(order) + renderActionButtons(order.actions, order.id)
    }
  `;

  return card;
}

/* ============================================================
   订单列表：分页 + 倒计时（仅绑定未启动的节点）
   ============================================================ */
function clearCountdownTimersIn(root) {
  root?.querySelectorAll('.countdown-timer').forEach(el => {
    if (el._cdTimer) {
      clearInterval(el._cdTimer);
      delete el._cdTimer;
    }
  });
}

function startCountdownsIn(root) {
  if (!root) return;
  root.querySelectorAll('.countdown-timer').forEach(el => {
    if (el._cdTimer) return;
    let secs = parseInt(el.dataset.seconds, 10);
    if (isNaN(secs) || secs <= 0) return;
    el._cdTimer = setInterval(() => {
      secs--;
      if (secs <= 0) {
        clearInterval(el._cdTimer);
        delete el._cdTimer;
        el.textContent = '已超时';
        el.classList.remove('text-primary');
        el.classList.add('text-muted');
        return;
      }
      el.textContent = formatCountdown(secs);
    }, 1000);
  });
}

/**
 * @param {{ reset?: boolean, append?: boolean }} options
 *   reset — 下拉刷新 / 首屏：只保留第一页
 *   append — 加载更多：追加下一页（每页 PAGE_SIZE 条）
 */
function renderOrdersList(options = {}) {
  const { reset, append } = options;
  const container = document.getElementById('orders-list');
  if (!container) return;

  if (reset) {
    clearCountdownTimersIn(container);
    container.replaceChildren();
    ALL_ORDERS.slice(0, PAGE_SIZE).forEach(order => {
      container.appendChild(renderCard(order));
    });
  } else if (append) {
    const n = container.children.length;
    if (n >= ALL_ORDERS.length) return;
    const slice = ALL_ORDERS.slice(n, Math.min(n + PAGE_SIZE, ALL_ORDERS.length));
    slice.forEach(order => container.appendChild(renderCard(order)));
  }

  requestAnimationFrame(() => {
    syncJieqianPanelScroll();
    requestAnimationFrame(syncJieqianPanelScroll);
  });
  startCountdownsIn(container);
}

/** 数据变更后按当前已展示条数重绘（如取消服务后） */
function remountVisibleOrders() {
  const container = document.getElementById('orders-list');
  if (!container) return;
  const n = container.children.length;
  clearCountdownTimersIn(container);
  container.replaceChildren();
  ALL_ORDERS.slice(0, n).forEach(order => {
    container.appendChild(renderCard(order));
  });
  requestAnimationFrame(() => {
    syncJieqianPanelScroll();
    requestAnimationFrame(syncJieqianPanelScroll);
  });
  startCountdownsIn(container);
}

function mountOrders() {
  renderOrdersList({ reset: true });
}

/* 借钱 Tab：仅当内容超出可视高度时才允许纵向滚动 */
function syncJieqianPanelScroll() {
  const panel = document.getElementById('panel-jieqian');
  if (!panel) return;
  const overflow = panel.scrollHeight > panel.clientHeight + 2;
  panel.classList.toggle('page-content--overflow', overflow);
}

function initScrollSync() {
  const panel = document.getElementById('panel-jieqian');
  const list = document.getElementById('orders-list');
  const run = () => syncJieqianPanelScroll();
  window.addEventListener('resize', run);
  list?.addEventListener('load', run, true);
  if (panel && typeof ResizeObserver !== 'undefined') {
    const ro = new ResizeObserver(run);
    ro.observe(panel);
    if (list) ro.observe(list);
    const inf = document.getElementById('orders-infinite-footer');
    if (inf) ro.observe(inf);
  }
}

/* ============================================================
   借钱 Tab：触底自动加载（每页 PAGE_SIZE 条）
   使用 IntersectionObserver（root=列表滚动容器），避免部分机型 scroll 不触发
   ============================================================ */
function initOrdersInfiniteScroll() {
  const panel = document.getElementById('panel-jieqian');
  const loadingEl = document.getElementById('orders-infinite-loading');
  const footer = document.getElementById('orders-infinite-footer');
  if (!panel || !loadingEl || !footer) return;

  const ROOT_MARGIN_BOTTOM = '120px';

  function reconnectFooterObserve(io) {
    io.unobserve(footer);
    io.observe(footer);
  }

  async function tryLoadMore() {
    if (ordersAppendInFlight) return;
    const container = document.getElementById('orders-list');
    if (!container || container.children.length >= ALL_ORDERS.length) return;

    ordersAppendInFlight = true;
    loadingEl.hidden = false;
    loadingEl.setAttribute('aria-busy', 'true');

    /* 先让浏览器绘制「加载中」再请求 */
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    await new Promise(r => setTimeout(r, 400));

    if (container.children.length >= ALL_ORDERS.length) {
      loadingEl.hidden = true;
      loadingEl.removeAttribute('aria-busy');
      ordersAppendInFlight = false;
      return;
    }

    renderOrdersList({ append: true });

    loadingEl.hidden = true;
    loadingEl.removeAttribute('aria-busy');
    ordersAppendInFlight = false;

    requestAnimationFrame(() => {
      syncJieqianPanelScroll();
      requestAnimationFrame(() => reconnectFooterObserve(io));
    });
  }

  const io = new IntersectionObserver(
    entries => {
      for (const ent of entries) {
        if (!ent.isIntersecting) continue;
        void tryLoadMore();
      }
    },
    { root: panel, rootMargin: `0px 0px ${ROOT_MARGIN_BOTTOM} 0px`, threshold: 0 }
  );

  io.observe(footer);

  function onScrollFallback() {
    if (ordersAppendInFlight) return;
    const container = document.getElementById('orders-list');
    if (!container || container.children.length >= ALL_ORDERS.length) return;
    const { scrollTop, scrollHeight, clientHeight } = panel;
    if (scrollHeight - scrollTop - clientHeight > 100) return;
    void tryLoadMore();
  }

  panel.addEventListener('scroll', onScrollFallback, { passive: true });

  checkJieqianInfiniteScroll = () => {
    reconnectFooterObserve(io);
    void tryLoadMore();
  };

  requestAnimationFrame(() => {
    reconnectFooterObserve(io);
    void tryLoadMore();
  });
}

function initPullToRefresh() {
  const panel = document.getElementById('panel-jieqian');
  const ptr = document.getElementById('orders-ptr');
  const ptrText = ptr?.querySelector('.orders-ptr__text');
  if (!panel || !ptr || !ptrText) return;

  const PULL_THRESHOLD_PX = 56;
  const PULL_MAX_PX = 72;
  let startY = 0;
  let startX = 0;
  let pulling = false;
  let pullDist = 0;
  let refreshing = false;

  const remToPx = () => parseFloat(getComputedStyle(document.documentElement).fontSize) || 10;

  async function runOrdersRefresh() {
    if (refreshing) return;
    refreshing = true;
    const infLoad = document.getElementById('orders-infinite-loading');
    if (infLoad) infLoad.hidden = true;
    ptr.classList.add('is-loading');
    ptr.classList.remove('is-pulling', 'is-ready');
    ptrText.textContent = '刷新中…';
    ptr.style.height = `${4 * remToPx()}px`;
    try {
      await new Promise(r => setTimeout(r, 480));
      renderOrdersList({ reset: true });
    } finally {
      ptr.style.height = '0';
      ptr.classList.remove('is-loading');
      ptrText.textContent = '下拉刷新';
      refreshing = false;
    }
    /* 列表回到顶部默认位置（双 rAF 等待布局后再滚） */
    requestAnimationFrame(() => {
      panel.scrollTop = 0;
      requestAnimationFrame(() => {
        panel.scrollTop = 0;
        syncJieqianPanelScroll();
        checkJieqianInfiniteScroll();
      });
    });
    pullDist = 0;
  }

  panel.addEventListener('touchstart', e => {
    if (e.touches.length !== 1 || refreshing) return;
    startY = e.touches[0].clientY;
    startX = e.touches[0].clientX;
  }, { passive: true });

  panel.addEventListener('touchmove', e => {
    if (e.touches.length !== 1 || refreshing) return;
    if (panel.scrollTop > 2) {
      ptr.style.height = '0';
      ptr.classList.remove('is-pulling', 'is-ready');
      pulling = false;
      return;
    }
    const x = e.touches[0].clientX;
    const y = e.touches[0].clientY;
    const dy = y - startY;
    const dx = x - startX;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) return;

    if (dy > 0) {
      e.preventDefault();
      pulling = true;
      pullDist = Math.min(dy * 0.45, PULL_MAX_PX);
      ptr.style.height = `${pullDist}px`;
      ptr.classList.add('is-pulling');
      const ready = pullDist >= PULL_THRESHOLD_PX;
      ptr.classList.toggle('is-ready', ready);
      ptrText.textContent = ready ? '释放刷新' : '下拉刷新';
    }
  }, { passive: false });

  panel.addEventListener('touchend', () => {
    if (refreshing) return;
    const dist = pullDist;
    ptr.classList.remove('is-pulling');
    if (pulling && dist >= PULL_THRESHOLD_PX) {
      ptr.style.height = '0';
      void runOrdersRefresh();
    } else {
      ptr.style.height = '0';
      ptr.classList.remove('is-ready');
      ptrText.textContent = '下拉刷新';
    }
    pulling = false;
    pullDist = 0;
  });

  panel.addEventListener('touchcancel', () => {
    pulling = false;
    pullDist = 0;
    ptr.style.height = '0';
    ptr.classList.remove('is-pulling', 'is-ready');
    ptrText.textContent = '下拉刷新';
  });
}

/* ============================================================
   Tab：点击 + 横向滑动手势切换，带过渡动画
   TODO: 接入路由时在此同步 URL
   ============================================================ */
const TAB_COUNT = 2;

function initTabView() {
  const viewport = document.getElementById('tab-viewport');
  const track = document.getElementById('tab-viewport-track');
  if (!viewport || !track) return;

  const tabEls = () => [...document.querySelectorAll('.tab-item')];
  const panelEls = () => [...document.querySelectorAll('.tab-viewport__page')];

  let currentTab = 0;

  /* Tab 底部蓝线：2rem 宽，居中对齐当前选中 Tab（相对 .tabs__line-track 定位） */
  function updateTabsLine() {
    const line = document.getElementById('tabs-line');
    const trackEl = document.querySelector('.tabs__line-track');
    const active = document.querySelector('.tab-item--active');
    if (!line || !trackEl || !active) return;
    const remPx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 10;
    const barW = 2 * remPx;
    line.style.width = `${barW}px`;
    const tabRect = active.getBoundingClientRect();
    const trackRect = trackEl.getBoundingClientRect();
    const x = tabRect.left - trackRect.left + (tabRect.width - barW) / 2;
    line.style.transform = `translateX(${x}px)`;
  }

  function setTabIndex(next, { animate = true } = {}) {
    if (next < 0 || next >= TAB_COUNT) return;
    const prev = currentTab;
    currentTab = next;

    /* 切换 Tab 后列表从顶部开始，避免穿透到已滚动位置 */
    if (prev !== next) {
      const jie = document.getElementById('panel-jieqian');
      const shop = document.getElementById('panel-shopping');
      if (next === 0 && jie) jie.scrollTop = 0;
      if (next === 1 && shop) shop.scrollTop = 0;
    }

    track.classList.toggle('is-dragging', !animate);
    track.style.transition = animate
      ? 'transform 0.32s cubic-bezier(0.32, 0.72, 0, 1)'
      : 'none';
    track.style.transform = `translateX(-${next * 50}%)`;

    tabEls().forEach((t, i) => {
      const on = i === next;
      t.classList.toggle('tab-item--active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });

    panelEls().forEach((p, i) => {
      p.setAttribute('aria-hidden', i === next ? 'false' : 'true');
    });

    document.querySelector('.page-header')?.setAttribute('data-active-index', String(next));

    requestAnimationFrame(() => {
      updateTabsLine();
      syncJieqianPanelScroll();
    });
  }

  document.addEventListener('app-switch-tab', e => {
    const idx = e.detail?.index;
    if (typeof idx === 'number' && idx >= 0 && idx < TAB_COUNT) setTabIndex(idx);
  });

  tabEls().forEach((tab, i) => {
    tab.addEventListener('click', () => setTabIndex(i));
    tab.querySelector('.tab-item__label')?.addEventListener('transitionend', (e) => {
      if (e.propertyName === 'font-size' || e.propertyName === 'color') updateTabsLine();
    });
  });

  window.addEventListener('resize', () => {
    requestAnimationFrame(updateTabsLine);
  });

  /* 横向滑动：与纵向滚动区分，避免抢滚动 */
  let startX = 0;
  let startY = 0;
  let startTime = 0;
  let dragging = false;
  let swipeMode = null;
  let basePercent = 0;

  viewport.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) return;
    /* 购物 Tab：禁止横向滑动手势切 Tab，宽度由 CSS 锁屏宽 */
    if (currentTab === 1) return;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    startTime = Date.now();
    dragging = true;
    swipeMode = null;
    basePercent = -currentTab * 50;
    track.classList.add('is-dragging');
    track.style.transition = 'none';
  }, { passive: true });

  viewport.addEventListener('touchmove', (e) => {
    if (currentTab === 1) return;
    if (!dragging || e.touches.length !== 1) return;
    const x = e.touches[0].clientX;
    const y = e.touches[0].clientY;
    const dx = x - startX;
    const dy = y - startY;

    if (swipeMode === null) {
      const ax = Math.abs(dx);
      const ay = Math.abs(dy);
      if (ay > ax && ay > 12) {
        swipeMode = 'vertical';
        return;
      }
      if (ax > 12 && ax > ay) swipeMode = 'horizontal';
      else return;
    }

    if (swipeMode !== 'horizontal') return;

    /* translateX(%) 相对轨道自身宽度；轨道宽约 2×视口 */
    const tw = track.offsetWidth || (viewport.offsetWidth || 1) * 2;
    let total = basePercent + (dx / tw) * 100;

    if (currentTab === 0 && total > 0) total *= 0.35;
    if (currentTab === TAB_COUNT - 1 && total < -(TAB_COUNT - 1) * 50) {
      const minP = -(TAB_COUNT - 1) * 50;
      total = minP + (total - minP) * 0.35;
    }

    track.style.transform = `translateX(${total}%)`;
  }, { passive: true });

  function finishSwipe(endX) {
    if (!dragging) return;
    dragging = false;
    swipeMode = null;
    track.classList.remove('is-dragging');

    const dx = endX - startX;
    const vw = viewport.offsetWidth || 1;
    const fastSwipe = Date.now() - startTime < 280 && Math.abs(dx) > 28;

    if (Math.abs(dx) > vw * 0.18 || fastSwipe) {
      if (dx < 0 && currentTab < TAB_COUNT - 1) {
        setTabIndex(currentTab + 1);
        return;
      }
      if (dx > 0 && currentTab > 0) {
        setTabIndex(currentTab - 1);
        return;
      }
    }
    setTabIndex(currentTab);
  }

  viewport.addEventListener('touchend', (e) => {
    if (currentTab === 1) return;
    if (e.changedTouches[0]) finishSwipe(e.changedTouches[0].clientX);
  });

  viewport.addEventListener('touchcancel', () => {
    if (currentTab === 1) return;
    dragging = false;
    swipeMode = null;
    track.classList.remove('is-dragging');
    setTabIndex(currentTab);
  });

  setTabIndex(0, { animate: false });
  requestAnimationFrame(() => {
    updateTabsLine();
    requestAnimationFrame(() => {
      updateTabsLine();
      syncJieqianPanelScroll();
    });
  });
}

/* ============================================================
   取消订单 / 取消服务 确认弹窗（Figma 165:1076）
   TODO: 接入真实接口后按 cancelContext 调用不同 API
   ============================================================ */
const CANCEL_MODAL_COPY = {
  order: {
    title: '您确定要取消该订单吗？',
    desc: '取消后订单将关闭，如需借款可重新发起申请。',
  },
  service: {
    title: '您确定要取消还款减压服务吗？',
    desc: '取消后，本次获得的还款减压服务将立即失效，后续如需可重新购买参与',
  },
};

function openCancelModal(context) {
  const overlay = document.getElementById('modal-overlay');
  if (!overlay) return;
  overlay.dataset.cancelContext = context;
  const copy = CANCEL_MODAL_COPY[context];
  if (copy) {
    const titleEl = document.getElementById('modal-title');
    const descEl = overlay.querySelector('.modal__desc');
    if (titleEl) titleEl.textContent = copy.title;
    if (descEl) descEl.textContent = copy.desc;
  }
  overlay.classList.add('is-open');
}

function closeCancelModal() {
  const overlay = document.getElementById('modal-overlay');
  if (!overlay) return;
  overlay.classList.remove('is-open');
  delete overlay.dataset.cancelContext;
  delete overlay.dataset.pendingOrderId;
}

/**
 * 办理成功（service_processing）在「取消成功 → 我知道了」后转为已关闭展示
 * TODO: 替换为接口成功后刷新列表
 */
function applyServiceCancelledToClosed(orderId) {
  const order = ORDERS_DATA.find(o => o.id === orderId);
  if (!order || order.progressType !== 'service_processing') return;
  order.progressType = 'service_closed';
  order.progressValue = '已关闭';
  order.progressValueColor = 'muted';
  delete order.footerNote;
  delete order.actions;
  remountVisibleOrders();
}

function initModal() {
  const overlay = document.getElementById('modal-overlay');
  if (!overlay) return;

  /* 动态卡片：取消订单 / 取消服务 */
  document.getElementById('orders-list')?.addEventListener('click', e => {
    if (e.target.closest('[data-action="cancel-order"]')) {
      delete overlay.dataset.pendingOrderId;
      openCancelModal('order');
    } else if (e.target.closest('[data-action="cancel-service"]')) {
      const btn = e.target.closest('[data-action="cancel-service"]');
      overlay.dataset.pendingOrderId = btn?.dataset?.orderId || '';
      openCancelModal('service');
    }
  });

  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeCancelModal();
  });

  /* 「我再想想」关闭 */
  document.getElementById('modal-cancel-btn')?.addEventListener('click', () => {
    closeCancelModal();
  });

  /* 「确认取消」：服务类 → 关闭一阶弹窗并打开「取消成功」；订单类 → Toast */
  document.getElementById('modal-confirm-btn')?.addEventListener('click', () => {
    const ctx = overlay.dataset.cancelContext;
    const orderId = overlay.dataset.pendingOrderId || '';
    closeCancelModal();
    if (ctx === 'service' && orderId) {
      const okOv = document.getElementById('cancel-success-overlay');
      if (okOv) {
        okOv.dataset.pendingOrderId = orderId;
        okOv.classList.add('is-open');
      }
      /* TODO: call cancel repayment relief API */
    } else {
      showToast('订单已取消');
      /* TODO: call cancel order API, refresh list */
    }
  });
}

/* 取消成功弹窗 Figma 171:895 — 仅「我知道了」关闭并更新订单态 */
function initCancelSuccessModal() {
  const okOv = document.getElementById('cancel-success-overlay');
  if (!okOv) return;

  function submitSuccessClose() {
    const id = okOv.dataset.pendingOrderId;
    okOv.classList.remove('is-open');
    delete okOv.dataset.pendingOrderId;
    if (id) applyServiceCancelledToClosed(id);
  }

  document.getElementById('cancel-success-confirm')?.addEventListener('click', submitSuccessClose);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && okOv.classList.contains('is-open')) {
      submitSuccessClose();
    }
  });
}

/* ============================================================
   Confirm order
   ============================================================ */
function initConfirmAction() {
  document.getElementById('orders-list')?.addEventListener('click', e => {
    const btn = e.target.closest('[data-action="confirm-order"]');
    if (btn) {
      showToast('正在跳转确认页面…');
      /* TODO: navigate to confirm page, pass btn.dataset.orderId */
    }
  });
}

/* ============================================================
   "更多"下拉菜单（点击"更多"按钮展开/收起）
   纯代码实现，白色卡片 + 三角 + 菜单项
   ============================================================ */
function initMorePopup() {
  const trigger = document.getElementById('nav-more');
  const popup   = document.getElementById('more-popup');
  if (!trigger || !popup) return;

  function openPopup() {
    const rect      = trigger.getBoundingClientRect();
    const shellRect = document.querySelector('.app-shell').getBoundingClientRect();
    /* 定位：紧贴按钮下方，右对齐 */
    popup.style.top   = (rect.bottom - shellRect.top + 6) + 'px';
    popup.style.right = (shellRect.right - rect.right) + 'px';
    popup.style.left  = 'auto';

    popup.classList.add('is-open');
    popup.setAttribute('aria-hidden', 'false');
    trigger.setAttribute('aria-expanded', 'true');
  }

  function closePopup() {
    popup.classList.remove('is-open');
    popup.setAttribute('aria-hidden', 'true');
    trigger.setAttribute('aria-expanded', 'false');
  }

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    popup.classList.contains('is-open') ? closePopup() : openPopup();
  });

  trigger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      popup.classList.contains('is-open') ? closePopup() : openPopup();
    }
  });

  /* 点击菜单项 */
  popup.addEventListener('click', (e) => {
    const item = e.target.closest('[data-action]');
    if (!item) return;
    closePopup();
    if (item.dataset.action === 'lehuaka') {
      showToast('乐花卡订单');
      /* TODO: 跳转到乐花卡订单页 */
    }
  });

  /* 点击外部关闭 */
  document.addEventListener('click', (e) => {
    if (!popup.contains(e.target) && !trigger.contains(e.target)) {
      closePopup();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePopup();
  });
}

/* ============================================================
   Other actions
   ============================================================ */
function initOtherActions() {
  document.querySelector('[data-action="view-all"]')?.addEventListener('click', () => {
    showToast('查看全部结清订单');
    /* TODO: navigate or load settled orders */
  });

  document.querySelector('[data-action="back"]')?.addEventListener('click', () => {
    history.back();
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('[data-action="go-borrow"]')) return;
    e.preventDefault();
    document.dispatchEvent(new CustomEvent('app-switch-tab', { detail: { index: 0 } }));
  });
}

/* ============================================================
   Toast
   ============================================================ */
let _toastTimer = null;
function showToast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('is-visible');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => el.classList.remove('is-visible'), 2200);
}

/* ============================================================
   减压还款服务说明弹窗
   点击订单标题右侧问号图标触发
   TODO: 弹窗标题/正文内容可改为从接口获取后动态注入
   ============================================================ */
function initServiceInfoModal() {
  const overlay = document.getElementById('service-info-overlay');
  if (!overlay) return;

  /* 代理点击——订单列表是动态渲染的 */
  document.getElementById('orders-list')?.addEventListener('click', e => {
    const btn = e.target.closest('[data-action="open-service-info"]');
    if (btn) {
      overlay.classList.add('is-open');
    }
  });

  /* 点击蒙层关闭 */
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.remove('is-open');
  });

  /* "我知道了"按钮关闭 */
  document.getElementById('service-info-confirm')?.addEventListener('click', () => {
    overlay.classList.remove('is-open');
  });

  /* ESC 键关闭 */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
      overlay.classList.remove('is-open');
    }
  });
}

/* ============================================================
   Init
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  mountOrders();
  initTabView();
  initScrollSync();
  initOrdersInfiniteScroll();
  initPullToRefresh();
  initModal();
  initConfirmAction();
  initMorePopup();
  initOtherActions();
  initServiceInfoModal();
  initCancelSuccessModal();
});
