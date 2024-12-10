

import { NextResponse,NextRequest } from 'next/server';
import User from '@/lib/models/user.model';
import mongoose from 'mongoose'; 
import { getAuth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  const { userId } = params;

  console.log(userId)
  if (!userId) {
    return NextResponse.json({ success: false, message: 'Invalid input data' });
  }
  // const { userId:clerk } = getAuth(req);

  //   if (!clerk) {
  //     return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  //   }

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
