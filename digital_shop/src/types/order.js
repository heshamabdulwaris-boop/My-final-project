// Order type definitions for the order system

export const OrderStatus = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  CANCELED: 'canceled',
}

export const PaymentStatus = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
}

// These are for documentation purposes - the actual data comes from the backend
// Order structure:
// {
//   id: number,
//   status: 'pending' | 'paid' | 'failed' | 'canceled',
//   total_price: string,
//   created_at: string,
//   items: Array<{
//     product_name: string,
//     price: string
//   }>
// }

// PayPal Order Response structure:
// {
//   id: string,
//   status: string,
//   intent: string,
//   purchase_units: Array<{
//     amount: {
//       currency_code: string,
//       value: string
//     }
//   }>,
//   links: Array<{
//     href: string,
//     rel: string,
//     method: string
//   }>
// }

// Capture PayPal Response structure:
// {
//   id: string,
//   status: string,
//   purchase_units: Array<{
//     payments: {
//       captures: Array<{
//         id: string,
//         status: string,
//         amount: {
//           currency_code: string,
//           value: string
//         }
//       }>
//     }
//   }>
// }
