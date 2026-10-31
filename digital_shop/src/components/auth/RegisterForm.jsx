import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@contexts/AuthContext'
import authService from '@services/auth/authService'
import { PasswordInput } from './PasswordInput'
import { SocialAuthButtons } from './SocialAuthButtons'
import { AuthDivider } from './AuthDivider'

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  role: z.enum(['buyer', 'seller'], {
    required_error: 'Please select a role',
  }),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  password2: z.string().min(6, 'Confirm password must be at least 6 characters'),
}).refine((data) => data.password === data.password2, {
  message: "Passwords don't match",
  path: ['password2'],
})

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)
      setError('')
      
      // Step 1: Register the user (with all required fields)
      const registrationData = {
        username: data.username,
        email: data.email,
        full_name: data.full_name,
        role: data.role,
        password: data.password,
        password2: data.password2,
      }
      
      const response = await authService.register(registrationData)

      // Helper: redirect based on role
      const redirectByRole = (role) => {
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
      }

      // Step 2: If the backend returns JWT tokens, save them
      const accessToken = response.data.access || response.data.access_token
      const refreshToken = response.data.refresh || response.data.refresh_token

      if (accessToken && refreshToken) {
        localStorage.setItem('access_token', accessToken)
        localStorage.setItem('refresh_token', refreshToken)
      }

      // Step 3: Auto-login to set AuthContext state
      const result = await login({ email: data.email, password: data.password })

      if (result.success) {
        // Use role from login result, fall back to form selection
        const role = result.user?.role || data.role || 'buyer'
        redirectByRole(role)
      } else {
        // Registration succeeded but auto-login failed
        // If we saved tokens, redirect based on form role
        if (accessToken) {
          redirectByRole(data.role || 'buyer')
        } else {
          // No tokens — redirect to login page
          navigate('/auth/login')
        }
      }
    } catch (err) {
      const responseData = err.response?.data
      // Handle DRF field-level errors
      if (responseData && typeof responseData === 'object' && !responseData.detail) {
        const messages = Object.entries(responseData)
          .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
          .join('. ')
        setError(messages)
      } else {
        setError(responseData?.detail || 'Registration failed. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Username
          </label>
          <input
            type="text"
            {...register('username')}
            className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm ${
              errors.username ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
            }`}
            placeholder="johndoe"
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-500">{errors.username.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            {...register('email')}
            className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm ${
              errors.email ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
            }`}
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Full Name
          </label>
          <input
            type="text"
            {...register('full_name')}
            className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm ${
              errors.full_name ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
            }`}
            placeholder="John Doe"
          />
          {errors.full_name && (
            <p className="mt-1 text-sm text-red-500">{errors.full_name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            I want to
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className={`relative flex items-center justify-center px-3 py-3 border-2 rounded-2xl cursor-pointer transition-all ${
              errors.role ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50 dark:has-[:checked]:bg-indigo-900/20 has-[:checked]:shadow-md`}>
              <input
                type="radio"
                value="buyer"
                {...register('role')}
                className="sr-only"
              />
              <div className="text-center">
                <div className="font-medium text-sm text-gray-900 dark:text-white has-[:checked]:text-indigo-600">Buy</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Browse products</div>
              </div>
            </label>
            <label className={`relative flex items-center justify-center px-3 py-3 border-2 rounded-2xl cursor-pointer transition-all ${
              errors.role ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50 dark:has-[:checked]:bg-indigo-900/20 has-[:checked]:shadow-md`}>
              <input
                type="radio"
                value="seller"
                {...register('role')}
                className="sr-only"
              />
              <div className="text-center">
                <div className="font-medium text-sm text-gray-900 dark:text-white has-[:checked]:text-indigo-600">Sell</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Sell products</div>
              </div>
            </label>
          </div>
          {errors.role && (
            <p className="mt-1 text-sm text-red-500">{errors.role.message}</p>
          )}
        </div>

        <PasswordInput
          label="Password"
          {...register('password')}
          error={errors.password?.message}
          placeholder="••••••••"
        />

        <PasswordInput
          label="Confirm Password"
          {...register('password2')}
          error={errors.password2?.message}
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 text-sm"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Creating account...
          </>
        ) : (
          'Create account'
        )}
      </button>

      <AuthDivider text="Or continue with" />
      <SocialAuthButtons />

      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{' '}
        <Link to="/auth/login" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </form>
  )
}
