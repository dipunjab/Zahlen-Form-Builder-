import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Form from "@/models/Form";

export async function PATCH(
  req: NextRequest,
  context: { params: { formId: string } }
) {
  await dbConnect();

  const { formId } = context.params;

  if (!formId) {
    return NextResponse.json(
      { success: false, error: "Form ID is required" },
      { status: 400 }
    );
  }

  try {
    const form = await Form.findById(formId);

    if (!form) {
      return NextResponse.json(
        { success: false, error: "Form not found" },
        { status: 404 }
      );
    }

    // ✅ Just toggle published status
    form.published = !form.published;

    await form.save();

    return NextResponse.json({
      success: true,
      message: `Form is now ${form.published ? "published" : "unpublished"}`,
      published: form.published,
    });
  } catch (error) {
    console.error("Error toggling publish:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
