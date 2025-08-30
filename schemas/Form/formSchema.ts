// schemas/formSchema.ts
import { z } from "zod";

export const fieldSchema = z.object({
  id: z.string(), 
  label: z.string().min(1),
  type: z.enum(["text", "textarea", "email", "number", "dropdown", "checkbox", "radio", "date", "file"]),
  required: z.boolean(),
  options: z.array(z.string()).optional(), 
});

export const formSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  fields: z.array(fieldSchema).min(1),
});
