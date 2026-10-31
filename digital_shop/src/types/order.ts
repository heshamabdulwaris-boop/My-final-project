export type OrderStatus = 'pending' | 'paid' | 'failed' | 'canceled'
export type PaymentStatus = 'pending' | 'success' | 'failed'

export interface OrderItem {
  product_name: string
  price: string
}

export interface Order {
  id: number
  status: OrderStatus
  total_price: string
  created_at: string
  items: OrderItem[]
}

export interface CreateOrderResponse extends Order {}

export interface PayPalOrderResponse {
  id: string
  status: string
  intent: string
  purchase_units: Array<{
    amount: {
      currency_code: string
      value: string
    }
  }>
  links: Array<{
    href: string
    rel: string
    method: string
  }>
}

export interface CapturePayPalResponse {
  id: string
  status: string
  purchase_units: Array<{
    payments: {
      captures: Array<{
        id: string
        status: string
        amount: {
          currency_code: string
          value: string
        }
      }>
    }
  }>
}
