import type { Metadata } from "next"
import { Bebas_Neue, DM_Mono, DM_Sans } from "next/font/google"
import "./globals.css"

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
})

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
})

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "PowerLog",
  description: "Track your powerlifting progress",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${dmMono.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 font-(family-name:--font-dm-sans)">
        {children}
      </body>
    </html>
  )
}