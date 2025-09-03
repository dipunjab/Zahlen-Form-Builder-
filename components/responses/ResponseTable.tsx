import React from "react";
import ResponseRow from "./ResponseRow";

interface Props {
  responses: {
    _id: string;
    createdAt: string;
    responses: {
      label: string;
      value: any;
    }[];
  }[];
}

const ResponseTable = ({ responses }: Props) => {
  const firstThreeLabels =
    responses.length > 0
      ? responses[0].responses.slice(0, 3).map((r) => r.label)
      : [];

  return (
    <div className="overflow-x-auto border rounded-md shadow-sm">
      <table className="w-full table-auto text-sm text-left">
        <thead className="bg-gray-100 text-gray-700 font-semibold">
          <tr>
            <th className="px-4 py-2 whitespace-nowrap">Submitted At</th>
            {firstThreeLabels.map((label, idx) => (
              <th key={idx} className="px-4 py-2 whitespace-nowrap">{label}</th>
            ))}
            <th className="px-4 py-2 whitespace-nowrap text-center">View</th>
          </tr>
        </thead>
        <tbody>
          {responses.map((res) => (
            <ResponseRow key={res._id} response={res} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResponseTable;
