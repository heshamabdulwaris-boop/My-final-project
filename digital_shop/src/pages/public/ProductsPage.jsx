import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, Filter } from 'lucide-react'
import { getProducts } from '@services/products/productService'
import ProductCard from '@components/products/ProductCard'
import ProductSkeleton from '@components/products/ProductSkeleton'
import EmptyState from '@components/products/EmptyState'
import ErrorState from '@components/products/ErrorState'
import { useDebounce } from '@hooks/useDebounce'

const CATEGORIES = [
  { value: '', label: 'All Products' },
  { value: 'ebook', label: 'Ebooks' },
  { value: 'course', label: 'Courses' },
  { value: 'template', label: 'Templates' },
  { value: 'photograph', label: 'Photographs' },
  { value: 'other', label: 'Other' },
]

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()
  const [initialParamsLoaded, setInitialParamsLoaded] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12
  const isFetchingRef = useRef(false)
  
  // Debounce search query to reduce API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  // Remove client-side filtering since API handles search and category

  const fetchProducts = async () => {
    // Prevent duplicate requests
    if (isFetchingRef.current) {
      console.log('ProductsPage - Already fetching, skipping duplicate request')
      return
    }

    try {
      isFetchingRef.current = true
      setLoading(true)
      setError(null)
      const params = {}
      if (selectedCategory) {
        params.category = selectedCategory
      }
      if (debouncedSearchQuery.trim()) {
        params.search = debouncedSearchQuery.trim()
      }
      console.log('Fetching products with params:', params)
      const data = await getProducts(params)
      console.log('Products received:', data.length)
      setProducts(data)
      // No client-side filtering needed since API handles it
      setFilteredProducts(data)
    } catch (err) {
      setError(err.message || 'Failed to fetch products')
    } finally {
      setLoading(false)
      isFetchingRef.current = false
    }
  }

  useEffect(() => {
    const searchParam = searchParams.get('search')
    const categoryParam = searchParams.get('category')
    console.log('URL params:', { searchParam, categoryParam })
    console.log('Full searchParams:', Object.fromEntries(searchParams))
    console.log('Current URL:', window.location.href)
    if (searchParam) {
      setSearchQuery(searchParam)
    }
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    } else {
      setSelectedCategory('')
    }
    setInitialParamsLoaded(true)
  }, [searchParams])

  useEffect(() => {
    if (!initialParamsLoaded) return
    console.log('State changed - selectedCategory:', selectedCategory, 'debouncedSearchQuery:', debouncedSearchQuery)
    fetchProducts()
  }, [selectedCategory, debouncedSearchQuery, initialParamsLoaded])

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    const newParams = {}
    if (category) {
      newParams.category = category
    }
    if (searchQuery.trim()) {
      newParams.search = searchQuery.trim()
    }
    setSearchParams(newParams)
  }

  const handleRetry = () => {
    fetchProducts()
  }

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Hero Section */}
      <div className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">Digital Products</h1>
            <p className="text-base lg:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Browse our curated collection of high-quality digital products from talented creators worldwide
            </p>
          </div>

          {/* Search Input */}
          <div className="max-w-2xl mx-auto">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Search by name, category, or keyword..."
                value={searchQuery}
                onChange={(e) => {
                  const newQuery = e.target.value
                  setSearchQuery(newQuery)
                  const newParams = {}
                  if (newQuery.trim()) {
                    newParams.search = newQuery.trim()
                  }
                  if (selectedCategory) {
                    newParams.category = selectedCategory
                  }
                  setSearchParams(newParams)
                }}
                className="w-full pl-12 pr-4 py-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-250 ease"
                style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                onFocus={(e) => { e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.10)'; }}
                onBlur={(e) => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('')
                    const newParams = {}
                    if (selectedCategory) {
                      newParams.category = selectedCategory
                    }
                    setSearchParams(newParams)
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-250 ease p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                  style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.10)'; e.currentTarget.style.transform = 'translateY(-4px)'; }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Category Filter */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mr-2">
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Filter by:</span>
              </div>
              {CATEGORIES.map((category) => (
                <button
                  key={category.value}
                  onClick={() => handleCategoryChange(category.value)}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-250 ease ${
                    selectedCategory === category.value
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400'
                  }`}
                  style={{ borderRadius: '10px', boxShadow: selectedCategory === category.value ? '0 2px 8px rgba(0,0,0,0.04)' : '0 2px 8px rgba(0,0,0,0.04)' }}
                  onMouseEnter={(e) => { if (selectedCategory !== category.value) { e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.10)'; e.currentTarget.style.transform = 'translateY(-4px)'; } }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  {category.label}
                </button>
              ))}
            </div>
            <div className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </span>
            </div>
          </div>

          {loading ? (
            // Loading State - Skeleton Cards
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(9)].map((_, index) => (
                <ProductSkeleton key={index} />
              ))}
            </div>
          ) : error ? (
            // Error State
            <ErrorState onRetry={handleRetry} />
          ) : filteredProducts.length === 0 ? (
            // Empty State
            <EmptyState />
          ) : (
            // Product Grid
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-250 ease"
                      style={{ borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                      onMouseEnter={(e) => { if (!e.currentTarget.disabled) { e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.10)'; e.currentTarget.style.transform = 'translateY(-4px)'; } }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 border transition-all duration-250 ease ${
                          currentPage === page
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                        style={{ borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                        onMouseEnter={(e) => { if (currentPage !== page) { e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.10)'; e.currentTarget.style.transform = 'translateY(-4px)'; } }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-250 ease"
                      style={{ borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                      onMouseEnter={(e) => { if (!e.currentTarget.disabled) { e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.10)'; e.currentTarget.style.transform = 'translateY(-4px)'; } }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
