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
        
        {post.media && (
          <Image
            src={`https://firebasestorage.googleapis.com/v0/b/nuxtsah.appspot.com/o/art%2F@s_800_${post.media[0]}?alt=media`}
            alt={post.title}
            width={720}
            height={405}
            className="my-8 rounded-lg border bg-muted transition-colors"
            priority
          />
        )}

        <ContentBlock post={post} />
        <div className="flex justify-center py-6 lg:py-10">
          <SimpleBack />
        </div>
      </article>
    </>
  )
}