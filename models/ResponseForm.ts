import { Schema, model } from "mongoose";
import { FormResponse, FieldResponse } from "@/types/response";

const FieldResponseSchema = new Schema<FieldResponse>(
  {
    fieldId: { type: String, required: true },
    value: { type: Schema.Types.Mixed, required: true },
  },
  { _id: false }
);

const FormResponseSchema = new Schema<FormResponse>(
  {
    formId: { type: Schema.Types.ObjectId, ref: "Form", required: true },
    responses: { type: [FieldResponseSchema], required: true },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default model<FormResponse>("FormResponse", FormResponseSchema);
