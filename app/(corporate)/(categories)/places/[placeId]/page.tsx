import Feed from "@/components/feed/posts"
import Link from "next/link"
import { getCountry } from '@/lib/firebase/places'
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export const metadata = {
    title: "Artboards",
}

async function getPostFromParams(params: any) {
    const id = params?.placeId
    const place = await getCountry(decodeURIComponent(id))
    if (!place) {
        null
    }
    return place
}

export default async function BlogPage({ params }: any) {
    const location = await getPostFromParams(params)
    return (
        <div className="container">
            <div className="pt-16 pb-5 lg:max-w-2xl">
                <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-lg md:max-w-2xl">{location?.country}</h1>
                {/* <p className="mt-6 text-base leading-7 text-muted-foreground">
                    Explore the global spectrum of urban art, where artists from diverse backgrounds leave their mark on city walls. Find out what artistic treasures adorn your city&apos;s streets and delve into the creative landscape where every location has a unique story to tell.
                </p> */}
            </div>
            <div className="flex gap-3 pb-5">
                {location?.cities?.map((city: any, index: number) => (
                    <Link
                        href={"/places/" + location?.code + "/" + city}
                        key={index}
                        className={cn(
                            buttonVariants({ variant: "secondary" }),
                            ""
                        )}
                    >
                        <>
                            <Icons.hash className="h-4 w-4" />
                            {city}
                        </>
                    </Link>

                ))}
            </div>
            <Feed place={location?.country} />
        </div>
    )
}
