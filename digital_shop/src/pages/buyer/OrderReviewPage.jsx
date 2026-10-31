import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '@contexts/CartContext'
import { useToast } from '@contexts/ToastContext'
import { useCreateOrder, useCreatePaypalOrder, useCapturePaypalOrder } from '@hooks/useOrderQueries'
import { 
  Loader2, 
  ShoppingBag, 
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react'
import paypalImage from '@assets/images/paypal.jpg'

export default function OrderReviewPage() {
  const navigate = useNavigate()
  const { cartItems, clearCart } = useCart()
  const { success: showSuccess, error: showError } = useToast()
  
  // React Query hooks
  const createOrderMutation = useCreateOrder()
  const createPaypalOrderMutation = useCreatePaypalOrder()

  const order = createOrderMutation.data
  const loading = createOrderMutation.isPending
  const error = createOrderMutation.error
  const creatingPaypalOrder = createPaypalOrderMutation.isPending
  const [paypalOpened, setPaypalOpened] = useState(false)
  const [paypalLink, setPaypalLink] = useState(null)

  // Trigger order creation on mount
  useEffect(() => {
    if (!order && !error) {
      createOrderMutation.mutate()
    }
  }, [])

  // Clear cart only after successful payment (not on navigation away)
  useEffect(() => {
    if (order && order.status === 'paid') {
      clearCart()
    }
  }, [order, clearCart])

  // Debug: Log order data when it changes
  useEffect(() => {
    if (order) {
      console.log('OrderReviewPage - Order data:', order)
      console.log('OrderReviewPage - Order items:', order.items)
      console.log('OrderReviewPage - Cart items:', cartItems)
    }
  }, [order, cartItems])

  const handlePayWithPayPal = async () => {
    if (!order) return
    
    try {
      const paypalResponse = await createPaypalOrderMutation.mutateAsync(order.id)
      console.log('PayPal response:', paypalResponse)
      
      // Store orderId for payment success page
      localStorage.setItem('pendingOrderId', order.id.toString())
      
      // Find the approve link from PayPal response
      const approveLink = paypalResponse.links?.find(link => link.rel === 'approve')
      console.log('Approve link:', approveLink)
      
      if (approveLink) {
        // Store the link and show it
        setPaypalLink(approveLink.href)
        setPaypalOpened(true)
        showSuccess('PayPal checkout link ready. Click the link below to proceed.')
      } else {
        showError('PayPal approval link not found')
      }
    } catch (err) {
      console.error('PayPal error:', err)
      showError(err.response?.data?.detail || 'Failed to create PayPal order')
    }
  }

  const handleCompletePayment = () => {
    // Navigate to payment success page to trigger capture
    navigate(`/payment-success?orderId=${order.id}`)
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', icon: Clock },
      paid: { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle },
      failed: { color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', icon: XCircle },
      canceled: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400', icon: XCircle },
    }
    
    const config = statusConfig[status] || statusConfig.pending
    const Icon = config.icon
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <Icon className="w-4 h-4" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100/50 to-slate-100/80 dark:from-gray-900 dark:via-slate-900/50 dark:to-slate-900/80 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/60 dark:border-gray-700/60 shadow-lg">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              <div className="space-y-3 mt-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    const errorMessage = error.response?.data?.error || error.response?.data?.detail || error.message || 'Failed to create order'
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100/50 to-slate-100/80 dark:from-gray-900 dark:via-slate-900/50 dark:to-slate-900/80 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <XCircle className="w-10 h-10 text-red-500 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Order Creation Failed
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-base">{errorMessage}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => createOrderMutation.mutate()}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors text-base shadow-lg"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/buyer/cart')}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-base"
            >
              Back to Cart
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100/50 to-slate-100/80 dark:from-gray-900 dark:via-slate-900/50 dark:to-slate-900/80 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 text-indigo-500 dark:text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            No Order Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-base">
            Please add items to your cart first.
          </p>
          <button
            onClick={() => navigate('/buyer/cart')}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors text-base shadow-lg"
          >
            Go to Cart
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100/50 to-slate-100/80 dark:from-gray-900 dark:via-slate-900/50 dark:to-slate-900/80 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/buyer/cart')}
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-4 transition-colors font-medium text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </button>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Order Review
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-base">
            Review your order details before payment
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Info Card */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/60 dark:border-gray-700/60 shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Order ID</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    #{order.id}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(order.status)}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 mb-1 font-medium">Order Date</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatDate(order.created_at)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 mb-1 font-medium">Total Items</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {order.items?.length || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Products List */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/60 dark:border-gray-700/60 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Order Items
              </h2>
              
              {order.items && order.items.length > 0 ? (
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-white dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-600/50 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl flex items-center justify-center">
                          <ShoppingBag className="w-7 h-7 text-indigo-500 dark:text-indigo-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white text-base">
                            {item.product_name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Digital Product
                          </p>
                        </div>
                      </div>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        ${item.price}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <ShoppingBag className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400 text-base">No items in this order</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div 
              className="relative rounded-2xl p-6 border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg"
              style={{
                backgroundImage: `url(${paypalImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md"></div>
              
              {/* Content */}
              <div className="relative z-10">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Order Summary
                </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-2 border-b border-gray-200/50 dark:border-gray-700/50">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Subtotal</span>
                  <span className="text-base font-bold text-gray-900 dark:text-white">
                    ${order.total_price}
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
                    ${order.total_price}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handlePayWithPayPal}
                  disabled={creatingPaypalOrder || paypalLink}
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl text-base"
                >
                  {creatingPaypalOrder ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : paypalLink ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>PayPal Link Generated</span>
                    </>
                  ) : (
                    <>
                      <img src="https://www.paypalobjects.com/webstatic/mktg/Logo/pp-logo-100px.png" alt="PayPal" className="w-10 h-auto" />
                      <span>Generate PayPal Link</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                {paypalLink && (
                  <a
                    href={paypalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl text-base text-center"
                  >
                    <img src="https://www.paypalobjects.com/webstatic/mktg/Logo/pp-logo-100px.png" alt="PayPal" className="w-10 h-auto" />
                    <span>Open PayPal to Pay</span>
                    <ArrowRight className="w-5 h-5" />
                  </a>
                )}

                {paypalOpened && (
                  <button
                    onClick={handleCompletePayment}
                    className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl text-base"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>I Completed Payment</span>
                  </button>
                )}

                <button
                  onClick={() => navigate('/buyer/cart')}
                  className="w-full px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 text-base"
                >
                  Back to Cart
                </button>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
