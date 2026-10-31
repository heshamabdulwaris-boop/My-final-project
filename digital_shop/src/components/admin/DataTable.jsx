export function DataTable({ columns, data, isLoading, error, getRowClassName }) {
  if (isLoading) {
    return <TableSkeleton rows={5} columns={columns.length} />
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 text-center">
        <p className="text-red-600 dark:text-red-400 text-sm font-medium">Error loading data: {error.message}</p>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/30">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="text-left py-4 px-6 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr 
                key={rowIndex} 
                className={`border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors ${getRowClassName ? getRowClassName(row) : ''}`}
              >
                {columns.map((column) => (
                  <td key={column.key} className="py-4 px-6 text-sm text-gray-900 dark:text-white">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TableSkeleton({ rows, columns }) {
  return (
    <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
      <div className="p-6 space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-4 items-center">
            {Array.from({ length: columns }).map((_, j) => (
              <div key={j} className="h-4 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded flex-1 animate-pulse" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-12">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">No data found</p>
        <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">There are no items to display</p>
      </div>
    </div>
  )
}
