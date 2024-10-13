import { NextResponse } from 'next/server';
import User from '@/lib/models/user.model'; 

export async function GET() {
  try {
    const users = await User.find()
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch users' });
  }
}
