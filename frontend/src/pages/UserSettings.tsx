import { useState, useEffect } from 'react'
import { Dashboard } from '@/components/Dashboard'
import supabase from '@/supabase'
import type { User } from '@supabase/supabase-js'

export function UserSettings() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    // Navigation will be handled by the router
  }

  if (!user) {
    return (
      <div className="p-6">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">User Settings</h1>
      <Dashboard user={user} onLogout={handleLogout} />
    </div>
  )
}