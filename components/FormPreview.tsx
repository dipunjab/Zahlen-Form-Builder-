"use client";

import Image from "next/image";

type FormField = {
  id: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
};

type Props = {
  title: string;
  description: string;
  color: string;
  cover: string;
  logo: string;
  fields: FormField[];
};

export default function FormPreview({
  title,
  description,
  color,
  cover,
  logo,
  fields,
}: Props) {
  return (
    <div className="w-full max-w-2xl mx-auto border rounded overflow-hidden shadow-md bg-white">
      {/* Cover Image */}
      {cover && (
        <div className="h-48 w-full relative">
          <Image src={cover} alt="Form Cover" layout="fill" objectFit="cover" />
        </div>
      )}

      {/* Header Section */}
      <div className="p-6 space-y-2">
        {/* Logo */}
        {logo && (
          <div className="mb-2">
            <Image src={logo} alt="Logo" width={100} height={40} className="object-contain" />
          </div>
        )}

        {/* Title */}
        <h1 className="text-2xl font-bold" style={{ color }}>{title || "Untitled Form"}</h1>

        {/* Description */}
        {description && <p className="text-gray-600">{description}</p>}
      </div>

      {/* Fields Preview */}
      <div className="px-6 pb-6 space-y-4">
        {fields.map((field) => (
          <div key={field.id} className="flex flex-col gap-1">
            <label className="font-medium">
              {field.label}
              {field.required && <span className="text-red-500"> *</span>}
            </label>

            {field.type === "text" && <input type="text" className="input" disabled />}
            {field.type === "textarea" && <textarea className="input" disabled />}
            {field.type === "email" && <input type="email" className="input" disabled />}
            {field.type === "number" && <input type="number" className="input" disabled />}
            {field.type === "date" && <input type="date" className="input" disabled />}
            {field.type === "file" && <input type="file" className="input" disabled />}

            {["checkbox", "radio", "dropdown"].includes(field.type) &&
              field.options?.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type={field.type === "dropdown" ? "radio" : field.type}
                    disabled
                  />
                  <span>{opt}</span>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
