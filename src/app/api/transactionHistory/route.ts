import { connect } from '@/lib/db';
import {auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import Transaction from '@/lib/models/transaction.model';

connect();
export async function GET() {
    const { sessionClaims } = auth();
    const userId = (sessionClaims?.userId as any)?.userId;
    console.log("TRANSACTION   ",userId);
    if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    try {
        const transactions = await Transaction.find({ userId }).sort({ date: -1 });
        // console.log("transactions",transactions);
        return NextResponse.json({ transactions }, { status: 200 });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
