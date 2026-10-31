import { useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

// Decode JWT token to get expiration time
function decodeToken(token) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Failed to decode token:', error)
    return null
  }
}

// Get time until token expires in milliseconds
function getTimeUntilExpiry(token) {
  const decoded = decodeToken(token)
  if (!decoded || !decoded.exp) return 0
  
  const expiryTime = decoded.exp * 1000 // Convert to milliseconds
  const currentTime = Date.now()
  return expiryTime - currentTime
}

export function useTokenRefresh() {
  const navigate = useNavigate()
  const refreshTimeoutRef = useRef(null)
  const isRefreshing = useRef(false)

  const refreshToken = useCallback(async () => {
    if (isRefreshing.current) return
    
    try {
      isRefreshing.current = true
      const refreshTokenValue = localStorage.getItem('refresh_token')
      
      if (!refreshTokenValue) {
        throw new Error('No refresh token available')
      }

      console.log('Proactively refreshing token...')
      const response = await axios.post('http://localhost:8000/api/auth/token/refresh/', {
        refresh: refreshTokenValue,
      })

      const { access } = response.data
      if (!access) {
        throw new Error('No access token in refresh response')
      }

      localStorage.setItem('access_token', access)
      console.log('Proactive token refresh successful')
      
      // Schedule next refresh
      scheduleTokenRefresh(access)
      
      return true
    } catch (error) {
      console.error('Proactive token refresh failed:', error)
      // Clear tokens and redirect to login
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user_data')
      navigate('/auth/login')
      return false
    } finally {
      isRefreshing.current = false
    }
  }, [navigate])

  const scheduleTokenRefresh = useCallback((token) => {
    // Clear existing timeout
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current)
    }

    const timeUntilExpiry = getTimeUntilExpiry(token)
    
    if (timeUntilExpiry <= 0) {
      // Token already expired, refresh immediately
      refreshToken()
      return
    }

    // Refresh 5 minutes before expiry
    const refreshTime = timeUntilExpiry - 5 * 60 * 1000

    // Schedule refresh (if refresh time is positive)
    if (refreshTime > 0) {
      refreshTimeoutRef.current = setTimeout(() => {
        refreshToken()
      }, refreshTime)
    } else {
      // Token expires in less than 5 minutes, refresh immediately
      refreshToken()
    }
  }, [refreshToken])

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      const timeUntilExpiry = getTimeUntilExpiry(token)
      console.log('Token expiry time (ms):', timeUntilExpiry)
      console.log('Token expiry time (minutes):', timeUntilExpiry / (60 * 1000))
      scheduleTokenRefresh(token)
    }

    // Cleanup on unmount
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current)
      }
    }
  }, [scheduleTokenRefresh])

  // Also refresh when tab becomes visible (user returns to browser)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const token = localStorage.getItem('access_token')
        if (token) {
          const timeUntilExpiry = getTimeUntilExpiry(token)
          // If token expires in less than 10 minutes, refresh it
          if (timeUntilExpiry > 0 && timeUntilExpiry < 10 * 60 * 1000) {
            console.log('Tab visible, token expiring soon, refreshing...')
            refreshToken()
          }
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [refreshToken])

  return { refreshToken }
}
