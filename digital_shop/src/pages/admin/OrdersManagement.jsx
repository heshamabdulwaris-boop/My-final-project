import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminOrders } from '@hooks/admin/useAdminOrders'
import { DataTable } from '@components/admin/DataTable'
import { SearchInput } from '@components/admin/SearchInput'
import { FilterSelect } from '@components/admin/FilterSelect'
import { Pagination } from '@components/admin/Pagination'
import { StatusBadge } from '@components/admin/StatusBadge'

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'failed', label: 'Failed' },
  { value: 'canceled', label: 'Canceled' },
]

export function OrdersManagement() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const navigate = useNavigate()

  const { data, isLoading, error } = useAdminOrders({ search, status, page })

  const columns = [
    { key: 'id', label: 'Order ID' },
    { key: 'customer', label: 'Customer' },
    { key: 'status', label: 'Status', render: (value) => <StatusBadge status={value} /> },
    { key: 'total_price', label: 'Total Price', render: (value) => `$${value}` },
    { key: 'created_at', label: 'Created Date', render: (value) => new Date(value).toLocaleDateString() },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <button
          onClick={() => navigate(`/admin/orders/${row.id}`)}
          className="px-3 py-1 text-xs bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
        >
          View Details
        </button>
      ),
    },
  ]

  const orders = data?.results || []
  const totalCount = data?.count || 0
  const totalPages = totalCount > 0 ? Math.ceil(totalCount / 10) : 1

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Orders Management</h1>

      <div className="mb-6 flex items-center gap-4">
        <div className="flex-1">
          <SearchInput value={search} onChange={setSearch} placeholder="Search orders..." />
        </div>
        <div className="w-48">
          <FilterSelect
            value={status}
            onChange={setStatus}
            options={statusOptions}
            placeholder="Filter by status"
          />
        </div>
      </div>

      <DataTable columns={columns} data={orders} isLoading={isLoading} error={error} />

      {totalPages > 1 && (
        <div className="mt-6 flex justify-end">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  )
}
