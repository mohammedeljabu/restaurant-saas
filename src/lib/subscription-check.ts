// lib/subscription-check.ts - فحص الاشتراك والتجربة المجانية
import { prisma } from './prisma'

export interface SubscriptionCheckResult {
  hasAccess: boolean
  isTrialing: boolean
  isExpired: boolean
  daysLeft: number
  message?: string
  subscription?: any
}

export async function checkSubscriptionAccess(restaurantId: string, requiredFeature?: string): Promise<SubscriptionCheckResult> {
  const subscription = await prisma.subscription.findUnique({
    where: { restaurantId },
    include: { plan: true }
  })

  if (!subscription) {
    return { hasAccess: false, isTrialing: false, isExpired: true, daysLeft: 0, message: 'لا يوجد اشتراك' }
  }

  const now = new Date()
  let daysLeft = 0
  let isTrialing = false

  if (subscription.status === 'TRIALING' && subscription.trialEndsAt) {
    isTrialing = true
    daysLeft = Math.ceil((subscription.trialEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    if (daysLeft < 0) daysLeft = 0
  } else if (subscription.currentPeriodEnd) {
    daysLeft = Math.ceil((subscription.currentPeriodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    if (daysLeft < 0) daysLeft = 0
  }

  // فحص الحالة
  if (subscription.status === 'EXPIRED') {
    return { 
      hasAccess: false, 
      isTrialing: false, 
      isExpired: true, 
      daysLeft: 0, 
      message: 'انتهى اشتراكك. جدد الآن للمتابعة',
      subscription 
    }
  }

  if (subscription.status === 'PAST_DUE') {
    const graceDays = subscription.graceUntil 
      ? Math.ceil((subscription.graceUntil.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      : 0
    
    if (graceDays <= 0) {
      return { hasAccess: false, isTrialing: false, isExpired: true, daysLeft: 0, message: 'انتهت مهلة الدفع', subscription }
    }

    return { 
      hasAccess: true, 
      isTrialing: false, 
      isExpired: false, 
      daysLeft: graceDays, 
      message: `تنبيه: لديك ${graceDays} أيام مهلة للدفع`,
      subscription 
    }
  }

  // فحص الميزة المطلوبة
  if (requiredFeature && subscription.plan) {
    const features = subscription.plan.features as any
    if (features && !features[requiredFeature] && requiredFeature !== 'trial') {
      return {
        hasAccess: false,
        isTrialing,
        isExpired: false,
        daysLeft,
        message: `هذه الميزة غير متوفرة في باقة ${subscription.plan.name}. قم بالترقية`,
        subscription
      }
    }
  }

  return {
    hasAccess: true,
    isTrialing,
    isExpired: false,
    daysLeft,
    message: isTrialing ? `تجربة مجانية - باقي ${daysLeft} يوم` : undefined,
    subscription
  }
}

// للاستخدام في API routes
export function withSubscription(requiredFeature?: string) {
  return (handler: any) => async (req: any, ctx: any) => {
    const restaurantId = ctx.tenantId || req.headers.get('x-restaurant-id')
    if (!restaurantId) return new Response('Restaurant ID required', { status: 400 })
    
    const check = await checkSubscriptionAccess(restaurantId, requiredFeature)
    if (!check.hasAccess) {
      return Response.json({ 
        error: check.message,
        subscriptionStatus: check.subscription?.status,
        daysLeft: check.daysLeft,
        requiresUpgrade: true
      }, { status: 403 })
    }

    // إضافة معلومات الاشتراك للـ request
    (req as any).subscription = check
    return handler(req, ctx)
  }
}
