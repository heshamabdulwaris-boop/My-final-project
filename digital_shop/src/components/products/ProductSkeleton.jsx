const ProductSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3 animate-pulse"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-3/4 animate-pulse"></div>
          
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}

export default ProductSkeleton
