// ============================================================
// Shared HTML components — Navbar, Footer, Auth Modal
// ============================================================

function renderNavbar(activePage = '') {
  return `
<nav class="navbar">
  <div class="container">
    <div class="navbar__inner">
      <a href="${relativePath}index.html" class="navbar__logo">
        <span class="icon">📚</span>
        <div>
          کتابخانه آزاد افغانستان
          <span class="en">Free Library of Afghanistan</span>
        </div>
      </a>

      <form class="navbar__search" data-search-form>
        <input type="search" placeholder="جستجوی کتاب، نویسنده..." aria-label="جستجو" />
        <button type="submit" aria-label="جستجو">🔍</button>
      </form>

      <div class="navbar__links">
        <a href="${relativePath}index.html" class="${activePage==='home'?'active':''}">خانه</a>
        <a href="${relativePath}pages/books.html" class="${activePage==='books'?'active':''}">کتاب‌ها</a>
        <a href="${relativePath}pages/contribute.html" class="${activePage==='contribute'?'active':''}">مشارکت</a>
        <a href="${relativePath}pages/about.html" class="${activePage==='about'?'active':''}">درباره ما</a>
      </div>

      <div class="navbar__auth">
        <div data-auth-hide style="display:flex;gap:.4rem">
          <button class="btn btn-ghost btn-sm" style="color:#fff;border-color:rgba(255,255,255,.3)" onclick="UI.openModal('auth-modal')">ورود</button>
          <button class="btn btn-gold btn-sm" onclick="UI.openModal('auth-modal')">ثبت‌نام</button>
        </div>
        <div data-auth-show style="display:none;align-items:center;gap:.6rem">
          <span style="color:rgba(255,255,255,.75);font-size:.82rem" data-user-name></span>
          <button class="btn btn-ghost btn-sm" style="color:#fff;border-color:rgba(255,255,255,.3)" onclick="Auth.signOut()">خروج</button>
        </div>
      </div>
    </div>
  </div>
</nav>`;
}

function renderFooter() {
  return `
<footer class="footer">
  <div class="container">
    <div class="footer__grid">
      <div>
        <div class="footer__logo">📚 کتابخانه آزاد افغانستان</div>
        <p class="footer__desc">
          کتابخانه آزاد افغانستان یک پروژه داوطلبانه و غیرانتفاعی است که هدف آن فراهم‌کردن دسترسی رایگان به کتاب‌های دری برای تمام افغانان در سراسر جهان است.
        </p>
        <p style="margin-top:.75rem;font-size:.78rem">
          📧 <a href="mailto:seyaramiry.2468@gmail.com" style="color:rgba(255,255,255,.5)">seyaramiry.2468@gmail.com</a>
        </p>
      </div>
      <div>
        <div class="footer__heading">دسته‌بندی‌ها</div>
        <ul class="footer__links">
          <li><a href="${relativePath}pages/books.html?cat=school">📘 کتاب‌های مکتب</a></li>
          <li><a href="${relativePath}pages/books.html?cat=university">🎓 کتاب‌های پوهنتون</a></li>
          <li><a href="${relativePath}pages/books.html?cat=history">🏛️ تاریخ افغانستان</a></li>
          <li><a href="${relativePath}pages/books.html?cat=philosophy">🧠 فلسفه</a></li>
        </ul>
      </div>
      <div>
        <div class="footer__heading">پیوندها</div>
        <ul class="footer__links">
          <li><a href="${relativePath}pages/contribute.html">ارسال ترجمه</a></li>
          <li><a href="${relativePath}pages/about.html">درباره ما</a></li>
          <li><a href="https://archive.org" target="_blank" rel="noopener">Internet Archive ↗</a></li>
        </ul>
      </div>
      <div>
        <div class="footer__heading">منابع</div>
        <ul class="footer__links">
          <li><a href="https://archive.org/search?query=afghanistan+dari" target="_blank">آرشیو اینترنت</a></li>
          <li><a href="https://www.ketabton.com" target="_blank">کتابتون</a></li>
          <li><a href="https://moe.gov.af" target="_blank">وزارت معارف</a></li>
        </ul>
      </div>
    </div>
    <div class="footer__bottom">
      <span>© ۱۴۰۳ کتابخانه آزاد افغانستان — تمام کتاب‌ها از منابع آزاد</span>
      <span>ساخته شده با ❤️ برای افغانستان</span>
    </div>
  </div>
</footer>`;
}

function renderAuthModal() {
  return `
<div class="modal-overlay" id="auth-modal">
  <div class="modal" style="max-width:420px">
    <div class="modal__head">
      <span class="modal__title" id="auth-modal-title">ورود به حساب</span>
      <button class="modal__close" onclick="UI.closeModal('auth-modal')">✕</button>
    </div>
    <div class="modal__body">
      <div id="auth-tabs" style="display:flex;gap:.5rem;margin-bottom:1.5rem">
        <button class="btn btn-primary btn-sm" id="tab-login" onclick="switchAuthTab('login')">ورود</button>
        <button class="btn btn-ghost btn-sm" id="tab-signup" onclick="switchAuthTab('signup')">ثبت‌نام جدید</button>
      </div>

      <div id="auth-login-form">
        <div class="form-group">
          <label class="form-label">ایمیل</label>
          <input type="email" class="form-input" id="login-email" placeholder="example@gmail.com" dir="ltr" />
        </div>
        <div class="form-group">
          <label class="form-label">رمز عبور</label>
          <input type="password" class="form-input" id="login-pass" placeholder="••••••••" dir="ltr" />
        </div>
        <button class="btn btn-primary" style="width:100%" onclick="handleLogin()">ورود</button>
        <div class="divider"></div>
        <button class="btn btn-outline" style="width:100%" onclick="Auth.signInWithGoogle()">
          <svg width="18" height="18" viewBox="0 0 24 24" style="flex-shrink:0"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          ورود با Google
        </button>
      </div>

      <div id="auth-signup-form" style="display:none">
        <div class="form-group">
          <label class="form-label">نام کامل</label>
          <input type="text" class="form-input" id="signup-name" placeholder="نام و تخلص شما" />
        </div>
        <div class="form-group">
          <label class="form-label">ایمیل</label>
          <input type="email" class="form-input" id="signup-email" placeholder="example@gmail.com" dir="ltr" />
        </div>
        <div class="form-group">
          <label class="form-label">رمز عبور</label>
          <input type="password" class="form-input" id="signup-pass" placeholder="حداقل ۸ کاراکتر" dir="ltr" />
        </div>
        <button class="btn btn-primary" style="width:100%" onclick="handleSignup()">ثبت‌نام</button>
        <div class="divider"></div>
        <button class="btn btn-outline" style="width:100%" onclick="Auth.signInWithGoogle()">
          <svg width="18" height="18" viewBox="0 0 24 24" style="flex-shrink:0"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          ثبت‌نام با Google
        </button>
      </div>
    </div>
  </div>
</div>`;
}

function switchAuthTab(tab) {
  const loginForm = document.getElementById('auth-login-form');
  const signupForm = document.getElementById('auth-signup-form');
  const loginBtn = document.getElementById('tab-login');
  const signupBtn = document.getElementById('tab-signup');
  if (tab === 'login') {
    loginForm.style.display = 'block'; signupForm.style.display = 'none';
    loginBtn.className = 'btn btn-primary btn-sm'; signupBtn.className = 'btn btn-ghost btn-sm';
    document.getElementById('auth-modal-title').textContent = 'ورود به حساب';
  } else {
    loginForm.style.display = 'none'; signupForm.style.display = 'block';
    loginBtn.className = 'btn btn-ghost btn-sm'; signupBtn.className = 'btn btn-primary btn-sm';
    document.getElementById('auth-modal-title').textContent = 'ثبت‌نام جدید';
  }
}

async function handleLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pass  = document.getElementById('login-pass').value;
  if (!email || !pass) { UI.toast('لطفاً همه فیلدها را پر کنید', 'error'); return; }
  const { error } = await Auth.signInWithEmail(email, pass);
  if (error) { UI.toast('خطا: ' + error.message, 'error'); return; }
  UI.toast('خوش آمدید! ✅', 'success');
  UI.closeModal('auth-modal');
}

async function handleSignup() {
  const name  = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const pass  = document.getElementById('signup-pass').value;
  if (!name || !email || !pass) { UI.toast('لطفاً همه فیلدها را پر کنید', 'error'); return; }
  if (pass.length < 8) { UI.toast('رمز عبور باید حداقل ۸ کاراکتر باشد', 'error'); return; }
  const { error } = await Auth.signUpWithEmail(email, pass, name);
  if (error) { UI.toast('خطا: ' + error.message, 'error'); return; }
  UI.toast('ثبت‌نام موفق! لطفاً ایمیل خود را تأیید کنید ✅', 'success');
  UI.closeModal('auth-modal');
}
