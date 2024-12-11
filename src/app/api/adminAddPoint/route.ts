import { connect } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import User from '@/lib/models/user.model';
import Transaction from '@/lib/models/transaction.model';
import { NextResponse } from 'next/server';
import { redis } from "@/lib/ratelimit";
import { headers } from "next/headers";
import { Ratelimit } from "@upstash/ratelimit";
import createError from '@/lib/createError';

connect();

const ratelimit = new Ratelimit({ 
  redis: redis, 
  limiter: Ratelimit.fixedWindow(5, '100s'), 
});

export async function POST(req: Request) {
  const ip = headers().get('x-real-ip') || req.headers.get('x-forwarded-for');
  const { success, pending, limit, reset, remaining } = await ratelimit.limit(ip!);
  if (!success) {
    return NextResponse.json(createError(429, 'Too many requests'));
  }
  try {
    const { sessionClaims } = auth();
    console.log("herre")
    console.log(sessionClaims)
    const adminRole = (sessionClaims?.userId as { role: string }).role;
    const adminId = (sessionClaims?.userId as { userId: string }).userId;
    console.log(adminRole)
    console.log(adminId)

    if(!sessionClaims){
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (adminRole !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized access' }, { status: 403 });
    }

    const { userId, points,clerkId } = await req.json();

    console.log(userId, points,clerkId);

    if (!userId || !points || !clerkId || isNaN(points)) {
      return NextResponse.json({ message: 'Invalid input data' }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    console.log('user.balance:', user.balance, 'type:', typeof user.balance);
    console.log('points:', points, 'type:', typeof points);
    const balance = Number(user.balance);
    const bonusPoints = Number(points);    
    if (!isNaN(balance) && !isNaN(bonusPoints)) {
        user.balance = balance + bonusPoints;
        user.discountPoints += bonusPoints; // Assuming this is also numeric
      } else {
        console.error('Invalid data types for balance or points');
      }

    const bonusTransaction = new Transaction({
      userId: user._id,
      amount: 'Bonus',  
      transactionType: 'Bonus', 
      points: points, 
      razorpayPaymentId: 'admin_bonus', 
      description: `Admin granted ${points} bonus points.`, 
      orderId: 'admin_bonus' 
    });


    await bonusTransaction.save();

    user.transactionHistory.push(bonusTransaction._id);

    await user.save();

    return NextResponse.json({ message: 'Bonus points added successfully', user, transaction: bonusTransaction }, { status: 200 });
  } catch (error: any) {
    console.error('Error updating points:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
