'use client';

import { useState } from 'react';
import axios from 'axios';
import FieldRenderer from './FieldRenderer';

export default function PublishedForm({ form }: { form: any }) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [values, setValues] = useState<Record<string, any>>({});

  const handleChange = (fieldId: string, value: any) => {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
    setErrors((prev) => ({ ...prev, [fieldId]: '' }));
  };

  const handleSubmit = async () => {
    const errs: Record<string, string> = {};

    form.fields.forEach((field: any) => {
      if (field.required && !values[field.id]) {
        errs[field.id] = 'This field is required';
      }
    });

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    try {
      setSubmitting(true);

      const responses = form.fields
        .map((field: any) => {
          const value = values[field.id];
          if (value === undefined || value === null || value === '') {
            return null;
          }
          return {
            label: field.label,
            value,
          };
        })
        .filter(Boolean); 

      await axios.post('/api/response', {
        formId: form._id,
        responses,
      });

      setSubmitted(true);
    } catch (err) {
      alert('Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };


  if (submitted) {
    return <div className="text-center mt-10 text-lg">Thank you! Your response has been recorded.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      {form.cover && (
        <img
          src={form.cover}
          alt="cover"
          className="w-full h-60 object-cover rounded-lg mb-4"
        />
      )}
      {form.logo && (
        <div className="flex justify-center mb-4">
          <img src={form.logo} alt="logo" className="h-16" />
        </div>
      )}
      <h1 className="text-3xl font-bold mb-2">{form.title}</h1>
      {form.description && (
        <p className="text-gray-600 mb-6">{form.description}</p>
      )}

      <div className="space-y-6">
        {form.fields.map((field: any) => (
          <FieldRenderer
            key={field.id}
            field={field}
            value={values[field.id]}
            error={errors[field.id]}
            onChange={(val: any) => handleChange(field.id, val)}
          />
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="mt-8 w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition"
      >
        {submitting ? 'Submitting...' : 'Submit'}
      </button>
    </div>
  );
}
