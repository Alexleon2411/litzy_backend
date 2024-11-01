import { createTransport } from "../config/nodemailer.js";


export async function sendEmailVerification({name, email, token}){
  const transporter = createTransport(
    process.env.MAILTRAPHOST,
    process.env.MAILTRAPPORT,
    process.env.MAILTRAPUSER,
    process.env.MAILTRAPPASS
  )
  //enviar email
  const info = await transporter.sendMail({
    from: 'AppSalon <cuentas@appsalon.com>',
    to: email,
    subject: "AppSalon - confirmma tu cuenta",
    html: `<p>Hola ${name}, confirma tu cuenta en Litzy Estetica </p>
      <p style="margin-left: 5px;"> Tu cuenta esta casi lista, solo debes confirmarla en el siguiente enlace</p>
      <a style="background: blue; border-radious: 30%; color: white;" href="${process.env.FRONTEND_URL}/auth/confirmar-cuenta/${token}">Confirmar Cuenta </a>
      <p > Si Tu no has creado esta cuenta puedes ignorar este mensaje</p>
    `
  })
  console.log('mensaje enviado', info.messageId);
}



export async function sendEmailPasswordReset({name, email, token}){
  const transporter = createTransport(
    process.env.MAILTRAPHOST,
    process.env.MAILTRAPPORT,
    process.env.MAILTRAPUSER,
    process.env.MAILTRAPPASS
  )
  //enviar email
  const info = await transporter.sendMail({
    from: 'AppSalon <cuentas@appsalon.com>',
    to: email,
    subject: "AppSalon - Resetear tu contraseña",
    html: `<p>Hola ${name}, Restablecer tu contraseña </p>
      <p style="margin-left: 5px;"> sigue el siguiente enlace para generar una nueva contraseña: </p>
      <a style="background: blue; border-radious: 30%; color: white;" href="${process.env.FRONTEND_URL}/auth/olvide-password/${token}"> Restablecer Contraseña </a>
      <p > Si Tu no has realizado esta acción, puedes ignorar este mensaje</p>
    `
  })
  console.log('mensaje enviado', info.messageId);
}
