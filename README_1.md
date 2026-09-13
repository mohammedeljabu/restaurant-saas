# Restaurant SaaS - منصة إدارة مطاعم SaaS متعددة ب QR Code 🇱🇾

منصة SaaS احترافية متعددة المطاعم - Multi-Tenant حقيقية - جاهزة للنشر على Vercel + Neon Postgres

## ✨ المميزات

- **Multi-Tenant حقيقي**: عزل بيانات كامل لكل مطعم
- **QR ديناميكي**: Token ثابت لا يحتاج إعادة طباعة
- **Real-Time**: طلبات فورية للمطبخ والكاشير والنادل
- **Table Sessions**: طلبات متعددة على نفس الطاولة
- **PWA**: الزبون لا يحتاج تطبيق
- **Landing Page احترافية**: شهر مجاني + Countdown

## 💰 التسعير بالدينار الليبي

| الباقة | شهري | سنوي | التجربة |
|--------|------|------|---------|
| Basic | 50 د.ل | 500 د.ل | 30 يوم مجاني |
| Pro (الأكثر مبيعاً) | 120 د.ل | 1200 د.ل | 30 يوم مجاني |
| Enterprise | 199 د.ل | 1990 د.ل | 30 يوم مجاني |

**بدون بطاقة دفع للتجربة!**

## 🚀 النشر السريع

### 1. GitHub
```bash
git init
git add .
git commit -m "Restaurant SaaS - LYD + Free Trial"
git remote add origin https://github.com/YOUR_USERNAME/restaurant-saas.git
git push -u origin main
```

### 2. Neon Postgres
- Vercel Dashboard > Storage > Create Neon
- أو neon.tech > Create Project
- انسخ DATABASE_URL

### 3. Vercel
- vercel.com > Add New Project > Import من GitHub
- أضف Env Variables:
```
DATABASE_URL=postgresql://...
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=openssl rand -base64 32
NEXTAUTH_URL=https://your-app.vercel.app
```
- Deploy

### 4. Seed
```bash
DATABASE_URL="..." npx tsx prisma/seed.ts
```

## 📱 الروابط بعد النشر

- `/` - Landing Page مع شهر مجاني
- `/super` - Super Admin (admin@platform.com / admin123)
- `/dashboard/demo` - لوحة مطعم ديمو
- `/r/demo/b/tripoli/t/demo_token_1` - منيو زبون

## 🛠 التقنيات

- Next.js 14 App Router
- Prisma + PostgreSQL (Neon)
- Tailwind CSS
- QR Code + Socket.io (Pusher-ready for Vercel)
- RBAC + Multi-Tenant

## 📄 الملفات المهمة

- `prisma/schema.prisma` - قاعدة البيانات
- `prisma/seed.ts` - باقات 50/120/199 + تجربة مجانية
- `src/app/page.tsx` - Landing Page
- `src/app/api/restaurants/register` - تسجيل مع شهر مجاني
- `vercel.json` - Cron يومي للاشتراكات

## 📖 دليل كامل

راجع `DEPLOY_GUIDE.md` للتفاصيل الكاملة

---

صنع بـ ❤️ للسوق الليبي - LYD 🇱🇾
