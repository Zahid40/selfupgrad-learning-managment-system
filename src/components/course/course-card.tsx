import { cn } from "@/lib/utils";
import { CourseType } from "@/types/type";
import { Badge, BadgeVariantProp } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Edit,
  Eye,
  Info,
  MoreHorizontal,
  Play,
  Users,
  Users2,
} from "lucide-react";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import CourseThumbnail from "./course-thumbnail";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export default function CourseCard(props: {
  data: CourseType;
  className?: string;
}) {
  const { data, className } = props;

  const courseVisibilityBadgeVariant: Record<
    CourseType["visibility"],
    BadgeVariantProp["variant"]
  > = {
    public: "default",
    private: "secondary",
    unlisted: "destructive",
  };

  const courseStatusBadgeVariant: Record<
    CourseType["status"],
    BadgeVariantProp["variant"]
  > = {
    published: "success",
    draft: "default",
    archived: "destructive",
  };

  return (
    <div
      className={cn(
        "flex aspect-[4/5] min-w-xs basis-1 flex-col overflow-hidden rounded-lg bg-neutral-200 transition-all hover:shadow-xl dark:bg-neutral-950",
        className,
      )}
    >
      <div className="relative overflow-hidden">
        <CourseThumbnail
          thumbnail_url={data.thumbnail_url}
          title={data.title}
        />
        <div className="absolute top-2 left-2 flex gap-1">
          {data.enrollments_count !== null && (
            <Badge
              className={cn(
                "bg-background flex items-center justify-center text-[10px] leading-0 font-light capitalize",
              )}
              variant={"outline"}
            >
              <Users className="mr-1 size-2" />
              <span>{data.enrollments_count} Enrolled</span>
            </Badge>
          )}
        </div>
        <div className="absolute top-2 right-2 flex gap-1">
          <Badge
            className={cn("text-xs capitalize")}
            variant={courseStatusBadgeVariant[data.status]}
          >
            {data.status}
          </Badge>
          <Badge
            className={cn("text-xs capitalize")}
            variant={courseVisibilityBadgeVariant[data.visibility]}
          >
            {data.visibility}
          </Badge>
        </div>
      </div>

      <div className="flex h-full flex-1 flex-col justify-between space-y-1 p-2">
        <div className="flex w-full flex-col items-start justify-center gap-2">
          <p className="text-lg font-medium tracking-normal capitalize">
            {data.title}
          </p>
          {data.tagline && (
            <span className="text-foreground line-clamp-2 text-xs leading-tight font-light">
              {data.tagline}
            </span>
          )}
          <div className="w-full pb-3">
            <div className="text-muted-foreground flex w-full items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                {data.rating !== null && (
                  <div className="flex items-center gap-1">
                    <span>★</span>
                    <span>{data.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
              {data.level && (
                <Badge variant="outline" className="text-xs">
                  {data.level}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="pt-0">
          <div className="flex w-full divide-x overflow-hidden rounded-sm border">
            {[
              { for: "view", icon: Eye, title: "View", link: "/course/" },
              {
                for: "info",
                icon: Info,
                title: "Info",
                link: `/dashboard/course/${data.id}`,
              },
              {
                for: "edit",
                icon: Edit,
                title: "Edit",
                link: `/dashboard/course/${data.id}/edit`,
              },
              {
                for: "learners",
                icon: Users,
                title: "Learners",
                link: "/dashboard/course/",
              },
            ].map((e, idx) => (
              <Tooltip key={e.for + idx}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 rounded-none"
                    asChild
                  >
                    <Link href={e.link}>
                      <e.icon className="h-4 w-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{e.title}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
