import { Metadata } from 'next'
import { siteConfig } from '@/config/site'

export interface SEOProps {
    title?: string
    description?: string
    keywords?: string[]
    image?: string
    url?: string
    type?: 'website' | 'article' | 'profile'
    publishedTime?: string
    modifiedTime?: string
    author?: string
    section?: string
    tags?: string[]
}

export function generateSEO({
    title,
    description,
    keywords = [],
    image,
    url,
    type = 'website',
    publishedTime,
    modifiedTime,
    author,
    section,
    tags = [],
}: SEOProps = {}): Metadata {
    const seoTitle = title || siteConfig.seo.defaultTitle

      const seoDescription = description || siteConfig.seo.defaultDescription
  const seoUrl = url || '/'
  const seoImage = image || '/images/streetarthub.jpg'

      const metadata: Metadata = {
    metadataBase: new URL(siteConfig.seo.siteUrl),
    title: seoTitle,
    description: seoDescription,
    keywords: [...siteConfig.keywords, ...keywords],
    authors: author ? [{ name: author }] : undefined,
        openGraph: {
            type,
            locale: siteConfig.seo.openGraph.locale,
            url: seoUrl,
            siteName: siteConfig.seo.openGraph.siteName,
            title: seoTitle,
            description: seoDescription,
            images: [
                {
                    url: seoImage,
                    width: 1200,
                    height: 630,
                    alt: seoTitle,
                },
            ],
            ...(publishedTime && { publishedTime }),
            ...(modifiedTime && { modifiedTime }),
            ...(author && { authors: [author] }),
            ...(section && { section }),
            ...(tags.length > 0 && { tags }),
        },
        twitter: {
            card: siteConfig.seo.twitter.cardType,
            site: siteConfig.seo.twitter.site,
            creator: siteConfig.seo.twitter.handle,
            title: seoTitle,
            description: seoDescription,
            images: [seoImage],
        },
        alternates: {
            canonical: seoUrl,
        },
    }

    return metadata
}

// Specific SEO generators for different page types
export function generatePostSEO(post: any): Metadata {
    // Generate the full Firebase Storage URL for the first media item
    const imageUrl = post.media?.[0] 
        ? `https://firebasestorage.googleapis.com/v0/b/nuxtsah.appspot.com/o/art%2F@s_800_${post.media[0]}?alt=media`
        : post.cover?.[0]?.url || '/images/streetarthub.jpg'

    return generateSEO({
        title: post.title,
        description: post.description || `Discover this amazing street art piece: ${post.title}`,
        url: `/art/${post.id}`,
        type: 'article',
        image: imageUrl,
        publishedTime: post.createdAt,
        modifiedTime: post.updatedAt,
        author: post.author?.name,
        section: 'Street Art',
        tags: [...(post.category || []), ...(post.artist || [])],
    })
}

export function generateArtistSEO(artist: any): Metadata {
  return generateSEO({
    title: artist.name,
    description: artist.description || `Discover street art by ${artist.name}`,
    url: `/artists/${artist.id}`,
    type: 'profile',
    image: artist.image || '/images/streetarthub.jpg',
    keywords: [artist.name, 'Street Art Artist', ...(artist.tags || [])],
  })
}

export function generateCollectionSEO(collection: any): Metadata {
  return generateSEO({
    title: collection.name,
    description: collection.description || `Explore the ${collection.name} street art collection`,
    url: `/collections/${collection.id}`,
    type: 'website',
    image: collection.cover?.[0]?.url || '/images/streetarthub.jpg',
    keywords: [collection.name, 'Street Art Collection', ...(collection.tags || [])],
  })
}

export function generatePlaceSEO(place: any): Metadata {
    return generateSEO({
        title: `Street Art in ${place.name}`,
        description: `Discover street art in ${place.name}`,
        url: `/places/${place.id}`,
        type: 'website',
        image: place.image || '/images/streetarthub.jpg',
        keywords: [place.name, 'Street Art Location', place.country, ...(place.tags || [])],
    })
}
