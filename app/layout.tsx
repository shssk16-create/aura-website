import "./globals.css";
import type { Metadata } from "next";
import { Cairo } from "next/font/google";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AURA AI | أورا للذكاء التسويقي",
  description:
    "منصة SaaS عربية ذاتية الاستضافة لإدارة الحملات التسويقية عبر فريق من وكلاء الذكاء الاصطناعي بلغة عربية بيضاء فصيحة.",
  metadataBase: new URL("https://aura.ai"),
  openGraph: {
    title: "AURA AI",
    description:
      "فريق وكلاء ذكاء اصطناعي لإدارة حملاتك التسويقية بلغة عربية بيضاء.",
    locale: "ar_SA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className="min-h-screen overflow-x-hidden bg-aura-mist text-aura-dark">
        {children}
      </body>
    </html>
  );
}
