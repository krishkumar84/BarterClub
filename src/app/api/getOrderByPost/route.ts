import { connect } from '@/lib/db';
import {auth } from '@clerk/nextjs/server';
// import User from '@/lib/models/user.model'
import Order from '@/lib/models/order.model';
import { NextResponse } from 'next/server';
import {ObjectId} from 'mongodb';

connect();


export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get('postId');
    const searchString = searchParams.get('searchString');
    console.log(postId);
    const { sessionClaims} = auth();
    const sellerId = (sessionClaims?.userId as any)?.userId;
    console.log(sellerId);
    // if (!sellerId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try{
    const orders = await Order.aggregate([
        {
            $lookup: {
              from: 'users',
              localField: 'buyer',
              foreignField: '_id',
              as: 'buyer',
            },
          },
          {
            $unwind: '$buyer',
          },
          {
            $lookup: {
              from: 'products',
              localField: 'product',
              foreignField: '_id',
              as: 'product',
            },
          },
       { 
        $unwind: '$product'
        },
        {
            $project: {
              _id: 1,
              createdAt: 1,
              productTitle: '$product.title',
              productId: '$product._id',
              pointsExchanged: 1,
              status: 1,
              buyer: '$buyer.Name',
              buyerPhone: '$buyer.phone',
              buyerEmail: '$buyer.email',
              buyerAddress: '$buyer.Address',
            }
        },
        {
            $match: {
              $and: [
                { productId: postId ? new ObjectId(postId) : undefined },
                { buyer: { $regex: new RegExp(searchString || '', 'i') }},
              ],
            },
          },
          {
            $sort: { createdAt: -1 },
          },
      ])
        // console.log(orders);
        //   const ordersCount = await Order.distinct('event._id').countDocuments(conditions)

           return NextResponse.json({ data: JSON.parse(JSON.stringify(orders))});
        
        } catch (error) {
            console.error(error)
            return NextResponse.json({ error: (error as Error).message });
   }
}