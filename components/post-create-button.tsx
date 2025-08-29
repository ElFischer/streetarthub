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

    const response = await setPost({
      title: "Untitled Post",
      approved: false,
      author: {
        id: user.id,
        name: user.name,
        avatar: user.image,
      }
    })

    setIsLoading(false)

     if (!response) {
       return toast({
         title: "Something went wrong.",
         description: "Your post was not created. Please try again.",
         variant: "destructive",
       })
     }
 
     // This forces a cache invalidation.
     router.refresh()
 
     router.push(`/editor/${response}`)
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