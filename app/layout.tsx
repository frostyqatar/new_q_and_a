import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"

const yearOfHandicrafts = localFont({
  src: "../fonts/TheYearofHandicrafts-SemiBold.otf",
  variable: "--font-year-of-handicrafts",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Quick Q&A Game",
  description: "Two-team quiz game in Arabic",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/firacode@6.2.0/distr/fira_code.css"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${yearOfHandicrafts.variable} font-sans`}>{children}</body>
    </html>
  )
}

