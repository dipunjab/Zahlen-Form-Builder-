// components/ui/loading-screen.tsx

"use client";

import { Loader } from "lucide-react";

const Loading = ({ message = "Loading..." }: { message?: string }) => {
  return (
    <div className="flex items-center justify-center h-[80vh] flex-col gap-4 text-gray-500">
      <Loader className="h-8 w-8 animate-spin text-[var(--app-color)]" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
};

export default Loading;
