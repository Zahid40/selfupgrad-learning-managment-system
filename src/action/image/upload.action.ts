// app/lib/actions/upload-to-supabase.ts
"use server";

import { supabase } from "@/lib/client";

// Generate a unique object path to prevent collisions
function uniqueObjectPath(originalName: string) {
  const ext = originalName.includes(".")
    ? `.${originalName.split(".").pop()}`
    : "";
  const base = originalName.replace(/\.[^/.]+$/, "");
  const ts = Date.now();
  const rand = Math.random().toString(36).slice(2, 8);
  return `uploads/${ts}-${rand}-${base}${ext}`;
}

/**
 * Server Action: Upload an image to Supabase Storage.
 *
 * Expected FormData fields:
 * - file: File (image)
 * - bucket: string (bucket name)
 * - folder: string (optional subfolder)
 * - signUrl: "true" | "false" (optional; default false)
 *
 * Returns:
 * { path: string, signedUrl?: string }
 */
export async function uploadImageAction(formData: FormData) {
  const file = formData.get("file") as File | null;
  const bucket = formData.get("bucket") as string | null;
  const folder = (formData.get("folder") as string | null) || "";
  const signUrl = (formData.get("signUrl") as string | null) === "true";

  if (!file) {
    return { error: "Missing 'file' field" };
  }
  if (!bucket) {
    return { error: "Missing 'bucket' field" };
  }

  // Convert File to a Uint8Array buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const objectName = uniqueObjectPath(file.name);
  const objectPath = folder
    ? `${folder.replace(/\/+$/, "")}/${objectName}`
    : objectName;

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(objectPath, buffer, {
      contentType: file.type || "application/octet-stream",
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    return { error: error.message };
  }

  // Optionally create a short-lived signed URL for immediate access (useful for private buckets)
  if (signUrl) {
    const { data: signed, error: signErr } = await supabase.storage
      .from(bucket)
      .createSignedUrl(data.path, 60 * 10);

    if (!signErr && signed?.signedUrl) {
      return { path: data.path, signedUrl: signed.signedUrl };
    }
  }

  return { path: data.path };
}
