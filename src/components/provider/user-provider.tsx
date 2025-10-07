"use client";

import { getUser } from "@/action/user/user.action";
import { UserType } from "@/types/type";
import { useQuery } from "@tanstack/react-query";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";

// Define the context shape
type UserContextType = {
  user: UserType | null;
  setUser: Dispatch<SetStateAction<UserType | null>>;
};

// Create context with undefined initial value (to force correct use within provider)
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { data, isLoading, isError, error, refetch } = useQuery<UserType>({
    queryKey: ["currentUser"],
    queryFn: async () => await getUser(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Initialize user state as null for better type safety and update when data arrives
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook to access user context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
