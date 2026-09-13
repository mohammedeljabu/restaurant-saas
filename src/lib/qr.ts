import QRCode from 'qrcode'
export async function generateQRCode(url: string) {
  return await QRCode.toDataURL(url, { errorCorrectionLevel: 'H', margin: 2, width: 400 })
}
export function buildQRUrl(restaurantSlug: string, branchSlug: string, token: string) {
  return `/r/${restaurantSlug}/b/${branchSlug}/t/${token}`
}
