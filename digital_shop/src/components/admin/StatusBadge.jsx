export function StatusBadge({ status }) {
  const statusStyles = {
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    approved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    paid: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    canceled: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
    active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    suspended: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    replied: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  }

  const defaultStyle = 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
        statusStyles[status] || defaultStyle
      }`}
    >
      {status}
    </span>
  )
}
