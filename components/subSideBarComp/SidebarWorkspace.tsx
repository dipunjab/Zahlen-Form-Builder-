"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FileText, Trash2, ChevronRight, Check, X, UploadCloud } from "lucide-react";
import { Form } from "@/types/form";
import { toast } from "sonner";

interface SidebarWorkspaceProps {
  forms: Form[];
  setForms: React.Dispatch<React.SetStateAction<Form[]>>;
}

const SidebarWorkspace: React.FC<SidebarWorkspaceProps> = ({ forms, setForms }) => {
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);

  const handleDeleteForm = async (formId: string, title: string) => {
    const confirmDelete = window.confirm(`Delete form "${title}"?`);
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/form/${formId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        setForms((prev) => prev.filter((form) => form._id !== formId));
        toast.success("Form deleted");
      } else {
        toast.error("Failed to delete form.");
      }
    } catch (err) {
      console.error("Error deleting form:", err);
      toast.error("An error occurred while deleting the form.");
    }
  };

  const handleTogglePublish = async (formId: string) => {
    try {
      const res = await fetch(`/api/form/${formId}/toggle-publish`, {
        method: "PATCH",
      });
      const data = await res.json();

      if (data.success) {
        setForms((prev) =>
          prev.map((form) =>
            form._id === formId ? { ...form, published: data.published } : form
          )
        );
        toast.success(data.message);
        setSelectedForm(null);
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      console.error("Toggle publish error:", err);
      toast.error("Failed to toggle publish status");
    }
  };

  return (
    <div className="flex flex-col gap-1 mt-1">
      {forms.slice(0, 2).map((form) => (
        <div
          key={form._id}
          className="flex items-center justify-between p-1.5 rounded border border-transparent hover:border-gray-100 hover:bg-gray-50 transition-transform transform hover:translate-x-1 cursor-pointer"
        >
          <Link href={`/form/${form._id}`} className="flex items-center gap-2 flex-1">
            <FileText size={14} />
            <div className="text-sm flex items-center gap-2">
              <span className="truncate max-w-[120px]">{form?.title}</span>
              {form.published && (
                <span title="Published" className="inline-flex items-center gap-1 text-green-600 text-xs">
                  <Check size={12} />
                </span>
              )}
            </div>
          </Link>

          <div className="flex items-center gap-1">
            <button
              className="p-1 rounded hover:bg-gray-100 transition cursor-pointer"
              aria-label="More options"
              onClick={() => setSelectedForm(form)}
            >
              <ChevronRight size={14} />
            </button>
            <button
              className="p-1 rounded hover:bg-red-50 transition cursor-pointer"
              aria-label="Delete form"
              onClick={() => form._id && handleDeleteForm(form._id, form.title)}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}

      {forms.length > 2 && (
        <div className="text-xs text-gray-600 mt-1">Explore more...</div>
      )}

      {/* Modal for publish/unpublish */}
      {selectedForm && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity"
          onClick={() => setSelectedForm(null)}
        >
          <div
            className="bg-white rounded-md p-5 shadow-lg w-80 animate-slideIn relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedForm(null)}
              className="absolute top-2 right-2 p-1 rounded hover:bg-gray-100"
              aria-label="Close modal"
            >
              <X size={16} />
            </button>

            <h2 className="text-lg font-semibold mb-3">{selectedForm.title}</h2>
            <p className="text-sm mb-4">
              This form is currently{" "}
              <strong className={selectedForm.published ? "text-green-600" : "text-red-600"}>
                {selectedForm.published ? "Published" : "Unpublished"}
              </strong>
              .
            </p>

            <button
              className="flex items-center gap-2 px-4 py-2 rounded bg-[#FFBF00] text-black font-medium hover:opacity-90 transition w-full justify-center"
              onClick={() => handleTogglePublish(selectedForm._id!)}
            >
              <UploadCloud size={16} />
              {selectedForm.published ? "Unpublish" : "Publish"}
            </button>
          </div>
        </div>
      )}

      {/* Animation style */}
      <style jsx>{`
        .animate-slideIn {
          animation: slideIn 0.25s ease-out;
        }
        @keyframes slideIn {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default SidebarWorkspace;
