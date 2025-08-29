import { Metadata } from "next"
import Feed from "@/components/feed/posts"
import Link from "next/link"
import { getCountry } from '@/lib/firebase/places'
import { generatePlaceSEO } from "@/lib/seo"
import { ServerStructuredData, generateArticleStructuredData } from "@/components/structured-data"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"

async function getPostFromParams(params: any) {
    const id = params?.cityId
    const place = decodeURIComponent(id)
    if (!place) {
        null
    }
    return place
}

export async function generateMetadata({
  params,
}: {
  params: { placeId: string; cityId: string }
}): Promise<Metadata> {
  const cityId = await getPostFromParams(params)
  const placeId = params?.placeId
  const cityIdParam = params?.cityId

  if (!cityId) {
    return {
      title: 'City Not Found',
      description: 'The requested city could not be found.',
    }
  }

  return generatePlaceSEO({
    name: cityId,
    id: `${placeId}/${cityIdParam}`,
    image: '/images/streetarthub.jpg'
  })
}

export default async function CityPage({ params }: any) {
    const cityId = await getPostFromParams(params)
    const placeId = params?.placeId
    const cityIdParam = params?.cityId

    if (!cityId) {
        return <div>City not found</div>
    }

    return (
        <>
            <ServerStructuredData data={generateArticleStructuredData({
                title: `Street Art in ${cityId}`,
                description: `Discover amazing street art in ${cityId}. Explore urban art, graffiti, and murals from talented artists.`,
                image: '/images/streetarthub.jpg',
                type: 'website',
                url: `/places/${placeId}/${cityIdParam}`
            })} />
            <div className="container">
                <div className="pt-16 pb-5 lg:max-w-2xl">
                    <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-lg md:max-w-2xl">{cityId}</h1>
                    <p className="mt-6 text-base leading-7 text-muted-foreground">
                        Discover the vibrant street art scene in {cityId}.
                    </p>
                </div>
               
                <Feed city={cityId} />
            </div>
        </>
    )
}
