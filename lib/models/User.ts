import * as z from "zod"

export const UserSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  avatar: z.string().optional(),
})

export type User = z.infer<typeof UserSchema>
