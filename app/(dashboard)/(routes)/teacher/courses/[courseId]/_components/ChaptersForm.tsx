"use client";

import * as z from "zod";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormDescription,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Loader2, PlusCircle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Course, Chapter } from "@prisma/client";
import { ChaptersList } from "./ChaptersList";

interface PageProps {
  initialData: Course & {chapters: Chapter[]};
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(1)
});

const ChaptersForm = ({ initialData, courseId }: PageProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const {toast} = useToast()
  const router = useRouter()

  const toggleCreating = () => setIsCreating((prev) => !prev);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: ''
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/chapters`, values)
      router.refresh()
      toast({
        description: 'New chapter created',
        variant: 'default'
      })
      toggleCreating()
    } catch {
      toast({
        description: 'Something went wrong',
        variant: 'destructive'
      })
    }
  };

  const onEdit = (id: string) => {
    router.push(`/teacher/courses/${courseId}/chapters/${id}`)
  }

  const onReorder = async(updateData :{id:string, position:number}[]) => {
    try {
      setIsUpdating(true)

      await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
        list: updateData
      })
      toast({
        title: 'chapters reordered'
      })
      router.refresh()
    } catch {
      toast({
        title: 'Something went wrong',
        variant: 'destructive'
      })
    } finally {
      setIsUpdating(false)
    }
  }
 
  return (
    <div className="relative mt-6 border bg-slate-100 p-4 rounded-md">
      {isUpdating && (
        <div className='absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-md flex items-center justify-center'>
          <Loader2 className='animate-spin h-6 w-6 text-sky-700' />
        </div>
      )}
      <div className="font-medium flex items-center justify-between">
        Course chapters
        <Button onClick={toggleCreating} variant="ghost">
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
             Add a chapter
            </>
          )}
        </Button>
      </div>

      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4 mt-4'
          >
            <FormField 
              control={form.control}
              name="title"
              render={({field}) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'Introduction to the course''"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
             />
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"
              >
                Create
              </Button>
          </form>
        </Form>
      )}
      {!isCreating && (
        <div className={cn(
          'text-sm mt-2',
          !initialData.chapters.length && 'text-slate-500 italic'
        )}>
          {!initialData.chapters.length && 'No chapters'}
          <ChaptersList
            onEdit={onEdit}
            onReorder={onReorder}
            items={initialData.chapters || []}
           />
        </div>
      )}
      {!isCreating && (
        <div className='text-xs text-muted-foreground mt-4'>
          Drag and drop to reorder chapters
        </div>
      )}
    </div>
  );
};

export default ChaptersForm;
