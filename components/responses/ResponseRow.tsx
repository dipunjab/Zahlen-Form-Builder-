import React, { useState } from "react";
import { Eye } from "lucide-react";
import ResponseModal from "./ResponseModal";

interface Props {
  response: {
    _id: string;
    createdAt: string;
    responses: {
      label: string;
      value: any;
    }[];
  };
}

const ResponseRow = ({ response }: Props) => {
  const [open, setOpen] = useState(false);
  const firstThree = response.responses.slice(0, 3);

  return (
    <>
      <tr className="border-t hover:bg-gray-50 transition">
        <td className="px-4 py-2 whitespace-nowrap text-gray-700">
          {new Date(response.createdAt).toLocaleString()}
        </td>
        {firstThree.map((f, idx) => (
          <td key={idx} className="px-4 py-2 whitespace-nowrap text-gray-600 max-w-[150px] truncate">
            {String(f.value)}
          </td>
        ))}
        {[...Array(3 - firstThree.length)].map((_, idx) => (
          <td key={idx} className="px-4 py-2 whitespace-nowrap text-gray-400">—</td>
        ))}
        <td className="px-4 py-2 text-center">
          <button
            onClick={() => setOpen(true)}
            className="text-blue-600 hover:underline flex items-center justify-center"
          >
            <Eye size={16} />
          </button>
        </td>
      </tr>
      {open && (
        <ResponseModal
          response={response}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default ResponseRow;
