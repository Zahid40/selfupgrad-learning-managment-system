"use client";
import React from "react";
import RichTextInput from "../rich-text-editor";
import { CourseType } from "@/types/type";
import { Button, ButtonProps } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Add, Check } from "iconsax-reactjs";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ChevronsUpDown } from "lucide-react";
import { supabase } from "@/lib/client";
import { UserType } from "@/types/user.type";
import { useUser } from "@/components/provider/user-provider";
import { createCourse, updateCourse } from "@/action/course/course.action";
import { useRouter } from "next/navigation";

const courseDetailsFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens",
    ),
  //   instructor_id: z.string().min(36, "Please select an instructor"),
});

export default function CourseDetailsForm(props: { courseData: CourseType }) {
  const CD = props.courseData;
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const form = useForm<z.infer<typeof courseDetailsFormSchema>>({
    resolver: zodResolver(courseDetailsFormSchema),
    defaultValues: {
      title: CD.title,
      description: CD.description || "",
      slug: CD.slug,
      //   instructor_id: CD.instructor_id || "",
    },
  });

  async function onSubmit(values: z.infer<typeof courseDetailsFormSchema>) {
    console.log("Form Data:", values);
    setLoading(true);
    try {
      // Prepare course data
      const courseData = {
        title: values.title,
        slug: values.slug,
        description: values.description,
      };

      const result = await updateCourse(CD.id, courseData, user.id);

      if (result.success && result.course) {
        toast.success("Course updated successfully!");
        form.reset();

        // Redirect to course edit page
        router.push(`/dashboard/course/${result.course.id}/edit`);
      } else {
        toast.error(result.error || "Failed to update course");
      }
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    } finally {
      setLoading(false);
    }
    return;
  }

  return (
    <div className="flex">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter course title"
                    type="text"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  This is course public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug *</FormLabel>
                <FormControl>
                  <Input placeholder="course-slug" type="text" {...field} />
                </FormControl>
                <FormDescription>
                  URL-friendly identifier for the course.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <RichTextInput
                    value={field.value}
                    onChange={(e) => field.onChange(e)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button variant="outline" disabled={loading}>
            Cancel
          </Button>

          <Button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Course"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
