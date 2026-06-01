/* =========================================
   STORAGE
========================================= */

const STORAGE_KEY = 'samsung_libya_messages';

let editingId = null;

/* =========================================
   HELPERS
========================================= */

function getMessages() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveMessages(msgs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs));
}

function formatDate(iso) {
  const d = new Date(iso);

  return (
    d.toLocaleDateString('ar-LY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }) +
    ' — ' +
    d.toLocaleTimeString('ar-LY', {
      hour: '2-digit',
      minute: '2-digit'
    })
  );
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function resetForm() {

  ['name', 'email', 'phone', 'subject', 'message']
    .forEach(id => {
      document.getElementById(id).value = '';
    });

  editingId = null;

  const btn = document.getElementById('submit-btn');

  btn.textContent = 'إرسال الرسالة ✉️';
  btn.style.background = '';
  btn.disabled = false;

  document.getElementById('success-msg').style.display = 'none';
}

/* =========================================
   RENDER
========================================= */

function renderMessages() {

  const msgs = getMessages();

  const list = document.getElementById('messages-list');
  const noMsg = document.getElementById('no-messages');
  const count = document.getElementById('msg-count');
  const section = document.getElementById('messages-section');

  count.textContent = msgs.length
    ? `(${msgs.length})`
    : '';

  section.style.display = msgs.length
    ? 'block'
    : 'none';

  if (!msgs.length) {
    list.innerHTML = '';
    noMsg.style.display = 'block';
    return;
  }

  noMsg.style.display = 'none';

  list.innerHTML = msgs.map(m => `
    <div class="msg-card" id="card-${m.id}">
      <div class="msg-card-header">

        <div class="msg-meta">
          <span class="msg-name">
            👤 ${escHtml(m.name)}
          </span>

          <span class="msg-subject tag-subject">
            ${escHtml(m.subject || 'بدون موضوع')}
          </span>
        </div>

        <div class="msg-actions">
          <button
            class="msg-btn edit-btn"
            onclick="editMessage('${m.id}')"
          >
            ✏️ تعديل
          </button>

          <button
            class="msg-btn delete-btn"
            onclick="deleteMessage('${m.id}')"
          >
            🗑 حذف
          </button>
        </div>

      </div>

      <div class="msg-card-body">

        <p class="msg-line">
          📧 ${escHtml(m.email)}
          ${m.phone ? ' | 📞 ' + escHtml(m.phone) : ''}
        </p>

        <p class="msg-text">
          ${escHtml(m.message)}
        </p>

      </div>

      <div class="msg-card-footer">
        <span class="msg-date">
          🕐 ${formatDate(m.date)}
        </span>
      </div>

    </div>
  `).join('');
}

/* =========================================
   SEND MESSAGE
========================================= */

function sendMessage() {

  const name =
    document.getElementById('name').value.trim();

  const email =
    document.getElementById('email').value.trim();

  const phone =
    document.getElementById('phone').value.trim();

  const subject =
    document.getElementById('subject').value.trim();

  const message =
    document.getElementById('message').value.trim();

  if (!name || !email || !message) {
    showFeedback(
      'يرجى تعبئة الاسم والإيميل والرسالة على الأقل',
      'error'
    );
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showFeedback(
      'البريد الإلكتروني غير صحيح',
      'error'
    );
    return;
  }

  const btn = document.getElementById('submit-btn');

  btn.textContent = 'جاري الحفظ...';
  btn.disabled = true;

  setTimeout(() => {

    const msgs = getMessages();

    if (editingId) {

      const idx =
        msgs.findIndex(m => m.id === editingId);

      if (idx !== -1) {
        msgs[idx] = {
          ...msgs[idx],
          name,
          email,
          phone,
          subject,
          message,
          editedAt: new Date().toISOString()
        };
      }

      saveMessages(msgs);

      showFeedback(
        '✅ تم تحديث الرسالة بنجاح!',
        'success'
      );

    } else {

      const newMsg = {
        id: 'msg_' + Date.now(),
        name,
        email,
        phone,
        subject,
        message,
        date: new Date().toISOString()
      };

      msgs.unshift(newMsg);

      saveMessages(msgs);

      showFeedback(
        '✅ تم حفظ رسالتك بنجاح!',
        'success'
      );
    }

    resetForm();
    renderMessages();

  }, 800);
}

/* =========================================
   EDIT
========================================= */

function editMessage(id) {

  const msgs = getMessages();

  const m = msgs.find(msg => msg.id === id);

  if (!m) return;

  editingId = id;

  document.getElementById('name').value = m.name;
  document.getElementById('email').value = m.email;
  document.getElementById('phone').value = m.phone || '';
  document.getElementById('subject').value = m.subject || '';
  document.getElementById('message').value = m.message;

  const btn = document.getElementById('submit-btn');

  btn.textContent = '💾 حفظ التعديلات';
  btn.style.background = '#0f7b3e';

  document
    .querySelector('.contact-form-wrap')
    .scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
}

/* =========================================
   DELETE
========================================= */

function deleteMessage(id) {

  if (!confirm('هل تريد حذف هذه الرسالة؟'))
    return;

  if (editingId === id)
    resetForm();

  const msgs =
    getMessages().filter(m => m.id !== id);

  saveMessages(msgs);

  renderMessages();
}

/* =========================================
   CLEAR ALL
========================================= */

function clearAllMessages() {

  const msgs = getMessages();

  if (!msgs.length) return;

  if (
    !confirm(
      `هل تريد حذف جميع الرسائل (${msgs.length})؟`
    )
  ) return;

  localStorage.removeItem(STORAGE_KEY);

  resetForm();

  renderMessages();
}

/* =========================================
   FEEDBACK
========================================= */

function showFeedback(text, type) {

  const el =
    document.getElementById('success-msg');

  el.textContent = text;

  el.className =
    'success-msg ' +
    (type === 'error' ? 'error-msg' : '');

  el.style.display = 'block';

  if (type !== 'error') {
    setTimeout(() => {
      el.style.display = 'none';
    }, 4000);
  }
}

/* =========================================
   INIT
========================================= */

document.addEventListener('DOMContentLoaded', () => {
  renderMessages();
  initNavScroll(document.querySelector('nav'));
});

/* =========================================
   NAVBAR EFFECT
========================================= */

/* نفس دالة initNavScroll الموجودة في script.js — مشتركة بين الصفحتين */
function initNavScroll(navEl) {
  if (!navEl) return;
  window.addEventListener('scroll', () => {
    navEl.style.background =
      window.scrollY > 60
        ? 'rgba(255,255,255,0.98)'
        : 'rgba(255,255,255,0.92)';
    navEl.style.boxShadow =
      window.scrollY > 60
        ? '0 2px 20px rgba(0,0,0,0.08)'
        : 'none';
  });
}

/* =========================================
   MOBILE MENU
   (نفس آلية index.html — toggleMenu / closeMenu)
========================================= */

function toggleMenu() {
  const drawer    = document.getElementById('nav-drawer');
  const hamburger = document.getElementById('nav-hamburger');
  const overlay   = document.getElementById('nav-overlay');

  if (drawer.classList.contains('active')) {
    closeMenu();
  } else {
    drawer.classList.add('active');
    if (hamburger) hamburger.classList.add('open');
    if (overlay)   overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }
}

function closeMenu() {
  const drawer    = document.getElementById('nav-drawer');
  const hamburger = document.getElementById('nav-hamburger');
  const overlay   = document.getElementById('nav-overlay');

  if (drawer)    drawer.classList.remove('active');
  if (hamburger) hamburger.classList.remove('open');
  if (overlay)   overlay.style.display = 'none';
  document.body.style.overflow = '';
}