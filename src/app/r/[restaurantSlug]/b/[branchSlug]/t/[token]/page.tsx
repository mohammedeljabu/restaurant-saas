import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function CustomerMenuPage({ params }: { params: { restaurantSlug: string, branchSlug: string, token: string } }) {
  const { restaurantSlug, branchSlug, token } = params

  // جلب المطعم والفرع والطاولة
  const restaurant = await prisma.restaurant.findUnique({ where: { slug: restaurantSlug } })
  if (!restaurant) return <div className="p-8">المطعم غير موجود</div>

  const branch = await prisma.branch.findFirst({ where: { restaurantId: restaurant.id, slug: branchSlug } })
  const qr = await prisma.qrCode.findUnique({ where: { token }, include: { table: true } })

  const categories = await prisma.menuCategory.findMany({
    where: { restaurantId: restaurant.id, isActive: true },
    include: { items: { where: { isAvailable: true } } },
    orderBy: { sortOrder: 'asc' }
  })

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      <div className="sticky top-0 bg-white border-b p-4 z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-black">{restaurant.name[0]}</div>
          <div>
            <h1 className="font-bold">{restaurant.name}</h1>
            <p className="text-xs text-gray-500">{branch?.name} • {qr?.table.number || 'طاولة'} • {restaurant.currency}</p>
          </div>
        </div>
      </div>

      <div className="p-3 flex gap-2 overflow-auto">
        {categories.map(c => (
          <span key={c.id} className="px-4 py-2 bg-black text-white rounded-full text-sm whitespace-nowrap">{c.nameAr || c.name}</span>
        ))}
      </div>

      <div className="p-4 space-y-6">
        {categories.map(cat => (
          <div key={cat.id}>
            <h2 className="font-bold mb-3">{cat.nameAr}</h2>
            <div className="grid gap-3">
              {cat.items.map((item: any) => (
                <div key={item.id} className="flex gap-3 border rounded-2xl p-3">
                  <img src={item.imageUrl || 'https://via.placeholder.com/100'} className="w-20 h-20 rounded-xl object-cover" alt="" />
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{item.nameAr || item.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{item.descriptionAr}</div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-bold">{item.price} {restaurant.currency}</span>
                      <button className="bg-black text-white px-4 py-1.5 rounded-full text-xs">إضافة</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto">
        <div className="bg-black text-white rounded-2xl p-4 flex justify-between items-center">
          <div><div className="text-sm opacity-70">السلة</div><div className="font-bold">2 صنف • 57 LYD</div></div>
          <Link href="#" className="bg-white text-black px-5 py-2 rounded-full font-bold text-sm">عرض السلة</Link>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          <button className="bg-gray-100 rounded-full py-2 text-xs">🔔 استدعاء نادل</button>
          <button className="bg-gray-100 rounded-full py-2 text-xs">💧 ماء</button>
          <button className="bg-gray-100 rounded-full py-2 text-xs">🧾 الحساب</button>
        </div>
      </div>
    </div>
  )
}
