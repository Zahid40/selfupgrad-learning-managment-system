"use server";

import { createClient } from "@/lib/server";

export const getUser = async () => {
  const supabase = await createClient();
  const { data: authData, error } = await supabase.auth.getUser();
  if (error || !authData?.user) {
    throw new Error("User not found or not authenticated");
  }
  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("id", authData.user.id)
    .single();

  if (!user) {
    throw new Error("User not found in database");
  }

  return user;
}; 
