import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

export default function CourseCard(props: {
  data: CourseType;
  className: string;
}) {
  const { data, className } = props;
  return (
    <div className={cn("", className)}>
      <div className="aspect-video h-full w-full">
        <Image src={data.image_src} alt={data.name} />
        <p>{data.name}</p>
      </div>
    </div>
  );
}
