import { FC } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

type Props = {
  form: {
    _id: string;
    title: string;
    description?: string;
    fields: any[];
    color?: string;
    logo?: string;
    responsesCount?: number;
  };
};

const FormInfoCard: FC<{ form: Props["form"] }> = ({ form }) => {
  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition bg-gray-50 flex flex-col gap-2">
      {/* Logo or colored bar */}
      {form.logo ? (
        <Image
          src={form.logo}
          alt="Form Logo"
          width={40}
          height={40}
          className="rounded object-contain"
        />
      ) : (
        <div
          className="h-1 w-full rounded bg-[var(--app-color)]"
          style={{ backgroundColor: form.color || "#FFBF00" }}
        />
      )}

      <h3 className="text-lg font-semibold">{form.title}</h3>
      <p className="text-sm text-gray-600">
        {form.description || "No description"}
      </p>

      <div className="flex flex-wrap justify-between text-sm text-gray-500 mt-2">
        <span>Fields: {form.fields.length}</span>
        <span>Responses: {form.responsesCount ?? 0}</span>
      </div>

      <div className="flex gap-2 mt-4">
        <Link href={`/form/edit/${form._id}`}>
          <Button size="sm" variant="outline">
            <Pencil className="mr-1 w-4 h-4" />
            Edit
          </Button>
        </Link>
        <Button size="sm" variant="destructive">
          <Trash2 className="mr-1 w-4 h-4" />
          Delete
        </Button>
      </div>
    </div>
  );
};

export default FormInfoCard;
