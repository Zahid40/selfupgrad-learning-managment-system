// /components/provider/learners-provider.tsx
"use client";

import React, { createContext, useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getUsers,
  UsersFilter,
  UsersSortOptions,
  PaginationOptions,
  UsersQueryResult,
} from "@/action/user/users.action";

interface LearnersContextType {
  data: UsersQueryResult | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  filters: UsersFilter;
  sort: UsersSortOptions;
  pagination: PaginationOptions;
  setFilters: (filters: UsersFilter) => void;
  setSort: (sort: UsersSortOptions) => void;
  setPagination: (pagination: PaginationOptions) => void;
  refetch: () => void;
}

const LearnersContext = createContext<LearnersContextType | undefined>(undefined);

export function LearnersProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<UsersFilter>({ role: "student" });
  const [sort, setSort] = useState<UsersSortOptions>({
    field: "created_at",
    ascending: false,
  });
  const [pagination, setPagination] = useState<PaginationOptions>({
    page: 1,
    pageSize: 10,
  });

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["learners", filters, sort, pagination],
    queryFn: () => getUsers(filters, sort, pagination),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  return (
    <LearnersContext.Provider
      value={{
        data,
        isLoading,
        isError,
        error: error as Error | null,
        filters,
        sort,
        pagination,
        setFilters,
        setSort,
        setPagination,
        refetch,
      }}
    >
      {children}
    </LearnersContext.Provider>
  );
}

export function useLearners() {
  const context = useContext(LearnersContext);
  if (context === undefined) {
    throw new Error("useLearners must be used within a LearnersProvider");
  }
  return context;
}
