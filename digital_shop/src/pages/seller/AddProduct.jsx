import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ProductForm } from '@components/seller/ProductForm'
import { ArrowLeft, Package } from 'lucide-react'
import sellerService from '@services/seller/sellerService'

export default function AddProduct() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (formData) => {
    try {
      setLoading(true)
      setError(null)
      await sellerService.createProduct(formData)
      navigate('/seller/products')
    } catch (err) {
      console.error('Error creating product:', err)
      setError(err.response?.data?.detail || 'Failed to create product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              Add New Product
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Create and publish your digital product to the marketplace
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
            <Package className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
              Digital Products
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
              <span className="text-red-600 dark:text-red-400 text-lg">!</span>
            </div>
            <p className="text-red-600 dark:text-red-400 text-sm flex-1">{error}</p>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-6 lg:p-8">
          <ProductForm onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>
    </div>
  )
}
