import { NextApiRequest, NextApiResponse } from 'next';
import Razorpay from 'razorpay';
// import { v4 as uuidv4 } from 'uuid';
import { connect } from '@/lib/db'; // Ensure you have a dbConnect utility
import User from '@/lib/models/user.model';
import Subscription from '@/lib/models/subscription.model';
import { NextResponse } from 'next/server';
import { NextRequest} from "next/server";

connect();


export async function POST(req:NextRequest, res:NextApiResponse) {

    // const body = req.body; 
    const { userId, planType, duration } = await req.json();

    if (!userId || !planType || !duration) {
        return NextResponse.json({ message: 'Missing required fields' });
      }

      try {
        const user = await User.findById(userId);
        if (!user) return NextResponse.json({ message: 'User not found' });

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

      await newSubscription.save();
      return NextResponse.json({
        razorpaySubscriptionId: subscription.id,
        planName: planType,
      },
      {
        status: 200, // You can change this to any status code you need
      }
    );
    }else{
        user.subscription = {
            plan: 'Free',
            isActive: true,
            startDate: new Date(),
            endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // 1 year validity
          };
          await user.save();
    
          return NextResponse.json({
            message: 'Subscribed to Free Plan',
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

    // const instance = new Razorpay({
    //     key_id: process.env.RAZORPAY_KEY_ID || "",
    //     key_secret: process.env.RAZORPAY_KEY_SECRET,
    // });

    // const result = await instance.subscriptions.create({
    //     plan_id: process.env.STARTUP_MONTHLY_SUBSCRIPTION_PLAN_ID || " ",
    //     total_count: 1,
    //     customer_notify: 1,
    //     addons: [],
    // });
    // return NextResponse.json(result);
}