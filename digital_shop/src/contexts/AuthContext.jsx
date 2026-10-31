import { createContext, useContext, useState, useEffect, useRef } from 'react'
import authService from '@services/auth/authService'
import { useToast } from '@contexts/ToastContext'
import api from '@lib/axios'

// Helper function to decode JWT token
const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Error decoding JWT:', error)
    return null
  }
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const { error: showError } = useToast()
  const isLoggingInRef = useRef(false)
  const isRefreshingRef = useRef(false)

  // Fetch real user data from the profile API and merge into state
  const fetchAndMergeProfile = async () => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      console.log('AuthContext - No token available, skipping profile fetch')
      return
    }

    try {
      console.log('AuthContext - Fetching profile data...')
      const response = await api.get('/profile/', { _skipAuthRedirect: true })
      const profileData = response.data
      console.log('AuthContext - Profile data received:', profileData)
      setUser((prev) => {
        const merged = {
          ...prev,
          username: profileData.username || prev?.username,
          email: profileData.email || prev?.email,
          role: profileData.role || prev?.role || 'buyer',
          is_super_admin: profileData.is_super_admin || false,
        }
        localStorage.setItem('user_data', JSON.stringify(merged))
        return merged
      })
    } catch (err) {
      // Only log error if it's not a 401 (which is expected for expired/invalid tokens)
      if (err.response?.status !== 401) {
        console.error('AuthContext - Failed to fetch profile:', err)
      }
      // Clear invalid tokens if profile fetch fails with 401
      if (err.response?.status === 401) {
        console.log('AuthContext - Token expired or invalid, clearing tokens')
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user_data')
        setUser(null)
      }
    }
  }

  useEffect(() => {
    // Check if user is logged in on mount
    const initializeAuth = async () => {
      const token = localStorage.getItem('access_token')
      
      if (!token) {
        // No token, user is not authenticated
        setLoading(false)
        return
      }
      
      let userData = null
      
      // Decode token to get initial user data
      const decoded = decodeJWT(token)
      if (decoded) {
        userData = {
          email: decoded.email,
          username: decoded.username,
          role: decoded.role || 'buyer',
          full_name: decoded.full_name,
          is_super_admin: decoded.is_super_admin || false,
        }
        setUser(userData)
        localStorage.setItem('user_data', JSON.stringify(userData))
      } else {
        // Fallback to localStorage if decode fails
        const storedUserData = localStorage.getItem('user_data')
        if (storedUserData) {
          userData = JSON.parse(storedUserData)
          setUser(userData)
        }
      }
      
      // Only fetch profile if we successfully got user data from token
      if (userData) {
        await fetchAndMergeProfile()
      }
      
      setLoading(false)
    }
    initializeAuth()
  }, [])

  const login = async (credentials) => {
    // Prevent duplicate login requests
    if (isLoggingInRef.current) {
      console.log('AuthContext - Login already in progress, skipping duplicate request')
      return { success: false, error: 'Login already in progress' }
    }

    try {
      isLoggingInRef.current = true
      console.log('AuthContext - Attempting login...')
      const response = await authService.login(credentials)
      const access = response.data.access || response.data.access_token
      const refresh = response.data.refresh || response.data.refresh_token
      
      console.log('AuthContext - Login response received')
      
      if (!access || !refresh) {
        console.error('AuthContext - Missing tokens in response')
        return { success: false, error: 'Invalid server response: missing tokens' }
      }
      
      // Save tokens to localStorage
      localStorage.setItem('access_token', access)
      localStorage.setItem('refresh_token', refresh)
      console.log('AuthContext - Tokens saved to localStorage')
      
      // Decode access token to get user data
      const decoded = decodeJWT(access)
      console.log('AuthContext - Decoded JWT:', decoded)
      
      const userData = {
        email: decoded?.email || credentials.email,
        username: decoded?.username,
        role: decoded?.role || 'buyer',
        full_name: decoded?.full_name,
        is_super_admin: decoded?.is_super_admin || false,
      }
      
      console.log('AuthContext - User data after login:', userData)
      
      setUser(userData)
      localStorage.setItem('user_data', JSON.stringify(userData))

      // Fetch real profile data to fill in missing JWT fields
      // Don't await this to avoid blocking login if it fails
      fetchAndMergeProfile()
      
      return { success: true, user: userData }
    } catch (error) {
      console.error('AuthContext - Login error:', error)
      const errorMessage = error.response?.data?.detail || 'Login failed. Please try again.'
      showError(errorMessage)
      return {
        success: false,
        error: errorMessage
      }
    } finally {
      isLoggingInRef.current = false
    }
  }

  const setUserFromGoogle = (userData) => {
    const userWithRole = {
      ...userData,
      role: userData?.role || 'buyer'
    }
    setUser(userWithRole)
    localStorage.setItem('user_data', JSON.stringify(userWithRole))
  }

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      if (!prev) return prev
      const merged = { ...prev, ...updatedFields }
      localStorage.setItem('user_data', JSON.stringify(merged))
      return merged
    })
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_data')
    setUser(null)
  }

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
    setUserFromGoogle,
    isAuthenticated: !!user,
    userRole: user?.role || 'buyer',
    isSuperAdmin: user?.is_super_admin === true,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
