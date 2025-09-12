"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProfileCircle } from "iconsax-reactjs";

import Link from "next/link";
import { Button } from "../ui/button";
import NotificationButton from "../notificationButton";
import { LogoutButton } from "../logout-button";
import { useUser } from "../provider/user-provider";
import { useIsMobile } from "@/hooks/use-mobile";
import { LayoutDashboard } from "lucide-react";
import ThemeToggleButton from "../ui/theme-toggle-button";
import UserAvatar from "./user-avatar";

export default function UserMenu(props: { className?: string }) {
  const { user } = useUser();
  const { className } = props;

  const user_nav_menu = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Your profile",
      url: "/dashboard/account",
      icon: ProfileCircle,
    },
  ];
  return (
    <DropdownMenu >
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" className="rounded-full">
          <UserAvatar className="size-10" user={user} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="min-w-56 rounded-lg"
       
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel>
          <div className="flex items-center gap-2 rounded-full">
            <UserAvatar user={user} />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">
                {user.first_name ? user.first_name : "User"}
              </span>
              <span className="text-muted-foreground truncate text-xs">
                {user.email ?? user.phone}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {user_nav_menu.map((item) => (
            <DropdownMenuItem key={item.title}>
              <Button
                variant={"ghost"}
                size={"sm"}
                className="w-full justify-start"
                asChild
              >
                <Link href={item.url} className="flex">
                  {item.icon && <item.icon className="mr-2 size-4" />}
                  {item.title}
                </Link>
              </Button>
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem>
            <NotificationButton isFull />
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <div className="hover:bg-transparent" >
            <div className="flex px-4 py-1 justify-between w-full items-center ">
                <span className="text-xs text-muted-foreground">
                    Toggle Theme
                </span>

          <ThemeToggleButton />
            </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild variant="destructive">
          <LogoutButton className="w-full" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
