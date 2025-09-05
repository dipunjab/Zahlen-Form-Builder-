"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Trash2, Eye, EyeOff, Check, Loader2, ChevronLeft, Edit2 } from "lucide-react";
import AboutTab from "@/components/tabs/AboutTab";
import ResponseTabs from "@/components/tabs/ResponseTabs";
import SettingsTab from "@/components/tabs/SettingsTab";

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

  // Fetch response count
  useEffect(() => {
    const fetchResponseCount = async () => {
      if (!formId) return;

      try {
        const res = await fetch(`/api/form/${formId}/responses/count`);
        const data = await res.json();
        
        
        if (data.success) {
          setForm((prev) => prev ? { ...prev, responseCount: data.count } : prev);
        }
      } catch (err) {
        console.error("Error fetching response count:", err);
      }
    };

    fetchResponseCount();
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
        <div className="flex flex-col md:flex-row md:items-start sm:justify-between gap-4">
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

          <div className="flex flex-wrap gap-2 justify-end max-w-full overflow-x-auto">
            <button
              onClick={togglePublish}
              disabled={toggling}
              className={`min-w-[100px] inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFBF00]/50 ${form.published
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
              className="min-w-[100px] inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-white border text-sm font-medium shadow-sm hover:bg-gray-50"
            >
              <Edit2 size={16} /> Edit
            </button>

            <button
              onClick={deleteForm}
              disabled={deleting}
              className="min-w-[100px] inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-red-600 text-white text-sm shadow-sm hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-red-300"
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
                className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${activeTab === t.id ? "bg-[#FFBF00] text-black" : "text-gray-600 hover:bg-gray-50"
                  }`}
              >
                {t.label}
              </button>
            ))}
          </nav>

          <div className="mt-6">
            {activeTab === "about" && (
              <AboutTab form={form} />
            )}

            {activeTab === "responses" && (
              <ResponseTabs />
            )}

            {activeTab === "settings" && (
              <SettingsTab form={form} togglePublish={togglePublish} toggling={toggling} deleteForm={deleteForm} deleting={deleting} />
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
