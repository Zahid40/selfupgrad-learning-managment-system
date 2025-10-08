"use client";
import React, { useState, useEffect } from "react";
import { CourseType } from "@/types/type";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/components/provider/user-provider";
import { updateCourse } from "@/action/course/course.action";
import { useRouter } from "next/navigation";
import {
  Search,
  Tag,
  FileText,
  Link2,
  X,
  TrendingUp,
  Eye,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

const seoFormSchema = z.object({
  seo_title: z
    .string()
    .min(30, "SEO title should be at least 30 characters")
    .max(60, "SEO title should be less than 60 characters")
    .optional(),
  seo_description: z
    .string()
    .min(120, "SEO description should be at least 120 characters")
    .max(160, "SEO description should be less than 160 characters")
    .optional(),
  seo_keywords: z.array(z.string()).min(3, "Add at least 3 keywords").max(10, "Maximum 10 keywords"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    ),
});

type SEOFormValues = z.infer<typeof seoFormSchema>;

interface SEOScore {
  score: number;
  checks: {
    label: string;
    passed: boolean;
    message: string;
  }[];
}

export default function CourseSEOForm(props: { courseData: CourseType }) {
  const CD = props.courseData;
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [keywordInput, setKeywordInput] = useState("");
  const [seoScore, setSeoScore] = useState<SEOScore>({ score: 0, checks: [] });

  const form = useForm<SEOFormValues>({
    resolver: zodResolver(seoFormSchema),
    defaultValues: {
      seo_title: CD.seo_title || "",
      seo_description: CD.seo_description || "",
      seo_keywords: CD.seo_keywords || [],
      slug: CD.slug || "",
    },
  });

  const seoTitle = form.watch("seo_title");
  const seoDescription = form.watch("seo_description");
  const seoKeywords = form.watch("seo_keywords");
  const slug = form.watch("slug");

  // Calculate SEO Score
  useEffect(() => {
    const checks = [
      {
        label: "SEO Title Length",
        passed: (seoTitle?.length || 0) >= 30 && (seoTitle?.length || 0) <= 60,
        message:
          (seoTitle?.length || 0) >= 30 && (seoTitle?.length || 0) <= 60
            ? "Perfect title length (30-60 characters)"
            : `Title is ${seoTitle?.length || 0} characters (recommended: 30-60)`,
      },
      {
        label: "Meta Description Length",
        passed:
          (seoDescription?.length || 0) >= 120 &&
          (seoDescription?.length || 0) <= 160,
        message:
          (seoDescription?.length || 0) >= 120 &&
          (seoDescription?.length || 0) <= 160
            ? "Perfect description length (120-160 characters)"
            : `Description is ${seoDescription?.length || 0} characters (recommended: 120-160)`,
      },
      {
        label: "Keywords Count",
        passed: (seoKeywords?.length || 0) >= 3 && (seoKeywords?.length || 0) <= 10,
        message:
          (seoKeywords?.length || 0) >= 3 && (seoKeywords?.length || 0) <= 10
            ? `Great! You have ${seoKeywords?.length || 0} keywords`
            : `You have ${seoKeywords?.length || 0} keywords (recommended: 3-10)`,
      },
      {
        label: "URL Slug",
        passed: slug.length >= 3 && /^[a-z0-9-]+$/.test(slug),
        message:
          slug.length >= 3 && /^[a-z0-9-]+$/.test(slug)
            ? "SEO-friendly URL slug"
            : "Slug should use lowercase, numbers, and hyphens only",
      },
      {
        label: "Keyword in Title",
        passed:
          seoKeywords?.some((keyword) =>
            seoTitle?.toLowerCase().includes(keyword.toLowerCase())
          ) || false,
        message:
          seoKeywords?.some((keyword) =>
            seoTitle?.toLowerCase().includes(keyword.toLowerCase())
          )
            ? "Primary keyword found in title"
            : "Consider adding a keyword to your title",
      },
      {
        label: "Keyword in Description",
        passed:
          seoKeywords?.some((keyword) =>
            seoDescription?.toLowerCase().includes(keyword.toLowerCase())
          ) || false,
        message:
          seoKeywords?.some((keyword) =>
            seoDescription?.toLowerCase().includes(keyword.toLowerCase())
          )
            ? "Keywords found in description"
            : "Add keywords to your description",
      },
    ];

    const passedChecks = checks.filter((check) => check.passed).length;
    const score = Math.round((passedChecks / checks.length) * 100);

    setSeoScore({ score, checks });
  }, [seoTitle, seoDescription, seoKeywords, slug]);

  // Add keyword
  const handleAddKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && keywordInput.trim()) {
      e.preventDefault();
      const currentKeywords = form.getValues("seo_keywords") || [];
      
      if (currentKeywords.length >= 10) {
        toast.error("Maximum 10 keywords allowed");
        return;
      }

      if (currentKeywords.includes(keywordInput.trim())) {
        toast.error("Keyword already exists");
        return;
      }

      form.setValue("seo_keywords", [...currentKeywords, keywordInput.trim()]);
      setKeywordInput("");
    }
  };

  // Remove keyword
  const handleRemoveKeyword = (keywordToRemove: string) => {
    const currentKeywords = form.getValues("seo_keywords") || [];
    form.setValue(
      "seo_keywords",
      currentKeywords.filter((keyword) => keyword !== keywordToRemove)
    );
  };

  // Generate slug from title
  const generateSlug = () => {
    const title = CD.title || "";
    const generatedSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
    
    form.setValue("slug", generatedSlug);
    toast.success("Slug generated from course title");
  };

  // Auto-fill from course data
  const autoFillSEO = () => {
    if (!seoTitle && CD.title) {
      form.setValue("seo_title", CD.title.substring(0, 60));
    }
    if (!seoDescription && CD.description) {
      const plainDescription = CD.description
        .replace(/<[^>]*>/g, "")
        .substring(0, 160);
      form.setValue("seo_description", plainDescription);
    }
    if (!seoKeywords?.length && CD.tags) {
      form.setValue("seo_keywords", CD.tags.slice(0, 5));
    }
    toast.success("SEO fields auto-filled from course data");
  };

  async function onSubmit(values: SEOFormValues) {
    console.log("SEO Data:", values);
    setLoading(true);

    try {
      const result = await updateCourse(CD.id, values, user?.id!);

      if (result.success) {
        toast.success("SEO settings updated successfully!");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update SEO");
      }
    } catch (error) {
      console.error("SEO update error", error);
      toast.error("Failed to update SEO. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Improvement";
  };

  return (
    <div className="w-full max-w-4xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* SEO Score Card */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    SEO Score
                  </CardTitle>
                  <CardDescription>
                    How well optimized is your course for search engines
                  </CardDescription>
                </div>
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getScoreColor(seoScore.score)}`}>
                    {seoScore.score}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {getScoreLabel(seoScore.score)}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={seoScore.score} className="h-2" />
              
              <div className="space-y-2">
                {seoScore.checks.map((check, index) => (
                  <div key={index} className="flex items-start gap-3 text-sm">
                    {check.passed ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="font-medium">{check.label}</div>
                      <div className="text-muted-foreground text-xs">{check.message}</div>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={autoFillSEO}
                className="w-full"
              >
                <Lightbulb className="mr-2 h-4 w-4" />
                Auto-fill from Course Data
              </Button>
            </CardContent>
          </Card>

          {/* SEO Title */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Page Title (Meta Title)
              </CardTitle>
              <CardDescription>
                The title that appears in search engine results
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="seo_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SEO Title *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Learn Web Development - Complete Guide 2024"
                        {...field}
                      />
                    </FormControl>
                    <div className="flex items-center justify-between text-xs">
                      <FormDescription>
                        Optimal length: 30-60 characters
                      </FormDescription>
                      <span
                        className={`font-medium ${
                          (field.value?.length || 0) >= 30 &&
                          (field.value?.length || 0) <= 60
                            ? "text-green-600 dark:text-green-400"
                            : "text-orange-600 dark:text-orange-400"
                        }`}
                      >
                        {field.value?.length || 0}/60
                      </span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Preview */}
              <div className="rounded-lg border bg-muted/50 p-4">
                <div className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
                  <Eye className="h-3 w-3" />
                  Search Engine Preview
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-400 font-medium truncate">
                  {seoTitle || "Your course title will appear here"}
                </div>
                <div className="text-xs text-green-700 dark:text-green-500 mt-1">
                  {window.location.origin}/course/{slug || "course-slug"}
                </div>
                <div className="text-xs text-muted-foreground mt-2 line-clamp-2">
                  {seoDescription || "Your course description will appear here"}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SEO Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Meta Description
              </CardTitle>
              <CardDescription>
                Brief summary shown in search results below the title
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="seo_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SEO Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Master web development with our comprehensive course. Learn HTML, CSS, JavaScript, React, and more. Perfect for beginners and intermediate learners."
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <div className="flex items-center justify-between text-xs">
                      <FormDescription>
                        Optimal length: 120-160 characters
                      </FormDescription>
                      <span
                        className={`font-medium ${
                          (field.value?.length || 0) >= 120 &&
                          (field.value?.length || 0) <= 160
                            ? "text-green-600 dark:text-green-400"
                            : "text-orange-600 dark:text-orange-400"
                        }`}
                      >
                        {field.value?.length || 0}/160
                      </span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* URL Slug */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="h-5 w-5" />
                URL Slug
              </CardTitle>
              <CardDescription>
                The URL-friendly identifier for your course
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug *</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input placeholder="complete-web-development-bootcamp" {...field} />
                      </FormControl>
                      <Button type="button" variant="outline" onClick={generateSlug}>
                        Generate
                      </Button>
                    </div>
                    <FormDescription>
                      Course URL: {window.location.origin}/course/
                      <span className="font-medium text-foreground">
                        {slug || "your-slug"}
                      </span>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Keywords */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                SEO Keywords
              </CardTitle>
              <CardDescription>
                Target keywords to help search engines understand your course
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="seo_keywords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Keywords (3-10 recommended) *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Type a keyword and press Enter"
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        onKeyDown={handleAddKeyword}
                      />
                    </FormControl>
                    <FormDescription>
                      Press Enter to add each keyword. Use specific terms like &apos;web development course&apos; or &apos;learn react&apos;
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Keywords Display */}
              {seoKeywords && seoKeywords.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {seoKeywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="gap-1 pr-1">
                      {keyword}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => handleRemoveKeyword(keyword)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Keyword count indicator */}
              <div className="text-xs text-muted-foreground">
                {seoKeywords?.length || 0} of 10 keywords added
              </div>
            </CardContent>
          </Card>

          {/* SEO Tips */}
          <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30">
            <CardHeader>
              <CardTitle className="text-blue-900 dark:text-blue-100 flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                SEO Best Practices
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Use keywords naturally:</strong> Include primary keywords in title and description without keyword stuffing
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Be specific:</strong> Use long-tail keywords like &apos;beginner web development course&apos; instead of just &apos;web&apos;
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Write for humans:</strong> Create compelling titles and descriptions that encourage clicks
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Keep URLs short:</strong> Use concise, descriptive slugs that are easy to remember
                </div>
              </div>
            </CardContent>
          </Card>

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
              {loading ? "Saving..." : "Save SEO Settings"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}