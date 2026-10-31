import { useQuery } from '@tanstack/react-query'
import adminService from '@services/admin/adminService'

export function useAdminLogs(params = {}) {
  return useQuery({
    queryKey: ['admin', 'logs', params],
    queryFn: async () => {
      const response = await adminService.getLogs({ ...params, page_size: 10 })
      return response.data
    },
  })
}
