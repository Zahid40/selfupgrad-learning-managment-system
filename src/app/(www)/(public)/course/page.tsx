"use client";
import { CreateCourseDialog } from "@/components/course/create-course-dialog";
import CourseCard from "@/components/course/course-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Add } from "iconsax-reactjs";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { getCourses, CourseListResponse } from "@/action/course/course.action";
import { Tables } from "@/types/db.types";

export default function CoursePage() {
  const [courses, setCourses] = useState<Tables<"courses">[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch courses using course actions
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await getCourses({
          sort: { field: "created_at", direction: "desc" },
          limit: 50,
        });

        setCourses(result.courses);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError("Failed to fetch courses");
        toast.error("Failed to fetch courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);
  return (
    <div>
      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading courses...</span>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          </div>
        ) : courses.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <Add className="text-muted-foreground h-8 w-8" />
              </div>
              <h3 className="mb-2 text-lg font-medium">No courses yet</h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first course
              </p>
              <CreateCourseDialog />
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} data={course} className="h-full" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
