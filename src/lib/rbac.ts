export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  RESTAURANT_OWNER = 'RESTAURANT_OWNER',
  MANAGER = 'MANAGER',
  CASHIER = 'CASHIER',
  WAITER = 'WAITER',
  KITCHEN = 'KITCHEN'
}
export const Permissions: Record<string, string[]> = {
  SUPER_ADMIN: ['*'],
  RESTAURANT_OWNER: ['restaurant:*', 'branch:*', 'menu:*', 'orders:*', 'reports:*'],
  MANAGER: ['branch:view', 'menu:*', 'orders:*', 'tables:*'],
  CASHIER: ['orders:view', 'orders:edit', 'payments:*'],
  WAITER: ['tables:view', 'orders:view', 'orders:create'],
  KITCHEN: ['kds:view', 'orders:view', 'orders:update_status']
}
