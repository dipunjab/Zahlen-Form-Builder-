"use client";

import { useEffect, useState } from "react";
import {  useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import FormFieldEditor from "./FormFieldEditor";
import { FormField } from "@/types/form";



type FormType = {
  _id: string;
  title: string;
  description?: string;
  fields: FormField[];
};

export default function EditFormClient({formId}:any) {
  const router = useRouter();

  const [form, setForm] = useState<FormType | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!formId || typeof formId !== "string") return;

    const fetchForm = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/form/${formId}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setForm(data.form);
      } catch (err: any) {
        console.error("Error fetching form:", err);
        setError("Failed to load form");
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [formId]);

  const updateField = (id: string, key: keyof FormField, value: any) => {
    if (!form) return;
    const updatedFields = form.fields.map((f) =>
      f.id === id ? { ...f, [key]: value } : f
    );
    setForm({ ...form, fields: updatedFields });
  };

  const removeField = (id: string) => {
    if (!form) return;
    const updatedFields = form.fields.filter((f) => f.id !== id);
    setForm({ ...form, fields: updatedFields });
  };

  const addField = () => {
    if (!form) return;
    const newField: FormField = {
      id: uuidv4(),
      label: "Untitled",
      type: "text",
      required: false,
      options: [],
    };
    setForm({ ...form, fields: [...form.fields, newField] });
  };

  const handleSubmit = async () => {
    if (!form || !formId) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/form/${formId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Update failed");

      alert("Form updated successfully!");
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Update error:", err);
      alert(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!formId || !confirm("Delete this form?")) return;

    try {
      const res = await fetch(`/api/form/${formId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        alert("Deleted");
        router.push("/dashboard");
      } else {
        alert("Delete failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting");
    }
  };

  if (loading) return <div className="p-4">Loading form...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!form) return <div className="p-4">No form data found.</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold">Edit Form</h1>

      <div>
        <label className="block text-sm font-medium text-gray-700">Form Title</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={form.description || ""}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded"
        />
      </div>

      <div className="space-y-4">
        {form.fields.map((field) => (
          <FormFieldEditor
            key={field.id}
            field={field}
            onChange={updateField}
            onRemove={removeField}
          />
        ))}
      </div>

      <div className="flex justify-between items-center pt-6">
        <button
          type="button"
          onClick={addField}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Field
        </button>

        <div className="flex gap-4">
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete Form
          </button>

          <button
            disabled={saving}
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
