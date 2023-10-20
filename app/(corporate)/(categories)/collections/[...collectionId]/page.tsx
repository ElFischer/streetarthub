import { getCollection } from "@/lib/firebase/collections"
import Feed from "@/components/feed/posts"

async function getPostFromParams(params: any) {
  const id = params?.collectionId?.join("/")
  const collection = await getCollection(decodeURIComponent(id))
  if (!collection) {
    null
  }
  return collection

}

export default async function CollectionPage({ params }: any) {

  const collection = await getPostFromParams(params)

  return (
    <div className="container">
      <div className="py-16 lg:max-w-2xl">
        <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-lg md:max-w-2xl">{collection?.name}</h1>
        {/* <p className="mt-6 text-base leading-7 text-muted-foreground">
          Discover handpicked collections, both from our team and our creative users, meticulously moderated to ensure an inspiring journey through the world of Streetart. Dive into these thoughtfully crafted selections and let your Streetart exploration begin.
        </p> */}
      </div>
      <Feed collection={collection?.name} />
    </div>

  )
}
