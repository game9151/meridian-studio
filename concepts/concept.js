/* Concept mini-sites — premium motion, kept light (no libraries).
   Scroll reveals, hero parallax, count-up stats, pointer tilt on cards.
   Transform/opacity only; respects prefers-reduced-motion; safe if it fails. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---- reveals (hiding is gated on .reveal-on, added here, so content shows if this script never runs) ---- */
  document.documentElement.classList.add('reveal-on');
  var items = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  var show = function (el) { el.classList.add('in'); };
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(show);
  } else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el, i) { el.style.setProperty('--d', (i % 6)); io.observe(el); });
    var check = function () {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      items.forEach(function (el) {
        if (el.classList.contains('in')) return;
        var r = el.getBoundingClientRect();
        if (r.top < vh * 0.9 && r.bottom > 0) show(el);
      });
    };
    check();
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check, { passive: true });
    setTimeout(function () { items.forEach(show); }, 2600);
  }

  /* ---- hero parallax (the photo drifts slower than the scroll) ---- */
  var heroImg = document.querySelector('.hero__img');
  if (heroImg && !reduce) {
    heroImg.style.willChange = 'transform';
    var ticking = false;
    var par = function () {
      var y = window.scrollY || window.pageYOffset;
      heroImg.style.transform = 'translate3d(0,' + (y * 0.16).toFixed(1) + 'px,0) scale(1.1)';
      ticking = false;
    };
    heroImg.style.transform = 'scale(1.1)';
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(par); }
    }, { passive: true });
  }

  /* ---- count-up stats ---- */
  var counters = Array.prototype.slice.call(document.querySelectorAll('[data-count]'));
  var done = false;
  var runCounters = function () {
    if (done || !counters.length) return;
    var vh = window.innerHeight || document.documentElement.clientHeight;
    if (counters[0].getBoundingClientRect().top > vh * 0.92) return;
    done = true;
    counters.forEach(function (el) {
      var raw = el.getAttribute('data-count');
      var target = parseFloat(raw);
      var dec = raw.indexOf('.') > -1 ? 1 : 0;
      var suffix = el.getAttribute('data-suffix') || '';
      var fmt = function (v) { return (dec ? v.toFixed(1) : Math.round(v).toLocaleString()) + suffix; };
      if (reduce) { el.textContent = fmt(target); return; }
      var start = null, dur = 1300;
      var step = function (now) {
        if (start === null) start = now;
        var p = Math.min((now - start) / dur, 1);
        var ease = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(target * ease);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  };
  runCounters();
  window.addEventListener('scroll', runCounters, { passive: true });

  /* ---- pointer tilt on cards (desktop only) ---- */
  if (!reduce && fine) {
    Array.prototype.slice.call(document.querySelectorAll('[data-tilt]')).forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'perspective(650px) rotateX(' + (-py * 4.5).toFixed(2) + 'deg) rotateY(' + (px * 6).toFixed(2) + 'deg) translateY(-5px)';
      });
      card.addEventListener('pointerleave', function () { card.style.transform = ''; });
    });
  }
})();
