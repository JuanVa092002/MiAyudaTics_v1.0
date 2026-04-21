import { sendMail } from '../utils/handleEmail'

async function test() {
  console.log('Iniciando prueba de envío de correo...')
  await sendMail({
    to: 'juan.pastasvalencia@hotmail.com',
    subject: 'Prueba de MiAyudaTics - Resend',
    html: '<h1>¡Funciona!</h1><p>Este es un correo de prueba enviado desde el sistema MiAyudaTics usando Resend.</p>',
  })
  console.log('Prueba finalizada.')
}

test()
