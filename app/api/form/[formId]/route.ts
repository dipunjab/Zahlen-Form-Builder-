import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import FormModel from "@/models/Form";

export async function GET(
  req: NextRequest,
  { params }: { params: { formId: string } }
) {
  await dbConnect();

  const { formId } = params;

  if (!formId) {
    return NextResponse.json({ success: false, error: "Missing form ID" }, { status: 400 });
  }

  try {
    const form = await FormModel.findById(formId);

    if (!form) {
      return NextResponse.json({ success: false, error: "Form not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, form });
  } catch (error) {
    console.error("Error fetching form by ID:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, context: { params: { formId: string } }) {
  const { params } = context;
  const formId = params.formId;

  await dbConnect();

  if (!formId) {
    return NextResponse.json({ success: false, error: "Missing form ID" }, { status: 400 });
  }

  try {
    const deletedForm = await FormModel.findByIdAndDelete(formId);

    if (!deletedForm) {
      return NextResponse.json({ success: false, error: "Form not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Form deleted successfully" });
  } catch (error) {
    console.error("Error deleting form:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
