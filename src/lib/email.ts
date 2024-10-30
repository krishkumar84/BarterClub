import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

interface EmailParams {
  recipientEmail: string;
  subject: string;
  htmlContent: string;
}

export async function sendOrderNotificationEmail({ recipientEmail, subject, htmlContent }: EmailParams) {
  await transporter.sendMail({
    from: '"BarterClub" <no-reply@barterclub.com>',
    to: recipientEmail,                             
    subject: subject,                              
    html: htmlContent                             
  });
}
