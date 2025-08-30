"use client";

import { useState } from "react";
import { v4 as uuid } from "uuid";
import { useSession } from "next-auth/react";

// Field type
type FormField = {
  id: string;
  label: string;
  type: "text" | "textarea" | "email" | "number" | "dropdown" | "checkbox" | "radio" | "date" | "file";
  required: boolean;
  options?: string[];
};

export default function CreateFormPage() {
  const { data: session, status } = useSession();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#FFBF00");
  const [cover, setCover] = useState<string>("");
  const [logo, setLogo] = useState<string>("");
  const [fields, setFields] = useState<FormField[]>([]);

  const handleAddField = () => {
    const newField: FormField = {
      id: uuid(),
      label: "",
      type: "text",
      required: false,
      options: [],
    };
    setFields([...fields, newField]);
  };

  const handleFieldChange = (id: string, key: keyof FormField, value: any) => {
    setFields(fields.map(f => (f.id === id ? { ...f, [key]: value } : f)));
  };

  const handleRemoveField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const handleImageUpload = (file: File, setter: (str: string) => void) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setter(reader.result as string); // base64 string
      console.log("Image loaded:", file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!session?.user?.email) {
      alert("You must be logged in to create a form");
      return;
    }

    try {
      const response = await fetch("/api/form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          color,
          cover,
          logo,
          fields,
          userId: session.user.email, // Use logged-in user's email as ID
        }),
      });
      const data = await response.json();
      console.log("Form created:", data);
      alert("Form created successfully!");
    } catch (err) {
      console.error("Error creating form:", err);
    }
  };

  if (status === "loading") return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Create New Form</h1>

      <div className="space-y-2">
        <label className="font-semibold">Title</label>
        <input
          className="border p-2 w-full rounded"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="font-semibold">Description</label>
        <textarea
          className="border p-2 w-full rounded"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="font-semibold">Color (or hex)</label>
        <input type="color" value={color} onChange={e => setColor(e.target.value)} />
      </div>

      <div className="space-y-2">
        <label className="font-semibold">Cover (image or color string)</label>
        <input type="file" onChange={e => e.target.files && handleImageUpload(e.target.files[0], setCover)} />
      </div>

      <div className="space-y-2">
        <label className="font-semibold">Logo (image)</label>
        <input type="file" onChange={e => e.target.files && handleImageUpload(e.target.files[0], setLogo)} />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Fields</h2>
        {fields.map((field) => (
          <div key={field.id} className="border p-3 rounded space-y-2">
            <label>Label:</label>
            <input
              className="border p-1 w-full rounded"
              value={field.label}
              onChange={e => handleFieldChange(field.id, "label", e.target.value)}
            />

            <label>Type:</label>
            <select
              className="border p-1 rounded w-full"
              value={field.type}
              onChange={e => handleFieldChange(field.id, "type", e.target.value)}
            >
              <option value="text">Text</option>
              <option value="textarea">Textarea</option>
              <option value="email">Email</option>
              <option value="number">Number</option>
              <option value="dropdown">Dropdown</option>
              <option value="checkbox">Checkbox</option>
              <option value="radio">Radio</option>
              <option value="date">Date</option>
              <option value="file">File</option>
            </select>

            {(field.type === "dropdown" || field.type === "checkbox" || field.type === "radio") && (
              <input
                className="border p-1 w-full rounded"
                placeholder="Comma-separated options"
                value={field.options?.join(",") || ""}
                onChange={e => handleFieldChange(field.id, "options", e.target.value.split(","))}
              />
            )}

            <label className="inline-flex items-center space-x-2">
              <input
                type="checkbox"
                checked={field.required}
                onChange={e => handleFieldChange(field.id, "required", e.target.checked)}
              />
              <span>Required</span>
            </label>

            <button
              className="bg-red-500 text-white px-3 py-1 rounded"
              onClick={() => handleRemoveField(field.id)}
            >
              Remove Field
            </button>
          </div>
        ))}

        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleAddField}>
          Add Field
        </button>
      </div>

      <button className="bg-blue-600 text-white px-6 py-2 rounded" onClick={handleSubmit}>
        Create Form
      </button>
    </div>
  );
}
