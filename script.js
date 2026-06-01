/* ========================================
   Samsung Libya — script.js
   ======================================== */

/* ── Shared: Navbar scroll effect ── */
function initNavScroll(navEl) {
  if (!navEl) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navEl.style.background = 'rgba(255,255,255,0.98)';
      navEl.style.boxShadow  = '0 2px 20px rgba(0,0,0,0.08)';
    } else {
      navEl.style.background = 'rgba(255,255,255,0.92)';
      navEl.style.boxShadow  = 'none';
    }
  });
}

function toggleMenu() {
  var m = document.getElementById('mobile-menu');
  var b = document.getElementById('nav-toggle');
  m.classList.toggle('active');
  b.textContent = m.classList.contains('active') ? '✕' : '☰';
}

function closeMenu() {
  var m = document.getElementById('mobile-menu');
  var b = document.getElementById('nav-toggle');
  if (m) m.classList.remove('active');
  if (b) b.textContent = '☰';
}

document.addEventListener('DOMContentLoaded', () => {

  /* ── Navbar scroll effect ── */
  const nav = document.querySelector('nav');
  initNavScroll(nav);

  /* ── Newsletter ── */
  const subscribeBtn = document.querySelector('.newsletter-box button');
  const emailInput   = document.querySelector('.newsletter-box input[type="email"]');
  if (subscribeBtn && emailInput) {
    subscribeBtn.addEventListener('click', () => {
      const email = emailInput.value.trim();
      if (!email || !email.includes('@')) {
        emailInput.style.borderColor = '#dc2626';
        emailInput.focus();
        return;
      }
      emailInput.style.borderColor = '#16a34a';
      subscribeBtn.textContent = '✓ تم الاشتراك!';
      subscribeBtn.disabled    = true;
      subscribeBtn.style.background = '#16a34a';
      emailInput.value = '';
      setTimeout(() => {
        subscribeBtn.textContent  = 'اشترك';
        subscribeBtn.disabled     = false;
        subscribeBtn.style.background = '';
        emailInput.style.borderColor  = '';
      }, 3000);
    });
  }

  /* ── زر "اشتر الآن" في الكاردز ── */
  document.querySelectorAll('.card-btn-buy').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const orig = btn.textContent;
      btn.textContent = '✓ تم!';
      btn.style.background = '#16a34a';
      setTimeout(() => {
        btn.textContent = orig;
        btn.style.background = '';
      }, 1800);
    });
  });

  /* ── زر "أضف إلى السلة" في الكاردز ── */
  document.querySelectorAll('.card-btn-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const orig = btn.textContent;
      btn.textContent = '✓ أُضيف!';
      btn.style.background = '#16a34a';
      btn.style.color = '#fff';
      btn.style.borderColor = '#16a34a';
      updateCartCount();
      setTimeout(() => {
        btn.textContent = orig;
        btn.style.background = '';
        btn.style.color = '';
        btn.style.borderColor = '';
      }, 1800);
    });
  });

  /* ── زر "أضف إلى السلة" في المنتج المميز ── */
  const featuredBtn = document.querySelector('.featured-cart-btn');
  if (featuredBtn) {
    featuredBtn.addEventListener('click', () => {
      featuredBtn.textContent = '✓ أُضيف إلى السلة';
      featuredBtn.style.background = '#16a34a';
      updateCartCount();
      setTimeout(() => {
        featuredBtn.textContent = 'أضف إلى السلة';
        featuredBtn.style.background = '';
      }, 2000);
    });
  }

});

/* ── فلترة المنتجات ── */
function filterProducts(cat, e) {
  document.querySelectorAll('.filter-tab').forEach(btn => btn.classList.remove('filter-tab-active'));
  if (e && e.target) e.target.classList.add('filter-tab-active');
  document.querySelectorAll('.product-card').forEach(card => {
    card.style.display = (cat === 'all' || card.dataset.cat === cat) ? '' : 'none';
  });
}

/* ── السلة ── */
let cartCount = 0;

function toggleCart() {
  let panel = document.getElementById('cart-panel');
  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'cart-panel';
    panel.style.cssText = [
      'position:fixed', 'top:64px', 'left:0', 'z-index:200',
      'background:#fff', 'border:1px solid #e8e8e8',
      'border-radius:0 0 16px 16px', 'padding:24px',
      'box-shadow:0 8px 32px rgba(0,0,0,0.1)',
      'min-width:260px', 'font-family:inherit', 'direction:rtl'
    ].join(';');
    panel.innerHTML = '<p style="color:#555;font-size:15px;margin:0">🛒 السلة فارغة حتى الآن.</p>';
    document.body.appendChild(panel);
  } else {
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
  }
}

function updateCartCount() {
  cartCount++;

  // عداد الديسكتوب
  const badge = document.getElementById('cart-count');
  if (badge) {
    badge.textContent = cartCount;
    badge.classList.add('bump');
    setTimeout(() => badge.classList.remove('bump'), 200);
  }

  // عداد الموبايل
  const badgeMob = document.getElementById('cart-count-mob');
  if (badgeMob) {
    badgeMob.textContent = cartCount;
    badgeMob.classList.add('bump');
    setTimeout(() => badgeMob.classList.remove('bump'), 200);
  }
}
