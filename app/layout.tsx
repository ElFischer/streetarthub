import type { Metadata } from 'next'
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"
import { ServerStructuredData, generateWebsiteStructuredData, generateOrganizationStructuredData } from "@/components/structured-data"

import localFont from "next/font/local"

import "../styles/globals.css"

import { ThemeProvider } from "@/components/theme-provider"

import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth'

import SessionProvider from '@/components/session-provider';

const fontHeading = localFont({
  src: "../assets/fonts/CalSans-SemiBold.woff2",
  variable: "--font-heading",
})

const fontSans = localFont({
  src: "../assets/fonts/Inter-Regular.ttf",
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Street Art",
    "streetarthub"
  ],
  authors: [
    {
      name: "Enrique Fischer",
      url: "https://devsrow.com",
    },
  ],
  creator: "enriquefischer",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ServerStructuredData data={generateWebsiteStructuredData()} />
        <ServerStructuredData data={generateOrganizationStructuredData()} />
      </head>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        fontSans.variable,
        fontHeading.variable
      )}>
        <SessionProvider session={session}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
            <Toaster />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
