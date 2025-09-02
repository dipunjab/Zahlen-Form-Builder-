// components/FormsTable.tsx
"use client";

import { useState } from "react";
import { Plus, MoreHorizontal, Trash2, Edit2, Globe } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

type Form = {
  _id: string;
  title: string;
  description?: string;
  cover?: string;
  logo?: string;
  color?: string;
  published: boolean;
  createdAt: string;
  publishedAt?: string | null;
};

export default function FormsTable({ forms: initialForms }: { forms: Form[] }) {
  const [forms, setForms] = useState<Form[]>(initialForms || []);
  const [loadingIds, setLoadingIds] = useState<Record<string, boolean>>({});
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const setLoading = (id: string, v: boolean) =>
    setLoadingIds((s) => ({ ...s, [id]: v }));

  const handleDelete = async (id: string, title?: string) => {
    if (!confirm(`Delete form "${title ?? "this form"}"? This action can't be undone.`)) return;
    setLoading(id, true);
    try {
      const res = await fetch(`/api/form/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setForms((prev) => prev.filter((p) => p._id !== id));
      } else {
        alert(json.error || "Failed to delete");
      }
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    } finally {
      setLoading(id, false);
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
        } else {
          toast.error(data.error);
        }
      } catch (err) {
        console.error("Toggle publish error:", err);
        toast.error("Failed to toggle publish status");
      }
    };

  return (
    <div className="mt-8 ">
      {/* Header: title + create */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 lg:ml-40">
        <div>
          <h2 className="text-xl font-semibold">Your Forms</h2>
          <p className="text-sm text-gray-500">Manage, preview and publish your forms</p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/form/createform" className="inline-flex items-center gap-2 bg-[var(--app-color)] text-black px-3 py-2 rounded-md font-medium">
            <Plus className="w-4 h-4" />
            Create New
          </Link>
        </div>
      </div>

      {/* Desktop table (md+) */}
      <div className="hidden md:block lg:ml-40">
        <div className="overflow-x-auto border rounded-md">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr className="text-left text-sm text-gray-600">
                <th className="px-4 py-3">Form</th>
                <th className="px-4 py-3 w-40">Status</th>
                <th className="px-4 py-3 w-40">Created</th>
                <th className="px-4 py-3 w-36 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {forms.map((form, idx) => (
                <tr key={form._id} className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                  <td className="px-4 py-3 align-top">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                        {form.logo ? (
                          <Image src={form.logo} alt={`${form.title} logo`} width={40} height={40} className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">{form.title[0]?.toUpperCase()}</div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <Link href={`/form/${form._id}`} className="block text-sm font-medium text-gray-900 hover:underline truncate">
                          {form.title}
                        </Link>
                        {form.description ? (
                          <div className="text-xs text-gray-500 truncate max-w-xl">{form.description}</div>
                        ) : (
                          <div className="text-xs text-gray-400">No description</div>
                        )}
                        {/* removed publishedAt display per request */}
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 align-top">
                    <div>
                      {form.published ? (
                        <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-800">Published</span>
                      ) : (
                        <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">Draft</span>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3 align-top text-sm text-gray-600">
                    {new Date(form.createdAt).toLocaleString()}
                  </td>

                  <td className="px-4 py-3 align-top text-right">
                    <div className="inline-flex items-center gap-2 justify-end relative">
                      {form.published && form.publishedAt ? (
                        <a href={form.publishedAt} target="_blank" rel="noreferrer" className="text-sm text-indigo-600 hover:underline inline-flex items-center gap-1">
                          <Globe className="w-4 h-4" /> View
                        </a>
                      ) : null}

                      <div className="relative">
                        <button
                          className="p-1 rounded hover:bg-gray-100"
                          onClick={() => setOpenMenuId(openMenuId === form._id ? null : form._id)}
                          aria-expanded={openMenuId === form._id}
                          aria-controls={`menu-${form._id}`}
                        >
                          <MoreHorizontal />
                        </button>

                        {openMenuId === form._id && (
                          <div id={`menu-${form._id}`} className="absolute right-0 mt-2 w-44 bg-white border rounded-md shadow-md z-20">
                            <div className="flex flex-col">
                              <Link href={`/form/${form._id}/edit`} className="px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2">
                                <Edit2 className="w-4 h-4" /> Edit
                              </Link>
                              <button
                                onClick={() => handleTogglePublish(form._id)}
                                className="px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 text-left"
                                disabled={!!loadingIds[form._id]}
                              >
                                {loadingIds[form._id] ? "Working..." : (form.published ? "Unpublish" : "Publish")}
                              </button>
                              <button
                                onClick={() => handleDelete(form._id, form.title)}
                                className="px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 text-left text-red-600"
                                disabled={!!loadingIds[form._id]}
                              >
                                <Trash2 className="w-4 h-4" /> Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}

              {forms.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-500">
                    No forms
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile: cards */}
      <div className="md:hidden grid gap-3">
        {forms.map((form) => (
          <div key={form._id} className="border rounded-md p-3 bg-white shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                {form.logo ? (
                  <Image src={form.logo} alt={`${form.title} logo`} width={48} height={48} className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">{form.title[0]?.toUpperCase()}</div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link href={`/form/${form._id}`} className="font-medium text-sm truncate block">{form.title}</Link>
                  </div>

                  <div className="text-xs">
                    {form.published ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-50 text-green-800">Published</span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-700">Draft</span>
                    )}
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between gap-2">
                  <div className="text-xs text-gray-500">{new Date(form.createdAt).toLocaleDateString()}</div>

                  <div className="flex items-center gap-2">
                    {form.published && form.publishedAt ? (
                      <a href={form.publishedAt} target="_blank" rel="noreferrer" className="text-sm text-indigo-600">View</a>
                    ) : null}
                    <Link href={`/form/edit/${form._id}`} className="text-sm text-indigo-600">Edit</Link>
                    <button onClick={() => handleTogglePublish(form._id)} className="text-sm text-gray-700" disabled={!!loadingIds[form._id]}>
                      {loadingIds[form._id] ? "..." : (form.published ? "Unpublish" : "Publish")}
                    </button>
                    <button onClick={() => handleDelete(form._id, form.title)} className="text-sm text-red-600" disabled={!!loadingIds[form._id]}>Delete</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {forms.length === 0 && (
          <div className="text-center text-sm text-gray-500 py-8">No forms</div>
        )}
      </div>
    </div>
  );
}
