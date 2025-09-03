"use client"
import React, { useState } from 'react'
import { motion } from "framer-motion";
import { Copy } from 'lucide-react';



const AboutTab = ({ form }:any) => {
      const [copied, setCopied] = useState(false);

      // Build a full URL for copy behavior
      const getFullPublishedUrl = () => {
        if (!form?.publishedAt) return "";
        const stored = form.publishedAt;
        if (/^https?:\/\//i.test(stored)) return stored;
    
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
    
    return (
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
    )
}

export default AboutTab
