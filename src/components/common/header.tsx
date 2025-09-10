"use client";
import { useId } from "react";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Logo } from "../logo";
import ThemeToggleButton from "../ui/theme-toggle-button";
import AnnouncementBar from "../announcementBar";
import Link from "next/link";
import { useUser } from "../provider/user-provider";

// Navigation links array to be used in both desktop and mobile menus
const navigationLinks = [
  { href: "/course/academic", label: "Academic" },
  { href: "#", label: "Categories" },
  { href: "#", label: "Deals" },
];

export default function Header() {
  const id = useId();
  const { user } = useUser();

  return (
    <header className="border-b ">
      <AnnouncementBar />
      <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-6">
        {/* Left side */}
        <div className="flex flex-1 items-center gap-2">
          {/* Main nav */}
          <div className="flex flex-1 items-center gap-6 max-md:justify-between">
            <a href="#" className="text-primary hover:text-primary/90">
              <Logo variant="full" className="w-32  md:w-38" />
            </a>
            {/* Search form */}
            <div className="relative">
              <Input
                id={id}
                className="peer h-8 ps-8 pe-2"
                placeholder="Search..."
                type="search"
              />
              <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 peer-disabled:opacity-50">
                <SearchIcon size={16} />
              </div>
            </div>
            {/* Navigation menu */}
            <NavigationMenu className="max-md:hidden">
              <NavigationMenuList className="gap-2">
                {navigationLinks.map((link, index) => (
                  <NavigationMenuItem key={index}>
                    <NavigationMenuLink
                      href={link.href}
                      className="text-muted-foreground hover:text-primary py-1.5 font-medium"
                    >
                      {link.label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>

        {/* Mobile menu trigger */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              className="group size-8 md:hidden"
              variant="ghost"
              size="icon"
            >
              <svg
                className="pointer-events-none"
                width={16}
                height={16}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 12L20 12"
                  className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                />
                <path
                  d="M4 12H20"
                  className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                />
                <path
                  d="M4 12H20"
                  className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                />
              </svg>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-36 p-1 md:hidden">
            <NavigationMenu className="max-w-none *:w-full">
              <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                {navigationLinks.map((link, index) => (
                  <NavigationMenuItem key={index} className="w-full">
                    <NavigationMenuLink href={link.href} className="py-1.5">
                      {link.label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
                <NavigationMenuItem
                  className="w-full"
                  role="presentation"
                  aria-hidden="true"
                >
                  <div
                    role="separator"
                    aria-orientation="horizontal"
                    className="bg-border -mx-1 my-1 h-px"
                  ></div>
                </NavigationMenuItem>
                {user ? (
                  <NavigationMenuItem className="w-full">
                    <NavigationMenuLink href="/dashboard" className="py-1.5">
                      Dashboard
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ) : (
                  <>
                    <NavigationMenuItem className="w-full">
                      <NavigationMenuLink href="/auth/login" className="py-1.5">
                        Login
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem className="w-full">
                      <NavigationMenuLink
                        href="/auth/sign-up"
                        className="py-1.5"
                      >
                        Sign Up
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  </>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </PopoverContent>
        </Popover>
        {/* Right side */}
        <div className="flex items-center gap-2 max-md:hidden">
          {user ? (
            <Button asChild>
              <Link href={"/dashboard"}>Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="default" size="sm" className="text-sm">
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild variant="secondary" size="sm" className="text-sm">
                <Link href="/auth/sign-up">Sign Up</Link>
              </Button>
            </>
          )}

          <ThemeToggleButton />
        </div>
      </div>
    </header>
  );
}
