import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Form from "@/models/Form";

export async function PATCH(
  req: NextRequest,
  {params}: any
) {
  await dbConnect();

    const formId =  params.formId;


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
