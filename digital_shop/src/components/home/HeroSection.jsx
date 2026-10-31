import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Search, X } from 'lucide-react'
import { useAuth } from '@contexts/AuthContext'

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <section className="relative overflow-hidden bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-18 pb-20 lg:pt-20 lg:pb-28 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-h1 font-bold text-gray-900 dark:text-white leading-tight"
            >
              Sell and Discover
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#635BFF] to-[#0EA5E9]">
                Premium Digital Products
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base text-[#6B7280] max-w-2xl mx-auto leading-relaxed"
            >
              A modern marketplace for creators, startups, and digital entrepreneurs. Buy and sell ebooks, templates, graphics, audio, and more.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full"
            >
              <Link to="/products" className="w-full sm:w-auto">
                <button
                  className="w-full sm:w-auto px-8 py-4 bg-[#635BFF] text-white font-semibold hover:bg-[#4F47E6] transition-all duration-250 ease flex items-center justify-center gap-2 cursor-pointer"
                  style={{ borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                >
                  Explore Marketplace
                  <ArrowRight className="h-5 w-5" />
                </button>
              </Link>
              <button
                onClick={() => {
                  if (user) {
                    navigate('/seller/dashboard')
                  } else {
                    navigate('/auth/register')
                  }
                }}
                className="w-full sm:w-auto px-8 py-4 font-semibold transition-all duration-250 ease cursor-pointer"
                style={{ borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', color: 'black', backgroundColor: 'white', border: '2px solid transparent' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#635BFF'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'transparent'; }}
              >
                Start Selling
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-20 max-w-[700px] mx-auto"
        >
          <form onSubmit={handleSearch} className="relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, category, or keyword..."
              className="w-full pl-12 pr-12 py-4 border border-[#E5E7EB] bg-white text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-250 ease"
              style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
              onFocus={(e) => { e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.10)'; }}
              onBlur={(e) => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}
            />
            <AnimatePresence>
              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={(e) => {
                    e.preventDefault()
                    setSearchQuery('')
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-all duration-250 ease p-2 bg-white border border-[#E5E7EB]"
                  style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.10)'; e.currentTarget.style.transform = 'translateY(-4px)'; }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  type="button"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </div>
    </section>
  )
}
