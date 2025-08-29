import { Metadata } from "next"
import { getArtist } from "@/lib/firebase/artists"
import { generateArtistSEO } from "@/lib/seo"
import { ServerStructuredData, generateArticleStructuredData } from "@/components/structured-data"
import Feed from "@/components/feed/posts"

async function getPostFromParams(params: any) {
    const id = params?.artistId?.join("/")
    const artist = await getArtist(decodeURIComponent(id))
    if (!artist) {
        null
    }
    return artist
}

export async function generateMetadata({
  params,
}: {
  params: { artistId: string[] }
}): Promise<Metadata> {
  const artist = await getPostFromParams(params)
  const artistId = params?.artistId?.join("/")

  if (!artist) {
    return {
      title: 'Artist Not Found',
      description: 'The requested artist could not be found.',
    }
  }

  return generateArtistSEO({
    name: artist.name,
    id: artistId,
    description: `Discover street art by ${artist.name}`,
    image: '/images/streetarthub.jpg'
  })
}

export default async function ArtistPage({ params }: any) {
    const artist = await getPostFromParams(params)

    if (!artist) {
        return <div>Artist not found</div>
    }

    return (
        <>
            <ServerStructuredData data={generateArticleStructuredData({
                title: `${artist.name} - Street Art Artist`,
                description: `Discover street art by ${artist.name}`,
                image: '/images/streetarthub.jpg',
                type: 'profile'
            })} />
            <div className="container px-0 sm:px-8">
                <div className="py-16 lg:max-w-2xl sm:px-0 px-8">
                    <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-lg md:max-w-2xl">{artist?.name}</h1>
                    <p className="mt-6 text-base leading-7 text-muted-foreground">
                        Discover amazing street art by {artist.name}.
                    </p>
                </div>
                <Feed artist={artist?.name} />
            </div>
        </>
    )
}
