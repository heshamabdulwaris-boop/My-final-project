export function AuthHeader({ title, subtitle }) {
  return (
    <div className="text-center mb-8">
      <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-indigo-600 to-purple-600 dark:from-white dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">{title}</h1>
      <p className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
    </div>
  )
}
