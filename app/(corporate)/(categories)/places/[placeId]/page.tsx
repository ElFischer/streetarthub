import { Metadata } from "next"
import Feed from "@/components/feed/posts"
import Link from "next/link"
import { getCountry } from '@/lib/firebase/places'
import { generatePlaceSEO } from "@/lib/seo"
import { ServerStructuredData, generateArticleStructuredData } from "@/components/structured-data"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

async function getPostFromParams(params: any) {
    const id = params?.placeId
    const place = await getCountry(decodeURIComponent(id))
    if (!place) {
        null
    }
    return place
}

export async function generateMetadata({
  params,
}: {
  params: { placeId: string }
}): Promise<Metadata> {
  const location = await getPostFromParams(params)
  const placeId = params?.placeId

  if (!location) {
    return {
      title: 'Country Not Found',
      description: 'The requested country could not be found.',
    }
  }

  return generatePlaceSEO({
    name: location.country,
    id: placeId,
    image: '/images/streetarthub.jpg'
  })
}

export default async function CountryPage({ params }: any) {
    const location = await getPostFromParams(params)

    if (!location) {
        return <div>Country not found</div>
    }

    return (
        <>
            <ServerStructuredData data={generateArticleStructuredData({
                title: `Street Art in ${location.country}`,
                description: `Discover amazing street art in ${location.country}.`,
                image: '/images/streetarthub.jpg',
                type: 'website'
            })} />
            <div className="container">
                <div className="pt-16 pb-5 lg:max-w-2xl">
                    <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-lg md:max-w-2xl">{location?.country}</h1>
                    <p className="mt-6 text-base leading-7 text-muted-foreground">
                        Explore the vibrant street art scene across {location.country}. From stunning murals to thought-provoking graffiti, discover the urban art that brings this country to life.
                    </p>
                </div>
                <ScrollArea className="">
                    <div className="flex w-max space-x-4 pb-6 pt-2">
                        {location?.cities?.map((city: any, index: number) => (
                            <Link
                                href={"/places/" + location?.code + "/" + city}
                                key={index}
                                className={cn(
                                    buttonVariants({ variant: "secondary" }),
                                    "flex items-center gap-2 text-sm font-bold text-muted-foreground"
                                )}
                            >
                                <>
                                    <Icons.hash className="h-4 w-4" />
                                    {city}
                                </>
                            </Link>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" className="hidden" />
                </ScrollArea>
                <Feed place={location?.country} />
            </div>
        </>
    )
}
