/* ============================================================
   State
   ============================================================ */
const chatArea      = document.getElementById('chatArea');
const fakeInput     = document.getElementById('fakeInput');
const fiText        = document.getElementById('fiText');
const fiPlaceholder = document.getElementById('fiPlaceholder');
const emojiBtn      = document.getElementById('emojiBtn');
const emojiPanel    = document.getElementById('emojiPanel');
const customKb      = document.getElementById('customKeyboard');
const countdownEl   = document.getElementById('countdownVal');
const imgPickerBtn  = document.getElementById('imgPickerBtn');
const imgFileInput  = document.getElementById('imgFileInput');

let inputValue = '';
let kbShift    = false;
let kbNumMode  = false;
let emojiOpen  = false;
let kbOpen     = false;

/* ============================================================
   Helpers
   ============================================================ */
function scrollToBottom() {
  chatArea.scrollTop = chatArea.scrollHeight;
}

function updateFakeInput() {
  if (inputValue === '') {
    fiText.innerHTML = '<span class="fi-placeholder">请输入您想咨询的问题...</span>';
  } else {
    fiText.textContent = inputValue;
  }
}

/* ============================================================
   Countdown (10 → 0, then hide)
   ============================================================ */
const countdownRow = countdownEl.closest('.msg-row--system');
let countdownSec = 10;
const countdownTimer = setInterval(() => {
  countdownSec--;
  if (countdownSec <= 0) {
    clearInterval(countdownTimer);
    // fade out then remove
    if (countdownRow) {
      countdownRow.style.transition = 'opacity 0.4s';
      countdownRow.style.opacity = '0';
      setTimeout(() => countdownRow.remove(), 420);
    }
  } else {
    countdownEl.textContent = countdownSec + 's';
  }
}, 1000);

/* ============================================================
   Auto Advisor Reply
   ============================================================ */
const advisorSVG = `<img src="./assets/images/avatar-advisor.png" alt="顾问" style="width:100%;height:100%;object-fit:cover;display:block;">`;
const userSVG    = `<img src="./assets/images/avatar-user.png"    alt="用户"  style="width:100%;height:100%;object-fit:cover;display:block;">`;

const autoReplies = [
  '好的，我来为您查询相关额度信息，请稍候～',
  '您的账户当前满足提额条件，可申请最高 ¥50,000 额度。',
  '提额申请已受理，审核结果将在 1-3 个工作日内通知您。',
  '请问您还有其他问题需要咨询吗？我很乐意继续为您服务。',
  '好的，已为您记录本次需求，如需进一步了解，欢迎随时提问！',
  '根据您的信用记录，建议您选择 12 期分期，还款压力更小哦～',
  '感谢您的耐心等待，您的申请正在加速处理中，请放心！',
];
let replyIndex = 0;

function getAdvisorReply(userText) {
  if (userText.includes('提额') || userText.includes('额度')) {
    return '好的，我来为您查询相关额度信息，请稍候～';
  }
  if (userText.includes('利率') || userText.includes('利息')) {
    return '您当前产品的年利率为 24%（单利），具体利息以实际借款计算为准。';
  }
  if (userText.includes('还款')) {
    return '支持每月等额还款和提前结清两种方式，提前还清可节省剩余利息。';
  }
  if (userText.includes('审核') || userText.includes('进度')) {
    return '您的申请正在审核中，预计 24 小时内完成，结果将以短信形式通知您。';
  }
  const reply = autoReplies[replyIndex % autoReplies.length];
  replyIndex++;
  return reply;
}

function appendMessage(text, isUser) {
  const row = document.createElement('div');
  row.className = 'msg-row ' + (isUser ? 'msg-row--user' : 'msg-row--advisor');

  const avatar = document.createElement('div');
  avatar.className = 'msg-avatar ' + (isUser ? 'msg-avatar--user' : 'msg-avatar--advisor');
  avatar.innerHTML = isUser ? userSVG : advisorSVG;

  const content = document.createElement('div');
  content.className = 'msg-content';

  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble ' + (isUser ? 'msg-bubble--user' : 'msg-bubble--advisor');
  bubble.textContent = text;

  content.appendChild(bubble);
  row.appendChild(avatar);
  row.appendChild(content);
  chatArea.appendChild(row);
  scrollToBottom();
  return row;
}

function showTypingThenReply(userText) {
  const typingRow = document.createElement('div');
  typingRow.className = 'msg-row msg-row--advisor';

  const avatar = document.createElement('div');
  avatar.className = 'msg-avatar msg-avatar--advisor';
  avatar.innerHTML = advisorSVG;

  const content = document.createElement('div');
  content.className = 'msg-content';

  const typing = document.createElement('div');
  typing.className = 'typing-bubble';
  typing.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';

  content.appendChild(typing);
  typingRow.appendChild(avatar);
  typingRow.appendChild(content);
  chatArea.appendChild(typingRow);
  scrollToBottom();

  setTimeout(() => {
    chatArea.removeChild(typingRow);
    appendMessage(getAdvisorReply(userText), false);
  }, 1000 + Math.random() * 600);
}

function sendMessage() {
  const text = inputValue.trim();
  if (!text) return;
  appendMessage(text, true);
  inputValue = '';
  updateFakeInput();
  showTypingThenReply(text);
}

/* ---- Image send ---- */
imgPickerBtn.addEventListener('click', () => {
  closeAll();
  imgFileInput.click();
});

imgFileInput.addEventListener('change', () => {
  const file = imgFileInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    appendImageMessage(e.target.result, true);
    showTypingThenReply('[图片]');
  };
  reader.readAsDataURL(file);
  imgFileInput.value = '';
});

function appendImageMessage(src, isUser) {
  const row = document.createElement('div');
  row.className = 'msg-row ' + (isUser ? 'msg-row--user' : 'msg-row--advisor');

  const avatar = document.createElement('div');
  avatar.className = 'msg-avatar ' + (isUser ? 'msg-avatar--user' : 'msg-avatar--advisor');
  avatar.innerHTML = isUser ? userSVG : advisorSVG;

  const content = document.createElement('div');
  content.className = 'msg-content';

  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble msg-bubble--image';

  const img = document.createElement('img');
  img.src = src;
  img.alt = '图片';
  bubble.appendChild(img);
  content.appendChild(bubble);
  row.appendChild(avatar);
  row.appendChild(content);
  chatArea.appendChild(row);
  scrollToBottom();
}

/* ============================================================
   Panel state management
   ============================================================ */
function closeAll() {
  emojiOpen = false;
  kbOpen    = false;
  emojiPanel.classList.remove('open');
  customKb.classList.remove('open');
  fakeInput.classList.remove('focused');
}

function openKeyboard() {
  emojiOpen = false;
  kbOpen    = true;
  emojiPanel.classList.remove('open');
  customKb.classList.add('open');
  fakeInput.classList.add('focused');
  scrollToBottom();
}

function openEmoji() {
  kbOpen    = false;
  emojiOpen = true;
  customKb.classList.remove('open');
  emojiPanel.classList.add('open');
  fakeInput.classList.remove('focused');
  scrollToBottom();
}

/* ============================================================
   Emoji Panel
   ============================================================ */
const EMOJIS = [
  '😀','😂','🥰','😍','🤩','😎','🥺','😭',
  '😤','🤔','🙄','😏','😴','🤗','🥳','😇',
  '👍','👏','🙏','💪','🤝','✌️','👋','❤️',
  '🔥','⭐','🎉','🎁','💰','💡','📱','🏆',
  '🐶','🐱','🐼','🌸','🌈','🍎','☕','🚀',
];

(function buildEmojiGrid() {
  const grid = document.getElementById('emojiGrid');
  EMOJIS.forEach(em => {
    const btn = document.createElement('button');
    btn.className = 'emoji-item';
    btn.textContent = em;
    btn.addEventListener('click', () => {
      inputValue += em;
      updateFakeInput();
    });
    grid.appendChild(btn);
  });
  const del = document.createElement('button');
  del.className = 'emoji-delete';
  del.innerHTML = '⌫';
  del.addEventListener('click', () => {
    inputValue = [...inputValue].slice(0, -1).join('');
    updateFakeInput();
  });
  grid.appendChild(del);
})();

emojiBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  if (emojiOpen) {
    closeAll();
  } else {
    openEmoji();
  }
});

/* ============================================================
   Custom 24-key Keyboard
   ============================================================ */
const KB_LETTERS = [
  ['q','w','e','r','t','y','u','i','o','p'],
  ['a','s','d','f','g','h','j','k','l'],
  ['SHIFT','z','x','c','v','b','n','m','⌫'],
  ['123','space','发送'],
];
const KB_NUMBERS = [
  ['1','2','3','4','5','6','7','8','9','0'],
  ['-','/','：','；','（','）','¥','@','"','。'],
  ['ABC','…','、','？','！','.','，','⌫'],
  ['#+=','space','发送'],
];

function buildKeyboard(layout) {
  customKb.innerHTML = '';
  layout.forEach((rowKeys) => {
    const row = document.createElement('div');
    row.className = 'kb-row';

    rowKeys.forEach(k => {
      const btn = document.createElement('button');
      btn.className = 'kb-key';

      if (k === 'SHIFT' || k === 'ABC') {
        btn.className += ' kb-key--func';
        btn.innerHTML = k === 'SHIFT'
          ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 4L3 13h6v7h6v-7h6L12 4z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`
          : 'ABC';
        btn.addEventListener('click', () => {
          if (k === 'SHIFT') {
            kbShift = !kbShift;
            buildKeyboard(kbNumMode ? KB_NUMBERS : KB_LETTERS);
          } else {
            kbNumMode = false;
            buildKeyboard(KB_LETTERS);
          }
        });
      } else if (k === '⌫') {
        btn.className += ' kb-key--func';
        btn.textContent = '⌫';
        btn.addEventListener('click', () => {
          inputValue = [...inputValue].slice(0, -1).join('');
          updateFakeInput();
        });
        let deleteTimer;
        btn.addEventListener('mousedown', () => {
          deleteTimer = setInterval(() => {
            inputValue = [...inputValue].slice(0, -1).join('');
            updateFakeInput();
          }, 100);
        });
        btn.addEventListener('mouseup', () => clearInterval(deleteTimer));
        btn.addEventListener('mouseleave', () => clearInterval(deleteTimer));
        btn.addEventListener('touchend', () => clearInterval(deleteTimer));
      } else if (k === 'space') {
        btn.className += ' kb-key--space';
        btn.textContent = '空格';
        btn.addEventListener('click', () => {
          inputValue += ' ';
          updateFakeInput();
        });
      } else if (k === '发送') {
        btn.className += ' kb-key--send';
        btn.textContent = '发送';
        btn.addEventListener('click', sendMessage);
      } else if (k === '123' || k === '#+=') {
        btn.className += ' kb-key--num';
        btn.textContent = k;
        btn.addEventListener('click', () => {
          kbNumMode = !kbNumMode;
          buildKeyboard(kbNumMode ? KB_NUMBERS : KB_LETTERS);
        });
      } else {
        const char = (kbShift && !kbNumMode) ? k.toUpperCase() : k;
        btn.textContent = char;
        btn.addEventListener('click', () => {
          const c = (kbShift && !kbNumMode) ? k.toUpperCase() : k;
          inputValue += c;
          updateFakeInput();
          if (kbShift) {
            kbShift = false;
            buildKeyboard(KB_LETTERS);
          }
        });
      }
      row.appendChild(btn);
    });
    customKb.appendChild(row);
  });
}

buildKeyboard(KB_LETTERS);

/* ============================================================
   Input focus: open keyboard
   ============================================================ */
fakeInput.addEventListener('click', (e) => {
  e.stopPropagation();
  if (kbOpen) return;
  openKeyboard();
});

/* Tap outside: close all panels */
document.addEventListener('click', (e) => {
  if (
    !fakeInput.contains(e.target) &&
    !customKb.contains(e.target) &&
    !emojiBtn.contains(e.target) &&
    !emojiPanel.contains(e.target) &&
    !imgPickerBtn.contains(e.target)
  ) {
    closeAll();
  }
});

/* ============================================================
   Bill Detail Modal
   ============================================================ */
const billModal      = document.getElementById('billModal');
const billModalClose = document.getElementById('billModalClose');
const billPayBtn     = document.getElementById('billPayBtn');

function openBillModal() {
  closeAll();
  billModal.classList.add('open');
}
function closeBillModal() {
  billModal.classList.remove('open');
}

document.getElementById('openBillModal').addEventListener('click', openBillModal);

// Also handle dynamically-injected locked cards
chatArea.addEventListener('click', (e) => {
  if (e.target.closest('.loan-card__header--modal-trigger')) openBillModal();
});
billModalClose.addEventListener('click', closeBillModal);
billModal.addEventListener('click', (e) => {
  if (e.target === billModal) closeBillModal();
});

// Expand / collapse bill item detail rows
billModal.addEventListener('click', (e) => {
  const item = e.target.closest('.bill-item');
  if (!item) return;
  const detailId = item.dataset.detail;
  if (!detailId) return;
  const detail = document.getElementById(detailId);
  if (!detail) return;
  // Rotate chevron indicator
  const chevron = item.querySelector('.bill-item__chevron');
  const isOpen = detail.classList.toggle('open');
  if (chevron) chevron.textContent = isOpen ? '⌄' : '›';
});

billPayBtn.addEventListener('click', () => {
  closeBillModal();
  appendMessage('好的，已为您发起还款流程，请在弹出的支付页面完成操作。', false);
});

/* ============================================================
   ① Repayment sheet
   ============================================================ */
const repaymentSheet      = document.getElementById('repaymentSheet');
const repaymentSheetClose = document.getElementById('repaymentSheetClose');

function openRepaymentSheet() {
  closeAll();
  repaymentSheet.classList.add('open');
}
function closeRepaymentSheet() {
  repaymentSheet.classList.remove('open');
}

document.getElementById('rowRepayment').addEventListener('click', openRepaymentSheet);
repaymentSheetClose.addEventListener('click', closeRepaymentSheet);
repaymentSheet.addEventListener('click', (e) => {
  if (e.target === repaymentSheet) closeRepaymentSheet();
});

/* ============================================================
   ② Bank card picker sheet
   ============================================================ */
const bankSheet      = document.getElementById('bankSheet');
const bankSheetClose = document.getElementById('bankSheetClose');
const bankCardList   = document.getElementById('bankCardList');
const bankConfirmBtn = document.getElementById('bankConfirmBtn');
const selectedBankLabel = document.getElementById('selectedBankLabel');

let pendingBankLabel = selectedBankLabel.textContent;

function openBankSheet() {
  closeAll();
  bankSheet.classList.add('open');
}
function closeBankSheet() {
  bankSheet.classList.remove('open');
}

document.getElementById('rowBank').addEventListener('click', openBankSheet);
bankSheetClose.addEventListener('click', closeBankSheet);
bankSheet.addEventListener('click', (e) => {
  if (e.target === bankSheet) closeBankSheet();
});

bankCardList.addEventListener('click', (e) => {
  const item = e.target.closest('.bank-card-item');
  if (!item) return;
  bankCardList.querySelectorAll('.bank-card-item').forEach(el => el.classList.remove('selected'));
  item.classList.add('selected');
  pendingBankLabel = item.dataset.label;
});

document.getElementById('addBankCard').addEventListener('click', () => {
  closeBankSheet();
  appendMessage('好的，请您前往银行卡管理页面添加新银行卡。', false);
});

bankConfirmBtn.addEventListener('click', () => {
  selectedBankLabel.textContent = pendingBankLabel;
  closeBankSheet();
});

/* ============================================================
   ③ Confirm loan → advisor replies with locked card
   ============================================================ */
const confirmLoanBtn = document.getElementById('confirmLoanBtn');


confirmLoanBtn.addEventListener('click', () => {
  // Lock the button in-place — change label to 已确认, grey it out
  confirmLoanBtn.textContent = '已确认';
  confirmLoanBtn.classList.add('loan-card__btn--disabled');
  confirmLoanBtn.disabled = true;
  scrollToBottom();
});

/* ============================================================
   Init
   ============================================================ */
scrollToBottom();
