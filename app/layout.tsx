import React from 'react';

// إعدادات العناوين والأيقونة (SEO)
export const metadata = {
  title: 'AURA | أورا',
  description: 'وكالة إبداعية رقمية - Digital Creative Agency',
  icons: {
    icon: 'https://aurateam3.com/wp-content/uploads/2025/10/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      {/* ستايل مباشر للجسم لضمان الخلفية السوداء وعدم وجود حواف بيضاء */}
      <body style={{ margin: 0, padding: 0, backgroundColor: '#050607', color: '#ffffff', overflowX: 'hidden' }}>
        {children}
      </body>
    </html>
  );
}
