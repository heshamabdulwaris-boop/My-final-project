import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Package, ArrowUpRight } from 'lucide-react'
import sellerService from '@services/seller/sellerService'

export function ProductPerformanceReport({ filters }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProductData()
  }, [filters])

  const fetchProductData = async () => {
    try {
      setLoading(true)
      // Use dashboard stats and my products for real data
      const [dashboardResponse, productsResponse] = await Promise.all([
        sellerService.getDashboardStats(),
        sellerService.getMyProducts()
      ])
      
      const dashboardData = dashboardResponse.data
      const productsData = productsResponse.data || []
      
      setData({
        ...dashboardData,
        products: productsData
      })
    } catch (err) {
      console.error('Error fetching product report:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        </div>
      </div>
    )
  }

  const stats = data || {
    total_products: 0,
    products: []
  }

  // Calculate derived stats from real data
  const productsList = stats.products || []
  const totalProducts = stats.total_products || productsList.length

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center">
            <Package className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Product Performance
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {filters.dateRange === '7d' ? 'Last 7 days' : filters.dateRange === '30d' ? 'Last 30 days' : filters.dateRange === '90d' ? 'Last 90 days' : 'All time'}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Total Products</span>
            <Package className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
            {totalProducts}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <ArrowUpRight className="h-3 w-3 text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
              Active products
            </span>
          </div>
        </motion.div>
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Product</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Price</th>
            </tr>
          </thead>
          <tbody>
            {productsList.length > 0 ? (
              productsList.slice(0, 6).map((product, index) => (
                <tr key={product.id || index} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                        <Package className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{product.title || 'Product'}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">${(product.price || 0).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="py-8 text-center text-gray-500 dark:text-gray-400">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
