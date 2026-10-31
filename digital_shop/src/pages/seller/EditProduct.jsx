import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ProductForm } from '@components/seller/ProductForm'
import sellerService from '@services/seller/sellerService'

export default function EditProduct() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      setError(null)
      // Since we don't have a single product endpoint, we'll get all products and find the one we need
      const response = await sellerService.getMyProducts()
      const foundProduct = response.data.find(p => p.id === parseInt(id))
      
      if (!foundProduct) {
        setError('Product not found')
        return
      }
      
      setProduct(foundProduct)
    } catch (err) {
      console.error('Error fetching product:', err)
      setError('Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true)
      setError(null)
      await sellerService.updateProduct(id, formData)
      navigate('/seller/products')
    } catch (err) {
      console.error('Error updating product:', err)
      setError(err.response?.data?.detail || 'Failed to update product')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        </div>
      </div>
    )
  }

  if (error && !product) {
    return (
      <div className="p-6 lg:p-8">
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          Edit Product
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Update your product information
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 lg:p-8">
        <ProductForm initialData={product} onSubmit={handleSubmit} loading={submitting} />
      </div>
    </div>
  )
}
