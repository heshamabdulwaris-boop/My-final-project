import { Navigate } from 'react-router-dom'
import { useAuth } from '@contexts/AuthContext'
import { Loader2 } from 'lucide-react'

export function SellerRoute({ children }) {
  const { userRole, user, loading } = useAuth()

  console.log('SellerRoute - userRole:', userRole)
  console.log('SellerRoute - user:', user)
  console.log('SellerRoute - loading:', loading)

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

  if (userRole !== 'seller') {
    console.log('SellerRoute - Redirecting to home, userRole is not seller')
    return <Navigate to="/" replace />
  }

  return children
}
