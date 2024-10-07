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

    const event = body.event;
    await connect();

    switch (event) {
      case 'payment.captured': {
        const payment = body.payload.payment.entity;
        const subscriptionId = payment.subscription_id ;
        console.log('Payment payload:', body.payload);
        console.log('Payment Captured Event:', payment);
        // console.log('Subscription ID:', subscriptionId);
        const orderId = payment.order_id;
        const invoiceId = payment.invoice_id;
        const description = payment.description;
        console.log('Order ID:', orderId);
        console.log('Invoice ID:', invoiceId);
        console.log('Description:', description);

        // if (!payment.subscription_id) {
        //   console.log('No subscription ID associated with this payment');
        //   return NextResponse.json({ message: 'No subscription ID' }, { status: 400 });
        // }

        // Find the subscription in your database
        const subscription = await Subscription.findOne({ razorpaySubscriptionId: subscriptionId });
        // if (!subscription) {
        //   console.error('Subscription not found for payment.captured');
        //   return NextResponse.json({ message: 'Subscription not found' }, { status: 404 });
        // }

        // console.log('Subscription:', subscription);

        // Update subscription status
        subscription.paymentStatus = 'Paid';
        await subscription.save();

        // Update user barter points
        const user = await User.findById(subscription.userId);
        if (user) {
          user.balance += subscription.barterPoints;
          user.purchasedPoints += subscription.barterPoints;
          user.subscription.isActive = true;
          user.subscription.plan = subscription.planType;
          // user.subscription = {
          //   plan: subscription.planType,
          //   isActive: true,
          //   startDate: subscription.startDate,
          //   endDate: subscription.endDate,
          // };

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
        break;
      }

      case 'payment.failed': {
        console.error('Payment failed');
        return NextResponse.json({ message: 'Payment failed' }, { status: 400 });
      }

      case 'subscription.activated': {
        const subscriptionData = body.payload.subscription.entity;
        const subscription = await Subscription.findOne({ razorpaySubscriptionId: subscriptionData.id });
        if (subscription) {
          subscription.paymentStatus = 'Paid';
          subscription.startDate = new Date(subscriptionData.start_at * 1000);
          subscription.endDate = new Date(subscriptionData.end_at * 1000);
          await subscription.save();
        }
        break;
      }

      case 'subscription.charged': {
        const subscriptionData = body.payload.subscription.entity;
        const payment = body.payload.payment.entity;

        const subscription = await Subscription.findOne({ razorpaySubscriptionId: subscriptionData.id });
        if (subscription) {
          if (payment.status === 'captured') {
            subscription.paymentStatus = 'Paid';
            subscription.endDate = new Date(subscriptionData.end_at * 1000);
            await subscription.save();

            // Update user barter points
            const user = await User.findById(subscription.userId);
            if (user) {
              user.balance += subscription.barterPoints;
              user.purchasedPoints += subscription.barterPoints;
              const orderId = payment.order_id;
             const invoiceId = payment.invoice_id;
             const description = payment.description;

              // Create a transaction record
              const transaction = new Transaction({
                // userId: user._id,
                // amount: payment.amount / 100, // Convert paise to INR
                // transactionType: 'Purchase',
                // points: subscription.barterPoints,
                // razorpayPaymentId: payment.id,
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
        const subscriptionData = body.payload.subscription.entity;
        const subscription = await Subscription.findOne({ razorpaySubscriptionId: subscriptionData.id });
        if (subscription) {
          subscription.paymentStatus = 'Cancelled';
          await subscription.save();
        }
        break;
      }

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
        console.log(`Unhandled event type ${event}`);
    }

    return NextResponse.json({ message: 'Webhook processed' }, { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ message: 'Error processing webhook' }, { status: 500 });
  }
}
