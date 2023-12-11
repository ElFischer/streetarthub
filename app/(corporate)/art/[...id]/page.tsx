import { notFound } from "next/navigation"


import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import EditorOutput from '@/components/editor-output'
import { getPost } from '@/lib/firebasePost'

import { cn, formatDate } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"

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

/* export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const post = await getPostFromParams(params)

  if (!post) {
    return {}
  }

  const url = env.NEXT_PUBLIC_APP_URL

  const ogUrl = new URL(`${url}/api/og`)
  ogUrl.searchParams.set("heading", post.title)
  ogUrl.searchParams.set("type", "Blog Post")
  ogUrl.searchParams.set("mode", "dark")

  return {
    title: post.title,
    description: post.description,
    authors: post.authors.map((author) => ({
      name: author,
    })),
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: absoluteUrl(post.slug),
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [ogUrl.toString()],
    },
  }
} */

/* export async function generateStaticParams(): Promise<
  PostPageProps["params"][]
> {
  return allPosts.map((post) => ({
    slug: post.slugAsParams.split("/"),
  }))
} */

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostFromParams(params)

  if (!post) {
    notFound()
  }

  /* const authors = post.authors.map((author) =>
    allAuthors.find(({ slug }) => slug === `/authors/${author}`)
  ) */

  return (
    <article className="container relative max-w-3xl py-6 lg:py-10">
      <BackButton />
      <HeaderBlock post={post} />
      
      {post.media && (
        <Image
          src={`https://firebasestorage.googleapis.com/v0/b/***REMOVED***.appspot.com/o/art%2F@s_800_${post.media[0]}?alt=media`}
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
    </article >
  )
}