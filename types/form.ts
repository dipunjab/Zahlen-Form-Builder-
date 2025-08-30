export type FieldType =
  | "text"
  | "textarea"
  | "email"
  | "number"
  | "dropdown"
  | "checkbox"
  | "radio"
  | "date"
  | "file";

export interface FormField {
  id: string;                    
  label: string;
  type: FieldType;
  required: boolean;
  options?: string[];            
}

export interface Form {
  _id?: string;                  
  userId: string;                
  title: string;
  description?: string;
  fields: FormField[];
  published?: boolean;           
  publishedAt?: Date;            
  logo?: string;                 
  cover?: string;                
  color?: string;                
  createdAt?: Date;
  updatedAt?: Date;
}
