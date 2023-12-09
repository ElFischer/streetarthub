import { SiteConfig, FooterConfig } from "@/types"

export const siteConfig: SiteConfig = {
  name: "streetarthub",
  description:
    "An open source application built using the new router, server components and everything new in Next.js 13.",
  url: "https://streetarthub.com",
  ogImage: "https://streetarthub.com/01h0FCbKPJLhJsPIRE5x",
  links: {
    twitter: "https://twitter.com/streetarthub",
    github: "https://github.com/ElFischer/streetarthub",
  },
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