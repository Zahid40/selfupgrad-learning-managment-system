import { UserType } from "@/types/type";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";

export default function UserAvatar(props: {
  className?: string;
  user?: UserType|null;
}) {
  const { user, className } = props;
  return (
    <Avatar className={cn("size-12 rounded-full", className)}>
      {user?.avatar_url && (
        <AvatarImage src={user.avatar_url} alt={user.first_name ?? "user"} />
      )}
      <AvatarFallback className="text-secondary-foreground rounded-full bg-violet-400 dark:bg-violet-900">
        {user?.first_name ? user.first_name?.slice(0, 1) : "U"}
      </AvatarFallback>
    </Avatar>
  );
}
