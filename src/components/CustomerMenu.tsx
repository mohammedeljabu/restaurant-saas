'use client'
import { useState } from 'react'
// Mobile First - سريع جداً
export default function CustomerMenu({ restaurant, categories, table }: any) {
  const [cart, setCart] = useState<any[]>([])
  const addToCart = (item: any) => setCart([...cart, { ...item, qty: 1 }])
  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold">{restaurant.name}</h1>
        <p className="text-sm text-gray-500">طاولة {table.number} • {restaurant.currency}</p>
      </div>
      {categories.map((cat: any) => (
        <div key={cat.id} className="p-4">
          <h2 className="font-bold mb-2">{cat.nameAr || cat.name}</h2>
          <div className="grid gap-3">
            {cat.items.map((item: any) => (
              <div key={item.id} className="flex gap-3 border rounded-xl p-3">
                <img src={item.imageUrl || '/placeholder.png'} className="w-20 h-20 rounded-lg object-cover" />
                <div className="flex-1">
                  <div className="font-semibold">{item.nameAr || item.name}</div>
                  <div className="text-sm text-gray-500 line-clamp-2">{item.descriptionAr}</div>
                  <div className="flex justify-between mt-2">
                    <span className="font-bold">{item.price} {restaurant.currency}</span>
                    <button onClick={() => addToCart(item)} className="bg-black text-white px-3 py-1 rounded-full text-sm">إضافة</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-black text-white p-4 max-w-md mx-auto rounded-t-2xl">
          <div className="flex justify-between"><span>السلة ({cart.length})</span><span>{cart.reduce((s,i)=>s+i.price,0)} {restaurant.currency}</span></div>
          <button className="w-full mt-3 bg-white text-black py-3 rounded-xl font-bold">تأكيد الطلب</button>
        </div>
      )}
    </div>
  )
}
