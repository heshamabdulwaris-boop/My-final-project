import axios from 'axios'
import { API_ENDPOINTS } from '@constants/endpoints'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

// Request deduplication cache
const pendingRequests = new Map()

// Token refresh queue management
let refreshPromise = null

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
})

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
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
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Handle HTTP 429 Too Many Requests - retry after delay
    if (error.response?.status === 429) {
      console.warn('Rate limited. Retrying after 5000ms...')
      await new Promise(resolve => setTimeout(resolve, 5000))
      return axiosInstance(originalRequest)
    }

    // Skip redirect logic if request has _skipAuthRedirect flag
    if (originalRequest._skipAuthRedirect) {
      return Promise.reject(error)
    }

    // Log error for debugging
    console.error(`[API Error] ${originalRequest.method?.toUpperCase()} ${originalRequest.url}`, {
      status: error.response?.status,
      message: error.message
    })

    // Check if current path is a public route
    const publicPaths = ['/', '/about', '/contact', '/products', '/auth']
    const currentPath = window.location.pathname
    const isPublicRoute = publicPaths.some(path => currentPath.startsWith(path))

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      // Use existing refresh promise if one is in progress (prevent duplicate refresh requests)
      if (refreshPromise) {
        console.log('Using existing refresh promise')
        try {
          const access = await refreshPromise
          originalRequest.headers.Authorization = `Bearer ${access}`
          return axiosInstance(originalRequest)
        } catch (refreshError) {
          // If the existing refresh failed, reject with that error
          return Promise.reject(refreshError)
        }
      }

      // Create new refresh promise
      refreshPromise = (async () => {
        try {
          const refreshToken = localStorage.getItem('refresh_token')
          if (!refreshToken) {
            console.error('No refresh token found in localStorage')
            throw new Error('No refresh token available')
          }

          console.log('Attempting token refresh...')
          const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`, {
            refresh: refreshToken,
          })

          const { access } = response.data
          if (!access) {
            console.error('Refresh response missing access token:', response.data)
            throw new Error('No access token in refresh response')
          }

          console.log('Token refresh successful')
          localStorage.setItem('access_token', access)
          return access
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError)
          console.error('Refresh error details:', refreshError.response?.data || refreshError.message)
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          localStorage.removeItem('user_data')
          
          // Only redirect to login if not on a public route
          if (!isPublicRoute) {
            window.location.href = '/auth/login'
          }
          throw refreshError
        } finally {
          // Clear the refresh promise after completion
          refreshPromise = null
        }
      })()

      try {
        const access = await refreshPromise
        originalRequest.headers.Authorization = `Bearer ${access}`
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
