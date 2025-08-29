import { Metadata } from "next"
import Feed from "@/components/feed/artists"
import { collection, getCountFromServer } from "firebase/firestore";
import { db } from '@/lib/firebase';
import { generateSEO } from '@/lib/seo'

export const metadata: Metadata = generateSEO({
  title: "Street Art Artists",
  description: "Discover talented street art artists from around the world. Explore their unique styles, techniques, and inspiring works on StreetArtHub.",
  url: "/artists",
  keywords: ["Street Art Artists", "Graffiti Artists", "Urban Artists", "Street Art Creators", "Mural Artists"],
})

export default async function ArtistsPage() {
    const coll = collection(db, "artists");
    const snapshot = await getCountFromServer(coll);
    const count = snapshot.data().count

    return (
        <div className="container">
            <div className="py-16 lg:max-w-2xl">
                <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-lg md:max-w-2xl">Artists</h1>
                <p className="mt-6 text-base leading-7 text-muted-foreground">
                    We&apos;ve gathered a diverse lineup of {count} Streetart creators and their inspiring works. Explore a world of unique styles. From graffiti innovators to mural artists, our platform is your window into the rich diversity of Streetart and the visionaries who shape it.
                </p>
            </div>
            <Feed />
        </div>
    )
}
