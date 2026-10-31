import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, ArrowUpRight } from 'lucide-react'
import sellerService from '@services/seller/sellerService'

export function RevenueReport({ filters }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRevenueData()
  }, [filters])

  const fetchRevenueData = async () => {
    try {
      setLoading(true)
      // Use dashboard stats for real data
      const response = await sellerService.getDashboardStats()
      setData(response.data)
    } catch (err) {
      console.error('Error fetching revenue report:', err)
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
    revenue: 0,
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
            <DollarSign className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Revenue Report
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
          className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-xl p-4 border border-indigo-200 dark:border-indigo-800"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Total Revenue</span>
            <DollarSign className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
            ${(stats.revenue || 0).toLocaleString()}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <ArrowUpRight className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
              From dashboard
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
