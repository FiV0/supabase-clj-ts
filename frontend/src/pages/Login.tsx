import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoginPage } from '@/components/LoginPage'
import { SignUpPage } from '@/components/SignUpPage'
import supabase from '@/supabase'

export function Login() {
  const [showSignUp, setShowSignUp] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        navigate('/dashboard', { replace: true })
      }
    }
    checkUser()
  }, [navigate])

  const handleAuthSuccess = () => {
    navigate('/dashboard', { replace: true })
  }

  if (showSignUp) {
    return (
      <SignUpPage 
        onSuccess={handleAuthSuccess} 
        onLoginClick={() => setShowSignUp(false)}
      />
    )
  }

  return (
    <LoginPage 
      onSuccess={handleAuthSuccess} 
      onSignUpClick={() => setShowSignUp(true)}
    />
  )
}