import { useState } from 'react'
import { Calendar, Download, Filter, X } from 'lucide-react'

export function ReportFilters({ onFilterChange, onExport, loadingExport = false }) {
  const [dateRange, setDateRange] = useState('30d')
  const [productFilter, setProductFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const handleDateRangeChange = (value) => {
    setDateRange(value)
    onFilterChange({ dateRange: value, productFilter, categoryFilter })
  }

  const handleProductFilterChange = (value) => {
    setProductFilter(value)
    onFilterChange({ dateRange, productFilter: value, categoryFilter })
  }

  const handleCategoryFilterChange = (value) => {
    setCategoryFilter(value)
    onFilterChange({ dateRange, productFilter, categoryFilter: value })
  }

  const handleReset = () => {
    setDateRange('30d')
    setProductFilter('all')
    setCategoryFilter('all')
    onFilterChange({ dateRange: '30d', productFilter: 'all', categoryFilter: 'all' })
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Report Filters
          </h3>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <X className="h-4 w-4" />
          Reset Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Date Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Date Range
          </label>
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => handleDateRangeChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none cursor-pointer"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
              <option value="all">All time</option>
            </select>
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Product Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Products
          </label>
          <select
            value={productFilter}
            onChange={(e) => handleProductFilterChange(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none cursor-pointer"
          >
            <option value="all">All Products</option>
            <option value="top">Top Performing</option>
            <option value="recent">Recently Added</option>
            <option value="low">Low Performing</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <select
            value={categoryFilter}
            onChange={(e) => handleCategoryFilterChange(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="ebook">Ebooks</option>
            <option value="template">Templates</option>
            <option value="audio">Audio</option>
            <option value="graphics">Graphics</option>
            <option value="course">Courses</option>
          </select>
        </div>
      </div>

      {/* Export Button */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onExport}
          disabled={loadingExport}
          className={`flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 ${
            loadingExport ? 'opacity-50 cursor-not-allowed' : 'hover:from-indigo-700 hover:to-purple-700'
          }`}
        >
          {loadingExport ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Exporting...</span>
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              <span>Export Report</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
