import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import Feedback from "@/models/Feedback";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);

    if (!session?.user?._id || !session.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { message } = await req.json();

    if (!message || message.trim() === "") {
      return new NextResponse("Feedback message cannot be empty", { status: 400 });
    }

    const feedback = await Feedback.create({
      userId: session.user._id,
      email: session.user.email, 
      message,
    });

    return NextResponse.json({ success: true, data: feedback });
  } catch (error) {
    console.error(error);
    return new NextResponse("Failed to submit feedback", { status: 500 });
  }
}
