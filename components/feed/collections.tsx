'use client'

import React from 'react'
import Image from "next/image"
import Link from "next/link"
import Card from "@/components/card"

import { getCollections } from '@/lib/firebase/collections'
import type { CollectionsFeed } from "@/lib/models/Collections"

import { useInView } from 'react-intersection-observer'
import {
    useInfiniteQuery,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import { Icons } from '@/components/icons'
import { Button } from '../ui/button'
import { FeedSkeleton } from '../ui/skeleton'

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
        ['collections'],
        async ({ pageParam = null }) => {
            const res = await getCollections(pageParam)
            return res as CollectionsFeed
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
                <FeedSkeleton cols={5} count={15}/>
            ) : (
                <>
                    <section className="my-3 grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                        {data?.pages.map((page, i) => (
                            <React.Fragment key={i}>
                                {page.docs.map((collection: any, index: number) => (
                                    <Card key={index} type={'collections'} id={collection.id} title={collection.name} image={collection.cover.image} />
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
