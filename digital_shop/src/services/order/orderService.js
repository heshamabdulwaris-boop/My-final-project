import axiosInstance from '@services/api/axiosConfig'

const orderService = {
  // Create Order from Cart
  createOrder: async () => {
    const response = await axiosInstance.post('/orders/create/')
    return response.data
  },

  // Create PayPal Order
  createPaypalOrder: async (orderId) => {
    const response = await axiosInstance.post(`/orders/paypal/create/${orderId}/`)
    return response.data
  },

  // Capture PayPal Order
  capturePaypalOrder: async (orderId) => {
    const response = await axiosInstance.post(`/orders/paypal/capture/${orderId}/`)
    return response.data
  },

  // Order History
  getOrderHistory: async () => {
    const response = await axiosInstance.get('/orders/orderhistory/')
    return response.data
  },

  // My Purchased Products
  getMyPurchased: async () => {
    const response = await axiosInstance.get('/products/my-purchased/')
    return response.data
  },

  // Download Product
  downloadProduct: async (productId) => {
    const response = await axiosInstance.get(`/products/download/${productId}/`, {
      responseType: 'blob'
    })
    return response
  },

  // My Downloads History
  getMyDownloads: async () => {
    const response = await axiosInstance.get('/products/my-downloads/')
    return response.data
  },
}

export default orderService
