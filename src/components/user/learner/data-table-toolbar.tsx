// /components/users/learners/data-table-toolbar.tsx
"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
import { useLearners } from "@/components/provider/learners-provider";
import { UserType } from "@/types/type";
import { Search, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { useEffect } from "react";

interface DataTableToolbarProps {
  table: Table<UserType>;
}

export function DataTableToolbar({ table }: DataTableToolbarProps) {
  const { filters, setFilters, refetch } = useLearners();
  const [searchValue, setSearchValue] = useState(filters.search || "");
  const debouncedSearch = useDebounce(searchValue, 500);

  useEffect(() => {
    setFilters({ ...filters, search: debouncedSearch });
  }, [debouncedSearch]);

  const isFiltered = Object.keys(filters).some(
    (key) => key !== "role" && filters[key as keyof typeof filters]
  );

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search learners..."
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            className="pl-8"
          />
        </div>
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              setSearchValue("");
              setFilters({ role: "learner" });
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="h-8"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
