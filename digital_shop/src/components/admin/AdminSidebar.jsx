import { NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, Package, ShoppingCart, BarChart3, FileText, Settings, ChevronDown, User, MessageCircle } from 'lucide-react'
import { useState } from 'react'

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: Users, label: 'Users', path: '/admin/users' },
  { icon: Package, label: 'Products', path: '/admin/products' },
  { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
  { icon: BarChart3, label: 'Reports', path: '/admin/reports' },
  { icon: MessageCircle, label: 'Contact Messages', path: '/admin/contact-messages' },
  { icon: FileText, label: 'Logs', path: '/admin/logs' },
]

const settingsSubmenu = [
  { icon: User, label: 'Edit Profile', path: '/admin/settings' },
]

export function AdminSidebar({ onClose }) {
  const location = useLocation()
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      <nav className="flex flex-col gap-2 px-3 py-4 flex-1" aria-label="Admin navigation">
        {/* Navigation Section Title */}
        <p className="px-3 py-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          Admin Menu
        </p>

        {/* Regular nav items */}
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">{item.label}</span>
            </NavLink>
          )
        })}

        {/* Settings with submenu */}
        <div>
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className={`flex items-center justify-between w-full gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              settingsOpen || location.pathname.startsWith('/admin/settings')
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">Settings</span>
            </div>
            <ChevronDown className={`h-3 w-3 flex-shrink-0 transition-transform ${settingsOpen ? 'rotate-180' : ''}`} />
          </button>

          {settingsOpen && (
            <div className="ml-3 mt-1 space-y-1">
              {settingsSubmenu.map((item) => {
                const isActive = location.pathname === item.path
                const Icon = item.icon

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon className="h-3 w-3 flex-shrink-0" />
                    <span className="text-xs">{item.label}</span>
                  </NavLink>
                )
              })}
            </div>
          )}
        </div>
      </nav>
    </div>
  )
}
