import Feed from "@/components/feed/places"
import { collection, getCountFromServer } from "firebase/firestore";
import { db } from '@/lib/firebase';

export const metadata = {
  title: "Artboards",
}

export default async function BlogPage() {
  const loc = collection(db, "locations");
  const snapshot = await getCountFromServer(loc);
  const count = snapshot.data().count

  return (
    <div className="container">
      <div className="py-16 lg:max-w-2xl">
        <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-lg md:max-w-2xl">Places</h1>
        <p className="mt-6 text-base leading-7 text-muted-foreground">
          Explore the global spectrum of urban art in {count} countries, where artists from diverse backgrounds leave their mark on city walls. Find out what artistic treasures adorn your city&apos;s streets and delve into the creative landscape where every location has a unique story to tell. 
        </p>
      </div>
      <Feed />
    </div>
  )
}
