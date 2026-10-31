import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Book, Music, Layout, GraduationCap, Image, Wrench, Sparkles, FolderOpen } from 'lucide-react'
import productService from '@services/products/productService'

const CATEGORY_CONFIG = [
  { name: 'Ebooks', key: 'ebook', icon: Book, color: 'from-blue-500 via-cyan-500 to-teal-500' },
  { name: 'Courses', key: 'course', icon: GraduationCap, color: 'from-green-500 via-emerald-500 to-teal-500' },
  { name: 'Templates', key: 'template', icon: Layout, color: 'from-pink-500 via-rose-500 to-red-500' },
  { name: 'Photographs', key: 'photograph', icon: Image, color: 'from-orange-500 via-amber-500 to-yellow-500' },
  { name: 'Other', key: 'other', icon: Wrench, color: 'from-indigo-500 via-blue-500 to-cyan-500' }
]

export function FeaturedCategories() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const isFetchingRef = useRef(false)
  const cacheRef = useRef(null)

  useEffect(() => {
    fetchCategoryCounts()
  }, [])

  const handleCategoryClick = (categoryKey) => {
    console.log('Category clicked:', categoryKey)
    console.log('Navigating to:', `/products?category=${categoryKey}`)
    if (categoryKey) {
      navigate(`/products?category=${categoryKey}`)
    } else {
      navigate('/products')
    }
  }

  const fetchCategoryCounts = async () => {
    // Prevent duplicate requests
    if (isFetchingRef.current) {
      console.log('FeaturedCategories - Already fetching, skipping duplicate request')
      return
    }

    // Return cached data if available
    if (cacheRef.current) {
      console.log('FeaturedCategories - Using cached data')
      setCategories(cacheRef.current)
      setLoading(false)
      return
    }

    try {
      isFetchingRef.current = true
      setLoading(true)
      setError(null)
      const counts = await productService.getCategoryCounts()
      
      const categoriesWithCounts = CATEGORY_CONFIG.map(config => ({
        ...config,
        count: counts[config.key] || 0
      }))
      
      // Cache the result
      cacheRef.current = categoriesWithCounts
      setCategories(categoriesWithCounts)
    } catch (err) {
      console.error('Error fetching category counts:', err)
      setError('Failed to load categories')
      // Fallback to zero counts on error
      const categoriesWithCounts = CATEGORY_CONFIG.map(config => ({
        ...config,
        count: 0
      }))
      setCategories(categoriesWithCounts)
    } finally {
      setLoading(false)
      isFetchingRef.current = false
    }
  }

  if (loading) {
    return (
      <section className="py-12 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-h2 font-semibold text-[#111827] mb-4">
              Browse by Category
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
                <div className="w-20 h-20 bg-gray-200 mx-auto mb-5" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#635BFF] text-white text-sm font-medium mb-6 transition-all duration-250 ease"
            style={{ borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
          >
            <FolderOpen className="h-4 w-4" />
            <span>Explore Categories</span>
          </motion.div>
          <h2 className="text-h2 font-semibold text-[#111827] mb-4">
            Browse by Category
          </h2>
          <p className="text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore our wide range of digital products across multiple categories
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 sm:gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
              onClick={() => handleCategoryClick(category.key)}
            >
              <div className="bg-white dark:bg-gray-800 p-6 border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all duration-250 ease cursor-pointer flex flex-col items-center justify-center text-center h-full relative overflow-hidden" style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.10)'; e.currentTarget.style.transform = 'translateY(-4px)'; }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-5 dark:opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
                    backgroundSize: '24px 24px'
                  }} />
                </div>

                {/* Icon Container */}
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.15 }}
                  transition={{ duration: 0.6 }}
                  className={`w-20 h-20 bg-gradient-to-br ${category.color} flex items-center justify-center mb-5 shadow-xl ring-4 ring-white dark:ring-gray-800 relative`}
                >
                  <category.icon className="h-10 w-10 text-white" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#FFFFFF] flex items-center justify-center shadow-lg" style={{ borderRadius: '8px' }}>
                    <Sparkles className="h-3 w-3 text-[#635BFF]" />
                  </div>
                </motion.div>

                {/* Category Title */}
                <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {category.name}
                </h3>

                {/* File Count */}
                <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold text-gray-900 dark:text-white">{category.count.toLocaleString()}</span>
                  <span>files</span>
                </div>

                {/* Shine effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
