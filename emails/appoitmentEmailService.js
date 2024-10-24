import { createTransport } from '../config/nodemailer.js'

export async function sendEmailNewAppoitment({date, time}) {
  const transporter = createTransport(
    process.env.MAILTRAPHOST,
    process.env.MAILTRAPPORT,
    process.env.MAILTRAPUSER,
    process.env.MAILTRAPPASS
  )

  const info = await transporter.sendMail({
    from: 'AppSalon <citas@appsalon.com>',
    to: 'admin@appsalon.com',
    subject: "AppSalon - Nueva cita",
    html: `<p>Hola Admin, tiene una nueva cita</p>
      <p style="margin-left: 5px;"> la cita sera el dia ${date} a las ${time} horas</p>

    `
  })
  console.log('mensaje enviado', info.messageId);
}

export async function sendEmailUpdateAppoitment({date, time}) {
  const transporter = createTransport(
    process.env.MAILTRAPHOST,
    process.env.MAILTRAPPORT,
    process.env.MAILTRAPUSER,
    process.env.MAILTRAPPASS
  )

  const info = await transporter.sendMail({
    from: 'AppSalon <citas@appsalon.com>',
    to: 'admin@appsalon.com',
    subject: "AppSalon -  Cita Actualizada",
    html: `<p>Hola Admin, Un usuario a mdificado una cita</p>
      <p style="margin-left: 5px;"> la cita sera el dia ${date} a las ${time} horas</p>
    `
  })
  console.log('mensaje enviado', info.messageId);
}


export async function sendEmailCanceledAppoitment({date, time}) {
  const transporter = createTransport(
    process.env.MAILTRAPHOST,
    process.env.MAILTRAPPORT,
    process.env.MAILTRAPUSER,
    process.env.MAILTRAPPASS
  )

  const info = await transporter.sendMail({
    from: 'AppSalon <citas@appsalon.com>',
    to: 'admin@appsalon.com',
    subject: "AppSalon -  Cita Cancelada",
    html: `<p>Hola Admin, Un usuario a cancelada su cita</p>
      <p style="margin-left: 5px;"> la cita  del dia ${date} a las ${time} horas fue cancelada</p>
    `
  })
  console.log('mensaje enviado', info.messageId);
}
