import Transaction from '@/lib/models/transaction.model';
import { NextResponse ,NextRequest} from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connect } from '@/lib/db';

connect();

export async function GET(req: NextRequest) {
  try {
    const { sessionClaims } = auth();
    if (!sessionClaims) {
      console.log('Unauthorized: No session claims');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const adminRole = (sessionClaims?.userId as { role: string }).role;
    if (adminRole !== 'admin') {
      console.log('Unauthorized access: Not an admin');
      return NextResponse.json({ message: 'Unauthorized access' }, { status: 403 });
    }

    const transactions = await Transaction.aggregate([
      {
        $lookup: {
          from: 'users',  
          localField: 'userId',  
          foreignField: '_id',  
          as: 'userDetails',     
        },
      },

      // Unwind the userDetails array (since $lookup returns an array)
      {
        $unwind: '$userDetails',
      },

      // Optionally project only the necessary fields
      {
        $project: {
          _id: 1,
          userId: 1,
          amount: 1,
          transactionType: 1,
          points: 1,
          razorpayPaymentId: 1,
          orderId: 1,
          description: 1,
          date: 1,
          createdAt: 1,
          updatedAt: 1,

          // Include user name and email from userDetails
          'userDetails.Name': 1,
          'userDetails.email': 1,
        },
      },

      // Optionally sort by date (or any other field)
      {
        $sort: { date: -1 }, // Sort by most recent transactions
      },
    ]);

    return NextResponse.json({ success: true, data: transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch transactions' });
  }
}
