import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Restaurant SaaS - منصة إدارة المطاعم",
  description: "منصة SaaS متعددة المطاعم لإدارة الطلبات ب QR Code",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-gray-50 text-gray-900 antialiased">{children}</body>
    </html>
  );
}
