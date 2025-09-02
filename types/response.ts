import { Types, Document } from "mongoose";

export interface FieldResponse {
  label: string;      
  value: any;           
}

export interface FormResponse extends Document {
  formId: Types.ObjectId;      
  responses: FieldResponse[];  
  submittedAt: Date;           
}
