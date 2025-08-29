import { Metadata } from "next"
import { getCollection } from "@/lib/firebase/collections"
import { generateCollectionSEO } from "@/lib/seo"
import { ServerStructuredData, generateArticleStructuredData } from "@/components/structured-data"
import Feed from "@/components/feed/posts"

async function getPostFromParams(params: any) {
  const id = params?.collectionId?.join("/")
  const collection = await getCollection(decodeURIComponent(id))
  if (!collection) {
    null
  }
  return collection
}

export async function generateMetadata({
  params,
}: {
  params: { collectionId: string[] }
}): Promise<Metadata> {
  const collection = await getPostFromParams(params)

  if (!collection) {
    return {
      title: 'Collection Not Found',
      description: 'The requested collection could not be found.',
    }
  }

  const collectionId = params?.collectionId?.join("/")
  
  return generateCollectionSEO({
    ...collection,
    id: collectionId,
    description: `Explore the ${collection.name} street art collection`,
    image: collection.cover?.image || '/images/streetarthub.jpg'
  })
}

export default async function CollectionPage({ params }: any) {
  const collection = await getPostFromParams(params)

  if (!collection) {
    return <div>Collection not found</div>
  }

  return (
    <>
      <ServerStructuredData data={generateArticleStructuredData({
        title: `${collection.name} - Street Art Collection`,
        description: `Explore the ${collection.name} street art collection`,
        image: '/images/streetarthub.jpg',
        type: 'website'
      })} />
      <div className="container px-0 sm:px-8">
        <div className="py-16 lg:max-w-2xl sm:px-0 px-8">
          <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-lg md:max-w-2xl">{collection?.name}</h1>
          <p className="mt-6 text-base leading-7 text-muted-foreground">
            Explore the {collection.name} street art collection. Discover curated pieces from talented artists.
          </p>
        </div>
        <Feed collection={collection?.name} />
      </div>
    </>
  )
}
