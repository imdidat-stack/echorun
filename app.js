// Tiwizi website. Arabic lives in the HTML, so every page reads correctly
// without JavaScript; this adds English, the role tabs, the screenshot
// viewer, sharing and the photo credits.
(() => {
  const root = document.documentElement;
  const KEY = 'tiwizi-lang';
  const store = {
    get() { try { return localStorage.getItem(KEY); } catch (_) { return null; } },
    set(v) { try { localStorage.setItem(KEY, v); } catch (_) { /* private mode */ } },
  };

  // ---------- Language ----------
  // Remember the Arabic of every translatable node once, then swap.
  const texts = [...document.querySelectorAll('[data-en]')];
  const labels = [...document.querySelectorAll('[data-en-label]')];
  const alts = [...document.querySelectorAll('[data-en-alt]')];
  texts.forEach((el) => { el.dataset.ar = el.textContent; });
  labels.forEach((el) => { el.dataset.arLabel = el.getAttribute('aria-label') || ''; });
  alts.forEach((el) => { el.dataset.arAlt = el.getAttribute('alt') || ''; });
  const toggles = [...document.querySelectorAll('[data-lang-toggle]')];

  const english = () => root.lang === 'en';
  function applyLanguage(lang) {
    const en = lang === 'en';
    root.lang = en ? 'en' : 'ar';
    root.dir = en ? 'ltr' : 'rtl';
    texts.forEach((el) => { el.textContent = en ? el.dataset.en : el.dataset.ar; });
    labels.forEach((el) => el.setAttribute('aria-label', en ? el.dataset.enLabel : el.dataset.arLabel));
    alts.forEach((el) => el.setAttribute('alt', en ? el.dataset.enAlt : el.dataset.arAlt));
    toggles.forEach((b) => {
      b.textContent = en ? 'العربية' : 'English';
      b.lang = en ? 'ar' : 'en';
      b.setAttribute('aria-label', en ? 'التبديل إلى العربية' : 'Switch to English');
    });
    renderCredits();
  }
  toggles.forEach((b) => b.addEventListener('click', () => {
    const next = english() ? 'ar' : 'en';
    store.set(next);
    applyLanguage(next);
  }));

  // ---------- Header: solid once the page moves ----------
  const header = document.querySelector('.site-header');
  const onScroll = () => header && header.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, {passive: true});
  onScroll();

  // ---------- Role tabs (ARIA tabs, arrow keys follow reading direction) ----------
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  function select(tab, focus) {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !on;
    });
    if (focus) tab.focus();
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab, false));
    tab.addEventListener('keydown', (e) => {
      const forward = root.dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
      const back = root.dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
      let next = null;
      if (e.key === forward) next = tabs[(i + 1) % tabs.length];
      else if (e.key === back) next = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (e.key === 'Home') next = tabs[0];
      else if (e.key === 'End') next = tabs[tabs.length - 1];
      if (next) { e.preventDefault(); select(next, true); }
    });
  });

  // ---------- Screenshot viewer ----------
  const dialog = document.getElementById('lightbox');
  const large = document.getElementById('lightbox-image');
  document.querySelectorAll('[data-screen]').forEach((button) => {
    button.addEventListener('click', () => {
      if (!dialog || typeof dialog.showModal !== 'function') {
        window.open(button.dataset.screen, '_blank', 'noopener');
        return;
      }
      const img = button.querySelector('img');
      large.src = button.dataset.screen;
      large.alt = img ? img.alt : '';
      dialog.showModal();
    });
  });
  if (dialog) {
    dialog.addEventListener('click', (e) => {
      // A tap on the dimmed backdrop, or the close button, closes it.
      if (e.target === dialog || e.target.closest('[data-close]')) dialog.close();
    });
  }

  // ---------- Toast & share ----------
  const toast = document.getElementById('toast');
  let toastTimer;
  function say(ar, en) {
    if (!toast) return;
    toast.textContent = english() ? en : ar;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
  }
  const share = document.getElementById('share');
  if (share) {
    share.addEventListener('click', async () => {
      const data = {
        title: english() ? 'Tiwizi' : 'تيويزي',
        text: english() ? 'Tiwizi is coming soon to Amizmiz.' : 'تيويزي قريبًا في أمزميز.',
        url: location.href.split('#')[0],
      };
      try {
        if (navigator.share) { await navigator.share(data); return; }
        await navigator.clipboard.writeText(data.url);
        say('تم نسخ الرابط', 'Link copied');
      } catch (err) {
        if (err && err.name === 'AbortError') return;
        say('تعذّر نسخ الرابط، يمكنك نسخه من شريط المتصفح', 'Couldn’t copy the link. You can copy it from the address bar.');
      }
    });
  }

  // ---------- Photo credits (credits page) ----------
  const credits = document.getElementById('photo-credits');
  let sources = null;
  function renderCredits() {
    if (!credits || !sources) return;
    const en = english();
    credits.replaceChildren(...Object.values(sources.photographs || {}).map((p) => {
      const item = document.createElement('article');
      item.className = 'credit';
      const title = document.createElement('b');
      title.textContent = p.title || '';
      title.dir = 'auto';
      const by = document.createElement('span');
      by.textContent = `${en ? 'By' : 'تصوير'} ${p.creator || '—'} · ${p.licenseLabel || p.license || ''}`;
      by.dir = 'auto';
      const link = document.createElement('a');
      link.href = p.page || p.url;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = en ? 'Original photo' : 'الصورة الأصلية';
      item.append(title, by, link);
      if (p.licenseUrl) {
        const license = document.createElement('a');
        license.href = p.licenseUrl;
        license.target = '_blank';
        license.rel = 'noopener license';
        license.textContent = en ? 'License' : 'الرخصة';
        item.append(license);
      }
      return item;
    }));
  }
  if (credits) {
    fetch('images/screens/SOURCES.json')
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data) => { sources = data; renderCredits(); })
      .catch(() => {
        const p = document.createElement('p');
        p.textContent = english() ? 'The credits list could not be loaded.' : 'تعذّر تحميل قائمة المصادر.';
        credits.replaceChildren(p);
      });
  }

  applyLanguage(store.get() === 'en' ? 'en' : 'ar');
})();
