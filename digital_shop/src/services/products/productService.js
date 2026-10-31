import api from '../api'

export const getProducts = async (params) => {
  const res = await api.get('/products/', { params })
  return res.data
}

export const downloadProduct = async (productId) => {
  const res = await api.get(`/products/download/${productId}/`, {
    responseType: 'blob',
  })
  return res
}

export const productService = {
  getProducts: (params) => api.get('/products/', { params }),
  getProduct: (id) => api.get(`/products/${id}/`),
  createProduct: (data) => api.post('/products/create/', data, {
    headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
  }),
  updateProduct: (id, data) => api.put(`/products/edit/${id}/`, data, {
    headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
  }),
  deleteProduct: (id) => api.delete(`/products/delete/${id}/`),
  searchProducts: (query) => api.get('/products/', { params: { search: query } }),
  downloadProduct: (productId) => api.get(`/products/download/${productId}/`, { responseType: 'blob' }),
  getTopSelling: () => api.get('/products/top-selling/'),
  getCategoryCounts: async () => {
    const res = await api.get('/products/')
    const products = res.data
    const counts = {}
    products.forEach(product => {
      const category = product.category || 'other'
      counts[category] = (counts[category] || 0) + 1
    })
    return counts
  },
}

export default productService
