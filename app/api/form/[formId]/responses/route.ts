
import dbConnect from "@/lib/dbConnect";
import ResponseForm from "@/models/ResponseForm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { formId: string } }
) {
  try {
    await dbConnect();
    const { formId } = params;

    const responses = await ResponseForm.find({ formId }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: responses });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to get responses" }, { status: 500 });
  }
}


export async function DELETE(
  req: NextRequest,
  { params }: { params: { formId: string } }
) {
  try {
    await dbConnect();
    const { formId } = params;

    await ResponseForm.deleteMany({ formId });

    return NextResponse.json({ success: true, message: "All responses deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to delete responses" }, { status: 500 });
  }
}
