import { getCourseBySlug } from "@/action/course/course.action";
import { ImageResponse } from "next/og";

export const alt = "About Acme";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: { course_slug: string };
}) {
  const course = await getCourseBySlug(params.course_slug);

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {course?.title}
      </div>
    ),
    {
      ...size,
    },
  );
}
