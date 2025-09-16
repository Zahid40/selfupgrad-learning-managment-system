import { getCourseById } from "@/action/course/course.action";
import CourseDetailsForm from "@/components/course/course-details-form";
import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function CourseEditPage({
  params,
}: {
  params: Promise<{ course_id: string }>;
}) {
  const { course_id } = await params;
  const course = await getCourseById(course_id);

  if (!course) {
    notFound();
  }

  const tabs = [
    {
      for: "details",
      title: "Details",
      content: <CourseDetailsForm courseData={course} />,
    },
    {
      for: "pricing",
      title: "Pricing",
      content: <div>Pricing Content</div>,
    },
    {
      for: "curriculum",
      title: "Curriculum",
      content: <div>Curriculum Content</div>,
    },
    {
      for: "settings",
      title: "Settings",
      content: <div>Settings Content</div>,
    },
  ];

  return (
    <div className="container flex flex-col px-4 py-2">
      <div className="mb-6 w-full">
        <h1 className="text-3xl font-bold">Edit Course</h1>
        <p className="text-muted-foreground">
          Update your course details and content
        </p>
      </div>
      <Tabs defaultValue={tabs[0].for} className="w-full">
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.for} value={tab.for}>
              {tab.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.for} value={tab.for}>
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
