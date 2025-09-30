// /components/users/learners/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { UserType } from "@/types/type";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal, Mail, Phone, Calendar, Activity } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export const columns: ColumnDef<UserType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "username",
    header: "Learner",
    cell: ({ row }) => {
      const user = row.original;
      const initials = `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase();
      const displayName = user.first_name && user.last_name
        ? `${user.first_name} ${user.last_name}`
        : user.username || "Unknown User";

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.avatar_url || ""} alt={displayName} />
            <AvatarFallback>{initials || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{displayName}</span>
            {user.username && (
              <span className="text-xs text-muted-foreground">@{user.username}</span>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const email = row.original.email;
      return email ? (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{email}</span>
        </div>
      ) : (
        <span className="text-sm text-muted-foreground">No email</span>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      const phone = row.original.phone;
      return phone ? (
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{phone}</span>
        </div>
      ) : (
        <span className="text-sm text-muted-foreground">No phone</span>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Joined",
    cell: ({ row }) => {
      const date = row.original.created_at;
      return (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {date ? format(new Date(date), "MMM dd, yyyy") : "N/A"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "last_active_at",
    header: "Last Active",
    cell: ({ row }) => {
      const date = row.original.last_active_at;
      if (!date) {
        return <span className="text-sm text-muted-foreground">Never</span>;
      }

      const lastActive = new Date(date);
      const now = new Date();
      const diffInDays = Math.floor(
        (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24)
      );

      const isRecent = diffInDays <= 7;

      return (
        <div className="flex items-center gap-2">
          <Activity
            className={cn(
              "h-4 w-4",
              isRecent ? "text-green-600" : "text-muted-foreground"
            )}
          />
          <span className="text-sm">
            {format(lastActive, "MMM dd, yyyy")}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.id)}
            >
              Copy user ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View profile</DropdownMenuItem>
            <DropdownMenuItem>View enrollments</DropdownMenuItem>
            <DropdownMenuItem>Send message</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              Suspend user
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
