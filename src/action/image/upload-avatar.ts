// app/actions/upload-avatar.ts
"use server";

import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/client";

// Validation schema for file upload
const uploadSchema = z.object({
  userId: z.string().uuid(),
});

export async function uploadAvatar(formData: FormData) {
  // Validate inputs
  const userId = formData.get("userId") as string;
  const file = formData.get("avatar") as File;

  try {
    // Validate user ID
    const validatedFields = uploadSchema.safeParse({ userId });
    if (!validatedFields.success) {
      return {
        error: "Invalid user ID",
        success: false,
      };
    }

    // Validate file
    if (!file || !(file instanceof File)) {
      return {
        error: "No file uploaded",
        success: false,
      };
    }

    // Check file type and size
    if (!file.type.startsWith("image/")) {
      return {
        error: "File must be an image",
        success: false,
      };
    }

    // Optional: File size limit (e.g., 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return {
        error: "File must be less than 5MB",
        success: false,
      };
    }

    // Generate a unique filename

    const fileExt = file.name.split(".").pop();

    const fileName = `${userId}_${Date.now()}.${fileExt}`;

    const filePath = `${userId}/${fileName}`;

    // Upload to Supabase storage
    const { data, error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return {
        error: "Failed to upload avatar",
        success: false,
      };
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filePath);

    // Update user profile with new avatar URL
    const { error: updateError } = await supabase
      .from("users")
      .update({ avatar_url: publicUrl })
      .eq("id", userId);

    if (updateError) {
      console.error("Profile update error:", updateError);
      return {
        error: "Failed to update profile",
        success: false,
      };
    }

    // Revalidate the current path to refresh the UI
    revalidatePath("/profile");

    return {
      avatarUrl: publicUrl,
      success: true,
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      error: "An unexpected error occurred",
      success: false,
    };
  }
}
