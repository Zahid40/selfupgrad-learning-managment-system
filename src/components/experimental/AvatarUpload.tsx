// app/components/AvatarUpload.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { uploadAvatar } from "@/action/image/upload-avatar";

interface AvatarUploadProps {
  userId: string;
  currentAvatarUrl?: string;
}

export function AvatarUpload({ userId, currentAvatarUrl }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(
    currentAvatarUrl || null,
  );
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Prepare form data
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("avatar", file);

      // Reset previous states
      setError(null);
      setIsUploading(true);

      // Call server action
      const result = await uploadAvatar(formData);

      setIsUploading(false);

      if (result.success) {
        // Optional: Show success message
        console.log("Avatar uploaded successfully");
      } else {
        setError(result.error || "Upload failed");
        // Revert preview if upload fails
        setPreview(currentAvatarUrl || null);
      }
    }
  };

  return (
    <div className="avatar-upload">
      {preview && (
        <Image
          src={preview}
          alt="Avatar preview"
          width={150}
          height={150}
          className="rounded-full"
        />
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isUploading}
        className="hidden"
        id="avatarUpload"
      />

      <label
        htmlFor="avatarUpload"
        className="cursor-pointer rounded bg-blue-500 px-4 py-2 text-white"
      >
        {isUploading ? "Uploading..." : "Change Avatar"}
      </label>

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
