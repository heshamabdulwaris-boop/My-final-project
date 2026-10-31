import { Download, ShoppingCart, Plus, ArrowUpRight, Eye, ShoppingCart as CartIcon, Heart } from 'lucide-react'
import { useCart } from '@contexts/CartContext'
import { useAuth } from '@contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const ProductCard = ({ product }) => {
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleAddToCart = async (e) => {
    e.stopPropagation()
    if (!isAuthenticated) {
      navigate('/auth/login')
      return
    }
    setIsLoading(true)
    try {
      await addToCart(product.id)
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewDetails = (e) => {
    e.stopPropagation()
    navigate(`/products/${product.id}`)
  }

  const handleCardClick = () => {
    navigate(`/products/${product.id}`)
  }

  const handleWishlistToggle = (e) => {
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
  }

  // Handle image URL - prepend base URL if it's a relative path
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null
    if (imageUrl.startsWith('http')) return imageUrl
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
    const baseUrl = API_BASE_URL.replace('/api', '')
    return `${baseUrl}${imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl}`
  }

  const coverImageUrl = getImageUrl(product.cover_image)
  const extension = product.file ? product.file.split('.').pop().toUpperCase() : 'FILE'

  return (
    <div
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden h-full flex flex-col cursor-pointer group transition-all duration-250 ease"
      style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
      onMouseEnter={(e) => { setIsHovered(true); e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.10)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
      onMouseLeave={(e) => { setIsHovered(false); e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}
      onClick={handleCardClick}
    >
      {/* Cover Image */}
      <div className="relative h-44 w-full overflow-hidden bg-gray-100 dark:bg-gray-700/50">
        {coverImageUrl ? (
          <img
            src={coverImageUrl}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-indigo-100/50 to-purple-100/50 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center">
            <Download className="w-12 h-12 text-indigo-400 dark:text-indigo-500" />
          </div>
        )}
        
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-md hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
        >
          <Heart 
            className={`w-4 h-4 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-400'}`} 
          />
        </button>

        {/* Category Badge */}
        {product.category && (
          <div className="absolute top-3 left-3">
            <span className="inline-block px-3 py-1 text-xs font-semibold bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-indigo-600 dark:text-indigo-400 shadow-sm capitalize">
              {product.category}
            </span>
          </div>
        )}

        {/* Quick View Overlay */}
        <div className={`absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={handleViewDetails}
            className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 flex items-center gap-2 shadow-lg"
          >
            <Eye size={16} />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        {/* Title */}
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 leading-tight line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {product.title}
        </h3>

        {/* Seller Name if available */}
        {product.seller_name && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            by {product.seller_name}
          </p>
        )}

        {/* Price and Extension */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              ${product.price}
            </span>
          </div>
          <span className="px-2.5 py-1 text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            {extension}
          </span>
        </div>

        {/* Action Button */}
        <div className="pt-3 border-t border-gray-100 dark:border-gray-700/50 mt-auto">
          <button
            onClick={handleAddToCart}
            disabled={isLoading}
            className="w-full px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-medium transition-all duration-250 ease disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
            onMouseEnter={(e) => { if (!e.currentTarget.disabled) { e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.10)'; e.currentTarget.style.transform = 'translateY(-4px)'; } }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <CartIcon size={14} />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
