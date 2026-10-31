import { useState, useEffect } from 'react'
import { NavLink, useLocation, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ChevronDown,
  ChevronRight,
  Package as ProductsIcon,
  ShoppingCart,
  DollarSign,
  LogOut,
  Settings,
  User,
  PieChart as PieChartIcon,
} from 'lucide-react'
import { useAuth } from '@contexts/AuthContext'

const navItems = [
  { name: 'My Products', path: '/seller/products', icon: Package },
  { name: 'Add Product', path: '/seller/upload', icon: PlusCircle },
  { name: 'Reports', path: '/seller/reports', icon: PieChartIcon },
  { name: 'Product Distribution', path: '/seller/distribution', icon: PieChartIcon },
]

const settingsSubItems = [
  { name: 'Edit Profile', path: '/profile/edit', icon: User },
]

const dashboardSubItems = [
  { name: 'Total Products', path: '/seller/dashboard/products', icon: ProductsIcon },
  { name: 'Total Sales', path: '/seller/dashboard/sales', icon: ShoppingCart },
  { name: 'Revenue', path: '/seller/dashboard/revenue', icon: DollarSign },
]

export function SellerSidebar({ isMobile = false, onClose }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [dashboardOpen, setDashboardOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { user, logout } = useAuth()

  const isDashboardActive = location.pathname.startsWith('/seller/dashboard')
  const isSettingsActive = location.pathname.startsWith('/profile')

  // Auto-open dashboard submenu when on dashboard-related pages
  // Auto-close when leaving those pages
  useEffect(() => {
    if (isDashboardActive) {
      setDashboardOpen(true)
    }
    if (isSettingsActive) {
      setSettingsOpen(true)
    }
  }, [isDashboardActive, isSettingsActive])

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      <nav className="flex flex-col gap-2 px-4 py-4 flex-1" aria-label="Seller navigation">
        {/* Navigation Section Title */}
        <p className="px-4 py-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          Main Menu
        </p>

        {/* Dashboard with submenu */}
        <div className="mt-8">
          <button
            onClick={() => {
              if (location.pathname !== '/seller/dashboard') {
                navigate('/seller/dashboard')
              }
              setDashboardOpen(!dashboardOpen)
              setSettingsOpen(false)
            }}
            className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              !settingsOpen && isDashboardActive && location.pathname === '/seller/dashboard'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                : !settingsOpen && isDashboardActive
                ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard className="h-5 w-5 flex-shrink-0" />
              <span>Dashboard</span>
            </div>
            {dashboardOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>

          <AnimatePresence>
            {dashboardOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pl-4 pt-1 pb-2 space-y-1">
                  {dashboardSubItems.map((item) => {
                    const isActive = location.pathname === item.path
                    const Icon = item.icon

                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={onClose}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                          !settingsOpen && isActive
                            ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                        }`}
                      >
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        <span>{item.name}</span>
                      </NavLink>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Products Section Title */}
        <p className="px-4 py-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-4">
          Products
        </p>

        {/* Regular nav items */}
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                !settingsOpen && isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          )
        })}

        {/* Settings Section Title */}
        <p className="px-4 py-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-4">
          Settings
        </p>

        {/* Settings with submenu */}
        <div>
          <button
            onClick={() => {
              setSettingsOpen(!settingsOpen)
              setDashboardOpen(false)
            }}
            className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              settingsOpen
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Settings className="h-5 w-5 flex-shrink-0" />
              <span>Settings</span>
            </div>
            {settingsOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>

          <AnimatePresence>
            {settingsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pl-4 pt-1 pb-2 space-y-1">
                  {settingsSubItems.map((item) => {
                    const isActive = location.pathname === item.path
                    const Icon = item.icon

                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={onClose}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                          settingsOpen && isActive
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                        }`}
                      >
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        <span>{item.name}</span>
                      </NavLink>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </div>
  )
}
