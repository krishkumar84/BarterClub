import { NextApiRequest, NextApiResponse } from 'next';
import Razorpay from 'razorpay';
import { connect } from '@/lib/db';
import User from '@/lib/models/user.model';
import Subscription from '@/lib/models/subscription.model';
import { NextResponse } from 'next/server';
import { NextRequest} from "next/server";
import {auth} from '@clerk/nextjs/server';

connect();


export async function POST(req:NextRequest, res:NextApiResponse) {


    // const body = req.body; 
    const { amountInINR } = await req.json();
    const { sessionClaims} = auth();
    const userId: string = sessionClaims?.userId as string;
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