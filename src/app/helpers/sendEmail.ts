import nodemailer from 'nodemailer';
import config from '../config/index.js';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (options: EmailOptions) => {
  const transporter = nodemailer.createTransport({
    host: config.email.SMTP_HOST,
    port: Number(config.email.SMTP_PORT),
    secure: false,
    auth: {
      user: config.email.SMTP_USER,
      pass: config.email.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"SOM App" <${config.email.SMTP_USER}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
  });
};