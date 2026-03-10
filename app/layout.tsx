import type { Metadata } from "next";
import { Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";

const notoSansArabic = Noto_Sans_Arabic({ 
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ملاحظاتي الذكية | Smart Notes",
  description: "تطبيق ملاحظات ذكي باللغة العربية مع ميزات الذكاء الاصطناعي",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={notoSansArabic.className}>
        {children}
      </body>
    </html>
  );
}
