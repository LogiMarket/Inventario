import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Inventario Logimarket",
  description: "Sistema de automatización de inventario para gestión de equipos Logimarket",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/logimarket-inventario.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/logimarket-inventario.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
