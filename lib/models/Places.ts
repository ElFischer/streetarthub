import * as z from "zod"
import { UserSchema } from "./User"
import { PostSchema } from "./Posts"

export const PlaceSchema = z.object({
    country: z.string(),
    code: z.string(),
    lastPost: z.object(PostSchema.shape).optional(),
    cover: z.object({
        image: z.string(),
    }).optional(),
    cities: z.array(z.string()).optional(),
    createdAt: z.any().optional(),
    approved: z.boolean().optional(),
    author: z.object(UserSchema.shape).optional(),
})

const FeedSchema = z.object({
    docs: z.array(PlaceSchema),
    lastVisible: z.any().optional(),
})

export type Place = z.infer<typeof PlaceSchema>

export type PlacesFeed = z.infer<typeof FeedSchema>