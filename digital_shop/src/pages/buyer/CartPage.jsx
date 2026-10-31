import { useEffect, useState } from 'react'
import { useCart } from '@contexts/CartContext'
import { Loader2, ShoppingBag, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '@lib/axios'

export default function CartPage() {
  const { cartItems, cartTotal, loading, error, fetchCart, removeFromCart, setError } = useCart()
  const [productsMap, setProductsMap] = useState({})
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 2

  useEffect(() => {
    setError(null)
    fetchCart()
  }, [])

  // Fetch all products to create mapping for IDs and images
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products/')
        const products = response.data
        // Create map: product name -> product details
        const map = {}
        products.forEach(product => {
          map[product.title] = product
        })
        setProductsMap(map)
      } catch (err) {
        console.error('Failed to fetch products:', err)
      } finally {
        setLoadingProducts(false)
      }
    }
    fetchProducts()
  }, [])

  // Enrich cart items with product details
  const enrichedCartItems = cartItems.map(item => {
    const productDetails = productsMap[item.product] || {}
    return {
      ...item,
      productId: productDetails.id,
      image: productDetails.image,
      slug: productDetails.slug,
    }
  })

  // Pagination
  const totalPages = Math.ceil(enrichedCartItems.length / itemsPerPage)
  const paginatedItems = enrichedCartItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  if (loading || loadingProducts) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100/50 to-slate-100/80 dark:from-gray-900 dark:via-slate-900/50 dark:to-slate-900/80 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
          <p className="text-gray-600 dark:text-gray-400 text-base">Loading cart...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100/50 to-slate-100/80 dark:from-gray-900 dark:via-slate-900/50 dark:to-slate-900/80 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <Trash2 className="w-10 h-10 text-red-500 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Error Loading Cart
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-base">{error}</p>
          <button
            onClick={fetchCart}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors text-base shadow-lg"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100/50 to-slate-100/80 dark:from-gray-900 dark:via-slate-900/50 dark:to-slate-900/80 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 text-indigo-500 dark:text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Your cart is empty
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-base">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors text-base shadow-lg"
          >
            Browse Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100/50 to-slate-100/80 dark:from-gray-900 dark:via-slate-900/50 dark:to-slate-900/80 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Shopping Cart</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-base">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {paginatedItems.map((item, index) => (
              <div
                key={index}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 flex gap-4 border border-gray-200/60 dark:border-gray-700/60 shadow-lg hover:shadow-xl transition-shadow"
              >
                {/* Product Image */}
                <div className="w-20 h-20 flex-shrink-0 bg-white dark:bg-gray-700 rounded-xl overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.product}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30">
                      <ShoppingBag className="w-7 h-7 text-indigo-500 dark:text-indigo-400" />
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-base">
                    {item.product}
                  </h3>
                  <p className="text-gray-900 dark:text-white font-bold text-lg mt-1">
                    ${item.price}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    Qty: {item.quantity}
                  </p>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => {
                    if (item.productId) {
                      removeFromCart(item.productId)
                    }
                  }}
                  className="flex-shrink-0 p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                  title="Remove from cart"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-xl border transition-colors text-sm font-medium ${
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
                  className="px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/60 dark:border-gray-700/60 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-2 border-b border-gray-200/50 dark:border-gray-700/50">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Subtotal</span>
                  <span className="text-base font-bold text-gray-900 dark:text-white">
                    ${cartTotal}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200/50 dark:border-gray-700/50">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tax</span>
                  <span className="text-base font-bold text-gray-900 dark:text-white">
                    $0.00
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 bg-white/60 dark:bg-gray-800/60 rounded-xl px-4">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    Total
                  </span>
                  <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                    ${cartTotal}
                  </span>
                </div>
              </div>

              <Link
                to="/buyer/order-review"
                className="block w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-center rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl text-base"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/products"
                className="block w-full px-6 py-3 mt-3 text-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm font-medium transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
