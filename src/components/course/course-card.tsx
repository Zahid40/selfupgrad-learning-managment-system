import { cn } from "@/lib/utils";
import { CourseType } from "@/types/type";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Eye, MoreHorizontal, Play, Users } from "lucide-react";
import Image from "next/image";
import React from "react";

export default function CourseCard(props: {
  data: CourseType;
  className?: string;
}) {
  const { data, className } = props;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getVisibilityColor = (visibility: string) => {
    switch (visibility) {
      case 'public':
        return 'bg-blue-100 text-blue-800';
      case 'private':
        return 'bg-red-100 text-red-800';
      case 'unlisted':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={cn("overflow-hidden transition-all hover:shadow-lg", className)}>
      <div className="aspect-video relative overflow-hidden">
        {data.thumbnail_url ? (
          <Image 
            src={data.thumbnail_url} 
            alt={data.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            <Play className="h-12 w-12 text-gray-400" />
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-1">
          <Badge className={getStatusColor(data.status)}>
            {data.status}
          </Badge>
          <Badge className={getVisibilityColor(data.visibility)}>
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
          <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
            {data.description}
          </p>
        )}
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
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
          <Button variant="outline" size="sm" className="flex-1">
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
