"use client";
import React from "react";
import RichTextInput from "../rich-text-editor";
import { CourseType } from "@/types/type";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ChevronsUpDown, Check, X } from "lucide-react";
import { useUser } from "@/components/provider/user-provider";
import { updateCourse } from "@/action/course/course.action";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

const courseDetailsFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  tagline: z.string().max(200, "Tagline must be less than 200 characters").optional(),
  description: z.string().optional(),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens",
    ),
  category_id: z.string().optional(),
  level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  language: z.array(z.string()).min(1, "Select at least one language"),
  tags: z.array(z.string()).optional(),
  duration: z.string().optional(),
});

// Mock data - replace with actual API calls
const categories = [
  { id: "1", name: "Web Development", slug: "web-development" },
  { id: "2", name: "Mobile Development", slug: "mobile-development" },
  { id: "3", name: "Data Science", slug: "data-science" },
  { id: "4", name: "Design", slug: "design" },
  { id: "5", name: "Business", slug: "business" },
];

const languageOptions = [
  "English",
  "Hindi",
  "Spanish",
  "French",
  "German",
  "Mandarin",
  "Japanese",
  "Korean",
];

export default function CourseDetailsForm(props: { courseData: CourseType }) {
  const CD = props.courseData;
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [categoryOpen, setCategoryOpen] = React.useState(false);
  const [languageOpen, setLanguageOpen] = React.useState(false);
  const [tagInput, setTagInput] = React.useState("");

  const form = useForm<z.infer<typeof courseDetailsFormSchema>>({
    resolver: zodResolver(courseDetailsFormSchema),
    defaultValues: {
      title: CD.title || "",
      tagline: CD.tagline || "",
      description: CD.description || "",
      slug: CD.slug || "",
      category_id: CD.category_id || "",
      level: CD.level || undefined,
      language: CD.language || ["English"],
      tags: CD.tags || [],
      duration: CD.duration || "",
    },
  });

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const currentTags = form.getValues("tags") || [];
      if (!currentTags.includes(tagInput.trim())) {
        form.setValue("tags", [...currentTags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = form.getValues("tags") || [];
    form.setValue(
      "tags",
      currentTags.filter((tag) => tag !== tagToRemove)
    );
  };

  const handleRemoveLanguage = (langToRemove: string) => {
    const currentLanguages = form.getValues("language") || [];
    if (currentLanguages.length > 1) {
      form.setValue(
        "language",
        currentLanguages.filter((lang) => lang !== langToRemove)
      );
    } else {
      toast.error("At least one language is required");
    }
  };

  async function onSubmit(values: z.infer<typeof courseDetailsFormSchema>) {
    console.log("Form Data:", values);
    setLoading(true);
    try {
      const result = await updateCourse(CD.id, values, user?.id!);

      if (result.success && result.course) {
        toast.success("Course updated successfully!");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update course");
      }
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-4xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Title *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Complete Web Development Bootcamp"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  The main title that will appear on your course page.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Slug */}
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL Slug *</FormLabel>
                <FormControl>
                  <Input placeholder="complete-web-development-bootcamp" type="text" {...field} />
                </FormControl>
                <FormDescription>
                  URL-friendly identifier (lowercase, numbers, and hyphens only).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Tagline */}
          <FormField
            control={form.control}
            name="tagline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tagline</FormLabel>
                <FormControl>
                  <Input
                    placeholder="A short, catchy description of your course"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Brief one-liner that appears in course listings (max 200 characters).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category */}
          <FormField
            control={form.control}
            name="category_id"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Category</FormLabel>
                <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? categories.find((cat) => cat.id === field.value)?.name
                          : "Select category"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search category..." />
                      <CommandList>
                        <CommandEmpty>No category found.</CommandEmpty>
                        <CommandGroup>
                          {categories.map((category) => (
                            <CommandItem
                              key={category.id}
                              value={category.name}
                              onSelect={() => {
                                form.setValue("category_id", category.id);
                                setCategoryOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  category.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {category.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Choose the main category for your course.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Level */}
          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Difficulty Level</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  The skill level required for this course.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Language */}
          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Languages *</FormLabel>
                <Popover open={languageOpen} onOpenChange={setLanguageOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "justify-between",
                          !field.value?.length && "text-muted-foreground"
                        )}
                      >
                        {field.value?.length
                          ? `${field.value.length} language(s) selected`
                          : "Select languages"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search language..." />
                      <CommandList>
                        <CommandEmpty>No language found.</CommandEmpty>
                        <CommandGroup>
                          {languageOptions.map((language) => (
                            <CommandItem
                              key={language}
                              value={language}
                              onSelect={() => {
                                const currentLanguages = field.value || [];
                                if (currentLanguages.includes(language)) {
                                  if (currentLanguages.length > 1) {
                                    form.setValue(
                                      "language",
                                      currentLanguages.filter((l) => l !== language)
                                    );
                                  }
                                } else {
                                  form.setValue("language", [...currentLanguages, language]);
                                }
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  field.value?.includes(language)
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {language}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <div className="flex flex-wrap gap-2 mt-2">
                  {field.value?.map((lang) => (
                    <Badge key={lang} variant="secondary" className="gap-1">
                      {lang}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleRemoveLanguage(lang)}
                      />
                    </Badge>
                  ))}
                </div>
                <FormDescription>
                  Select all languages in which the course is available.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Duration */}
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Duration</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., 12 hours, 6 weeks"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Estimated time to complete the course.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Tags */}
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Type a tag and press Enter"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                  />
                </FormControl>
                <div className="flex flex-wrap gap-2 mt-2">
                  {field.value?.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleRemoveTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
                <FormDescription>
                  Add tags to help students find your course (press Enter to add).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Description</FormLabel>
                <FormControl>
                  <RichTextInput
                    value={field.value}
                    onChange={(e) => field.onChange(e)}
                  />
                </FormControl>
                <FormDescription>
                  Detailed description of what the course covers.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}