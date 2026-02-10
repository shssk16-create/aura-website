import type { Metadata } from 'next';
import './globals.css'; // <--- هذا هو السطر المفقود والمسؤول عن تشغيل تايلوند

export const metadata: Metadata = {
  title: 'AURA | هالتك الفارقة',
  description: 'نحن نمزج الإبداع بالتكنولوجيا لنخلق تجارب رقمية لا تُنسى.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        {children}
      </body>
    </html>
  );
}
