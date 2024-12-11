import * as dotenv from 'dotenv';

dotenv.config({
  path: '.env',
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

function addSignature(content: string): string {
  return `
    ${content}
    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
    <p style="font-family: Arial, sans-serif; font-size: 14px; color: #555;">
      👋 Saludos,<br>
      <strong style="color: #FF0000;">El equipo de La Marina</strong> ❤️<br>
      <a href="https://www.instagram.com/lamarina_sanjuann/" style="color: #FF0000; text-decoration: none;">📸 Instagram</a> |
      <a href="https://www.facebook.com/lamarina.ok/" style="color: #FF0000; text-decoration: none;">📘 Facebook</a><br>
      <span style="font-size: 12px; color: #777;">© 2024 La Marina. Todos los derechos reservados.</span>
    </p>
  `;
}

function generateEmailContent(title: string, body: string): string {
  return addSignature(`
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
      <div style="background-color: #FF0000; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">${title} 🎉</h1>
      </div>
      <div style="padding: 20px; font-size: 16px;">
        ${body}
      </div>
      <div style="background-color: #ffe6e6; color: #777; padding: 10px; text-align: center; font-size: 14px;">
        <p style="margin: 0;">✨ Gracias por confiar en <strong style="color: #FF0000;">La Marina</strong>. ✨</p>
      </div>
    </div>
  `);
}

export const sendWelcomeEmail = async (email: string, name: string) => {
  const subject = '¡Bienvenido a La Marina! ❤️';
  const body = `
    <p>Hola <strong>${name}</strong> 👋,</p>
    <p>Gracias por registrarte en <strong style="color: #FF0000;">La Marina</strong>. ❤️ Nos encanta que formes parte de nuestra comunidad. Aquí encontrarás los mejores productos de bazar y limpieza. 🧽✨</p>
    <p>🌟 Visítanos en nuestras redes sociales para enterarte de nuestras novedades. 🌟</p>
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
  password: string,
  name: string,
) => {
  const subject = 'Recupera tu contraseña 🔑';
  const body = `
    <p>Hola ${name}👋,</p>
    <p>Tu nueva contraseña es: <strong>${password}</strong></p>
    <p>Haz clic en el siguiente enlace para modificar tu contraseña:</p>
    <p><a href="/" style="color: #FF0000; text-decoration: none; font-weight: bold;">🔗 Modificar contraseña</a></p>
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
    <p><a href="${setLink}" style="color: #FF0000; text-decoration: none; font-weight: bold;">🔗 Asignar contraseña</a></p>
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
  reason: string,
) => {
  const subject = 'Cuenta suspendida 🚫';
  const body = `
    <p>Hola 👋,</p>
    <p>Tu cuenta ha sido suspendida debido a la siguiente razón:</p>
    <blockquote style="color: #FF0000; font-style: italic;">${reason}</blockquote>
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

export const sendUnbanNotificationEmail = async (email: string) => {
  const subject = 'Cuenta restaurada ✅';
  const body = `
    <p>Hola 👋,</p>
    <p>Nos complace informarte que tu cuenta ha sido restaurada y puedes volver a utilizar nuestros servicios.</p>
    <p>Gracias por confiar en <strong style="color: #FF0000;">La Marina</strong>.</p>
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
