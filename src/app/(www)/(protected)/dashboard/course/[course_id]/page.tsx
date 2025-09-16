import { getCourseById } from "@/action/course/course.action";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Edit, Eye, Users, Star, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import CopyButton from "@/components/common/copy-button";
import ShareButton from "@/components/common/share-button";
import _APP_ from "@/constants/_APP_";
import CourseThumbnail from "@/components/course/course-thumbnail";
import HtmlContent from "@/components/common/html-render";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ course_id: string }>;
}) {
  const { course_id } = await params;
  const course = await getCourseById(course_id);

  if (!course) {
    notFound();
  }

  return (
    <div className="container mx-auto flex-col p-4">
      <div className="mb-6 flex w-full items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <div className="flex items-center justify-center gap-2 py-2">
            <p className="text-muted-foreground">Course ID:</p>
            <CopyButton text={course.id} title={course.id} />
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/course/${course.id}/edit`}>
              <Edit className="h-4 w-4" />
              Edit Course
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/course/${course.slug}`}>
              <Eye className="h-4 w-4" />
              View Public
            </Link>
          </Button>
          <CopyButton
            text={`${_APP_.base_url}/course/${course.slug}`}
            title={"Copy url"}
            size={"lg"}
          />
          <ShareButton title={""} text={""} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Course Info */}
        <div className="space-y-6 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
              <CardDescription>Basic details about your course</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-muted-foreground text-sm font-medium">
                    Status
                  </label>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge
                      variant={
                        course.status === "published" ? "default" : "secondary"
                      }
                    >
                      {course.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-muted-foreground text-sm font-medium">
                    Visibility
                  </label>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge
                      variant={
                        course.visibility === "public" ? "default" : "secondary"
                      }
                    >
                      {course.visibility}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-muted-foreground text-sm font-medium">
                    Level
                  </label>
                  <p className="mt-1 capitalize">{course.level || "Not set"}</p>
                </div>
                <div>
                  <label className="text-muted-foreground text-sm font-medium">
                    Featured
                  </label>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant={course.featured ? "default" : "secondary"}>
                      {course.featured ? "Yes" : "No"}
                    </Badge>
                  </div>
                </div>
              </div>

              {course.description && (
                <div>
                  <label className="text-muted-foreground text-sm font-medium">
                    Description
                  </label>
                  <HtmlContent html={course.description} />
                </div>
              )}


              {course.tagline && (
                <div>
                  <label className="text-muted-foreground text-sm font-medium">
                    Tagline
                  </label>
                  <p className="mt-1">{course.tagline}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
              <CardDescription>
                Manage your course chapters and lessons
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="py-8 text-center">
                <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                  <Calendar className="text-muted-foreground h-8 w-8" />
                </div>
                <h3 className="mb-2 text-lg font-medium">No content yet</h3>
                <p className="text-muted-foreground mb-4">
                  Add chapters and lessons to your course
                </p>
                <Button variant="outline">Add Chapter</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="overflow-hidden rounded-xl">
            <CourseThumbnail
              thumbnail_url={course.thumbnail_url}
              title={course.title}
            />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Course Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm">Enrollments</span>
                </div>
                <span className="font-medium">
                  {course.enrollments_count || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm">Rating</span>
                </div>
                <span className="font-medium">{course.rating || 0}/5</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm">Duration</span>
                </div>
                <span className="font-medium">
                  {course.duration || "Not set"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Course Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  Languages
                </label>
                <div className="mt-1">
                  {course.language && course.language.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {course.language.map((lang, index) => (
                        <Badge key={index} variant="outline">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">Not set</p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  Tags
                </label>
                <div className="mt-1">
                  {course.tags && course.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {course.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No tags</p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  Created
                </label>
                <p className="mt-1 text-sm">
                  {course.created_at
                    ? new Date(course.created_at).toLocaleDateString()
                    : "Unknown"}
                </p>
              </div>

              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  Last Updated
                </label>
                <p className="mt-1 text-sm">
                  {course.updated_at
                    ? new Date(course.updated_at).toLocaleDateString()
                    : "Unknown"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
