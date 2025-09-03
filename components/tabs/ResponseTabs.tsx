"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ResponseTable from "../responses/ResponseTable";

interface Response {
  _id: string;
  createdAt: string;
  responses: {
    label: string;
    value: any;
  }[];
}

const ResponseTabs = () => {
  const { formId } = useParams();
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const res = await fetch(`/api/form/${formId}/responses`);
        const data = await res.json();
        
        if (data.success) setResponses(data.data);
      } catch (err) {
        console.error("Failed to fetch responses:", err);
      } finally {
        setLoading(false);
      }
    };

    if (formId) fetchResponses();
  }, [formId]);

  return (
    <div>
      {loading ? (
        <p className="text-gray-600">Loading responses...</p>
      ) : responses.length === 0 ? (
        <p className="text-gray-600">No responses yet.</p>
      ) : (
        <ResponseTable responses={responses} />
      )}

      
    </div>
  );
};

export default ResponseTabs;
