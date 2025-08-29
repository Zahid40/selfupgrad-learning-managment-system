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
import { Edit, Eye, MoreHorizontal, Play, Users } from "lucide-react";
import Image from "next/image";
import React from "react";
import Link from "next/link";

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
    <Card
      className={cn(
        "overflow-hidden transition-all hover:shadow-lg",
        className,
      )}
    >
      <div className="relative aspect-video overflow-hidden">
        {data.thumbnail_url ? (
          <Image
            src={data.thumbnail_url}
            alt={data.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100"></div>
        )}
        <div className="absolute top-2 right-2 flex gap-1">
          <Badge
            className={cn("capitalize")}
            variant={courseStatusBadgeVariant[data.status]}
          >
            {data.status}
          </Badge>
          <Badge
            className={cn("capitalize")}
            variant={courseVisibilityBadgeVariant[data.visibility]}
          >
            {data.visibility}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="line-clamp-2 text-lg">{data.title}</CardTitle>
        {data.tagline && (
          <CardDescription className="line-clamp-2">
            {data.tagline}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="pb-3">
        {data.description && (
          <p className="text-muted-foreground mb-3 line-clamp-3 text-sm">
            {data.description}
          </p>
        )}

        <div className="text-muted-foreground flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            {data.enrollments_count !== null && (
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{data.enrollments_count}</span>
              </div>
            )}
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
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex w-full gap-2">
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <Link href={"/course/" + data.slug}>
              <Eye className="mr-1 h-4 w-4" />
              View
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={"/dashboard/course/" + data.id + ""}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
