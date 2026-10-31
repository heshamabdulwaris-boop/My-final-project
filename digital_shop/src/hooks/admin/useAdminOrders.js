import { useQuery } from '@tanstack/react-query'
import adminService from '@services/admin/adminService'

export function useAdminOrders(params = {}) {
  return useQuery({
    queryKey: ['admin', 'orders', params],
    queryFn: async () => {
      const response = await adminService.getOrders({ ...params, page_size: 10 })
      return response.data
    },
  })
}

export function useAdminOrderDetail(orderId) {
  return useQuery({
    queryKey: ['admin', 'orders', orderId],
    queryFn: async () => {
      const response = await adminService.getOrderDetail(orderId)
      return response.data
    },
    enabled: !!orderId,
  })
}
