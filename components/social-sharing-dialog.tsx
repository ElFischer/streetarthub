"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { SocialMediaAccount } from "@/lib/models/User"
import { 
  shareToTwitter, 
  shareToInstagram, 
  shareToFacebook, 
  shareToLinkedIn 
} from "@/lib/firebase/social"

const socialSharingSchema = z.object({
  message: z.string().max(280, "Message too long for Twitter").optional(),
  platforms: z.array(z.string()),
})

type FormData = z.infer<typeof socialSharingSchema>

interface SocialSharingDialogProps {
  post: {
    id: string
    title: string
    content?: any
  }
  userSocialAccounts: SocialMediaAccount[]
  children: React.ReactNode
}

export function SocialSharingDialog({ 
  post, 
  userSocialAccounts, 
  children 
}: SocialSharingDialogProps) {
  const [isSharing, setIsSharing] = React.useState<boolean>(false)
  const [open, setOpen] = React.useState<boolean>(false)

  const enabledAccounts = userSocialAccounts.filter(account => account.enabled)

  const { register, handleSubmit, watch, setValue } = useForm<FormData>({
    resolver: zodResolver(socialSharingSchema),
    defaultValues: {
      message: `Check out my latest street art: "${post.title}"`,
      platforms: [],
    },
  })

  const selectedPlatforms = watch("platforms")

  async function onSubmit(data: FormData) {
    if (data.platforms.length === 0) {
      toast({
        title: "No platforms selected",
        description: "Please select at least one platform to share to.",
        variant: "destructive",
      })
      return
    }

    setIsSharing(true)

    try {
      const postUrl = `${window.location.origin}/art/${post.id}`
      const shareResults = []

      // Share to each selected platform
      for (const platformId of data.platforms) {
        const account = enabledAccounts.find(acc => acc.platform === platformId)
        if (account && account.accessToken) {
          let success = false
          
          switch (account.platform) {
            case 'twitter':
              success = await shareToTwitter(account.accessToken, data.message || '', postUrl)
              break
            case 'instagram':
              success = await shareToInstagram(account.accessToken, data.message || '', postUrl)
              break
            case 'facebook':
              success = await shareToFacebook(account.accessToken, data.message || '', postUrl)
              break
            case 'linkedin':
              success = await shareToLinkedIn(account.accessToken, data.message || '', postUrl)
              break
          }
          
          shareResults.push({ platform: account.platform, success })
        }
      }

      const successfulShares = shareResults.filter(r => r.success).length
      const failedShares = shareResults.filter(r => !r.success).length

      if (successfulShares > 0) {
        toast({
          description: `Successfully shared to ${successfulShares} platform(s)!`,
        })
      }

      if (failedShares > 0) {
        toast({
          title: "Some shares failed",
          description: `${failedShares} platform(s) could not be shared to. Check your access tokens.`,
          variant: "destructive",
        })
      }

      setOpen(false)
    } catch (error) {
      toast({
        title: "Sharing failed",
        description: "Could not share to social media. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSharing(false)
    }
  }

  const togglePlatform = (platformId: string) => {
    const current = selectedPlatforms || []
    const updated = current.includes(platformId)
      ? current.filter(id => id !== platformId)
      : [...current, platformId]
    setValue("platforms", updated)
  }

  const platformIcons = {
    twitter: "twitter",
    instagram: "instagram", 
    facebook: "facebook",
    linkedin: "linkedin",
  } as const

  if (enabledAccounts.length === 0) {
    return null // Don't show button if no accounts are configured
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share to Social Media</DialogTitle>
          <DialogDescription>
            Share your street art post to your connected social media accounts.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="message">Message (optional)</Label>
            <Input
              id="message"
              placeholder="Add a custom message..."
              {...register("message")}
            />
            <p className="text-xs text-muted-foreground">
              Max 280 characters for Twitter
            </p>
          </div>

          <div className="space-y-3">
            <Label>Select platforms:</Label>
            <div className="grid grid-cols-2 gap-3">
              {enabledAccounts.map((account) => {
                const isSelected = selectedPlatforms?.includes(account.platform)
                const IconComponent = Icons[platformIcons[account.platform as keyof typeof platformIcons] as keyof typeof Icons]
                
                return (
                  <div
                    key={account.platform}
                    className={cn(
                      "flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors",
                      isSelected 
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950" 
                        : "border-gray-200 hover:border-gray-300"
                    )}
                    onClick={() => togglePlatform(account.platform)}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => togglePlatform(account.platform)}
                      className="rounded"
                    />
                    <IconComponent className="h-4 w-4" />
                    <span className="text-sm font-medium capitalize">
                      {account.platform}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSharing}>
              {isSharing && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Share Now
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
