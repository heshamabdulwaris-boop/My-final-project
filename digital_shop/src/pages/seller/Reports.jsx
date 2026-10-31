import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileText, BarChart3, TrendingUp, Package } from 'lucide-react'
import { ReportFilters } from '@components/seller/ReportFilters'
import { SalesReport } from '@components/seller/SalesReport'
import { RevenueReport } from '@components/seller/RevenueReport'
import { ProductPerformanceReport } from '@components/seller/ProductPerformanceReport'
import { exportToCSV, exportToJSON, exportToPDF } from '@utils/exportReport'
import sellerService from '@services/seller/sellerService'

const reportTypes = [
  { id: 'sales', name: 'Sales Report', icon: BarChart3, color: 'from-emerald-500 to-emerald-600' },
  { id: 'revenue', name: 'Revenue Report', icon: TrendingUp, color: 'from-indigo-500 to-indigo-600' },
  { id: 'products', name: 'Product Performance', icon: Package, color: 'from-purple-500 to-purple-600' },
]

export default function Reports() {
  const [activeReport, setActiveReport] = useState('sales')
  const [filters, setFilters] = useState({
    dateRange: '30d',
    productFilter: 'all',
    categoryFilter: 'all',
  })
  const [reportData, setReportData] = useState(null)
  const [loadingExport, setLoadingExport] = useState(false)

  useEffect(() => {
    fetchReportData()
  }, [activeReport, filters])

  const fetchReportData = async () => {
    try {
      const [dashboardResponse, productsResponse] = await Promise.all([
        sellerService.getDashboardStats(),
        sellerService.getMyProducts()
      ])
      
      setReportData({
        dashboard: dashboardResponse.data,
        products: productsResponse.data || []
      })
    } catch (err) {
      console.error('Error fetching report data:', err)
    }
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  const handleExport = async () => {
    if (!reportData) return
    
    setLoadingExport(true)
    try {
      const exportData = generateRealData(activeReport, reportData)
      const filename = `${activeReport}-report-${new Date().toISOString().split('T')[0]}`
      const title = `${activeReport.charAt(0).toUpperCase() + activeReport.slice(1)} Report`
      exportToPDF(exportData, filename, title)
    } catch (err) {
      console.error('Error exporting report:', err)
    } finally {
      setLoadingExport(false)
    }
  }

  const generateRealData = (type, data) => {
    const dashboard = data.dashboard || {}
    const products = data.products || []
    
    switch (type) {
      case 'sales':
        return [
          { metric: 'Total Sales', value: dashboard.total_sales || 0 },
          { metric: 'Total Revenue', value: dashboard.revenue || 0 },
        ]
      case 'revenue':
        return [
          { metric: 'Total Revenue', value: dashboard.revenue || 0 },
        ]
      case 'products':
        return products.slice(0, 10).map(product => ({
          product: product.title || 'Product',
          price: product.price || 0,
        }))
      default:
        return []
    }
  }

  const ActiveReportComponent = () => {
    switch (activeReport) {
      case 'sales':
        return <SalesReport filters={filters} />
      case 'revenue':
        return <RevenueReport filters={filters} />
      case 'products':
        return <ProductPerformanceReport filters={filters} />
      default:
        return null
    }
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          Reports
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Comprehensive analytics and performance reports
        </p>
      </div>

      {/* Report Type Selector */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-3">
          {reportTypes.map((report) => {
            const Icon = report.icon
            return (
              <motion.button
                key={report.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveReport(report.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
                  activeReport === report.id
                    ? `bg-gradient-to-r ${report.color} text-white shadow-lg`
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{report.name}</span>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <ReportFilters 
          onFilterChange={handleFilterChange} 
          onExport={handleExport}
          loadingExport={loadingExport}
        />
      </div>

      {/* Active Report */}
      <motion.div
        key={activeReport}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ActiveReportComponent />
      </motion.div>
    </div>
  )
}
