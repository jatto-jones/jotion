"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const GoBack = () => {
  const router = useRouter();
  return (
    <div
      className="flex items-center text-sm hover:opacity-75 transition mb-6 hover:cursor-pointer"
      onClick={() => router.back()}
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back to course setup
    </div>
  );
};

export default GoBack;
