import axios from 'axios'

const adminApiInstance = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
})

// Request interceptor to add auth token
adminApiInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh
adminApiInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Skip redirect logic if request has _skipAuthRedirect flag
    if (originalRequest._skipAuthRedirect) {
      return Promise.reject(error)
    }

    // Check if current path is a public route
    const publicPaths = ['/', '/about', '/contact', '/products', '/auth']
    const currentPath = window.location.pathname
    const isPublicRoute = publicPaths.some(path => currentPath.startsWith(path))

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refresh_token')
        if (!refreshToken) {
          console.error('Admin: No refresh token found in localStorage')
          throw new Error('No refresh token available')
        }

        console.log('Admin: Attempting token refresh...')
        const response = await axios.post('http://localhost:8000/api/token/refresh/', {
          refresh: refreshToken,
        })

        const { access } = response.data
        if (!access) {
          console.error('Admin: Refresh response missing access token:', response.data)
          throw new Error('No access token in refresh response')
        }

        console.log('Admin: Token refresh successful')
        localStorage.setItem('access_token', access)

        originalRequest.headers.Authorization = `Bearer ${access}`
        return adminApiInstance(originalRequest)
      } catch (refreshError) {
        console.error('Admin: Token refresh failed:', refreshError)
        console.error('Admin: Refresh error details:', refreshError.response?.data || refreshError.message)
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user_data')
        
        // Only redirect to login if not on a public route
        if (!isPublicRoute) {
          window.location.href = '/auth/login'
        }
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export const adminService = {
  // Dashboard
  getDashboardStats: () => adminApiInstance.get('/admin-api/dashboard/'),

  // Users
  getUsers: (params) => adminApiInstance.get('/admin-api/users/', { params }),
  activateUser: (userId) => adminApiInstance.post(`/admin-api/users/${userId}/activate/`),
  suspendUser: (userId) => adminApiInstance.post(`/admin-api/users/${userId}/suspend/`),
  setSuperAdmin: (userId) => adminApiInstance.post(`/admin-api/users/${userId}/set-super-admin/`),
  removeSuperAdmin: (userId) => adminApiInstance.post(`/admin-api/users/${userId}/remove-super-admin/`),

  // Products
  getProducts: (params) => adminApiInstance.get('/admin-api/products/', { params }),
  getPendingProducts: () => adminApiInstance.get('/api/products/pending/'),
  approveProduct: (productId) => adminApiInstance.post(`/api/products/approve/${productId}/`),
  rejectProduct: (productId, reason) => adminApiInstance.post(`/api/products/reject/${productId}/`, { reason }),

  // Orders
  getOrders: (params) => adminApiInstance.get('/admin-api/orders/', { params }),
  getOrderDetail: (orderId) => adminApiInstance.get(`/admin-api/orders/${orderId}/`),

  // Reports
  getReports: () => adminApiInstance.get('/admin-api/reports/'),
  getTopProducts: () => adminApiInstance.get('/admin-api/reports/top-products/'),
  getRevenueReport: () => adminApiInstance.get('/admin-api/reports/revenue/'),
  getDownloadReport: () => adminApiInstance.get('/admin-api/reports/download/'),

  // Logs
  getLogs: (params) => adminApiInstance.get('/admin-api/logs/', { params }),

  // Contact Messages
  getContactMessages: (params) => adminApiInstance.get('/api/contact-message/', { params }),
  replyToContactMessage: (messageId, replyData) => adminApiInstance.patch(`/api/contact-message/${messageId}/reply/`, replyData),

  // Platform Revenue
  getPlatformRevenue: () => adminApiInstance.get('/api/orders/platform-revenue/'),
}

export default adminService
