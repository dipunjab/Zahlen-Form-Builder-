import { unparse } from "papaparse";

export function downloadResponsesAsCSV(responses: {
  _id: string;
  createdAt: string;
  responses: {
    label: string;
    value: any;
  }[];
}[]) {
  const rows = responses.map((res) => {
    const row: Record<string, string> = {
      "Submitted At": res.createdAt, 
    };

    res.responses.forEach((field) => {
      row[field.label] = String(field.value);
    });

    return row;
  });

  const csv = unparse(rows);

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `form-responses-${new Date().toISOString()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
