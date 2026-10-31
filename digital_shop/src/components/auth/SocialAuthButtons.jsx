import { motion } from 'framer-motion'
import { useGoogleLogin } from '@react-oauth/google'
import axios from '@lib/axios'
import { useState } from 'react'
import { useAuth } from '@contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

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

export function SocialAuthButtons() {
  const [isLoading, setIsLoading] = useState(false)
  const { setUserFromGoogle } = useAuth()
  const navigate = useNavigate()

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log('Google login success, token received:', tokenResponse)
      setIsLoading(true)
      try {
        console.log('Sending token to backend...')
        const response = await axios.post('http://localhost:8000/api/google/', {
          access_token: tokenResponse.access_token,
        })
        
        console.log('Backend response:', response.data)
        
        // Store JWT tokens from your Django backend
        // Assuming backend returns { access: "...", refresh: "..." }
        if (response.data.access) {
          localStorage.setItem('access_token', response.data.access)
        }
        if (response.data.refresh) {
          localStorage.setItem('refresh_token', response.data.refresh)
        }
        
        // Decode access token to get user role
        const decoded = decodeJWT(response.data.access)
        const userData = {
          email: decoded?.email,
          username: decoded?.username,
          role: decoded?.role || 'buyer',
          full_name: decoded?.full_name,
        }
        
        // Set user state using AuthContext
        setUserFromGoogle(userData)
        
        // Redirect based on user role
        const role = userData?.role || 'buyer'
        switch (role) {
          case 'admin':
          case 'superadmin':
            navigate('/admin')
            break
          case 'seller':
            navigate('/seller/dashboard')
            break
          case 'buyer':
          default:
            navigate('/products')
            break
        }
      } catch (error) {
        console.error('Google login failed:', error)
        console.error('Error details:', error.response?.data || error.message)
        alert('Login failed: ' + (error.response?.data?.detail || error.message))
      } finally {
        setIsLoading(false)
      }
    },
    onError: (error) => {
      console.error('Google login error:', error)
      alert('Google login failed: ' + error.error || 'Unknown error')
    },
  })

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => login()}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-2xl font-medium transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
      type="button"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      {isLoading ? 'Connecting...' : 'Continue with Google'}
    </motion.button>
  )
}
