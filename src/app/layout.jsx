"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./ui/globals.css";
import Head from "next/head";

export default function RootLayout({ children }) {
  
  return (
    <html lang="vi">
      <Head>
        <link rel="icon" href="/vnen.icon" type="image/x-icon" />
      </Head>
      <body>
        {children}
      </body>
    </html>
  );
}
