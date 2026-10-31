import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { StatsCards } from '@components/seller/StatsCards'
import { DashboardChart } from '@components/seller/DashboardChart'
import { ProductPieChart } from '@components/seller/ProductPieChart'
import { Package, TrendingUp, DollarSign } from 'lucide-react'
import { useSellerDashboard } from '@hooks/useOrderQueries'
import sellImage from '@assets/images/sell.jpg'

export default function SellerDashboard() {
  const { data: stats, isLoading, error, refetch } = useSellerDashboard()
  const navigate = useNavigate()

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with background image */}
        <div className="relative mb-6 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${sellImage})` }}></div>
          <div className="absolute inset-0 bg-black/40 dark:bg-black/60"></div>
          <div className="relative p-6 md:p-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Dashboard</h1>
              <p className="text-white/80 text-xs md:text-sm">
                Your marketplace performance overview
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 mb-4">
          <button 
            onClick={() => navigate('/seller/upload')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Add Product</span>
          </button>
          <button 
            onClick={() => navigate('/seller/dashboard/sales')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors text-sm font-medium"
          >
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Sales</span>
          </button>
          <button 
            onClick={() => navigate('/seller/dashboard/revenue')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors text-sm font-medium"
          >
            <DollarSign className="h-4 w-4" />
            <span className="hidden sm:inline">Revenue</span>
          </button>
        </div>

        {error && (
          <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center justify-between">
            <p className="text-red-600 dark:text-red-400 text-sm">{error?.response?.data?.detail || error?.message || 'Failed to load dashboard stats'}</p>
            <button
              onClick={() => refetch()}
              className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Statistics Cards */}
        <StatsCards stats={stats} loading={isLoading} />

        {/* Main Content Grid */}
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Primary Content - Chart */}
          <div className="lg:col-span-2">
            <DashboardChart stats={stats} loading={isLoading} />
          </div>

          {/* Secondary Content - Pie Chart */}
          <div className="lg:col-span-1">
            <ProductPieChart />
          </div>
        </div>
      </div>
    </div>
  )
}
