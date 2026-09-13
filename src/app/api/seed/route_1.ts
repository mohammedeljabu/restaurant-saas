export const dynamic = 'force-dynamic'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const secret = searchParams.get('secret')
  
  // حماية بسيطة
  if (secret !== 'seed123') {
    return Response.json({ error: 'ضع ?secret=seed123 في الرابط' }, { status: 401 })
  }

  try {
    // نفس منطق seed.ts لكن مبسط للـ API
    const hash = await bcrypt.hash('admin123', 10)
    
    const basic = await prisma.subscriptionPlan.upsert({
      where: { slug: 'basic' },
      update: { priceMonthly: 50, priceYearly: 500 },
      create: {
        slug: 'basic', name: 'Basic',
        description: 'الباقة الأساسية - 50 د.ل/شهر - شهر أول مجاني',
        priceMonthly: 50, priceYearly: 500,
        features: { qr: true, orders: true, tables: true, pos: true, trialDays: 30, freeTrial: true },
        maxBranches: 1, maxTables: 20, maxEmployees: 5
      }
    })

    const pro = await prisma.subscriptionPlan.upsert({
      where: { slug: 'pro' },
      update: { priceMonthly: 120, priceYearly: 1200 },
      create: {
        slug: 'pro', name: 'Pro',
        description: 'باقة برو - 120 د.ل/شهر - شهر أول مجاني',
        priceMonthly: 120, priceYearly: 1200,
        features: { qr: true, orders: true, tables: true, pos: true, kds: true, waiter: true, inventory: true, reports: true, reservations: true, trialDays: 30, freeTrial: true, popular: true },
        maxBranches: 3, maxTables: 50, maxEmployees: 15
      }
    })

    const enterprise = await prisma.subscriptionPlan.upsert({
      where: { slug: 'enterprise' },
      update: { priceMonthly: 199, priceYearly: 1990 },
      create: {
        slug: 'enterprise', name: 'Enterprise',
        description: 'باقة المؤسسات - 199 د.ل/شهر - شهر أول مجاني',
        priceMonthly: 199, priceYearly: 1990,
        features: { qr: true, orders: true, tables: true, pos: true, kds: true, waiter: true, inventory: true, reports: true, reservations: true, api: true, customDomain: true, trialDays: 30, freeTrial: true },
        maxBranches: 10, maxTables: 200, maxEmployees: 100
      }
    })

    await prisma.user.upsert({
      where: { email: 'admin@platform.com' },
      update: {},
      create: { email: 'admin@platform.com', name: 'Super Admin', passwordHash: hash, role: 'SUPER_ADMIN' }
    })

    const owner = await prisma.user.upsert({
      where: { email: 'owner@demo.com' },
      update: {},
      create: { email: 'owner@demo.com', name: 'صاحب مطعم ديمو', passwordHash: hash, role: 'RESTAURANT_OWNER' }
    })

    const restaurant = await prisma.restaurant.upsert({
      where: { slug: 'demo' },
      update: {},
      create: {
        slug: 'demo', name: 'مطعم الديمو - طرابلس',
        description: 'أفضل برجر وبيتزا في طرابلس - شهر مجاني',
        phone: '+218 91 1234567', address: 'طرابلس، السياحية',
        currency: 'LYD', taxRate: 5, serviceFeeRate: 3, ownerId: owner.id,
      }
    })

    const now = new Date()
    const trialEnd = new Date(now.getTime() + 30 * 24 * 3600 * 1000)

    await prisma.subscription.upsert({
      where: { restaurantId: restaurant.id },
      update: { status: 'TRIALING', trialEndsAt: trialEnd, currentPeriodStart: now, currentPeriodEnd: trialEnd },
      create: {
        restaurantId: restaurant.id, planId: pro.id, status: 'TRIALING',
        trialEndsAt: trialEnd, currentPeriodStart: now, currentPeriodEnd: trialEnd,
      }
    })

    const branch = await prisma.branch.upsert({
      where: { restaurantId_slug: { restaurantId: restaurant.id, slug: 'tripoli' } },
      update: {},
      create: { restaurantId: restaurant.id, slug: 'tripoli', name: 'فرع طرابلس - السياحية', address: 'السياحية، طرابلس' }
    })

    // Return success
    return Response.json({
      success: true,
      message: '✅ تم إنشاء البيانات بنجاح - LYD 50/120/199 + شهر مجاني',
      plans: [
        { slug: 'basic', price: '50 د.ل/شهر - 500 د.ل/سنة' },
        { slug: 'pro', price: '120 د.ل/شهر - 1200 د.ل/سنة' },
        { slug: 'enterprise', price: '199 د.ل/شهر - 1990 د.ل/سنة' }
      ],
      accounts: {
        superAdmin: 'admin@platform.com / admin123',
        demo: 'owner@demo.com / admin123',
        demoRestaurant: '/r/demo/b/tripoli/t/demo_token_1'
      }
    })

  } catch (error: any) {
    console.error(error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}
