import { notFound } from "next/navigation"


import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import EditorOutput from '@/components/editor-output'
import { getPost } from '@/lib/firebasePost'

import { cn, formatDate } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"

import BackButton from "@/components/back-button"

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
      <div>
        {post.date && (
          <time
            dateTime={formatDate(post.date)}
            className="block text-sm text-muted-foreground"
          >
            Published on {formatDate(post.date)}
          </time>
        )}
        <h1 className="mt-2 inline-block font-heading text-4xl leading-tight lg:text-5xl">
          {post.title}
        </h1>
        {post.author?.id ? (
          <div className="mt-4 flex space-x-4">
            <Link
              href={`/u/${post.author.id}`}
              className="flex items-center space-x-2 text-sm"
            >
              <Image
                src={post.author.avatar || "/images/streetarthub.jpg"}
                alt={post.author.name || "Avatar"}
                width={42}
                height={42}
                className="rounded-full bg-white"
              />
              <div className="flex-1 text-left leading-tight">
                <p className="font-medium">{post.author.name}</p>
                <p className="text-[12px] text-muted-foreground">
                  @{post.author.id}
                </p>
              </div>
            </Link>
          </div>
        ) : null}
      </div>
      {post.media && (
        <Image
          src={`https://firebasestorage.googleapis.com/v0/b/***REMOVED***.appspot.com/o/art%2F@s_800_${post.media[0]}?alt=media`}
          alt={post.title}
          width={720}
          height={405}
          className="my-8 rounded-m/*  */d border bg-muted transition-colors"
          priority
        />
      )}

      <hr className="mt-12" />
      <EditorOutput content={post?.content} />
      <div className="flex justify-center py-6 lg:py-10">
        <Link href="/art" className={cn(buttonVariants({ variant: "ghost" }))}>
          <Icons.chevronLeft className="mr-2 h-4 w-4" />
          See all posts
        </Link>
      </div>
    </article >
  )
}