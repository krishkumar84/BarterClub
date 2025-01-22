import { connect } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import User from '@/lib/models/user.model';
import { NextRequest, NextResponse } from 'next/server';
import { redis } from "@/lib/ratelimit";
import { headers } from "next/headers";
import { Ratelimit } from "@upstash/ratelimit";
import createError from '@/lib/createError';
import { sendOrderNotificationEmail } from '@/lib/email';

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.fixedWindow(5, '100s'),
});

connect();

export async function GET(req: NextRequest) {
  const ip = headers().get('x-real-ip') || req.headers.get('x-forwarded-for');
  const { success } = await ratelimit.limit(ip!);

  if (!success) {
    return NextResponse.json(createError(429, 'Too many requests'));
  }

  const { sessionClaims } = auth();
  const userId = (sessionClaims?.userId as any)?.userId;

  if (!userId) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const email = user.email;
    const name = user.name;

    const emailContent = `
      <!DOCTYPE html>
      <html lang="en">
       <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
              body {
             font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: #F4F4F9;
                  color: #333;
              }
              .email-container {
                  max-width: 600px;
                  margin: 0 auto;
                  background: white;
                  border-radius: 8px;
                  overflow: hidden;
                  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
              }
              .header {
                  background: url('https://pub-64c1419735be4ed8b942decb6af76e31.r2.dev/dd268454.png') center / cover no-repeat;
                  height: 200px;
                  position: relative;
              }
              .header-overlay {
                  position: absolute;
                  inset: 0;
                  background: linear-gradient(to bottom, #FD4677, #894BDE);
                  opacity: 0.1;
              }
              .content {
                  padding: 20px;
              }
              .content h1 {
                  font-size: 24px;
                  color: #FD4677;
              }
              .content p {
                  line-height: 1.6;
                  margin-bottom: 20px;
              }
              .button {
                  display: inline-block;
                  padding: 12px 20px;
                  background: linear-gradient(to bottom, #FD4677, #894BDE);
                  color: white;
                  text-decoration: none;
                  border-radius: 6px;
                  font-weight: bold;
                  text-align: center;
              }
              .footer {
                  text-align: center;
                  padding: 10px;
                  background: #F4F4F9;
                  font-size: 14px;
                  color: #555;
              }
              .footer a {
                  color: #FD4677;
                  text-decoration: none;
              }
          </style>
      </head>
      <body>
          <div class="email-container">
              <div class="header">
                  <div class="header-overlay"></div>
              </div>
              <div class="content">
                  <h1>Welcome to BarterClub, ${name}!</h1>
                  <p>
                      We're thrilled to have you as part of our community. BarterClub is where business owners, professionals,
                      and entrepreneurs exchange goods and services, build connections, and grow together.
                  </p>
                  <p>
                      Start exploring the community, discover amazing barter opportunities, and connect with like-minded
                      individuals. Click below to log in and begin your journey.
                  </p>
                  <a href="https://barterclub.com/login" class="button">Get Started</a>
              </div>
              <div class="footer">
                  <p>
                      Need help? Visit our <a href="https://barterclub.com/support">Support Center</a> or contact us at
                      <a href="mailto:support@barterclub.com">support@barterclub.com</a>.
                  </p>
              </div>
          </div>
      </body>
      </html>`;
      await sendOrderNotificationEmail({
        recipientEmail: email,
        subject: `Welcome to BarterClub, ${name}"`,
        htmlContent: emailContent,
      });

    return NextResponse.json({ 
        "message": "Welcome email sent successfully"
     }, { status: 200 });
  } catch (error) {
    console.error('Error fetching balance:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
