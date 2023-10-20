import Image from "next/image"
import Link from "next/link"

import Feed from "@/components/infinite"
import { compareDesc } from "date-fns"

import { formatDate } from "@/lib/utils"

export const metadata = {
    title: "Artboards",
}

export default async function BlogPage() {
    /* const posts = allPosts
      .filter((post) => post.published)
      .sort((a, b) => {
        return compareDesc(new Date(a.date), new Date(b.date))
      }) */

    const posts: any[] = []

    return (
        <div className="container">
            <div className="py-16 lg:max-w-2xl">
                <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-lg md:max-w-2xl">Places</h1>
                <p className="mt-6 text-base leading-7 text-muted-foreground">
                    Explore the global spectrum of urban art, where artists from diverse backgrounds leave their mark on city walls. Find out what artistic treasures adorn your city&apos;s streets and delve into the creative landscape where every location has a unique story to tell.
                </p>
            </div>
            <Feed />
            {/* <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="flex-1 space-y-4">
          <h1 className="inline-block font-heading text-4xl tracking-tight lg:text-5xl">
            Blog
          </h1>
          <p className="text-xl text-muted-foreground">
            A blog built using Contentlayer. Posts are written in MDX.
          </p>
        </div>
      </div> 
      <hr className="my-8" />*/}
            {/* {posts?.length ? (
        <div className="grid gap-10 sm:grid-cols-2">
          {posts.map((post, index) => (
            <article
              key={post._id}
              className="group relative flex flex-col space-y-2"
            >
              {post.image && (
                <Image
                  src={post.image}
                  alt={post.title}
                  width={804}
                  height={452}
                  className="rounded-md border bg-muted transition-colors"
                  priority={index <= 1}
                />
              )}
              <h2 className="text-2xl font-extrabold">{post.title}</h2>
              {post.description && (
                <p className="text-muted-foreground">{post.description}</p>
              )}
              {post.date && (
                <p className="text-sm text-muted-foreground">
                  {formatDate(post.date)}
                </p>
              )}
              <Link href={post.slug} className="absolute inset-0">
                <span className="sr-only">View Article</span>
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <p>No posts published.</p>
      )} */}
        </div>
    )
}