import { useTopProducts, useRevenueReport, useDownloadReport } from '@hooks/admin/useAdminReports'
import { DataTable } from '@components/admin/DataTable'
import { StatsCard } from '@components/admin/StatsCard'
import { StatsCardSkeleton } from '@components/admin/LoadingSkeleton'
import { Pagination } from '@components/admin/Pagination'
import { DollarSign, TrendingUp, Download, FileDown, BarChart3 } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useState } from 'react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export function Reports() {
  const { data: topProducts, isLoading: topProductsLoading } = useTopProducts()
  const { data: revenue, isLoading: revenueLoading } = useRevenueReport()
  const { data: downloads, isLoading: downloadsLoading } = useDownloadReport()

  // Pagination state
  const [topProductsPage, setTopProductsPage] = useState(1)
  const [downloadsPage, setDownloadsPage] = useState(1)
  const itemsPerPage = 5

  // Paginated data
  const paginatedTopProducts = topProducts?.slice((topProductsPage - 1) * itemsPerPage, topProductsPage * itemsPerPage) || []
  const paginatedDownloads = downloads?.slice((downloadsPage - 1) * itemsPerPage, downloadsPage * itemsPerPage) || []
  const topProductsTotalPages = Math.ceil((topProducts?.length || 0) / itemsPerPage)
  const downloadsTotalPages = Math.ceil((downloads?.length || 0) / itemsPerPage)

  // Prepare chart data
  const revenueChartData = [
    { name: 'Today', value: parseFloat(revenue?.today || 0) },
    { name: 'This Week', value: parseFloat(revenue?.this_week || 0) },
    { name: 'This Month', value: parseFloat(revenue?.this_month || 0) },
    { name: 'All Time', value: parseFloat(revenue?.all_time || 0) },
  ]

  const topProductsChartData = topProducts?.map(item => ({
    name: item.product?.substring(0, 15) || 'N/A',
    sales: item.sales || 0,
    revenue: parseFloat(item.revenue || 0),
  })) || []

  const downloadsChartData = downloads?.map(item => ({
    name: item.product?.substring(0, 15) || 'N/A',
    downloads: item.downloads || 0,
  })) || []

  const topProductsColumns = [
    { key: 'product', label: 'Product' },
    { key: 'seller', label: 'Seller' },
    { key: 'sales', label: 'Sales' },
    { key: 'revenue', label: 'Revenue', render: (value) => `$${value}` },
  ]

  const downloadsColumns = [
    { key: 'product', label: 'Product' },
    { key: 'seller', label: 'Seller' },
    { key: 'downloads', label: 'Downloads' },
  ]

  const exportRevenueReport = () => {
    const doc = new jsPDF()
    
    // Title
    doc.setFontSize(20)
    doc.setTextColor(59, 130, 246)
    doc.text('Revenue Report', 14, 20)
    
    // Date
    doc.setFontSize(10)
    doc.setTextColor(107, 114, 128)
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28)
    
    // Revenue Data
    const revenueData = [
      ['Period', 'Revenue'],
      ['Today', `$${revenue?.today || '0.00'}`],
      ['This Week', `$${revenue?.this_week || '0.00'}`],
      ['This Month', `$${revenue?.this_month || '0.00'}`],
      ['All Time', `$${revenue?.all_time || '0.00'}`],
    ]
    
    autoTable(doc, {
      startY: 35,
      head: [['Period', 'Revenue']],
      body: revenueData.slice(1),
      theme: 'striped',
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: 'bold',
      },
      styles: {
        fontSize: 10,
        cellPadding: 8,
      },
    })
    
    doc.save('revenue-report.pdf')
  }

  const exportTopProducts = () => {
    const doc = new jsPDF()
    
    // Title
    doc.setFontSize(20)
    doc.setTextColor(59, 130, 246)
    doc.text('Top Products Report', 14, 20)
    
    // Date
    doc.setFontSize(10)
    doc.setTextColor(107, 114, 128)
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28)
    
    // Table Data
    const tableData = topProducts?.map(item => [
      item.product || 'N/A',
      item.seller || 'N/A',
      item.sales || 0,
      `$${item.revenue || '0.00'}`,
    ]) || []
    
    autoTable(doc, {
      startY: 35,
      head: [['Product', 'Seller', 'Sales', 'Revenue']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: 'bold',
      },
      styles: {
        fontSize: 9,
        cellPadding: 6,
      },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 40 },
        2: { cellWidth: 20 },
        3: { cellWidth: 30 },
      },
    })
    
    doc.save('top-products-report.pdf')
  }

  const exportDownloadsReport = () => {
    const doc = new jsPDF()
    
    // Title
    doc.setFontSize(20)
    doc.setTextColor(59, 130, 246)
    doc.text('Downloads Report', 14, 20)
    
    // Date
    doc.setFontSize(10)
    doc.setTextColor(107, 114, 128)
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28)
    
    // Table Data
    const tableData = downloads?.map(item => [
      item.product || 'N/A',
      item.seller || 'N/A',
      item.downloads || 0,
    ]) || []
    
    autoTable(doc, {
      startY: 35,
      head: [['Product', 'Seller', 'Downloads']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: 'bold',
      },
      styles: {
        fontSize: 9,
        cellPadding: 6,
      },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 50 },
        2: { cellWidth: 30 },
      },
    })
    
    doc.save('downloads-report.pdf')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">Reports</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Platform analytics and performance metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Live</span>
        </div>
      </div>

      {/* Revenue Report */}
      <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Revenue Overview</h3>
          <button
            onClick={exportRevenueReport}
            disabled={revenueLoading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <FileDown className="w-4 h-4" />
            Export PDF
          </button>
        </div>
        {revenueLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-5 border border-gray-200/50 dark:border-gray-700/50 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-200">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Today</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">
                      ${revenue?.today || '0.00'}
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
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">This Week</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">
                      ${revenue?.this_week || '0.00'}
                    </p>
                  </div>
                  <div className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                    <DollarSign className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-5 border border-gray-200/50 dark:border-gray-700/50 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-200">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">This Month</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">
                      ${revenue?.this_month || '0.00'}
                    </p>
                  </div>
                  <div className="p-2.5 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                    <DollarSign className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-5 border border-gray-200/50 dark:border-gray-700/50 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-200">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">All Time</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">
                      ${revenue?.all_time || '0.00'}
                    </p>
                  </div>
                  <div className="p-2.5 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
                    <DollarSign className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-100 dark:stroke-gray-800" />
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
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>

      {/* Top Products */}
      <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Top Products</h3>
          <button
            onClick={exportTopProducts}
            disabled={topProductsLoading || !topProducts || topProducts.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <FileDown className="w-4 h-4" />
            Export PDF
          </button>
        </div>
        {topProducts && topProducts.length > 0 ? (
          <>
            <DataTable
              columns={topProductsColumns}
              data={paginatedTopProducts}
              isLoading={topProductsLoading}
            />
            {topProductsTotalPages > 1 && (
              <div className="flex justify-end mt-4">
                <Pagination currentPage={topProductsPage} totalPages={topProductsTotalPages} onPageChange={setTopProductsPage} />
              </div>
            )}
            <div className="h-64 mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProductsChartData} barSize={40}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-100 dark:stroke-gray-800" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#6b7280' }}
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
                  <Bar dataKey="sales" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No top products data available
          </div>
        )}
      </div>

      {/* Download Report */}
      <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Download Statistics</h3>
          <button
            onClick={exportDownloadsReport}
            disabled={downloadsLoading || !downloads || downloads.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <FileDown className="w-4 h-4" />
            Export PDF
          </button>
        </div>
        {downloads && downloads.length > 0 ? (
          <>
            <DataTable
              columns={downloadsColumns}
              data={paginatedDownloads}
              isLoading={downloadsLoading}
            />
            {downloadsTotalPages > 1 && (
              <div className="flex justify-end mt-4">
                <Pagination currentPage={downloadsPage} totalPages={downloadsTotalPages} onPageChange={setDownloadsPage} />
              </div>
            )}
            <div className="h-64 mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={downloadsChartData} barSize={40}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-100 dark:stroke-gray-800" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#6b7280' }}
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
                  <Bar dataKey="downloads" fill="#10B981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : (
          <DataTable
            columns={downloadsColumns}
            data={downloads || []}
            isLoading={downloadsLoading}
          />
        )}
      </div>
    </div>
  )
}
