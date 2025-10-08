import { getCourseById } from "@/action/course/course.action";
import CourseDetailsForm from "@/components/course/course-details-form";
import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  DollarSign, 
  List, 
  Image, 
  Search, 
  Award, 
  Settings,
  Layout
} from "lucide-react";
import { getChaptersByCourse } from "@/action/course/chapter.action";
// import CoursePricingForm from "@/components/course/course-pricing-form";
import CourseMediaManager from "@/components/course/course-media-manager";
// import CourseCurriculumManager from "@/components/course/course-curriculum-manager";
import CourseSEOForm from "@/components/course/course-seo-form";
// import CertificateManager from "@/components/course/certificate-manager";
// import CourseSettingsForm from "@/components/course/course-settings-form";

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

  // Fetch chapters with lessons for curriculum tab
  const chapters = await getChaptersByCourse(course_id, true);

  const tabs = [
    {
      for: "basic",
      title: "Basic Info",
      icon: BookOpen,
      description: "Course title, description, category, and tags",
      content: <CourseDetailsForm courseData={course} />,
    },
    // {
    //   for: "curriculum",
    //   title: "Curriculum",
    //   icon: List,
    //   description: "Manage chapters and lessons",
    //   content: <CourseCurriculumManager courseId={course_id} chapters={chapters} />,
    // },
    // {
    //   for: "pricing",
    //   title: "Pricing",
    //   icon: DollarSign,
    //   description: "Set pricing model and discounts",
    //   content: <CoursePricingForm courseData={course} />,
    // },
    {
      for: "media",
      title: "Media",
      icon: Image,
      description: "Thumbnail, promo video, and course images",
      content: <CourseMediaManager courseData={course} />,
    },
    {
      for: "landing",
      title: "Landing Page",
      icon: Layout,
      description: "Learning outcomes, requirements, and course highlights",
      content: <CourseLandingPageForm courseData={course} />,
    },
    {
      for: "seo",
      title: "SEO",
      icon: Search,
      description: "Meta title, description, and keywords",
      content: <CourseSEOForm courseData={course} />,
    },
    // {
    //   for: "certificate",
    //   title: "Certificate",
    //   icon: Award,
    //   description: "Certificate template and settings",
    //   content: <CertificateManager courseData={course} />,
    // },
    // {
    //   for: "settings",
    //   title: "Settings",
    //   icon: Settings,
    //   description: "Status, visibility, and advanced options",
    //   content: <CourseSettingsForm courseData={course} />,
    // },
  ];

  return (
    <div className="container flex flex-col px-4 py-2">
      {/* Header Section */}
      <div className="mb-6 w-full space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{course.title}</h1>
            <p className="text-muted-foreground">
              Manage all aspects of your course
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Status Badge */}
            <div className={`rounded-full px-3 py-1 text-sm font-medium ${
              course.status === 'published' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                : course.status === 'draft'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
            }`}>
              {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue={tabs[0].for} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 gap-2">
          {tabs.map((tab) => (
            <TabsTrigger 
              key={tab.for} 
              value={tab.for}
              className="flex items-center gap-2"
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.title}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.for} value={tab.for} className="mt-6">
            {/* Tab Header */}
            <div className="mb-6 space-y-1">
              <div className="flex items-center gap-2">
                <tab.icon className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-2xl font-semibold">{tab.title}</h2>
              </div>
              <p className="text-sm text-muted-foreground">{tab.description}</p>
            </div>

            {/* Tab Content */}
            <div className="rounded-lg border bg-card p-6">
              {tab.content}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

// Placeholder component - you'll need to create this
function CourseLandingPageForm({ courseData }: { courseData: any }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">What you&apos;ll learn</h3>
        {/* Learning outcomes editor */}
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Requirements</h3>
        {/* Requirements editor */}
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Course Highlights</h3>
        {/* Duration, level, language settings */}
      </div>
    </div>
  );
}