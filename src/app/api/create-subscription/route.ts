import { NextApiRequest, NextApiResponse } from 'next';
import Razorpay from 'razorpay';
import { connect } from '@/lib/db';
import User from '@/lib/models/user.model';
import Subscription from '@/lib/models/subscription.model';
import { NextResponse } from 'next/server';
import { NextRequest} from "next/server";
import { getAuth } from "@clerk/nextjs/server";
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
  console.log(success, pending, limit, reset, remaining);
  
  if (!success) {
    return NextResponse.json(createError(429, 'Too many requests'));
  }
  const { userId:clerk } = getAuth(req);

  if (!clerk) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
    // const body = req.body; 
    const { userId, planType, duration } = await req.json();

    if (!userId || !planType || !duration) {
        throw new Error('Invalid request');
      }

      try {
        const user = await User.findById(userId);
        if (!user) return NextResponse.json({ message: 'User not found' },{status: 404});

        if (user.subscription.isActive) {
          return NextResponse.json(
            { message: 'User already has an active subscription' },
            { status: 400 }
          );
        }

        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID || '',
            key_secret: process.env.RAZORPAY_KEY_SECRET || '',
          });

          let planId: string="";
          let amount: number;
      
          switch (planType) {
            case 'Basic':
              amount = 0;
              break;
            case 'Standard':
              amount = duration === 'Monthly' ? 49900 : 499900; // Amount in paise
              planId = duration == 'Monthly' ? process.env.STARTUP_MONTHLY_SUBSCRIPTION_PLAN_ID || '' : process.env.STARTUP_YEARLY_SUBSCRIPTION_PLAN_ID || '';
              break;
            case 'Premium':
              amount = duration === 'Monthly' ? 99900 : 999900; // Amount in paise
              planId = duration == 'Monthly' ? process.env.ENTERPRISE_MONTHLY_SUBSCRIPTION_PLAN_ID || '' : process.env.ENTERPRISE_YEARLY_SUBSCRIPTION_PLAN_ID || '';
              break;
            default:
              return NextResponse.json({ message: 'Invalid plan type' },{status: 400});
          }

          if (planType !== 'Basic') {
            // Create subscription in Razorpay
            console.log('Creating subscription in Razorpay');
            console.log('Plan ID:', planId);
            const subscription = await razorpay.subscriptions.create({
              plan_id: planId,
              customer_notify: 1,
              total_count: duration === 'Monthly' ? 12 : 1, // Adjust based on duration
            });
        let endDate = new Date();
        if (duration === 'Monthly') {
          endDate.setMonth(endDate.getMonth() + 1);
        } else {
          endDate.setFullYear(endDate.getFullYear() + 1);
        }

        // Calculate barter points
      const barterPoints = Math.floor(amount / 100); // 1 INR = 1 barter point

      // Create subscription in database
      const newSubscription = new Subscription({
        userId: user._id,
        planType,
        duration,
        barterPoints,
        startDate: new Date(),
        endDate,
        paymentStatus: 'Pending',
        razorpaySubscriptionId: subscription.id,
      });

      // user.subscription = {
      //   plan: planType,
      //   isActive: true,
      //   startDate: new Date(),
      //   endDate,
      // };

      // console.log('Saving subscription and user');
      // await user.save();

      await newSubscription.save();
      return NextResponse.json({
        razorpaySubscriptionId: subscription.id,
        planName: planType,
      },
      {
        status: 200,
      }
    );
         }else{
        // user.subscription = {
        //     plan: 'Free',
        //     isActive: true,
        //     startDate: new Date(),
        //     endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        //   };
        //   await user.save();
    
          return NextResponse.json({
            message: 'Currently Subscribed to Free Plan',
          },{
            status: 200, 
          });
        }
    }
     catch (error) {
        console.error('Error creating subscription:', error);
       return NextResponse.json({ message: 'Internal Server Error' },{
        status: 500,
       });
      }
}