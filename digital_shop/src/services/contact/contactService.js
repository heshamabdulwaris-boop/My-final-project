import { API_ENDPOINTS } from '@constants/endpoints'
import api from '../api'

export const contactService = {
  sendMessage: (data) => api.post(API_ENDPOINTS.CONTACT, data),
}

export default contactService
