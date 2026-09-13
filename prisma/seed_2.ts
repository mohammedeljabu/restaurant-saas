import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
const prisma = new PrismaClient()

async function main() {
  console.log('Seeding with LYD pricing + 1 month free trial...')

  // Plans - بالدينار الليبي + شهر مجاني
  const basic = await prisma.subscriptionPlan.upsert({
    where: { slug: 'basic' },
    update: {
      priceMonthly: 50,
      priceYearly: 500,
      description: 'الباقة الأساسية - 50 د.ل/شهر - شهر أول مجاني - QR Menu + Orders + Tables + Cashier',
      name: 'Basic'
    },
    create: {
      slug: 'basic',
      name: 'Basic',
      description: 'الباقة الأساسية - 50 د.ل/شهر - شهر أول مجاني - QR Menu + Orders + Tables + Cashier',
      priceMonthly: 50,
      priceYearly: 500,
      features: { 
        qr: true, 
        orders: true, 
        tables: true, 
        pos: true, 
        kds: false, 
        inventory: false, 
        maxBranches: 1, 
        maxTables: 20,
        trialDays: 30,
        freeTrial: true
      },
      maxBranches: 1, maxTables: 20, maxEmployees: 5
    }
  })

  const pro = await prisma.subscriptionPlan.upsert({
    where: { slug: 'pro' },
    update: {
      priceMonthly: 120,
      priceYearly: 1200,
      description: 'باقة برو - 120 د.ل/شهر - شهر أول مجاني - كل ميزات Basic + KDS + Waiter + Inventory + Reports',
      name: 'Pro'
    },
    create: {
      slug: 'pro',
      name: 'Pro',
      description: 'باقة برو - 120 د.ل/شهر - شهر أول مجاني - كل ميزات Basic + KDS + Waiter + Inventory + Reports',
      priceMonthly: 120,
      priceYearly: 1200,
      features: { 
        qr: true, 
        orders: true, 
        tables: true, 
        pos: true, 
        kds: true, 
        waiter: true, 
        inventory: true, 
        reports: true, 
        reservations: true, 
        maxBranches: 3,
        trialDays: 30,
        freeTrial: true,
        popular: true
      },
      maxBranches: 3, maxTables: 50, maxEmployees: 15
    }
  })

  const enterprise = await prisma.subscriptionPlan.upsert({
    where: { slug: 'enterprise' },
    update: {
      priceMonthly: 199,
      priceYearly: 1990,
      description: 'باقة المؤسسات - 199 د.ل/شهر - شهر أول مجاني - كل الميزات + Multi Branch + API + Custom Domain',
      name: 'Enterprise'
    },
    create: {
      slug: 'enterprise',
      name: 'Enterprise',
      description: 'باقة المؤسسات - 199 د.ل/شهر - شهر أول مجاني - كل الميزات + Multi Branch + API + Custom Domain',
      priceMonthly: 199,
      priceYearly: 1990,
      features: { 
        qr: true, 
        orders: true, 
        tables: true, 
        pos: true, 
        kds: true, 
        waiter: true, 
        inventory: true, 
        reports: true, 
        reservations: true, 
        api: true, 
        customDomain: true, 
        maxBranches: 10,
        trialDays: 30,
        freeTrial: true
      },
      maxBranches: 10, maxTables: 200, maxEmployees: 100
    }
  })

  // Super Admin
  const hash = await bcrypt.hash('admin123', 10)
  await prisma.user.upsert({
    where: { email: 'admin@platform.com' },
    update: {},
    create: { email: 'admin@platform.com', name: 'Super Admin', passwordHash: hash, role: 'SUPER_ADMIN' }
  })

  // Demo Restaurant Owner
  const owner = await prisma.user.upsert({
    where: { email: 'owner@demo.com' },
    update: {},
    create: { email: 'owner@demo.com', name: 'صاحب مطعم ديمو', passwordHash: hash, role: 'RESTAURANT_OWNER' }
  })

  const restaurant = await prisma.restaurant.upsert({
    where: { slug: 'demo' },
    update: {},
    create: {
      slug: 'demo',
      name: 'مطعم الديمو - طرابلس',
      description: 'أفضل برجر وبيتزا في طرابلس - شهر مجاني للتجربة',
      phone: '+218 91 1234567',
      whatsapp: '+218 91 1234567',
      address: 'طرابلس، السياحية',
      currency: 'LYD',
      taxRate: 5,
      serviceFeeRate: 3,
      ownerId: owner.id,
    }
  })

  // Subscription with 1 MONTH FREE TRIAL - شهر مجاني كامل
  const now = new Date()
  const trialEnd = new Date(now.getTime() + 30 * 24 * 3600 * 1000) // 30 يوم مجاني
  
  await prisma.subscription.upsert({
    where: { restaurantId: restaurant.id },
    update: {
      status: 'TRIALING',
      trialEndsAt: trialEnd,
      currentPeriodStart: now,
      currentPeriodEnd: trialEnd,
    },
    create: {
      restaurantId: restaurant.id,
      planId: pro.id,
      status: 'TRIALING', // يبدأ كتجربة مجانية
      trialEndsAt: trialEnd, // ينتهي بعد 30 يوم
      currentPeriodStart: now,
      currentPeriodEnd: trialEnd,
    }
  })

  // Branch
  const branch = await prisma.branch.upsert({
    where: { restaurantId_slug: { restaurantId: restaurant.id, slug: 'tripoli' } },
    update: {},
    create: { restaurantId: restaurant.id, slug: 'tripoli', name: 'فرع طرابلس - السياحية', address: 'السياحية، طرابلس' }
  })

  // Categories
  const cat1 = await prisma.menuCategory.upsert({
    where: { restaurantId_slug: { restaurantId: restaurant.id, slug: 'burgers' } },
    update: {},
    create: { restaurantId: restaurant.id, slug: 'burgers', name: 'Burgers', nameAr: 'برجر', sortOrder: 1 }
  })

  const cat2 = await prisma.menuCategory.upsert({
    where: { restaurantId_slug: { restaurantId: restaurant.id, slug: 'pizza' } },
    update: {},
    create: { restaurantId: restaurant.id, slug: 'pizza', name: 'Pizza', nameAr: 'بيتزا', sortOrder: 2 }
  })

  await prisma.menuItem.createMany({
    data: [
      { restaurantId: restaurant.id, categoryId: cat1.id, name: 'Classic Burger', nameAr: 'برجر كلاسيك', descriptionAr: 'لحم 150غ، جبنة، خس، طماطم', price: 25, imageUrl: 'https://images.unsplash.com/photo-1568909344668-6f14a07b56a0?w=400' },
      { restaurantId: restaurant.id, categoryId: cat1.id, name: 'Cheese Burger', nameAr: 'تشيز برجر', descriptionAr: 'دبل تشيز مع صوص خاص', price: 32, imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400' },
      { restaurantId: restaurant.id, categoryId: cat2.id, name: 'Margherita', nameAr: 'مارجريتا', descriptionAr: 'صلصة طماطم، موزاريلا، ريحان', price: 38, imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400' },
    ],
    skipDuplicates: true
  })

  // Tables + QR
  for (let i=1; i<=12; i++) {
    const table = await prisma.table.upsert({
      where: { branchId_number: { branchId: branch.id, number: `Table ${i}` } },
      update: {},
      create: { branchId: branch.id, number: `Table ${i}`, capacity: i<=4?4:6, floor: i<=6?'داخلي':'خارجي', status: i===12?'OCCUPIED':'AVAILABLE' }
    })
    await prisma.qrCode.upsert({
      where: { tableId: table.id },
      update: {},
      create: { tableId: table.id, token: `demo_token_${i}_${Date.now()}`, url: `/r/demo/b/tripoli/t/demo_token_${i}` }
    })
  }

  console.log('✅ Seeding done - LYD 50/120/199 + 30 days FREE TRIAL')
}

main().catch(e=>{console.error(e); process.exit(1)}).finally(()=>prisma.$disconnect())
