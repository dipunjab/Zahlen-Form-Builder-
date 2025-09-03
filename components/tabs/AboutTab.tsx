"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Copy } from "lucide-react";
import { toast } from "sonner";

const AboutTab = ({ form }: any) => {
  const [copied, setCopied] = useState(false);

  const getFullPublishedUrl = () => {
    if (!form?.publishedAt) return "";
    const stored = form.publishedAt;
    if (/^https?:\/\//i.test(stored)) return stored;

    const envUrl =
      typeof process !== "undefined"
        ? process.env.NEXT_PUBLIC_APP_URL || ""
        : "";
    try {
      const origin =
        envUrl.replace(/\/$/, "") ||
        (typeof window !== "undefined" ? window.location.origin : "");
      if (!origin) return stored;
      return origin + (stored.startsWith("/") ? stored : `/${stored}`);
    } catch (e) {
      return stored.startsWith("/")
        ? `${window.location.origin}${stored}`
        : `${window.location.origin}/${stored}`;
    }
  };

  const copyPublishUrl = async () => {
    const full = getFullPublishedUrl();
    if (!full) return;
    try {
      await navigator.clipboard.writeText(full);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast("URL Copied To clipboard.");
  
    } catch (err) {
      console.error("copy failed", err);
      toast("Failed to copy URL. Try selecting and copying manually.");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="grid grid-cols-1 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm sm:text-base font-semibold text-gray-700">
            Basic details
          </h3>

          <div className="mt-3 text-sm sm:text-base text-gray-700 space-y-3">
            {[
              { label: "Title", value: form.title },
              {
                label: "Created",
                value: new Date(form.createdAt).toLocaleString(),
              },
              { label: "Status", value: form.published ? "Published" : "Draft" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-3"
              >
                <div className="text-gray-600 font-medium">{item.label}</div>
                <div className="text-gray-900 break-all">{item.value}</div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h4 className="text-sm sm:text-base font-semibold text-gray-700">
              Publish URL
            </h4>

            {form.publishedAt ? (
              <div className="mt-2 flex flex-col sm:flex-row gap-2">
                <input
                  readOnly
                  value={getFullPublishedUrl()}
                  className="flex-1 text-sm px-3 py-2 rounded-md border bg-white"
                />
                <button
                  onClick={copyPublishUrl}
                  className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-[#FFBF00] text-black font-medium text-sm"
                >
                  <Copy size={14} />
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            ) : (
              <p className="mt-2 text-sm text-gray-500">
                No public URL yet. Publish the form to get a shareable link.
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AboutTab;
