/* Niche pages: enquiry form posts to /api/enquiry (Vercel function). */
(function () {
  'use strict';
  var form = document.getElementById('enquiry-form');
  var status = document.getElementById('form-status');
  if (!form || !status) return;
  var btn = form.querySelector('button[type="submit"]');

  var say = function (msg, kind) { status.className = 'form__status' + (kind ? ' is-' + kind : ''); status.textContent = msg; };

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var name = form.elements.name.value.trim();
    var email = form.elements.email.value.trim();
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      say('Please add your name and a working email address.', 'err');
      (name ? form.elements.email : form.elements.name).focus();
      return;
    }
    var data = {};
    new FormData(form).forEach(function (v, k) { data[k] = String(v); });
    btn.disabled = true;
    form.classList.add('is-sending');
    say('Sending…');
    fetch(form.action, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (res) {
        if (res.ok) {
          form.reset();
          form.classList.add('is-sent');
          setTimeout(function () { form.classList.remove('is-sent'); }, 4000);
          say('Thanks, ' + name.split(' ')[0] + '. It’s in my inbox and I’ll reply within one business day.', 'ok');
        } else {
          throw new Error(res.d && res.d.error);
        }
      })
      .catch(function () {
        say('That didn’t send. Please email officialmeridianstudio@gmail.com instead.', 'err');
      })
      .then(function () { btn.disabled = false; form.classList.remove('is-sending'); });
  });
})();
