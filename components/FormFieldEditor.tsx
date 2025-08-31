"use client";

import { Trash2, PlusCircle, X } from "lucide-react";
import { useState } from "react";

type FieldType =
  | "text"
  | "textarea"
  | "email"
  | "number"
  | "dropdown"
  | "checkbox"
  | "radio"
  | "date"
  | "file";

type FormField = {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  options?: string[];
};

type Props = {
  field: FormField;
  onChange: (id: string, key: keyof FormField, value: any) => void;
  onRemove: (id: string) => void;
};

export default function FormFieldEditor({ field, onChange, onRemove }: Props) {
  const [newOption, setNewOption] = useState("");

  const isOptionField = ["dropdown", "checkbox", "radio"].includes(field.type);

  const handleAddOption = () => {
    if (!newOption.trim()) return;
    const updated = [...(field.options || []), newOption.trim()];
    onChange(field.id, "options", updated);
    setNewOption("");
  };

  const handleRemoveOption = (index: number) => {
    const updated = field.options?.filter((_, i) => i !== index) || [];
    onChange(field.id, "options", updated);
  };

  return (
    <div className="bg-white rounded p-4 space-y-4 shadow-sm border">
      {/* Field Label */}
      <div>
        <label className="text-sm font-medium text-gray-700">Field Label</label>
        <input
          className="mt-1 w-full px-2 py-1 border border-gray-300 rounded bg-transparent outline-none"
          placeholder="Enter field label"
          value={field.label}
          onChange={(e) => onChange(field.id, "label", e.target.value)}
        />
      </div>

      {/* Field Type */}
      <div>
        <label className="text-sm font-medium text-gray-700">Field Type</label>
        <select
          className="mt-1 w-full px-2 py-1 border border-gray-300 rounded bg-white"
          value={field.type}
          onChange={(e) => onChange(field.id, "type", e.target.value)}
        >
          <option value="text">Text</option>
          <option value="textarea">Textarea</option>
          <option value="email">Email</option>
          <option value="number">Number</option>
          <option value="dropdown">Dropdown</option>
          <option value="checkbox">Checkbox</option>
          <option value="radio">Radio</option>
          <option value="date">Date</option>
          <option value="file">File Upload</option>
        </select>
      </div>

      {/* Required toggle */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={field.required}
            onChange={(e) => onChange(field.id, "required", e.target.checked)}
          />
          Required
        </label>

        <button
          onClick={() => onRemove(field.id)}
          className="text-red-500 text-sm flex items-center gap-1"
        >
          <Trash2 className="w-4 h-4" />
          Remove
        </button>
      </div>

      {/* Options section (only for dropdown, checkbox, radio) */}
      {isOptionField && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Options
          </label>

          <div className="flex gap-2">
            <input
              className="flex-1 px-2 py-1 border border-gray-300 rounded"
              placeholder="Add option"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
            />
            <button
              type="button"
              onClick={handleAddOption}
              className="flex items-center px-3 py-1 bg-gray-100 border border-gray-300 rounded text-sm"
            >
              <PlusCircle className="w-4 h-4 mr-1" />
              Add
            </button>
          </div>

          {/* Option list */}
          <ul className="space-y-1">
            {(field.options || []).map((option, index) => (
              <li
                key={index}
                className="flex items-center justify-between text-sm px-2 py-1 border border-gray-200 rounded"
              >
                {option}
                <button
                  type="button"
                  onClick={() => handleRemoveOption(index)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
