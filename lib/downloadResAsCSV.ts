import { unparse } from "papaparse";

export function downloadResponsesAsCSV(responses: {
  _id: string;
  createdAt: string;
  responses: {
    label: string;
    value: any;
  }[]; 
}[]) {
  const parseValue = (value: any) => {
    if (typeof value === "object" && value !== null) {
      if ("url" in value && typeof value.url === "string") {
        return value.url;
      }
      return JSON.stringify(value); // fallback
    }
    return String(value);
  };

  const rows = responses.map((res) => {
    const row: Record<string, string> = {
      "Submitted At": new Date(res.createdAt).toLocaleString(),
    };

    res.responses.forEach((field) => {
      row[field.label] = parseValue(field.value);
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
