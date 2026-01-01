import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Soner Yılmaz | FinTech Geliştiricisi & Yatırım Analisti",
  description: "Finansal piyasaları kod ve yapay zeka ile analiz eden, halka arz ve borsa stratejileri geliştiren junior yazılımcı portfolyosu.",
  keywords: "Soner Yılmaz, Borsa, Yatırım, Halka Arz, BES, Yazılım, Yapay Zeka, FinTech",
  openGraph: {
    title: "Soner Yılmaz | FinTech Geliştiricisi & Yatırım Analisti",
    description: "Finansal piyasaları kod ve yapay zeka ile analiz eden, halka arz ve borsa stratejileri geliştiren junior yazılımcı portfolyosu.",
    url: "https://soneryilmaz.vercel.app",
    siteName: "Soner Yılmaz",
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@soner_yilmz",
    creator: "@soner_yilmz",
  },
  verification: {
    google: "o7JFkAV3NWZulmJ98WX6VZ6mnVI60aVpPMr2u-ozLPU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        <link rel="canonical" href="https://soneryilmaz.vercel.app" />
        <meta name="author" content="Soner Yılmaz" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;900&display=swap" rel="stylesheet" />
      </head>
      <body className="overflow-x-hidden">
        {children}
        <Script src="https://unpkg.com/lucide@latest" strategy="afterInteractive" />
      </body>
    </html>
  );
}
