import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SearchBar } from './SearchBar'
import { NavLinks } from './NavLinks'
import { UserMenu } from './UserMenu'
import { MobileMenu } from './MobileMenu'
import { Moon, Sun, ShoppingCart } from 'lucide-react'
import { useTheme } from '@contexts/ThemeContext'
import { useCart } from '@contexts/CartContext'
import logo from '@assets/logo/dp logo.png'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { cartCount } = useCart()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-md border-b border-gray-100 dark:border-gray-800'
          : 'bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="flex items-center gap-1 group"
              aria-label="Digital Shop - Home"
            >
              <div className="relative">
                <img
                  src={logo}
                  alt="Digital Shop Logo"
                  className="h-9 w-auto rounded-xl"
                />
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white hidden sm:block group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Digital Shop
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-1 lg:ml-12">
            <NavLinks />
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:block flex-1 max-w-md mx-8">
            <SearchBar />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Cart Icon */}
            <Link
              to="/buyer/cart"
              className="relative p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 group"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-indigo-600 text-white text-xs font-bold shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 group"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
              ) : (
                <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
              )}
            </button>

            {/* User Menu - Desktop */}
            <div className="hidden lg:block">
              <UserMenu />
            </div>

            {/* Mobile Menu Button */}
            <MobileMenu />
          </div>
        </div>
      </div>
    </motion.header>
  )
}
