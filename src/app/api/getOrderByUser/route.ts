import Product from '@/lib/models/product.model';
import { connect } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import User from '@/lib/models/user.model'
import Order from '@/lib/models/order.model';
import { NextResponse } from 'next/server';

connect();

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = 4; // Number of items per page

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        const skip = (page - 1) * limit;
        const conditions = { buyer: userId };

        // Fetch paginated orders
        const orders = await Order.distinct('product')
            .find(conditions)
            .sort({ createdAt: 'desc' })
            .skip(skip)
            .limit(limit)
            .populate({
                path: 'product',
                model: Product,
                populate: {
                    path: 'owner',
                    model: User,
                    select: '_id Name email phone',
                },
            });

        // Count total number of distinct products in orders
        const totalOrders = await Order.distinct('product', conditions).countDocuments();

        // Calculate total pages
        const totalPages = Math.ceil(totalOrders / limit);

        return NextResponse.json({
            data: JSON.parse(JSON.stringify(orders)),
            currentPage: page,
            totalPages: totalPages,
            totalItems: totalOrders
        });

    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}