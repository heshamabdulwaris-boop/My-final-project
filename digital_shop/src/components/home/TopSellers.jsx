import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Medal, Award, Star, ChevronLeft, ChevronRight } from 'lucide-react'
import productService from '@services/products/productService'

const gradientColors = [
  'from-violet-500 via-purple-500 to-fuchsia-500',
  'from-blue-500 via-cyan-500 to-teal-500',
  'from-orange-500 via-amber-500 to-yellow-500',
  'from-pink-500 via-rose-500 to-red-500',
  'from-emerald-500 via-green-500 to-teal-500'
]

export function TopSellers() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const isFetchingRef = useRef(false)
  const cacheRef = useRef(null)

  useEffect(() => {
    fetchTopSellingProducts()
  }, [])

  const fetchTopSellingProducts = async () => {
    // Prevent duplicate requests
    if (isFetchingRef.current) {
      console.log('TopSellers - Already fetching, skipping duplicate request')
      return
    }

    // Return cached data if available
    if (cacheRef.current) {
      console.log('TopSellers - Using cached data')
      setProducts(cacheRef.current)
      setLoading(false)
      return
    }

    try {
      isFetchingRef.current = true
      setLoading(true)
      setError(null)
      const response = await productService.getTopSelling()
      
      console.log('Top selling products:', response.data)
      
      // Get base URL for media files (API base URL without /api)
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
      const MEDIA_BASE_URL = API_BASE_URL.replace('/api', '')
      
      // Fetch individual product details to get cover images, but preserve sales_count from original response
      const productsWithImages = await Promise.all(
        response.data.map(async (product) => {
          try {
            const detailResponse = await productService.getProduct(product.id)
            const productData = detailResponse.data
            // Convert relative cover image path to full URL
            if (productData.cover_image && !productData.cover_image.startsWith('http')) {
              productData.cover_image = `${MEDIA_BASE_URL}${productData.cover_image}`
            }
            // Preserve sales_count from original top-selling response
            productData.sales_count = product.sales_count
            console.log('Product with sales_count:', productData.title, productData.sales_count)
            return productData
          } catch (err) {
            // If detail fetch fails, return original product
            return product
          }
        })
      )
      
      console.log('Final products with sales:', productsWithImages.map(p => ({ title: p.title, sales_count: p.sales_count })))
      
      // Cache the result
      cacheRef.current = productsWithImages
      setProducts(productsWithImages)
    } catch (err) {
      // Silently fail - don't show the section if backend has issues
      setProducts([])
    } finally {
      setLoading(false)
      isFetchingRef.current = false
    }
  }

  const totalPages = Math.ceil(products.length / itemsPerPage)
  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const getRankIcon = (index) => {
    if (index === 0) return <Trophy className="h-5 w-5 text-yellow-500" />
    if (index === 1) return <Medal className="h-5 w-5 text-gray-400" />
    if (index === 2) return <Medal className="h-5 w-5 text-amber-600" />
    return <span className="font-bold text-gray-600 dark:text-gray-400">#{index + 1}</span>
  }

  if (loading) {
    return (
      <section className="py-12 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-h2 font-semibold text-[#111827] mb-4">
              Top Sellers
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
                <div className="h-20 bg-gray-200 mx-auto mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-12 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-h2 font-semibold text-[#111827] mb-4">
              Top Sellers
            </h2>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <button
              onClick={fetchTopSellingProducts}
              className="px-6 py-2 bg-[#635BFF] text-white hover:bg-[#4F47E6] transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    )
  }

  if (!products || products.length === 0) {
    return (
      <section className="py-12 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-h2 font-semibold text-[#111827] mb-4">
              Top Sellers
            </h2>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">No top-selling products yet.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium mb-6 shadow-lg shadow-blue-500/30 transition-all duration-250 ease"
            style={{ borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Trophy className="h-4 w-4" />
            </motion.div>
            <span>Top Selling</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-3xl md:text-4xl font-semibold text-[#111827] mb-4"
          >
            Top Sellers
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Discover the most popular products trending in our marketplace
          </motion.p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-4">
          {paginatedProducts.map((product, index) => {
            const globalIndex = (currentPage - 1) * itemsPerPage + index
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all duration-250 ease cursor-pointer text-center relative overflow-hidden h-full flex flex-col" style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.10)'; e.currentTarget.style.transform = 'translateY(-4px)'; }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  {/* Product Cover Image */}
                  <div className="relative h-44 w-full overflow-hidden bg-gray-100 dark:bg-gray-700/50" style={{ borderRadius: '12px 12px 0 0' }}>
                      {product.cover_image ? (
                        <img
                          src={product.cover_image}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className={'h-full w-full bg-gradient-to-br ' + gradientColors[globalIndex % gradientColors.length] + ' flex items-center justify-center text-white'}>
                          <Award className="h-10 w-10" />
                        </div>
                      )}
                  </div>

                  {/* Content */}
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2 text-sm line-clamp-2 h-10" title={product.title}>
                      {product.title}
                    </h3>

                    {/* Price */}
                    <div className="mb-2">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        ${product.price || '0'}
                      </span>
                    </div>

                    {/* Sales Count */}
                    <div className="flex items-center justify-center gap-1">
                      <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-3 py-1" style={{ borderRadius: '8px' }}>
                        <Star className="h-3 w-3 text-green-500 fill-current" />
                        <span className="text-xs font-semibold text-gray-900 dark:text-white">{product.sales_count} sales</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-4 mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-250 ease"
              style={{ borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
              onMouseEnter={(e) => { if (!e.currentTarget.disabled) { e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.10)'; e.currentTarget.style.transform = 'translateY(-4px)'; } }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <ChevronLeft className="h-5 w-5" />
            </motion.button>

            <div className="flex items-center gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <motion.button
                  key={i + 1}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-10 h-10 font-bold transition-all duration-250 ease ${
                    currentPage === i + 1
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400'
                  }`}
                  style={{ borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                  onMouseEnter={(e) => { if (currentPage !== i + 1) { e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.10)'; e.currentTarget.style.transform = 'translateY(-4px)'; } }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  {i + 1}
                </motion.button>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-250 ease"
              style={{ borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
              onMouseEnter={(e) => { if (!e.currentTarget.disabled) { e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.10)'; e.currentTarget.style.transform = 'translateY(-4px)'; } }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <ChevronRight className="h-5 w-5" />
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  )
}
















