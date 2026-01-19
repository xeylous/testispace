import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TestiSpace - Collect Testimonials From The Future",
  description: "The all-in-one platform to collect, manage, and embed video & text testimonials.",
};

import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
            <div id="global-navbar">
              <Navbar />
            </div>
            <main className="min-h-screen">
                {children}
            </main>
            <div id="global-footer">
              <Footer />
            </div>
        </Providers>
      </body>
    </html>
  );
}

