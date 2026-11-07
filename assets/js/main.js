/* ZN Imóveis — comportamento: loader, topo fixo, revelações, formulários */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasG = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  if (hasG) { gsap.registerPlugin(ScrollTrigger); document.documentElement.classList.add('has-gsap'); }
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* 1. LOADER */
  var loader = document.getElementById('loader'), fill = document.getElementById('loaderFill'), pct = document.getElementById('loaderPct');
  var shown = 0, started = performance.now(), finished = false, loaded = document.readyState === 'complete';
  window.addEventListener('load', function () { loaded = true; });
  function finish() {
    if (finished) return; finished = true;
    if (fill) fill.style.width = '100%'; if (pct) pct.textContent = '100';
    if (loader) { loader.classList.add('is-done'); setTimeout(function () { loader.style.display = 'none'; }, 800); }
    document.body.classList.add('is-ready');
    document.dispatchEvent(new Event('zn:ready'));
  }
  (function tick() {
    if (finished) return;
    var el = performance.now() - started;
    var target = loaded ? 100 : Math.min(90, el / 40);
    if (el < 900) target = Math.min(target, el / 9);
    shown = lerp(shown, target, 0.12);
    if (fill) fill.style.width = shown.toFixed(1) + '%';
    if (pct) pct.textContent = Math.round(shown);
    if ((shown > 99.2 && loaded) || el > 5200) finish(); else requestAnimationFrame(tick);
  })();

  /* 2. TOPO FLUTUANTE */
  var nav = $('#nav');
  function syncNav() { nav.classList.toggle('is-solid', (window.scrollY || window.pageYOffset) > 30); }
  syncNav();
  window.addEventListener('scroll', syncNav, { passive: true });

  /* destaque da seção atual */
  var map = {};
  $$('.dock a:not(.dock__brand)').forEach(function (a) { var h = a.getAttribute('href'); if (h && h.charAt(0) === '#') (map[h.slice(1)] = map[h.slice(1)] || []).push(a); });
  var groups = { lareserve: 'lareserve', busca: 'imoveis', vender: 'vender', chegada: 'chegada', lazer: 'chegada', numeros: 'chegada', ambientes: 'chegada', convite: 'chegada', imoveis: 'imoveis', categorias: 'categorias', atendimento: 'atendimento', contato: 'contato' };
  function setActive(key) {
    $$('.dock a:not(.dock__brand)').forEach(function (a) { a.classList.remove('is-active'); });
    (map[key] || []).forEach(function (a) { a.classList.add('is-active'); });
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) setActive(groups[en.target.id]); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(groups).forEach(function (id) { var el = document.getElementById(id); if (el) io.observe(el); });
  }

  /* 3. REVELAÇÕES + CONTADORES */
  function countUp(el) {
    var to = parseFloat(el.dataset.to) || 0, dec = parseInt(el.dataset.dec || '0', 10), suf = el.dataset.suffix || '';
    var fmt = function (n) { return n.toFixed(dec).replace('.', ',') + suf; };
    if (!hasG || reduce) { el.textContent = fmt(to); return; }
    var o = { v: 0 };
    gsap.to(o, { v: to, duration: 1.7, ease: 'power2.out', onUpdate: function () { el.textContent = fmt(o.v); } });
  }
  if (!hasG || reduce) {
    $$('.reveal').forEach(function (el) { el.style.opacity = 1; el.style.transform = 'none'; });
    $$('.num').forEach(countUp);
  } else {
    gsap.utils.toArray('.reveal').forEach(function (el, i) {
      gsap.to(el, { opacity: 1, y: 0, duration: 0.95, ease: 'power3.out', delay: (i % 3) * 0.07, scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
    });
    gsap.utils.toArray('.num').forEach(function (el) {
      var done = false;
      ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: function () { if (!done) { done = true; countUp(el); } } });
    });
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  }

  /* 4. FORMULÁRIOS → WhatsApp */
  var WHATS = '5586981818067';
  function sendWA(form, statusEl, build) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      $$('[required]', form).forEach(function (inp) {
        var bad = !inp.value.trim();
        var box = inp.closest('label') || inp.parentElement;
        box.classList.toggle('is-bad', bad);
        if (bad) ok = false;
      });
      if (!ok) { statusEl.style.color = '#E06B5A'; statusEl.textContent = 'Preencha os campos que faltam.'; return; }
      var url = 'https://wa.me/' + WHATS + '?text=' + encodeURIComponent(build(new FormData(form)));
      statusEl.style.color = ''; statusEl.textContent = '';
      var go = document.createElement('a');
      go.href = url; go.target = '_blank'; go.rel = 'noopener';
      go.textContent = 'Toque aqui se o WhatsApp não abrir sozinho';
      go.style.textDecoration = 'underline';
      statusEl.appendChild(go);
      try { go.click(); } catch (err) {}
    });
    form.addEventListener('input', function (e) { var b = e.target.closest('label'); if (b) b.classList.remove('is-bad'); });
  }
  var f1 = $('#briefing');
  if (f1) sendWA(f1, $('#formStatus'), function (d) {
    return 'Olá! Vim pelo site da ZN Imóveis.\nNome: ' + d.get('nome') + '\nWhatsApp: ' + d.get('whatsapp') + '\nProcuro: ' + d.get('interesse') + (d.get('mensagem') ? '\nDetalhes: ' + d.get('mensagem') : '');
  });
  var f2 = $('#venderForm');
  if (f2) sendWA(f2, $('#venderStatus'), function (d) {
    return 'Olá! Vim pelo site da ZN Imóveis e quero expor o meu imóvel.\nTipo: ' + d.get('tipo') + '\nLocal: ' + d.get('lugar') + (d.get('bairro') ? ' — ' + d.get('bairro') : '') + '\nNome: ' + d.get('nome') + '\nWhatsApp: ' + d.get('whatsapp');
  });

  var y = $('#ano'); if (y) y.textContent = new Date().getFullYear();
})();
