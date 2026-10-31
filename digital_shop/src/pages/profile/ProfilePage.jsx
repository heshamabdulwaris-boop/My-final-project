import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Shield, Edit, Home, Loader2, AlertCircle } from 'lucide-react'
import profileService from '@services/profile/profileService'
import { useToast } from '@contexts/ToastContext'
import { useAuth } from '@contexts/AuthContext'
import { getUserInitials } from '@utils/getUserInitials'

// Role badge color mapping
const roleBadgeStyles = {
  buyer: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  seller: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  admin: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  superadmin: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

// Avatar background color mapping
const avatarStyles = {
  buyer: 'bg-blue-600',
  seller: 'bg-emerald-600',
  admin: 'bg-purple-600',
  superadmin: 'bg-red-600',
}

// Skeleton loader component
function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="text-center sm:text-left flex-1 space-y-3">
              <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded-lg w-48 mx-auto sm:mx-0 animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-64 mx-auto sm:mx-0 animate-pulse" />
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-20 mx-auto sm:mx-0 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const { userRole } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { success: showSuccess, error: showError } = useToast()

  const handleDashboardClick = () => {
    if (userRole === 'admin' || userRole === 'superadmin') {
      navigate('/admin')
    } else if (userRole === 'seller') {
      navigate('/seller/dashboard')
    } else {
      navigate('/buyer/dashboard')
    }
  }

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await profileService.getProfile()
      setProfile(response.data)
    } catch (err) {
      console.error('Profile fetch error:', err)
      // Let the token refresh interceptor handle 401 errors
      // Only show error if it's not a 401 or if refresh already failed
      if (err.response?.status !== 401) {
        const message = err.response?.data?.detail || 'Failed to load profile'
        setError(message)
        showError(message)
      }
    } finally {
      setLoading(false)
    }
  }


  // Loading state
  if (loading) {
    return <ProfileSkeleton />
  }

  // Error state (initial fetch failed)
  if (error && !profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Failed to load profile
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={fetchProfile}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!profile) return null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar */}
            <div
              className={`w-24 h-24 rounded-full ${avatarStyles[profile.role] || 'bg-indigo-600'} flex items-center justify-center text-white text-3xl font-bold shadow-lg flex-shrink-0`}
            >
              {getUserInitials(profile.username || profile.email)}
            </div>

            {/* Info */}
            <div className="text-center sm:text-left flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white truncate">
                {profile.username}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                {profile.email}
              </p>
              <span
                className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold capitalize ${roleBadgeStyles[profile.role] || 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
              >
                {profile.role}
              </span>
            </div>

            {/* Edit Button */}
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleDashboardClick}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Home className="w-4 h-4" />
                Dashboard
              </button>
              <button
                onClick={() => navigate('/profile/edit')}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Profile Details */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Username */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
              <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Username
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {profile.username}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
              <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Email
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {profile.email}
                </p>
              </div>
            </div>

            {/* Role */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
              <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Role
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                  {profile.role}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
