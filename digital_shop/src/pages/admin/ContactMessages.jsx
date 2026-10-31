import { useState, useEffect } from 'react'
import adminService from '@services/admin/adminService'
import { DataTable } from '@components/admin/DataTable'
import { SearchInput } from '@components/admin/SearchInput'
import { Pagination } from '@components/admin/Pagination'
import { StatusBadge } from '@components/admin/StatusBadge'
import { ConfirmModal } from '@components/admin/ConfirmModal'
import { useAuth } from '@contexts/AuthContext'
import { useToast } from '@contexts/ToastContext'
import { MessageCircle, Mail, Clock, CheckCircle, Send, X } from 'lucide-react'
import { formatDate } from '@utils/formatDate'

export function ContactMessages() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [replyModal, setReplyModal] = useState({ isOpen: false, message: null })
  const [replyText, setReplyText] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [sendingReply, setSendingReply] = useState(false)
  const [error, setError] = useState(null)
  const { isSuperAdmin } = useAuth()
  const { success, error: showError } = useToast()

  const fetchMessages = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await adminService.getContactMessages({ search, page })
      setMessages(response.data || [])
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch messages')
      showError('Failed to load contact messages')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [page, search])

  const handleReply = (message) => {
    setReplyModal({ isOpen: true, message })
    setReplyText(message.reply || '')
  }

  const handleSendReply = async () => {
    setSendingReply(true)
    try {
      await adminService.replyToContactMessage(replyModal.message.id, { reply: replyText })
      success('Reply sent successfully')
      setReplyModal({ isOpen: false, message: null })
      setReplyText('')
      fetchMessages()
    } catch (err) {
      showError(err.response?.data?.detail || 'Failed to send reply')
    } finally {
      setSendingReply(false)
    }
  }

  const columns = [
    { key: 'id', label: 'ID' },
    { 
      key: 'full_name', 
      label: 'Name',
      render: (value) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <span className="font-medium text-gray-900 dark:text-white">{value}</span>
        </div>
      )
    },
    { 
      key: 'email', 
      label: 'Email',
      render: (value) => (
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600 dark:text-gray-300">{value}</span>
        </div>
      )
    },
    { 
      key: 'message', 
      label: 'Message',
      render: (value) => (
        <div className="max-w-xs truncate text-gray-600 dark:text-gray-300" title={value}>
          {value}
        </div>
      )
    },
    { 
      key: 'is_read', 
      label: 'Status', 
      render: (value) => (
        <StatusBadge status={value ? 'replied' : 'pending'} />
      )
    },
    { 
      key: 'created_at', 
      label: 'Received',
      render: (value) => (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600 dark:text-gray-300">{formatDate(value)}</span>
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <button
            onClick={() => isSuperAdmin && handleReply(row)}
            disabled={!isSuperAdmin}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-all duration-200 ${
              isSuperAdmin
                ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 cursor-pointer'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
            }`}
            title="Reply"
          >
            <Send className="w-3.5 h-3.5" />
            {row.reply ? 'Edit Reply' : 'Reply'}
          </button>
        </div>
      ),
    },
  ]

  const handlePageChange = (newPage) => {
    setPage(newPage)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">Contact Messages</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage and respond to user inquiries</p>
        </div>
        {!isSuperAdmin && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <MessageCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="text-xs font-medium text-amber-700 dark:text-amber-300">Super Admin Only</span>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-4 border border-gray-200/50 dark:border-gray-700/50">
        <div className="flex-1">
          <SearchInput value={search} onChange={setSearch} placeholder="Search messages by name or email..." />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">All Messages</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">View and respond to contact form submissions</p>
        </div>
        <DataTable columns={columns} data={messages} isLoading={loading} error={error} />
      </div>

      {/* Pagination */}
      <div className="flex justify-end">
        <Pagination currentPage={page} totalPages={1} onPageChange={handlePageChange} />
      </div>

      {/* Reply Modal */}
      {replyModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                  <Send className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Reply to Message</h3>
              </div>
              <button
                onClick={() => setReplyModal({ isOpen: false, message: null })}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Original Message */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{replyModal.message?.full_name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{replyModal.message?.email}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{replyModal.message?.message}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDate(replyModal.message?.created_at)}
              </p>
            </div>

            {/* Reply Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Reply
                </label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-gray-900 dark:text-white placeholder-gray-400"
                  placeholder="Type your reply here..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSendReply}
                  disabled={!replyText.trim() || !isSuperAdmin || sendingReply}
                  className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                    replyText.trim() && isSuperAdmin && !sendingReply
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/25'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {sendingReply ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Reply
                    </>
                  )}
                </button>
                <button
                  onClick={() => setReplyModal({ isOpen: false, message: null })}
                  className="px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
