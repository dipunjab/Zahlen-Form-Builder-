import { UploadButton } from '@/lib/uploadingthing';
import React from 'react';

export default function FieldRenderer({
  field,
  value,
  onChange,
  error,
}: {
  field: any;
  value: any;
  onChange: (val: any) => void;
  error?: string;
}) {
  const baseStyle = "w-full p-2 border rounded";

  const renderField = () => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
      case 'date':
        return (
          <input
            type={field.type}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={baseStyle}
          />
        );
      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={baseStyle}
          />
        );
      case 'dropdown':
        return (
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={baseStyle}
          >
            <option value="">Select an option</option>
            {field.options?.map((opt: string, idx: number) => (
              <option key={idx} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <div className="space-y-1">
            {field.options?.map((opt: string, idx: number) => (
              <label key={idx} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={value?.includes(opt)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    let newVal = Array.isArray(value) ? [...value] : [];
                    if (checked) newVal.push(opt);
                    else newVal = newVal.filter((v) => v !== opt);
                    onChange(newVal);
                  }}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        );
      case 'radio':
        return (
          <div className="space-y-1">
            {field.options?.map((opt: string, idx: number) => (
              <label key={idx} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={field.id}
                  value={opt}
                  checked={value === opt}
                  onChange={() => onChange(opt)}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        );
      case 'file':
        return (
          <div className="w-full">
            <div className="p-2 border rounded">
              {value?.url ? (
                <div className="text-sm text-gray-700 space-y-1">
                  <p className="text-green-600">
                    ✅ Uploaded: <span className="font-medium">{value.name}</span>
                  </p>
                  <a
                    href={value.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline text-sm"
                  >
                    View / Download
                  </a>
                  <button
                    onClick={() => onChange(null)}
                    className="text-red-500 text-sm underline mt-1"
                  >
                    Replace File
                  </button>
                </div>
              ) : (
                <UploadButton
                  endpoint="formFieldUpload"
                  appearance={{
                    container: "w-full flex justify-center",
                    button: "bg-black text-white px-4 py-2 rounded w-full",
                    allowedContent: "text-gray-500 text-sm text-center mt-1",
                  }}
                  onClientUploadComplete={(res) => {
                    const file = res[0];
                    onChange({
                      url: file.url,
                      name: file.name,
                      type: file.type,
                    });
                  }}
                  onUploadError={(err) => {
                    console.error("Upload failed", err);
                    alert("Upload failed");
                  }}
                />
              )}
            </div>
          </div>
        );




      default:
        return <div>Unsupported field type</div>;
    }
  };

  return (
    <div>
      <label className="block font-medium mb-1">
        {field.label}
        {field.required && <span className="text-red-500"> *</span>}
      </label>
      {renderField()}
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}
