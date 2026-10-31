import { useEffect, useState, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useToast } from '@contexts/ToastContext'
import { useCapturePaypalOrder } from '@hooks/useOrderQueries'
import { 
  CheckCircle, 
  XCircle, 
  ShoppingBag, 
  Receipt, 
  Loader2,
  Home
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function PaymentSuccessPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { success: showSuccess, error: showError } = useToast()
  
  const [countdown, setCountdown] = useState(5)
  const isNavigating = useRef(false)
  const hasCapturedRef = useRef(false)
  const countdownTimerRef = useRef(null)

  // Get orderId from URL params
  const orderId = searchParams.get('orderId')

  // React Query hook for capturing PayPal payment
  const captureMutation = useCapturePaypalOrder()

  // Handle auto-redirect when countdown reaches 0
  useEffect(() => {
    if (countdown === 0 && !isNavigating.current) {
      isNavigating.current = true
      navigate('/buyer/my-purchased')
    }
  }, [countdown, navigate])

  useEffect(() => {
    // Prevent duplicate captures using ref (synchronous, unaffected by StrictMode)
    if (hasCapturedRef.current) {
      console.log('PaymentSuccessPage - Already captured, skipping')
      return
    }

    // Try to get orderId from URL params first, then from localStorage
    const urlOrderId = orderId || localStorage.getItem('pendingOrderId')
    
    console.log('PaymentSuccessPage - urlOrderId:', urlOrderId)
    console.log('PaymentSuccessPage - hasCaptured:', hasCapturedRef.current)
    
    if (!urlOrderId) {
      console.error('PaymentSuccessPage - No orderId found')
      showError('Order ID not found. Please check your order history.')
      if (!isNavigating.current) {
        isNavigating.current = true
        // Use setTimeout to avoid navigation during render
        setTimeout(() => navigate('/buyer/order-history'), 3000)
      }
      return
    }

    // Mark as captured immediately to prevent duplicates
    hasCapturedRef.current = true

    const capturePayment = async (orderId) => {
      try {
        console.log('capturePayment - Calling capture API with orderId:', orderId)
        
        const response = await captureMutation.mutateAsync(orderId)
        console.log('capturePayment - Capture response:', response)
        
        // Clear the stored orderId from localStorage
        localStorage.removeItem('pendingOrderId')
        
        if (response.status === 'COMPLETED') {
          showSuccess('Payment successful!')
          
          // Start countdown after successful capture
          countdownTimerRef.current = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(countdownTimerRef.current)
                return 0
              }
              return prev - 1
            })
          }, 1000)
        } else {
          showError('Payment verification failed')
        }
      } catch (err) {
        console.error('capturePayment - Error:', err)
        showError(err.response?.data?.detail || 'Payment capture failed')
      }
    }

    capturePayment(urlOrderId)

    // Cleanup function
    return () => {
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current)
      }
    }
  }, []) // Empty dependency array - runs once on mount

  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Loading state
  if (captureMutation.isPending) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center border border-gray-200 dark:border-gray-700">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-gray-600 dark:text-gray-400 animate-spin" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Confirming Payment...
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Please wait while we verify your payment with PayPal.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (captureMutation.error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center border border-gray-200 dark:border-gray-700">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <XCircle className="w-8 h-8 text-gray-600 dark:text-gray-400" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Payment Verification Failed
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              We couldn't verify your payment. Please check your order history or contact support.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/buyer/order-history')}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors text-sm"
              >
                View Order History
              </button>
              <button
                onClick={() => navigate('/products')}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Success state
  const captureData = captureMutation.data
  const transactionId = captureData?.purchase_units?.[0]?.payments?.captures?.[0]?.id
  const amount = captureData?.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center border border-gray-200 dark:border-gray-700">
          {/* Success Icon */}
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>

          {/* Success Message */}
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Payment Successful!
          </h1>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Your payment has been processed successfully. Thank you for your purchase!
          </p>

          {/* Transaction Details */}
          <div className="bg-white dark:bg-gray-700 rounded-md p-4 mb-6 border border-gray-200 dark:border-gray-600">
            <div className="space-y-3">
              {transactionId && (
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-gray-500" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Transaction ID</span>
                  </div>
                  <span className="font-mono text-xs font-medium text-gray-900 dark:text-white">
                    {transactionId}
                  </span>
                </div>
              )}
              
              {amount && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600 dark:text-gray-400">Amount Paid</span>
                  <span className="text-base font-bold text-gray-900 dark:text-white">
                    ${amount}
                  </span>
                </div>
              )}

              {orderId && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600 dark:text-gray-400">Order ID</span>
                  <span className="font-medium text-xs text-gray-900 dark:text-white">
                    #{orderId}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-600">
                <span className="text-xs text-gray-600 dark:text-gray-400">Payment Date</span>
                <span className="font-medium text-xs text-gray-900 dark:text-white">
                  {formatDate()}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={() => navigate('/buyer/my-purchased')}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              View My Purchases
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => navigate('/buyer/order-history')}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 text-xs"
              >
                <Receipt className="w-3 h-3" />
                Order History
              </button>

              <button
                onClick={() => navigate('/products')}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 text-xs"
              >
                <Home className="w-3 h-3" />
                Continue Shopping
              </button>
            </div>
          </div>

          {/* Auto-redirect Notice */}
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            Redirecting to My Purchases in {countdown} seconds...
          </p>
        </div>
      </div>
    </div>
  )
}
