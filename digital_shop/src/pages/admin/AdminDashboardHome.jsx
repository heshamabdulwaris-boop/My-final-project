import { useAdminDashboard } from '@hooks/admin/useAdminDashboard'
import { StatsCard } from '@components/admin/StatsCard'
import { StatsCardSkeleton } from '@components/admin/LoadingSkeleton'
import { Users, Package, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

export function AdminDashboardHome() {
  const { data, isLoading, error } = useAdminDashboard()

  // Prepare chart data
  const productStatusData = data?.products ? [
    { name: 'Approved', value: data.products.approved || 0 },
    { name: 'Pending', value: data.products.pending || 0 },
    { name: 'Rejected', value: data.products.rejected || 0 },
  ] : []

  const userDistributionData = data?.users ? [
    { name: 'Buyers', value: data.users.buyers || 0 },
    { name: 'Sellers', value: data.users.sellers || 0 },
  ] : []

  const orderData = data?.orders ? [
    { name: 'Total Orders', value: data.orders.total || 0 },
    { name: 'Paid Orders', value: data.orders.paid || 0 },
  ] : []

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="h-80 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl animate-pulse" />
          <div className="h-80 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl animate-pulse" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <TrendingUp className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-gray-900 dark:text-white text-lg font-medium">Unable to load dashboard</p>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{error.message}</p>
        </div>
      </div>
    )
  }

  const stats = data || {}

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Platform overview and analytics</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Live</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-5 border border-gray-200/50 dark:border-gray-700/50 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Platform Revenue</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">
                ${(stats.platform_revenue || 0).toFixed(2)}
              </p>
            </div>
            <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl">
              <DollarSign className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-500" />
            <span className="text-xs text-emerald-500 font-medium">+12.5%</span>
            <span className="text-xs text-gray-400 ml-1">vs last month</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-5 border border-gray-200/50 dark:border-gray-700/50 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Products</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">
                {stats.products?.total || 0}
              </p>
            </div>
            <div className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
              <Package className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-blue-500" />
            <span className="text-xs text-blue-500 font-medium">+8.2%</span>
            <span className="text-xs text-gray-400 ml-1">vs last month</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-5 border border-gray-200/50 dark:border-gray-700/50 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Orders</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">
                {stats.orders?.total || 0}
              </p>
            </div>
            <div className="p-2.5 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
              <ShoppingCart className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-purple-500" />
            <span className="text-xs text-purple-500 font-medium">+15.3%</span>
            <span className="text-xs text-gray-400 ml-1">vs last month</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-5 border border-gray-200/50 dark:border-gray-700/50 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Users</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">
                {stats.users?.total || 0}
              </p>
            </div>
            <div className="p-2.5 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
              <Users className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-orange-500" />
            <span className="text-xs text-orange-500 font-medium">+23.1%</span>
            <span className="text-xs text-gray-400 ml-1">vs last month</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Product Status</h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs text-gray-500 dark:text-gray-400">Approved</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-xs text-gray-500 dark:text-gray-400">Pending</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-xs text-gray-500 dark:text-gray-400">Rejected</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={productStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {productStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px',
                  padding: '8px 12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">User Distribution</h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-xs text-gray-500 dark:text-gray-400">Buyers</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-violet-500" />
                <span className="text-xs text-gray-500 dark:text-gray-400">Sellers</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={userDistributionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {userDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px',
                  padding: '8px 12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Orders Chart */}
      <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Orders Overview</h3>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={orderData} barSize={60}>
            <CartesianGrid strokeDasharray="0" vertical={false} className="stroke-gray-100 dark:stroke-gray-800" />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              dx={-10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px',
                padding: '8px 12px',
              }}
            />
            <Bar dataKey="value" fill="#3B82F6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">User Breakdown</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Total Users</span>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{stats.users?.total || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Buyers</span>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{stats.users?.buyers || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-violet-100 dark:bg-violet-900/30 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Sellers</span>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{stats.users?.sellers || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Product Breakdown</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Package className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Total</span>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{stats.products?.total || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                  <Package className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Approved</span>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{stats.products?.approved || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                  <Package className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Pending</span>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{stats.products?.pending || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                  <Package className="w-4 h-4 text-red-600 dark:text-red-400" />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Rejected</span>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{stats.products?.rejected || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
