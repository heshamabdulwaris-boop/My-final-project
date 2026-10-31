import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import orderService from '@services/order/orderService'
import productService from '@services/products/productService'
import sellerService from '@services/seller/sellerService'

// Query keys
export const orderKeys = {
  all: ['orders'],
  history: () => [...orderKeys.all, 'history'],
  detail: (id) => [...orderKeys.all, id],
}

// Additional query keys for invalidation
export const productKeys = {
  all: ['products'],
  purchased: () => [...productKeys.all, 'purchased'],
  downloads: () => [...productKeys.all, 'downloads'],
}

// Seller query keys
export const sellerKeys = {
  all: ['seller'],
  dashboard: () => [...sellerKeys.all, 'dashboard'],
}

// Create Order Mutation
export function useCreateOrder() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: () => orderService.createOrder(),
    onSuccess: (data) => {
      // Invalidate order history after creating a new order
      queryClient.invalidateQueries({ queryKey: orderKeys.history() })
    },
  })
}

// Order History Query
export function useOrderHistory() {
  return useQuery({
    queryKey: orderKeys.history(),
    queryFn: () => orderService.getOrderHistory(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// My Purchased Query
export function useMyPurchased() {
  return useQuery({
    queryKey: productKeys.purchased(),
    queryFn: async () => {
      const data = await orderService.getMyPurchased()
      const purchased = Array.isArray(data) ? data : []
      
      // Fetch product details in parallel
      const detailsPromises = purchased.map(async (product) => {
        try {
          const response = await productService.getProduct(product.id)
          return { id: product.id, data: response.data }
        } catch (err) {
          console.error(`Failed to fetch details for product ${product.id}:`, err)
          return { id: product.id, data: null }
        }
      })

      const detailsResults = await Promise.all(detailsPromises)
      const detailsMap = {}
      detailsResults.forEach(({ id, data }) => {
        detailsMap[id] = data
      })

      return { purchased, detailsMap }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// My Downloads Query
export function useMyDownloads() {
  return useQuery({
    queryKey: productKeys.downloads(),
    queryFn: () => orderService.getMyDownloads(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Seller Dashboard Stats Query
export function useSellerDashboard() {
  return useQuery({
    queryKey: sellerKeys.dashboard(),
    queryFn: async () => {
      const response = await sellerService.getDashboardStats()
      return response.data
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Create PayPal Order Mutation
export function useCreatePaypalOrder() {
  return useMutation({
    mutationFn: (orderId) => orderService.createPaypalOrder(orderId),
  })
}

// Capture PayPal Payment Mutation
export function useCapturePaypalOrder() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (orderId) => orderService.capturePaypalOrder(orderId),
    onSuccess: () => {
      // Invalidate all related queries after successful payment
      queryClient.invalidateQueries({ queryKey: orderKeys.history() })
      queryClient.invalidateQueries({ queryKey: productKeys.purchased() })
      queryClient.invalidateQueries({ queryKey: productKeys.downloads() })
    },
  })
}
