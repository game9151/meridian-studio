// Builds /websites/ (hub) and /websites/<slug>/ from tools/niches.data.mjs.
// Run: node tools/build-niches.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { niches, offer } from './niches.data.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const DOMAIN = 'https://meridianstudio.example'; // FILL ME: real domain

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// escape, then highlight [PLACEHOLDERS] so they can't be missed
const t = (s) => esc(s).replace(/\[([^\]]+)\]/g, '<mark class="fill">[$1]</mark>');

const mark = `<svg class="wordmark__mark" viewBox="0 0 32 32" aria-hidden="true" fill="none"><path class="stroke" d="M9 8 L3 16 L9 24" stroke-width="2" stroke-linecap="square"/><path class="stroke" d="M23 8 L29 16 L23 24" stroke-width="2" stroke-linecap="square"/><path class="stroke" d="M16 4 L16 28" stroke-width="2" stroke-linecap="square"/></svg>`;

const head = ({ title, description, path, jsonld }) => `<!doctype html>
<html lang="en-AU" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow"><!-- FILL ME: remove when the domain is live -->
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${DOMAIN}${path}">
<meta name="theme-color" content="#f2efe8">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Meridian Studio">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${DOMAIN}${path}">
<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/assets/fonts/archivo-expanded.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/inter-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/styles.css">
<link rel="stylesheet" href="/niche.css">
<script>document.documentElement.classList.remove('no-js');document.documentElement.classList.add('js');</script>
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
</head>
<body class="niche">
<a class="sr-only" href="#main">Skip to content</a>
<header class="nav" id="nav">
  <div class="wrap nav__in">
    <a class="wordmark" href="/" aria-label="Meridian Studio home">${mark}<span class="wordmark__text">Meridian<span>&nbsp;Studio</span></span></a>
    <nav class="nav__links" aria-label="Primary">
      <a class="link" href="/websites/">By trade</a>
      <a class="link" href="/#work">Work</a>
      <a class="link" href="/#packages">Packages</a>
    </nav>
    <a class="button nav__cta" href="#enquire">Ask about a site</a>
    <a class="button nav__menu-btn" href="#enquire">Enquire</a>
  </div>
</header>
<main id="main">
`;

const foot = `</main>
<footer class="footer footer--short" aria-labelledby="footer-head">
  <div class="wrap footer__top">
    <div class="footer__notes">
      <p><b>Meridian Studio</b><br>Websites for local business</p>
      <p><b>Where</b><br>Sydney · Australia-wide</p>
      <p><b>Reply time</b><br>Within one business day</p>
    </div>
    <a class="footer__top-link link" href="#main">Back to top &uarr;</a>
  </div>
  <div class="wrap footer__big">
    <h2 class="sr-only" id="footer-head">Get in touch</h2>
    <a class="footer__email" href="mailto:officialmeridianstudio@gmail.com">officialmeridian<wbr>studio@gmail.com</a>
  </div>
  <div class="wrap footer__meta">
    <nav aria-label="Footer">
      <a href="/websites/conveyancers/">Conveyancers</a>
      <a href="/websites/accountants/">Accountants</a>
      <a href="/websites/tree-services/">Tree services</a>
      <a href="/privacy.html">Privacy</a>
    </nav>
    <span>Sydney · &copy; 2026</span>
  </div>
</footer>
<script src="/main.js" defer></script>
<script src="/niche-motion.js" defer></script>
<script src="/niche.js" defer></script>
</body>
</html>
`;

const ledger = (n) => `
      <dl class="offer">
        <div><dt>Website, built</dt><dd>${t(offer.build)} <span>one-off, fixed</span></dd></div>
        <div><dt>Care plan</dt><dd>${t(offer.care)} <span>a month, optional</span></dd></div>
        <div><dt>Live in</dt><dd>${t(offer.days)} business days <span>from your go-ahead</span></dd></div>
        <div><dt>You own</dt><dd>Every file <span>and your domain</span></dd></div>
      </dl>`;

const steps = [
  ['Same or next business day', 'I reply and ask for the few things listed here. A short call if you\'d like one.'],
  ['About two days later', 'You get a private preview link built with your name, prices and details. Nothing to pay yet.'],
  ['When you say yes', `You pay a ${'[DEPOSIT]'} deposit and tell me what to change. I make the changes the same week.`],
  [`Day ${offer.days}`, 'It goes live on your domain. You pay the balance once you\'ve seen it live.'],
  ['After that', 'Care plan if you want it. If not, the site and the files are yours to keep.'],
];

function nichePage(n) {
  const path = `/websites/${n.slug}/`;
  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Website design for ${n.nav.toLowerCase()}`,
    serviceType: 'Website design',
    areaServed: [{ '@type': 'City', name: 'Sydney' }, { '@type': 'Country', name: 'Australia' }],
    provider: { '@type': 'ProfessionalService', name: 'Meridian Studio', email: 'officialmeridianstudio@gmail.com', url: `${DOMAIN}/` },
    url: `${DOMAIN}${path}`,
  };
  const d = n.demo;
  const img = `/assets/img/niche/${d.img}`;
  return head({ title: n.title, description: n.description, path, jsonld }) + `
  <section class="nhero wrap" aria-labelledby="nhero-head">
    <p class="crumbs small"><a class="link" href="/websites/">Websites by trade</a> <span aria-hidden="true">/</span> ${esc(n.nav)}</p>
    <h1 class="display nhero__h" id="nhero-head"><span class="mask"><span>${t(n.h1[0])}</span></span> <span class="mask nhero__h2"><span>${t(n.h1[1])}</span></span></h1>
    <div class="nhero__row axis">
      <div class="nhero__copy" data-in>
        <p class="lead">${t(n.sub)}</p>
        <div class="nhero__cta">
          <a class="button" href="#enquire">Ask about a site</a>
          <span class="nhero__reply small">I reply within one business day.</span>
        </div>
      </div>
      <div class="nhero__offer" data-in>${ledger(n)}
        <a class="proofrow" href="${d.url}" target="_blank" rel="noopener">
          <span class="proofrow__img device"><span class="device__screen"><img src="${img}-desktop.jpg" width="1440" height="900" alt="" fetchpriority="high"></span></span>
          <span class="proofrow__txt"><b>See a working example &nearr;</b>${esc(d.name)}, a concept site I built for this trade.</span>
        </a>
      </div>
    </div>
  </section>

  <section class="ndemo section wrap" aria-labelledby="demo-head">
    <div class="axis ndemo__head">
      <p class="side sidenote">${esc(d.note)}</p>
      <div class="main">
        <h2 class="head" id="demo-head" data-rise>What you'd get, already built.</h2>
        <p class="ndemo__link" data-rise><a class="link" href="${d.url}" target="_blank" rel="noopener">Open ${esc(d.name)} in a new tab &nearr;</a> Try it on your phone too.</p>
      </div>
    </div>
    <div class="ndemo__stage" data-rise data-stage>
      <a class="ndemo__desk device" href="${d.url}" target="_blank" rel="noopener" aria-label="Open the ${esc(d.name)} demo"><div class="device__screen"><img src="${img}-desktop.jpg" width="1440" height="900" alt="${esc(d.altDesk)}" loading="lazy"></div></a>
      <a class="ndemo__phone device device--phone" href="${d.url}" target="_blank" rel="noopener" tabindex="-1" aria-hidden="true"><div class="device__screen"><img src="${img}-phone.jpg" width="508" height="1100" alt="${esc(d.altPhone)}" loading="lazy"></div></a>
    </div>
  </section>

  <section class="feats section wrap" aria-labelledby="feats-head">
    <div class="axis">
      <h2 class="head side" id="feats-head" data-rise>Built for how ${esc(n.nav.toLowerCase())} get work.</h2>
      <p class="lead main" data-rise>${t(n.featuresIntro)}</p>
    </div>
    <div class="feats__body axis">
      <figure class="spot side" data-rise>
        <img src="/assets/img/niche/${d.tool.src}" width="${d.tool.w}" height="${d.tool.h}" alt="${esc(d.tool.alt)}" loading="lazy">
        <figcaption class="small">${esc(d.tool.caption)}</figcaption>
      </figure>
      <div class="feats__list main">
${n.features.map(([h, b]) => `        <div class="feat" data-rise><h3 class="feat__h">${t(h)}</h3><p>${t(b)}</p></div>`).join('\n')}
      </div>
    </div>
  </section>

  <section class="price" aria-labelledby="price-head">
    <div class="wrap price__in">
      <h2 class="head" id="price-head" data-rise>One price, agreed up front.</h2>
      <div class="price__cols">
        <div class="price__col" data-rise>
          <p class="price__label">The website</p>
          <p class="price__fig">${t(offer.build)}</p>
          <p class="price__sub">One-off. Live in ${t(offer.days)} business days.</p>
          <ul class="ticks">${n.included.map((i) => `<li>${t(i)}</li>`).join('')}</ul>
        </div>
        <div class="price__col" data-rise>
          <p class="price__label">Care plan, optional</p>
          <p class="price__fig">${t(offer.care)}<span> / month</span></p>
          <p class="price__sub">Cancel any time. The site stays yours.</p>
          <ul class="ticks">${n.care.map((i) => `<li>${t(i)}</li>`).join('')}</ul>
        </div>
      </div>
      <a class="button button--light" href="#enquire">Ask about a site</a>
    </div>
  </section>

  <section class="next section wrap" aria-labelledby="next-head">
    <div class="axis">
      <div class="side">
        <h2 class="head" id="next-head" data-rise>What I need from you.</h2>
        <ul class="needs" data-rise>${n.need.map((i) => `<li>${t(i)}</li>`).join('')}</ul>
      </div>
      <div class="main">
        <h3 class="next__h" data-rise>What happens after you enquire</h3>
        <ol class="steps" data-steps>
${steps.map(([w, b]) => `          <li data-rise><span class="steps__when">${t(w)}</span><p>${t(b)}</p></li>`).join('\n')}
        </ol>
      </div>
    </div>
  </section>

  <section class="faq section wrap" id="faq" aria-labelledby="faq-head">
    <div class="faq__grid">
      <div class="faq__head">
        <h2 class="head" id="faq-head" data-rise>Questions ${esc(n.nav.toLowerCase())} ask.</h2>
        <p class="faq__sub sidenote" data-rise>Something else? Ask it in the form below.</p>
      </div>
      <div class="faq__list" data-rise>
${n.faq.map(([q, a]) => `        <details class="faq__item"><summary>${t(q)}<span class="faq__chev" aria-hidden="true"></span></summary><div class="faq__a"><p>${t(a)}</p></div></details>`).join('\n')}
      </div>
    </div>
  </section>

  <section class="contact section wrap" id="enquire" aria-labelledby="enquire-head">
    <div class="contact__grid">
      <div class="contact__left">
        <h2 class="contact__sentence" id="enquire-head" data-rise>Tell me about your ${esc(n.slug === 'tree-services' ? 'business' : 'practice')}. I'll send a preview.</h2>
        <dl class="contact__meta" data-rise>
          <div><dt>Email</dt><dd><a class="link" href="mailto:officialmeridianstudio@gmail.com">officialmeridianstudio@gmail.com</a></dd></div>
          <div><dt>Based in</dt><dd>Sydney, working Australia-wide</dd></div>
          <div><dt>Reply time</dt><dd>Within one business day</dd></div>
        </dl>
      </div>
      <div class="contact__right" data-rise>
        <form class="form" id="enquiry-form" action="/api/enquiry" method="POST" novalidate>
          <input type="hidden" name="niche" value="${esc(n.slug)}">
          <div class="hp" aria-hidden="true"><label>Leave this empty <input type="text" name="company_website" tabindex="-1" autocomplete="off"></label></div>
          <div class="form__row">
            <label class="field-label"><span>Your name <span class="req" aria-hidden="true">*</span></span>
              <input class="input" type="text" name="name" autocomplete="name" required maxlength="120">
            </label>
            <label class="field-label"><span>Business name</span>
              <input class="input" type="text" name="business" autocomplete="organization" maxlength="160">
            </label>
          </div>
          <div class="form__row">
            <label class="field-label"><span>Email <span class="req" aria-hidden="true">*</span></span>
              <input class="input" type="email" name="email" autocomplete="email" required maxlength="200">
            </label>
            <label class="field-label"><span>Phone</span>
              <input class="input" type="tel" name="phone" autocomplete="tel" maxlength="40">
            </label>
          </div>
          <label class="field-label"><span>Your current website, if you have one</span>
            <input class="input" type="text" name="site" inputmode="url" maxlength="300" placeholder="e.g. yourbusiness.com.au">
          </label>
          <label class="field-label"><span>Anything I should know?</span>
            <textarea class="textarea" name="message" rows="4" maxlength="4000"></textarea>
          </label>
          <p class="form__note">Your details are only used to reply to you about a website. They aren't shared or added to a mailing list. See the <a class="link" href="/privacy.html">privacy page</a>.</p>
          <button class="button form__submit" type="submit"><span class="form__label">Send enquiry</span><span class="form__dots" aria-hidden="true"><i></i><i></i><i></i></span><svg class="form__tick" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></button>
          <p class="form__status" id="form-status" role="status" aria-live="polite"></p>
        </form>
      </div>
    </div>
  </section>
` + foot;
}

function hubPage() {
  const path = '/websites/';
  const jsonld = {
    '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Websites by trade', url: `${DOMAIN}${path}`,
    hasPart: niches.map((n) => ({ '@type': 'WebPage', name: n.title, url: `${DOMAIN}/websites/${n.slug}/` })),
  };
  return head({
    title: 'Websites by trade: one fixed offer per type of business | Meridian Studio',
    description: 'Fixed-price websites built for one type of business at a time: Sydney conveyancers, accountants and tree services. Each with a working demo.',
    path, jsonld,
  }).replace('href="#enquire">Ask about a site', 'href="/#contact">Get a free preview').replace('href="#enquire">Enquire', 'href="/#contact">Free preview') + `
  <section class="hub wrap" aria-labelledby="hub-head">
    <div class="axis hub__head">
      <p class="side sidenote">Each page has a working demo, a fixed price and a list of exactly what's included.</p>
      <div class="main">
        <h1 class="display" id="hub-head">Websites built for one kind of business at a time.</h1>
        <p class="lead hub__lead">A conveyancer needs a fee calculator. A tree crew needs a quote form that takes photos. Pick your trade to see what yours would have.</p>
      </div>
    </div>
    <ul class="hub__list">
${niches.map((n) => `      <li class="hub__item" data-rise>
        <a class="hub__link" href="/websites/${n.slug}/">
          <span class="hub__media device"><span class="device__screen"><img src="/assets/img/niche/${n.demo.img}-desktop.jpg" width="1440" height="900" alt="" loading="lazy"></span></span>
          <span class="hub__text">
            <span class="hub__name">${esc(n.nav)}</span>
            <span class="hub__line">${esc(n.hubLine)}</span>
            <span class="hub__meta">Demo: ${esc(n.demo.name)} · <mark class="fill">${esc(offer.build)}</mark> · <span class="nowrap">live in <mark class="fill">${esc(offer.days)}</mark> days</span></span>
          </span>
          <span class="hub__go" aria-hidden="true">&rarr;</span>
        </a>
      </li>`).join('\n')}
    </ul>
    <p class="hub__else">Not on the list? The <a class="link" href="/#packages">standard packages</a> work for any local business, and you can <a class="link" href="/#contact">ask for a free preview</a>.</p>
  </section>
` + foot.replace('<script src="/niche.js" defer></script>\n', '');
}

const out = (p, html) => { const f = join(root, p); mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, html); console.log('wrote', p); };
out('websites/index.html', hubPage());
for (const n of niches) out(`websites/${n.slug}/index.html`, nichePage(n));
