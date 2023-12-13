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
import { Pencil } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Course } from "@prisma/client";
import { formatPrice } from "@/lib/format";

interface PageProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  price: z.coerce.number()
});

const PriceForm = ({ initialData, courseId }: PageProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const {toast} = useToast()
  const router = useRouter()

  const toggleEdit = () => setIsEditing((prev) => !prev);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        price: initialData?.price || undefined
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values)
      router.refresh()
      toast({
        description: 'description updated',
        variant: 'default'
      })
      setIsEditing(false)
    } catch {
      toast({
        description: 'Something went wrong',
        variant: 'destructive'
      })
    }
  };
 
  return (
    <div className="mt-6 border bg-slate-100 p-4 rounded-md">
      <div className="font-medium flex items-center justify-between">
        Course price
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit price
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p className={cn('text-sm mt-2', !initialData.price && 'text-slate-500 italic')}>{initialData.price ? formatPrice(initialData.price) : 'No price'}</p>
      )}

      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4 mt-4'
          >
            <FormField 
              control={form.control}
              name="price"
              render={({field}) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type='number'
                      step='0.01'
                      placeholder="set a price for your course"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
             />
             <div className='flex items-center gap-x-2'>
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"
              >
                Save
              </Button>
             </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default PriceForm;
