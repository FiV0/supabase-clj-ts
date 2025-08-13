import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import supabase from '@/supabase'
import type { User } from '@supabase/supabase-js'

interface DashboardProps {
  user: User
  onLogout: () => void
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [userMetadata, setUserMetadata] = useState<any>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      setUserMetadata(currentUser?.user_metadata || {})
    }
    
    fetchUserData()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    onLogout()
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 border rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Welcome!</h2>
      <div className="space-y-4">
        <p className="text-center text-green-600 font-medium">You have logged in successfully!</p>
        
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <div>
            <span className="font-medium">Email: </span>
            <span>{user.email}</span>
          </div>
          <div>
            <span className="font-medium">Name: </span>
            <span>{userMetadata?.full_name || user.user_metadata?.full_name || 'Not provided'}</span>
          </div>
          <div>
            <span className="font-medium">Role: </span>
            <span>{user.role || 'authenticated'}</span>
          </div>
          <div>
            <span className="font-medium">User ID: </span>
            <span className="text-sm text-gray-600">{user.id}</span>
          </div>
        </div>

        <Button onClick={handleLogout} className="w-full" variant="outline">
          Logout
        </Button>
      </div>
    </div>
  )
}