import { useQuery } from '@tanstack/react-query'
import adminService from '@services/admin/adminService'

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: async () => {
      const [dashboardResponse, revenueResponse] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getPlatformRevenue().catch(() => ({ data: { platform_revenue: 0 } }))
      ])
      
      return {
        ...dashboardResponse.data,
        platform_revenue: revenueResponse.data?.platform_revenue || 0
      }
    },
  })
}
