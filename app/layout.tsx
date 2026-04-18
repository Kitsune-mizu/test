import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/sonner";
import { RootProvider } from "@/components/providers/root-provider";
import "./globals.css";

/* ===== Fonts ===== */
const inter = localFont({
  src: [
    {
      path: "./fonts/Inter-Variable.woff2",
      style: "normal",
    },
    {
      path: "./fonts/Inter-Italic-Variable.woff2",
      style: "italic",
    },
  ],
  variable: "--font-sans",
  weight: "100 900",
  display: "swap",
});

const outfit = localFont({
  src: "./fonts/Outfit-Variable.woff2",
  variable: "--font-heading",
  weight: "100 900",
  display: "swap",
});

/* ===== Metadata ===== */
export const metadata: Metadata = {
  title: "Hikaru Bouken | Outdoor Adventure Gear",
  description:
    "Premium outdoor equipment for your next adventure.",
};

/* ===== Layout ===== */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased`}>
        <RootProvider>
          {children}
          <Toaster position="top-right" />
          <Analytics />
        </RootProvider>
      </body>
    </html>
  );
}
