'use client'

import React from 'react'
import Card from "@/components/card"
import { Masonry } from '../masonry'
import { fetchPosts } from '@/lib/firebase/posts'
import type { PostsFeed } from "@/lib/models/Posts"

import { useInView } from 'react-intersection-observer'
import {
    useInfiniteQuery,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import { Icons } from '@/components/icons'
import { Button } from '../ui/button'
import { FeedSkeleton } from "@/components/ui/skeleton";

const queryClient = new QueryClient()

export default function FeedView({ collection, artist, user, place, city }: { collection?: string, artist?: string, user?: string, place?: string, city?: string }) {
    return (
        <QueryClientProvider client={queryClient}>
            <Feed collection={collection} artist={artist} user={user} place={place} city={city} />
        </QueryClientProvider>
    )
}

function Feed({ collection, artist, user, place, city }: { collection?: string, artist?: string, user?: string, place?: string, city?: string }) {
    const { ref, inView } = useInView()
    const key = collection ? collection : artist ? artist : place ? place : city ? city : undefined;
    const filterField = collection ? 'category' : artist ? 'artist' : user ? 'author.id' : place ? 'location.country.long_name' : city ? 'location.locality.long_name' : undefined;
    const filterValue = collection || artist || user || place || city;
    const filterOperator = user || place || city ? '==' : 'array-contains'

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
            const res = await fetchPosts({ key: pageParam, limitValue: limit, filterField, filterValue, filterOperator })
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

    function extractIdFromUrl(url: string) {
        const decodedUrl = decodeURIComponent(url);
        const parts = decodedUrl.split('/');
        const lastPart = parts[parts.length - 1];
        const id = lastPart.split('?')[0];
        return id;
    }

    function getBlockImage(post: any) {
        if (post.content) {
            const imageBlock = post.content.blocks.find((o: any) => o.type === 'image')
            const src = imageBlock.data.file.url
            const id = extractIdFromUrl(src);
            return id
        } else if (post.media) {
            return `@s_500_${post.media[0]}`
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
                <FeedSkeleton />
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
