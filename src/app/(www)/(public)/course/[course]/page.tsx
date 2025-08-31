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
  ChevronRight
} from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";

interface CoursePageProps {
  params: {
    course: string;
  };
}

// Mock data for demonstration
const mockCourseData = {
  title: "The complete advanced 6-week UI/UX design bootcamp",
  rating: 4.9,
  ratingsCount: 264250,
  studentsCount: 1936922,
  instructor: "Dr. Marley Bator",
  description: "Our 6-week UI/UX bootcamp equips students with the essential skills to become successful designers. Our experienced instructors provide hands-on learning opportunities to design and prototype digital products, conduct user research, and create user flows and wireframes.",
  sections: 41,
  lectures: 490,
  totalLength: "65h 33m",
  currentPrice: 549.00,
  originalPrice: 3499.00,
  discount: 85,
  features: [
    { icon: Play, text: "65 hours on-demand video" },
    { icon: Download, text: "49 downloadable resources" },
    { icon: Smartphone, text: "Access on mobile and TV" },
    { icon: FileText, text: "86 articles" },
    { icon: Code, text: "8 coding exercises" },
    { icon: Award, text: "Certificate of completion" }
  ],
  weeks: [
    {
      title: "Week 1 - Beginner - Introduction to UX designing",
      isExpanded: true,
      isLocked: false,
      progress: 100,
      lessons: [
        { title: "Read before you start", duration: "02:53", completed: true },
        { title: "Introduction to Figma essentials training course", duration: "02:45", completed: true },
        { title: "What is the difference between UI & UX in Figma", duration: "05:22", completed: true },
        { title: "What we are making in this Figma course", duration: "09:18", completed: false },
        { title: "Class project 02- Create your own brief", type: "question", completed: false },
        { title: "Class project 02- Create your own brief", type: "question", completed: false }
      ]
    },
    {
      title: "Week 2 - Beginner - Welcome to Course 1",
      isExpanded: false,
      isLocked: false,
      progress: 0
    },
    {
      title: "Week 3 - Beginner - The basics of user experience design",
      isExpanded: false,
      isLocked: true,
      progress: 0
    },
    {
      title: "Week 4 - Beginner - Getting started in UX design",
      isExpanded: false,
      isLocked: true,
      progress: 0
    },
    {
      title: "Week 5 - Beginner - Jobs in the field of user experience",
      isExpanded: false,
      isLocked: true,
      progress: 0
    },
    {
      title: "Week 6 - Beginner - Getting ahead as a junior designer",
      isExpanded: false,
      isLocked: true,
      progress: 0
    }
  ]
};

export default async function CoursePage({ params }: CoursePageProps) {
  const course = await getCourseBySlug(params.course);

  if (!course) {
    notFound();
  }

  const courseData = mockCourseData;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/courses">Top courses</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>UI/UX designing</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Course Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Title and Stats */}
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-4">
                {courseData.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium text-foreground">{courseData.rating}</span>
                  <span>({courseData.ratingsCount.toLocaleString()} ratings)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{courseData.studentsCount.toLocaleString()} students</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{courseData.instructor}</span>
                </div>
              </div>

              <p className="text-foreground leading-relaxed">
                {courseData.description}
              </p>
            </div>

            {/* Course Content */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">Course content</h2>
                <Button variant="link" className="text-primary">
                  Expand all sections
                </Button>
              </div>
              
              <div className="text-sm text-muted-foreground mb-6">
                {courseData.sections} sections • {courseData.lectures} lectures • {courseData.totalLength} total length
              </div>

              <div className="space-y-2">
                {courseData.weeks.map((week, index) => (
                  <Collapsible key={index} open={week.isExpanded}>
                    <CollapsibleTrigger asChild>
                      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                        <div className="flex items-center gap-3">
                          {week.isLocked ? (
                            <Lock className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center">
                              {week.progress === 100 && <CheckCircle className="w-3 h-3 text-primary" />}
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
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="ml-8 mt-2 space-y-2">
                        {week.lessons?.map((lesson, lessonIndex) => (
                          <div key={lessonIndex} className="flex items-center justify-between py-2 px-4 rounded-md hover:bg-muted/30">
                            <div className="flex items-center gap-3">
                              {lesson.completed ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border border-muted-foreground" />
                              )}
                              <span className="text-sm">{lesson.title}</span>
                              {lesson.type === "question" && (
                                <Badge variant="secondary" className="text-xs">1 Question</Badge>
                              )}
                            </div>
                            {lesson.duration && (
                              <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Purchase Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                {/* Course Thumbnail */}
                <div className="relative mb-6">
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                      <Play className="w-8 h-8 text-primary ml-1" />
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold text-foreground">
                      ${courseData.currentPrice.toLocaleString()}
                    </span>
                    <span className="text-lg text-muted-foreground line-through">
                      ${courseData.originalPrice.toLocaleString()}
                    </span>
                    <Badge variant="destructive" className="text-xs">
                      {courseData.discount}% off
                    </Badge>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mb-6">
                  <Button className="flex-1" size="lg">
                    Buy Now
                  </Button>
                  <Button variant="outline" size="lg" className="px-3">
                    <Heart className="w-5 h-5" />
                  </Button>
                </div>

                {/* Course Features */}
                <div>
                  <h3 className="font-semibold text-foreground mb-4">This course includes:</h3>
                  <div className="space-y-3">
                    {courseData.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 text-sm">
                        <feature.icon className="w-4 h-4 text-muted-foreground" />
                        <span>{feature.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Additional Info */}
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
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
