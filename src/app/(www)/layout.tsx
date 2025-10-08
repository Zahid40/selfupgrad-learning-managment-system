import { UserProvider } from "@/components/provider/user-provider";
import React from "react";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <UserProvider>{children}</UserProvider>;
}
