import { Metadata } from "next"
import Feed from "@/components/feed/collections"
import { collection, getCountFromServer } from "firebase/firestore";
import { db } from '@/lib/firebase';
import { generateSEO } from '@/lib/seo'

export const metadata: Metadata = generateSEO({
  title: "Street Art Collections",
  description: "Explore curated street art collections from around the world. Discover themed galleries, exhibitions, and carefully selected street art pieces on StreetArtHub.",
  url: "/collections",
  keywords: ["Street Art Collections", "Street Art Galleries", "Street Art Exhibitions", "Curated Street Art", "Street Art Themes"],
})

export default async function CollectionsPage() {

    const coll = collection(db, "collections");
    const snapshot = await getCountFromServer(coll);
    const count = snapshot.data().count

    return (
        <div className="container">
            <div className="py-16 lg:max-w-2xl">
                <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-lg md:max-w-2xl">Curated collections</h1>
                <p className="mt-6 text-base leading-7 text-muted-foreground">
                    Discover {count} handpicked collections, both from our team and our creative users, meticulously moderated to ensure an inspiring journey through the world of Streetart. Dive into these thoughtfully crafted selections and let your Streetart exploration begin.
                </p>
            </div>
            <Feed />
        </div>
    )
}
