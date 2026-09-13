import Link from "next/link";
export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="font-black text-xl">Restaurant SaaS</div>
          <div className="flex gap-3">
            <Link href="/super" className="px-4 py-2 border rounded-full text-sm">Super Admin</Link>
            <Link href="/dashboard/demo" className="px-4 py-2 bg-black text-white rounded-full text-sm">لوحة المطعم</Link>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-black leading-[1.1]">منصة مطاعم<br/>SaaS متعددة<br/><span className="text-orange-500">بـ QR Code</span></h1>
            <p className="mt-6 text-lg text-gray-600">أضف عدد غير محدود من المطاعم، كل مطعم له اشتراك ولوحة تحكم و QR ديناميكي. الزبون يمسح ويطلب بدون تطبيق.</p>
            <div className="mt-8 flex gap-3">
              <Link href="/r/demo/b/tripoli/t/demo123" className="px-6 py-3 bg-black text-white rounded-full font-bold">جرب منيو الزبون</Link>
              <Link href="/super" className="px-6 py-3 border rounded-full font-bold">شاهد Super Admin</Link>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-gray-50 rounded-2xl"><div className="text-2xl font-black">100%</div><div className="text-xs text-gray-500">عزل بيانات</div></div>
              <div className="p-4 bg-gray-50 rounded-2xl"><div className="text-2xl font-black">Real-Time</div><div className="text-xs text-gray-500">طلبات فورية</div></div>
              <div className="p-4 bg-gray-50 rounded-2xl"><div className="text-2xl font-black">PWA</div><div className="text-xs text-gray-500">بدون تطبيق</div></div>
            </div>
          </div>
          <div className="bg-gray-900 rounded-[2rem] p-6 text-white">
            <div className="text-sm text-gray-400 mb-4">✓ جاهز للنشر على Vercel + Neon</div>
            <pre className="text-xs bg-black/50 p-4 rounded-xl overflow-auto">
{`// 1. إنشاء DB في Vercel Marketplace -> Neon
// 2. ربط المشروع
// 3. Deploy
DATABASE_URL=postgresql://...
NEXT_PUBLIC_APP_URL=https://...

Features:
✓ Multi-Tenant عزل صارم
✓ QR Dynamic Token
✓ Table Sessions
✓ KDS, POS, Waiter
✓ Subscriptions + Trial
✓ Real-Time (Pusher-ready)
`}
            </pre>
          </div>
        </div>
      </main>
    </div>
  )
}
