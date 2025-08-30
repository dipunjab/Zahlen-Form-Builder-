"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type Form = {
  _id: string;
  title: string;
  description?: string;
  cover?: string;
  logo?: string;
  color?: string;
  published: boolean;
  createdAt: string;
};

const Dashboard = () => {
  const { data: session, status } = useSession();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session?.user?.email) return;

    const fetchForms = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/form?userId=${session.user.email}`);
        const data = await res.json();
        if (data.success) setForms(data.forms);
      } catch (err) {
        console.error("Error fetching forms:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, [session]);

  if (status === "loading") return <div>Loading session...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Forms</h1>
      {loading ? (
        <div>Loading forms...</div>
      ) : forms.length === 0 ? (
        <div>No forms found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {forms.map(form => (
            <div
              key={form._id}
              className="border rounded p-4 shadow hover:shadow-lg transition"
            >
              <div
                className="h-32 w-full rounded mb-2"
                style={{ background: form.cover || form.color || "#FFBF00" }}
              >
                {form.cover && form.cover.startsWith("http") && (
                  <img
                    src={form.cover}
                    alt="cover"
                    className="h-32 w-full object-cover rounded"
                  />
                )}
              </div>
              <h2 className="text-xl font-semibold">{form.title}</h2>
              {form.description && <p className="text-gray-600">{form.description}</p>}
              <p className="text-sm text-gray-500 mt-1">
                Published: {form.published ? "Yes" : "No"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
