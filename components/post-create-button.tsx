"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { setPost } from "@/lib/firebasePost"

import { cn } from "@/lib/utils"
import { ButtonProps, buttonVariants } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

interface PostCreateButtonProps extends ButtonProps {
  user: any
}

export function PostCreateButton({
  className,
  variant,
  user,
  ...props
}: PostCreateButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  async function onClick() {
    setIsLoading(true)

    // Generate a temporary ID for the new draft post
    const tempId = `draft-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    setIsLoading(false)

    // Navigate directly to editor with draft ID and user data in query params
    router.push(`/editor/${tempId}?draft=true&userId=${user.id}&userName=${encodeURIComponent(user.name)}&userAvatar=${encodeURIComponent(user.image || '')}`)
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        buttonVariants({ variant }),
        {
          "cursor-not-allowed opacity-60": isLoading,
        },
        className
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Icons.add className="mr-2 h-4 w-4" />
      )}
      New post
    </button>
  )
}