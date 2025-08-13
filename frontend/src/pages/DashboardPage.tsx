import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Dashboard } from '@/components/Dashboard'
import supabase from '@/supabase'
import type { User } from '@supabase/supabase-js'

export function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login', { replace: true })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-svh">
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    navigate('/login', { replace: true })
    return null
  }

  return <Dashboard user={user} onLogout={handleLogout} />
}