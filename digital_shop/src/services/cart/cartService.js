import api from '../api'

export const cartService = {
  getCart: () => api.get('/cart/'),
  addToCart: (productId) => api.post('/cart/add/', { product_id: productId }),
  removeFromCart: (productId) => api.post('/cart/remove/', { product_id: productId }),
}

export default cartService
