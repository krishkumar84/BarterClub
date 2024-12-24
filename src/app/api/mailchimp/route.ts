import { NextRequest, NextResponse } from 'next/server'
import { redis } from "@/lib/ratelimit";
import { headers } from "next/headers";
import { Ratelimit } from "@upstash/ratelimit";
import createError from '@/lib/createError';
import { getAuth } from "@clerk/nextjs/server";

const ratelimit = new Ratelimit({ 
    redis: redis, 
    limiter: Ratelimit.fixedWindow(5, '100s'), 
  });

  
export async function POST(req: NextRequest, res: NextResponse) {
    const { userId:clerk } = getAuth(req);

  if (!clerk) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
    const ip = headers().get('x-real-ip') || req.headers.get('x-forwarded-for');
    const { success } = await ratelimit.limit(ip!);
    
    if (!success) {
      return NextResponse.json(createError(429, 'Too many requests'));
    }

    const {fullName, email, message} = await req.json();
    const API_KEY = process.env.MAILCHIMP_API_KEY;
    const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
    const DATACENTER = API_KEY?.split('-')[1];

    const url = `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`;

    try {
      const data = {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: fullName,
          EMAIL: email,
          LNAME: message,
        },
      };
    
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `apikey ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    
      if (response.status === 200 || response.status === 201) {
        return NextResponse.json({ message: response.statusText });
      } else {
        const errorData = await response.json();
        return NextResponse.json({ message: errorData.detail })
      }
        
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json({ message: 'Err sending mail' },{
            status: 500,
        });
        
    }

}