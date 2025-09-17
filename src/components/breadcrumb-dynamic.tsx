"use client";
import { FoldersIcon } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";

export default function BradCrumbDynamic() {
  const pathname = usePathname();
  const pathSegments =
    pathname?.split("/").filter((seg) => seg.length > 0) || [];
  console.log(pathSegments.length);
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {pathSegments.length > 2 && (
          <>
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger className="hover:text-foreground">
                  <span
                    role="presentation"
                    aria-hidden="true"
                    className="flex size-5 items-center justify-center"
                  >
                    <FoldersIcon size={16} />
                  </span>
                  <span className="sr-only">Toggle menu</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem asChild>
                    <a href="#">Documentation</a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="#">Themes</a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="#">GitHub</a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}
        <BreadcrumbItem>
          <BreadcrumbPage>
            {pathSegments[pathSegments.length - 1]}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
