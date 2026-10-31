import api from '../api'

export const paymentService = {
  createPaymentIntent: (data) => api.post('/payments/create-intent/', data),
  processPayment: (data) => api.post('/payments/process/', data),
  getPaymentHistory: () => api.get('/payments/history/'),
  getWalletBalance: () => api.get('/payments/wallet/'),
  addToWallet: (amount) => api.post('/payments/wallet/add/', { amount }),
}

export default paymentService
