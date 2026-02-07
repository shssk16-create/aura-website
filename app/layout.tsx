import type { Metadata } from 'next';

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
      <body style={{ margin: 0, padding: 0, backgroundColor: '#050607' }}>
        {children}
      </body>
    </html>
  );
}
