import { getCourseById } from "@/action/course/course.action";
import CourseDetailsForm from "@/components/course/course-details-form";
import { notFound } from "next/navigation";

interface CourseEditPageProps {
  params: {
    course: string;
  };
}

export default async function CourseEditPage({ params }: CourseEditPageProps) {
  const course = await getCourseById(params.course);

  if (!course) {
    notFound();
  }

  return (
    <div className="container flex flex-col px-4 py-2">
      <div className="mb-6 w-full">
        <h1 className="text-3xl font-bold">Edit Course</h1>
        <p className="text-muted-foreground">
          Update your course details and content
        </p>
      </div>
      <CourseDetailsForm courseData={course} />
    </div>
  );
}
