import EditFormClient from "@/components/EditFormClient";

export default function EditFormPage({ params }: { params: { formId: string } }) {
  const { formId } = params;
  return <EditFormClient formId={formId} />;
}
