import nodemailer from 'nodemailer';

interface SendEmailParams {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export async function sendEmail({ to, subject, text, html }: SendEmailParams) {
  // Check if SMTP configuration is present
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('⚠️ SMTP configuration missing. Email will NOT be sent.');
    console.log('📨 [MOCK EMAIL] To:', to);
    console.log('📝 [MOCK EMAIL] Subject:', subject);
    console.log('📄 [MOCK EMAIL] Content:', text);
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    console.log('📧 Attempting to send email to:', to);
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      text,
      html,
    });

    console.log('✅ Email sent successfully to:', to);
    return true;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    // Log additional error details if available
    if ((error as any).response) {
      console.error('SMTP Response:', (error as any).response);
    }
    return false;
  }
}

/**
 * Sends an OTP code via email
 * @param email - Recipient email address
 * @param code - 6-digit OTP code
 * @returns true if sent successfully, false otherwise
 */
export async function sendOTPEmail(email: string, code: string): Promise<boolean> {
  const subject = 'Your BAILS Login Code';
  const text = `Your verification code is: ${code}\n\nThis code expires in 10 minutes.\n\nIf you didn't request this code, please ignore this email.`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background: #ffffff;
            border-radius: 8px;
            padding: 40px;
          }
          .code-box {
            background: #f8f9fa;
            border: 2px solid #6B46C1;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 30px 0;
          }
          .code {
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            color: #6B46C1;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            text-align: center;
            color: #6c757d;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1 style="color: #6B46C1;">BAILS</h1>
          <h2>Your Verification Code</h2>
          <p>You requested a login code for your BAILS account. Use the code below:</p>
          <div class="code-box">
            <div class="code">${code}</div>
          </div>
          <p><strong>This code expires in 10 minutes.</strong></p>
          <p>If you didn't request this code, you can safely ignore this email.</p>
          <div class="footer">
            <p>© 2024 BAILS. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return await sendEmail({ to: email, subject, text, html });
}

/**
 * Validates email format
 * @param email - Email address to validate
 * @returns true if valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

const ADMIN_EMAIL = 'sathishraj@doodlance.com';

/**
 * Sends a notification email to the admin
 * @param subject - Email subject
 * @param content - Email content (text)
 * @param html - Optional HTML content
 */
export async function sendAdminNotification(subject: string, content: string, html?: string): Promise<boolean> {
  return await sendEmail({
    to: ADMIN_EMAIL,
    subject: `[Admin Alert] ${subject}`,
    text: content,
    html: html || content.replace(/\n/g, '<br>')
  });
}
