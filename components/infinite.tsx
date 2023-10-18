'use client'

import React from 'react'
import Image from "next/image"
import Link from "next/link"

import { postsNextBatch } from '@/lib/firebasePost'
import type { PostsFeed } from "@/lib/models/Posts"

import { useInView } from 'react-intersection-observer'
import {
    useInfiniteQuery,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import { Icons } from './icons'

const queryClient = new QueryClient()

export default function FeedView() {
    return (
        <QueryClientProvider client={queryClient}>
            <Feed />
        </QueryClientProvider>
    )
}



function Feed() {
    const { ref, inView } = useInView()

    const {
        status,
        data,
        error,
        isFetching,
        isFetchingNextPage,
        isFetchingPreviousPage,
        fetchNextPage,
        fetchPreviousPage,
        hasNextPage,
        hasPreviousPage,
    } = useInfiniteQuery(
        ['streetart'],
        async ({ pageParam = null }) => {
            const res = await postsNextBatch(pageParam)
            return res as PostsFeed
        },
        {
            getNextPageParam: (lastPage) => lastPage.lastVisible ?? undefined,
        },
    )

    React.useEffect(() => {
        if (inView) {
            fetchNextPage()
        }
    }, [inView, fetchNextPage])

    const num1: number = 1;

    function getBlockImage(post: any) {
        const imageBlock = post.content.blocks.find((o: any) => o.type === 'image')
        const src = imageBlock.data.file.url
        return <Image
            src={src}
            alt={imageBlock.data.caption || post.title}
            fill={true}
            sizes="450px"
            className="object-cover group-hover:opacity-75"
            priority={true}
        />
    }

    if (error instanceof Error) {
        return <span>Error: {error.message}</span>
    }

    return (
        <div>
            {status === 'loading' ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <>
                    <section className="my-3 grid gap-5 grid-cols-4">
                        {/* <article className='col-span-2 rounded-md relative overflow-hidden group pr-10'>
                            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">Artists</h2>
                            <p className="mt-6 text-base leading-7 text-muted-foreground">
                                Enter the realm of Streetart through our artist gallery. We&apos;ve gathered a diverse lineup of Streetart creators and their inspiring works. Explore a world of unique styles and stories, as each artist&apos;s portfolio comes to life. From graffiti innovators to mural artists, our platform is your window into the rich tapestry of Streetart and the talented visionaries who shape it.
                            </p>
                        </article> */}
                        {data?.pages.map((page, i) => (
                            <React.Fragment key={i}>
                                {page.docs.map((photo: any, index: number) => (
                                    <article key={photo.id} className='h-72 bg-gray-200 rounded-md relative overflow-hidden group'>
                                        {photo.media ? (
                                            <Image
                                                src={`https://firebasestorage.googleapis.com/v0/b/nuxtsah.appspot.com/o/art%2F@s_500_${photo.media[0]}?alt=media`}
                                                alt={photo.title}
                                                fill={true}
                                                sizes="450px"
                                                className="object-cover group-hover:opacity-75"
                                                priority={index <= num1}
                                            />
                                        ) : photo.content?.blocks.find((o: any) => o.type === 'image') ? (
                                            <div>{getBlockImage(photo)}</div>
                                        ) : (
                                            <div>{photo.title}</div>
                                        )}
                                        <Link href={`art/${photo.id}`} className="absolute inset-0">
                                            <span className="sr-only">View Article</span>
                                        </Link>
                                    </article>
                                ))}
                            </React.Fragment>
                        ))}
                    </section>
                    <div>
                        <button
                            ref={ref}
                            onClick={() => fetchNextPage()}
                            disabled={!hasNextPage || isFetchingNextPage}
                        >
                            {isFetchingNextPage
                                ? 'Loading more...'
                                : hasNextPage
                                    ? 'Load Newer'
                                    : 'Nothing more to load'}
                        </button>
                    </div>
                    <div>
                        {isFetching && !isFetchingNextPage
                            ? 'Background Updating...'
                            : null}
                    </div>
                </>
            )
            }
        </div >
    )
}
