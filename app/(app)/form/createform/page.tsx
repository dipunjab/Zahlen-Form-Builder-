"use client";

import { useState } from "react";
import { v4 as uuid } from "uuid";
import { useSession } from "next-auth/react";
import { Eye, Save, PlusCircle, X } from "lucide-react";
import Image from "next/image";
import FormFieldEditor from "@/components/FormFieldEditor";
import FormPreview from "@/components/FormPreview";
import { toast } from "sonner";
import Loading from "@/components/Loading";
import { redirect } from "next/navigation";

type FormField = {
  id: string;
  label: string;
  type:
  | "text"
  | "textarea"
  | "email"
  | "number"
  | "dropdown"
  | "checkbox"
  | "radio"
  | "date"
  | "file";
  required: boolean;
  options?: string[];
};

export default function CreateFormPage() {
  const { data: session, status } = useSession();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#FFBF00");
  const [cover, setCover] = useState<string>("");
  const [logo, setLogo] = useState<string>("");
  const [fields, setFields] = useState<FormField[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const [buttonLoading, setButtonLoading] = useState<"save" | "publish" | null>(null);

  const handleAddField = () => {
    setFields((prev) => [
      ...prev,
      {
        id: uuid(),
        label: "",
        type: "text",
        required: false,
        options: [],
      },
    ]);
  };

  const handleFieldChange = (id: string, key: keyof FormField, value: any) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [key]: value } : f))
    );
  };

  const handleRemoveField = (id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
  };

  const handleImageUpload = (file: File, setter: (url: string) => void) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setter(reader.result as string);
    };
    reader.readAsDataURL(file);
  };


  const handleSubmit = async (publish: boolean) => {
    if (!session?.user?._id) {
      toast.error("You must be logged in to create a form");
      return;
    }

    // ✅ Client-side validation
    if (!title.trim()) {
      toast.error("Form title is required");
      return;
    }

    if (!description.trim()) {
      toast.error("Form description is required");
      return;
    }

    if (fields.length === 0) {
      toast.error("Add at least one field to the form");
      return;
    }

    const hasInvalidField = fields.some(f => !f.label.trim());
    if (hasInvalidField) {
      toast.error("Each field must have a label");
      return;
    }

    setButtonLoading(publish ? "publish" : "save");

    try {
      const response = await fetch("/api/form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          color,
          cover,
          logo,
          fields,
          userId: session.user._id,
          published: publish,
        }),
      });

      const data = await response.json();
      setButtonLoading(null);

      if (!data.success) {
        toast.error("Error saving form");
        return;
      }

      if (publish && data.form.publishedAt) {
        toast.success("Form Published");
        redirect("/dashboard")
      } else {
        toast.success("Form saved as draft");
        redirect("/dashboard")
      }
    } catch (err) {
      console.error("Error creating form:", err);
      toast.error("Something went wrong");
      setButtonLoading(null);
    }
  };


  if (status === "loading") return <Loading message="Loading..." />;

  return (
    <div className="w-full relative">

      {/* Toolbar */}
      <div className="fixed top-2 right-2 z-10 flex flex-row gap-1 sm:gap-3 items-end sm:items-center max-w-[80vw]">
        <button
          onClick={() => setShowPreview(true)}
          className="flex items-center gap-1 px-2 py-1 text-xs sm:text-sm border rounded bg-white hover:bg-gray-50 whitespace-nowrap"
        >
          <Eye className="w-4 h-4" />
          Preview
        </button>

        <button
          onClick={() => handleSubmit(false)}
          disabled={buttonLoading === "save"}
          className="flex items-center gap-1 px-2 py-1 text-xs sm:text-sm border rounded bg-white hover:bg-gray-50 whitespace-nowrap"
        >
          {buttonLoading === "save" ? (
            <span className="animate-spin w-4 h-4 border-2 border-t-transparent border-gray-600 rounded-full" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save
        </button>

        <button
          onClick={() => handleSubmit(true)}
          disabled={buttonLoading === "publish"}
          className="px-3 py-1 text-xs sm:text-sm font-semibold text-gray-700 bg-amber-300 rounded-full hover:brightness-105 whitespace-nowrap"
        >
          {buttonLoading === "publish" ? (
            <span className="animate-spin w-4 h-4 border-2 border-t-transparent border-gray-700 rounded-full inline-block" />
          ) : (
            "PUBLISH"
          )}
        </button>
      </div>


      {/* Main Form */}
      <div className="mt-16 p-6 gap-6 lg:ml-56 space-y-8">
        <input
          className="w-full text-3xl font-bold placeholder:text-gray-500 bg-transparent outline-none"
          placeholder="Untitled Form"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full text-md placeholder:text-gray-600 bg-transparent outline-none resize-none"
          placeholder="Form description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Cover Upload */}
        <div className="space-y-2">
          <label className="font-medium text-gray-700">Cover Image</label>
          <div className="flex items-center gap-4 flex-wrap">
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                e.target.files && handleImageUpload(e.target.files[0], setCover)
              }
            />
            {cover && (
              <button
                onClick={() => setCover("")}
                className="text-red-500 text-sm underline ml-2"
              >
                Remove Image
              </button>
            )}
          </div>
          <div className="w-64 h-36 border rounded overflow-hidden mt-2">
            {cover ? (
              <Image
                src={cover}
                alt="Cover Preview"
                width={256}
                height={144}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                No cover uploaded
              </div>
            )}
          </div>
        </div>

        {/* Logo Upload */}
        <div className="space-y-2">
          <label className="font-medium text-gray-700">Logo</label>
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                e.target.files && handleImageUpload(e.target.files[0], setLogo)
              }
            />
            {logo && (
              <button
                onClick={() => setLogo("")}
                className="text-red-500 text-sm underline"
              >
                Remove Logo
              </button>
            )}
          </div>
          {logo && (
            <Image
              src={logo}
              alt="Logo Preview"
              width={150}
              height={40}
              className="h-10 w-auto object-contain border rounded mt-2"
            />
          )}
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <label className="font-medium text-gray-700">Fields</label>
          {fields.map((field) => (
            <FormFieldEditor
              key={field.id}
              field={field}
              onChange={handleFieldChange}
              onRemove={handleRemoveField}
            />
          ))}
          <button
            onClick={handleAddField}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black"
          >
            <PlusCircle className="w-5 h-5" />
            Add Field
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-auto p-6 relative">
            <button
              onClick={() => setShowPreview(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>
            <FormPreview
              title={title}
              description={description}
              color={color}
              cover={cover}
              logo={logo}
              fields={fields}
            />
          </div>
        </div>
      )}
    </div>
  );
}
