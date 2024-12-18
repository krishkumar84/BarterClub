import { NextResponse } from 'next/server';
import User from '@/lib/models/user.model'; 
import { auth } from '@clerk/nextjs/server';
import { connect } from '@/lib/db';

connect();

export async function GET() {
  try {
    const { sessionClaims } = auth();
    const adminRole = (sessionClaims?.userId as { role: string }).role;
    if(!sessionClaims){
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (adminRole !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized access' }, { status: 403 });
    }
    const users = await User.find()
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch users' });
  }
}
