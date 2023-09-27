import * as z from "zod"

const BasicPostSchema = z.object({
    page: z.number(),
    per_page: z.number(),
    prev_page: z.string().optional(),
    next_page: z.string().optional(),
    total_results: z.number(),
})

const PhotoSchema = z.object({
    id: z.number(),
    width: z.number(),
    height: z.number(),
    url: z.string(),
    src: z.object({
        large: z.string(),
    }),
    alt: z.string(),
    blurredDataUrl: z.string().optional(),
})

export const PostsSchemaWithPhotos = BasicPostSchema.extend({
    photos: z.array(PhotoSchema),
})

export type Photo = z.infer<typeof PhotoSchema>

export type PostsResults = z.infer<typeof PostsSchemaWithPhotos>

/* export const postPatchSchema = z.object({
    title: z.string().min(3).max(128).optional(),

    // TODO: Type this properly from editorjs block types?
    content: z.any().optional(),
}) */