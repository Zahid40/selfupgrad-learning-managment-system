"use client";
import { getCourseById } from "@/action/course/course.action";
import RichTextInput from "@/components/rich-text-editor";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

interface CourseEditPageProps {
  params: {
    course: string;
  };
}

export default async function CourseEditPage({ params }: CourseEditPageProps) {
  const course = await getCourseById(params.course);
  const [content, setContent] = useState("");
  useEffect(() => {
    console.log("Content changed:", content);
  }, [content]);

  if (!course) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <RichTextInput content={content} setContent={setContent} />
        <h1 className="text-3xl font-bold">Edit Course</h1>
        <p className="text-muted-foreground">
          Update your course details and content
        </p>
      </div>

      <div className="grid gap-6">
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">Course Information</h2>
          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <p className="text-lg">{course.title}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Slug</label>
              <p className="text-lg">{course.slug}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <p className="text-lg capitalize">{course.status}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Visibility</label>
              <p className="text-lg capitalize">{course.visibility}</p>
            </div>
            {course.description && (
              <div>
                <label className="text-sm font-medium">Description</label>
                <p className="text-lg">{course.description}</p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">Course Details</h2>
          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium">Level</label>
              <p className="text-lg capitalize">{course.level || "Not set"}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Languages</label>
              <p className="text-lg">
                {course.language && course.language.length > 0
                  ? course.language.join(", ")
                  : "Not set"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">Tags</label>
              <p className="text-lg">
                {course.tags && course.tags.length > 0
                  ? course.tags.join(", ")
                  : "No tags"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">Rating</label>
              <p className="text-lg">{course.rating || 0}/5</p>
            </div>
            <div>
              <label className="text-sm font-medium">Enrollments</label>
              <p className="text-lg">{course.enrollments_count || 0}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">Course Content</h2>
          <p className="text-muted-foreground">
            Course content management will be implemented here.
          </p>
          <div className="mt-4 space-y-2">
            <p>• Add chapters and lessons</p>
            <p>• Upload course materials</p>
            <p>• Set up quizzes and assignments</p>
            <p>• Configure course pricing</p>
          </div>
        </div>
      </div>
    </div>
  );
}
