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

export default function DashboardCoursePage() {
  const [courses, setCourses] = useState<Tables<'courses'>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch courses using course actions
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await getCourses({
          sort: { field: 'created_at', direction: 'desc' },
          limit: 50
        });

        setCourses(result.courses);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError('Failed to fetch courses');
        toast.error('Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div>
      <div className="sticky flex w-full flex-row items-center justify-between border-b-[.5px] p-4">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-2">
            <h1 className="text-2xl font-medium">Courses</h1>
            <Badge variant={"secondary"}>{courses.length}</Badge>
          </div>
          <p className="text-xs font-light">Create and manage your courses</p>
        </div>
        <CreateCourseDialog />
      </div>
      
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
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <Add className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No courses yet</h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first course
              </p>
              <CreateCourseDialog />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                data={course}
                className="h-full"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
