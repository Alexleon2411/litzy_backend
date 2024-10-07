import nodemailer from 'nodemailer'


// se hace una funcion porque se van a enviar diferentes tipos de email, para enviar y verificar la cuenta recuperar contraseñas y mucho mas
export function createTransport(host, port, user, pass){ /// los valores recividos como una funcion se inyectan automaticamente en las variables interna de la funcion
  return  nodemailer.createTransport({
    host,
    port,
    auth: {
      user,
      pass,
    }
  });
}
