// app/api/form/[formId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import FormModel from "@/models/Form";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function isBase64Image(str?: string) {
  return typeof str === "string" && /^data:image\/[a-zA-Z]+;base64,/.test(str);
}

async function getFormIdFromContext(context: any) {
  const awaited = await context;
  const params = awaited?.params;
  return params?.formId;
}

export async function GET(req: NextRequest, context: any) {
  await dbConnect();

  const formId = await getFormIdFromContext(context);

  if (!formId) {
    return NextResponse.json({ success: false, error: "Missing form ID" }, { status: 400 });
  }

  try {
    const form = await FormModel.findById(formId);
    if (!form) return NextResponse.json({ success: false, error: "Form not found" }, { status: 404 });
    return NextResponse.json({ success: true, form });
  } catch (error) {
    console.error("Error fetching form by ID:", error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: any) {
  await dbConnect();

  const formId = await getFormIdFromContext(context);
  if (!formId) {
    return NextResponse.json({ success: false, error: "Missing form ID" }, { status: 400 });
  }

  try {
    const deleted = await FormModel.findByIdAndDelete(formId);
    if (!deleted) return NextResponse.json({ success: false, error: "Form not found" }, { status: 404 });
    return NextResponse.json({ success: true, message: "Form deleted successfully" });
  } catch (error) {
    console.error("Error deleting form:", error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, context: any) {
  await dbConnect();

  const formId = await getFormIdFromContext(context);
  if (!formId) {
    return NextResponse.json({ success: false, error: "Missing form ID" }, { status: 400 });
  }

  try {
    const payload = await req.json();

    const form = await FormModel.findById(formId);
    if (!form) {
      return NextResponse.json({ success: false, error: "Form not found" }, { status: 404 });
    }

    const {
      title,
      description,
      fields,
      color,
      cover,
      logo,
      published,
    } = payload;

    if (typeof title === "string") form.title = title;
    if (typeof description === "string") form.description = description;
    if (Array.isArray(fields)) form.fields = fields;
    if (typeof color === "string") form.color = color;

    if (typeof cover !== "undefined") {
      if (cover === null || cover === "") {
        form.cover = null;
      } else if (isBase64Image(cover)) {
        const uploaded = await cloudinary.uploader.upload(cover, { folder: "forms/cover" });
        form.cover = uploaded.secure_url;
      } else if (typeof cover === "string") {
        form.cover = cover;
      }
    }

    if (typeof logo !== "undefined") {
      if (logo === null || logo === "") {
        form.logo = null;
      } else if (isBase64Image(logo)) {
        const uploaded = await cloudinary.uploader.upload(logo, { folder: "forms/logo" });
        form.logo = uploaded.secure_url;
      } else if (typeof logo === "string") {
        form.logo = logo;
      }
    }

    if (typeof published !== "undefined") {
      const wantPublish = Boolean(published);

      if (wantPublish && !form.published) {
        if (!form.publishedAt) {
          const tsId = new Date().toISOString().replace(/[^0-9]/g, "");
          const slugTitle = encodeURIComponent(((title as string) || form.title || "form").trim().replace(/\s+/g, "-"));
          form.publishedAt = `/publishedForm/${slugTitle}/${tsId}`;
        }
        form.published = true;
      } else if (!wantPublish && form.published) {
        form.published = false;
      }
    }

    await form.save();

    return NextResponse.json({ success: true, form });
  } catch (error) {
    console.error("Error updating form:", error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
