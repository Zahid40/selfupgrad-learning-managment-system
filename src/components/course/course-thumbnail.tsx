import Image from "next/image";
import React from "react";
import { CourseType } from "@/types/type";
import { Logo } from "../logo";

export default function CourseThumbnail({
  thumbnail_url,
  title,
}: {
  thumbnail_url: CourseType["thumbnail_url"];
  title: CourseType["title"];
}) {
  return (
    <div className="relative aspect-video overflow-hidden bg-gradient-to-bl from-violet-500 to-pink-300">
      {thumbnail_url ? (
        <Image src={thumbnail_url} alt={title} fill className="object-cover" />
      ) : (
        <div className="bg-primary flex h-full w-full items-center justify-center [mask-image:repeating-radial-gradient(circle,white_0,white_1px,transparent_1px,transparent_16px)] [mask-size:16px_16px] [mask-position:center] [mask-repeat:repeat]">
          {/* <Logo variant="mini_white" /> */}
        </div>
      )}
    </div>
  );
}
