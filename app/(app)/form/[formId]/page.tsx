"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Trash2, Eye, EyeOff, Check, Loader2, ChevronLeft, Copy, Edit2 } from "lucide-react";

type Form = {
  _id: string;
  title: string;
  description?: string;
  createdAt: string;
  published: boolean;
  responseCount?: number;
  publishedAt?: string | null; 
};

export default function FormPage() {
  const params = useParams();
  const router = useRouter();
  const formId = params?.formId;

  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"about" | "responses" | "settings">("about");
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch form
  useEffect(() => {
    const fetchForm = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/form/${formId}`);
        const data = await res.json();
        if (data.success) setForm(data.form);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (formId) fetchForm();
  }, [formId]);

  const togglePublish = async () => {
    try {
      setToggling(true);
      const res = await fetch(`/api/form/${formId}/toggle-publish`, { method: "PATCH" });
      const data = await res.json();
      if (data.success)
        setForm((p) => (p ? { ...p, published: data.published, publishedAt: data.publishedAt ?? p.publishedAt } : p));
    } catch (err) {
      console.error(err);
    } finally {
      setToggling(false);
    }
  };

  const deleteForm = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this form? This action is irreversible.");
    if (!confirmed) return;

    try {
      setDeleting(true);
      const res = await fetch(`/api/form/${formId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        router.push("/dashboard");
      } else {
        alert("Failed to delete the form.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting form.");
    } finally {
      setDeleting(false);
    }
  };

  // Build a full URL for copy behavior
  const getFullPublishedUrl = () => {
    if (!form?.publishedAt) return "";
    const stored = form.publishedAt;
    // If already absolute, return as-is
    if (/^https?:\/\//i.test(stored)) return stored;

    // Prefer an explicit app URL at build/runtime (useful in production)
    const envUrl = typeof process !== "undefined" ? (process.env.NEXT_PUBLIC_APP_URL || "") : "";
    try {
      const origin = envUrl.replace(/\/$/, "") || (typeof window !== "undefined" ? window.location.origin : "");
      if (!origin) return stored;
      return origin + (stored.startsWith("/") ? stored : `/${stored}`);
    } catch (e) {
      // fallback
      return stored.startsWith("/") ? `${window.location.origin}${stored}` : `${window.location.origin}/${stored}`;
    }
  };

  const copyPublishUrl = async () => {
    const full = getFullPublishedUrl();
    if (!full) return;
    try {
      await navigator.clipboard.writeText(full);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("copy failed", err);
      alert("Failed to copy URL. Try selecting and copying manually.");
    }
  };

  const goToEditor = () => {
    if (!formId) return;
    router.push(`/form/${formId}/edit`);
  };

  if (loading)
    return (
      <div className="p-6 lg:ml-64 min-h-[240px] flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2 className="animate-spin" />
          <span>Loading form…</span>
        </div>
      </div>
    );

  if (!form) return <div className="p-6 lg:ml-64">Form not found.</div>;

  return (
    <div className="p-6 lg:ml-64 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        className="bg-white rounded-2xl shadow-sm p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
            >
              <ChevronLeft size={16} /> Back
            </button>

            <h1 className="text-2xl md:text-3xl font-extrabold mt-3">{form.title}</h1>
            <p className="text-sm text-gray-500 mt-1">{form.description ?? "No description provided."}</p>

            <div className="flex items-center gap-3 mt-3">
              <span className="inline-flex items-center gap-2 text-sm font-medium text-[#0f172a] bg-[#FFBF00]/10 px-2 py-1 rounded">Responses: {form.responseCount ?? 0}</span>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-[#0f172a] bg-[#FFBF00]/10 px-2 py-1 rounded">
                {form.published ? (
                  <><Check size={14} /> Published</>
                ) : (
                  <>Draft</>
                )}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={togglePublish}
              disabled={toggling}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium shadow-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFBF00]/50 ${
                form.published
                  ? "bg-[#FFBF00] text-black hover:brightness-95"
                  : "bg-[#FFBF00] text-black hover:brightness-95"
              }`}
            >
              {toggling ? (
                <span className="flex items-center gap-2"><Loader2 className="animate-spin" size={16} /> Processing</span>
              ) : form.published ? (
                <><EyeOff size={16} /> Unpublish</>
              ) : (
                <><Eye size={16} /> Publish</>
              )}
            </button>

            <button
              onClick={goToEditor}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border text-sm font-medium shadow-sm hover:bg-gray-50"
            >
              <Edit2 size={16} /> Edit
            </button>

            <button
              onClick={deleteForm}
              disabled={deleting}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-red-600 text-white text-sm shadow-sm hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-red-300"
            >
              {deleting ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
              <span>{deleting ? "Deleting" : "Delete"}</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6">
          <nav className="flex gap-3 overflow-x-auto pb-2">
            {([
              { id: "about", label: "About" },
              { id: "responses", label: "Responses" },
              { id: "settings", label: "Settings" },
            ] as const).map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                  activeTab === t.id ? "bg-[#FFBF00] text-black" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>

          <div className="mt-6">
            {activeTab === "about" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-700">Basic details</h3>
                    <div className="mt-3 text-sm text-gray-700 space-y-2">
                      <div className="flex justify-between">
                        <div>Title</div>
                        <div className="font-medium text-gray-900">{form.title}</div>
                      </div>
                      <div className="flex justify-between">
                        <div>Created</div>
                        <div className="text-gray-700">{new Date(form.createdAt).toLocaleString()}</div>
                      </div>
                      <div className="flex justify-between">
                        <div>Status</div>
                        <div className="font-medium">{form.published ? "Published" : "Draft"}</div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-gray-700">Publish URL</h4>
                      {form.publishedAt ? (
                        <div className="mt-2 flex gap-2 items-center">
                          <input readOnly value={getFullPublishedUrl()} className="flex-1 text-sm px-3 py-2 rounded-md border bg-white" />
                          <button onClick={copyPublishUrl} className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-[#FFBF00] text-black font-medium">
                            <Copy size={14} />
                            {copied ? "Copied" : "Copy"}
                          </button>
                        </div>
                      ) : (
                        <p className="mt-2 text-sm text-gray-500">No public URL yet. Publish the form to get a shareable link.</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "responses" && (
              <div>
                <p className="text-gray-600">Responses tab  we&apos;ll show recent responses, export options, and simple analytics here.</p>
                <div className="mt-4 p-4 bg-gray-50 rounded-md">(Responses UI placeholder)</div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold">Publishing</h3>
                    <p className="text-sm text-gray-500">Control whether this form is publicly accessible.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={togglePublish}
                      disabled={toggling}
                      className={`px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFBF00]/40 ${
                        form.published ? "bg-[#FFBF00] text-black" : "bg-white text-gray-700 border"
                      }`}
                    >
                      {toggling ? (<span className="flex items-center gap-2"><Loader2 className="animate-spin" size={16} /> Processing</span>) : form.published ? (<><EyeOff size={14}/> Unpublish</>) : (<><Eye size={14}/> Publish</>) }
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-lg border bg-white">
                  <h3 className="text-sm font-semibold">Danger zone</h3>
                  <p className="text-sm text-gray-500 mt-1">Deleting the form will remove all responses permanently.</p>
                  <div className="mt-4">
                    <button
                      onClick={deleteForm}
                      disabled={deleting}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-red-600 text-white"
                    >
                      {deleting ? <Loader2 className="animate-spin" size={14} /> : <Trash2 size={14} />}
                      <span>{deleting ? "Deleting…" : "Delete form"}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
