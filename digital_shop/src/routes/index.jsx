import { createBrowserRouter } from 'react-router-dom'

// Placeholder imports - will be implemented later
import App from '../App'
import { MainLayout } from '@layouts/MainLayout'
import { AuthLayout } from '@components/auth/AuthLayout'
import { ProtectedRoute } from '@components/auth/ProtectedRoute'

// Public Routes
import { HomePage } from '@pages/home/HomePage'
import ProductsPage from '@pages/public/ProductsPage'
import ProductDetailPage from '@pages/public/ProductDetailPage'
import { AboutPage } from '@pages/about/AboutPage'
import ContactPage from '@pages/public/ContactPage'

// Auth Routes
import { LoginPage } from '@pages/auth/LoginPage'
import { RegisterPage } from '@pages/auth/RegisterPage'
import { ForgotPasswordPage } from '@pages/auth/ForgotPasswordPage'
import { PasswordResetVerifyPage } from '@pages/auth/PasswordResetVerifyPage'

// Buyer Routes
import CartPage from '@pages/buyer/CartPage'
import OrderReviewPage from '@pages/buyer/OrderReviewPage'
import PaymentSuccessPage from '@pages/buyer/PaymentSuccessPage'
import MyPurchasedPage from '@pages/buyer/MyPurchasedPage'
import MyDownloadsPage from '@pages/buyer/MyDownloadsPage'
import OrderHistoryPage from '@pages/buyer/OrderHistoryPage'
import { BuyerDashboard } from '@pages/buyer/BuyerDashboard'
import { BuyerLayout } from '@layouts/BuyerLayout'
import { BuyerRoute } from '@components/auth/BuyerRoute'

// Seller Routes
import SellerDashboard from '@pages/seller/SellerDashboard'
import MyProducts from '@pages/seller/MyProducts'
import AddProduct from '@pages/seller/AddProduct'
import EditProduct from '@pages/seller/EditProduct'
import TotalProducts from '@pages/seller/TotalProducts'
import TotalSales from '@pages/seller/TotalSales'
import Revenue from '@pages/seller/Revenue'
import ProductDistribution from '@pages/seller/ProductDistribution'
import Reports from '@pages/seller/Reports'
import { SellerLayout } from '@layouts/SellerLayout'
import { SellerRoute } from '@components/auth/SellerRoute'

// Admin Routes
import { AdminDashboardHome } from '@pages/admin/AdminDashboardHome'
import { UsersManagement } from '@pages/admin/UsersManagement'
import { ProductsManagement } from '@pages/admin/ProductsManagement'
import { OrdersManagement } from '@pages/admin/OrdersManagement'
import { OrderDetails } from '@pages/admin/OrderDetails'
import { Reports as AdminReports } from '@pages/admin/Reports'
import { Logs } from '@pages/admin/Logs'
import { ContactMessages } from '@pages/admin/ContactMessages'
import { AdminLayout } from '@layouts/AdminLayout'
import { AdminRoute } from '@components/auth/AdminRoute'


// Profile Route
import ProfilePage from '@pages/profile/ProfilePage'
import EditProfilePage from '@pages/profile/EditProfilePage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'products/:id', element: <ProductDetailPage /> },
      
      // Profile Route (Protected)
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        )
      },
      {
        path: 'profile/edit',
        element: (
          <ProtectedRoute>
            <EditProfilePage />
          </ProtectedRoute>
        )
      },
      {
        path: 'admin/settings',
        element: (
          <ProtectedRoute>
            <EditProfilePage />
          </ProtectedRoute>
        )
      },
      
      // Buyer Routes (Protected - without layout)
      { 
        path: 'buyer/cart', 
        element: (
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        )
      },
      { 
        path: 'buyer/order-review', 
        element: (
          <ProtectedRoute>
            <OrderReviewPage />
          </ProtectedRoute>
        )
      },
      { 
        path: 'buyer/payment-success', 
        element: (
          <ProtectedRoute>
            <PaymentSuccessPage />
          </ProtectedRoute>
        )
      },
      // PayPal return route with orderId parameter
      { 
        path: 'payment-success', 
        element: (
          <ProtectedRoute>
            <PaymentSuccessPage />
          </ProtectedRoute>
        )
      },
    ],
  },
  // Buyer Routes (Separate route tree with BuyerLayout)
  {
    path: '/buyer',
    element: (
      <BuyerRoute>
        <BuyerLayout />
      </BuyerRoute>
    ),
    children: [
      { index: true, element: <BuyerDashboard /> },
      { path: 'dashboard', element: <BuyerDashboard /> },
      { path: 'my-purchased', element: <MyPurchasedPage /> },
      { path: 'my-downloads', element: <MyDownloadsPage /> },
      { path: 'order-history', element: <OrderHistoryPage /> },
    ],
  },
  // Seller Routes (Separate route tree with SellerLayout)
  {
    path: '/seller',
    element: (
      <SellerRoute>
        <SellerLayout />
      </SellerRoute>
    ),
    children: [
      { index: true, element: <SellerDashboard /> },
      { path: 'dashboard', element: <SellerDashboard /> },
      { path: 'dashboard/products', element: <TotalProducts /> },
      { path: 'dashboard/sales', element: <TotalSales /> },
      { path: 'dashboard/revenue', element: <Revenue /> },
      { path: 'reports', element: <Reports /> },
      { path: 'distribution', element: <ProductDistribution /> },
      { path: 'products', element: <MyProducts /> },
      { path: 'upload', element: <AddProduct /> },
      { path: 'products/:id/edit', element: <EditProduct /> },
    ],
  },
  // Admin Routes (Separate route tree with AdminLayout)
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      { index: true, element: <AdminDashboardHome /> },
      { path: 'users', element: <UsersManagement /> },
      { path: 'products', element: <ProductsManagement /> },
      { path: 'orders', element: <OrdersManagement /> },
      { path: 'orders/:orderId', element: <OrderDetails /> },
      { path: 'reports', element: <AdminReports /> },
      { path: 'logs', element: <Logs /> },
      { path: 'contact-messages', element: <ContactMessages /> },
    ],
  },
  {
    path: '/forgot-password',
    element: <AuthLayout />,
    children: [
      { index: true, element: <ForgotPasswordPage /> },
      { path: 'verify', element: <PasswordResetVerifyPage /> },
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
    ],
  },
])

export default router
