import PublishedForm from "@/components/PublishedForm";
import FormModel from "@/models/Form";
import mongoose from "mongoose";

async function getForm(formId: string) {
  if (!mongoose.connection.readyState) {
    await mongoose.connect(process.env.MONGODB_URI || "");
  }

  const form:any = await FormModel.findById(formId).lean();

  if (!form || !form.published) return null;

  return JSON.parse(JSON.stringify(form));
}

export default async function PublishedFormPage({
  params,
}: {
  params: { formId: string; formTitle: string };
}) {
  const form = await getForm(params.formId);

  if (!form) {
    return <div className="text-center mt-20 text-xl">This form is not available.</div>;
  }

  return <PublishedForm form={form} />;
}
