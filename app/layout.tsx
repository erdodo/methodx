import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "metodX — Metot Mühendisliği Platformu",
  description: "Fabrikadan kağıt ve kalemi emekli edin.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${jakarta.variable} ${jetbrains.variable} font-sans antialiased text-[#1e1e2e] bg-[#f4f6fb]`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
