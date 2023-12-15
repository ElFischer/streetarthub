'use client'

import React from 'react'
import Image from "next/image"
import Link from "next/link"
import Card from "@/components/card"

import { getPlaces } from '@/lib/firebase/places'
import type { PlacesFeed } from "@/lib/models/Places"

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
        ['places'],
        async ({ pageParam = null }) => {
            const res = await getPlaces(pageParam)
            return res as PlacesFeed
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

    if (error instanceof Error) {
        return <span>Error: {error.message}</span>
    }
    console.log(data)
    return (
        <div>
            {status === 'loading' ? (
                <FeedSkeleton cols={5} count={15}/>
            ) : (
                <>
                    <section className="my-3 grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                        {data?.pages.map((page, i) => (
                            <React.Fragment key={i}>
                                {page.docs.map((place: any, index: number) => (
                                    <Card key={index} type={'places'} id={place.id} title={place.country} image={place.lastPost.media[0]} />
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
