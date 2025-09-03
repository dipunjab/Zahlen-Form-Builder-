import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ResponseForm from "@/models/ResponseForm";

export async function GET(
  req: Request,
  { params }: any
) {
  await dbConnect();

  try {
    const { formId } = await params;

    const responseCount = await ResponseForm.countDocuments({
      formId: formId,
    });

    return NextResponse.json({
      success: true,
      count: responseCount,
    });
  } catch (error) {
    console.error("Error getting response count:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to get response count",
      },
      { status: 500 }
    );
  }
}
