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
          <input
            type="file"
            onChange={(e) => onChange(e.target.files?.[0])}
            className={baseStyle}
          />
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
