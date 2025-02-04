import { NextApiRequest, NextApiResponse } from 'next';
import Razorpay from 'razorpay';
import { connect } from '@/lib/db';
import User from '@/lib/models/user.model';
import Subscription from '@/lib/models/subscription.model';
import { NextResponse } from 'next/server';
import { NextRequest} from "next/server";
import {auth} from '@clerk/nextjs/server';
import { redis } from "@/lib/ratelimit";
import { headers } from "next/headers";
import { Ratelimit } from "@upstash/ratelimit";
import createError from '@/lib/createError';

connect();

const ratelimit = new Ratelimit({ 
  redis: redis, 
  limiter: Ratelimit.fixedWindow(5, '100s'), 
});

export async function POST(req:NextRequest, res:NextApiResponse) {
  const ip = headers().get('x-real-ip') || req.headers.get('x-forwarded-for');
  const { success, pending, limit, reset, remaining } = await ratelimit.limit(ip!);
  // console.log(success, pending, limit, reset, remaining);
  
  if (!success) {
    return NextResponse.json(createError(429, 'Too many requests'));
  }

    // const body = req.body; 
    const { sessionClaims} = auth();
    const userId: string = (sessionClaims?.userId as any)?.userId;
    const { amountInINR } = await req.json();
    console.log("userid hello",userId);
    if(!userId){
      return NextResponse.json({ message: 'User not found' });
    }

    if (!userId || !amountInINR) {
        return NextResponse.json({ message: 'Missing required fields' });
      }

      try {
        const user = await User.findById(userId);
        if (!user) return NextResponse.json({ message: 'User not found' });

        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID || '',
            key_secret: process.env.RAZORPAY_KEY_SECRET || '',
          });

          const order = await razorpay.orders.create({
            amount: amountInINR * 100, // Amount in paise
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
            payment_capture: true, // Auto capture payment
          });
    
          return NextResponse.json({ orderId: order.id, keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID });
    }
     catch (error) {
        console.error('Error creating Razorpay order:', error);
       return NextResponse.json({ message: 'Internal Server Error' },{
        status: 500,
       });
      }
}