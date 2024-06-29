import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/global/menu/menu";
import Footer from "@/components/global/footer/footer";

import { NextUIProvider } from "@nextui-org/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VBM Order Tracker",
  description: "Created by Bitwize.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <Navbar /> */}
        <NextUIProvider>{children}</NextUIProvider>
        {/* <Footer /> */}
      </body>
    </html>
  );
}
