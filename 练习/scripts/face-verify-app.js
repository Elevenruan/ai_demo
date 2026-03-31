/**
 * 刷脸独立页入口：路由回退、对接真实 SDK 的挂点
 */
import { registerFaceVerifyComponents } from './face-verify-components.js';

function showFvToast(el, message) {
  if (!el) return;
  el.textContent = message;
  el.classList.add('is-visible');
  clearTimeout(showFvToast._t);
  showFvToast._t = setTimeout(() => el.classList.remove('is-visible'), 2200);
}

function resolveBackNavigation() {
  const params = new URLSearchParams(window.location.search);
  /* 从「查看全部结清订单」进来：返回借钱订单列表 */
  if (params.get('next') === 'settled') {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    window.location.href = './index.html';
    return;
  }
  if (window.history.length > 1) {
    window.history.back();
    return;
  }
  window.location.href = './index.html';
}

function initFaceVerifyPage() {
  registerFaceVerifyComponents();

  const toast = document.getElementById('fv-toast');
  const nav = document.querySelector('fv-nav-bar');
  const actions = document.querySelector('fv-action-bar');

  nav?.addEventListener('fv-back', () => resolveBackNavigation());

  actions?.addEventListener('fv-start', () => {
    const params = new URLSearchParams(window.location.search);
    const goSettledAfterOk = params.get('next') === 'settled';

    void (async () => {
      const primary = actions?.querySelector('[data-fv-start]');
      if (primary) primary.disabled = true;

      showFvToast(toast, '正在唤起刷脸…');
      /* TODO: 替换为真实 SDK：await faceSDK.start(); 成功回调内再跳转 */
      try {
        await new Promise(resolve => {
          setTimeout(resolve, 900);
        });
      } catch {
        showFvToast(toast, '验证失败，请重试');
        if (primary) primary.disabled = false;
        return;
      }

      if (goSettledAfterOk) {
        showFvToast(toast, '验证成功');
        setTimeout(() => {
          window.location.href = './settled-orders.html';
        }, 450);
        return;
      }

      showFvToast(toast, '验证成功');
      if (primary) primary.disabled = false;
      if (window.history.length > 1) window.history.back();
      else window.location.href = './index.html';
    })();
  });

  actions?.addEventListener('fv-help', () => {
    showFvToast(toast, '可联系在线客服或拨打官方客服电话');
  });
}

document.addEventListener('DOMContentLoaded', initFaceVerifyPage);
