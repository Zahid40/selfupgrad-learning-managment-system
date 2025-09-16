import React from "react";

export default function HtmlContent(props: { html: string }) {
  return (
    <div
      className="prose lg:prose-xl max-w-none" // optional: if you're using Tailwind Typography
      dangerouslySetInnerHTML={{ __html: props.html }}
    />
  );
}
