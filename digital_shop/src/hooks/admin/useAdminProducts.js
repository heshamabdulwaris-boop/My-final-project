import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import adminService from '@services/admin/adminService'

export function useAdminProducts(params = {}) {
  return useQuery({
    queryKey: ['admin', 'products', params],
    queryFn: async () => {
      const response = await adminService.getProducts({ ...params, page_size: 10 })
      return response.data
    },
  })
}

export function usePendingProducts() {
  return useQuery({
    queryKey: ['admin', 'pending-products'],
    queryFn: async () => {
      const response = await adminService.getPendingProducts()
      return response.data
    },
  })
}

export function useApproveProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (productId) => adminService.approveProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'pending-products'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] })
    },
  })
}

export function useRejectProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ productId, reason }) => adminService.rejectProduct(productId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'pending-products'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] })
    },
  })
}
