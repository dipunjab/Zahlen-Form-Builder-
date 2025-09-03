import React from "react";
import { X } from "lucide-react";

interface Props {
  response: {
    _id: string;
    createdAt: string;
    responses: {
      label: string;
      value: any;
    }[];
  };
  onClose: () => void;
}

const ResponseModal = ({ response, onClose }: Props) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
        >
          <X size={20} />
        </button>
        <h2 className="text-lg font-bold mb-4">Response Details</h2>
        <p className="text-sm text-gray-500 mb-4">
          Submitted at: {new Date(response.createdAt).toLocaleString()}
        </p>
        <div className="space-y-2">
          {response.responses.map((field, idx) => (
            <div key={idx}>
              <div className="text-sm font-medium text-gray-700">{field.label}</div>
              <div className="text-sm text-gray-600">{String(field.value)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResponseModal;
