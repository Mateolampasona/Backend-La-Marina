import * as dotenv from 'dotenv';

dotenv.config({
  path: '.env.development',
});

const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const FrontUrl = process.env.FRONT_URL;

function addSignature(content: string): string {
  return `
    ${content}
    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
    <p style="font-family: Arial, sans-serif; font-size: 14px; color: #555;">
      👋 Saludos,<br>
      <strong style="color: #FF69B4;">El equipo de La Marina</strong> <span style="color: #FF69B4;">❤️</span><br>
      <a href="https://www.instagram.com/lamarina_sanjuann/" style="color: #FF69B4; text-decoration: none;">📸 Instagram</a> |
      <a href="https://www.facebook.com/lamarina.ok/" style="color: #FF69B4; text-decoration: none;">📘 Facebook</a><br>
      <span style="font-size: 12px; color: #777;">© 2024 La Marina. Todos los derechos reservados.</span>
    </p>
  `;
}

function generateEmailContent(title: string, body: string): string {
  return addSignature(`
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
      <div style="background-color: #FF69B4; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">${title} 🎉</h1>
      </div>
      <div style="padding: 20px; font-size: 16px;">
        ${body}
      </div>
      <div style="background-color: #ffe6e6; color: #777; padding: 10px; text-align: center; font-size: 14px;">
        <p style="margin: 0;">✨ Gracias por confiar en <strong style="color: #FF69B4;">La Marina</strong>. ✨</p>
      </div>
    </div>
  `);
}

export const sendWelcomeEmail = async (email: string, name: string) => {
  const subject = '¡Bienvenido a La Marina! ❤️';
  const body = `
    <p>Hola <strong>${name}</strong> 👋,</p>
    <p>Gracias por registrarte en <strong style="color: #FF69B4;">La Marina</strong>. <span style="color: #FF69B4;">❤️</span> Nos encanta que formes parte de nuestra comunidad. Aquí encontrarás los mejores productos de bazar y limpieza. 🧽✨</p>
    <p>🌟 Visítanos en nuestras redes sociales para enterarte de nuestras novedades. 🌟</p>
    <p><a href="https://www.lamarina.com" style="color: #FF69B4;">Visita nuestra página web</a></p>
  `;

  const htmlContent = generateEmailContent('¡Bienvenido a La Marina! ❤️', body);
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    html: htmlContent,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}`);
  } catch (error) {
    console.error(`Error sending email to ${email}:`, error);
  }
};

export const sendPasswordResetEmail = async (
  email: string,
  name: string,
  password: string,
) => {
  const subject = 'Recupera tu contraseña 🔑';
  const body = `
    <p>Hola ${name}👋,</p>
    <p>Tu nueva contraseña es: <strong>${password}</strong></p>
    <p>Haz clic en el siguiente enlace para modificar tu contraseña:</p>
    <p><a href=${FrontUrl} style="color: #FF69B4; text-decoration: none; font-weight: bold;">🔗 Modificar contraseña</a></p>
    <p>Si no solicitaste este cambio, ignora este correo.</p>
  `;

  const htmlContent = generateEmailContent('Recupera tu contraseña 🔑', body);
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    html: htmlContent,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${email} 📧`);
  } catch (error) {
    console.error(`Error sending password reset email to ${email}:`, error);
  }
};

export const sendPasswordSetEmail = async (email: string, setLink: string) => {
  const subject = 'Asigna tu contraseña ✍️';
  const body = `
    <p>Hola 👋,</p>
    <p>Es necesario que configures tu contraseña para acceder a tu cuenta. Haz clic en el siguiente enlace para asignarla:</p>
    <p><a href="${setLink}" style="color: #FF69B4; text-decoration: none; font-weight: bold;">🔗 Asignar contraseña</a></p>
  `;

  const htmlContent = generateEmailContent('Asigna tu contraseña ✍️', body);
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    html: htmlContent,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Password set email sent to ${email}`);
  } catch (error) {
    console.error(`Error sending password set email to ${email}:`, error);
  }
};

export const sendBanNotificationEmail = async (
  email: string,
  name: string,
  reason: string,
) => {
  const subject = 'Cuenta suspendida 🚫';
  const body = `
    <p>Hola ${name}👋,</p>
    <p>Tu cuenta ha sido suspendida debido a la siguiente razón:</p>
    <blockquote style="color: #FF69B4; font-style: italic;">${reason}</blockquote>
    <p>Si crees que esto fue un error, por favor contáctanos.</p>
  `;

  const htmlContent = generateEmailContent('Cuenta suspendida 🚫', body);
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    html: htmlContent,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Ban notification email sent to ${email}`);
  } catch (error) {
    console.error(`Error sending ban notification email to ${email}:`, error);
  }
};

export const sendUnbanNotificationEmail = async (
  email: string,
  name: string,
) => {
  const subject = 'Cuenta restaurada ✅';
  const body = `
    <p>Hola 👋,</p>
    <p>Nos complace informarte que tu cuenta ha sido restaurada y puedes volver a utilizar nuestros servicios.</p>
    <p>Gracias por confiar en <strong style="color: #FF69B4;">La Marina</strong>.</p>
  `;

  const htmlContent = generateEmailContent('Cuenta restaurada ✅', body);
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    html: htmlContent,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Unban notification email sent to ${email}`);
  } catch (error) {
    console.error(`Error sending unban notification email to ${email}:`, error);
  }
};

export const sendContactFormToAdmins = async (
  name: string,
  email: string,
  subject: string,
  message: string,
) => {
  const admins = ['mateolampasona7@gmail.com'];
  const Subject = `Nuevo mensaje de ${name} 📬`;
  const body = `
    <p>Nombre: ${name}</p>
    <p>Email: ${email}</p>
    <p>Asunto: ${subject}</p>
    <p>Mensaje: ${message}</p>
    `;
  const htmlContent = generateEmailContent(Subject, body);
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: admins.join(', '),
    Subject,
    html: htmlContent,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Contact form email sent to admins`);
  } catch (error) {
    console.error(`Error sending contact form email to admins:`, error);
  }
};

export const sendPurchaseMail = async (
  email: string,
  name: string,
  date: Date,
  total: number,
) => {
  const subject = 'Compra realizada en La Marina';
  const formattedDate = date.toLocaleDateString('es-AR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const body = `
    <p>Hola ${name}👋,</p>
    <p>Gracias por tu compra en La Marina. Aquí tienes los detalles de tu pedido:</p>
    <p>Fecha: ${formattedDate}</p>
    <p>Total: ${total}</p>
    <p>Tu pedido se entregará de 1 a 3 días hábiles.</p>
    <p>Si tienes alguna duda, no dudes en contactarnos al WhatsApp 2645724251.</p>
    <p><a href="https://wa.me/2645724251" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #ffffff; background-color: #25D366; text-decoration: none; border-radius: 5px;">Contactar por WhatsApp</a></p>
  `;

  const htmlContent = generateEmailContent(
    'Compra realizada en La Marina',
    body,
  );
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    html: htmlContent,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}`);
  } catch (error) {
    console.error(`Error sending email to ${email}:`, error);
  }
};
