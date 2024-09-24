import { connect } from '@/lib/db';
import {auth } from '@clerk/nextjs/server';
import User from '@/lib/models/user.model'
import { NextResponse } from 'next/server';

connect();
export async function GET(){
    const { sessionClaims} = auth();
    const userId = (sessionClaims?.userId as any)?.userId;
    console.log("userid hello",userId);
    try {
        const user = await User.findById(userId);
         if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });
    
         return NextResponse.json({ balance: user.balance }, { status: 200 });
      } catch (error) {
        console.error('Error fetching balance:', error);
         return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
      }
}