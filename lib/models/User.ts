import * as z from "zod"

export const SocialMediaAccountSchema = z.object({
  platform: z.enum(["twitter", "instagram", "facebook", "linkedin"]),
  username: z.string().optional(),
  profileUrl: z.string().optional(),
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
  enabled: z.boolean().default(false),
})

export const UserSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  image: z.string().optional(),
  avatar: z.string().optional(),
  email: z.string().optional(),
  socialMediaAccounts: z.array(SocialMediaAccountSchema).optional(),
})

export type User = z.infer<typeof UserSchema>
export type SocialMediaAccount = z.infer<typeof SocialMediaAccountSchema>
