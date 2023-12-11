"use client";

import { UploadDropzone } from "@/utils/uploadthing";
import { useToast } from "./ui/use-toast";
import { ourFileRouter } from "@/app/api/uploadthing/core";

interface FileUploadProps {
  onChange: (url?: string) => void;
  endpoint: keyof typeof ourFileRouter;
}

export const FileUpload = ({ onChange, endpoint }: FileUploadProps) => {
  const { toast } = useToast();

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      onUploadError={() => {
        toast({
          title: "Something went wrong",
          variant: "destructive",
        });
      }}
    />
  );
};
