import * as z from "zod"
import { UserSchema } from "./User"

export const CoverSchema = z.object({
    url: z.string().optional(),
    height: z.number().optional(),
    width: z.number().optional(),
})


export const PostSchema = z.object({
    id: z.string(),
    title: z.string(),
    content: z.any().optional(),
    media: z.array(z.string()).optional(),
    location: z.object({
        country: z.object({
            long_name: z.string(),
            short_name: z.string(),
        }).optional(),
        locality: z.object({
            long_name: z.string(),
            short_name: z.string(),
        }).optional(),
        geoData: z.object({
            lat: z.union([z.string(), z.number()]),
            lng: z.union([z.string(), z.number()]),
        }).optional(),
    }).optional(),
    source: z.string().optional(),
    date: z.number(),
    createdAt: z.any().optional(),
    updatedAt: z.any().optional(),
    approved: z.boolean(),
    artist: z.array(z.string()).optional(),
    cover: z.array(z.object(CoverSchema.shape)).optional(),
    category: z.array(z.string()).optional(),
    author: z.object(UserSchema.shape).optional(),
    description: z.string().optional(),
    likes: z.number().optional(),
})

export const postPatchSchema = z.object({
    title: z.string().min(3).max(128).optional(),
  
    // TODO: Type this properly from editorjs block types?
    content: z.any().optional(),
  })

const FeedSchema = z.object({
    docs: z.array(PostSchema),
    lastVisible: z.any().optional(),
})

export type Post = z.infer<typeof PostSchema>

export type PostsFeed = z.infer<typeof FeedSchema>