import { useState, useEffect } from 'react'
import supabase from '@/supabase'
import type { User } from '@supabase/supabase-js'

export function DashboardHome() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="text-lg text-muted-foreground">
        Hello {user?.email || 'User'}!
      </p>
    </div>
  )
}