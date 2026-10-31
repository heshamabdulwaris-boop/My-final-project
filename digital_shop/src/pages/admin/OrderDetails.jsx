import { useParams } from 'react-router-dom'
import { useAdminOrderDetail } from '@hooks/admin/useAdminOrders'
import { StatusBadge } from '@components/admin/StatusBadge'
import { ArrowLeft, Package, DollarSign, Calendar, User, CreditCard, ShoppingBag } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function OrderDetails() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { data, isLoading, error } = useAdminOrderDetail(orderId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">Error loading order details</p>
      </div>
    )
  }

  const order = data

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/orders')}
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">Order Details</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">View complete order information and items</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <ShoppingBag className="w-4 h-4 text-[rgb(54,3,222)]" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">#{order.id}</span>
        </div>
      </div>

      {/* Key Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-5 border border-gray-200/50 dark:border-gray-700/50 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white mt-2">
                {order.customer}
              </p>
            </div>
            <div className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-5 border border-gray-200/50 dark:border-gray-700/50 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</p>
              <div className="mt-2">
                <StatusBadge status={order.status} />
              </div>
            </div>
            <div className="p-2.5 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
              <Package className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-5 border border-gray-200/50 dark:border-gray-700/50 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white mt-2">
                ${order.total_price}
              </p>
            </div>
            <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl">
              <DollarSign className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-5 border border-gray-200/50 dark:border-gray-700/50 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white mt-2">
                {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="p-2.5 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
              <Calendar className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Information */}
        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-200">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-gradient-to-br from-[rgb(54,3,222)]/10 to-[rgb(248,34,104)]/10 rounded-xl">
              <Package className="w-5 h-5 text-[rgb(54,3,222)]" />
            </div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Order Information</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Order ID</span>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{order.id}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Customer</span>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{order.customer}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Package className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</span>
              </div>
              <StatusBadge status={order.status} />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                </div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Created Date</span>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {new Date(order.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Price</span>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">${order.total_price}</span>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-200">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 rounded-xl">
              <CreditCard className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Payment Information</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Payment Status</span>
              </div>
              <StatusBadge status={order.payment_status || order.paymentStatus || order.payment?.status || 'N/A'} />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Transaction ID</span>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white font-mono">{order.transaction_id || order.transactionId || order.payment?.transaction_id || order.payment?.transactionId || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-200">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-xl">
            <ShoppingBag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Order Items</h2>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">{order.items?.length || 0} items</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/30">
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Product
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Seller
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Price
                </th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item, index) => (
                <tr key={index} className="border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="py-4 px-6 text-sm text-gray-900 dark:text-white font-medium">{item.product_name || item.product || item.name || 'N/A'}</td>
                  <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">{item.seller || 'N/A'}</td>
                  <td className="py-4 px-6 text-sm text-gray-900 dark:text-white font-semibold">${item.price || '0.00'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
