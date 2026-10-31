import { useState, useRef, useEffect } from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { SellerSidebar } from '@components/seller/SellerSidebar'
import { Menu, X, User, LogOut, Search, Moon, Sun, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@contexts/AuthContext'
import { useTheme } from '@contexts/ThemeContext'
import { getUserInitials } from '@utils/getUserInitials'
import logo from '@assets/logo/dp logo.png'

export function SellerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const profileDropdownRef = useRef(null)

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/seller/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const handleLogout = () => {
    setProfileDropdownOpen(false)
    logout()
    navigate('/')
  }

  const initials = getUserInitials(user?.username || user?.email)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FC] dark:bg-gray-900">
      <div className="flex-1 flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:flex-shrink-0 lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:z-40 lg:overflow-y-auto">
          <SellerSidebar />
        </aside>

        {/* Mobile Sidebar Toggle */}
        <div className="lg:hidden fixed bottom-6 left-6 z-50">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setSidebarOpen(true)}
            className="w-12 h-12 rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 flex items-center justify-center hover:bg-indigo-700 transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </motion.button>
        </div>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 bg-black/50 z-[60] lg:hidden"
              />
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed left-0 top-0 h-screen w-72 bg-white dark:bg-gray-800 shadow-2xl z-[70] lg:hidden overflow-hidden"
              >
                <div className="flex items-center justify-end px-6 py-5">
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Close sidebar"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <SellerSidebar onClose={() => setSidebarOpen(false)} />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:ml-72">
          {/* Header */}
          <header className="fixed top-0 right-0 left-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg h-[72px] border-b border-gray-200/50 dark:border-gray-700/50 transition-all">
            <div className="flex items-center justify-between h-full px-6 lg:px-8 lg:pl-6">
              {/* Left Section - Logo (positioned at sidebar location) */}
              <div className="flex items-center h-full lg:w-72 lg:justify-center">
                {/* Logo */}
                <Link
                  to="/"
                  className="flex items-center gap-3 text-gray-900 dark:text-white"
                  aria-label="Digital Shop - Home"
                >
                  <img
                    src={logo}
                    alt="Digital Shop Logo"
                    className="h-10 w-auto rounded-xl"
                  />
                  <span className="text-lg font-semibold text-gray-900 dark:text-white hidden sm:inline">Digital Shop</span>
                  <span className="text-lg font-semibold text-gray-900 dark:text-white sm:hidden">Digital Shop</span>
                </Link>
              </div>

              {/* Right Section - Actions */}
              <div className="flex items-center h-full gap-3">
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>

                {/* Profile Dropdown */}
                <div className="relative" ref={profileDropdownRef}>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm font-bold shadow-md shadow-indigo-500/20">
                      {initials}
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {profileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden z-50"
                      >
                        <div className="px-4 py-3 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/10 dark:to-purple-900/10">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.username || 'User'}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email || ''}</p>
                        </div>
                        <div className="py-1">
                          <Link
                            to="/profile"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                          >
                            <User className="w-4 h-4" />
                            Profile
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-x-auto mt-[72px]">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
