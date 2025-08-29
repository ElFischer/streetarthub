import { Icons } from "@/components/icons"
import type { Icon } from "lucide-react"
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
    } & DefaultSession['user'];
  }
}

export type SiteConfig = {
  name: string
  description: string
  url: string
  ogImage: string
  keywords: string[]
  links: {
    twitter: string
    github: string
    instagram: string
    facebook: string
    pinterest: string
  }
  seo: {
    titleTemplate: string
    defaultTitle: string
    defaultDescription: string
    siteUrl: string
    openGraph: {
      type: "website"
      locale: string
      siteName: string
      images: Array<{
        url: string
        width: number
        height: number
        alt: string
      }>
    }
    twitter: {
      handle: string
      site: string
      cardType: "summary_large_image" | "summary" | "player" | "app"
    }
    additionalMetaTags: Array<{
      name: string
      content: string
    }>
    additionalLinkTags: Array<{
      rel: string
      href: string
      sizes?: string
    }>
  }
}

type FooterLink = {
  name: string;
  href: string;
  icon?: keyof typeof Icons
};

export type FooterConfig = {
  solutions: FooterLink[]
  support: FooterLink[]
  company: FooterLink[]
  legal: FooterLink[]
  social: FooterLink[]
}

export type NavItem = {
  title: string
  href: string
  disabled?: boolean
}

export type MainNavItem = NavItem

export type SidebarNavItem = {
  title: string
  disabled?: boolean
  external?: boolean
  icon?: keyof typeof Icons
} & (
    | {
      href: string
      items?: never
    }
    | {
      href?: string
      items: NavLink[]
    }
  )

export type CorporateConfig = {
  mainNav: MainNavItem[]
}

export type DashboardConfig = {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}
