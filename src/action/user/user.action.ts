// /lib/server/auth.ts
"use server";

import { createClient } from "@/lib/server";
import { UserType } from "@/types/type";
import { redirect } from "next/navigation";

export const getUser = async (): Promise<UserType> => {
  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.getUser();
  const authUser = authData?.user;
  
  if (authError || !authUser?.id) {
    return {} as UserType;
  }

  const { data: user, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", authUser.id)
    .single();

  if (userError || !user) {
    return {} as UserType;
  }

  // Spread profile first, then add User fields
  return {
    ...user,       // fields from "profiles"
    ...authUser       // Supabase auth user fields
  } as UserType;
};

export const logoutUser = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/auth/login");
};

type UpdateUserInput = Partial<
  Omit<UserType, "id" | "created_at" | "updated_at">
>;

export const updateUser = async (updates: UpdateUserInput): Promise<UserType> => {
  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.getUser();
  const authUser = authData?.user;

  if (authError || !authUser?.id) {
    return {} as UserType;
  }

  const { data: user, error } = await supabase
    .from("users")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", authUser.id)
    .select("*")
    .single();

  if (error || !user) {
    throw new Error(error?.message || "User update failed");
  }

  // Always return merged object
  return {
    ...user,
    ...authUser
  } as UserType;
};