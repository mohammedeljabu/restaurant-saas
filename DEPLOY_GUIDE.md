# دليل النشر الكامل - GitHub + Vercel + Neon

## الخطوة 1: GitHub

### إنشاء مستودع
```bash
# في مجلد المشروع
cd /mnt/data/restaurant-saas

git init
git add .
git commit -m "Restaurant SaaS - LYD 50/120/199 + 30 days free trial + Landing Page"

# أنشئ مستودع جديد على github.com/New ثم
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/restaurant-saas.git
git push -u origin main
```

### ملفات مهمة تم تضمينها:
- package.json مع vercel-build
- vercel.json مع cron يومي
- prisma/schema.prisma PostgreSQL
- src/app/page.tsx Landing Page شهر مجاني + Countdown
- src/app/api/restaurants/register - تسجيل مع شهر مجاني

## الخطوة 2: Neon Postgres (قاعدة البيانات)

### الطريقة A - من Vercel (الأسهل):
1. افتح Vercel Dashboard > Storage > Create Database > Neon
2. اختر اسم: restaurant-saas-db
3. انسخ DATABASE_URL

### الطريقة B - من Neon مباشرة:
1. neon.tech > Sign Up > Create Project
2. Region: EU (Frankfurt) - أقرب لليبيا
3. انسخ Connection String

يجب أن يكون شكله:
```
postgresql://user:pass@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

## الخطوة 3: Vercel Deployment

1. vercel.com > Add New Project > Import من GitHub
2. اختر restaurant-saas
3. Framework: Next.js (يكتشف تلقائياً)
4. Environment Variables - أضف:

```
DATABASE_URL=postgresql://... (من Neon)
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app (سيظهر بعد أول deploy)
NEXTAUTH_SECRET= (شغل: openssl rand -base64 32)
NEXTAUTH_URL=https://your-app.vercel.app
```

5. اضغط Deploy - سيستغرق 2-3 دقائق

### ما يحدث تلقائياً في Build:
```
postinstall: prisma generate
vercel-build: prisma generate && prisma db push --accept-data-loss && next build
```
- ينشئ Prisma Client
- يدفع schema إلى Neon
- يبني Next.js

## الخطوة 4: Seed البيانات (أول مرة فقط)

بعد أول Deploy ناجح:

### من الطرفية المحلية:
```bash
DATABASE_URL="postgresql://..." npx tsx prisma/seed.ts
```

### أو من Vercel CLI:
```bash
vercel env pull .env.local
npx tsx prisma/seed.ts
```

سيتم إنشاء:
- 3 باقات: Basic 50 د.ل, Pro 120 د.ل, Enterprise 199 د.ل - كلها شهر مجاني
- Super Admin: admin@platform.com / admin123
- مطعم ديمو: demo - Pro - TRIALING 30 يوم
- 12 طاولة + QR

## الخطوة 5: تجربة المنصة

افتح:
- الرئيسية (Landing): https://your-app.vercel.app
- Super Admin: /super
- لوحة مطعم: /dashboard/demo
- منيو زبون: /r/demo/b/tripoli/t/demo_token_1
- تسجيل جديد: اضغط "ابدأ مجاناً" في الصفحة الرئيسية

## الخطوة 6: الإعدادات بعد النشر

### تحديث NEXT_PUBLIC_APP_URL
بعد أول Deploy، Vercel يعطيك رابط مثل https://restaurant-saas-xxx.vercel.app
اذهب Settings > Environment Variables > عدل NEXT_PUBLIC_APP_URL إلى الرابط الحقيقي > Redeploy

### Custom Domain (اختياري)
Settings > Domains > Add Domain > restaurant.ly
أضف في DNS: CNAME -> cname.vercel-dns.com

### Cron Jobs
vercel.json يحتوي:
```json
"crons": [{ "path": "/api/cron/check-subscriptions", "schedule": "0 0 * * *" }]
```
يفحص يومياً:
- تجارب انتهت -> PAST_DUE + 3 أيام مهلة
- اشتراكات منتهية -> EXPIRED

## التسعير النهائي:

| الباقة | شهري | سنوي | التجربة |
|--------|------|------|---------|
| Basic | 50 د.ل | 500 د.ل | 30 يوم مجاني |
| Pro | 120 د.ل | 1200 د.ل | 30 يوم مجاني |
| Enterprise | 199 د.ل | 1990 د.ل | 30 يوم مجاني |

بدون بطاقة دفع للتجربة.

## المشاكل الشائعة:

1. **Build fails: Can't reach database**
   - تأكد DATABASE_URL يحتوي ?sslmode=require

2. **Prisma error**
   - تأكد vercel-build في package.json

3. **Landing page لا تظهر**
   - تأكد src/app/page.tsx موجود

4. **Seed fails**
   - شغل محلياً مع نفس DATABASE_URL

## التالي:

- إضافة Pusher للـ Real-Time (بدل Socket.io على Vercel)
- إضافة بوابة دفع ليبية (معاملات، سداد)
- إضافة Custom Domains لكل مطعم

