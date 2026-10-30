/* Meridian Studio — motion, the reveal slider, nav, form.
   Content is fully present without JS; this layer only enhances. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  /* ---- scroll reveals ---- */
  var risers = Array.prototype.slice.call(document.querySelectorAll('[data-rise], [data-diagram]'));
  if (reduce || !('IntersectionObserver' in window)) {
    risers.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    risers.forEach(function (el) { io.observe(el); });
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

  /* ---- signature: before/after reveal slider ---- */
  var frame = document.getElementById('reveal');
  var range = document.getElementById('reveal-range');
  if (frame && range) {
    var apply = function () {
      var v = Math.max(0, Math.min(100, Number(range.value)));
      frame.style.setProperty('--pos', v + '%');
      range.setAttribute('aria-valuetext', 'Showing ' + Math.round(v) + '% of the real website');
    };
    apply();
    range.addEventListener('input', apply);
    // drag anywhere on the frame (pointer), keyboard via the range input
    var dragging = false;
    var setFromX = function (x) {
      var r = frame.getBoundingClientRect();
      var v = Math.max(0, Math.min(100, (x - r.left) / r.width * 100));
      range.value = v; apply();
    };
    frame.addEventListener('pointerdown', function (e) {
      if (e.target.closest && e.target.closest('a[href],button')) return;
      dragging = true; try { frame.setPointerCapture(e.pointerId); } catch (x) {}
      setFromX(e.clientX);
    });
    frame.addEventListener('pointermove', function (e) { if (dragging) setFromX(e.clientX); });
    var stop = function () { dragging = false; };
    frame.addEventListener('pointerup', stop);
    frame.addEventListener('pointercancel', stop);
    // a gentle one-time nudge so visitors notice it is draggable
    if (!reduce) {
      var nudged = false;
      var io2 = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && !nudged) {
            nudged = true; io2.disconnect();
            var seq = [52, 60, 44, 52], k = 0;
            var tick = function () {
              if (k >= seq.length) return;
              range.value = seq[k++]; apply();
              setTimeout(tick, 420);
            };
            setTimeout(tick, 500);
          }
        });
      }, { threshold: 0.5 });
      io2.observe(frame);
    }
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

  /* ---- FAQ: open one at a time ---- */
  var faqItems = Array.prototype.slice.call(document.querySelectorAll('.faq__item'));
  faqItems.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (item.open) {
        faqItems.forEach(function (other) { if (other !== item) other.open = false; });
      }
    });
  });
})();
