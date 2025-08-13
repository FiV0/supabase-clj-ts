import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Login } from '@/pages/Login'
import { DashboardHome } from '@/pages/DashboardHome'
import { Items } from '@/pages/Items'
import { UserSettings } from '@/pages/UserSettings'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { DashboardLayout } from '@/components/DashboardLayout'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/dashboard/*" 
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Routes>
                  <Route index element={<DashboardHome />} />
                  <Route path="items" element={<Items />} />
                  <Route path="settings" element={<UserSettings />} />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  )
}

export default App
