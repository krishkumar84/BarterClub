import { NextRequest, NextResponse } from 'next/server';
import User from '@/lib/models/user.model';
import { connect } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ message: 'User ID not provided' }, { status: 400 });
    }

    await connect();

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (user.subscription.isActive) {
      const currentDate = new Date();

      if (user.subscription.endDate && currentDate > user.subscription.endDate) {
        // Subscription expired, update user subscription status
        user.subscription.isActive = false;
        user.subscription.plan = 'Free';
        user.subscription.startDate = null;
        user.subscription.endDate = null;

        // Save the updated user record
        await user.save();

        return NextResponse.json({
          message: 'Subscription expired, plan reverted to Free',
          subscriptionStatus: user.subscription,
        });
      } else {
        return NextResponse.json({
          message: 'Subscription is still active',
          subscriptionStatus: user.subscription,
        });
      }
    } else {
      return NextResponse.json({
        message: 'No active subscription found, default plan is Free',
        subscriptionStatus: user.subscription,
      });
    }
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
