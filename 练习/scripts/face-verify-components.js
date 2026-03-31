/**
 * 刷脸页 Web Components（与 练习 工程栈一致：无构建、原生组件化）
 *
 * 设计目标：对齐 Figma「订单改版」刷脸页
 * https://www.figma.com/design/08VRbsz31JpfwwdW5ANvj8/订单改版?node-id=1325-7442
 * 若 MCP/导出不可用：结构为「订单主流程顶栏渐变 + 灰底 + 白卡片说明区 + 底栏主按钮」，
 * 文案与间距请打开上述节点对照修改。
 */

const FV_NS = 'https://www.w3.org/2000/svg';

function svgFaceIllustration() {
  /* 示意：浅蓝取景圆环 + 虚线扫描感 + 面部线稿 */
  return `
    <svg class="fv-face-panel__svg" viewBox="0 0 200 200" aria-hidden="true" xmlns="${FV_NS}">
      <defs>
        <linearGradient id="fvRingGrad" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stop-color="#4d83ff" stop-opacity="0.18"/>
          <stop offset="100%" stop-color="#4d83ff" stop-opacity="0.05"/>
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="90" fill="url(#fvRingGrad)"/>
      <circle cx="100" cy="100" r="76" fill="none" stroke="rgba(77,131,255,0.2)" stroke-width="1"/>
      <circle cx="100" cy="100" r="74" fill="none" stroke="#4d83ff" stroke-opacity="0.45" stroke-width="2" stroke-dasharray="5 12" stroke-linecap="round"/>
      <ellipse cx="100" cy="108" rx="34" ry="42" fill="none" stroke="#1E2533" stroke-width="1.25" opacity="0.2"/>
      <circle cx="89" cy="100" r="3.5" fill="#1E2533" opacity="0.18"/>
      <circle cx="111" cy="100" r="3.5" fill="#1E2533" opacity="0.18"/>
      <path d="M90 120 Q100 128 110 120" fill="none" stroke="#1E2533" stroke-width="1.25" stroke-linecap="round" opacity="0.18"/>
    </svg>`;
}

export class FvNavBar extends HTMLElement {
  static observedAttributes = ['title'];

  connectedCallback() {
    this.render();
    this.querySelector('[data-fv-back]')?.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('fv-back', { bubbles: true, composed: true }));
    });
  }

  attributeChangedCallback() {
    if (this.isConnected) this.render();
  }

  render() {
    const title = this.getAttribute('title') || '人脸识别';
    this.innerHTML = `
      <header class="fv-nav-bar">
        <button type="button" class="fv-nav-bar__back" data-fv-back aria-label="返回">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <h1 class="fv-nav-bar__title">${title}</h1>
        <span class="fv-nav-bar__spacer" aria-hidden="true"></span>
      </header>
    `;
  }
}

export class FvFacePanel extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <section class="fv-face-panel" aria-labelledby="fv-face-heading">
        <div class="fv-face-panel__card">
          <div class="fv-face-panel__art" role="img" aria-label="人脸识别示意">
            ${svgFaceIllustration()}
          </div>
          <h2 id="fv-face-heading" class="fv-face-panel__title">请完成人脸识别</h2>
          <p class="fv-face-panel__desc">为保障您的账户安全，需验证为本人操作。请正对手机、光线充足，并按提示完成识别。</p>
          <ul class="fv-tip-list" aria-label="拍摄提示">
            <li class="fv-tip-list__item">
              <span class="fv-tip-list__num" aria-hidden="true">1</span>
              <span class="fv-tip-list__text">面部完整出现在取景框内，勿仰拍或俯拍</span>
            </li>
            <li class="fv-tip-list__item">
              <span class="fv-tip-list__num" aria-hidden="true">2</span>
              <span class="fv-tip-list__text">避免强背光、侧光，勿戴口罩、墨镜等遮挡五官</span>
            </li>
            <li class="fv-tip-list__item">
              <span class="fv-tip-list__num" aria-hidden="true">3</span>
              <span class="fv-tip-list__text">眼镜反光严重时建议摘下，保持设备稳定</span>
            </li>
          </ul>
        </div>
      </section>
    `;
  }
}

export class FvActionBar extends HTMLElement {
  connectedCallback() {
    this.render();
    this.querySelector('[data-fv-start]')?.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('fv-start', { bubbles: true, composed: true }));
    });
    this.querySelector('[data-fv-help]')?.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('fv-help', { bubbles: true, composed: true }));
    });
  }

  render() {
    this.innerHTML = `
      <footer class="fv-action-bar">
        <button type="button" class="fv-action-bar__primary" data-fv-start>开始识别</button>
        <button type="button" class="fv-action-bar__link" data-fv-help>遇到问题</button>
      </footer>
    `;
  }
}

export function registerFaceVerifyComponents() {
  const defs = [
    ['fv-nav-bar', FvNavBar],
    ['fv-face-panel', FvFacePanel],
    ['fv-action-bar', FvActionBar],
  ];
  for (const [name, Ctor] of defs) {
    if (!customElements.get(name)) {
      customElements.define(name, Ctor);
    }
  }
}
