import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
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
  title: "Plint AI: Modern Interior Design Solutions",
  description: "Design stunning, production-ready outputs just from your plans, elevations and inputs. Plint AI transforms slow, manual 3D workflows into a fast, scalable design engine",
  icons: {
    icon: 'https://framerusercontent.com/images/JOv5mUsHRzjf9n9MRnsW4EUjp4.png',
    apple: 'https://framerusercontent.com/images/JOv5mUsHRzjf9n9MRnsW4EUjp4.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
