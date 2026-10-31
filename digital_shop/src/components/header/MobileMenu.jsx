import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { X, Menu, User, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { SearchBar } from './SearchBar'
import { NavLinks } from './NavLinks'
import { useTheme } from '@contexts/ThemeContext'
import { useAuth } from '@contexts/AuthContext'
import { getUserInitials } from '@utils/getUserInitials'

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const { toggleTheme } = useTheme()
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsOpen(false)
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    } else {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleClose = () => setIsOpen(false)

  const handleLogout = () => {
    handleClose()
    logout()
    navigate('/')
  }

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="rounded-lg p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden relative z-50"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/50 z-[60] lg:hidden"
              aria-hidden="true"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-screen w-80 max-w-[85vw] bg-white dark:bg-gray-900 shadow-2xl z-[70] lg:hidden overflow-hidden"
              role="dialog"
              aria-modal="true"
              aria-labelledby="mobile-menu-title"
            >
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 p-4 shrink-0">
                  <h2 id="mobile-menu-title" className="text-lg font-semibold text-gray-900 dark:text-white">
                    Menu
                  </h2>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClose}
                    className="rounded-lg p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    aria-label="Close menu"
                  >
                    <X className="h-6 w-6" />
                  </motion.button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  <div className="mb-6">
                    <SearchBar isMobile onClose={handleClose} />
                  </div>

                  <NavLinks isMobile onClose={handleClose} />

                  <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
                    {isAuthenticated ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 px-2 pb-3 border-b border-gray-100 dark:border-gray-700">
                          <span className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-600 text-white text-sm font-bold flex-shrink-0">
                            {getUserInitials(user?.username || user?.email)}
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.username}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                          </div>
                        </div>
                        <Link
                          to="/profile"
                          onClick={handleClose}
                          className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        >
                          <User className="h-5 w-5" />
                          Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                        >
                          <LogOut className="h-5 w-5" />
                          Logout
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <Link to="/auth/login" onClick={handleClose}>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                          >
                            Login
                          </motion.button>
                        </Link>
                        <Link to="/auth/register" onClick={handleClose}>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-base font-medium text-white hover:bg-indigo-700 transition-colors"
                          >
                            Register
                          </motion.button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 p-4 shrink-0">
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    © 2026 Digital Shop
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
