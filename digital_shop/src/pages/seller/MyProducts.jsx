import { useEffect, useState, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { ProductTable } from '@components/seller/ProductTable'
import { DeleteModal } from '@components/seller/DeleteModal'
import sellerService from '@services/seller/sellerService'

export default function MyProducts() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('search') || ''
  
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, product: null })
  const [deleting, setDeleting] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const isFetchingRef = useRef(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = products.filter(product =>
        product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredProducts(filtered)
      setCurrentPage(1) // Reset to first page on search
    } else {
      setFilteredProducts(products)
    }
  }, [searchQuery, products])

  const fetchProducts = async () => {
    // Prevent duplicate requests
    if (isFetchingRef.current) {
      console.log('MyProducts - Already fetching, skipping duplicate request')
      return
    }

    try {
      isFetchingRef.current = true
      setLoading(true)
      const response = await sellerService.getMyProducts()
      setProducts(response.data)
      setError(null)
    } catch (err) {
      console.error('Error fetching products:', err)
      // Handle 404 gracefully - show empty state instead of error
      setProducts([])
      setError(null)
    } finally {
      setLoading(false)
      isFetchingRef.current = false
    }
  }

  const handleEdit = (product) => {
    navigate(`/seller/products/${product.id}/edit`)
  }

  const handleDelete = (product) => {
    setDeleteModal({ isOpen: true, product })
  }

  const confirmDelete = async () => {
    try {
      setDeleting(true)
      await sellerService.deleteProduct(deleteModal.product.id)
      setDeleteModal({ isOpen: false, product: null })
      await fetchProducts()
    } catch (err) {
      console.error('Error deleting product:', err)
      setError('Failed to delete product')
    } finally {
      setDeleting(false)
    }
  }

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage)

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            My Products
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your digital products
          </p>
        </div>
        <button
          onClick={() => navigate('/seller/upload')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      <ProductTable
        products={paginatedProducts}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchQuery={searchQuery}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-indigo-600 text-white'
                    : 'border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, product: null })}
        onConfirm={confirmDelete}
        productName={deleteModal.product?.title}
        loading={deleting}
      />
    </div>
  )
}
