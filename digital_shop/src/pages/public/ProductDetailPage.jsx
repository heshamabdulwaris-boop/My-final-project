import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Download, ShoppingCart as CartIcon, FileText, Shield, Zap } from 'lucide-react'
import { productService } from '@services/products/productService'
import { useCart } from '@contexts/CartContext'
import { useAuth } from '@contexts/AuthContext'

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart, loading: cartLoading } = useCart()
  const { isAuthenticated } = useAuth()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await productService.getProduct(id)
      setProduct(response.data)
      setError(null)
    } catch (err) {
      console.error('Error fetching product:', err)
      setError('Failed to load product details')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/auth/login')
      return
    }
    await addToCart(product.id)
  }

  // Helper function to get full image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null
    if (imageUrl.startsWith('http')) return imageUrl
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
    const baseUrl = API_BASE_URL.replace('/api', '')
    return `${baseUrl}${imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl}`
  }

  const coverImageUrl = getImageUrl(product?.cover_image)
  const extension = product?.file ? product.file.split('/').pop().split('.').pop().toUpperCase() : 'FILE'

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-xl w-40 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="aspect-square bg-slate-200 dark:bg-slate-700 rounded-3xl" />
              <div className="space-y-6">
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-xl w-3/4" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                <div className="h-40 bg-slate-200 dark:bg-slate-700 rounded-xl" />
                <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded-xl w-1/3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={() => navigate('/products')}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Products
          </button>
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-16 text-center shadow-xl">
            <FileText className="w-20 h-20 text-slate-300 dark:text-slate-600 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
              {error || 'Product not found'}
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              The product you're looking for doesn't exist or has been removed.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/products')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back to Products</span>
        </button>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Cover Image */}
          <div className="relative">
            <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
              {coverImageUrl ? (
                <img
                  src={coverImageUrl}
                  alt={product.title}
                  className="w-full aspect-square object-cover"
                />
              ) : (
                <div className="w-full aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                  <Download className="w-20 h-20 text-gray-400 dark:text-gray-500" />
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category Badge */}
            {product.category && (
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 capitalize">
                {product.category}
              </span>
            )}

            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
              {product.title}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">
                ${Number(product.price).toLocaleString()}
              </span>
              <span className="text-gray-500 dark:text-gray-400">USD</span>
            </div>

            {/* Description */}
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {product.description}
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Instant download after purchase</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Secure payment processing</span>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">File format: {extension}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={cartLoading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <CartIcon size={20} />
                {cartLoading ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>

            {/* Additional Info */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span>Listed {new Date(product.created_at).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
