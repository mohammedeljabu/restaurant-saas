
# Restaurant SaaS - System Architecture

## 1. نظرة عامة
منصة SaaS Multi-Tenant حقيقية مبنية على:
- Frontend: Next.js 14 App Router + Tailwind + shadcn/ui + PWA
- Backend: Next.js API Routes + Prisma + PostgreSQL
- Real-Time: Socket.io (rooms per restaurant/branch/table)
- Auth: Auth.js (NextAuth v5) + RBAC + JWT
- Storage: S3 Compatible
- QR: Dynamic Token-based

## 2. Multi-Tenant Architecture - عزل صارم
### استراتيجية العزل:
- Shared Database, Shared Schema, Discriminator Column (restaurantId)
- كل query تمر عبر middleware يضيف WHERE restaurantId = currentTenant
- Row Level Security في Postgres مستقبلاً
- Subdomain أو Path: r/[restaurantSlug] - يدعم custom domains لاحقاً

### Tenant Resolution Flow:
Request -> middleware.ts يقرأ slug/subdomain -> يبحث عن restaurant -> يضع restaurantId في header x-tenant-id -> كل API يتحقق
- لا يمكن لأي API الوصول بدون tenant context
- Super Admin يتجاوز العزل عبر role check

## 3. Roles & RBAC
SUPER_ADMIN: كل شيء
RESTAURANT_OWNER: كل شيء داخل مطعمه + الفروع + الاشتراك
MANAGER: إدارة يومية فرع محدد
CASHIER: POS + Orders + Payments
WAITER: Tables + Orders + Assistance
KITCHEN: KDS فقط (قراءة وتحديث حالة الطبخ)
CUSTOMER: لا حساب، فقط token للطلب

Middleware: withAuth(roles[]) + withTenant() + withSubscription(feature)

## 4. Subscription Architecture
SubscriptionPlan { features: Json } مثال: { "kds": true, "inventory": false, "maxBranches": 2 }
Subscription { status: ACTIVE, TRIALING, PAST_DUE, CANCELED, EXPIRED }
Cron يومي: يفحص انتهاء الاشتراكات -> يضع gracePeriod 3 أيام -> بعدها يوقف الميزات حسب Plan
Middleware يمنع الوصول للميزة إذا غير موجودة في الخطة

## 5. QR Dynamic Design
QrCode { token: uuid v4 مستقر, tableId, restaurantId, branchId }
URL: /r/{restaurantSlug}/b/{branchSlug}/t/{token}
الميزة: لو غيرت رقم الطاولة من 12 إلى 15، نفس token يبقى، لا حاجة لإعادة طباعة
QR يحتوي على logo المطعم مركزياً
توليد: qrcode library + sharp لدمج الشعار

## 6. Table Sessions - الطلبات المتعددة
TableSession { id, tableId, status: OPEN/CLOSED, openedAt, closedAt }
عند أول طلب على طاولة AVAILABLE -> تنشأ Session + حالة الطاولة OCCUPIED
كل عميل يمسح نفس QR يضاف طلبه لنفس Session المفتوحة
الكاشير يرى إجمالي Session
عند الدفع -> إغلاق Session -> الطاولة WAITING_PAYMENT ثم AVAILABLE

## 7. Real-Time Architecture
Socket.io Rooms:
- restaurant:{restaurantId} -> كل موظفي المطعم
- branch:{branchId} -> موظفو الفرع
- kitchen:{branchId}
- table:{tableId}
- waiter:{branchId}

Flow:
Customer -> POST /api/orders -> DB -> io.to(kitchen:branch).emit('order:new') + صوت + visual
Kitchen -> PATCH status READY -> io.to(waiter:branch).emit('order:ready')
Customer -> POST /assistance -> io.to(waiter:branch).emit('table:assistance')

## 8. Order Flow
NEW -> CONFIRMED (كاشير) -> PREPARING (مطبخ) -> READY -> SERVED (نادل) -> COMPLETED -> CLOSED
كل تغيير يسجل في OrderStatusHistory { orderId, from, to, byUserId, at }

## 9. API Architecture
/api/auth/* - تسجيل دخول
/api/super/* - Super Admin فقط
/api/restaurants - CRUD مطاعم
/api/[restaurantSlug]/branches
/api/[restaurantSlug]/menu/categories, items, modifiers
/api/[restaurantSlug]/tables + qr
/api/[restaurantSlug]/orders - Real-time
/api/[restaurantSlug]/kds
/api/[restaurantSlug]/pos
/api/public/menu?token= - للزبون بدون auth
/api/public/order - إنشاء طلب زبون

## 10. Security
- Password hashing: bcrypt
- JWT httpOnly cookie
- CSRF, Rate Limiting (Upstash), Zod validation
- AuditLogs لكل فعل حساس

## 11. Folder Structure
/app
  /(public)/r/[slug]/[branch]/t/[token] - واجهة الزبون
  /(dashboard)/dashboard/[restaurantSlug] - لوحة المطعم
  /super - Super Admin
  /api
/components/ui - shadcn
/lib - prisma, auth, rbac, socket, qr
/prisma/schema.prisma
