import { API_ENDPOINTS } from '@constants/endpoints'
import api from '../api'

export const sellerService = {
  // Dashboard stats
  getDashboardStats: () => api.get(API_ENDPOINTS.SELLER.DASHBOARD),

  // Seller's products
  getMyProducts: () => api.get(API_ENDPOINTS.SELLER.MY_PRODUCTS),

  // All products (for comparison)
  getAllProducts: () => api.get(API_ENDPOINTS.PRODUCTS.LIST),

  // Sales history
  getSalesHistory: (params) => api.get(API_ENDPOINTS.SELLER.SALES_HISTORY, { params }),

  // Reports
  getSalesReport: (params) => api.get('/products/seller/reports/sales/', { params }),
  getRevenueReport: (params) => api.get('/products/seller/reports/revenue/', { params }),
  getProductReport: (params) => api.get('/products/seller/reports/products/', { params }),
  getCustomerReport: (params) => api.get('/products/seller/reports/customers/', { params }),

  // Product CRUD
  createProduct: (data) =>
    api.post(API_ENDPOINTS.SELLER.CREATE_PRODUCT, data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
    }),

  updateProduct: (id, data) =>
    api.put(`${API_ENDPOINTS.SELLER.EDIT_PRODUCT}${id}/`, data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
    }),

  deleteProduct: (id) => api.delete(`${API_ENDPOINTS.SELLER.DELETE_PRODUCT}${id}/`),
}

export default sellerService
