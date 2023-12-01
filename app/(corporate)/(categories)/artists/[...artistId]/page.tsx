import { getArtist } from "@/lib/firebase/artists"
import Feed from "@/components/feed/posts"

async function getPostFromParams(params: any) {
    const id = params?.artistId?.join("/")
    const artist = await getArtist(decodeURIComponent(id))
    if (!artist) {
        null
    }
    return artist
}

export default async function ArtistPage({ params }: any) {

    const artist = await getPostFromParams(params)

    return (
        <div className="container">
            <div className="py-16 lg:max-w-2xl">
                <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-lg md:max-w-2xl">{artist?.name}</h1>
                {/* <p className="mt-6 text-base leading-7 text-muted-foreground">
          Discover handpicked collections, both from our team and our creative users, meticulously moderated to ensure an inspiring journey through the world of Streetart. Dive into these thoughtfully crafted selections and let your Streetart exploration begin.
        </p> */}
            </div>
            <Feed artist={artist?.name} />
        </div>

    )
}
