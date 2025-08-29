"use client";
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
import { createCourse } from "@/action/course/course.action";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  instructor_id: z.string().min(36, "Please select an instructor"),
});

type CreateCourseDialogProps = {
  className?: string;
  TriggerButton?: ButtonProps;
};

export function CreateCourseDialog({
  className,
  TriggerButton,
}: CreateCourseDialogProps) {
  const { user } = useUser();
  const router = useRouter();
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Fetch users from Supabase
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from("users").select("*");
        //.eq('role', 'instructor'); // Only fetch instructors

        if (error) {
          console.error("Error fetching users:", error);
          toast.error("Failed to fetch instructors");
          return;
        }

        setUsers(data || []);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch instructors");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      instructor_id: "",
    },
  });

  // Auto-generate slug from title
  const handleTitleChange = (title: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();
    
    form.setValue("slug", slug);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user?.id) {
      toast.error("You must be logged in to create a course");
      return;
    }

    setLoading(true);
    try {
      // Prepare course data
      const courseData = {
        title: values.title,
        slug: values.slug,
        instructor_id: [values.instructor_id], // Convert to array as per database schema
        status: 'draft' as const,
        visibility: 'private' as const,
        description: '',
        tagline: '',
        level: 'beginner' as const,
        language: ['English'],
        tags: [],
        requirements: [],
        learning_outcomes: [],
        seo_title: values.title,
        seo_description: '',
        seo_keywords: [],
        thumbnail_url: null,
        promo_video_url: null,
        duration: null,
        pricing_id: null,
        certificate: null,
        featured: false,
        rating: 0,
        reviews_count: 0,
        enrollments_count: 0,
      };

      const result = await createCourse(courseData, user.id);

      if (result.success && result.course) {
        toast.success("Course created successfully!");
        setDialogOpen(false);
        form.reset();
        
        // Redirect to course edit page
        router.push(`/dashboard/course/${result.course.id}/edit`);
      } else {
        toast.error(result.error || "Failed to create course");
      }
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className={className} {...TriggerButton}>
          <Add />
          Create Course
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Course</DialogTitle>
          <DialogDescription>
            Create a new course by filling out the information below. You'll be redirected to add more details after creation.
          </DialogDescription>
        </DialogHeader>
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
                        handleTitleChange(e.target.value);
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
                    <Input
                      placeholder="course-slug"
                      type="text"
                      {...field}
                    />
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
              name="instructor_id"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Instructor *</FormLabel>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground",
                          )}
                          disabled={loading}
                        >
                          {field.value
                            ? users.find((user) => user.id === field.value)
                                ?.first_name +
                              " " +
                              users.find((user) => user.id === field.value)
                                ?.last_name
                            : "Select instructor..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search instructors..." />
                        <CommandList>
                          <CommandEmpty>
                            {loading
                              ? "Loading instructors..."
                              : "No instructor found."}
                          </CommandEmpty>
                          <CommandGroup>
                            {users.map((user) => (
                              <CommandItem
                                value={`${user.first_name} ${user.last_name}`}
                                key={user.id}
                                onSelect={() => {
                                  form.setValue("instructor_id", user.id);
                                  setOpen(false);
                                }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    user.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {user.first_name} {user.last_name}
                                {user.email && (
                                  <span className="text-muted-foreground ml-2">
                                    ({user.email})
                                  </span>
                                )}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Select an instructor for this course.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" disabled={loading}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Course"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
