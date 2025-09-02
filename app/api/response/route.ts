// app/api/response/route.ts
import { NextRequest, NextResponse } from "next/server";
import FormModel from "@/models/Form";
import ResponseForm from "@/models/ResponseForm";
import dbConnect from "@/lib/dbConnect";

function isEmptyValue(v: any) {
  // treat empty string, null, undefined, empty array as empty
  if (v === null || v === undefined) return true;
  if (typeof v === "string" && v.trim() === "") return true;
  if (Array.isArray(v) && v.length === 0) return true;
  return false;
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { formId, responses } = body;

    // basic sanity checks
    if (!formId || !Array.isArray(responses)) {
      return NextResponse.json(
        { success: false, error: "Invalid request body (formId + responses[] required)" },
        { status: 400 }
      );
    }

    const form = await FormModel.findById(formId).lean<Form | null>();
    if (!form) {
      return NextResponse.json(
        { success: false, error: "Form not found" },
        { status: 404 }
      );
    }

    if (!form.published) {
      return NextResponse.json(
        { success: false, error: "Form is not accepting responses" },
        { status: 403 }
      );
    }

    // Build quick lookup maps from the form definition
    const fieldIdMap = new Map<string, any>();
    const labelMap = new Map<string, any>();
    for (const f of form.fields) {
      fieldIdMap.set(String(f.id), f);
      labelMap.set(String(f.label), f);
    }

    // Normalize incoming responses: accept either { fieldId, value } or { label, value }
    const normalized = responses.map((r: any) => {
      const out: { fieldId?: string; label?: string; value?: any } = { value: r.value };
      if (r.fieldId) out.fieldId = String(r.fieldId);
      if (r.label) out.label = String(r.label);
      return out;
    });

    // Validate required fields (check by id OR label match). A required field is missing if
    // no normalized response references it OR the provided value is empty.
    const missingRequired = form.fields
      .filter((f: any) => f.required)
      .filter((f: any) => {
        // find normalized response for this field (by id or by label)
        const match = normalized.find((nr) => {
          if (nr.fieldId && nr.fieldId === String(f.id)) return true;
          if (nr.label && String(nr.label) === String(f.label)) return true;
          return false;
        });
        if (!match) return true;
        return isEmptyValue(match.value);
      });

    if (missingRequired.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Missing required fields: ${missingRequired.map((f) => f.label).join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Build cleaned responses in the shape your schema expects: { label, value }
    const cleanedResponses: { label: string; value: any }[] = [];

    for (const nr of normalized) {
      // prefer lookup by fieldId, fallback to label
      let field = null;
      if (nr.fieldId) field = fieldIdMap.get(nr.fieldId);
      if (!field && nr.label) field = labelMap.get(nr.label);

      if (!field) {
        // unknown field — ignore (or you could reject if you prefer)
        continue;
      }

      // skip empty values
      if (isEmptyValue(nr.value)) continue;

      cleanedResponses.push({
        label: field.label,
        value: nr.value,
      });
    }

    if (cleanedResponses.length === 0) {
      return NextResponse.json(
        { success: false, error: "No valid responses provided." },
        { status: 400 }
      );
    }

    const responseDoc = await ResponseForm.create({
      formId,
      responses: cleanedResponses,
    });

    return NextResponse.json({ success: true, data: responseDoc });
  } catch (err: any) {
    console.error("Error saving response:", err);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
