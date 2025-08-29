import { SiteConfig, FooterConfig } from "@/types"
import { User } from "@/lib/models/User"

export const siteConfig: SiteConfig = {
  name: "StreetArtHub",
  description:
    "Discover the world's best street art. A platform for artists, collectors, and street art enthusiasts. Find, share, and collect street art from around the world.",
  url: "https://streetarthub.com",
  ogImage: "https://streetarthub.com/images/streetarthub.jpg",
  keywords: [
    "Street Art",
    "Graffiti",
    "Urban Art",
    "Street Art Artists",
    "Street Art Collection",
    "Street Art Gallery",
    "Street Art Discovery",
    "Street Art Platform",
    "Street Art Community",
    "Street Art Photography"
  ],
  links: {
    twitter: "https://twitter.com/streetarthub",
    github: "https://github.com/ElFischer/streetarthub",
    instagram: "https://www.instagram.com/streetarthub/",
    facebook: "https://www.facebook.com/streetarthub/",
    pinterest: "https://www.pinterest.de/streetarthub/",
  },
  // SEO-specific configuration
  seo: {
    titleTemplate: "%s | StreetArtHub",
    defaultTitle: "StreetArtHub - Discover the World's Best Street Art",
    defaultDescription: "Discover the world's best street art. A platform for artists, collectors, and street art enthusiasts.",
    siteUrl: "https://streetarthub.com",
    openGraph: {
      type: "website" as const,
      locale: "en_US",
      siteName: "StreetArtHub",
      images: [
        {
          url: "https://streetarthub.com/images/streetarthub.jpg",
          width: 1200,
          height: 630,
          alt: "StreetArtHub - Discover Street Art",
        },
        {
          url: "https://streetarthub.com/images/streetarthub.jpg",
          width: 600,
          height: 600,
          alt: "StreetArtHub - Discover Street Art",
        }
      ],
    },
    twitter: {
      handle: "@streetarthub",
      site: "@streetarthub",
      cardType: "summary_large_image" as const,
    },
    additionalMetaTags: [
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        name: "theme-color",
        content: "#000000",
      },
      {
        name: "apple-mobile-web-app-capable",
        content: "yes",
      },
      {
        name: "apple-mobile-web-app-status-bar-style",
        content: "default",
      },
      {
        name: "apple-mobile-web-app-title",
        content: "StreetArtHub",
      },
    ],
    additionalLinkTags: [
      {
        rel: "icon",
        href: "/favicon.ico",
      },
      {
        rel: "apple-touch-icon",
        href: "/apple-touch-icon.png",
        sizes: "180x180",
      },
      {
        rel: "manifest",
        href: "/site.webmanifest",
      },
    ],
  }
}

export const defaultUser: User = {
  email: "hallo@streetarthub.com",
  image: "https://firebasestorage.googleapis.com/v0/b/nuxtsah.appspot.com/o/streetarthub.png?alt=media",
  name: "streetarthub",
  id: "15vtEbv143rvZNu7zcAP"
}

export const footerNavigation: FooterConfig = {
  solutions: [
    { name: 'Marketing', href: '#' },
    { name: 'Analytics', href: '#' },
    { name: 'Commerce', href: '#' },
    { name: 'Insights', href: '#' },
  ],
  support: [
    { name: 'Pricing', href: '#' },
    { name: 'Documentation', href: '#' },
    { name: 'Guides', href: '#' },
    { name: 'API Status', href: '#' },
  ],
  company: [
    { name: 'About', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Jobs', href: '#' },
    { name: 'Press', href: '#' },
    { name: 'Partners', href: '#' },
  ],
  legal: [
    { name: 'Claim', href: '#' },
    { name: 'Privacy', href: '#' },
    { name: 'Terms', href: '#' },
  ],
  social: [
    {
      name: 'Facebook',
      href: 'https://www.facebook.com/streetarthub/',
      icon: "facebookSM",
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/streetarthub/',
      icon: "instagramSM",
    },
    {
      name: 'GitHub',
      href: 'https://github.com/ElFischer/streetarthub',
      icon: "gitHubSM",
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com/streetarthub',
      icon: "twitterSM",
    },
    {
      name: 'Pinterest',
      href: 'https://www.pinterest.de/streetarthub/',
      icon: "pinterestSM",
    },
    {
      name: 'Patreon',
      href: 'https://www.patreon.com/streetarthub',
      icon: "patreonSM",
    },
  ],
}