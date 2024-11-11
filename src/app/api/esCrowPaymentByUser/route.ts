import { connect } from '@/lib/db';
import { NextResponse } from 'next/server';
import {auth} from '@clerk/nextjs/server';
import EscrowTransaction from '@/lib/models/esCrow.model';
import { ObjectId } from 'mongodb';

connect();
export async function GET(req:Request){
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    // const { sessionClaims} = auth();
    // const userId: string = (sessionClaims?.userId as any)?.userId;

    if(!userId){
        return NextResponse.json({ message: 'User not found' });
    }

    const result = await EscrowTransaction.aggregate([
        {
          $match: {
            seller: new ObjectId(userId),
            status: 'payment_completed'
          }
        },
        {
          $group: {
            _id: null,
            totalAmountHeld: { $sum: '$amountHeld' }
          }
        }
      ]);

      console.log(result)
      
      const totalAmountHeld = result.length > 0 ? result[0].totalAmountHeld : 0;
    return NextResponse.json(totalAmountHeld);
}