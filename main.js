/* Meridian Studio — motion, the reveal slider, nav, form.
   Content is fully present without JS; this layer only enhances. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce) document.documentElement.classList.add('anim'); // gates the reveal-hiding CSS

  /* ---- nav: solid once scrolled ---- */
  var nav = document.getElementById('nav');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('is-stuck', window.scrollY > 24); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- stagger index within each section ---- */
  document.querySelectorAll('main > section, footer').forEach(function (sec) {
    var items = sec.querySelectorAll('[data-rise]');
    items.forEach(function (el, i) { el.style.setProperty('--i', (i % 6)); });
  });

  /* ---- scroll reveals (content must NEVER stay hidden) ---- */
  var risers = Array.prototype.slice.call(document.querySelectorAll('[data-rise], [data-diagram]'));
  var reveal = function (el) { el.classList.add('is-in'); };
  var revealAll = function () { risers.forEach(reveal); };
  if (reduce) {
    revealAll();
  } else {
    // 1) IntersectionObserver for nicely-timed entrances
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); } });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
      risers.forEach(function (el) { io.observe(el); });
    }
    // 2) Scroll/resize fallback: reveal anything in view, even if the observer never fires
    var check = function () {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      risers.forEach(function (el) {
        if (el.classList.contains('is-in')) return;
        var r = el.getBoundingClientRect();
        if (r.top < vh * 0.9 && r.bottom > 0) reveal(el);
      });
    };
    check();
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check, { passive: true });
    // 3) Ultimate failsafe: never leave content invisible
    setTimeout(revealAll, 2600);
  }

  /* ---- hero: masked headline + fade-ups on load ---- */
  var lines = document.querySelector('.hero .lines');
  var fades = document.querySelectorAll('.hero [data-fade]');
  if (reduce) {
    if (lines) lines.classList.add('is-in');
    fades.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        if (lines) lines.classList.add('is-in');
        fades.forEach(function (el) { el.classList.add('is-in'); });
      });
    });
  }

  /* ---- signature: before/after reveal slider ----
     Apple-style: 1:1 drag, flick momentum, grabbable mid-flight, keyboard, reduced-motion safe. */
  var frame = document.getElementById('reveal');
  var range = document.getElementById('reveal-range');
  if (frame && range) {
    var pos = Number(range.value) || 50;
    var raf = null;
    var setPos = function (v) {
      pos = v < 0 ? 0 : v > 100 ? 100 : v;
      frame.style.setProperty('--pos', pos + '%');
      range.value = pos;
      range.setAttribute('aria-valuetext', 'Showing ' + Math.round(pos) + '% of the real website');
    };
    setPos(pos);
    var markUsed = function () { frame.classList.add('is-used'); };
    // keyboard / programmatic change — snap directly (discrete)
    range.addEventListener('input', function () { if (raf) cancelAnimationFrame(raf); setPos(Number(range.value)); markUsed(); });

    var dragging = false, samples = [];
    var pct = function (x) { var r = frame.getBoundingClientRect(); return (x - r.left) / r.width * 100; };
    var record = function (p) { samples.push({ p: p, t: performance.now() }); if (samples.length > 5) samples.shift(); };
    // momentum glide after a flick (interruptible, stops/rests at the edges)
    var glide = function (v0) {
      var v = v0, last = performance.now();
      var step = function (now) {
        var dt = Math.min((now - last) / 1000, 0.032); last = now;
        v *= Math.pow(0.94, dt * 60);
        setPos(pos + v * dt);
        if (pos <= 0 || pos >= 100) return;
        if (Math.abs(v) > 0.6) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };
    frame.addEventListener('pointerdown', function (e) {
      if (e.target.closest && e.target.closest('a[href],button')) return;
      if (raf) cancelAnimationFrame(raf);           // grab mid-flight
      dragging = true; markUsed(); frame.classList.add('is-grabbing');
      try { frame.setPointerCapture(e.pointerId); } catch (x) {}
      samples = []; var p = pct(e.clientX); record(p); setPos(p);
    });
    frame.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var p = pct(e.clientX); record(p); setPos(p);  // 1:1 with the finger
    });
    var release = function () {
      if (!dragging) return;
      dragging = false; frame.classList.remove('is-grabbing');
      var v0 = 0;
      if (samples.length >= 2) {
        var a = samples[0], b = samples[samples.length - 1], dt = (b.t - a.t) / 1000;
        if (dt > 0) v0 = (b.p - a.p) / dt;
      }
      if (!reduce && Math.abs(v0) > 20) glide(v0);   // flick → glide
    };
    frame.addEventListener('pointerup', release);
    frame.addEventListener('pointercancel', release);
  }

  /* ---- contact form (progressive AJAX) ---- */
  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');
  if (form && status) {
    form.addEventListener('submit', function (ev) {
      var action = form.getAttribute('action') || '';
      if (action.indexOf('YOUR_ENDPOINT') !== -1) {
        ev.preventDefault();
        status.className = 'form__status is-err';
        status.textContent = 'Form not connected yet — add your Formspree endpoint to go live. (Your email link below works now.)';
        return;
      }
      ev.preventDefault();
      status.className = 'form__status';
      status.textContent = 'Sending…';
      fetch(action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (r) {
          if (r.ok) {
            form.reset();
            status.className = 'form__status is-ok';
            status.textContent = 'Thanks — got it. I’ll reply within one business day.';
          } else {
            return r.json().then(function (d) { throw new Error((d && d.error) || 'error'); });
          }
        })
        .catch(function () {
          status.className = 'form__status is-err';
          status.textContent = 'Something went wrong. Please email officialmeridianstudio@gmail.com instead.';
        });
    });
  }

  /* ---- FAQ: smooth, interruptible open/close, one at a time ---- */
  var faqItems = Array.prototype.slice.call(document.querySelectorAll('.faq__item'));
  var collapse = function (it) {
    var p = it.querySelector('.faq__a');
    if (!p) { it.open = false; return; }
    if (reduce) { it.open = false; return; }
    p.style.height = p.scrollHeight + 'px';
    requestAnimationFrame(function () { p.style.height = '0px'; });
    var end = function () { it.open = false; p.style.height = ''; p.removeEventListener('transitionend', end); };
    p.addEventListener('transitionend', end);
  };
  faqItems.forEach(function (item) {
    var summary = item.querySelector('summary');
    var panel = item.querySelector('.faq__a');
    if (!summary || !panel) return;
    summary.addEventListener('click', function (e) {
      e.preventDefault();
      if (item.open) { collapse(item); return; }
      faqItems.forEach(function (o) { if (o !== item && o.open) collapse(o); });
      item.open = true;
      if (reduce) return;
      var h = panel.scrollHeight;
      panel.style.height = '0px';
      requestAnimationFrame(function () { panel.style.height = h + 'px'; });
      var end = function () { panel.style.height = ''; panel.removeEventListener('transitionend', end); };
      panel.addEventListener('transitionend', end);
    });
  });
})();
