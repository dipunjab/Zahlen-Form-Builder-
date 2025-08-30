import { z } from "zod";

export const answerSchema = z.object({
  fieldId: z.string(), // must match a field's id from formSchema
  value: z.union([
    z.string(),             // text, textarea, email, etc.
    z.array(z.string()),    // checkboxes
  ])
});

export const responseSchema = z.object({
  formId: z.string(), // ref to the form
  answers: z.array(answerSchema),
});
