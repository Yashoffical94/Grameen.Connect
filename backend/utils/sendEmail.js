import nodemailer from 'nodemailer';

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export const sendEmail = async (options) => {
  const { to, subject, html } = options;

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('Email not sent (SMTP not configured):', { to, subject });
    return { success: true, message: 'Email logged (SMTP not configured)' };
  }

  try {
    const transporter = createTransporter();

    await transporter.sendMail({
      from: `"Grameen Connect" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, message: error.message };
  }
};

export const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

  const html = `
    <h2>Password Reset Request</h2>
    <p>You requested to reset your password for Grameen Connect.</p>
    <p>Click the link below to reset your password:</p>
    <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #22C55E; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">
      Reset Password
    </a>
    <p>Or copy and paste this link into your browser:</p>
    <p>${resetUrl}</p>
    <p>This link will expire in 1 hour.</p>
    <p>If you didn't request this, please ignore this email.</p>
    <hr>
    <p style="color: #666; font-size: 12px;">Grameen Connect - Connecting Rural Labour to Contractors</p>
  `;

  return sendEmail({ to: email, subject: 'Password Reset - Grameen Connect', html });
};

export const sendWelcomeEmail = async (email, name) => {
  const html = `
    <h2>Welcome to Grameen Connect, ${name}!</h2>
    <p>Thank you for joining India's largest rural labour marketplace.</p>
    <p>Get started by:</p>
    <ul>
      <li>Completing your profile</li>
      <li>Adding your skills and experience</li>
      <li>${email.includes('contractor') ? 'Posting your first job' : 'Browsing available jobs'}</li>
    </ul>
    <hr>
    <p style="color: #666; font-size: 12px;">Grameen Connect - Connecting Rural Labour to Contractors</p>
  `;

  return sendEmail({ to: email, subject: 'Welcome to Grameen Connect!', html });
};
