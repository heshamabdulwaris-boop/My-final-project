import { Navigate } from 'react-router-dom'
import { useAuth } from '@contexts/AuthContext'
import { ROLES } from '@constants/roles'

export function BuyerRoute({ children }) {
  const { user, isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />
  }

  // Allow access for buyers and admins (admins can also access buyer dashboard)
  if (user?.role === ROLES.BUYER || user?.role === ROLES.ADMIN || user?.role === ROLES.SUPERADMIN) {
    return children
  }

  // Redirect sellers to their dashboard
  if (user?.role === ROLES.SELLER) {
    return <Navigate to="/seller" replace />
  }

  // Default redirect to home
  return <Navigate to="/" replace />
}
