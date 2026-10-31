import { API_ENDPOINTS } from '@constants/endpoints'
import api from '../api'

export const authService = {
  login: (credentials) => api.post(API_ENDPOINTS.AUTH.LOGIN, credentials),
  register: (userData) => api.post(API_ENDPOINTS.AUTH.REGISTER, userData),
  logout: () => api.post(API_ENDPOINTS.AUTH.LOGOUT),
  refreshToken: (refreshToken) => api.post(API_ENDPOINTS.AUTH.REFRESH, { refresh: refreshToken }),
  forgotPassword: (email) => api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email }),
  resetPassword: (data) => api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data),
  requestPasswordResetOTP: (email) => api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email }),
  confirmPasswordReset: (data) => api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data),
  changeRole: (userId, role) => api.patch(API_ENDPOINTS.AUTH.CHANGE_ROLE(userId), { role }),
}

export default authService
