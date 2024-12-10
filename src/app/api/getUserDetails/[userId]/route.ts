// /app/api/users/[userId]/route.ts

import { NextResponse,NextRequest } from 'next/server';
import User from '@/lib/models/user.model';
import mongoose from 'mongoose';   // For ObjectId conversion

import { getAuth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  // const { userId:clerk } = getAuth(req);

  // if (!clerk) {
  //   return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  // }
  const { userId } = params;

  try {
    const user = await User.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(userId) }
      },

      // Lookup for transactions
      {
        $lookup: {
          from: 'transactions',
          localField: '_id',
          foreignField: 'userId',
          as: 'transactionHistory',
        },
      },

      // Lookup for subscriptions
      {
        $lookup: {
          from: 'subscriptions',
          localField: '_id',
          foreignField: 'userId',
          as: 'subscriptions',
        },
      },

      // Lookup for products
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'owner',  // Change from 'userId' to 'owner'
          as: 'products',
        },
      },

      // Optionally project fields
      {
        $project: {
          clerkId: 1,
          email: 1,
          Name: 1,
          phone: 1,
          photo: 1,
          Gst: 1,
          Address: 1,
          balance: 1,
          purchasedPoints: 1,
          discountPoints: 1,
          subscription: 1,
          transactionHistory: 1,
          subscriptions: 1,
          products: 1,
        },
      },
    ]);

    if (user.length === 0) {
      return NextResponse.json({ success: false, message: 'User not found' });
    }

    return NextResponse.json({ success: true, data: user[0] });  // Return the first (and only) result
  } catch (error) {
    console.error('Error fetching user details with aggregation:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch user details' });
  }
}
