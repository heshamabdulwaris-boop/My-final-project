import { useState } from 'react'
import { useAdminUsers, useActivateUser, useSuspendUser } from '@hooks/admin/useAdminUsers'
import { DataTable } from '@components/admin/DataTable'
import { SearchInput } from '@components/admin/SearchInput'
import { Pagination } from '@components/admin/Pagination'
import { StatusBadge } from '@components/admin/StatusBadge'
import { ConfirmModal } from '@components/admin/ConfirmModal'
import { useAuth } from '@contexts/AuthContext'
import { ROLES } from '@constants/roles'
import { useToast } from '@contexts/ToastContext'
import { Users, Shield, ShieldAlert, UserCog } from 'lucide-react'
import authService from '@services/auth/authService'

export function UsersManagement() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: null, userId: null })
  const [changeRoleModal, setChangeRoleModal] = useState({ isOpen: false, userId: null, currentRole: null })
  const { isSuperAdmin } = useAuth()
  const { success, error: showError } = useToast()

  const { data, isLoading, error } = useAdminUsers({ search, page })
  const activateUser = useActivateUser()
  const suspendUser = useSuspendUser()

  const handleActivate = (userId) => {
    setConfirmModal({
      isOpen: true,
      action: 'activate',
      productId: null,
      userId,
    })
  }

  const handleSuspend = (userId) => {
    setConfirmModal({
      isOpen: true,
      action: 'suspend',
      productId: null,
      userId,
    })
  }

  const handleChangeRole = (userId, currentRole) => {
    setChangeRoleModal({
      isOpen: true,
      userId,
      currentRole,
    })
  }

  const handleConfirm = async () => {
    try {
      if (confirmModal.action === 'activate') {
        await activateUser.mutateAsync(confirmModal.userId)
        success('User activated successfully')
      } else if (confirmModal.action === 'suspend') {
        await suspendUser.mutateAsync(confirmModal.userId)
        success('User suspended successfully')
      }
      setConfirmModal({ isOpen: false, action: null, userId: null })
    } catch (err) {
      showError(err.response?.data?.detail || 'Action failed')
    }
  }

  const handleRoleChange = async (newRole) => {
    try {
      await authService.changeRole(changeRoleModal.userId, newRole)
      success('User role changed successfully')
      setChangeRoleModal({ isOpen: false, userId: null, currentRole: null })
      // Refresh the data
      window.location.reload()
    } catch (err) {
      showError(err.response?.data?.detail || 'Failed to change role')
    }
  }

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'username', label: 'Username' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role', render: (value) => <StatusBadge status={value} /> },
    { key: 'is_active', label: 'Status', render: (value) => <StatusBadge status={value ? 'active' : 'inactive'} /> },
    {
      key: 'change_role',
      label: 'Change Role',
      render: (_, row) => (
        <div className="flex justify-center">
          <button
            onClick={() => isSuperAdmin && handleChangeRole(row.id, row.role)}
            disabled={!isSuperAdmin}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isSuperAdmin
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 cursor-pointer'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
            }`}
            title="Change Role"
          >
            <UserCog className="w-4 h-4" />
          </button>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          {row.is_active ? (
            <button
              onClick={() => isSuperAdmin && handleSuspend(row.id)}
              disabled={!isSuperAdmin}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-all duration-200 ${
                isSuperAdmin
                  ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 cursor-pointer'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Suspend
            </button>
          ) : (
            <button
              onClick={() => isSuperAdmin && handleActivate(row.id)}
              disabled={!isSuperAdmin}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-all duration-200 ${
                isSuperAdmin
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 cursor-pointer'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              Activate
            </button>
          )}
        </div>
      ),
    },
  ]

  const handlePageChange = (newPage) => {
    console.log('Page change requested:', newPage)
    setPage(newPage)
  }

  const users = data?.results || []
  const totalCount = data?.count || 0
  const totalPages = totalCount > 0 ? Math.ceil(totalCount / 10) : 1

  console.log('Pagination debug:', { totalPages, totalCount, currentPage: page, usersCount: users.length })
  console.log('Full data object:', JSON.stringify(data, null, 2))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">Users</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage platform users and their access</p>
        </div>
        {!isSuperAdmin && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="text-xs font-medium text-amber-700 dark:text-amber-300">Super Admin Only</span>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-4 border border-gray-200/50 dark:border-gray-700/50">
        <div className="flex-1">
          <SearchInput value={search} onChange={setSearch} placeholder="Search users by username or email..." />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">All Users</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage and monitor all platform users</p>
        </div>
        <DataTable columns={columns} data={users} isLoading={isLoading} error={error} />
      </div>

      {/* Pagination */}
      <div className="flex justify-end">
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, action: null, userId: null })}
        onConfirm={handleConfirm}
        title={`${confirmModal.action === 'activate' ? 'Activate' : 'Suspend'} User`}
        message={`Are you sure you want to ${confirmModal.action} this user?`}
        confirmText={confirmModal.action === 'activate' ? 'Activate' : 'Suspend'}
      />

      {/* Change Role Modal */}
      {changeRoleModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <UserCog className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Change User Role</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Select the new role for this user:
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Current role: <span className="font-semibold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg">{changeRoleModal.currentRole}</span>
            </p>
            <div className="space-y-3">
              <button
                onClick={() => handleRoleChange('buyer')}
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-left flex items-center gap-3"
              >
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400 text-sm font-bold">B</span>
                </div>
                <div>
                  <div className="font-medium">Buyer</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Can purchase products</div>
                </div>
              </button>
              <button
                onClick={() => handleRoleChange('seller')}
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-left flex items-center gap-3"
              >
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 dark:text-purple-400 text-sm font-bold">S</span>
                </div>
                <div>
                  <div className="font-medium">Seller</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Can sell products</div>
                </div>
              </button>
              <button
                onClick={() => handleRoleChange('admin')}
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-left flex items-center gap-3"
              >
                <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-red-600 dark:text-red-400 text-sm font-bold">A</span>
                </div>
                <div>
                  <div className="font-medium">Admin</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Can manage platform</div>
                </div>
              </button>
            </div>
            <button
              onClick={() => setChangeRoleModal({ isOpen: false, userId: null, currentRole: null })}
              className="w-full mt-6 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
