export const ROLES = {
  BUYER: 'buyer',
  SELLER: 'seller',
  ADMIN: 'admin',
  SUPERADMIN: 'superadmin',
}

export const ROLE_PERMISSIONS = {
  [ROLES.BUYER]: ['view_products', 'purchase_products', 'manage_cart', 'view_orders'],
  [ROLES.SELLER]: ['view_products', 'upload_products', 'manage_products', 'view_sales', 'manage_orders'],
  [ROLES.ADMIN]: ['view_dashboard', 'view_users', 'view_products', 'view_orders', 'view_reports', 'view_own_logs'],
  [ROLES.SUPERADMIN]: [
    'view_dashboard',
    'view_users',
    'activate_users',
    'suspend_users',
    'view_products',
    'view_orders',
    'view_reports',
    'view_all_logs',
    'filter_logs_by_admin',
  ],
}
