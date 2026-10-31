import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Loader2, AlertCircle, Package, TrendingUp } from 'lucide-react'
import sellerService from '@services/seller/sellerService'

const COLORS = {
  seller: ['#4f46e5', '#6366f1', '#818cf8'],
  others: ['#e5e7eb', '#d1d5db', '#9ca3af']
}

export function ProductPieChart() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [myProductsRes, allProductsRes] = await Promise.all([
        sellerService.getMyProducts().catch(() => ({ data: [] })),
        sellerService.getAllProducts().catch(() => ({ data: [] }))
      ])

      const myProductsCount = myProductsRes.data.count || myProductsRes.data.length || 0
      const allProductsCount = allProductsRes.data.count || allProductsRes.data.length || 0
      const otherProductsCount = Math.max(0, allProductsCount - myProductsCount)

      const percentage = allProductsCount > 0 
        ? ((myProductsCount / allProductsCount) * 100).toFixed(1)
        : 0

      setData({
        myProducts: myProductsCount,
        otherProducts: otherProductsCount,
        total: allProductsCount,
        percentage: parseFloat(percentage)
      })
    } catch (err) {
      console.error('Error fetching product data:', err)
      // Handle 404 gracefully - show no data instead of error
      setData({
        myProducts: 0,
        otherProducts: 0,
        total: 0,
        percentage: 0
      })
      setError(null)
    } finally {
      setLoading(false)
    }
  }

  const chartData = data ? [
    { name: 'Your Products', value: data.myProducts },
    { name: 'Other Products', value: data.otherProducts }
  ] : []

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      const percentage = data.value > 0 && chartData[0].value + chartData[1].value > 0
        ? ((data.value / (chartData[0].value + chartData[1].value)) * 100).toFixed(1)
        : 0
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl">
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{data.name}</p>
          <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
            {data.value} <span className="text-sm font-normal text-gray-500 dark:text-gray-400">products</span>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{percentage}% of total</p>
        </div>
      )
    }
    return null
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-4 shadow-sm">
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-4 shadow-sm">
        <div className="flex items-center justify-center h-48">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <p className="text-sm text-gray-600 dark:text-gray-400">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!data || data.total === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-4 shadow-sm">
        <div className="flex items-center justify-center h-48">
          <div className="text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-600 dark:text-gray-400">No products available</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          Product Distribution
        </h3>
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <TrendingUp className="w-4 h-4" />
          <span>Market Share</span>
        </div>
      </div>
      
      <div className="relative">
        <div className="w-full h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={0}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                <Cell 
                  fill={COLORS.seller[0]} 
                  className="hover:opacity-90 transition-opacity cursor-pointer"
                  strokeWidth={0}
                />
                <Cell 
                  fill={COLORS.others[0]} 
                  className="dark:fill-gray-700 hover:opacity-90 transition-opacity cursor-pointer"
                  strokeWidth={0}
                />
              </Pie>
              <Tooltip 
                content={<CustomTooltip />} 
                offset={20}
                wrapperStyle={{ zIndex: 100 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {data.percentage}%
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Your Share</p>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
            {data.myProducts}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Your Products</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-gray-700 dark:text-gray-300">
            {data.otherProducts}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Other Products</p>
        </div>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-500 text-center mt-3">
        Total marketplace: {data.total} products
      </p>
    </div>
  )
}
