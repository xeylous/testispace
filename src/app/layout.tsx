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
  title: "TestiSpace | Collect Testimonials From The Future",
  description: "The all-in-one platform to collect, manage, and embed video & text testimonials. Built for modern SaaS with a futuristic touch.",
  keywords: ["TestiSpace", "TestiSpace reviews", "testimonials", "video testimonials", "social proof", "saas tools", "feedback collection", "embed testimonials"],
  authors: [{ name: "Antigravity" }],
  creator: "Antigravity",
  openGraph: {
    title: "TestiSpace | Collect Testimonials From The Future",
    description: "The all-in-one platform to collect, manage, and embed video & text testimonials.",
    url: "https://testispace.vercel.app",
    siteName: "TestiSpace",
    images: [
      {
        url: "/og-image.png", // Ensure this image exists in your public folder
        width: 1200,
        height: 630,
        alt: "TestiSpace Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TestiSpace | Collect Testimonials From The Future",
    description: "The all-in-one platform to collect, manage, and embed video & text testimonials.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  verification: {
    google: "hxBsyO1MBr9vXpZ-GDsKIK9vwW4N8yxAMqfd-Y9qXyc",
  },
};

import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://testispace.vercel.app/#organization",
        "name": "TestiSpace",
        "url": "https://testispace.vercel.app",
        "logo": "https://testispace.vercel.app/icon.png",
        "sameAs": [
          "https://github.com/xeylous/testispace"
        ]
      },
      {
        "@type": "SoftwareApplication",
        "name": "TestiSpace",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "description": "The all-in-one platform to collect, manage, and embed video & text testimonials.",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "5",
          "ratingCount": "1"
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://testispace.vercel.app/#website",
        "url": "https://testispace.vercel.app",
        "name": "TestiSpace",
        "publisher": {
          "@id": "https://testispace.vercel.app/#organization"
        }
      }
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
            <div id="global-navbar">
              <Navbar />
            </div>
            <main className="min-h-screen pt-16">
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

