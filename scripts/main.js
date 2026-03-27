/* ============================================================
   Tab Switching
   ============================================================ */
document.querySelectorAll('.tab-item').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab-item').forEach(t => {
      t.classList.remove('tab-item--active');
      t.classList.add('tab-item--inactive');
      const indicator = t.querySelector('.tab-item__indicator');
      if (indicator) indicator.style.display = 'none';
    });
    tab.classList.remove('tab-item--inactive');
    tab.classList.add('tab-item--active');
    const indicator = tab.querySelector('.tab-item__indicator');
    if (indicator) indicator.style.display = 'block';
  });
});

/* ============================================================
   Countdown Timer
   ============================================================ */
function parseCountdown(el) {
  const text = el.textContent.trim();
  const match = text.match(/(\d+):(\d+):(\d+)/);
  if (!match) return null;
  return parseInt(match[1]) * 3600 + parseInt(match[2]) * 60 + parseInt(match[3]);
}

function formatCountdown(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

const countdownEls = document.querySelectorAll('.countdown-timer');
countdownEls.forEach(el => {
  let secs = parseCountdown(el);
  if (secs === null) return;
  const prefix = '剩余 ';
  const suffix = ' 待确认';
  const timer = setInterval(() => {
    secs--;
    if (secs <= 0) {
      clearInterval(timer);
      el.textContent = '已超时';
      return;
    }
    el.textContent = prefix + formatCountdown(secs) + suffix;
  }, 1000);
});

/* ============================================================
   Cancel Order Modal
   ============================================================ */
const modal = document.getElementById('cancel-modal');
const modalOverlay = document.getElementById('modal-overlay');

document.querySelectorAll('[data-action="cancel-order"]').forEach(btn => {
  btn.addEventListener('click', () => {
    modalOverlay.classList.add('is-open');
  });
});

document.getElementById('modal-cancel-btn')?.addEventListener('click', () => {
  modalOverlay.classList.remove('is-open');
});

document.getElementById('modal-confirm-btn')?.addEventListener('click', () => {
  modalOverlay.classList.remove('is-open');
  showToast('订单已取消');
});

modalOverlay?.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.classList.remove('is-open');
  }
});

/* ============================================================
   Confirm Order Action
   ============================================================ */
document.querySelectorAll('[data-action="confirm-order"]').forEach(btn => {
  btn.addEventListener('click', () => {
    showToast('正在跳转确认页面…');
  });
});

/* ============================================================
   View All Button
   ============================================================ */
document.querySelector('[data-action="view-all"]')?.addEventListener('click', () => {
  showToast('查看全部结清订单');
});

/* ============================================================
   Back button
   ============================================================ */
document.querySelector('[data-action="back"]')?.addEventListener('click', () => {
  showToast('返回上一页');
});

/* ============================================================
   Toast Helper
   ============================================================ */
let toastTimer = null;
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('is-visible');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2000);
}
