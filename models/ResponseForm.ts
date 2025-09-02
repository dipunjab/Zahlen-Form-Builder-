import { Schema, models, model } from "mongoose";
import { FormResponse, FieldResponse } from "@/types/response";

const FieldResponseSchema = new Schema<FieldResponse>(
  {
    label: { type: String, required: true }, 
    value: { type: Schema.Types.Mixed, required: true },
  },
  { _id: false }
);

const FormResponseSchema = new Schema<FormResponse>(
  {
    formId: { type: Schema.Types.ObjectId, ref: "Form", required: true },
    responses: { type: [FieldResponseSchema], required: true },
  },
  { timestamps: true }
);

export default models.FormResponse || model<FormResponse>("FormResponse", FormResponseSchema);
