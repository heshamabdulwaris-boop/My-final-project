import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LogIn, UserPlus, User, LogOut, LayoutDashboard } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@contexts/AuthContext'
import { getUserInitials } from '@utils/getUserInitials'

const avatarBgStyles = {
  buyer: 'bg-blue-500',
  seller: 'bg-emerald-500',
  admin: 'bg-purple-500',
  superadmin: 'bg-red-500',
}

export function UserMenu() {
  const { isAuthenticated, user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  const handleLogout = () => {
    setIsOpen(false)
    logout()
    navigate('/')
  }

  const getDashboardPath = () => {
    switch (user?.role) {
      case 'admin':
      case 'superadmin':
        return '/admin'
      case 'seller':
        return '/seller/dashboard'
      case 'buyer':
        return '/buyer/dashboard'
      default:
        return '/buyer/dashboard'
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Link to="/auth/login">
          <button
            className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Login to your account"
          >
            Login
          </button>
        </Link>
        <Link to="/auth/register">
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm"
            aria-label="Create a new account"
          >
            Sign Up
          </button>
        </Link>
      </div>
    )
  }

  const initials = getUserInitials(user?.username || user?.email)
  const roleStyle = avatarBgStyles[user?.role] || 'bg-indigo-500'

  return (
    <div 
      className="relative" 
      ref={dropdownRef}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-9 h-9 flex items-center justify-center rounded-full ${roleStyle} text-white text-sm font-semibold hover:shadow-md transition-all cursor-pointer`}
        aria-label="User menu"
        aria-expanded={isOpen}
      >
        {initials}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden z-50"
          >
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {user?.username}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                {user?.email}
              </p>
              <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-medium capitalize bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                {user?.role}
              </span>
            </div>
            <div className="py-1">
              <Link
                to={getDashboardPath()}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <User className="h-4 w-4" />
                Profile
              </Link>
              <div className="border-t border-gray-100 dark:border-gray-700 my-1" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
