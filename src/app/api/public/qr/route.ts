export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import QRCode from 'qrcode'
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')
  const slug = searchParams.get('restaurant') || 'demo'
  if (!token) return Response.json({ error: 'token required' }, { status: 400 })
  const url = `${process.env.NEXT_PUBLIC_APP_URL || 'https://demo.vercel.app'}/r/${slug}/b/tripoli/t/${token}`
  const qr = await QRCode.toDataURL(url, { errorCorrectionLevel: 'H', width: 500, margin: 1 })
  return Response.json({ url, qrDataUrl: qr })
}
