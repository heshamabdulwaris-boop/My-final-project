import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Marketplace', path: '/products' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
]

export function NavLinks({ isMobile = false, onClose }) {
  const linkClass = isMobile
    ? 'block w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors rounded-lg'
    : 'relative px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800'

  return (
    <nav aria-label="Main navigation">
      <ul className={isMobile ? 'flex flex-col space-y-1' : 'flex items-center space-x-1'}>
        {navLinks.map((link) => (
          <li key={link.path}>
            <NavLink
              to={link.path}
              onClick={onClose}
              className={({ isActive }) =>
                `${linkClass} ${isActive ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 font-semibold' : ''}`
              }
              end={link.path === '/'}
            >
              {isMobile ? (
                link.name
              ) : (
                link.name
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
