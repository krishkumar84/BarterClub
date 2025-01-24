import crypto from 'crypto';
import Transaction from '@/lib/models/transaction.model';
import { connect } from '@/lib/db';
import User from '@/lib/models/user.model';
import Subscription from '@/lib/models/subscription.model';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || '';
  
  try {
    const body = await req.json();
    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(JSON.stringify(body));
    const digest = shasum.digest('hex');

    const razorpaySignature = req.headers.get('x-razorpay-signature');
    if (digest !== razorpaySignature) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 400 });
    }
    if (!body.payload || !body.payload.payment) {
      console.error('Invalid payload structure for payment.captured', body);
      return NextResponse.json({ 
        message: 'Invalid payload structure', 
        details: body 
      }, { status: 400 });
    }
    const event = body.event;
    console.log(event,"event")
    await connect();

    switch (event) {
      case 'payment.captured': {
        try {
        const payment = body.payload.payment.entity;
        console.log(payment,"payment new")
        const amountInINR = payment.amount / 100;
        const userId = payment.notes?.userId;
        console.log(userId,"userid")

        const user = await User.findById(userId);
       
        console.log(user,"user")
        console.log("here aagya")
        if (user) {
          user.balance += amountInINR;
          user.purchasedPoints += amountInINR;
          const description = payment.description;

          // Save transaction details
          const transaction = new Transaction({
            userId: user._id,
            amount: amountInINR,
            transactionType: 'Purchase',
            points: amountInINR,
            razorpayPaymentId: payment.id,
            description,
          });

          await transaction.save();
          user.transactionHistory.push(transaction._id);
          await user.save();
          console.log("transaction saved")
        }
      } catch (error) {
        console.error('Error handling Razorpay webhook:', error);
      }
      break;
   }

      case 'subscription.activated': {
        console.log("subscription.activated")
        const subscriptionData = body.payload.subscription.entity;
        const subscription = await Subscription.findOne({ razorpaySubscriptionId: subscriptionData.id });
        if (subscription) {
          subscription.paymentStatus = 'Paid';
          subscription.startDate = new Date(subscriptionData.start_at * 1000);
          // subscription.endDate = new Date(subscriptionData.end_at * 1000);
          await subscription.save();
        }
        break;
      }
      case 'subscription.charged': {
        console.log("subscription.charged")
        const subscriptionData = body.payload.subscription.entity;
        console.log(subscriptionData,"subscriptionData")
        const payment = body.payload.payment.entity;
        console.log(payment,"payment")
        const subscription = await Subscription.findOne({ razorpaySubscriptionId: subscriptionData.id });
        if (subscription) {
          if (payment.status === 'captured') {
            subscription.paymentStatus = 'Paid';
                await subscription.save();
                
                // Update user barter points
                const user = await User.findById(subscription.userId);
                if (user) {
                  user.balance += subscription.barterPoints;
                  user.purchasedPoints += subscription.barterPoints;
                  user.subscription.plan = subscription.planType;
                  user.subscription.isActive = true;
                  user.subscription.startDate = subscription.startDate;
                  user.subscription.endDate = subscription.endDate;
                  const orderId = payment.order_id;
                  const invoiceId = payment.invoice_id;
                  const description = payment.description;
                  
                  // Create a transaction record
                  const transaction = new Transaction({
                    userId: user._id,
                    amount: "Bonus", // Convert paise to INR
                    transactionType: 'Subscription',
                    points: subscription.barterPoints,
                    razorpayPaymentId:"Buy Subscription",
                    orderId: payment.id,
                    invoiceId,
                    description,
                  });
                  await transaction.save();
                  user.transactionHistory.push(transaction._id);
                  await user.save();
                }
              } else {
                subscription.paymentStatus = 'Failed';
                await subscription.save();
              }
            }
            break;
          }
          case 'subscription.cancelled': {
            console.log("subscription.cancelled")
            const subscriptionData = body.payload.subscription.entity;
            const subscription = await Subscription.findOne({ razorpaySubscriptionId: subscriptionData.id });
            if (subscription) {
              subscription.paymentStatus = 'Cancelled';
              await subscription.save();
            }
            break;
          }
          case 'payment.failed': {
            console.log("payment.failed")
            console.error('Payment failed');
            return NextResponse.json({ message: 'Payment failed' }, { status: 400 });
          }
          console.log("subscription.updated")
          case 'subscription.updated': {
            const subscriptionData = body.payload.subscription.entity;
            const subscription = await Subscription.findOne({ razorpaySubscriptionId: subscriptionData.id });
            if (subscription) {
              subscription.planType = subscriptionData.plan_id;
              await subscription.save();
            }
            break;
          }
          default:
            console.log("default")
            console.log(`Unhandled event type ${event}`);
          }          
          return NextResponse.json({ message: 'Webhook processed' }, { status: 200 });
        } catch (error:any) {
          console.error('Error processing webhook:', error);
          return NextResponse.json({ 
            message: 'Comprehensive webhook error', 
            error: error.message,
            stack: error.stack 
          }, { status: 500 });
        }
}
