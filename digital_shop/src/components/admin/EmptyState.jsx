import { Inbox } from 'lucide-react'

export function EmptyState({ message = 'No data found' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
        <Inbox className="w-8 h-8 text-gray-400" />
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-sm">{message}</p>
    </div>
  )
}
