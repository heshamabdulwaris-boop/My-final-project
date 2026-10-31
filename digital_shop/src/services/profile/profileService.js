import { API_ENDPOINTS } from '@constants/endpoints'
import api from '../api'

export const profileService = {
  getProfile: () => api.get(API_ENDPOINTS.PROFILE.GET),
  updateProfile: (data) => api.put(API_ENDPOINTS.PROFILE.UPDATE, data),
}

export default profileService
