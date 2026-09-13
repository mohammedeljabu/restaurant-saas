import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// POST /api/restaurants/register - تسجيل مطعم جديد مع شهر مجاني
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { 
      restaurantName, 
      slug, 
      ownerName, 
      email, 
      password, 
      phone,
      planSlug = 'pro' // افتراضياً برو للتجربة
    } = body

    // التحقق من عدم وجود المطعم
    const existing = await prisma.restaurant.findUnique({ where: { slug } })
    if (existing) {
      return Response.json({ error: 'اسم المطعم مستخدم مسبقاً' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return Response.json({ error: 'البريد الإلكتروني مستخدم' }, { status: 400 })
    }

    // إنشاء المستخدم
    const passwordHash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        email,
        name: ownerName,
        passwordHash,
        role: 'RESTAURANT_OWNER',
        phone
      }
    })

    // إنشاء المطعم
    const restaurant = await prisma.restaurant.create({
      data: {
        slug,
        name: restaurantName,
        phone,
        currency: 'LYD',
        taxRate: 5,
        serviceFeeRate: 0,
        ownerId: user.id,
        isActive: true
      }
    })

    // الحصول على الباقة
    const plan = await prisma.subscriptionPlan.findUnique({ where: { slug: planSlug } })
    if (!plan) {
      return Response.json({ error: 'الباقة غير موجودة' }, { status: 400 })
    }

    // إنشاء اشتراك مجاني لمدة شهر كامل - الشهر الأول مجاني
    const now = new Date()
    const trialEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 يوم

    const subscription = await prisma.subscription.create({
      data: {
        restaurantId: restaurant.id,
        planId: plan.id,
        status: 'TRIALING',
        trialEndsAt: trialEnd,
        currentPeriodStart: now,
        currentPeriodEnd: trialEnd,
      }
    })

    // إنشاء فرع افتراضي
    const branch = await prisma.branch.create({
      data: {
        restaurantId: restaurant.id,
        slug: 'main',
        name: 'الفرع الرئيسي',
        isActive: true
      }
    })

    // إنشاء 5 طاولات افتراضية مع QR
    for (let i = 1; i <= 5; i++) {
      const table = await prisma.table.create({
        data: {
          branchId: branch.id,
          number: `Table ${i}`,
          capacity: 4,
          status: 'AVAILABLE'
        }
      })
      const token = `tbl_${restaurant.id}_${branch.id}_${i}_${Date.now()}`
      await prisma.qrCode.create({
        data: {
          tableId: table.id,
          token,
          url: `/r/${slug}/b/main/t/${token}`
        }
      })
    }

    return Response.json({
      success: true,
      message: 'تم التسجيل بنجاح - شهر مجاني كامل!',
      restaurant: {
        id: restaurant.id,
        slug: restaurant.slug,
        name: restaurant.name
      },
      subscription: {
        status: subscription.status,
        trialEndsAt: subscription.trialEndsAt,
        trialDays: 30,
        plan: plan.name,
        priceAfterTrial: `${plan.priceMonthly} د.ل/شهر`
      },
      login: {
        email: user.email,
        dashboardUrl: `/dashboard/${slug}`
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Registration error:', error)
    return Response.json({ error: 'حدث خطأ في التسجيل' }, { status: 500 })
  }
}
