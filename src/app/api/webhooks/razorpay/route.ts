import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import Transaction from '@/lib/models/transaction.model';
import { connect } from '@/lib/db'; // Ensure you have a dbConnect utility
import User from '@/lib/models/user.model';
import Subscription from '@/lib/models/subscription.model';
import { NextResponse } from 'next/server';

export async function POST(req:NextApiRequest, res:NextApiResponse) {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || '';
    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');
    
    const razorpaySignature = req.headers['x-razorpay-signature'];

    if (digest !== razorpaySignature) {
      return NextResponse.json({ message: 'Invalid signature' });
    }
    const event = req.body.event;
    try {
        await connect();
    
        switch (event) {
          case 'payment.captured':
            {
              const payment = req.body.payload.payment.entity;
              const subscriptionId = payment.subscription_id;
    
              // Find the subscription in your database
              const subscription = await Subscription.findOne({ razorpaySubscriptionId: subscriptionId });
              if (!subscription) {
                console.error('Subscription not found for payment.captured');
                return NextResponse.json({ message: 'Subscription not found' },{status: 404});
              }
    
              // Update subscription status
              subscription.paymentStatus = 'Paid';
              await subscription.save();
    
              // Update user barter points
              const user = await User.findById(subscription.userId);
              if (user) {
                user.balance += subscription.barterPoints;
                user.purchasedPoints += subscription.barterPoints;
                user.subscription = {
                  plan: subscription.planType,
                  isActive: true,
                  startDate: subscription.startDate,
                  endDate: subscription.endDate,
                };
                // Create a transaction record
                const transaction = new Transaction({
                  userId: user._id,
                  amount: payment.amount / 100, // Convert paise to INR
                  transactionType: 'Purchase',
                  points: subscription.barterPoints,
                  razorpayPaymentId: payment.id,
                });
                await transaction.save();
                user.transactionHistory.push(transaction._id);
                await user.save();
              }
            }
            break;
    
          case 'subscription.activated':
            {
              const subscriptionData = req.body.payload.subscription.entity;
              const subscription = await Subscription.findOne({ razorpaySubscriptionId: subscriptionData.id });
              if (subscription) {
                subscription.paymentStatus = 'Paid';
                subscription.startDate = new Date(subscriptionData.start_at * 1000);
                subscription.endDate = new Date(subscriptionData.end_at * 1000);
                await subscription.save();
              }
            }
            break;
    
          case 'subscription.charged':
            {
              const subscriptionData = req.body.payload.subscription.entity;
              const payment = req.body.payload.payment.entity;
    
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
                    // Create a transaction record
                    const transaction = new Transaction({
                      userId: user._id,
                      amount: payment.amount / 100, // Convert paise to INR
                      transactionType: 'Purchase',
                      points: subscription.barterPoints,
                      razorpayPaymentId: payment.id,
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
            }
            break;
    
          case 'subscription.cancelled':
          case 'subscription.payment_failed':
            {
              const subscriptionData = req.body.payload.subscription.entity;
              const subscription = await Subscription.findOne({ razorpaySubscriptionId: subscriptionData.id });
              if (subscription) {
                subscription.paymentStatus = 'Failed';
                await subscription.save();
    
                // Optionally, notify the user about the cancellation/failure
                return NextResponse.json({ message: 'Subscription cancelled/payment failed' });
              }
            }
            break;
    
          default:
            console.log(`Unhandled event type ${event}`);
        }
    
        return NextResponse.json({ message: 'Webhook processed' },{status: 200});
      } catch (error) {
        console.error('Error processing webhook:', error);
        return NextResponse.json({ message: 'Error processing webhook' },{status: 500});
      }
    }