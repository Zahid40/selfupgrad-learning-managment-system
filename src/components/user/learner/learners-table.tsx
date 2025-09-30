// /components/users/learners/learners-table.tsx
"use client";

import { useLearners } from "@/components/provider/learners-provider";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export function LearnersTable() {
  const { data, isLoading } = useLearners();

  return (
    <DataTable
      columns={columns}
      data={data?.users || []}
      isLoading={isLoading}
    />
  );
}
