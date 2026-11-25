/* Niche pages: motion layer. Transform/opacity only, reduced-motion safe.
   Content is fully visible without this file; it only adds feedback. */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var raf = window.requestAnimationFrame;
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  /* ---- scroll progress, under the nav ---- */
  var nav = document.getElementById('nav');
  var bar = null;
  if (nav) {
    bar = document.createElement('span');
    bar.className = 'progress';
    bar.setAttribute('aria-hidden', 'true');
    nav.appendChild(bar);
  }

  /* ---- hero entrance: headline lines rise from their baseline, then the offer ---- */
  var hero = document.querySelector('.nhero');
  if (hero) {
    $$('.mask', hero).forEach(function (m, i) { m.style.setProperty('--i', i); });
    $$('.offer > div, .proofrow', hero).forEach(function (r, i) { r.style.setProperty('--r', i); });
    var go = function () { hero.classList.add('is-in'); };
    if (reduce) go(); else raf(function () { raf(go); });
    setTimeout(go, 1200); // never leave the hero hidden
  }

  if (reduce) return; // everything below is motion only

  /* ---- price "stamp", ticks drawn one by one, needs popping in ---- */
  $$('.ticks, .needs').forEach(function (list) {
    $$('li', list).forEach(function (li, i) { li.style.setProperty('--k', i); });
  });

  /* ---- scroll-driven bits, one rAF per frame ---- */
  var stage = document.querySelector('[data-stage]');
  var phone = stage && stage.querySelector('.ndemo__phone');
  var desk = stage && stage.querySelector('.ndemo__desk');
  var steps = document.querySelector('[data-steps]');
  var stepItems = steps ? $$('li', steps) : [];
  var feats = $$('.feat');
  var ticking = false;

  var onScroll = function () {
    ticking = false;
    var vh = window.innerHeight;
    var y = window.scrollY;
    var max = document.documentElement.scrollHeight - vh;

    if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? clamp(y / max, 0, 1) : 0).toFixed(4) + ')';

    // demo: the phone drifts faster than the laptop, the laptop settles in
    if (stage && phone && desk) {
      var r = stage.getBoundingClientRect();
      if (r.bottom > 0 && r.top < vh) {
        var p = clamp((vh - r.top) / (vh + r.height), 0, 1); // 0 entering, 1 leaving
        phone.style.transform = 'translate3d(0,' + ((0.5 - p) * 90).toFixed(1) + 'px,0) rotate(' + ((0.5 - p) * 4).toFixed(2) + 'deg)';
        desk.style.setProperty('--settle', (0.94 + clamp(p * 2.2, 0, 1) * 0.06).toFixed(4));
      }
    }

    // features: the one nearest the reading line lights up
    if (feats.length) {
      var line = vh * 0.45, best = null, bestD = Infinity;
      feats.forEach(function (f) {
        var b = f.getBoundingClientRect();
        var d = Math.abs(b.top + b.height / 2 - line);
        if (b.bottom > 0 && b.top < vh && d < bestD) { bestD = d; best = f; }
      });
      feats.forEach(function (f) { f.classList.toggle('is-active', f === best); });
    }

    // steps: a line fills down the timeline as you read, dots light as it passes
    if (steps) {
      var s = steps.getBoundingClientRect();
      var fill = clamp((vh * 0.62 - s.top) / s.height, 0, 1);
      steps.style.setProperty('--fill', fill.toFixed(4));
      var reach = s.top + fill * s.height;
      stepItems.forEach(function (li) { li.classList.toggle('is-on', li.getBoundingClientRect().top + 10 <= reach); });
    }
  };
  var request = function () { if (!ticking) { ticking = true; raf(onScroll); } };
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', request, { passive: true });
  onScroll();

  /* ---- pointer: demo tilts toward the cursor, buttons lean toward it ---- */
  if (fine) {
    if (stage) {
      var tx = 0, ty = 0, cx = 0, cy = 0, loop = null;
      var tick = function () {
        cx += (tx - cx) * 0.12; cy += (ty - cy) * 0.12; // critically-damped-ish follow
        stage.style.setProperty('--rx', cy.toFixed(3) + 'deg');
        stage.style.setProperty('--ry', cx.toFixed(3) + 'deg');
        if (Math.abs(tx - cx) > 0.01 || Math.abs(ty - cy) > 0.01) loop = raf(tick); else loop = null;
      };
      var kick = function () { if (!loop) loop = raf(tick); };
      stage.addEventListener('pointermove', function (e) {
        var b = stage.getBoundingClientRect();
        tx = ((e.clientX - b.left) / b.width - 0.5) * 6;
        ty = -((e.clientY - b.top) / b.height - 0.5) * 4;
        kick();
      });
      stage.addEventListener('pointerleave', function () { tx = 0; ty = 0; kick(); });
    }

    $$('.nhero .button, .price .button, .form__submit').forEach(function (btn) {
      btn.classList.add('is-magnetic');
      btn.addEventListener('pointermove', function (e) {
        var b = btn.getBoundingClientRect();
        var mx = (e.clientX - b.left - b.width / 2) * 0.18;
        var my = (e.clientY - b.top - b.height / 2) * 0.28;
        btn.style.setProperty('--mx', mx.toFixed(1) + 'px');
        btn.style.setProperty('--my', my.toFixed(1) + 'px');
      });
      btn.addEventListener('pointerleave', function () { btn.style.setProperty('--mx', '0px'); btn.style.setProperty('--my', '0px'); });
    });

    // hub rows: the screenshot leans toward the cursor
    $$('.hub__link').forEach(function (a) {
      var media = a.querySelector('.hub__media');
      if (!media) return;
      a.addEventListener('pointermove', function (e) {
        var b = a.getBoundingClientRect();
        var px = (e.clientX - b.left) / b.width - 0.5, py = (e.clientY - b.top) / b.height - 0.5;
        media.style.transform = 'perspective(900px) rotateY(' + (px * 8).toFixed(2) + 'deg) rotateX(' + (-py * 6).toFixed(2) + 'deg) translateY(-4px)';
      });
      a.addEventListener('pointerleave', function () { media.style.transform = ''; });
    });
  }

  /* ---- press feedback anywhere: a quick ink ripple from the touch point ---- */
  document.addEventListener('pointerdown', function (e) {
    var el = e.target.closest && e.target.closest('.button, .hub__link, .faq__item summary');
    if (!el) return;
    var b = el.getBoundingClientRect();
    var dot = document.createElement('span');
    dot.className = 'ripple';
    dot.setAttribute('aria-hidden', 'true');
    var size = Math.max(b.width, b.height) * 2.2;
    dot.style.width = dot.style.height = size + 'px';
    dot.style.left = (e.clientX - b.left - size / 2) + 'px';
    dot.style.top = (e.clientY - b.top - size / 2) + 'px';
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    el.style.overflow = 'hidden';
    el.appendChild(dot);
    dot.addEventListener('animationend', function () { dot.remove(); });
  });

  /* ---- form: invalid fields nudge, sending dots, a tick when it lands ---- */
  var form = document.getElementById('enquiry-form');
  if (form) {
    form.addEventListener('submit', function () {
      ['name', 'email'].forEach(function (k) {
        var f = form.elements[k];
        var bad = k === 'email' ? !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value.trim()) : !f.value.trim();
        f.setAttribute('aria-invalid', bad ? 'true' : 'false');
        if (bad) { f.classList.remove('is-shake'); void f.offsetWidth; f.classList.add('is-shake'); }
      });
    }, true);
    form.addEventListener('input', function (e) { if (e.target.getAttribute('aria-invalid') === 'true') e.target.setAttribute('aria-invalid', 'false'); });
  }
})();
