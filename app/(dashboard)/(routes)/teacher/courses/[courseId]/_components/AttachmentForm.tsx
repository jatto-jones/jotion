"use client";

import * as z from "zod";
import axios from "axios";
import { Pencil, PlusCircle, ImageIcon, File, X, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Attachment, Course } from "@prisma/client";
import Image from "next/image";

import { Button } from "@/components/ui/Button";
import { FileUpload } from "@/components/file-upload";

interface AttachmentFormProps {
  initialData: Course & {attachments : Attachment[]}
  courseId: string;
};

const formSchema = z.object({
  url: z.string().min(1)
});

export const AttachmentForm = ({
  initialData,
  courseId
}: AttachmentFormProps) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, values);
      toggleEdit();
      router.refresh();
    } catch {
      toast({
        title: "Something went wrong",
        variant: "destructive",
      });
    }
  }

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id)
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`)
      router.refresh()
    } catch {
      toast({
        title: 'Something went wrong',
        description: 'could not delete attachment',
        variant: 'destructive'
      })
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course attachments
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && (
            <>Cancel</>
          )}
          {!isEditing && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a file
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
      <>
        {initialData.attachments.length === 0 && <p className='text-sm text-slate-500 italic mt-2'>
            No attachments yet
        </p>}
        {initialData.attachments.length > 0 && (
          <div className="space-y-2">
            {initialData.attachments.map((attachment) => (
              <div
                key={attachment.id}
                className='flex items-center w-full rounded-md p-3 border border-sky-200 bg-sky-100 text-sky-700'
              >
                <File className='w-4 h-4 mr-2' />
                <p className='text-xs line-clamp-1'>{attachment.name}</p>
                {deletingId === attachment.id && (
                  <div>
                    <Loader2 className='h-4 w-4 animate-spin' />
                  </div>
                )}
                {deletingId !== attachment.id && (
                  <button 
                    onClick={()=>onDelete(attachment.id)}
                  className='ml-auto hover:opacity-75 transition'>
                    <X className='h-4 w-4' />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </>
      )}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url) => {
              if (url) {
                onSubmit({ url: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Add anything your students might need to complete the course
          </div>
        </div>
      )}
    </div>
  )
}