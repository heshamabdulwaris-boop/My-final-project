import { Link, useLocation } from 'react-router-dom'
import { Home, ShoppingBag, Package, Download, LayoutDashboard, Settings, ChevronDown, User } from 'lucide-react'
import { useState } from 'react'

export function BuyerSidebar({ onClose }) {
  const location = useLocation()
  const [settingsOpen, setSettingsOpen] = useState(false)

  const menuItems = [
    { name: 'Dashboard', href: '/buyer/dashboard', icon: LayoutDashboard },
    { name: 'Order History', href: '/buyer/order-history', icon: ShoppingBag },
    { name: 'My Purchases', href: '/buyer/my-purchased', icon: Package },
    { name: 'My Downloads', href: '/buyer/my-downloads', icon: Download },
  ]

  const settingsSubmenu = [
    { name: 'Edit Profile', href: '/profile/edit', icon: User },
  ]

  return (
    <div className="flex flex-col h-full">
      {/* Logo Section */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/50">
        <Link
          to="/buyer/dashboard"
          onClick={onClose}
          className="flex items-center gap-2"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <LayoutDashboard className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-bold text-gray-900 dark:text-white">Buyer</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : ''}`} />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          )
        })}

        {/* Settings with submenu */}
        <div>
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className={`flex items-center justify-between w-full gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              settingsOpen || location.pathname.startsWith('/profile')
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
            }`}
          >
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="text-sm font-medium">Settings</span>
            </div>
            <ChevronDown className={`w-3 h-3 flex-shrink-0 transition-transform ${settingsOpen ? 'rotate-180' : ''}`} />
          </button>

          {settingsOpen && (
            <div className="ml-3 mt-1 space-y-1">
              {settingsSubmenu.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span className="text-xs">{item.name}</span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </nav>
    </div>
  )
}
