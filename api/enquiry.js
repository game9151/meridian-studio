// Vercel function: niche-page enquiries -> email to AJ via Gmail SMTP.
// Env vars (set in Vercel, never in the repo):
//   GMAIL_USER          officialmeridianstudio@gmail.com
//   GMAIL_APP_PASSWORD  a Google app password for that account
//   ENQUIRY_TO          optional, defaults to GMAIL_USER
import nodemailer from 'nodemailer';

const NICHES = new Set(['conveyancers', 'accountants', 'tree-services', 'other']);
const clip = (v, n) => String(v ?? '').trim().slice(0, n);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method' });
  }
  const b = typeof req.body === 'string' ? safeJson(req.body) : (req.body || {});

  // honeypot: bots fill every field; pretend it worked
  if (b.company_website) return res.status(200).json({ ok: true });

  const f = {
    niche: NICHES.has(b.niche) ? b.niche : 'unknown',
    name: clip(b.name, 120),
    business: clip(b.business, 160),
    email: clip(b.email, 200),
    phone: clip(b.phone, 40),
    site: clip(b.site, 300),
    message: clip(b.message, 4000),
  };
  if (!f.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) {
    return res.status(400).json({ error: 'name and email required' });
  }

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return res.status(503).json({ error: 'not configured' });

  const transport = nodemailer.createTransport({ service: 'gmail', auth: { user, pass } });
  const text = [
    `New enquiry from the ${f.niche} page`,
    '',
    `Name:     ${f.name}`,
    `Business: ${f.business || '-'}`,
    `Email:    ${f.email}`,
    `Phone:    ${f.phone || '-'}`,
    `Site:     ${f.site || '-'}`,
    '',
    f.message || '(no message)',
  ].join('\n');

  try {
    await transport.sendMail({
      from: `Meridian Studio website <${user}>`,
      to: process.env.ENQUIRY_TO || user,
      replyTo: `${f.name.replace(/[<>"\r\n]/g, '')} <${f.email}>`,
      subject: `Enquiry (${f.niche}): ${(f.business || f.name).replace(/[\r\n]/g, ' ')}`,
      text,
    });
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('[enquiry] send failed', e && e.message);
    return res.status(502).json({ error: 'send failed' });
  }
}

function safeJson(s) { try { return JSON.parse(s); } catch { return {}; } }
