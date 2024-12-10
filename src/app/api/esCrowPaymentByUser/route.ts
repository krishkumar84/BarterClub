import { connect } from '@/lib/db';
import { NextResponse,NextRequest } from 'next/server';
import EscrowTransaction from '@/lib/models/esCrow.model';
import { ObjectId } from 'mongodb';

connect();
export async function GET(req:NextRequest){
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
            status: 'pending_payment'
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