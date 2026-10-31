import { useState } from 'react'
import { useAdminLogs } from '@hooks/admin/useAdminLogs'
import { DataTable } from '@components/admin/DataTable'
import { SearchInput } from '@components/admin/SearchInput'
import { FilterSelect } from '@components/admin/FilterSelect'
import { Pagination } from '@components/admin/Pagination'
import { useAuth } from '@contexts/AuthContext'
import { ROLES } from '@constants/roles'
import { FileDown } from 'lucide-react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const actionOptions = [
  { value: 'create', label: 'Create' },
  { value: 'update', label: 'Update' },
  { value: 'delete', label: 'Delete' },
  { value: 'activate', label: 'Activate' },
  { value: 'suspend', label: 'Suspend' },
]

export function Logs() {
  const [search, setSearch] = useState('')
  const [action, setAction] = useState('')
  const [admin, setAdmin] = useState('')
  const [page, setPage] = useState(1)
  const { isSuperAdmin } = useAuth()

  const { data, isLoading, error, refetch } = useAdminLogs({ search, action, admin, page })

  const columns = [
    { key: 'admin', label: 'Admin' },
    { key: 'action', label: 'Action', render: (value) => <span className="capitalize">{value}</span> },
    { key: 'target', label: 'Target' },
    { key: 'description', label: 'Description' },
    { key: 'created_at', label: 'Created Date', render: (value) => new Date(value).toLocaleString() },
  ]

  const logs = data?.results || []
  const totalCount = data?.count || 0
  const totalPages = totalCount > 0 ? Math.ceil(totalCount / 10) : 1

  const exportLogs = () => {
    const doc = new jsPDF()
    
    // Title
    doc.setFontSize(20)
    doc.setTextColor(59, 130, 246)
    doc.text('Admin Logs Report', 14, 20)
    
    // Date
    doc.setFontSize(10)
    doc.setTextColor(107, 114, 128)
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28)
    
    // Filters info
    if (search || action || admin) {
      doc.setFontSize(9)
      doc.setTextColor(107, 114, 128)
      let filterText = 'Filters: '
      if (search) filterText += `Search: "${search}" `
      if (action) filterText += `Action: "${action}" `
      if (admin) filterText += `Admin: "${admin}" `
      doc.text(filterText, 14, 34)
    }
    
    // Table Data
    const tableData = logs.map(log => [
      log.admin || 'N/A',
      log.action || 'N/A',
      log.target || 'N/A',
      log.description || 'N/A',
      log.created_at ? new Date(log.created_at).toLocaleString() : 'N/A',
    ])
    
    autoTable(doc, {
      startY: search || action || admin ? 40 : 35,
      head: [['Admin', 'Action', 'Target', 'Description', 'Created Date']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: 'bold',
      },
      styles: {
        fontSize: 8,
        cellPadding: 4,
      },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 20 },
        2: { cellWidth: 25 },
        3: { cellWidth: 60 },
        4: { cellWidth: 35 },
      },
    })
    
    doc.save('admin-logs-report.pdf')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Logs Management</h1>
        <button
          onClick={exportLogs}
          disabled={isLoading || logs.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          <FileDown className="w-4 h-4" />
          Export PDF
        </button>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <div className="flex-1">
          <SearchInput value={search} onChange={setSearch} placeholder="Search logs..." />
        </div>
        <div className="w-48">
          <FilterSelect
            value={action}
            onChange={setAction}
            options={actionOptions}
            placeholder="Filter by action"
          />
        </div>
        {isSuperAdmin && (
          <div className="w-48">
            <SearchInput
              value={admin}
              onChange={setAdmin}
              placeholder="Filter by admin..."
            />
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-sm">Error loading logs: {error.message}</p>
          <button
            onClick={() => refetch()}
            className="mt-2 text-sm text-red-600 dark:text-red-400 underline hover:text-red-700 dark:hover:text-red-300"
          >
            Retry
          </button>
        </div>
      )}

      <DataTable columns={columns} data={logs} isLoading={isLoading} error={error} />

      {totalPages > 1 && (
        <div className="mt-6 flex justify-end">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  )
}
