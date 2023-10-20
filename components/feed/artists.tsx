'use client'

import React from 'react'
import Image from "next/image"
import Card from "@/components/card"

import { getArtists } from '@/lib/firebase/artists'
import type { ArtistsFeed } from "@/lib/models/Artists"

import { useInView } from 'react-intersection-observer'
import {
    useInfiniteQuery,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import { Icons } from '@/components/icons'
import { Button } from '../ui/button'

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
        ['artists'],
        async ({ pageParam = null }) => {
            const res = await getArtists(pageParam)
            return res as ArtistsFeed
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
                    <section className="my-3 grid gap-5 grid-cols-mobile-gallery sm:grid-cols-gallery">
                        {data?.pages.map((page, i) => (
                            <React.Fragment key={i}>
                                {page.docs.map((artist: any, index: number) => (
                                    <Card key={index} type={'artists'} id={artist.id} title={artist.name} image={artist.lastPost.media[0]} />
                                ))}
                            </React.Fragment>
                        ))}
                    </section>
                    {data?.pages && data.pages.length < 25 && (
                        <div className="flex justify-center mt-20">
                            {isFetching && !isFetchingNextPage
                                ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                : <Button
                                    ref={ref}
                                    variant={'outline'}
                                    onClick={() => fetchNextPage()}
                                    disabled={!hasNextPage || isFetchingNextPage}
                                >
                                    {isFetchingNextPage
                                        ? 'Loading more...'
                                        : hasNextPage
                                            ? 'Load Newer'
                                            : 'Nothing more to load'}
                                </Button>}
                        </div>
                    )}

                </>
            )
            }
        </div >
    )
}
