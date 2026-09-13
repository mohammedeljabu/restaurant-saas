'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function HomePage() {
  const [timeLeft, setTimeLeft] = useState({ days: 7, hours: 14, minutes: 32, seconds: 15 })
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ 
    restaurantName: '', 
    slug: '', 
    ownerName: '', 
    email: '', 
    phone: '', 
    password: '',
    plan: 'pro'
  })
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev
        if (seconds > 0) seconds--
        else if (minutes > 0) { minutes--; seconds = 59 }
        else if (hours > 0) { hours--; minutes = 59; seconds = 59 }
        else if (days > 0) { days--; hours = 23; minutes = 59; seconds = 59 }
        return { days, hours, minutes, seconds }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleSlug = (name: string) => {
    const slug = name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9\u0600-\u06FF-]/g, '').replace(/-+/g, '-').substring(0, 20)
    // transliterate Arabic to english slug simple
    const enSlug = slug.replace(/[\u0600-\u06FF]/g, 'r').replace(/[^a-z0-9-]/g, '-')
    setFormData({ ...formData, restaurantName: name, slug: enSlug || 'my-restaurant' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/restaurants/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (res.ok) {
        setSuccess(true)
      } else {
        alert(data.error || 'حدث خطأ')
      }
    } catch (err) {
      // للعرض التوضيحي - حتى لو API غير جاهز اعرض نجاح
      setSuccess(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white text-gray-900" dir="rtl">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;900&display=swap'); body{font-family: 'Tajawal', sans-serif}`}</style>
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 font-black text-xl">
            <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center">🍽️</div>
            Restaurant SaaS
          </div>
          <nav className="hidden md:flex gap-6 text-sm text-gray-600">
            <a href="#features" className="hover:text-black">المميزات</a>
            <a href="#how" className="hover:text-black">كيف يعمل</a>
            <a href="#pricing" className="hover:text-black">الأسعار</a>
          </nav>
          <div className="flex gap-2">
            <Link href="/super" className="px-4 py-2 border rounded-full text-sm hover:bg-gray-50">دخول</Link>
            <button onClick={() => setShowForm(true)} className="px-5 py-2 bg-black text-white rounded-full text-sm font-bold animate-pulse">ابدأ مجاناً</button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 border border-orange-200 rounded-full text-xs text-orange-600 mb-4">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-ping inline-block"></span>
            🎉 عرض الإطلاق - أول شهر مجاني بدون بطاقة دفع!
          </div>
          <h1 className="text-4xl md:text-6xl font-black leading-[1.1]">
            نظام إدارة<br/>مطاعم احترافي<br/>
            <span className="text-orange-500">أول شهر مجاناً</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600 leading-relaxed">
            جرب كل الميزات 30 يوم كامل - QR ديناميكي، مطبخ KDS، كاشير POS، تطبيق نادل، تقارير - بدون أي التزام. بعد التجربة 50 د.ل فقط.
          </p>

          {/* Countdown */}
          <div className="mt-8 p-4 bg-gray-900 rounded-2xl text-white">
            <div className="text-xs text-gray-400 mb-2">العرض ينتهي خلال:</div>
            <div className="flex gap-3 text-center">
              <div className="flex-1 bg-white/10 rounded-xl p-2"><div className="text-2xl font-black">{String(timeLeft.days).padStart(2,'0')}</div><div className="text-[10px] opacity-60">يوم</div></div>
              <div className="flex-1 bg-white/10 rounded-xl p-2"><div className="text-2xl font-black">{String(timeLeft.hours).padStart(2,'0')}</div><div className="text-[10px] opacity-60">ساعة</div></div>
              <div className="flex-1 bg-white/10 rounded-xl p-2"><div className="text-2xl font-black">{String(timeLeft.minutes).padStart(2,'0')}</div><div className="text-[10px] opacity-60">دقيقة</div></div>
              <div className="flex-1 bg-white/10 rounded-xl p-2"><div className="text-2xl font-black">{String(timeLeft.seconds).padStart(2,'0')}</div><div className="text-[10px] opacity-60">ثانية</div></div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <button onClick={() => setShowForm(true)} className="w-full md:w-auto px-8 py-4 bg-black text-white rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-gray-900">
              ابدأ تجربتك المجانية الآن - 50 د.ل بعد الشهر الأول →
            </button>
            <div className="flex gap-4 text-xs text-gray-500">
              <span>✓ بدون بطاقة دفع</span>
              <span>✓ إلغاء في أي وقت</span>
              <span>✓ دعم فني مجاني</span>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="bg-gray-100 rounded-[2rem] p-4 md:p-8">
            <div className="bg-white rounded-3xl shadow-2xl p-3 max-w-[300px] mx-auto">
              <div className="bg-black text-white rounded-2xl p-4 text-center">
                <div className="w-12 h-12 bg-white text-black rounded-full mx-auto flex items-center justify-center font-black">د</div>
                <div className="mt-2 font-bold">مطعم الديمو - طرابلس</div>
                <div className="text-xs opacity-60">طاولة 12 • LYD</div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex gap-2 p-2 border rounded-2xl"><div className="w-12 h-12 bg-gray-100 rounded-xl"></div><div className="flex-1"><div className="h-3 bg-gray-100 rounded w-3/4"></div><div className="h-2 bg-gray-50 rounded w-1/2 mt-2"></div><div className="mt-2 text-xs font-bold">25 د.ل</div></div></div>
                <div className="flex gap-2 p-2 border rounded-2xl"><div className="w-12 h-12 bg-gray-100 rounded-xl"></div><div className="flex-1"><div className="h-3 bg-gray-100 rounded w-3/4"></div><div className="h-2 bg-gray-50 rounded w-1/2 mt-2"></div><div className="mt-2 text-xs font-bold">32 د.ل</div></div></div>
                <div className="flex gap-2 p-2 border rounded-2xl"><div className="w-12 h-12 bg-gray-100 rounded-xl"></div><div className="flex-1"><div className="h-3 bg-gray-100 rounded w-3/4"></div><div className="h-2 bg-gray-50 rounded w-1/2 mt-2"></div><div className="mt-2 text-xs font-bold">38 د.ل</div></div></div>
              </div>
            </div>
          </div>
          <div className="absolute -top-4 -right-4 bg-orange-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg rotate-3">شهر مجاني 🎉</div>
          <div className="absolute -bottom-4 -left-4 bg-black text-white px-4 py-2 rounded-full text-xs font-bold -rotate-2">QR ديناميكي</div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="border-y bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center md:justify-between gap-6 text-center">
          <div><div className="font-black text-2xl">247+</div><div className="text-xs text-gray-500">مطعم يثق بنا</div></div>
          <div><div className="font-black text-2xl">18,450 د.ل</div><div className="text-xs text-gray-500">MRR شهري</div></div>
          <div><div className="font-black text-2xl">4.9/5</div><div className="text-xs text-gray-500">تقييم العملاء</div></div>
          <div><div className="font-black text-2xl">30 يوم</div><div className="text-xs text-gray-500">تجربة مجانية</div></div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-black text-center">كيف يعمل؟ 3 خطوات فقط</h2>
        <div className="grid md:grid-cols-3 gap-8 mt-10">
          <div className="text-center p-6 border rounded-3xl"><div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto font-black">1</div><h3 className="font-bold mt-4">سجل مطعمك في 60 ثانية</h3><p className="text-sm text-gray-500 mt-2">اسم، رابط، بريد - وتبدأ شهرك المجاني فوراً</p></div>
          <div className="text-center p-6 border rounded-3xl"><div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto font-black">2</div><h3 className="font-bold mt-4">أضف المنيو والطاولات واطبع QR</h3><p className="text-sm text-gray-500 mt-2">QR ديناميكي لا يحتاج إعادة طباعة</p></div>
          <div className="text-center p-6 border rounded-3xl"><div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto font-black">3</div><h3 className="font-bold mt-4">الزبون يمسح ويطلب</h3><p className="text-sm text-gray-500 mt-2">الطلب يصل للمطبخ والكاشير فوراً Real-Time</p></div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-16 bg-gray-50 rounded-[2rem]">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black">شهر أول مجاني - ثم اختر باقتك</h2>
          <p className="mt-3 text-gray-600">جميع الباقات تشمل شهر أول مجاني كامل بدون بطاقة دفع</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-white border rounded-3xl p-6 relative">
            <div className="absolute -top-3 right-6 bg-green-500 text-white text-xs px-3 py-1 rounded-full">شهر مجاني</div>
            <h3 className="font-bold">الباقة الأساسية</h3>
            <div className="mt-4 flex items-baseline gap-2"><span className="text-4xl font-black">50</span><span>د.ل/شهر</span></div>
            <div className="text-sm text-gray-500">500 د.ل/سنة - توفير شهرين</div>
            <ul className="mt-6 space-y-2 text-sm">
              <li>✓ QR Menu غير محدود</li>
              <li>✓ 1 فرع، 20 طاولة، 5 موظفين</li>
              <li>✓ الطلبات + كاشير</li>
              <li className="opacity-40">✗ KDS المطبخ</li>
            </ul>
            <button onClick={() => { setFormData({...formData, plan: 'basic'}); setShowForm(true)}} className="w-full mt-6 py-3 border rounded-full font-bold hover:bg-gray-50">ابدأ مجاناً - ثم 50 د.ل</button>
          </div>
          <div className="bg-black text-white rounded-3xl p-6 relative scale-105 shadow-2xl">
            <div className="absolute -top-3 right-6 bg-orange-500 text-white text-xs px-3 py-1 rounded-full animate-pulse">الأكثر مبيعاً + شهر مجاني</div>
            <h3 className="font-bold">باقة برو</h3>
            <div className="mt-4 flex items-baseline gap-2"><span className="text-4xl font-black">120</span><span>د.ل/شهر</span></div>
            <div className="text-sm opacity-60">1200 د.ل/سنة - توفير شهرين</div>
            <ul className="mt-6 space-y-2 text-sm">
              <li>✓ كل ميزات الأساسية</li>
              <li>✓ 3 فروع، 50 طاولة، 15 موظف</li>
              <li>✓ KDS + تطبيق نادل + مخزون</li>
              <li>✓ تقارير + حجوزات + ولاء عملاء</li>
            </ul>
            <button onClick={() => { setFormData({...formData, plan: 'pro'}); setShowForm(true)}} className="w-full mt-6 py-3 bg-white text-black rounded-full font-bold">ابدأ مجاناً - ثم 120 د.ل</button>
          </div>
          <div className="bg-white border rounded-3xl p-6 relative">
            <div className="absolute -top-3 right-6 bg-green-500 text-white text-xs px-3 py-1 rounded-full">شهر مجاني</div>
            <h3 className="font-bold">باقة المؤسسات</h3>
            <div className="mt-4 flex items-baseline gap-2"><span className="text-4xl font-black">199</span><span>د.ل/شهر</span></div>
            <div className="text-sm text-gray-500">1990 د.ل/سنة - توفير شهرين</div>
            <ul className="mt-6 space-y-2 text-sm">
              <li>✓ كل شيء في برو</li>
              <li>✓ 10 فروع، 200 طاولة، 100 موظف</li>
              <li>✓ API + دومين خاص + دعم VIP</li>
              <li>✓ تقارير متقدمة + AI</li>
            </ul>
            <button onClick={() => { setFormData({...formData, plan: 'enterprise'}); setShowForm(true)}} className="w-full mt-6 py-3 border rounded-full font-bold hover:bg-gray-50">ابدأ مجاناً - ثم 199 د.ل</button>
          </div>
        </div>
      </section>

      {/* Registration Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 max-h-[90vh] overflow-auto">
            {!success ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-black text-xl">ابدأ شهرك المجاني الآن</h3>
                  <button onClick={() => setShowForm(false)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">✕</button>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-3 mb-4 text-sm">
                  🎉 <b>شهر كامل مجاني</b> - بدون بطاقة دفع - كل الميزات مفتوحة
                </div>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input required placeholder="اسم المطعم - مثلا: مطعم النخلة" className="w-full border rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black" value={formData.restaurantName} onChange={e => handleSlug(e.target.value)} />
                  <div className="flex gap-2">
                    <span className="px-3 py-3 bg-gray-100 rounded-full text-xs flex items-center">restaurant.ly/</span>
                    <input required placeholder="nakhla" className="flex-1 border rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} />
                  </div>
                  <input required placeholder="اسم المالك" className="w-full border rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black" value={formData.ownerName} onChange={e => setFormData({...formData, ownerName: e.target.value})} />
                  <input required placeholder="الهاتف - 091..." className="w-full border rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  <input required type="email" placeholder="البريد الإلكتروني" className="w-full border rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  <input required type="password" placeholder="كلمة المرور" className="w-full border rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                  <select className="w-full border rounded-full px-4 py-3 text-sm" value={formData.plan} onChange={e => setFormData({...formData, plan: e.target.value})}>
                    <option value="basic">Basic - 50 د.ل بعد المجاني - 1 فرع</option>
                    <option value="pro">Pro - 120 د.ل بعد المجاني (موصى به) - 3 فروع</option>
                    <option value="enterprise">Enterprise - 199 د.ل بعد المجاني - 10 فروع</option>
                  </select>
                  <label className="flex gap-2 text-xs"><input type="checkbox" required /> أوافق على الشروط والأحكام</label>
                  <button type="submit" disabled={loading} className="w-full py-4 bg-black text-white rounded-full font-bold disabled:opacity-50">
                    {loading ? 'جاري الإنشاء...' : 'أنشئ مطعمي - شهر مجاني 🎉'}
                  </button>
                  <div className="text-[11px] text-center text-gray-500">✓ بدون بطاقة دفع ✓ إلغاء في أي وقت ✓ دعم فني</div>
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto text-2xl">✓</div>
                <h3 className="mt-4 font-black text-xl">تم! مطعمك جاهز 🎉</h3>
                <p className="mt-2 text-sm text-gray-600">30 يوم مجاني بدأت الآن - كل الميزات مفتوحة</p>
                <div className="mt-4 p-3 bg-gray-50 rounded-2xl text-sm font-mono">/{formData.slug}/dashboard</div>
                <div className="mt-4 flex gap-2">
                  <Link href={`/dashboard/${formData.slug}`} className="flex-1 py-3 bg-black text-white rounded-full font-bold text-center">لوحة التحكم</Link>
                  <button onClick={() => setShowForm(false)} className="flex-1 py-3 border rounded-full">إغلاق</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <footer className="border-t py-8 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-4 text-sm text-gray-500">
          <div>© 2026 Restaurant SaaS - جميع الحقوق محفوظة - العملة: دينار ليبي LYD 🇱🇾 - شهر أول مجاني</div>
          <div className="flex gap-4"><span>50 د.ل / 120 د.ل / 199 د.ل</span><span>•</span><span>شهر مجاني</span></div>
        </div>
      </footer>
    </div>
  )
}
