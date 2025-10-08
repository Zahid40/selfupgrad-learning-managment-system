"use client";
import React from "react";
import { CourseType } from "@/types/type";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useUser } from "@/components/provider/user-provider";
import { updateCourse } from "@/action/course/course.action";
import { useRouter } from "next/navigation";
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Globe, 
  Archive, 
  AlertTriangle,
  CheckCircle2,
  Clock
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

const courseSettingsFormSchema = z.object({
  status: z.enum(["draft", "published", "archived"], {
    required_error: "Please select a course status",
  }),
  visibility: z.enum(["public", "private", "unlisted"], {
    required_error: "Please select a visibility option",
  }),
  featured: z.boolean().default(false),
});

type CourseSettingsFormValues = z.infer<typeof courseSettingsFormSchema>;

export default function CourseSettingsForm(props: { courseData: CourseType }) {
  const CD = props.courseData;
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = React.useState(false);

  const form = useForm<CourseSettingsFormValues>({
    resolver: zodResolver(courseSettingsFormSchema),
    defaultValues: {
      status: CD.status || "draft",
      visibility: CD.visibility || "private",
      featured: CD.featured || false,
    },
  });

  const watchStatus = form.watch("status");
  const watchVisibility = form.watch("visibility");

  async function onSubmit(values: CourseSettingsFormValues) {
    // If archiving, show confirmation dialog
    if (values.status === "archived" && CD.status !== "archived") {
      setShowArchiveDialog(true);
      return;
    }

    await handleUpdate(values);
  }

  async function handleUpdate(values: CourseSettingsFormValues) {
    console.log("Form Data:", values);
    setLoading(true);
    try {
      const result = await updateCourse(CD.id, values, user?.id!);

      if (result.success && result.course) {
        toast.success("Course settings updated successfully!");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update course settings");
      }
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    } finally {
      setLoading(false);
      setShowArchiveDialog(false);
    }
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "draft":
        return {
          icon: Clock,
          color: "text-yellow-600 dark:text-yellow-400",
          bg: "bg-yellow-50 dark:bg-yellow-950/30",
          border: "border-yellow-200 dark:border-yellow-800",
          description: "Course is in draft mode and not visible to students",
        };
      case "published":
        return {
          icon: CheckCircle2,
          color: "text-green-600 dark:text-green-400",
          bg: "bg-green-50 dark:bg-green-950/30",
          border: "border-green-200 dark:border-green-800",
          description: "Course is live and accessible to students",
        };
      case "archived":
        return {
          icon: Archive,
          color: "text-gray-600 dark:text-gray-400",
          bg: "bg-gray-50 dark:bg-gray-950/30",
          border: "border-gray-200 dark:border-gray-800",
          description: "Course is archived and no longer accessible",
        };
      default:
        return {
          icon: Clock,
          color: "text-gray-600",
          bg: "bg-gray-50",
          border: "border-gray-200",
          description: "",
        };
    }
  };

  const getVisibilityInfo = (visibility: string) => {
    switch (visibility) {
      case "public":
        return {
          icon: Globe,
          color: "text-blue-600 dark:text-blue-400",
          description: "Anyone can discover and view this course",
        };
      case "private":
        return {
          icon: Lock,
          color: "text-orange-600 dark:text-orange-400",
          description: "Only enrolled students can access this course",
        };
      case "unlisted":
        return {
          icon: EyeOff,
          color: "text-purple-600 dark:text-purple-400",
          description: "Hidden from search, accessible via direct link only",
        };
      default:
        return {
          icon: Lock,
          color: "text-gray-600",
          description: "",
        };
    }
  };

  const statusInfo = getStatusInfo(watchStatus);
  const visibilityInfo = getVisibilityInfo(watchVisibility);
  const StatusIcon = statusInfo.icon;
  const VisibilityIcon = visibilityInfo.icon;

  return (
    <div className="w-full max-w-4xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Course Status Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Course Status</h3>
              <p className="text-sm text-muted-foreground">
                Control whether your course is active, in development, or archived
              </p>
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select course status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="draft">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-yellow-600" />
                          <span>Draft</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="published">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span>Published</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="archived">
                        <div className="flex items-center gap-2">
                          <Archive className="h-4 w-4 text-gray-600" />
                          <span>Archived</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status Info Card */}
            <div
              className={`rounded-lg border p-4 ${statusInfo.bg} ${statusInfo.border}`}
            >
              <div className="flex items-start gap-3">
                <StatusIcon className={`h-5 w-5 mt-0.5 ${statusInfo.color}`} />
                <div className="flex-1">
                  <p className={`font-medium ${statusInfo.color}`}>
                    {watchStatus.charAt(0).toUpperCase() + watchStatus.slice(1)} Mode
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {statusInfo.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Course Visibility Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Course Visibility</h3>
              <p className="text-sm text-muted-foreground">
                Manage who can discover and access your course
              </p>
            </div>

            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visibility *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select visibility option" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="public">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-blue-600" />
                          <span>Public</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="private">
                        <div className="flex items-center gap-2">
                          <Lock className="h-4 w-4 text-orange-600" />
                          <span>Private</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="unlisted">
                        <div className="flex items-center gap-2">
                          <EyeOff className="h-4 w-4 text-purple-600" />
                          <span>Unlisted</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Visibility Info Card */}
            <div className="rounded-lg border p-4 bg-muted/50">
              <div className="flex items-start gap-3">
                <VisibilityIcon className={`h-5 w-5 mt-0.5 ${visibilityInfo.color}`} />
                <div className="flex-1">
                  <p className="font-medium">
                    {watchVisibility.charAt(0).toUpperCase() + watchVisibility.slice(1)} Course
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {visibilityInfo.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Featured Course Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Featured Course</h3>
              <p className="text-sm text-muted-foreground">
                Highlight this course in featured sections and recommendations
              </p>
            </div>

            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Feature This Course</FormLabel>
                    <FormDescription>
                      Featured courses appear in the homepage carousel and get priority in search results
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <Separator />

          {/* Course Metadata (Read-only) */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Course Metadata</h3>
              <p className="text-sm text-muted-foreground">
                Read-only information about your course
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg border p-4 bg-muted/30">
                <Label className="text-sm text-muted-foreground">Course ID</Label>
                <p className="font-mono text-sm mt-1 break-all">{CD.id}</p>
              </div>

              <div className="rounded-lg border p-4 bg-muted/30">
                <Label className="text-sm text-muted-foreground">Created At</Label>
                <p className="text-sm mt-1">
                  {CD.created_at ? new Date(CD.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }) : "N/A"}
                </p>
              </div>

              <div className="rounded-lg border p-4 bg-muted/30">
                <Label className="text-sm text-muted-foreground">Last Updated</Label>
                <p className="text-sm mt-1">
                  {CD.updated_at ? new Date(CD.updated_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }) : "N/A"}
                </p>
              </div>

              <div className="rounded-lg border p-4 bg-muted/30">
                <Label className="text-sm text-muted-foreground">Total Enrollments</Label>
                <p className="text-sm mt-1">{CD.enrollments_count || 0} students</p>
              </div>
            </div>
          </div>

          {/* Warning for Published Courses */}
          {watchStatus === "published" && CD.status === "draft" && (
            <div className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-blue-900 dark:text-blue-100">
                    Ready to Publish?
                  </p>
                  <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                    Once published, students will be able to enroll and access your course content. Make sure all chapters, lessons, and pricing are configured correctly.
                  </p>
                </div>
              </div>
            </div>
          )}

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
              {loading ? "Updating..." : "Save Settings"}
            </Button>
          </div>
        </form>
      </Form>

      {/* Archive Confirmation Dialog */}
      <AlertDialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Archive This Course?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Archiving this course will make it inaccessible to all students, including those currently enrolled.
              </p>
              <p className="font-medium">
                Current enrollments: {CD.enrollments_count || 0} students
              </p>
              <p className="text-sm">
                Archived courses can be restored later, but students will lose access immediately.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={loading}
              onClick={() => handleUpdate(form.getValues())}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {loading ? "Archiving..." : "Archive Course"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
