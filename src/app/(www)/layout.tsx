import { getUser } from '@/action/user/user.action';
import { UserProvider } from '@/components/provider/user-provider'
import React from 'react'

export default async  function AppLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const user = await getUser();
  return (
    <UserProvider initialUser={user}>
        {children}
    </UserProvider>
  )
}
