const ErrorState = ({ onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-24 h-24 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
        <svg className="w-12 h-12 text-red-400 dark:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="text-h3 font-medium text-gray-900 dark:text-white mb-2">Unable to load products</h3>
      <p className="text-base text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
        Something went wrong while fetching the products. Please try again.
      </p>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-colors duration-200"
      >
        Try Again
      </button>
    </div>
  )
}

export default ErrorState
