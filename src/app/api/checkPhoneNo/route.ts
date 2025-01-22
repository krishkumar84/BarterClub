import { NextRequest, NextResponse } from 'next/server'
import { redis } from "@/lib/ratelimit";
import { headers } from "next/headers";
import { Ratelimit } from "@upstash/ratelimit";
import createError from '@/lib/createError';
import User from '@/lib/models/user.model';
import { connect } from '@/lib/db';
const ratelimit = new Ratelimit({ 
    redis: redis, 
    limiter: Ratelimit.fixedWindow(5, '100s'), 
  });

  connect();

export async function POST(req: Request, res: NextResponse) {
    const ip = headers().get('x-real-ip') || req.headers.get('x-forwarded-for');
    const { success } = await ratelimit.limit(ip!);
    
    if (!success) {
      return NextResponse.json(createError(429, 'Too many requests'));
    }
    const requestBody = await req.json();
    console.log(requestBody);
    const { phone }: any = requestBody;

    if (!phone) {
        return NextResponse.json(createError(400, 'Phone number is required'));
    }

    const findPhone = await User.findOne({
        phone: phone,
    });

    if (!findPhone) {
        return NextResponse.json(createError(200, 'Phone number is unique'));
    }

    return NextResponse.json(createError(400, 'Phone number already exists'));

}