/* A Great War Requiem — site scripts
 * Theme toggle • reading progress • footnote popovers • reveal on scroll • TOC tracking
 */

(() => {
  'use strict';

  /* ---------- THEME ---------- */
  const root = document.documentElement;
  const THEME_KEY = 'agwr.theme';
  const stored = (() => { try { return localStorage.getItem(THEME_KEY); } catch { return null; } })();
  if (stored) root.setAttribute('data-theme', stored);

  const toggleBtn = document.querySelector('[data-theme-toggle]');
  function renderThemeIcon() {
    if (!toggleBtn) return;
    const dark = root.getAttribute('data-theme') !== 'light';
    toggleBtn.innerHTML = dark
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
    toggleBtn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
  }
  renderThemeIcon();
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const now = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', now);
      try { localStorage.setItem(THEME_KEY, now); } catch {}
      renderThemeIcon();
    });
  }

  /* ---------- MOBILE MENU ---------- */
  const menuBtn = document.querySelector('[data-menu-toggle]');
  const navLinks = document.querySelector('.nav__links');
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => navLinks.classList.toggle('is-open'));
  }

  /* ---------- READING PROGRESS BAR ---------- */
  const bar = document.querySelector('.progress-bar');
  if (bar) {
    const update = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop;
      const max = h.scrollHeight - h.clientHeight;
      const pct = max > 0 ? (scrolled / max) * 100 : 0;
      bar.style.width = pct + '%';
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ---------- FOOTNOTE POPOVERS ---------- */
  // Expect markup: <button class="fnote" data-note="1">1</button>
  // And footnotes list: <ol class="footnotes__list"><li id="fn-1">text</li>...
  const popover = document.createElement('div');
  popover.className = 'fnote-popover';
  popover.setAttribute('role', 'tooltip');
  document.body.appendChild(popover);
  let openBtn = null;

  function positionPopover(btn) {
    const rect = btn.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
    const pw = popover.offsetWidth;
    const vw = window.innerWidth;
    let left = rect.left + scrollX + rect.width / 2 - pw / 2;
    left = Math.max(8, Math.min(left, vw - pw - 8));
    const top = rect.bottom + scrollY + 8;
    popover.style.left = left + 'px';
    popover.style.top = top + 'px';
  }
  function openPopover(btn) {
    const id = btn.dataset.note;
    const src = document.getElementById('fn-' + id);
    if (!src) return;
    popover.innerHTML = '<div class="fnote-popover__body">' + src.innerHTML + '</div>';
    popover.classList.add('is-open');
    positionPopover(btn);
    openBtn = btn;
  }
  function closePopover() {
    popover.classList.remove('is-open');
    openBtn = null;
  }
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.fnote');
    if (btn) {
      e.preventDefault();
      if (openBtn === btn) { closePopover(); } else { openPopover(btn); }
      return;
    }
    if (openBtn && !popover.contains(e.target)) closePopover();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePopover();
  });
  window.addEventListener('scroll', closePopover, { passive: true });

  /* ---------- REVEAL ON SCROLL ---------- */
  const observer = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            observer.unobserve(e.target);
          }
        }
      }, { threshold: 0.08 })
    : null;
  document.querySelectorAll('.reveal').forEach((el) => {
    if (observer) observer.observe(el);
    else el.classList.add('is-visible');
  });

  /* ---------- TOC ACTIVE TRACKING ---------- */
  const tocLinks = document.querySelectorAll('.toc-aside a[href^="#"]');
  if (tocLinks.length) {
    const map = new Map();
    tocLinks.forEach((a) => {
      const id = a.getAttribute('href').slice(1);
      const tgt = document.getElementById(id);
      if (tgt) map.set(tgt, a);
    });
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const link = map.get(e.target);
        if (!link) continue;
        if (e.isIntersecting) {
          tocLinks.forEach((l) => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    }, { rootMargin: '-40% 0px -55% 0px' });
    map.forEach((_, el) => io.observe(el));
  }

  /* ---------- Keyboard: left/right for prev/next chapter ---------- */
  document.addEventListener('keydown', (e) => {
    if (e.target.matches && e.target.matches('input, textarea, [contenteditable]')) return;
    if (e.key === 'ArrowLeft') {
      const prev = document.querySelector('.chapter-nav .prev:not(.empty)');
      if (prev && prev.tagName === 'A') window.location.href = prev.href;
    } else if (e.key === 'ArrowRight') {
      const next = document.querySelector('.chapter-nav .next:not(.empty)');
      if (next && next.tagName === 'A') window.location.href = next.href;
    }
  });

})();
