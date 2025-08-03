import { GalleryVerticalEnd } from "lucide-react";

import { LoginForm } from "@/components/login-form";
import { Logo } from "@/components/logo";
import Image from "next/image";
import ThemeToggleButton from "@/components/ui/theme-toggle-button";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col  gap-4 p-6 md:p-10">
        <div className="absolute top-4 right-6 z-50">
          <ThemeToggleButton />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm flex flex-col items-center gap-4">
            <Logo variant="full" width={180} height={60} />
            {children}
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block ">
        <Image
          src="/images/auth-page-bg.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover  dark:grayscale-50"
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
    </div>
  );
}
