import { useState, useRef, useEffect } from 'react'
import { useAdminProducts, useApproveProduct, useRejectProduct } from '@hooks/admin/useAdminProducts'
import { DataTable } from '@components/admin/DataTable'
import { SearchInput } from '@components/admin/SearchInput'
import { FilterSelect } from '@components/admin/FilterSelect'
import { Pagination } from '@components/admin/Pagination'
import { StatusBadge } from '@components/admin/StatusBadge'
import { useToast } from '@contexts/ToastContext'
import { MoreVertical, CheckCircle, XCircle, Package, Filter } from 'lucide-react'

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
]

export function ProductsManagement() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [rejectReason, setRejectReason] = useState('')
  const [rejectingProduct, setRejectingProduct] = useState(null)
  const [actionDropdown, setActionDropdown] = useState(null)
  const dropdownRefs = useRef({})

  const { data, isLoading, error, refetch } = useAdminProducts({ search, status, page })
  const approveMutation = useApproveProduct()
  const rejectMutation = useRejectProduct()
  const { success: showSuccess, error: showError } = useToast()

  const handleApprove = async (productId) => {
    try {
      await approveMutation.mutateAsync(productId)
      showSuccess('Product approved successfully')
      setActionDropdown(null)
    } catch (err) {
      showError(err.response?.data?.error || 'Failed to approve product')
    }
  }

  const handleReject = async (productId) => {
    if (!rejectReason.trim()) {
      showError('Please provide a rejection reason')
      return
    }

    try {
      await rejectMutation.mutateAsync({ productId, reason: rejectReason })
      showSuccess('Product rejected successfully')
      setRejectReason('')
      setRejectingProduct(null)
      setActionDropdown(null)
    } catch (err) {
      showError(err.response?.data?.error || 'Failed to reject product')
    }
  }

  const toggleDropdown = (productId) => {
    setActionDropdown(actionDropdown === productId ? null : productId)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionDropdown && dropdownRefs.current[actionDropdown]) {
        if (!dropdownRefs.current[actionDropdown].contains(event.target)) {
          setActionDropdown(null)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [actionDropdown])

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'Product Title' },
    { key: 'seller', label: 'Seller' },
    { key: 'price', label: 'Price', render: (value) => `$${value}` },
    { key: 'status', label: 'Status', render: (value) => <StatusBadge status={value} /> },
    { key: 'created_at', label: 'Created Date', render: (value) => new Date(value).toLocaleDateString() },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => {
        if (row.status === 'pending') {
          return (
            <div className="flex justify-center">
              <div className="relative" ref={(el) => dropdownRefs.current[row.id] = el}>
                <button
                  onClick={() => toggleDropdown(row.id)}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-all duration-200"
                  title="Actions"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {actionDropdown === row.id && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800/95 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 z-10 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <button
                      onClick={() => handleApprove(row.id)}
                      disabled={approveMutation.isPending}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                    >
                      <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <span className="font-medium">Approve</span>
                    </button>
                    <button
                      onClick={() => {
                        setRejectingProduct(row.id)
                        setActionDropdown(null)
                      }}
                      disabled={rejectMutation.isPending}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <div className="p-1.5 bg-red-100 dark:bg-red-900/30 rounded-lg">
                        <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                      </div>
                      <span className="font-medium">Reject</span>
                    </button>
                  </div>
                )}

                {rejectingProduct === row.id && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-4 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                        <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                      </div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Reject Product</h4>
                    </div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Rejection Reason
                    </label>
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Please provide a reason for rejection..."
                      className="w-full px-3 py-2.5 border border-gray-200/50 dark:border-gray-700/50 rounded-xl bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[rgb(54,3,222)]/20 focus:border-[rgb(54,3,222)]/50 transition-all duration-200"
                      rows="3"
                    />
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleReject(row.id)}
                        disabled={rejectMutation.isPending}
                        className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[rgb(248,34,104)] to-[rgb(220,30,90)] text-white rounded-xl hover:shadow-lg hover:shadow-[rgb(248,34,104)]/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold"
                      >
                        {rejectMutation.isPending ? 'Submitting...' : 'Reject Product'}
                      </button>
                      <button
                        onClick={() => {
                          setRejectingProduct(null)
                          setRejectReason('')
                        }}
                        className="px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 text-xs font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        }

        // For approved/rejected products, show status indicator
        return (
          <div className="flex items-center justify-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {row.status === 'approved' ? '✓ Approved' : '✗ Rejected'}
            </span>
          </div>
        )
      }
    },
  ]

  const products = data?.results || []
  const totalCount = data?.count || 0
  const totalPages = totalCount > 0 ? Math.ceil(totalCount / 10) : 1

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">Products</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage and moderate platform products</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[rgb(54,3,222)]/10 to-[rgb(248,34,104)]/10 rounded-xl border border-[rgb(54,3,222)]/20">
          <Package className="w-4 h-4 text-[rgb(54,3,222)]" />
          <span className="text-xs font-medium text-[rgb(54,3,222)]">{products.length} Products</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-4 border border-gray-200/50 dark:border-gray-700/50">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1 w-full">
            <SearchInput value={search} onChange={setSearch} placeholder="Search products by title or seller..." />
          </div>
          <div className="w-full sm:w-48">
            <FilterSelect
              value={status}
              onChange={setStatus}
              options={statusOptions}
              placeholder="All Status"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable columns={columns} data={products} isLoading={isLoading} error={error} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  )
}
