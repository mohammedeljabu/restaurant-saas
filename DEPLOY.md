# نشر على Vercel - خطوة بخطوة

## الطريقة السريعة (5 دقائق)

### 1. قاعدة البيانات - Neon Postgres (مجاني)
- ادخل Vercel Dashboard > Storage > Create Database > Neon Postgres
- أو اذهب neon.tech وأنشئ مشروع مجاني
- انسخ DATABASE_URL

### 2. رفع المشروع
```bash
# على GitHub
git init
git add .
git commit -m "Restaurant SaaS MVP"
git remote add origin https://github.com/yourname/restaurant-saas
git push -u origin main
```

### 3. ربط Vercel
- vercel.com > Add New Project > Import من GitHub
- Vercel سيكتشف Next.js تلقائياً
- في Environment Variables أضف:
```
DATABASE_URL=postgresql://... (من Neon)
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
NEXTAUTH_SECRET=openssl rand -base64 32
NEXTAUTH_URL=https://your-project.vercel.app
```
- Deploy

### 4. بعد أول Deploy
Vercel سيقوم تلقائياً بـ:
- prisma generate
- prisma db push
- next build

ثم شغل Seed:
في Vercel Dashboard > Settings > Functions > Run:
`npx tsx prisma/seed.ts`
أو محلياً:
```
DATABASE_URL=... npx tsx prisma/seed.ts
```

### 5. جرب المنصة
- الصفحة الرئيسية: https://your-app.vercel.app
- Super Admin: /super (admin@platform.com / admin123)
- لوحة مطعم: /dashboard/demo
- منيو زبون: /r/demo/b/tripoli/t/demo_token_1

## Real-Time على Vercel

Socket.io لا يعمل مباشرة على Serverless Functions.

الحلول الجاهزة في الكود:

**الخيار A (موصى به للـ MVP): Polling**
في `src/app/dashboard/[slug]/kds/page.tsx` الكود يعمل Poll كل 3 ثواني:
```ts
setInterval(() => fetch('/api/orders?branchId=...'), 3000)
```
يعمل فوراً على Vercel بدون إعداد.

**الخيار B (Production): Pusher**
1. أنشئ حساب pusher.com (مجاني)
2. أضف Keys في .env:
```
PUSHER_APP_ID=
PUSHER_KEY=
NEXT_PUBLIC_PUSHER_KEY=
PUSHER_SECRET=
PUSHER_CLUSTER=eu
```
3. الكود جاهز في `src/lib/pusher.ts` (سأضيفه لك عند الطلب)

## Custom Domains
لكل مطعم:
- في Restaurant settings > Custom Domain: restaurant.com
- في Vercel > Domains > Add restaurant.com
- في DNS أضف CNAME إلى cname.vercel-dns.com
- Middleware سيحلله تلقائياً إلى slug

## الملفات المهمة للنشر
- vercel.json: يحدد buildCommand و Cron لفحص الاشتراكات يومياً
- next.config.mjs: يسمح بـ remote images
- middleware.ts: يحلل slug المطعم من /r/[slug]
- prisma/schema.prisma: يدعم PostgreSQL فقط (جاهز لـ Neon)
- package.json postinstall: prisma generate تلقائي

## التكلفة المتوقعة
- Vercel Hobby: مجاني
- Neon Postgres: مجاني حتى 3GB
- يكفي لـ 100 مطعم MVP بسهولة
- للـ Scale: Vercel Pro $20 + Neon Scale $19

## الدعم
إذا واجهت خطأ في Build:
- تأكد DATABASE_URL يحتوي ?sslmode=require
- تأكد NEXT_PUBLIC_APP_URL بدون / في النهاية
