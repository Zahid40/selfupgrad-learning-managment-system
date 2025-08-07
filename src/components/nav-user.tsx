"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { UserType } from "@/types/user.type";
import { Logout, Notification, Profile } from "iconsax-reactjs";
import { Button } from "./ui/button";
import Link from "next/link";
import { LogoutButton } from "./logout-button";

export function NavUser({ user }: { user: UserType }) {
  const { isMobile } = useSidebar();

  const user_nav_menu = [
    {
      title: "Account",
      url: "/dashboard/account",
      icon: Profile,
    },
    {
      title: "Notifications",
      url: "/dashboard/notifications",
      icon: Notification,
    },
  ];

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                {user.avatar_url && (
                  <AvatarImage
                    src={user.avatar_url}
                    alt={user.first_name ?? "user"}
                  />
                )}
                <AvatarFallback className="rounded-lg ">
                  {user.first_name ? user.first_name?.slice(0, 2) : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {user.first_name ?? user.username}
                </span>
                <span className="text-muted-foreground truncate text-xs">
                  {user.email}
                </span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex flex-col items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="size-12 rounded-full">
                  {user.avatar_url && (
                    <AvatarImage
                      src={user.avatar_url}
                      alt={user.first_name ?? "user"}
                    />
                  )}
                  <AvatarFallback className="rounded-lg ">
                    {user.first_name ? user.first_name?.slice(0, 2) : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {user.first_name ?? user.username}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {user_nav_menu.map((item) => (
                <DropdownMenuItem key={item.title}>
                  <Link href={item.url} className="flex ">
                    {item.icon && <item.icon className="mr-2 size-4" />}
                    {item.title}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <LogoutButton className="w-full" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
