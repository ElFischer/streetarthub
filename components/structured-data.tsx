import Script from 'next/script'

interface StructuredDataProps {
  data: any
}

// Client component for structured data
export function StructuredData({ data }: StructuredDataProps) {
  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// Server-side structured data component
export function ServerStructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// Helper functions for different types of structured data
export function generateArticleStructuredData(post: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.description,
    "image": post.media?.[0] || post.cover?.[0]?.url,
    "author": {
      "@type": "Person",
      "name": post.author?.name,
      "url": post.author?.profileUrl,
    },
    "publisher": {
      "@type": "Organization",
      "name": "StreetArtHub",
      "logo": {
        "@type": "ImageObject",
        "url": "https://streetarthub.com/images/streetarthub.jpg",
      },
    },
    "datePublished": post.createdAt,
    "dateModified": post.updatedAt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://streetarthub.com/art/${post.id}`,
    },
    "articleSection": "Street Art",
    "keywords": [...(post.category || []), ...(post.artist || [])].join(", "),
  }
}

export function generateOrganizationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "StreetArtHub",
    "url": "https://streetarthub.com",
    "logo": "https://streetarthub.com/images/streetarthub.jpg",
    "description": "Discover the world's best street art. A platform for artists, collectors, and street art enthusiasts.",
    "sameAs": [
      "https://twitter.com/streetarthub",
      "https://www.instagram.com/streetarthub/",
      "https://www.facebook.com/streetarthub/",
      "https://github.com/ElFischer/streetarthub",
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "hallo@streetarthub.com",
    },
  }
}

export function generateWebsiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "StreetArtHub",
    "url": "https://streetarthub.com",
    "description": "Discover the world's best street art. A platform for artists, collectors, and street art enthusiasts.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://streetarthub.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  }
}

export function generateBreadcrumbStructuredData(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((breadcrumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": breadcrumb.name,
      "item": breadcrumb.url,
    })),
  }
}
