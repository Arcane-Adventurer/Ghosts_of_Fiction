// ============================================================
// کتابخانه آزاد افغانستان — Core JS
// ============================================================

// ── Config ───────────────────────────────────────────────────
// Replace these two lines with your real Supabase values when ready
const SUPABASE_URL     = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
const ADMIN_EMAIL      = 'seyaramiry.2468@gmail.com';

// True only after you paste in real credentials
const SUPABASE_CONFIGURED =
  SUPABASE_URL     !== 'YOUR_SUPABASE_URL' &&
  SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY';

let supabase = null;

// Load Supabase CDN on-demand — only if credentials are set
async function initSupabase() {
  if (!SUPABASE_CONFIGURED) return null;
  if (supabase) return supabase;
  if (!window._supabaseReady) {
    await new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js';
      s.onload  = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
    window._supabaseReady = true;
  }
  try {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch(e) {
    supabase = null;
  }
  return supabase;
}

// ── Categories ───────────────────────────────────────────────
const CATEGORIES = {
  school: {
    label: 'کتاب‌های مکتب', icon: '📘', color: '#E8F5E9', textColor: '#2E7D32',
    badgeClass: 'badge-school',
    subcats: [
      { key: 'primary', label: 'ابتدایی (صنف ۱–۶)' },
      { key: 'middle',  label: 'متوسطه (صنف ۷–۹)' },
      { key: 'high',    label: 'لیسه (صنف ۱۰–۱۲)' }
    ]
  },
  university: {
    label: 'کتاب‌های پوهنتون', icon: '🎓', color: '#E3F2FD', textColor: '#1565C0',
    badgeClass: 'badge-uni',
    subcats: [
      { key: 'literature', label: 'ادبیات و زبان' },
      { key: 'science',    label: 'علوم طبیعی' },
      { key: 'law',        label: 'حقوق' },
      { key: 'economics',  label: 'اقتصاد' },
      { key: 'social',     label: 'علوم اجتماعی' }
    ]
  },
  history: {
    label: 'تاریخ افغانستان', icon: '🏛️', color: '#FFF3E0', textColor: '#E65100',
    badgeClass: 'badge-history',
    subcats: [
      { key: 'ancient',      label: 'تاریخ باستان' },
      { key: 'medieval',     label: 'دوره اسلامی' },
      { key: 'modern',       label: 'تاریخ معاصر' },
      { key: 'contemporary', label: 'تاریخ نزدیک' },
      { key: 'general',      label: 'عمومی' }
    ]
  },
  philosophy: {
    label: 'فلسفه', icon: '🧠', color: '#F3E5F5', textColor: '#6A1B9A',
    badgeClass: 'badge-philosophy',
    subcats: [
      { key: 'islamic', label: 'فلسفه اسلامی' },
      { key: 'western', label: 'فلسفه غرب' },
      { key: 'ethics',  label: 'اخلاق' },
      { key: 'logic',   label: 'منطق' }
    ]
  }
};

// ── Fallback book data (always available, no network needed) ─
const FALLBACK_BOOKS = [
  { id:'1',  title_dari:'دری صنف اول',       title_en:'Dari Grade 1',  author:'وزارت معارف', category:'school', subcategory:'primary', grade:1,  pages:85,  year:'1382', cover_emoji:'📗', cover_color:'#E8F5E9', archive_url:'https://archive.org/details/azu_acku_pk6874_daal49_1382_v2a', gdrive_embed:'https://archive.org/embed/azu_acku_pk6874_daal49_1382_v2a', is_featured:false },
  { id:'2',  title_dari:'دری صنف دوم',        title_en:'Dari Grade 2',  author:'وزارت معارف', category:'school', subcategory:'primary', grade:2,  pages:101, year:'1382', cover_emoji:'📗', cover_color:'#E8F5E9', archive_url:'https://archive.org/details/azu_acku_pk6874_daal49_1382_v2a', gdrive_embed:'https://archive.org/embed/azu_acku_pk6874_daal49_1382_v2a', is_featured:false },
  { id:'3',  title_dari:'دری صنف سوم',        title_en:'Dari Grade 3',  author:'وزارت معارف', category:'school', subcategory:'primary', grade:3,  pages:116, year:'1382', cover_emoji:'📗', cover_color:'#E8F5E9', archive_url:'https://archive.org/details/azu_acku_pk6874_daal49_1382_v2a', gdrive_embed:'https://archive.org/embed/azu_acku_pk6874_daal49_1382_v2a', is_featured:false },
  { id:'4',  title_dari:'دری صنف چهارم',      title_en:'Dari Grade 4',  author:'وزارت معارف', category:'school', subcategory:'primary', grade:4,  pages:122, year:'1382', cover_emoji:'📗', cover_color:'#E8F5E9', archive_url:'https://archive.org/details/04-dari', gdrive_embed:'https://archive.org/embed/04-dari', is_featured:false },
  { id:'5',  title_dari:'دری صنف پنجم',       title_en:'Dari Grade 5',  author:'وزارت معارف', category:'school', subcategory:'primary', grade:5,  pages:117, year:'1382', cover_emoji:'📗', cover_color:'#E8F5E9', archive_url:'https://archive.org/details/05-dari', gdrive_embed:'https://archive.org/embed/05-dari', is_featured:false },
  { id:'6',  title_dari:'دری صنف ششم',        title_en:'Dari Grade 6',  author:'وزارت معارف', category:'school', subcategory:'primary', grade:6,  pages:109, year:'1382', cover_emoji:'📗', cover_color:'#E8F5E9', archive_url:'https://archive.org/details/azu_acku_pk6874_daal49_1382_v2a', gdrive_embed:'https://archive.org/embed/azu_acku_pk6874_daal49_1382_v2a', is_featured:false },
  { id:'7',  title_dari:'دری صنف هفتم',       title_en:'Dari Grade 7',  author:'وزارت معارف', category:'school', subcategory:'middle',  grade:7,  pages:160, year:'1385', cover_emoji:'📘', cover_color:'#E3F2FD', archive_url:'https://archive.org/details/07-dari', gdrive_embed:'https://archive.org/embed/07-dari', is_featured:false },
  { id:'8',  title_dari:'دری صنف هشتم',       title_en:'Dari Grade 8',  author:'وزارت معارف', category:'school', subcategory:'middle',  grade:8,  pages:204, year:'1385', cover_emoji:'📘', cover_color:'#E3F2FD', archive_url:'https://archive.org/details/08-dari', gdrive_embed:'https://archive.org/embed/08-dari', is_featured:false },
  { id:'9',  title_dari:'دری صنف نهم',        title_en:'Dari Grade 9',  author:'وزارت معارف', category:'school', subcategory:'middle',  grade:9,  pages:176, year:'1385', cover_emoji:'📘', cover_color:'#E3F2FD', archive_url:'https://archive.org/details/09-dari', gdrive_embed:'https://archive.org/embed/09-dari', is_featured:false },
  { id:'10', title_dari:'دری صنف دهم',        title_en:'Dari Grade 10', author:'وزارت معارف', category:'school', subcategory:'high',    grade:10, pages:169, year:'1387', cover_emoji:'📙', cover_color:'#FFF3E0', archive_url:'https://archive.org/details/10-dari', gdrive_embed:'https://archive.org/embed/10-dari', is_featured:false },
  { id:'11', title_dari:'دری صنف یازدهم',     title_en:'Dari Grade 11', author:'وزارت معارف', category:'school', subcategory:'high',    grade:11, pages:161, year:'1387', cover_emoji:'📙', cover_color:'#FFF3E0', archive_url:'https://archive.org/details/11-dari', gdrive_embed:'https://archive.org/embed/11-dari', is_featured:false },
  { id:'12', title_dari:'دری صنف دوازدهم',    title_en:'Dari Grade 12', author:'وزارت معارف', category:'school', subcategory:'high',    grade:12, pages:153, year:'1387', cover_emoji:'📙', cover_color:'#FFF3E0', archive_url:'https://archive.org/details/12-dari', gdrive_embed:'https://archive.org/embed/12-dari', is_featured:false },
  { id:'13', title_dari:'افغانستان در مسیر تاریخ — جلد اول', title_en:'Afghanistan in the Course of History Vol.1', author:'میر غلام محمد غبار', category:'history', subcategory:'modern', pages:600, year:'1967', cover_emoji:'🏛️', cover_color:'#FFF3E0', archive_url:'https://archive.org/details/Afghanistan_dar_maseer_tarikh_Vol_1_Ghulam_M_Ghubar', gdrive_embed:'https://archive.org/embed/Afghanistan_dar_maseer_tarikh_Vol_1_Ghulam_M_Ghubar', is_featured:true },
  { id:'14', title_dari:'افغانستان در مسیر تاریخ — جلد دوم', title_en:'Afghanistan in the Course of History Vol.2', author:'میر غلام محمد غبار', category:'history', subcategory:'modern', pages:580, year:'1999', cover_emoji:'🏛️', cover_color:'#FFF3E0', archive_url:'https://archive.org/details/Afghanistan_in_the_course_of_history_Ghubar_Vol2', gdrive_embed:'https://archive.org/embed/Afghanistan_in_the_course_of_history_Ghubar_Vol2', is_featured:true },
  { id:'15', title_dari:'تاریخ مختصر پنج دهه افغانستان',     title_en:'Brief History of Five Decades', author:'انتشارات محسن', category:'history', subcategory:'contemporary', pages:180, year:'2016', cover_emoji:'📜', cover_color:'#FFF3E0', archive_url:'https://archive.org/details/history-of-afghanistan-past-5-decades-revised-may-2016', gdrive_embed:'https://archive.org/embed/history-of-afghanistan-past-5-decades-revised-may-2016', is_featured:false },
  { id:'16', title_dari:'تاریخ افغانستان — جلد اول',          title_en:'History of Afghanistan Vol.1', author:'مولانا محمد اسماعیل ریحان', category:'history', subcategory:'general', pages:300, year:'2022', cover_emoji:'📜', cover_color:'#FFF3E0', archive_url:'https://archive.org/details/1_20220915_20220915_1335', gdrive_embed:'https://archive.org/embed/1_20220915_20220915_1335', is_featured:false },
  { id:'17', title_dari:'تاریخ افغانستان — جلد دوم',          title_en:'History of Afghanistan Vol.2', author:'مولانا محمد اسماعیل ریحان', category:'history', subcategory:'general', pages:320, year:'2022', cover_emoji:'📜', cover_color:'#FFF3E0', archive_url:'https://archive.org/details/2_20220915_20220915_1335', gdrive_embed:'https://archive.org/embed/2_20220915_20220915_1335', is_featured:false },
  { id:'18', title_dari:'داستان فلسفه',                        title_en:'The Story of Philosophy', author:'برایان مگی', translator:'ترجمه دری', category:'philosophy', subcategory:'western', pages:400, year:'2017', cover_emoji:'🧠', cover_color:'#F3E5F5', archive_url:'https://archive.org/details/abu-abdurahman-kurdi-f_barid_20171224_2324', gdrive_embed:'https://archive.org/embed/abu-abdurahman-kurdi-f_barid_20171224_2324', is_featured:true },
  { id:'19', title_dari:'تاریخ فلسفه و تصوف',                  title_en:'History of Philosophy and Sufism', author:'آیت‌الله علی نمازی شاهرودی', category:'philosophy', subcategory:'islamic', pages:350, year:'2015', cover_emoji:'🧠', cover_color:'#F3E5F5', archive_url:'https://archive.org/details/TarikheFalsafe', gdrive_embed:'https://archive.org/embed/TarikheFalsafe', is_featured:false },
  { id:'20', title_dari:'ادب دری افغانی',                      title_en:'Afghan Dari Literature', author:'محمد حسین راضی', category:'university', subcategory:'literature', pages:112, year:'1356', cover_emoji:'📕', cover_color:'#E3F2FD', archive_url:'https://archive.org/details/azu_acku_kotabkalan_pk_6427_6_alif77_ray26_1356', gdrive_embed:'https://archive.org/embed/azu_acku_kotabkalan_pk_6427_6_alif77_ray26_1356', is_featured:false }
];

// ── API (Supabase when configured, fallback otherwise) ───────
const API = {
  _filterFallback({ category, subcategory, grade, search, featured, limit = 100, page = 1 } = {}) {
    let books = [...FALLBACK_BOOKS];
    if (category)    books = books.filter(b => b.category === category);
    if (subcategory) books = books.filter(b => b.subcategory === subcategory);
    if (grade)       books = books.filter(b => b.grade === grade);
    if (featured)    books = books.filter(b => b.is_featured);
    if (search) {
      const q = search.toLowerCase();
      books = books.filter(b =>
        (b.title_dari||'').includes(q) || (b.author||'').includes(q)
      );
    }
    const total = books.length;
    const from = (page - 1) * limit;
    return { data: books.slice(from, from + limit), count: total };
  },

  async getBooks(opts = {}) {
    if (!SUPABASE_CONFIGURED) return this._filterFallback(opts);
    await initSupabase();
    if (!supabase) return this._filterFallback(opts);
    try {
      const { category, subcategory, grade, search, page = 1, limit = 12, featured } = opts;
      let q = supabase.from('books').select('*', { count: 'exact' }).eq('is_published', true);
      if (category)    q = q.eq('category', category);
      if (subcategory) q = q.eq('subcategory', subcategory);
      if (grade)       q = q.eq('grade', grade);
      if (featured)    q = q.eq('is_featured', true);
      if (search)      q = q.ilike('title_dari', '%' + search + '%');
      const from = (page - 1) * limit;
      q = q.range(from, from + limit - 1).order('title_dari');
      const { data, error, count } = await q;
      if (error || !data) return this._filterFallback(opts);
      return { data, count };
    } catch(e) {
      return this._filterFallback(opts);
    }
  },

  async getBook(id) {
    const local = FALLBACK_BOOKS.find(b => b.id === id);
    if (!SUPABASE_CONFIGURED) return local || null;
    await initSupabase();
    if (!supabase) return local || null;
    try {
      const { data, error } = await supabase.from('books').select('*').eq('id', id).single();
      if (error || !data) return local || null;
      return data;
    } catch(e) {
      return local || null;
    }
  },

  async searchBooks(query) {
    const q = query.toLowerCase();
    const fallback = FALLBACK_BOOKS.filter(b =>
      (b.title_dari||'').includes(q) || (b.author||'').includes(q) ||
      (b.title_en||'').toLowerCase().includes(q)
    );
    if (!SUPABASE_CONFIGURED) return fallback;
    await initSupabase();
    if (!supabase) return fallback;
    try {
      const { data, error } = await supabase.from('books').select('*')
        .eq('is_published', true)
        .or('title_dari.ilike.%' + query + '%,author.ilike.%' + query + '%,title_en.ilike.%' + query + '%')
        .limit(24);
      if (error || !data?.length) return fallback;
      return data;
    } catch(e) { return fallback; }
  },

  async incrementViews(id) {
    if (!SUPABASE_CONFIGURED || !supabase) return;
    try { await supabase.rpc('increment_views', { book_id: id }); } catch(e) {}
  },

  async incrementDownloads(id) {
    if (!SUPABASE_CONFIGURED || !supabase) return;
    try { await supabase.rpc('increment_downloads', { book_id: id }); } catch(e) {}
  },

  async submitContribution(payload) {
    if (!SUPABASE_CONFIGURED) return { error: 'not_configured' };
    await initSupabase();
    if (!supabase) return { error: 'not_configured' };
    try {
      const { error } = await supabase.from('contributions').insert([payload]);
      return { error };
    } catch(e) { return { error: e }; }
  },

  async getContributions(status = 'pending') {
    if (!SUPABASE_CONFIGURED || !supabase) return [];
    try {
      const { data } = await supabase.from('contributions').select('*')
        .eq('status', status).order('created_at', { ascending: false });
      return data || [];
    } catch(e) { return []; }
  },

  async updateContribution(id, updates) {
    if (!SUPABASE_CONFIGURED || !supabase) return;
    try {
      await supabase.from('contributions')
        .update({ ...updates, reviewed_at: new Date().toISOString() })
        .eq('id', id);
    } catch(e) {}
  },

  async getStats() {
    if (!SUPABASE_CONFIGURED || !supabase) {
      return { books: FALLBACK_BOOKS.length, downloads: 0, contributions: 0 };
    }
    try {
      const [booksRes, contribRes] = await Promise.all([
        supabase.from('books').select('id, downloads', { count: 'exact' }).eq('is_published', true),
        supabase.from('contributions').select('id', { count: 'exact' }).eq('status', 'pending')
      ]);
      const totalDownloads = (booksRes.data || []).reduce((s, b) => s + (b.downloads || 0), 0);
      return { books: booksRes.count || 0, downloads: totalDownloads, contributions: contribRes.count || 0 };
    } catch(e) {
      return { books: FALLBACK_BOOKS.length, downloads: 0, contributions: 0 };
    }
  }
};

// ── Auth ─────────────────────────────────────────────────────
const Auth = {
  async signInWithGoogle() {
    if (!SUPABASE_CONFIGURED) { UI.toast('لطفاً ابتدا Supabase را پیکربندی کنید', 'error'); return; }
    await initSupabase();
    if (!supabase) return;
    return supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });
  },
  async signInWithEmail(email, password) {
    if (!SUPABASE_CONFIGURED) { return { error: { message: 'Supabase not configured' } }; }
    await initSupabase();
    if (!supabase) return { error: { message: 'Init failed' } };
    return supabase.auth.signInWithPassword({ email, password });
  },
  async signUpWithEmail(email, password, name) {
    if (!SUPABASE_CONFIGURED) { return { error: { message: 'Supabase not configured' } }; }
    await initSupabase();
    if (!supabase) return { error: { message: 'Init failed' } };
    return supabase.auth.signUp({ email, password, options: { data: { full_name: name } } });
  },
  async signOut() {
    if (!supabase) { window.location.href = (typeof relativePath !== 'undefined' ? relativePath : '') + 'index.html'; return; }
    await supabase.auth.signOut();
    window.location.href = (typeof relativePath !== 'undefined' ? relativePath : '') + 'index.html';
  },
  async getUser() {
    if (!SUPABASE_CONFIGURED || !supabase) return null;
    try { const { data } = await supabase.auth.getUser(); return data?.user || null; } catch(e) { return null; }
  },
  isAdmin(email) { return email === ADMIN_EMAIL; },
  onAuthStateChange(cb) {
    if (!SUPABASE_CONFIGURED || !supabase) return;
    supabase.auth.onAuthStateChange((event, session) => cb(event, session));
  }
};

// ── UI utilities ─────────────────────────────────────────────
const UI = {
  toast(msg, type = 'info', duration = 3500) {
    let c = document.querySelector('.toast-container');
    if (!c) { c = document.createElement('div'); c.className = 'toast-container'; document.body.appendChild(c); }
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
    const t = document.createElement('div');
    t.className = 'toast ' + type;
    t.innerHTML = '<span>' + icon + '</span><span>' + msg + '</span>';
    c.appendChild(t);
    setTimeout(() => t.remove(), duration);
  },
  openModal(id)  { document.getElementById(id)?.classList.add('open');    document.body.style.overflow = 'hidden'; },
  closeModal(id) { document.getElementById(id)?.classList.remove('open'); document.body.style.overflow = ''; },
  formatNum(n) {
    if (!n && n !== 0) return '۰';
    return n.toString().replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
  },
  badgeFor(cat) {
    const c = CATEGORIES[cat];
    return '<span class="badge ' + (c ? c.badgeClass : '') + '">' + (c ? c.label : cat) + '</span>';
  },
  renderBookCard(book) {
    const cat = CATEGORIES[book.category] || {};
    const bg  = book.cover_color || cat.color || '#EEF3FB';
    const ico = book.cover_emoji || cat.icon  || '📖';
    const featured = book.is_featured
      ? '<span class="badge badge-new" style="position:absolute;top:.6rem;right:.6rem">✨ مشهور</span>' : '';
    const author = book.author
      ? '<div class="book-card__author">' + book.author + (book.grade ? ' · صنف ' + UI.formatNum(book.grade) : '') + '</div>' : '';
    const pages = book.pages
      ? '<span class="tag">' + UI.formatNum(book.pages) + ' صفحه</span>' : '';
    const archiveSafe = (book.archive_url || '').replace(/'/g, '');
    return [
      '<article class="book-card" onclick="openBook(\'' + book.id + '\')">',
      '  <div class="book-card__cover" style="background:' + bg + '">',
      '    <span style="font-size:3.5rem">' + ico + '</span>',
      '    ' + featured,
      '  </div>',
      '  <div class="book-card__body">',
      '    <div class="book-card__title">' + book.title_dari + '</div>',
      '    ' + author,
      '    <div style="display:flex;gap:.4rem;flex-wrap:wrap;margin-top:.3rem">',
      '      ' + UI.badgeFor(book.category),
      '      ' + pages,
      '    </div>',
      '  </div>',
      '  <div class="book-card__footer">',
      '    <button class="btn btn-outline btn-sm" style="flex:1" onclick="event.stopPropagation();openBook(\'' + book.id + '\')">📖 خواندن</button>',
      '    <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();downloadBook(\'' + book.id + '\',\'' + archiveSafe + '\')" title="دانلود PDF">⬇️</button>',
      '  </div>',
      '</article>'
    ].join('\n');
  },
  renderPagination(page, total, limit, onPage) {
    const pages = Math.ceil(total / limit);
    if (pages <= 1) return '';
    let html = '<div class="pagination">';
    html += '<button class="page-btn" onclick="' + onPage + '(' + (page-1) + ')" ' + (page<=1?'disabled':'') + '>→</button>';
    for (let i = 1; i <= pages; i++) {
      if (i===1 || i===pages || Math.abs(i-page)<=2) {
        html += '<button class="page-btn ' + (i===page?'active':'') + '" onclick="' + onPage + '(' + i + ')">' + UI.formatNum(i) + '</button>';
      } else if (Math.abs(i-page)===3) {
        html += '<span class="page-btn" style="cursor:default">…</span>';
      }
    }
    html += '<button class="page-btn" onclick="' + onPage + '(' + (page+1) + ')" ' + (page>=pages?'disabled':'') + '>←</button>';
    html += '</div>';
    return html;
  }
};

// ── Navigation helpers ────────────────────────────────────────
function _base() { return (typeof relativePath !== 'undefined') ? relativePath : ''; }

function openBook(id) {
  window.location.href = _base() + 'pages/book.html?id=' + id;
}
function downloadBook(id, url) {
  if (!url) { UI.toast('لینک دانلود موجود نیست', 'error'); return; }
  API.incrementDownloads(id);
  const slug = url.split('/').pop();
  window.open('https://archive.org/download/' + slug + '/' + slug + '.pdf', '_blank');
  UI.toast('دانلود آغاز شد ✅', 'success');
}
function goSearch(query) {
  if (!query || !query.trim()) return;
  window.location.href = _base() + 'pages/search.html?q=' + encodeURIComponent(query.trim());
}

// ── Global init (search forms, modal close) ───────────────────
document.addEventListener('DOMContentLoaded', function() {
  // Wire up all search forms
  document.querySelectorAll('[data-search-form]').forEach(function(form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var input = form.querySelector('input');
      if (input && input.value.trim()) goSearch(input.value.trim());
    });
  });
  // Close modal on overlay click
  document.querySelectorAll('.modal-overlay').forEach(function(overlay) {
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) UI.closeModal(overlay.id);
    });
  });
});
