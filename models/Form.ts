import { Schema, model, models } from "mongoose";
import { Form, FormField } from "@/types/form";


// FormFieldSchema defines the structure of each field inside a form
// We set `_id: false` because each field already has a unique `id` generated
// on the client or server side (e.g., using UUID). This avoids creating an
// unnecessary MongoDB ObjectId for every single field.
const FormFieldSchema = new Schema<FormField>(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    type: { 
      type: String, 
      enum: ["text","textarea","email","number","dropdown","checkbox","radio","date","file"], 
      required: true 
    },
    required: { type: Boolean, default: false },
    options: { type: [String], default: undefined }
  },
  { _id: false }
);


const FormSchema = new Schema<Form>(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    fields: { type: [FormFieldSchema], default: [] },
    published: { type: Boolean, default: false },
    publishedAt: { type: String, default: null },
    logo: { type: String, default: null },
    cover: { type: String, default: null },
    color: { type: String, default: "#FFBF00" }
  },
  { timestamps: true }
);

const FormModel = models.Form || model<Form>("Form", FormSchema);

export default FormModel;
