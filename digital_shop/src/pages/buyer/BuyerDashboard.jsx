import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@contexts/ToastContext'
import { useOrderHistory } from '@hooks/useOrderQueries'
import orderService from '@services/order/orderService'
import buyImage from '@assets/images/buy.jpg'
import { 
  ShoppingBag, 
  DollarSign, 
  Download, 
  Package,
  ArrowRight,
  Loader2,
  Calendar,
  TrendingUp
} from 'lucide-react'

export function BuyerDashboard() {
  const navigate = useNavigate()
  const { error: showError } = useToast()
  
  // React Query hook for order history
  const { data: orders = [], isLoading: ordersLoading, error: ordersError } = useOrderHistory()
  
  // Local state for purchased and downloads (still using direct API calls)
  const [purchasedData, setPurchasedData] = useState([])
  const [downloadsData, setDownloadsData] = useState([])
  const [purchasedLoading, setPurchasedLoading] = useState(true)
  const [downloadsLoading, setDownloadsLoading] = useState(true)
  const [purchasedError, setPurchasedError] = useState(null)
  const [downloadsError, setDownloadsError] = useState(null)

  // Calculate stats from orders
  const stats = useMemo(() => {
    const totalSpent = orders
      .filter(order => order.status === 'paid')
      .reduce((sum, order) => sum + (parseFloat(order.total_price) || 0), 0)

    return {
      totalOrders: orders.length,
      totalSpent,
      totalPurchases: purchasedData.length,
      totalDownloads: downloadsData.length
    }
  }, [orders, purchasedData, downloadsData])

  // Get recent orders (last 3)
  const recentOrders = useMemo(() => orders.slice(0, 3), [orders])

  // Fetch purchased and downloads data
  useEffect(() => {
    const fetchAdditionalData = async () => {
      try {
        setPurchasedLoading(true)
        setDownloadsLoading(true)
        setPurchasedError(null)
        setDownloadsError(null)
        
        // Fetch purchased products
        try {
          const purchased = await orderService.getMyPurchased()
          setPurchasedData(Array.isArray(purchased) ? purchased : [])
        } catch (err) {
          console.error('Failed to load purchased products:', err)
          setPurchasedError('Failed to load purchases')
          setPurchasedData([])
        }
        
        // Fetch downloads
        try {
          const downloads = await orderService.getMyDownloads()
          setDownloadsData(Array.isArray(downloads) ? downloads : [])
        } catch (err) {
          console.error('Failed to load downloads:', err)
          setDownloadsError('Failed to load downloads')
          setDownloadsData([])
        }
      } catch (err) {
        console.error('Dashboard data fetch error:', err)
      } finally {
        setPurchasedLoading(false)
        setDownloadsLoading(false)
      }
    }
    
    fetchAdditionalData()
  }, [])

  const loading = ordersLoading
  const error = ordersError

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { 
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', 
        label: 'Pending'
      },
      paid: { 
        color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', 
        label: 'Paid'
      },
      failed: { 
        color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', 
        label: 'Failed'
      },
      canceled: { 
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400', 
        label: 'Canceled'
      },
    }
    
    const config = statusConfig[status] || statusConfig.pending
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <Package className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Error Loading Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with background image */}
        <div className="relative mb-8 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${buyImage})` }}></div>
          <div className="absolute inset-0 bg-black/40 dark:bg-black/60"></div>
          <div className="relative p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-white/80 text-sm md:text-base">
              Your purchases and activity overview
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Orders */}
          <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-5 border border-gray-200/50 dark:border-gray-700/50 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-200 cursor-pointer" onClick={() => navigate('/buyer/order-history')}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Orders</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">
                  {stats.totalOrders}
                </p>
              </div>
              <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl">
                <ShoppingBag className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1">
              <ArrowRight className="w-3 h-3 text-indigo-500" />
              <span className="text-xs text-indigo-500 font-medium">View all orders</span>
            </div>
          </div>

          {/* Total Spent */}
          <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-5 border border-gray-200/50 dark:border-gray-700/50 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-200 cursor-pointer" onClick={() => navigate('/buyer/order-history')}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Spent</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">
                  ${stats.totalSpent.toFixed(2)}
                </p>
              </div>
              <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl">
                <DollarSign className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-500" />
              <span className="text-xs text-emerald-500 font-medium">View spending history</span>
            </div>
          </div>

          {/* My Purchases */}
          <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-5 border border-gray-200/50 dark:border-gray-700/50 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-200 cursor-pointer" onClick={() => navigate('/buyer/my-purchased')}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">My Purchases</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">
                  {stats.totalPurchases}
                </p>
              </div>
              <div className="p-2.5 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                <Package className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1">
              <ArrowRight className="w-3 h-3 text-purple-500" />
              <span className="text-xs text-purple-500 font-medium">View purchased products</span>
            </div>
          </div>

          {/* Downloads */}
          <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-5 border border-gray-200/50 dark:border-gray-700/50 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-200 cursor-pointer" onClick={() => navigate('/buyer/my-downloads')}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Downloads</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">
                  {stats.totalDownloads}
                </p>
              </div>
              <div className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                <Download className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1">
              <ArrowRight className="w-3 h-3 text-blue-500" />
              <span className="text-xs text-blue-500 font-medium">View download history</span>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
          <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
              Recent Orders
            </h2>
            <button
              onClick={() => navigate('/buyer/order-history')}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-xs font-medium"
            >
              View All
            </button>
          </div>

          {recentOrders.length > 0 ? (
            <div className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors cursor-pointer"
                  onClick={() => navigate('/buyer/order-history')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                        <ShoppingBag className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Order #{order.id}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mt-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(order.created_at)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {getStatusBadge(order.status)}
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        ${order.total_price}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                No Orders Yet
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
                You haven't placed any orders yet. Start by browsing our products.
              </p>
              <button
                onClick={() => navigate('/products')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                Browse Products
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
