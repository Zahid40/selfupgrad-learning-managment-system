import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Add } from "iconsax-reactjs";
import React from "react";

export default function DashboardCoursePage() {
  return (
    <div>
      <div className="sticky flex w-full flex-row items-center justify-between border-b-[.5px] p-4">
        <h1 className="flex flex-row items-center justify-between gap-2 text-2xl font-medium">
          Courses <Badge variant={"secondary"}>7</Badge>
        </h1>
        <Button size={"sm"}>
          <Add />
          Create Course
        </Button>
      </div>
    </div>
  );
}
