'use client'

import React from 'react'
import Card from "@/components/card"
import { Masonry } from '../masonry'
import { postsNextBatch } from '@/lib/firebasePost'
import { getCollectionPosts } from '@/lib/firebase/collections'
import { getArtistPosts } from '@/lib/firebase/artists'

import type { PostsFeed } from "@/lib/models/Posts"

import { useInView } from 'react-intersection-observer'
import {
    useInfiniteQuery,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import { Icons } from '@/components/icons'
import { Button } from '../ui/button'
import { Skeleton } from "@/components/ui/skeleton";

const queryClient = new QueryClient()

export default function FeedView({ collection, artist }: { collection?: string, artist?: string }) {
    return (
        <QueryClientProvider client={queryClient}>
            <Feed collection={collection} artist={artist} />
        </QueryClientProvider>
    )
}

function Feed({ collection, artist }: { collection?: string, artist?: string }) {
    const { ref, inView } = useInView()
    const key = collection ? collection : artist
    const {
        status,
        data,
        error,
        isFetching,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery(
        [key],
        async ({ pageParam = null }) => {
            let limit = 15
            if (window.innerWidth < 640) {
                limit = 5
            }
            if (collection) {
                const res = await getCollectionPosts(pageParam, collection, limit)
                return res as PostsFeed
            } else if (artist) {
                const res = await getArtistPosts(pageParam, artist, limit)
                return res as PostsFeed
            } else {
                const res = await postsNextBatch(pageParam, limit)
                return res as PostsFeed
            }
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

    function getBlockImage(post: any) {
        if (post.content) {
            const imageBlock = post.content.blocks.find((o: any) => o.type === 'image')
            const src = imageBlock.data.file.url
            return src
        } else if (post.media) {
            return post.media[0]
        } else {
            return null
        }
    }

    if (error instanceof Error) {
        return <span>Error: {error.message}</span>
    }

    const skeletons = Array.from({ length: 9 });

    return (
        <div>
            {status === 'loading' ? (
                <div className="my-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {skeletons.map((_, index) => (
                        <div key={index} className="space-y-3">
                            <Skeleton className="h-60" />
                            <Skeleton className="h-4 w-4/5" />
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    <section className="my-3">
                        <Masonry
                            data={data}
                            config={{
                                columns: [1, 2, 3],
                                gap: [24, 24, 24],
                                media: [640, 1024, 1280],
                            }}
                            render={(item: any, idx) => (
                                <Card key={idx} id={item.id} post={item} title={item.title} image={getBlockImage(item)} cover={item.cover} source={item.source} media={item.media} />
                            )}
                        />
                        {data?.pages && data.pages.length < 25 && (
                            <div className="flex justify-center mt-20">
                                {isFetching && !isFetchingNextPage
                                    ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                    : <Button
                                        ref={ref}
                                        variant={'ghost'}
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
                    </section>
                </>
            )}
        </div>
    )
}
