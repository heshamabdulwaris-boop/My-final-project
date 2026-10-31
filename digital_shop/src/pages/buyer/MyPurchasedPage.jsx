import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@contexts/ToastContext'
import { useMyPurchased } from '@hooks/useOrderQueries'
import orderService from '@services/order/orderService'
import { 
  Loader2, 
  ShoppingBag, 
  Download, 
  CheckCircle,
  ArrowLeft
} from 'lucide-react'

export default function MyPurchasedPage() {
  const navigate = useNavigate()
  const { success: showSuccess, error: showError } = useToast()
  
  // React Query hook for purchased products
  const { data: purchasedData, isLoading, error, refetch } = useMyPurchased()
  
  const [downloading, setDownloading] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // Extract purchased products and details from React Query data
  const purchasedProducts = purchasedData?.purchased || []
  const productDetails = purchasedData?.detailsMap || {}

  const handleDownload = async (productId, productName) => {
    try {
      setDownloading(prev => ({ ...prev, [productId]: true }))
      
      const response = await orderService.downloadProduct(productId)
      
      // Get content type from response headers
      const contentType = response.headers['content-type'] || 'application/octet-stream'
      
      // Get filename from Content-Disposition header if available
      const contentDisposition = response.headers['content-disposition']
      let filename = productName || 'product'
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '')
        }
      }
      
      // Ensure filename has extension
      if (!filename.includes('.')) {
        // Try to determine extension from content type
        const extensionMap = {
          'application/pdf': '.pdf',
          'application/zip': '.zip',
          'application/x-zip-compressed': '.zip',
          'image/jpeg': '.jpg',
          'image/png': '.png',
          'image/gif': '.gif',
          'video/mp4': '.mp4',
          'video/quicktime': '.mov',
          'audio/mpeg': '.mp3',
          'audio/wav': '.wav',
          'text/plain': '.txt',
          'application/msword': '.doc',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
        }
        
        const ext = extensionMap[contentType] || '.bin'
        filename += ext
      }
      
      // Create blob with correct content type
      const blob = new Blob([response.data], { type: contentType })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      showSuccess('Download started successfully')
    } catch (err) {
      console.error('Download error:', err)
      showError(err.response?.data?.detail || 'Failed to download product')
    } finally {
      setDownloading(prev => ({ ...prev, [productId]: false }))
    }
  }

  // Handle image URL - prepend base URL if it's a relative path
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null
    if (imageUrl.startsWith('http')) return imageUrl
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
    const baseUrl = API_BASE_URL.replace('/api', '')
    return `${baseUrl}${imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl}`
  }

  // Get cover image from product with multiple possible field names
  const getCoverImage = (product) => {
    // First check if we have product details from the product API
    const details = productDetails[product.id]
    if (details) {
      const imageUrl = details.cover_image || 
                       details.image || 
                       details.thumbnail || 
                       details.coverImage
      if (imageUrl) return getImageUrl(imageUrl)
    }

    // Fallback to checking the purchased product data
    const imageUrl = product.cover_image || 
                     product.image || 
                     product.thumbnail || 
                     product.coverImage ||
                     product.product?.cover_image ||
                     product.product?.image ||
                     product.product?.thumbnail
    
    return getImageUrl(imageUrl)
  }

  // Calculate pagination
  const totalPages = Math.ceil(purchasedProducts.length / itemsPerPage)
  const paginatedProducts = purchasedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-96 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Error Loading Purchases
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error?.response?.data?.detail || error?.message || 'Failed to load purchased products'}</p>
          <button
            onClick={() => refetch()}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-3 transition-colors text-sm"
          >
            <ArrowLeft className="w-3 h-3" />
            Back
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            My Purchases
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {purchasedProducts.length} {purchasedProducts.length === 1 ? 'product' : 'products'} purchased
          </p>
        </div>

        {/* Products Grid */}
        {purchasedProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {paginatedProducts.map((product) => {
                const coverImageUrl = getCoverImage(product)
                return (
                  <div
                    key={product.id}
                    className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-gray-200/50 dark:border-gray-700/50"
                  >
                    {/* Product Cover */}
                    {coverImageUrl ? (
                      <div className="aspect-video relative overflow-hidden">
                        <img
                          src={coverImageUrl}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full text-xs font-medium">
                            <CheckCircle className="w-2.5 h-2.5" />
                            Purchased
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-video bg-gray-100 dark:bg-gray-700/50 relative overflow-hidden">
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                        </div>
                        <div className="absolute top-2 right-2">
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full text-xs font-medium">
                            <CheckCircle className="w-2.5 h-2.5" />
                            Purchased
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Product Info */}
                    <div className="p-3">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2 line-clamp-2">
                        {product.title}
                      </h3>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                          ${product.price}
                        </span>
                        
                        <button
                          onClick={() => handleDownload(product.id, product.title)}
                          disabled={downloading[product.id]}
                          className="inline-flex items-center gap-1 px-2 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium"
                        >
                          {downloading[product.id] ? (
                            <>
                              <Loader2 className="w-3 h-3 animate-spin" />
                            </>
                          ) : (
                            <>
                              <Download className="w-3 h-3" />
                              Download
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        currentPage === page
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              No Purchases Yet
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto">
              You haven't purchased any products yet. Start exploring our marketplace to find amazing digital products.
            </p>
            <button
              onClick={() => navigate('/products')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              Browse Products
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
