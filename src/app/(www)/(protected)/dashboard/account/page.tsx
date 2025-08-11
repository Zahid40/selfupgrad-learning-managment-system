"use client";
import AvatarDynamic from "@/components/avatar-dynamic";
import { AvatarUpload } from "@/components/experimental/AvatarUpload";
import { useUser } from "@/components/provider/user-provider";
import React from "react";

export default function AccountPage() {
  const { user } = useUser();
  return (
    <div className="flex flex-col items-start justify-start">
      <div className="h-48 w-full bg-purple-800"></div>
      <div className="flex flex-col px-4">
        <AvatarDynamic user={user} className="relative -top-18" />
      </div>

      {/* <AvatarUpload userId={user.id} currentAvatarUrl={user?.avatar_url!} /> */}
    </div>
  );
}
