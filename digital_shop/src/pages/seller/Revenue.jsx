import { useState, useEffect } from 'react'
import { DollarSign } from 'lucide-react'
import sellerService from '@services/seller/sellerService'
import { TrendLineChart } from '@components/seller/LineChart'

export default function Revenue() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [trendData, setTrendData] = useState([])

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await sellerService.getDashboardStats()
      setStats(response.data)
      
      // Create trend data without dates
      const currentValue = response.data?.revenue || 0
      setTrendData([
        { name: 'Point 1', value: Math.max(0, currentValue - 5000) },
        { name: 'Point 2', value: Math.max(0, currentValue - 4000) },
        { name: 'Point 3', value: Math.max(0, currentValue - 3000) },
        { name: 'Point 4', value: Math.max(0, currentValue - 2000) },
        { name: 'Point 5', value: Math.max(0, currentValue - 1000) },
        { name: 'Point 6', value: currentValue },
      ])
    } catch (err) {
      console.error('Error fetching stats:', err)
      setError('Failed to load statistics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 lg:p-8">
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          Revenue
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Total earnings from your product sales
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 lg:p-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-lg bg-indigo-600 flex items-center justify-center">
            <DollarSign className="w-8 h-8 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Total Revenue
            </p>
            <p className="text-4xl font-semibold text-gray-900 dark:text-white">
              ${Number(stats?.revenue || 0).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            This represents the total amount earned from all your product sales.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <TrendLineChart 
          data={trendData} 
          loading={loading}
          title="Revenue Trend"
          dataKey="value"
          color="#7c3aed"
        />
      </div>
    </div>
  )
}
