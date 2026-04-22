import { Request, Response } from 'express'
import crypto from 'crypto'
import { sendMail } from '../utils/handleEmail'
import models from '../models'

const { usuarioModel } = models

function generateToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { correo } = req.body
    if (!correo) {
      res.status(400).send({ message: 'Correo electrónico es requerido' })
      return
    }

    const user = await usuarioModel.findOne({ correo })
    if (!user) {
      res.status(404).send({ message: 'Usuario no encontrado' })
      return
    }

    const token = generateToken()
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

    user.resetPasswordToken = hashedToken
    user.resetPasswordExpires = new Date(Date.now() + 3600000) // 1 hora
    await user.save()
    const baseUrl = process.env.CLIENT_URL || 'http://localhost:5173'
    const resetLink = `${baseUrl}/restablecerPassword/${token}`

    const htmlTemplate = `
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>Recuperación de Contraseña — AyudaTIC</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;
             font-family:'Segoe UI',Arial,sans-serif;">

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0"
         style="background:#f1f5f9;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0"
             style="max-width:600px;width:100%;">

        <!-- HEADER con color institucional -->
        <tr>
          <td style="background:#04324d;border-radius:12px 12px 0 0;
                     padding:28px 40px;text-align:center;">
            <!-- Barra verde decorativa -->
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

        <!-- BODY -->
        <tr>
          <td style="background:#ffffff;padding:40px 40px 32px;">

            <!-- Ícono candado -->
            <div style="text-align:center;margin-bottom:24px;">
              <div style="display:inline-block;
                          background:#f0fdf4;
                          border:2px solid #dcfce7;
                          border-radius:50%;
                          width:64px;height:64px;
                          line-height:64px;
                          font-size:28px;text-align:center;">
                🔐
              </div>
            </div>

            <!-- Saludo -->
            <h2 style="margin:0 0 8px;color:#0f172a;
                       font-size:20px;font-weight:700;">
              Hola, <span style="color:#04324d;">${user.nombre ?? 'usuario'}</span>
            </h2>
            <p style="margin:0 0 24px;color:#64748b;
                      font-size:15px;line-height:1.6;">
              Recibimos una solicitud para restablecer la contraseña
              de tu cuenta en <strong>AyudaTIC</strong>.
              Si fuiste tú, haz clic en el botón a continuación.
            </p>

            <!-- CTA Button -->
            <div style="text-align:center;margin:32px 0;">
              <a href="${resetLink}"
                 style="display:inline-block;
                        background:#04324d;
                        color:#ffffff !important;
                        text-decoration:none;
                        font-size:15px;
                        font-weight:600;
                        padding:14px 40px;
                        border-radius:8px;
                        letter-spacing:0.01em;">
                Restablecer contraseña
              </a>
            </div>

            <!-- Aviso expiración -->
            <div style="background:#fff7ed;
                        border:1px solid #fed7aa;
                        border-left:4px solid #f97316;
                        border-radius:8px;
                        padding:14px 16px;
                        margin:24px 0;">
              <p style="margin:0;color:#9a3412;
                        font-size:13px;font-weight:600;">
                ⏱ Este enlace expira en <strong>1 hora</strong>.
              </p>
              <p style="margin:4px 0 0;color:#c2410c;font-size:12px;">
                Si ya expiró, solicita uno nuevo desde la página de inicio de sesión.
              </p>
            </div>

            <!-- Ignorar -->
            <p style="margin:24px 0 0;color:#94a3b8;
                      font-size:13px;line-height:1.5;">
              Si no solicitaste este cambio, puedes ignorar este correo.
              Tu contraseña actual permanecerá sin cambios.
            </p>

            <!-- Fallback URL -->
            <div style="margin-top:24px;padding-top:20px;
                        border-top:1px solid #f1f5f9;">
              <p style="margin:0;color:#94a3b8;font-size:12px;">
                Si el botón no funciona, copia y pega este enlace:
              </p>
              <p style="margin:6px 0 0;word-break:break-all;">
                <a href="${resetLink}"
                   style="color:#04324d;font-size:12px;
                          text-decoration:underline;">
                  ${resetLink}
                </a>
              </p>
            </div>
          </td>
        </tr>

        <!-- FOOTER -->
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
</html>
`

    await sendMail({
      from: process.env.EMAIL_USER,
      to: user.correo,
      subject: 'Recuperación de Contraseña — AyudaTIC',
      text: `Hola ${user.nombre ?? 'usuario'}, restablece tu contraseña en: ${resetLink}`,
      html: htmlTemplate,
    })

    res.send({ message: 'Correo electrónico enviado' })
  } catch (_error) {
    res.status(500).send({ message: 'Error al enviar el correo electrónico' })
  }
}
