import { use } from "react";

export default function LegalPages({
  params,
}: {
  params: Promise<{ legal: string }>;
}) {
  const { legal } = use(params);
  return <div>
    {legal}
  </div>;
}
