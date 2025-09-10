import { getCourseBySlug } from "@/action/course/course.action";
import { notFound } from "next/navigation";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  Users,
  User,
  Play,
  Download,
  Smartphone,
  FileText,
  Code,
  Award,
  Heart,
  Lock,
  CheckCircle,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";

interface CoursePageProps {
  params: {
    course: string;
  };
}

// Mock data for demonstration
const mockcourse = {
  title: "The complete advanced 6-week UI/UX design bootcamp",
  rating: 4.9,
  ratingsCount: 264250,
  studentsCount: 1936922,
  instructor: "Dr. Marley Bator",
  description:
    "Our 6-week UI/UX bootcamp equips students with the essential skills to become successful designers. Our experienced instructors provide hands-on learning opportunities to design and prototype digital products, conduct user research, and create user flows and wireframes.",
  sections: 41,
  lectures: 490,
  totalLength: "65h 33m",
  currentPrice: 549.0,
  originalPrice: 3499.0,
  discount: 85,
  features: [
    { icon: Play, text: "65 hours on-demand video" },
    { icon: Download, text: "49 downloadable resources" },
    { icon: Smartphone, text: "Access on mobile and TV" },
    { icon: FileText, text: "86 articles" },
    { icon: Code, text: "8 coding exercises" },
    { icon: Award, text: "Certificate of completion" },
  ],
  weeks: [
    {
      title: "Week 1 - Beginner - Introduction to UX designing",
      isExpanded: true,
      isLocked: false,
      progress: 100,
      lessons: [
        { title: "Read before you start", duration: "02:53", completed: true },
        {
          title: "Introduction to Figma essentials training course",
          duration: "02:45",
          completed: true,
        },
        {
          title: "What is the difference between UI & UX in Figma",
          duration: "05:22",
          completed: true,
        },
        {
          title: "What we are making in this Figma course",
          duration: "09:18",
          completed: false,
        },
        {
          title: "Class project 02- Create your own brief",
          type: "question",
          completed: false,
        },
        {
          title: "Class project 02- Create your own brief",
          type: "question",
          completed: false,
        },
      ],
    },
    {
      title: "Week 2 - Beginner - Welcome to Course 1",
      isExpanded: false,
      isLocked: false,
      progress: 0,
    },
    {
      title: "Week 3 - Beginner - The basics of user experience design",
      isExpanded: false,
      isLocked: true,
      progress: 0,
    },
    {
      title: "Week 4 - Beginner - Getting started in UX design",
      isExpanded: false,
      isLocked: true,
      progress: 0,
    },
    {
      title: "Week 5 - Beginner - Jobs in the field of user experience",
      isExpanded: false,
      isLocked: true,
      progress: 0,
    },
    {
      title: "Week 6 - Beginner - Getting ahead as a junior designer",
      isExpanded: false,
      isLocked: true,
      progress: 0,
    },
  ],
};

export default async function CoursePage({
  params,
}: {
  params: Promise<{ course_slug: string }>;
}) {
  const { course_slug } = await params;
  const course = await getCourseBySlug(course_slug);

  if (!course) {
    notFound();
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/course">Top courses</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>UI/UX designing</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column - Course Content */}
          <div className="space-y-8 lg:col-span-2">
            {/* Course Title and Stats */}
            <div>
              <h1 className="text-foreground mb-4 text-3xl font-bold">
                {course.title}
              </h1>

              <div className="text-muted-foreground mb-4 flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-foreground font-medium">
                    {course.rating}
                  </span>
                  <span>({course.rating} ratings)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{course.enrollments_count} students</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{course.instructor_id}</span>
                </div>
              </div>

              <p className="text-foreground leading-relaxed">
                {course.description}
              </p>
            </div>

            {/* Course Content */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-foreground text-xl font-semibold">
                  Course content
                </h2>
                <Button variant="link" className="text-primary">
                  Expand all sections
                </Button>
              </div>

              {/* <div className="text-muted-foreground mb-6 text-sm">
                {course.sections} sections • {course.lectures} lectures
                • {course.totalLength} total length
              </div> */}

              {/* <div className="space-y-2">
                {course.weeks.map((week, index) => (
                  <Collapsible key={index} open={week.isExpanded}>
                    <CollapsibleTrigger asChild>
                      <div className="hover:bg-muted/50 flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors">
                        <div className="flex items-center gap-3">
                          {week.isLocked ? (
                            <Lock className="text-muted-foreground h-4 w-4" />
                          ) : (
                            <div className="border-primary flex h-4 w-4 items-center justify-center rounded-full border-2">
                              {week.progress === 100 && (
                                <CheckCircle className="text-primary h-3 w-3" />
                              )}
                            </div>
                          )}
                          <span className="font-medium">{week.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {week.progress > 0 && (
                            <div className="w-16">
                              <Progress value={week.progress} className="h-2" />
                            </div>
                          )}
                          {week.isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="mt-2 ml-8 space-y-2">
                        {week.lessons?.map((lesson, lessonIndex) => (
                          <div
                            key={lessonIndex}
                            className="hover:bg-muted/30 flex items-center justify-between rounded-md px-4 py-2"
                          >
                            <div className="flex items-center gap-3">
                              {lesson.completed ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <div className="border-muted-foreground h-4 w-4 rounded-full border" />
                              )}
                              <span className="text-sm">{lesson.title}</span>
                              {lesson.type === "question" && (
                                <Badge variant="secondary" className="text-xs">
                                  1 Question
                                </Badge>
                              )}
                            </div>
                            {lesson.duration && (
                              <span className="text-muted-foreground text-xs">
                                {lesson.duration}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div> */}
            </div>
          </div>

          {/* Right Column - Purchase Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                {/* Course Thumbnail */}
                <div className="relative mb-6">
                  <div className="bg-muted flex aspect-video items-center justify-center rounded-lg">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90">
                      <Play className="text-primary ml-1 h-8 w-8" />
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="mb-6">
                  <div className="mb-2 flex items-baseline gap-2">
                    <span className="text-foreground text-3xl font-bold">
                      ${course.pricing_id}
                    </span>
                    <span className="text-muted-foreground text-lg line-through">
                      ${course.pricing_id}
                    </span>
                    <Badge variant="destructive" className="text-xs">
                      {course.pricing_id}% off
                    </Badge>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mb-6 flex gap-2">
                  <Button className="flex-1" size="lg">
                    Buy Now
                  </Button>
                  <Button variant="outline" size="lg" className="px-3">
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>

                {/* Course Features */}
                {/* <div>
                  <h3 className="text-foreground mb-4 font-semibold">
                    This course includes:
                  </h3>
                  <div className="space-y-3">
                    {course.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 text-sm"
                      >
                        <feature.icon className="text-muted-foreground h-4 w-4" />
                        <span>{feature.text}</span>
                      </div>
                    ))}
                  </div>
                </div> */}

                <Separator className="my-6" />

                {/* Additional Info */}
                <div className="text-center">
                  <p className="text-muted-foreground text-sm">
                    30-Day Money-Back Guarantee
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
