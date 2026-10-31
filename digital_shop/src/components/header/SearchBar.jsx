import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function SearchBar({ isMobile = false, onClose }) {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const navigate = useNavigate()

  const handleClear = () => {
    setQuery('')
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`)
      if (onClose) onClose()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsFocused(false)
      if (onClose) onClose()
    } else if (e.key === 'Enter') {
      handleSearch(e)
    }
  }

  return (
    <div className="relative">
      <div
        className={`relative flex items-center ${
          isMobile ? 'w-full' : 'w-full'
        }`}
      >
        <Search
          className={`absolute left-3 h-4 w-4 text-gray-400 dark:text-gray-500 transition-colors ${
            isFocused ? 'text-indigo-500 dark:text-indigo-400' : ''
          }`}
          aria-hidden="true"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder="Search products..."
          className={`w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 py-2 pl-10 pr-10 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-indigo-500 dark:focus:border-indigo-400 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
            isMobile ? 'py-3' : ''
          }`}
          aria-label="Search products"
          aria-expanded={isFocused}
        />
        <AnimatePresence>
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleClear}
              className="absolute right-2 rounded-md p-1 text-gray-400 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none transition-colors"
              aria-label="Clear search"
              type="button"
            >
              <X className="h-3 w-3" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
