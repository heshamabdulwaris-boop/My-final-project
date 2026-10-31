import { createContext, useContext, useState, useCallback } from 'react'
import cartService from '@services/cart/cartService'
import { useToast } from '@contexts/ToastContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [operationLoading, setOperationLoading] = useState(false)
  const [error, setError] = useState(null)
  const { success: showSuccess, error: showError } = useToast()

  const fetchCart = useCallback(async (skipLoading = false) => {
    try {
      if (!skipLoading) setLoading(true)
      setError(null)
      const response = await cartService.getCart()
      setCartItems(response.data)
    } catch (err) {
      // Don't set error for canceled requests (from request deduplication)
      if (err.name === 'CanceledError' || err.message === 'canceled') {
        return
      }
      setError(err.response?.data?.detail || 'Failed to fetch cart')
      showError('Failed to load cart items')
    } finally {
      if (!skipLoading) setLoading(false)
    }
  }, [showError])

  const addToCart = async (productId) => {
    try {
      setOperationLoading(true)
      setError(null)
      await cartService.addToCart(productId)
      await fetchCart(true)
      showSuccess('Added to cart', 1000)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add to cart')
      showError(err.response?.data?.detail || 'Failed to add to cart', 1000)
    } finally {
      setOperationLoading(false)
    }
  }

  const removeFromCart = async (productId) => {
    try {
      setOperationLoading(true)
      setError(null)
      await cartService.removeFromCart(productId)
      await fetchCart(true)
      showSuccess('Removed from cart')
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to remove from cart')
      showError(err.response?.data?.detail || 'Failed to remove from cart')
    } finally {
      setOperationLoading(false)
    }
  }

  const clearCart = () => {
    setCartItems([])
  }

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)

  const value = {
    cartItems,
    cartTotal,
    loading,
    error,
    addToCart,
    removeFromCart,
    clearCart,
    fetchCart,
    cartCount: cartItems.length,
    setError,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
