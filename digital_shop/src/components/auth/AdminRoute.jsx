import { Navigate } from 'react-router-dom'
import { useAuth } from '@contexts/AuthContext'
import { ROLES } from '@constants/roles'
import { Loader2 } from 'lucide-react'

export function AdminRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  const isAdmin = user?.role === ROLES.ADMIN || user?.is_super_admin === true

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return children
}
