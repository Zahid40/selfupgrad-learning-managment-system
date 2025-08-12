// /lib/server/auth.ts
"use server";

import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";
import { UserType } from "@/types/user.type";

export const getUser = async (): Promise<UserType> => {
  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData?.user?.id) {
    //redirect("/auth/login"); // Exit here
    return {} as UserType; // Return empty user if not authenticated
  }

  const { data: user, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", authData.user.id)
    .single();

  if (userError || !user) {
    //redirect("/auth/login"); // Exit if not found
    return {} as UserType; // Return empty user if not authenticated
  }

  return user as UserType;
};

export const logoutUser = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/auth/login");
};

type UpdateUserInput = Partial<
  Omit<UserType, "id" | "created_at" | "updated_at">
>;

export const updateUser = async (updates: UpdateUserInput) => {
  const supabase = await createClient();

  // Ensure user is logged in
  const { data: authUser, error: authError } = await supabase.auth.getUser();

  if (authError || !authUser?.user?.id) {
    //redirect("/auth/login"); // Exit here
    return {} as UserType; // Return empty user if not authenticated
  }

  const { data, error } = await supabase
    .from("users")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", authUser.user.id)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as UserType;
};
