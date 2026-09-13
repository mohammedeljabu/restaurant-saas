// Multi-Tenant Resolution - عزل صارم لكل مطعم
import { prisma } from './prisma'
export async function resolveTenant(slug: string) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug, isActive: true },
    include: { subscription: { include: { plan: true } } }
  })
  if (!restaurant) throw new Error('Restaurant not found')
  return restaurant
}
export const tenantFilter = (restaurantId: string) => ({ restaurantId })
