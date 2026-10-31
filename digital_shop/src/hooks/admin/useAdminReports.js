import { useQuery } from '@tanstack/react-query'
import adminService from '@services/admin/adminService'

export function useAdminReports() {
  return useQuery({
    queryKey: ['admin', 'reports'],
    queryFn: async () => {
      const response = await adminService.getReports()
      return response.data
    },
  })
}

export function useTopProducts() {
  return useQuery({
    queryKey: ['admin', 'reports', 'top-products'],
    queryFn: async () => {
      const response = await adminService.getTopProducts()
      console.log('Top Products API response:', response.data)
      return response.data
    },
  })
}

export function useRevenueReport() {
  return useQuery({
    queryKey: ['admin', 'reports', 'revenue'],
    queryFn: async () => {
      const response = await adminService.getRevenueReport()
      return response.data
    },
  })
}

export function useDownloadReport() {
  return useQuery({
    queryKey: ['admin', 'reports', 'download'],
    queryFn: async () => {
      const response = await adminService.getDownloadReport()
      return response.data
    },
  })
}
