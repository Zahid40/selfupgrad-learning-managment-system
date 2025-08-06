import { redirect } from 'next/navigation'

import { LogoutButton } from '@/components/logout-button'
import { createClient } from '@/lib/server'
import { getUser } from '@/action/user/user'

export default async function ProtectedPage() {
  const user = await getUser()
  console.log('ProtectedPage data:', user)

  return (
    <div className="flex h-svh w-full items-center justify-center gap-2">
      <p>
        Hello <span>{user.username}</span>
      </p>
      <LogoutButton />
    </div>
  )
}
