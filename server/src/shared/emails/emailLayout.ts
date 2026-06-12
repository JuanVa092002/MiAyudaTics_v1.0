export interface EmailCta {
  label: string
  href: string
}

export type EmailAlertTone = 'info' | 'warning' | 'success'

export interface EmailAlert {
  tone: EmailAlertTone
  title: string
  body?: string
}

export interface EmailLayoutOptions {
  pageTitle: string
  icon: string
  recipientName: string
  introHtml: string
  cta?: EmailCta
  alert?: EmailAlert
  fallbackLink?: string
  footerNoteHtml?: string
}

export interface EmailContent {
  html: string
  text: string
}

export function getClientUrl(): string {
  return process.env.CLIENT_URL || 'http://localhost:5173'
}

export function getEmailFrom(): string {
  return (
    process.env.EMAIL_FROM ||
    process.env.EMAIL_USER ||
    process.env.EMAIL ||
    'MiAyudaTics <onboarding@brevo.com>'
  )
}

const ALERT_STYLES: Record<
  EmailAlertTone,
  { bg: string; border: string; accent: string; title: string; body: string }
> = {
  info: {
    bg: '#eff6ff',
    border: '#bfdbfe',
    accent: '#3b82f6',
    title: '#1e40af',
    body: '#1d4ed8',
  },
  warning: {
    bg: '#fff7ed',
    border: '#fed7aa',
    accent: '#f97316',
    title: '#9a3412',
    body: '#c2410c',
  },
  success: {
    bg: '#f0fdf4',
    border: '#bbf7d0',
    accent: '#22c55e',
    title: '#166534',
    body: '#15803d',
  },
}

function buildAlertHtml(alert: EmailAlert): string {
  const s = ALERT_STYLES[alert.tone]
  const bodyHtml = alert.body
    ? `<p style="margin:4px 0 0;color:${s.body};font-size:12px;">${alert.body}</p>`
    : ''
  return `
    <div style="background:${s.bg};
                border:1px solid ${s.border};
                border-left:4px solid ${s.accent};
                border-radius:8px;
                padding:14px 16px;
                margin:24px 0;">
      <p style="margin:0;color:${s.title};
                font-size:13px;font-weight:600;">
        ${alert.title}
      </p>
      ${bodyHtml}
    </div>`
}

function buildCtaHtml(cta: EmailCta): string {
  return `
    <div style="text-align:center;margin:32px 0;">
      <a href="${cta.href}"
         style="display:inline-block;
                background:#04324d;
                color:#ffffff !important;
                text-decoration:none;
                font-size:15px;
                font-weight:600;
                padding:14px 40px;
                border-radius:8px;
                letter-spacing:0.01em;">
        ${cta.label}
      </a>
    </div>`
}

function buildFallbackLinkHtml(link: string): string {
  return `
    <div style="margin-top:24px;padding-top:20px;
                border-top:1px solid #f1f5f9;">
      <p style="margin:0;color:#94a3b8;font-size:12px;">
        Si el botón no funciona, copia y pega este enlace:
      </p>
      <p style="margin:6px 0 0;word-break:break-all;">
        <a href="${link}"
           style="color:#04324d;font-size:12px;
                  text-decoration:underline;">
          ${link}
        </a>
      </p>
    </div>`
}

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export function buildEmailLayout(options: EmailLayoutOptions): EmailContent {
  const name = options.recipientName || 'usuario'
  const ctaHtml = options.cta ? buildCtaHtml(options.cta) : ''
  const alertHtml = options.alert ? buildAlertHtml(options.alert) : ''
  const fallbackHtml = options.fallbackLink
    ? buildFallbackLinkHtml(options.fallbackLink)
    : ''
  const footerNoteHtml = options.footerNoteHtml
    ? `<p style="margin:24px 0 0;color:#94a3b8;
              font-size:13px;line-height:1.5;">
        ${options.footerNoteHtml}
      </p>`
    : ''

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${options.pageTitle}</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;
             font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0"
         style="background:#f1f5f9;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0"
             style="max-width:600px;width:100%;">
        <tr>
          <td style="background:#04324d;border-radius:12px 12px 0 0;
                     padding:28px 40px;text-align:center;">
            <div style="width:40px;height:4px;background:#39a900;
                        border-radius:2px;margin:0 auto 16px;"></div>
            <p style="margin:0;color:rgba(255,255,255,0.6);
                      font-size:11px;letter-spacing:0.12em;
                      font-weight:600;text-transform:uppercase;">
              SENA · Centro de Teleinformática y Producción Industrial
            </p>
            <h1 style="margin:8px 0 0;color:#ffffff;
                       font-size:22px;font-weight:700;
                       letter-spacing:-0.02em;">
              AyudaTIC
            </h1>
          </td>
        </tr>
        <tr>
          <td style="background:#ffffff;padding:40px 40px 32px;">
            <div style="text-align:center;margin-bottom:24px;">
              <div style="display:inline-block;
                          background:#f0fdf4;
                          border:2px solid #dcfce7;
                          border-radius:50%;
                          width:64px;height:64px;
                          line-height:64px;
                          font-size:28px;text-align:center;">
                ${options.icon}
              </div>
            </div>
            <h2 style="margin:0 0 8px;color:#0f172a;
                       font-size:20px;font-weight:700;">
              Hola, <span style="color:#04324d;">${name}</span>
            </h2>
            <div style="margin:0 0 24px;color:#64748b;
                        font-size:15px;line-height:1.6;">
              ${options.introHtml}
            </div>
            ${ctaHtml}
            ${alertHtml}
            ${footerNoteHtml}
            ${fallbackHtml}
          </td>
        </tr>
        <tr>
          <td style="background:#f8fafc;
                     border-top:1px solid #e2e8f0;
                     border-radius:0 0 12px 12px;
                     padding:20px 40px;text-align:center;">
            <p style="margin:0;color:#94a3b8;font-size:12px;
                      line-height:1.6;">
              Este correo fue enviado automáticamente por
              <strong style="color:#04324d;">MiAyudaTIC</strong><br/>
              SENA · Centro de Teleinformática y Producción Industrial · Cauca<br/>
              © 2026 · No respondas a este correo
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

  const textParts = [
    `Hola, ${name}`,
    stripHtml(options.introHtml),
    options.cta ? `${options.cta.label}: ${options.cta.href}` : '',
    options.alert ? `${options.alert.title}${options.alert.body ? ` ${options.alert.body}` : ''}` : '',
    options.footerNoteHtml ? stripHtml(options.footerNoteHtml) : '',
    options.fallbackLink ? `Enlace alternativo: ${options.fallbackLink}` : '',
  ].filter(Boolean)

  return { html, text: textParts.join('\n\n') }
}
