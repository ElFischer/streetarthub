import { notFound } from "next/navigation"
import { Metadata } from "next"
import Image from "next/image"
import { getPost } from '@/lib/firebasePost'
import { generatePostSEO } from '@/lib/seo'
import { ServerStructuredData, generateArticleStructuredData } from '@/components/structured-data'

import HeaderBlock from "@/components/card/header-block";
import ContentBlock from "@/components/card/content-block";
import BackButton, { SimpleBack } from "@/components/back-button"

interface PostPageProps {
  params: {
    slug: string[]
  }
}

async function getPostFromParams(params: any) {
  const id = params?.id?.join("/")
  const post = await getPost(id)
  if (!post) {
    null
  }
  return post
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const post = await getPostFromParams(params)

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested post could not be found.',
    }
  }

  return generatePostSEO(post)
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostFromParams(params)

  if (!post) {
    notFound()
  }

  return (
    <>
      <ServerStructuredData data={generateArticleStructuredData(post)} />
      <article className="container relative max-w-3xl py-6 lg:py-10">
        <BackButton />
        <HeaderBlock post={post} />
        
        {(() => {
          // Priority: 1. Cover image, 2. Media fallback
          const coverImage = post.cover && post.cover.length > 0 ? post.cover[0] : null;
          const mediaImage = post.media && post.media.length > 0 ? post.media[0] : null;
          
          if (coverImage?.url) {
            return (
              <Image
                src={coverImage.url}
                alt={post.title}
                width={coverImage.width || 720}
                height={coverImage.height || 405}
                className="my-8 rounded-lg border bg-muted transition-colors"
                priority
              />
            );
          } else if (mediaImage) {
            return (
              <Image
                src={`https://firebasestorage.googleapis.com/v0/b/nuxtsah.appspot.com/o/art%2F@s_800_${mediaImage}?alt=media`}
                alt={post.title}
                width={720}
                height={405}
                className="my-8 rounded-lg border bg-muted transition-colors"
                priority
              />
            );
          }
          return null;
        })()}

        <ContentBlock post={post} />
        <div className="flex justify-center py-6 lg:py-10">
          <SimpleBack />
        </div>
      </article>
    </>
  )
}