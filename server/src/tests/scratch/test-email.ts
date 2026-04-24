import { sendMail } from '../../shared/utils/handleEmail'

async function test() {
  console.log('Iniciando prueba de envío de correo con BREVO...')
  await sendMail({
    to: 'juanvalencia.dev@hotmail.com',
    subject: 'Prueba de MiAyudaTics - BREVO',
    html: '<h1>¡Funciona!</h1><p>Este es un correo de prueba enviado desde el sistema MiAyudaTics usando <b>Brevo (SMTP)</b>.</p>',
  })
  console.log('Prueba finalizada.')
}

test()

