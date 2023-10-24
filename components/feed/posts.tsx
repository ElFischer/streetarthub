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
            let limit = 25
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

    return (
        <div>
            {status === 'loading' ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
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
                                <Card key={idx} id={item.id} title={item.title} image={getBlockImage(item)} cover={item.cover} source={item.source} />
                            )}
                        />
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
                    </section>
                </>
            )}
        </div>
    )
}
