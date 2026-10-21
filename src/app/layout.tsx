import type { Metadata } from "next";
import "./globals.css";
import CartProvider from "@/components/CartProvider";
import NavClient from "@/components/NavClient";
import UserProvider from "@/components/UserProvider";
import Footer from "@/components/Footer";

export const metadata: Metadata = { title: "SHOP.CO - Electronics that fit the way you live", description: "Phones, laptops, audio and wearables with a 24-month warranty." };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&display=swap" rel="stylesheet" media="print" data-swap="" />
        <link href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap" rel="stylesheet" media="print" data-swap="" />
        <script dangerouslySetInnerHTML={{ __html: "document.querySelectorAll('link[data-swap]').forEach(function(l){function s(){l.media='all'}l.sheet?s():l.addEventListener('load',s)})" }} />
        <noscript><link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap" /></noscript>
      </head>
      <body>
        <UserProvider><CartProvider>
          <NavClient />
          <main>{children}</main>
          <Footer />
        </CartProvider></UserProvider>
      </body>
    </html>
  );
}
