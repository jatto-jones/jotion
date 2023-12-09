"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import axios from 'axios'
import {
  Form,
  FormDescription,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "title is required!",
  }),
});

const page = () => {
  const router = useRouter()
  const {toast} = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try{
      const response = await axios.post('/api/courses', values)
      router.push(`/teacher/courses/${response.data.id}`)
      toast({
        title: 'New Course Created!',
        variant: 'default'
      })
    }catch{
      toast({
        title: 'Something went wrong',
        variant: 'destructive'
      })
    }
  };

  return (
    <div className="flex max-w-5xl mx-auto md:items-center md:justify-center h-full p-6">
      <div>
        <h1 className="text-2xl">Name your course</h1>
        <p className="text-sm text-slate-600">
          What would you like to name your course? Don&apos;t worry, you can
          change this later.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Course title</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="e.g. Advanced web development"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      What will you teach in this course?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <div className="flex items-center gap-x-2">
              <Link href="/">
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={!isValid || isSubmitting}>
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default page;
