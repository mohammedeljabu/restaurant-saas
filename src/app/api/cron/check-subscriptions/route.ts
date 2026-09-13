import { prisma } from '@/lib/prisma'

// Cron يومي - يفحص انتهاء التجارب المجانية والاشتراكات
// يعمل على: /api/cron/check-subscriptions
// Schedule في vercel.json: 0 0 * * * (يومياً منتصف الليل)

export async function GET(req: Request) {
  // تحقق من Cron Secret في الإنتاج
  // const authHeader = req.headers.get('authorization')
  // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) return new Response('Unauthorized', { status: 401 })

  const now = new Date()
  let results = {
    trialsExpired: 0,
    trialsExpiringSoon: 0,
    subscriptionsExpired: 0,
    graceExpired: 0
  }

  // 1. فحص التجارب المجانية التي انتهت
  const expiredTrials = await prisma.subscription.findMany({
    where: {
      status: 'TRIALING',
      trialEndsAt: { lt: now }
    },
    include: { restaurant: true, plan: true }
  })

  for (const sub of expiredTrials) {
    // تحويل التجربة المنتهية إلى PAST_DUE مع مهلة 3 أيام
    const graceUntil = new Date(now.getTime() + 3 * 24 * 3600 * 1000)
    await prisma.subscription.update({
      where: { id: sub.id },
      data: {
        status: 'PAST_DUE',
        graceUntil
      }
    })
    results.trialsExpired++
    
    // هنا يمكن إرسال إيميل تذكير: انتهت فترتك المجانية
    console.log(`Trial expired for restaurant ${sub.restaurant.slug} - plan ${sub.plan.name}`)
  }

  // 2. تنبيه قبل 3 أيام من انتهاء التجربة
  const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 3600 * 1000)
  const expiringSoon = await prisma.subscription.findMany({
    where: {
      status: 'TRIALING',
      trialEndsAt: { gte: now, lt: threeDaysFromNow }
    }
  })
  results.trialsExpiringSoon = expiringSoon.length

  // 3. فحص الاشتراكات المدفوعة المنتهية
  const expiredSubs = await prisma.subscription.findMany({
    where: {
      currentPeriodEnd: { lt: now },
      status: { in: ['ACTIVE', 'TRIALING'] }
    }
  })

  for (const sub of expiredSubs) {
    if (sub.status === 'TRIALING') continue // تم معالجتها أعلاه
    const graceUntil = new Date(now.getTime() + 3 * 24 * 3600 * 1000)
    await prisma.subscription.update({
      where: { id: sub.id },
      data: { status: 'PAST_DUE', graceUntil }
    })
    results.subscriptionsExpired++
  }

  // 4. إيقاف الاشتراكات التي انتهت مهلتها
  const pastGrace = await prisma.subscription.findMany({
    where: {
      graceUntil: { lt: now },
      status: 'PAST_DUE'
    }
  })

  for (const sub of pastGrace) {
    await prisma.subscription.update({
      where: { id: sub.id },
      data: { status: 'EXPIRED' }
    })
    // إيقاف المطعم مؤقتاً
    await prisma.restaurant.update({
      where: { id: sub.restaurantId },
      data: { isActive: false }
    })
    results.graceExpired++
  }

  return Response.json({
    success: true,
    checkedAt: now.toISOString(),
    ...results,
    message: `تم فحص ${expiredTrials.length} تجربة منتهية و ${pastGrace.length} اشتراك منتهي`
  })
}
