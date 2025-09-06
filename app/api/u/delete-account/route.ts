import { NextRequest, NextResponse } from 'next/server';
import UserModel from '@/models/User';
import FormModel from '@/models/Form';
import ResponseForm from '@/models/ResponseForm';

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await req.json();

    // 🧹 Step 1: Find all form IDs owned by user
    const userForms = await FormModel.find({ userId }).select('_id');
    const formIds = userForms.map((form) => form._id);

    // 🧼 Step 2: Delete user, their forms, and responses
    await Promise.all([
      UserModel.findByIdAndDelete(userId),
      FormModel.deleteMany({ userId }),
      ResponseForm.deleteMany({ formId: { $in: formIds } }),
    ]);

    return NextResponse.json({ success: true, message: 'Account, forms, and responses deleted' });
  } catch (err) {
    console.error('Delete account error:', err);
    return NextResponse.json(
      { success: false, message: 'Error deleting account and data' },
      { status: 500 }
    );
  }
}
