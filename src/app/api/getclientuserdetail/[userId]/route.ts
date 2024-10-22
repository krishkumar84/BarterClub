

import { NextResponse } from 'next/server';
import User from '@/lib/models/user.model';
import mongoose from 'mongoose'; 

export async function GET(req: Request, { params }: { params: { userId: string } }) {
  const { userId } = params;

  console.log(userId)

  try {
    const user = await User.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(userId) }
      },
    ]);

    if (user.length === 0) {
      return NextResponse.json({ success: false, message: 'User not found' });
    }

    return NextResponse.json({ success: true, data: user[0] }); 
  } catch (error) {
    console.error('Error fetching user details with aggregation:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch user details' });
  }
}
