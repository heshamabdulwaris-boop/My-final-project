import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, TrendingUp, ArrowUpRight } from 'lucide-react'
import sellerService from '@services/seller/sellerService'

export function SalesReport({ filters }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSalesData()
  }, [filters])

  const fetchSalesData = async () => {
    try {
      setLoading(true)
      // Use dashboard stats for real data
      const response = await sellerService.getDashboardStats()
      setData(response.data)
    } catch (err) {
      console.error('Error fetching sales report:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  const stats = data || {
    total_sales: 0,
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center">
            <ShoppingCart className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Sales Report
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {filters.dateRange === '7d' ? 'Last 7 days' : filters.dateRange === '30d' ? 'Last 30 days' : filters.dateRange === '90d' ? 'Last 90 days' : 'All time'}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Total Sales</span>
            <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
            {(stats.total_sales || 0).toLocaleString()}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <ArrowUpRight className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              From dashboard
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Revenue</span>
            <ShoppingCart className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            ${(stats.revenue || 0).toLocaleString()}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <ArrowUpRight className="h-3 w-3 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
              From dashboard
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
