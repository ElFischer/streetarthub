
import type { PostsResults } from "./models/Photo"
import { PostsSchemaWithPhotos } from "./models/Photo"
import env from "./env"

import { collection, query, orderBy, startAfter, limit, getDocs } from "firebase/firestore";
import { db } from '@/lib/firebase';

export async function fetchPosts(url: string): Promise<PostsResults | undefined> {
    try {
        const response = await fetch(url, {
            headers: {
                Authorization: env.PEXELS_API_KEY,
            },
        })

        if (!response.ok) throw new Error(response.statusText)

        const postsResults: PostsResults = await response.json()

        const parsedData = PostsSchemaWithPhotos.parse(postsResults)

        if (parsedData.total_results === 0) return undefined

        return parsedData
    } catch (error) {
        if (error instanceof Error) console.log(error.stack)
    }
}
