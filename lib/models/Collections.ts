import * as z from "zod"
import { UserSchema } from "./User"
import { PostSchema } from "./Posts"

export const CollectionSchema = z.object({
    /* id: z.string(), */
    name: z.string(),
    lastPost: z.object(PostSchema.shape).optional(),
    cover: z.object({
        image: z.string(),
    }).optional(),
    createdAt: z.any().optional(),
    approved: z.boolean().optional(),
    author: z.object(UserSchema.shape).optional(),
})

const FeedSchema = z.object({
    docs: z.array(CollectionSchema),
    lastVisible: z.any().optional(),
})

export type Collection = z.infer<typeof CollectionSchema>

export type CollectionsFeed = z.infer<typeof FeedSchema>