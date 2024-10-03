import Product from '@/lib/models/product.model';
import { connect } from '@/lib/db';
import {auth } from '@clerk/nextjs/server';
import User from '@/lib/models/user.model'
import Order from '@/lib/models/order.model';
import { NextResponse } from 'next/server';

connect();


export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    console.log(userId);
    // const { sessionClaims} = auth();
    // const userId = (sessionClaims?.userId as any)?.userId;
    // console.log("userid hello",userId);

        const page = 1;
        const limit = 3;
        try{
            const conditions = { buyer: userId }
        
            const orders = await Order.distinct('product')
             .find(conditions)
             .sort({ createdAt: 'desc' })
             .limit(limit)
             .populate({
               path: 'product',
               model: Product,
               populate: {
                 path: 'owner',
                 model: User,
                 select: '_id Name email phone',
               },
             })

           const ordersCount = await Order.distinct('event._id').countDocuments(conditions)

           return NextResponse.json({ data: JSON.parse(JSON.stringify(orders)), totalPages: Math.ceil(ordersCount / limit) });
        
        } catch (error) {
            console.error(error)
            return NextResponse.json({ error: (error as Error).message });
        }
}