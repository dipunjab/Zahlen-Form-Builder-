import { NextRequest, NextResponse } from "next/server";
import FormModel from "@/models/Form";
import { v2 as cloudinary } from "cloudinary";
import dbConnect from "@/lib/dbConnect";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function isBase64Image(str: string) {
  return /^data:image\/[a-zA-Z]+;base64,/.test(str);
}

export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ success: false, error: "Missing userId" }, { status: 400 });
    }

    const forms = await FormModel.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, forms });
  } catch (error) {
    console.error("Error fetching forms:", error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const data = await req.json();

    const {
      title,
      description,
      fields,
      color,
      cover,
      logo,
      userId,
      published,      
      publishedAt,     
    } = data;

    let coverUrl = cover;
    let logoUrl = logo;

    if (cover && isBase64Image(cover)) {
      const coverUpload = await cloudinary.uploader.upload(cover, { folder: "forms/cover" });
      coverUrl = coverUpload.secure_url;
    }

    if (logo && isBase64Image(logo)) {
      const logoUpload = await cloudinary.uploader.upload(logo, { folder: "forms/logo" });
      logoUrl = logoUpload.secure_url;
    }

    const newForm = await FormModel.create({
      userId,
      title,
      description,
      fields,
      color: color || "#FFBF00",
      cover: coverUrl,
      logo: logoUrl,
      published: published || false,
      publishedAt: published ? publishedAt : null, 
    });

    return NextResponse.json({ success: true, form: newForm });
  } catch (error) {
    console.error("Error creating form:", error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
