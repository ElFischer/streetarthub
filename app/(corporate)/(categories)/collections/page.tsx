import Feed from "@/components/feed/collections"
import { collection, getCountFromServer } from "firebase/firestore";
import { db } from '@/lib/firebase';

export const metadata = {
    title: "Artboards",
}

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
