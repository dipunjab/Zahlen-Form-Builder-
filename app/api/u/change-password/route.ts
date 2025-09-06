import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import UserModel from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    const { userId, oldPassword, newPassword } = await req.json();

    const user = await UserModel.findById(userId);
    if (!user || user.provider !== 'credentials') {
      return NextResponse.json({ success: false, message: 'User not found or not allowed' }, { status: 403 });
    }

    const valid = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ success: false, message: 'Old password is incorrect' }, { status: 401 });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.passwordHash = hashed;
    await user.save();

    return NextResponse.json({ success: true, message: 'Password updated' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: 'Error updating password' }, { status: 500 });
  }
}
